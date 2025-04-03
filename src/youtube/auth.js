// src/youtube/auth.js

import { google } from 'googleapis';
import { parseYouTubeError } from '../utils/errorHandling.js';
import fs from 'fs';
import path from 'path';

// Authorization URL constants
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

let oAuth2Client; // Store the OAuth2 client

/**
 * Loads credentials from environment variables.
 * @returns {object | null} An object containing the YouTube client ID, client secret, redirect URI, and scopes, or null if the file is not found.
 */
function loadCredentials() {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
    const scopes = process.env.YOUTUBE_SCOPES ? process.env.YOUTUBE_SCOPES.split(',') : null; // Allow scopes to be passed as a comma-separated string

    if (!clientId || !clientSecret || !redirectUri || !scopes) {
        const missingVars = [];
        if (!clientId) missingVars.push('YOUTUBE_CLIENT_ID');
        if (!clientSecret) missingVars.push('YOUTUBE_CLIENT_SECRET');
        if (!redirectUri) missingVars.push('YOUTUBE_REDIRECT_URI');
        if (!scopes) missingVars.push('YOUTUBE_SCOPES');

        console.error(`Missing environment variables: ${missingVars.join(', ')}.  Please set these environment variables.`);
        return null;
    }

    return {
        clientId,
        clientSecret,
        redirectUri,
        scopes,
    };
}


/**
 * Creates and returns the OAuth2 client.  Initializes it if not already present.
 * @returns {google.auth.OAuth2} The OAuth2 client.
 */
function getOAuth2Client() {
    if (!oAuth2Client) {
        const credentials = loadCredentials();
        if (!credentials) {
            throw new Error("Missing YouTube API credentials. Please ensure the necessary environment variables (YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI, and YOUTUBE_SCOPES) are set.");
        }

        oAuth2Client = new google.auth.OAuth2(
            credentials.clientId,
            credentials.clientSecret,
            credentials.redirectUri
        );
    }
    return oAuth2Client;
}


/**
 * Generates the authorization URL.
 * @returns {string | null} The authorization URL or null if credentials are not available.
 */
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

/**
 * Redirects the user to the Google authorization server.
 * @returns {string | null} The authorization URL or null if credentials are not available.
 */
function initiateAuth() {
    return generateAuthUrl(); // Return the URL to allow the server to redirect.
}

/**
 * Handles the authorization response from Google.
 * @param {string} authorizationCode - The authorization code received from Google.
 * @returns {Promise<object>} An object containing the access and refresh tokens.
 */
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

/**
 * Refreshes the access token using the refresh token.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<string>} The new access token.
 * @throws {Error} If the token refresh fails.
 */
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

/**
 *  Authenticates the user and returns an authenticated OAuth2 client.
 *  Handles token refresh automatically.
 *  @returns {Promise<{client: google.auth.OAuth2, tokens: object | undefined}>}  An object containing the authenticated client and the tokens.
 */
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


export { loadCredentials, generateAuthUrl, initiateAuth, handleAuthCode, refreshAccessToken, authenticate };