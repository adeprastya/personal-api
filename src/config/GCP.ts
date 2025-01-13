import path from "path";

const GCP_PROJECT_ID: string = process.env.GCP_PROJECT_ID || "";
const GCP_BUCKET_NAME: string = process.env.GCS_BUCKET_NAME || "";
const SERVICE_ACCOUNT_FILENAME: string = process.env.SERVICE_ACCOUNT_FILENAME || "";

if (!GCP_PROJECT_ID) {
	throw new Error("Environment variable GCP_PROJECT_ID is not defined");
}
if (!GCP_BUCKET_NAME) {
	throw new Error("Environment variable GCS_BUCKET_NAME is not defined");
}
if (!SERVICE_ACCOUNT_FILENAME) {
	throw new Error("Environment variable SERVICE_ACCOUNT_FILENAME is not defined");
}

const GCP_serviceAccountPath: string = path.join(process.cwd(), SERVICE_ACCOUNT_FILENAME);

export { GCP_PROJECT_ID as GCP_projectId, GCP_BUCKET_NAME as GCP_bucketName, GCP_serviceAccountPath };
