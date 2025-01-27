const GCP_projectId = process.env.GCP_PROJECT_ID || "";
const GCP_bucketName = process.env.GCP_BUCKET_NAME || "";
const SERVICE_ACCOUNT_CREDENTIALS = process.env.SERVICE_ACCOUNT_CREDENTIALS || "";

if (!GCP_projectId) {
	throw new Error("Environment variable GCP_PROJECT_ID is not defined");
}
if (!GCP_bucketName) {
	throw new Error("Environment variable GCS_BUCKET_NAME is not defined");
}
if (!SERVICE_ACCOUNT_CREDENTIALS) {
	throw new Error("Environment variable SERVICE_ACCOUNT_PATH is not defined");
}

const GCP_serviceAccountCredentials = JSON.parse(SERVICE_ACCOUNT_CREDENTIALS);

export { GCP_projectId, GCP_bucketName, GCP_serviceAccountCredentials };
