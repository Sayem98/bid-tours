import express, { NextFunction, Request, Response, Router } from "express";
import {
  getAUser,
  getAllUsers,
  updateAUser,
  deleteAUser,
  createAUser,
} from "./controller";

const router: Router = Router();

router.route("/").get(getAllUsers).post(createAUser);
router.route("/:id").get(getAUser).put(updateAUser).delete(deleteAUser);

export { router };
