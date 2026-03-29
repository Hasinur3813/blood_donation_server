/**
 * Standard API response wrapper
 * @param {boolean} success - Indicates if the request was successful
 * @param {string} message - Response message
 * @param {any} data - Response data
 * @returns {object} - Formatted response object
 */
const apiResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
  };
};

module.exports = apiResponse;
