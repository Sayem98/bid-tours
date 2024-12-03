import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../module.error/appError";
import { User } from "../module.user/models/User";

function verifyTokenAsync(token: string, secret: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    // 1) Getting the token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log("Token is there");
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
    }
    // 2) Check if token is there
    if (!token) {
      return next(
        new AppError({
          message: "You are not logged in! Please log in to get access.",
          statusCode: 401,
        })
      );
    }

    // 3) Verification token
    if (!process.env.JWT_SECRET) {
      return next(
        new AppError({
          message: "Internal server error",
          statusCode: 500,
        })
      );
    }
    const decoded: any = await verifyTokenAsync(token, process.env.JWT_SECRET);

    // 4) Check if user still exists
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
      return next(
        new AppError({
          message: "The user belonging to this token does no longer exist.",
          statusCode: 401,
        })
      );
    }

    // 5) Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError({
          message: "User recently changed password! Please log in again.",
          statusCode: 401,
        })
      );
    }

    next();
  }
);

export { protect };
