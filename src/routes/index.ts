import express from "express";
import type { Request, Response } from "express";
import authRouter from "./auth.router";
import projectRouter from "./project.router";
import { successResponse } from "../utils/response";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", (req: Request, res: Response): any =>
	successResponse(res, 200, "Server is running", { status: "OK", timestamp: new Date() })
);

router.use("/auth", authRouter);

router.use("/projects", authMiddleware, projectRouter);

export default router;
