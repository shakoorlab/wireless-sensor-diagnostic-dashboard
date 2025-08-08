// Wrap async route handlers so thrown/rejected errors hit your error handler.
export default function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
