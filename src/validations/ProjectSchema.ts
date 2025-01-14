import Joi from "joi";

export const CreateProjectSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().required(),
	technologies: Joi.array().items(Joi.string()).required(),
	site_url: Joi.string().allow(null, "").uri().optional(),
	source_code_url: Joi.string().allow(null, "").uri().optional(),
	demo_url: Joi.string().allow(null, "").uri().optional()
});

export const UpdateProjectSchema = Joi.object({
	title: Joi.string().optional(),
	description: Joi.string().optional(),
	technologies: Joi.array().items(Joi.string()).optional(),
	site_url: Joi.string().allow(null, "").uri().optional(),
	source_code_url: Joi.string().allow(null, "").uri().optional(),
	demo_url: Joi.string().allow(null, "").uri().optional()
});

export const IdSchema = Joi.string().required().messages({
	"string.required": "Project ID is required"
});

export const ImageFileSchema = Joi.any().required().messages({
	"any.required": "Image is required"
});
