/* eslint-disable-next-line no-unused-vars */
export function errorHandler(err, req, res, _next) {
  console.error(err.stack);
  const {
    status = 500,
    message = 'Unrecognized Internal Server Error',
    details = {}
  } = err;

  res.status(status).json({ error: message, details });
}
