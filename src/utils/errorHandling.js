// src/utils/errorHandling.js

/**
 * Parses and formats YouTube API error responses.
 * @param {Error} error - The error object from the API.
 * @returns {string} A user-friendly error message.
 */
function parseYouTubeError(error) {
  if (error.response && error.response.data && error.response.data.error) {
    const apiError = error.response.data.error;
    let errorMessage = `YouTube API Error: ${apiError.code} - ${apiError.message}`;

    if (apiError.errors && apiError.errors.length > 0) {
      // Add specific error details if available
      apiError.errors.forEach(err => {
        errorMessage += `\n  - ${err.message}`;
      });
    }
    return errorMessage;
  } else if (error.message) {
    return `An unexpected error occurred: ${error.message}`;
  } else {
    return 'An unknown error occurred.';
  }
}

/**
 * Handles API errors and provides user-friendly messages.
 * @param {Error} error - The error object.
 * @param {string} functionName - The name of the function where the error occurred.
 * @returns {string} A user-friendly error message.
 */
function handleApiError(error, functionName) {
    let errorMessage = `Error in ${functionName}: `;

    if (error.response && error.response.data && error.response.data.error) {
        const apiError = error.response.data.error;
        errorMessage += `${apiError.code} - ${apiError.message}`;

        if (apiError.errors && apiError.errors.length > 0) {
            errorMessage += ":\n";
            apiError.errors.forEach(err => {
                errorMessage += `  - ${err.message}\n`;
            });
        }
    } else if (error.message) {
        errorMessage += error.message;
    } else {
        errorMessage += 'An unknown error occurred.';
    }

    console.error(errorMessage);
    return errorMessage;
}

/**
 * Handles unexpected errors and provides a generic message.
 * @param {Error} error - The error object.
 * @returns {string} A generic error message.
 */
function handleUnexpectedError(error) {
  console.error('An unexpected error occurred:', error);
  return 'An unexpected error occurred. Please try again later.';
}

export { parseYouTubeError, handleApiError, handleUnexpectedError };