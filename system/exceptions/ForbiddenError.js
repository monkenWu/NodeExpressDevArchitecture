class Forbidden extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 403;
      this.status = 'fail';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = Forbidden;