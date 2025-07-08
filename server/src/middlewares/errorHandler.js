export default function errorHandler(err, req, res, next) {
  console.error(err); // In prod you’d send this to CloudWatch or Sentry
  const status = err.response?.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
}
