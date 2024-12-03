import express, { NextFunction, Request, Response, Router } from "express";
import {
  getAUser,
  getAllUsers,
  updateAUser,
  deleteAUser,
  createAUser,
} from "./controller";
import { SubscribeEvent } from "../event";

const router: Router = Router();

router.route("/").get(getAllUsers).post(createAUser);
router.route("/:id").get(getAUser).put(updateAUser).delete(deleteAUser);

router.post("/events", (req: Request, res: Response, next: NextFunction) => {
  const { payload } = req.body;
  SubscribeEvent(payload);
  console.log("Event received: auth");
  res.status(200).json({
    status: "success",
  });
});

export { router };
