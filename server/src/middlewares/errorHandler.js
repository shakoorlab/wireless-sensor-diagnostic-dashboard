// Centralized error formatter. Show stack only in non-prod.
export default function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const payload = {
    error: err.message || 'Internal Server Error',
    code: err.code,
    requestId: req.id
  };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }
  // Log server-side for CloudWatch/console
  console.error(`[${req.id}] ${req.method} ${req.originalUrl} -> ${status}`, err);
  res.status(status).json(payload);
}
