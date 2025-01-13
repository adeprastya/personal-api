import type { Request, Response, NextFunction } from "express";
import type { ProjectInterface } from "../models/Project";
import ProjectCollection from "../models/Project";
import { generateId, timestampToReadable } from "../utils/helper";
import { successResponse } from "../utils/response";
import { storeImage } from "../services/cloudStorage";
import { ErrorResponse } from "../utils/ErrorResponse";

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
		// const { title, description, technologies, site_url, source_code_url, demo_url } = req.body;
		const reqBody = req.body;

		// ------- Validate req
		if (!req.file) {
			throw new ErrorResponse(400, "Image file is required");
		}
		if (!reqBody.title || !reqBody.description || !reqBody.technologies) {
			throw new ErrorResponse(400, "Missing required fields");
		}
		let parsedTechnologies;
		try {
			parsedTechnologies = JSON.parse(reqBody.technologies);
		} catch (error) {
			throw new ErrorResponse(400, "Technologies must be a valid JSON array");
		}
		// -------------------------

		const id = generateId();
		const image_url = await storeImage(id, req.file);

		const data: ProjectInterface = {
			...reqBody,
			id,
			technologies: parsedTechnologies,
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

		// ------- Validate req
		if (!id) {
			throw new ErrorResponse(400, "Project ID is required");
		}
		if (reqBody.technologies) {
			try {
				reqBody.technologies = JSON.parse(reqBody.technologies);
			} catch (error) {
				throw new ErrorResponse(400, "Technologies must be a valid JSON array");
			}
		}
		// -------------------------

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

		// ------- Validate req
		if (!id || typeof id !== "string") {
			throw new ErrorResponse(400, "Project ID is required");
		}
		// -------------------------

		await ProjectCollection.delete(id);

		successResponse(res, 200, "Project deleted successfully");
	} catch (err) {
		next(err);
	}
};
