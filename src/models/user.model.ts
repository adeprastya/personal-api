import { FirestoreCollection } from "../services/cloudFirestore";

export interface UserInterface {
	id: string;
	email: string;
	name: string;
}

const UserCollection = new FirestoreCollection<UserInterface>("users");

export default UserCollection;
