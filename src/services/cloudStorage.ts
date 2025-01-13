import { Storage } from "@google-cloud/storage";
import { GCP_projectId, GCP_serviceAccountPath, GCP_bucketName } from "../config/GCP";
import { ErrorResponse } from "../utils/ErrorResponse";

const storage = new Storage({
	projectId: GCP_projectId,
	keyFilename: GCP_serviceAccountPath
});
const bucket = storage.bucket(GCP_bucketName);

const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

const storeImage = async (id: string, image: Express.Multer.File): Promise<string> => {
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
		console.error("__Error storing image in GCS:", err);
		throw new ErrorResponse(err.statusCode, err.message);
	}
};

export { storeImage };
