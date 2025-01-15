import jwt from "jsonwebtoken";
import { ErrorResponse } from "./ErrorResponse";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
	throw new Error("Environment variable JWT_SECRET_KEY is not defined");
}

export const generateToken = (data: any) => {
	const token = jwt.sign(data, JWT_SECRET_KEY, { algorithm: "HS256", expiresIn: "1d" });

	if (!token) {
		throw new ErrorResponse(500, "Failed generating token");
	}

	return token;
};

export const decodeToken = (token: string) => {
	const result = jwt.verify(token, JWT_SECRET_KEY);

	if (!result) {
		throw new ErrorResponse(401, "Invalid token");
	}

	return result;
};
