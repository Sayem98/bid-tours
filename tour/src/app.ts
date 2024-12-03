import express, { NextFunction, Request, Response } from "express";
import axois from "axios";
import { AppError } from "./module.error/appError";
import { globalErrorHandler } from "./module.error/errorController";

const app = express();

app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form data

app.get(
  "/api/v1/tours",
  async (req: Request, res: Response, next: NextFunction) => {
    // Send event to auth
    axois.post("http://localhost:3000/users/events", {
      payload: {
        event: "ADD_TO_WISHLIST",
        data: {
          userId: "123",
          tour: "456",
        },
      },
    });
    res.json({
      status: "success",
      message: "Hello from tour",
    });
  }
);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError({
      message: `Can't find ${req.originalUrl} on this server!`,
      statusCode: 404,
    })
  );
});

app.use(globalErrorHandler);

export { app };
