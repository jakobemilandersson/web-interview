export class SellpyError extends Error {
  constructor(errorMessage, statusCode = 500, details = {}) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'SellpyError';
  }
}
