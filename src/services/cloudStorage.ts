import { Storage } from "@google-cloud/storage";
import { GCP_projectId, GCP_bucketName, GCP_serviceAccountCredentials } from "../config/GCP";
import { ErrorResponse } from "../utils/ErrorResponse";

const storage = new Storage({
	projectId: GCP_projectId,
	credentials: GCP_serviceAccountCredentials
});
const bucket = storage.bucket(GCP_bucketName);

const allowedMimeTypes = ["image/png"];

export const storeImage = async (id: string, image: Express.Multer.File): Promise<string> => {
	try {
		if (!allowedMimeTypes.includes(image.mimetype)) {
			throw new ErrorResponse(400, `Unsupported image type: ${image.mimetype}`);
		}

		const fileName = `projects/${id}.${image.mimetype.split("/")[1]}`;
		const file = bucket.file(fileName);

		await file.save(image.buffer, {
			metadata: {
				contentType: image.mimetype
			},
			resumable: false
		});

		const imageUrl = `https://storage.googleapis.com/${GCP_bucketName}/${fileName}`;
		return imageUrl;
	} catch (err: any) {
		throw new ErrorResponse(err.statusCode, err.message);
	}
};

export const deleteImage = async (id: string) => {
	try {
		const file = bucket.file(`projects/${id}.png`);

		await file.delete();
	} catch (err: any) {
		throw new ErrorResponse(err.statusCode, err.message);
	}
};
