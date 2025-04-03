// src/youtube/auth.js

import { google } from 'googleapis';
import { parseYouTubeError } from '../utils/errorHandling.js';
import fs from 'fs';
import path from 'path';
import open from 'open'; // Import the 'open' package to open URLs in the browser

// Authorization URL constants
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json'); // Define the path to credentials.json

let oAuth2Client; // Store the OAuth2 client
let accessToken;

function loadCredentialsFromEnv() {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
    const scopes = process.env.YOUTUBE_SCOPES ? process.env.YOUTUBE_SCOPES.split(',') : null;

    if (!clientId || !clientSecret || !redirectUri || !scopes) {
        const missingVars = [];
        if (!clientId) missingVars.push('YOUTUBE_CLIENT_ID');
        if (!clientSecret) missingVars.push('YOUTUBE_CLIENT_SECRET');
        if (!redirectUri) missingVars.push('YOUTUBE_REDIRECT_URI');
        if (!scopes) missingVars.push('YOUTUBE_SCOPES');

        console.warn(`Missing environment variables for YouTube API: ${missingVars.join(', ')}.  Attempting to load from credentials.json...`);
        return null;
    }

    return {
        clientId,
        clientSecret,
        redirectUri,
        scopes,
    };
}

function loadCredentialsFromFile() {
    try {
        const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
        const credentials = JSON.parse(content).web;

        if (!credentials || !credentials.client_id || !credentials.client_secret || !credentials.redirect_uris || !credentials.redirect_uris.length) {
            console.error('Invalid credentials.json format or missing required fields.');
            return null;
        }

        const scopes = process.env.YOUTUBE_SCOPES ? process.env.YOUTUBE_SCOPES.split(',') : [];
        if (!scopes || scopes.length === 0) {
            console.error('Scopes not defined in .env. Please set the YOUTUBE_SCOPES environment variable.');
            return null; // Return null to indicate that credentials are not available
        }

        return {
            clientId: credentials.client_id,
            clientSecret: credentials.client_secret,
            redirectUri: credentials.redirect_uris[0], // Assuming one redirect URI
            scopes: scopes,
        };
    } catch (error) {
        console.error('Error loading credentials from credentials.json:', error.message);
        return null;
    }
}

function loadCredentials() {
    let credentials = loadCredentialsFromEnv();
    if (!credentials) {
        credentials = loadCredentialsFromFile();
    }

    if (credentials && (!credentials.scopes || credentials.scopes.length === 0)) {
        console.error('YouTube API scopes are required. Please specify scopes in the YOUTUBE_SCOPES environment variable or credentials.json.');
        return null;
    }

    return credentials;
}

function getOAuth2Client() {
    if (!oAuth2Client) {
        const credentials = loadCredentials();
        if (!credentials) {
            throw new Error("Missing YouTube API credentials. Please ensure the necessary environment variables (YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI, and YOUTUBE_SCOPES) are set, or that credentials.json is correctly configured.");
        }

        oAuth2Client = new google.auth.OAuth2(
            credentials.clientId,
            credentials.clientSecret,
            credentials.redirectUri
        );
    }
    return oAuth2Client;
}

function generateAuthUrl() {
    const credentials = loadCredentials();
    if (!credentials) {
        return null;
    }
    const oAuth2Client = getOAuth2Client();
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: credentials.scopes,
        prompt: 'consent',
    });
    return authUrl;
}

function initiateAuth() {
    return generateAuthUrl(); // Return the URL to allow the server to redirect.
}

async function handleAuthCode(authorizationCode) {
    try {
        const oAuth2Client = getOAuth2Client();
        const { tokens } = await oAuth2Client.getToken(authorizationCode);
        oAuth2Client.setCredentials(tokens); // Set the credentials on the client.

        // Store tokens in local storage, including the refresh token
        localStorage.setItem('youtube_tokens', JSON.stringify(tokens));

        return tokens;

    } catch (error) {
        console.error('Error exchanging auth code for tokens:', error);
        throw parseYouTubeError(error);  // Re-throw the parsed error for handling in the UI
    }
}

async function refreshAccessToken(refreshToken) {
    const oAuth2Client = getOAuth2Client();
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    try {
        const { tokens } = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials(tokens); // Update credentials with the new tokens.
        // Update tokens in local storage
        const storedTokens = JSON.parse(localStorage.getItem('youtube_tokens'));
        const updatedTokens = { ...storedTokens, ...tokens };
        localStorage.setItem('youtube_tokens', JSON.stringify(updatedTokens));
        return tokens.access_token;

    } catch (error) {
        console.error("Error during token refresh:", error);
        // Clear tokens if refresh fails.
        localStorage.removeItem('youtube_tokens'); // Ensure tokens are cleared on refresh failure
        throw error; // Re-throw the error for handling by the caller
    }
}

async function authenticate() {
    const oAuth2Client = getOAuth2Client();
    let tokens;

    try {
        // Attempt to get stored tokens (e.g., from localStorage).
        const storedTokens = JSON.parse(localStorage.getItem('youtube_tokens'));

        if (storedTokens && storedTokens.refresh_token) {
            // Use the refresh token to get new access token if we have them.
            oAuth2Client.setCredentials(storedTokens);
            try {
                const accessToken = await refreshAccessToken(storedTokens.refresh_token);
                console.log("Access token refreshed successfully.");

                tokens = {
                    ...storedTokens,
                    access_token: accessToken,
                }

                oAuth2Client.setCredentials(tokens) // Update credentials with the refreshed access token.

            } catch (refreshError) {
                // Handle refresh token failure.  This might mean the user needs to re-authenticate.
                console.error("Error refreshing token.  User likely needs to re-authenticate.", refreshError);
                // Clear the tokens and initiate re-authentication.  Important!
                localStorage.removeItem('youtube_tokens');
                //The following line is optional and depends on what you want the user to see.
                // initiateAuth();  // This would redirect the user.  Consider how you want to handle this in your UI.
                throw refreshError; // Re-throw the error so it can be handled in the UI
            }
        }

        // Return the client, now possibly authenticated.
        return { client: oAuth2Client, tokens: storedTokens };

    } catch (error) {
        console.error("Authentication Error:", error);
        throw error; // Re-throw the error for handling in the UI
    }
}

async function getAccessToken() {
    try {
        // 1. Check for existing access token.
        if (accessToken) {
            return accessToken;
        }

        // 2. Authenticate (handles refresh token if available, or prompts for authorization).
        const { client, tokens } = await authenticate();

        // 3. If we have tokens (either refreshed or newly obtained), extract the access token.
        if (tokens && tokens.access_token) {
            accessToken = tokens.access_token; // Store the access token for later use
            return accessToken;
        }

        // 4. If we *don't* have an access token after authentication, this is an error.
        throw new Error('Failed to obtain access token after authentication.');


    } catch (error) {
        console.error('Error getting access token:', error);
        throw parseYouTubeError(error); // Return a user-friendly error
    }
}

export { loadCredentials, generateAuthUrl, initiateAuth, handleAuthCode, refreshAccessToken, authenticate, getAccessToken };