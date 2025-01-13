import express from "express";
import type { Request, Response } from "express";
import projectRouter from "./project";
import { successResponse } from "../utils/response";

const router = express.Router();

router.get("/", (req: Request, res: Response): any =>
	successResponse(res, 200, "Server is running", { status: "OK", timestamp: new Date() })
);

router.use("/projects", projectRouter);

export default router;
