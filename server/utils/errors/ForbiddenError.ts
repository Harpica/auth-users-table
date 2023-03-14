import HttpError from './HttpError';

class ForbiddenError extends HttpError {
  constructor(message = 'Access is forbidden') {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
