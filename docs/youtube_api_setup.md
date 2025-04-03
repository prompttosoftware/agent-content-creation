# Enabling the YouTube Data API v3 and Creating OAuth 2.0 Client IDs

This guide will walk you through the process of enabling the YouTube Data API v3 and creating OAuth 2.0 Client IDs within the Google Cloud Console. These Client IDs are necessary to authenticate your application and access YouTube data on behalf of a user.

## Prerequisites

*   A Google Account.
*   Sufficient permissions to access and manage a Google Cloud project.

## Steps

1.  **Access the Google Cloud Console:**
    *   Open a web browser and navigate to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Sign in with your Google account.

2.  **Select or Create a Project:**
    *   If you have existing projects, select the project you want to use from the project selector dropdown at the top of the page (usually in the header).
    *   If you don't have a project or want to create a new one:
        *   Click the project selector dropdown.
        *   Click "New Project."
        *   Give your project a name (e.g., "My YouTube App").
        *   Choose an organization (if applicable) and click "Create."  Wait for the project to be created.

3.  **Enable the YouTube Data API v3:**
    *   In the Google Cloud Console, use the search bar at the top and type "API & Services". Select "APIs & Services".
    *   Click "+ ENABLE APIS AND SERVICES".
    *   In the search bar, type "YouTube Data API v3" and press Enter.
    *   Select "YouTube Data API v3" from the search results.
    *   Click the "Enable" button.  Wait for the API to enable.

4.  **Create OAuth 2.0 Client IDs:**
    *   In the left navigation menu, click "Credentials".
    *   Click "+ CREATE CREDENTIALS" and select "OAuth client ID".
    *   You'll be prompted to configure the OAuth consent screen if you haven't already done so. Click "Configure Consent Screen".
        *   Choose the User Type: Select either "External" (for general public use) or "Internal" (for users within your Google Workspace organization). Click "Create".
        *   **OAuth Consent Screen Configuration (Required if this is your first time):**
            *   **App Name:** Enter a descriptive name for your application (e.g., "My YouTube Data App").
            *   **User support email:** Select your email address.
            *   **App logo (optional):** Upload an optional logo.
            *   **Authorized domains:** Click "+ Add Domain", and enter the domain(s) where your application is hosted (e.g., example.com).  This step is essential for certain OAuth flows.  For local testing, you might use `localhost`.  You might also use the specific domain where you host the application, or any subdomains.
            *   **Developer contact information:** Enter your email address.
            *   Click "Save and Continue".
        *   **Scopes:**  On the "Scopes" page, click "Add or Remove Scopes" and add the appropriate scopes based on your application's needs. Common scopes include:
            *   `https://www.googleapis.com/auth/youtube.readonly` (for read-only access to public YouTube data, such as searching videos, getting channel information)
            *   `https://www.googleapis.com/auth/youtube.force-ssl` (allows access to YouTube features that require SSL)
            *   `https://www.googleapis.com/auth/youtube` (for full access, including uploading videos, managing playlists, and interacting with user data.  **Use with caution and only when necessary.**)
            *   `https://www.googleapis.com/auth/youtubepartner` (for partner accounts only, gives additional partner-specific access)
            *   `https://www.googleapis.com/auth/youtube.channel.members.readonly` (for reading channel member lists)
            *   You can find the full list of scopes on the official [YouTube Data API documentation](https://developers.google.com/youtube/v3/guides/authorization).
            *   Click "Update".
            *   Click "Save and Continue".
        *   **Test users (Optional, for "External" app type):** Add any test users here to give them the access while your app is still in testing.
        *   Click "Save and Continue".
        *   Click "Back to Dashboard".
    *   After configuring the consent screen, return to the "Credentials" page.  Click "+ CREATE CREDENTIALS" and select "OAuth client ID".
    *   **Choose an Application Type:**
        *   Select the application type that matches your application:
            *   "Web application" (for web applications running in a browser)
            *   "Desktop app" (for desktop applications)
            *   "Android" (for Android applications)
            *   "iOS" (for iOS applications)
            *   "TVs and Limited Input devices"
        *   **Web Application Configuration (Example):**
            *   **Name:**  Give your Client ID a descriptive name (e.g., "My Web App Client ID").
            *   **Authorized JavaScript origins:** Enter the origin(s) of your web application.  This should be the URL of your website or web app (e.g., `http://localhost:8080`, `https://www.example.com`).  If you have multiple origins, add each one.
            *   **Authorized redirect URIs:** Enter the redirect URI(s) for your application.  This is the URL where the user will be redirected after they authorize your app.  Common values include `http://localhost:8080/oauth2callback` or `https://www.example.com/oauth2callback`. Make sure this matches the callback URI set in your application's code.
        *   **Desktop App Configuration (Example):**
            *   **Name:** Give your Client ID a descriptive name (e.g., "My Desktop App Client ID").
            *   **Authorized redirect URIs:**  For desktop apps, you typically use `urn:ietf:wg:oauth:2.0:oob` (out-of-band) for the redirect URI, or a custom scheme (e.g., `myapp://oauth2callback`).
        *   **Android App Configuration (Example):**
            *   Requires your Android app's package name and SHA-1 signing certificate fingerprint.
        *   **iOS App Configuration (Example):**
            *   Requires your app's bundle identifier.
        *   Click "Create".

5.  **Download Credentials (credentials.json):**
    *   After creating the Client ID, you will see a list of your Client IDs.
    *   Click on the Client ID you just created.
    *   In the "OAuth 2.0 Client IDs" section, click the "Download JSON" button.  This will download a file named `credentials.json`.  This file contains your client ID, client secret, and other important information.

6.  **Securely Store `credentials.json`:**

    **It is crucial to protect this file.**  The `credentials.json` file contains sensitive information that, if compromised, could allow unauthorized access to your application and user data.  **Never commit this file directly to your version control system (e.g., Git).**

    There are several ways to securely store and access the credentials:

    *   **Environment Variables:**
        *   The most common and recommended approach.
        *   Set environment variables on your server or development machine.  You can extract the client ID and client secret from the `credentials.json` file and set environment variables like `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET`.
        *   In your application code, access these variables using your programming language's environment variable functions (e.g., `os.environ.get("YOUTUBE_CLIENT_ID")` in Python).
    *   **Configuration Files:**
        *   Create a configuration file (e.g., `config.ini`, `config.yaml`) and store the client ID, client secret, and any other necessary configuration options in the file.
        *   Make sure to *exclude* this configuration file from your version control system.
        *   Load the configuration file at runtime in your application.
        *   Consider encrypting the configuration file for extra security.
    *   **Secret Management Services:**
        *   For production environments, use a dedicated secret management service like Google Cloud Secret Manager, AWS Secrets Manager, or Azure Key Vault. These services provide secure storage, access control, and versioning for your secrets.

7.  **Integrate the API into Your Application:**

    *   Use a YouTube Data API client library (e.g., the Google API Client Library for Python, or the Google API Client Library for Java). These libraries simplify the process of authenticating and making API requests.
    *   Your code will read the credentials (either from the `credentials.json` file *if you're only doing local testing* and not committing it to version control, or, more commonly, using environment variables or a config file), and then use the client library to authenticate and call the API.
    *   Follow the documentation for your chosen API client library to make API requests to the YouTube Data API v3.

**Example (Python, using environment variables):**