export class AppError extends Error {
  constructor(public override message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
  }
}
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests. Please slow down.') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}
export class DatabaseError extends AppError {
  constructor(message: string = 'A database error occurred') {
    super(message, 503);
    this.name = 'DatabaseError';
  }
}
export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}
export class RequestTimeoutError extends AppError {
  constructor(message: string = 'Request timed out') {
    super(message, 408);
    this.name = 'RequestTimeoutError';
  }
}
export class NotImplementedError extends AppError {
  constructor(message: string = 'Not implemented') {
    super(message, 501);
    this.name = 'NotImplementedError';
  }
}