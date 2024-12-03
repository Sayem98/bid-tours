interface IAppErrorArgs {
  message: string;
  statusCode: number;
  path?: string; // Optional path
  value?: string; // Optional value
}
class AppError extends Error {
  public status: string;
  public statusCode: number;
  public isOperational: boolean;
  public path?: string;
  public value?: string;

  constructor({ message, statusCode, path, value }: IAppErrorArgs) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.path = path;
    this.value = value;

    // Error.captureStackTrace(this, this.constructor); // why?
  }
}

export { AppError, IAppErrorArgs };
