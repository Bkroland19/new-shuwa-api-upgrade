import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import createErrors from "http-errors";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import InitiateMongoServer from "./config/db.js";
import adminRouter from "./routes/adminRoutes.js";
InitiateMongoServer();

const app = express();
app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", adminRoutes);

app.get("/", (req, res) => {
	res.json({ message: "API Working" });
});

app.use(async (req, res, next) => {
	next(createErrors.NotFound("This route does not exist"));
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		message: error,
		status: error.status || 500,
	});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server Started at PORT ${PORT}......`);
	console.log(`http://localhost:${PORT}`);
});
