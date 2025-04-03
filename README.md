## Configuration

This project uses environment variables for sensitive information such as the YouTube API key.

### Setting Environment Variables

There are a few ways to set environment variables:

1.  **Using a `.env` file:**  (Recommended for local development, DO NOT commit this file)
    *   Create a file named `.env` in the root directory of the project.
    *   Add your variables in the format `VARIABLE_NAME=value`.
    *   Example:
        ```
        YOUTUBE_API_KEY=YOUR_API_KEY
        ```
    *   **Important:**  Add `.env` to your `.gitignore` file to prevent accidental commits of sensitive information.

2.  **Setting environment variables directly in your terminal:**
    *   For Linux/macOS:
        ```bash
        export YOUTUBE_API_KEY=YOUR_API_KEY
        ```
    *   For Windows:
        ```cmd
        set YOUTUBE_API_KEY=YOUR_API_KEY
        ```

3.  **Using a configuration file (alternative to `.env` but can be less secure if not handled carefully):**
    *   Create a configuration file (e.g., `config.js` or `config.json`) to store your configuration settings.
    *   Load the configuration file in your application.
    *   **Warning:** Be extremely careful to avoid accidentally committing your configuration file if it contains sensitive information. Consider encrypting the file or using environment variables instead.

### Example: Accessing the YouTube API Key

In your JavaScript code, you can access the environment variable like this:

```javascript
const apiKey = process.env.YOUTUBE_API_KEY;

if (!apiKey) {
  console.error('YouTube API key not found. Please set the YOUTUBE_API_KEY environment variable.');
} else {
  // Use the API key for YouTube API calls
  console.log('API Key found');
}
```

### Security Warning

**Never commit your `.env` file or any configuration file containing sensitive information (API keys, passwords, etc.) to your repository.** Doing so exposes your credentials and can lead to security breaches. Always add these files to your `.gitignore`.