import { Router } from "express";
import multer from "multer";
import { getAllProjects, createProject, updateProject, deleteProject } from "../controllers/project.controller";
import authMiddleware from "../middlewares/auth.middleware";

const upload = multer();
const router = Router();

router.get("/", getAllProjects);

router.post("/", authMiddleware, upload.single("image"), createProject);

router.put("/:id", authMiddleware, upload.single("image"), updateProject);

router.delete("/:id", authMiddleware, deleteProject);

export default router;
