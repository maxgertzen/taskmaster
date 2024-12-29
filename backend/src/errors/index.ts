export class HttpError extends Error {
  private readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    public status: number,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
    this.statusCode = status;
    this.details = details;
  }

  get response() {
    return {
      status: this.statusCode,
      message: this.message,
      details: this.details,
    };
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message: string = "Service temporarily unavailable") {
    super(503, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(500, message, details);
  }
}

export class DatabaseError extends InternalServerError {
  constructor(
    message: string = "Database error occurred",
    details?: Record<string, unknown>,
    public readonly cause?: Error
  ) {
    super(message, details);
    if (cause) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

export class ValidationError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}
