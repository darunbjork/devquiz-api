// Step 5: Define custom error classes for handling different types of errors in the application. These classes extend the built-in Error class and include additional properties, such as statusCode, to provide more context about the error. This allows for more structured error handling and better communication of error information to clients when exceptions occur in the application.
export class AppError extends Error {
  constructor(public override message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
