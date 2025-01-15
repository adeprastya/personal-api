import { FirestoreCollection } from "../services/cloudFirestore";

export interface ProjectInterface {
	id: string;
	title: string;
	description: string;
	technologies: Array<string>;
	site_url?: String | null;
	source_code_url?: String | null;
	demo_url?: String | null;
	image_url: String;
	created_at: string;
}

const ProjectCollection = new FirestoreCollection<ProjectInterface>("projects");

export default ProjectCollection;
