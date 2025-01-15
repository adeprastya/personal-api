import { Router } from "express";
import { login, loginCallback } from "../controllers/auth.controller";

const router = Router();

router.get("/google", login);

router.get("/google/callback", loginCallback);

export default router;
