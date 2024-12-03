import { Router } from "express";
import { login, signup, refreshTokens } from "./controller";
import { protect } from "./middleware";

const router: Router = Router();

router.post("/login", login);
router.post("/register", signup);
router.post("/refresh-token", refreshTokens);

router.get("/protect", protect);

export { router };
