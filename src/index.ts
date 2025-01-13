import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index";
import errorMiddleware from "./middlewares/errorMiddlewares";

const app = express();

app.use(
	cors({
		origin: "*",
		methods: "GET, POST, PUT, DELETE",
		allowedHeaders: "Content-Type, Authorization",
		credentials: true
	})
);
app.use(helmet());
app.use(express.json());

app.use("/", router);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\nServer running on http://localhost:${PORT}`));
