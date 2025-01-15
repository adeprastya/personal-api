import { Firestore } from "@google-cloud/firestore";
import { GCP_projectId, GCP_serviceAccountPath } from "../config/GCP";
import { ErrorResponse } from "../utils/ErrorResponse";

const firestore = new Firestore({
	projectId: GCP_projectId,
	keyFilename: GCP_serviceAccountPath
});

const deleteCollectionRecursive = async (collectionPath: string): Promise<void> => {
	const deleteRecursive = async (docRef: FirebaseFirestore.DocumentReference): Promise<void> => {
		try {
			const subcollections = await docRef.listCollections();

			await Promise.all(subcollections.map((subcollection) => deleteCollectionRecursive(subcollection.path)));

			await docRef.delete();
		} catch (error) {
			throw new ErrorResponse(500, `Error deleting document ${docRef.path}`);
		}
	};

	try {
		const collectionRef = firestore.collection(collectionPath);
		const docs = await collectionRef.listDocuments();

		await Promise.all(docs.map((doc) => deleteRecursive(doc)));
	} catch (error) {
		throw new ErrorResponse(500, `Error deleting collection ${collectionPath}`);
	}
};

class FirestoreCollection<T extends { id: string }> {
	readonly #collection: FirebaseFirestore.CollectionReference<T>;

	constructor(collectionRef: string | FirestoreCollection<T>) {
		if (typeof collectionRef === "string") {
			this.#collection = firestore.collection(collectionRef) as FirebaseFirestore.CollectionReference<T>;
		} else if (collectionRef instanceof FirestoreCollection) {
			this.#collection = collectionRef.#collection;
		} else {
			throw new Error("Invalid collection reference");
		}
	}

	ref(): FirebaseFirestore.CollectionReference<T> {
		return this.#collection;
	}

	async create(data: T): Promise<string> {
		try {
			await this.#collection.doc(data.id).set(data);
			return data.id;
		} catch (err) {
			throw new ErrorResponse(500, "Failed creating document");
		}
	}

	async update(id: string, data: Partial<T>): Promise<string> {
		try {
			await this.#collection.doc(id).update(data);
			return id;
		} catch (err) {
			throw new ErrorResponse(500, `Failed updating document with ID: ${id}`);
		}
	}

	async delete(id: string): Promise<string> {
		try {
			await this.#collection.doc(id).delete();
			return id;
		} catch (err) {
			throw new ErrorResponse(500, `Failed deleting document with ID: ${id}`);
		}
	}

	async findAll(): Promise<T[]> {
		try {
			const snapshot = await this.#collection.get();
			return snapshot.docs.map((doc) => doc.data());
		} catch (err) {
			throw new ErrorResponse(500, "Failed getting all documents");
		}
	}

	async findByField(field: keyof T, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<T | null> {
		try {
			const snapshot = await this.#collection.where(field as string, operator, value).get();

			if (snapshot.empty || !snapshot.docs.length) {
				return null;
			}
			const firstDoc = snapshot.docs[0];
			return firstDoc?.data() ?? null;
		} catch (err) {
			throw new ErrorResponse(500, `Failed finding document by field ${String(field)}`);
		}
	}
}

export { FirestoreCollection };
