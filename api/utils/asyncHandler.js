/**
 * Async handler to wrap async route handlers
 * Catches errors and passes them to error handling middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  if (typeof next !== 'function') {
    console.error('CRITICAL ERROR: next is not a function in asyncHandler!', {
      method: req.method,
      url: req.originalUrl,
      nextType: typeof next,
    });
  }
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
