import { Request, Response, NextFunction } from "express";
import { User } from "./models/User";
import { createUser } from "./services";
import { catchAsync } from "../utils/catchAsync";
import type { IUserInput } from "./models/User";
import { AppError } from "../module.error/appError";

const createAUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await createUser(req.body as IUserInput);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

const getAUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(new AppError({ message: "User not found", statusCode: 400 }));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

const updateAUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
});

const deleteAUser = catchAsync(async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export { getAUser, getAllUsers, updateAUser, deleteAUser, createAUser };
