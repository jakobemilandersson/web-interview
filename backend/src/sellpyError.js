export class SellpyError extends Error {
    constructor(errorMessage, statusCode = 500) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.name = "SellpyError";
    }
}
