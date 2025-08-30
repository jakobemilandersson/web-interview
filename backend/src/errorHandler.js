export function errorHandler(err, _, res) {
  console.error(err.stack);
  const { status, message } = err || { status: 500, message: 'Unrecognized Internal Server Error' };

  res.status(status).json({ error: message });
}
