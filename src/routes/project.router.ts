import { Router } from "express";
import multer from "multer";
import { getAllProjects, createProject, updateProject, deleteProject } from "../controllers/project.controller";

const upload = multer();
const router = Router();

router.get("/", getAllProjects);

router.post("/", upload.single("image"), createProject);

router.put("/:id", upload.single("image"), updateProject);

router.delete("/:id", deleteProject);

export default router;
