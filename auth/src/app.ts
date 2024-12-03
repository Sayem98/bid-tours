import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import { AppError } from "./module.error/appError";
import { globalErrorHandler } from "./module.error/errorController";

const app = express();

app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form data

app.use("/api/v1", router);

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
