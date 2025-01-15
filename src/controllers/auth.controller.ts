import type { NextFunction, Request, Response } from "express";
import type { UserInterface } from "../models/user.model";
import { oAuthUrl, oAuth2Client } from "../config/GOAuth";
import { google } from "googleapis";
import { ErrorResponse } from "../utils/ErrorResponse";
import { successResponse } from "../utils/response";
import UserCollection from "../models/user.model";
import { generateToken } from "../utils/token";

export const login = (req: Request, res: Response) => {
	res.redirect(oAuthUrl);
};

export const loginCallback = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { code } = req.query;

		const { tokens } = await oAuth2Client.getToken(code as string);

		oAuth2Client.setCredentials(tokens);

		const oauth2 = google.oauth2({
			version: "v2",
			auth: oAuth2Client
		});

		const { data } = await oauth2.userinfo.get();

		const user = await UserCollection.findByField("email", "==", data.email).then((user: UserInterface | null) => {
			if (!user) {
				throw new ErrorResponse(400, "Email not registered");
			}
			return user;
		});

		const token = generateToken(user);

		successResponse(res, 200, "Login successful", { token });
	} catch (err) {
		next(err);
	}
};
