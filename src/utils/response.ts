import type { Response } from "express";

interface ApiResponse {
	success: boolean;
	message: string;
	data?: unknown | null;
}

export const errorResponse = (
	res: Response,
	statusCode: number = 500,
	message: string = "An error occurred"
): Response => {
	const response: ApiResponse = {
		success: false,
		message
	};

	return res.status(statusCode).json(response).end();
};

export const successResponse = <T>(
	res: Response,
	statusCode: number = 200,
	message: string = "Processed successfully",
	data: T | null = null
): Response => {
	const response: ApiResponse = {
		success: true,
		message,
		data
	};

	return res.status(statusCode).json(response).end();
};
