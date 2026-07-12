// Wraps async route handlers so thrown errors/rejected promises reach the
// centralized error middleware instead of crashing the process.
const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export default asyncHandler;
