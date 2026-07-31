export class AppError extends Error {
  public readonly statusCode: number;

  public readonly details?: Record<
    string,
    unknown
  >;

  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    details?: Record<string, unknown>,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Object.setPrototypeOf(
      this,
      AppError.prototype,
    );

    Error.captureStackTrace?.(
      this,
      this.constructor,
    );
  }
}