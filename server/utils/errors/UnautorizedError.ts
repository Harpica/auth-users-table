import HttpError from './HttpError';

class UnauthorizedError extends HttpError {
  constructor(message = 'Authorization is required') {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
