import { Router } from "express";
import { router as userRoutes } from "./module.user/routes";
import { router as authRoutes } from "./module.auth/routes";

const router: Router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export { router };
