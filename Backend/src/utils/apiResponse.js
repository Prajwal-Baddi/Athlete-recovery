/**
 * Standardized API response helpers.
 * All endpoints MUST use these to ensure consistent shape
 * across the entire platform and future AI modules.
 */

/**
 * Send a success response.
 * @param {Response} res - Express response object
 * @param {string}   message - Human-readable success message
 * @param {*}        data    - Response payload
 * @param {number}   statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

/**
 * Send a created (201) response.
 */
const sendCreated = (res, message = 'Resource created', data = null) => {
  return sendSuccess(res, message, data, 201);
};

/**
 * Send an error response.
 * @param {Response} res
 * @param {string}   message
 * @param {number}   statusCode
 * @param {*}        errors - Optional validation errors array
 */
const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

/**
 * Send a paginated list response.
 */
const sendPaginated = (res, message = 'Success', data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = { sendSuccess, sendCreated, sendError, sendPaginated };
