import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database";
import scoreRoutes from "./routes/scoreRoutes";

import "./models";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/scores", scoreRoutes);

connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
