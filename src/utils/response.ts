import type { Response } from "express";

export const errorResponse = (
	res: Response,
	statusCode: number = 500,
	message: string = "An error occurred"
): Response => {
	return res
		.status(statusCode)
		.json({
			success: false,
			message
		})
		.end();
};

export const successResponse = <T>(
	res: Response,
	statusCode: number = 200,
	message: string = "Processed successfully",
	data: T | null = null
): Response => {
	if (data === null) {
		return res.status(statusCode).json({ success: true, message }).end();
	}

	return res
		.status(statusCode)
		.json({
			success: true,
			message,
			data
		})
		.end();
};
