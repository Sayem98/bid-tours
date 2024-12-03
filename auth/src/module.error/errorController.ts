import { Response, Request, NextFunction } from "express";
import { AppError } from "./appError";
import {
  productionError,
  developmentError,
  handleCastErrorDB,
  handleJWTError,
  handleJWTExpiredError,
} from "./utils";

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    developmentError(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError(err);
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError(err);
    productionError(error, res);
  }
};

export { globalErrorHandler };
