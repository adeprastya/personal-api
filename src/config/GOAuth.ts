import { google } from "googleapis";

if (!process.env.GOAUTH_CLIENT_ID) {
	throw new Error("Environment variable GOAUTH_CLIENT_ID is not defined");
}
if (!process.env.GOAUTH_CLIENT_SECRET) {
	throw new Error("Environment variable GOAUTH_CLIENT_SECRET is not defined");
}
if (!process.env.GOAUTH_REDIRECT_URL) {
	throw new Error("Environment variable GOAUTH_REDIRECT_URL is not defined");
}

export const oAuth2Client = new google.auth.OAuth2(
	process.env.GOAUTH_CLIENT_ID,
	process.env.GOAUTH_CLIENT_SECRET,
	process.env.GOAUTH_REDIRECT_URL
);

const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

const oAuthUrl = oAuth2Client.generateAuthUrl({
	access_type: "offline",
	scope: scopes,
	include_granted_scopes: true
});

export { oAuthUrl };
