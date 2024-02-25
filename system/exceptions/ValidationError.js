class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 400;
      this.status = 'fail';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ValidationError;