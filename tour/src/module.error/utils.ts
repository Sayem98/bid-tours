import { Response } from "express";
import { AppError } from "./appError";
import { Error } from "mongoose";

const developmentError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const productionError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error to console or use any logger
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const handleCastErrorDB = (err: AppError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  err.message = message;
  return err;
};
// const handleCastErrorDB = (err: AppError) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError({ message, statusCode: 400 });
// };

const handleJWTError = (err: AppError) => {
  const message = "Invalid token. Please log in again!";
  err.message = message;
  return err;
};

const handleJWTExpiredError = (err: AppError) => {
  const message = "Your token has expired! Please log in again.";
  err.message = message;
  return err;
};

export {
  productionError,
  developmentError,
  handleCastErrorDB,
  handleJWTError,
  handleJWTExpiredError,
};
