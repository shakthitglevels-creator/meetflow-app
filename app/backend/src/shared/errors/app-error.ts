// Custom error used across the entire application
export class AppError extends Error {
  // HTTP status that should be returned to the client
  statusCode: number;

  constructor(message: string, statusCode: number) {
    // Give the error message to JavaScript's built-in Error class
    super(message);

    // Store the HTTP status code
    this.statusCode = statusCode;

    // Give the error the correct class name
    this.name = "AppError";

    // Fix the prototype chain after extending Error
    Object.setPrototypeOf(this, AppError.prototype);
  }
}