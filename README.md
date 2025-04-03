# Agent Content Creation

This project is for agent content creation.

## Environment Variables and Configuration

If you need to use sensitive information, such as YouTube API credentials, you should:

1.  **Never commit credentials directly to the repository.**
2.  Use environment variables or a configuration file.

### Using Environment Variables

*   Set environment variables in your shell or `.env` file.
*   Example: `export YOUTUBE_API_KEY=YOUR_API_KEY`

### Using a Configuration File

*   Create a configuration file (e.g., `config.json` or `config.yaml`).
*   Example:
    ```json
    {
      "youtubeApiKey": "YOUR_API_KEY"
    }
    ```
*   Load the configuration file in your code.

### Important Security Warning

*   **Do not commit any API keys or sensitive information to the repository.** This is a security risk.

## Running the application

### Local Development

```bash
npm install
npm start
```

