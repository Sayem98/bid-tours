import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { createUser, getUser } from "../module.user/services";
import { AppError } from "../module.error/appError";
import { Token } from "./model/token";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //create a new user
    const user = await createUser(req.body);
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: user,
      },
    });
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError({
          message: "Please provide email and password",
          statusCode: 400,
        })
      );
    }
    //check if email and password exist
    const user = await getUser(email, true);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError({
          message: "Invalid email or password",
          statusCode: 401,
        })
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      refreshToken,
      data: {
        user: user,
      },
    });
  }
);

const refreshTokens = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(
        new AppError({
          message: "Please provide refresh token",
          statusCode: 400,
        })
      );
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

    if (typeof decoded !== "object" || !("id" in decoded)) {
      return next(
        new AppError({
          message: "Invalid token payload",
          statusCode: 400,
        })
      );
    }
    const user = await getUser(decoded.id as string, false);

    if (!user) {
      return next(
        new AppError({
          message: "User not found",
          statusCode: 404,
        })
      );
    }

    // check if it is in the database token
    const userToken = await Token.findOne({
      user: user._id,
      token: refreshToken,
    });

    if (!userToken) {
      // delete all tokens
      await Token.deleteMany({ user: user._id });

      res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    } else {
      // update the token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      userToken.accessToken = token;
      await userToken.save();

      res.status(200).json({
        status: "success",
        message: "Token refreshed successfully",
        token: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        data: {
          user,
        },
      });
    }
  }
);

// count 1M
const count = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("1M");
    }, 10000);
  });
};

export { signup, login, refreshTokens };
