import type { NextFunction, Request, Response } from "express";
import type { UserInterface } from "../models/user.model";
import { oAuthUrl, oAuth2Client } from "../config/GOAuth";
import { google } from "googleapis";
import { ErrorResponse } from "../utils/ErrorResponse";
import UserCollection from "../models/user.model";
import { generateToken } from "../utils/token";

const FE_URL = process.env.FE_URL;
if (!FE_URL) {
	throw new Error("Environment variable FE_URL is not defined");
}

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

		res.redirect(FE_URL + `?success=true&message=Login successful&token=${token}`);
	} catch (err) {
		res.redirect(FE_URL + `?success=false&message=${(err as ErrorResponse).message}`);
	}
};
