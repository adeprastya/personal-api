import type { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/ErrorResponse";
import { decodeToken } from "../utils/token";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { authorization } = req.headers;

		if (!authorization) {
			throw new ErrorResponse(400, "Authorization header is missing");
		}

		if (!authorization.startsWith("Bearer ")) {
			throw new ErrorResponse(400, "Invalid authorization header format");
		}

		decodeToken(authorization.split(" ")[1]);

		next();
	} catch (err) {
		next(err);
	}
};

export default authMiddleware;
