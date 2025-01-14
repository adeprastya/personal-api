import type { Request, Response, NextFunction } from "express";
import type { ProjectInterface } from "../models/Project";
import ProjectCollection from "../models/Project";
import { generateId, timestampToReadable } from "../utils/helper";
import { successResponse } from "../utils/response";
import { storeImage } from "../services/cloudStorage";
import { ErrorResponse } from "../utils/ErrorResponse";
import { CreateProjectSchema, ImageFileSchema, UpdateProjectSchema, IdSchema } from "../validations/ProjectSchema";
import { validate } from "../validations/validate";

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await ProjectCollection.findAll();

		const projects = result.map((project) => ({
			...project,
			created_at: timestampToReadable(project.created_at)
		}));

		successResponse(res, 200, "All projects retrieved successfully", projects);
	} catch (err) {
		next(err);
	}
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let reqBody = req.body.data;
		const reqFile = req.file;

		try {
			reqBody = JSON.parse(reqBody);
		} catch (err) {
			throw new ErrorResponse(400, "Data must be a valid JSON object");
		}

		validate(CreateProjectSchema, reqBody);
		validate(ImageFileSchema, reqFile);

		const id = generateId();
		const image_url = await storeImage(id, reqFile as Express.Multer.File);

		const data: ProjectInterface = {
			...reqBody,
			id,
			image_url,
			created_at: new Date().toISOString()
		};
		await ProjectCollection.create(data);

		successResponse(res, 201, "Project created successfully");
	} catch (err) {
		next(err);
	}
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const reqBody = req.body;

		validate(IdSchema, id);
		validate(UpdateProjectSchema, reqBody);

		const data: Partial<ProjectInterface> = {
			...reqBody
		};

		await ProjectCollection.update(id, data);

		successResponse(res, 200, "Project updated successfully");
	} catch (err) {
		next(err);
	}
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		validate(IdSchema, id);

		await ProjectCollection.delete(id);

		successResponse(res, 200, "Project deleted successfully");
	} catch (err) {
		next(err);
	}
};
