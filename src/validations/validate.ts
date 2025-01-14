import Joi from "joi";
import { ErrorResponse } from "../utils/ErrorResponse";

export const validate = (schema: Joi.ObjectSchema | any, data: any) => {
	const { error } = schema.validate(data);
	if (error) {
		throw new ErrorResponse(400, error.message);
	}
};
