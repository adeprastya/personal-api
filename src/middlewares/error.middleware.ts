import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";
import { ErrorResponse } from "../utils/ErrorResponse";

const errorMiddleware = (err: ErrorResponse | Error, req: Request, res: Response, next: NextFunction): void => {
	console.error(err);

	if (err instanceof ErrorResponse) {
		errorResponse(res, err.statusCode, err.message);
	} else {
		errorResponse(res, 500, "Internal Server Error");
	}
};

export default errorMiddleware;
