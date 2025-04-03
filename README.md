## Configuration

This project uses environment variables for sensitive information such as the YouTube API key.

### Setting Environment Variables

There are a few ways to set environment variables:

1.  **Using a `.env` file:**  (Recommended for local development, DO NOT commit this file)
    *   Create a file named `.env` in the root directory of the project.
    *   Add your variables in the format `VARIABLE_NAME=value`.
    *   Example:
        ```
        REACT_APP_YOUTUBE_API_KEY=YOUR_API_KEY
        REACT_APP_YOUTUBE_CLIENT_ID=YOUR_CLIENT_ID
        REACT_APP_YOUTUBE_CLIENT_SECRET=YOUR_CLIENT_SECRET
        REACT_APP_YOUTUBE_REDIRECT_URI=YOUR_REDIRECT_URI
        ```
    *   **Important:**  Add `.env` to your `.gitignore` file to prevent accidental commits of sensitive information.

2.  **Setting environment variables directly in your terminal:**
    *   For Linux/macOS:
        ```bash
        export REACT_APP_YOUTUBE_API_KEY=YOUR_API_KEY
        export REACT_APP_YOUTUBE_CLIENT_ID=YOUR_CLIENT_ID
        export REACT_APP_YOUTUBE_CLIENT_SECRET=YOUR_CLIENT_SECRET
        export REACT_APP_YOUTUBE_REDIRECT_URI=YOUR_REDIRECT_URI
        ```
    *   For Windows:
        ```cmd
        set REACT_APP_YOUTUBE_API_KEY=YOUR_API_KEY
        set REACT_APP_YOUTUBE_CLIENT_ID=YOUR_CLIENT_ID
        set REACT_APP_YOUTUBE_CLIENT_SECRET=YOUR_CLIENT_SECRET
        set REACT_APP_YOUTUBE_REDIRECT_URI=YOUR_REDIRECT_URI
        ```

3.  **Using a configuration file (alternative to `.env` but can be less secure if not handled carefully):**
    *   Create a configuration file (e.g., `config.js` or `config.json`) to store your configuration settings.
    *   Load the configuration file in your application.
    *   **Warning:** Be extremely careful to avoid accidentally committing your configuration file if it contains sensitive information. Consider encrypting the file or using environment variables instead.

### Example: Accessing the YouTube API Key

In your JavaScript code, you can access the environment variable like this:

```javascript
const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

if (!apiKey) {
  console.error('YouTube API key not found. Please set the REACT_APP_YOUTUBE_API_KEY environment variable.');
} else {
  // Use the API key for YouTube API calls
  console.log('API Key found');
}
```

### Security Warning

**Never commit your `.env` file or any configuration file containing sensitive information (API keys, passwords, etc.) to your repository.** Doing so exposes your credentials and can lead to security breaches. Always add these files to your `.gitignore`.

## Troubleshooting

### Missing or Incorrect Environment Variables

*   **Symptom:** The application displays an error message stating that environment variables are missing.
*   **Solution:**
    1.  **Verify Environment Variables:** Double-check that you have set all required environment variables in your `.env` file or your terminal.  The required variables are:
        *   `REACT_APP_YOUTUBE_API_KEY`: Your YouTube API key (from the Google Cloud Console).
        *   `REACT_APP_YOUTUBE_CLIENT_ID`: Your OAuth 2.0 Client ID (from the Google Cloud Console).
        *   `REACT_APP_YOUTUBE_CLIENT_SECRET`: Your OAuth 2.0 Client Secret (from the Google Cloud Console).
        *   `REACT_APP_YOUTUBE_REDIRECT_URI`:  The URL where YouTube will redirect the user after authentication.  This **must** match the authorized redirect URI configured in your Google Cloud project.
    2.  **Check .env File (if used):**
        *   Ensure that the `.env` file is in the root directory of your project.
        *   Make sure the file is correctly formatted (e.g., `REACT_APP_YOUTUBE_API_KEY=YOUR_API_KEY`).
        *   Confirm that the `.env` file is **not** committed to your repository by checking your `.gitignore` file.
    3.  **Verify Variable Access:** Add a `console.log(process.env.REACT_APP_YOUTUBE_API_KEY)` statement to your code to confirm that the environment variable is being accessed correctly.  Restart your development server after making changes to your environment variables.
    4.  **If using `create-react-app`:** ensure that all environment variables begin with `REACT_APP_`.

### Authentication Issues

*   **Symptom:** The application fails to authenticate with YouTube.
*   **Solutions:**
    1.  **Redirect URI Mismatch:**  The `REACT_APP_YOUTUBE_REDIRECT_URI` in your code *must* exactly match the authorized redirect URI configured in your Google Cloud project (in the OAuth 2.0 Client IDs section).  Check for any typos or inconsistencies.  If you are testing locally, the redirect URI is often `http://localhost:3000` (or the port your development server is using).
    2.  **Permissions/Scopes:** Ensure that the YouTube account you are using has granted the necessary permissions to your application. Verify the scopes you've requested.
    3.  **API Key Restrictions:** Check the API key restrictions in the Google Cloud Console.  Ensure that the API key is enabled for the YouTube Data API v3.  Consider restricting the API key usage to your application's domain for security.
    4.  **Authentication Code:** If authentication completes, and you still can't upload, inspect the URL after the redirect. You should see a `code` parameter in the URL (e.g., `...?code=...`).  This code is required to exchange for an access token. If the local environment is difficult to manage, consider using a hosted URL to inspect the callback URL.
    5.  **CORS Errors:** CORS (Cross-Origin Resource Sharing) errors can prevent your application from making requests to the YouTube API. If you are getting CORS errors, you may need to configure your server to allow cross-origin requests or set up a proxy server.
    6.  **API Key Restrictions:** Ensure that the API key has no restrictions on the domains it can be used for, or make sure your local domain is added.
*   **Symptom:** The application fails to authenticate with YouTube, and the URL includes an error message.
*   **Solution:**
    1.  **Review the Error Message:** Read the full error message in the browser's console or in the authentication response. The error message may indicate the cause of the authentication failure (e.g., invalid client ID, invalid redirect URI, insufficient permissions).
    2.  **Check Configuration:** Verify that your client ID and client secret in the code match the values in your Google Cloud project.
    3.  **Review Scopes:** Make sure that you have requested the correct scopes for accessing the YouTube API (e.g., `https://www.googleapis.com/auth/youtube.upload` for uploading videos).
*   **Symptom:** The authentication code from the URL is not being handled correctly.
*   **Solution:**
    1.  **Inspect the URL:** After the redirect from YouTube, inspect the URL in your browser's address bar. It should contain a `code` parameter (e.g., `...?code=...`). If the code is missing, the authentication redirect is not set up correctly.
    2.  **Check URL Configuration:** Confirm that the `REACT_APP_YOUTUBE_REDIRECT_URI` is set correctly.

### Upload Errors

*   **Symptom:**  The video fails to upload to YouTube.
*   **Solutions:**
    1.  **File Size Limits:** YouTube has file size and duration limits.  Ensure your video file meets YouTube's requirements.
    2.  **Network Connection:** Check your internet connection.
    3.  **YouTube API Errors:**  Examine the error messages in the browser's console. Look for specific error codes or messages from the YouTube API. Refer to the YouTube API documentation for explanations of error codes and how to resolve them.
    4.  **File Type Support:** Ensure that the video file is in a supported format (e.g., MP4, MOV).
