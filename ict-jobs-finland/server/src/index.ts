import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jobsRouter from "./routes/jobs";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobsRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "ICT Jobs Finland API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});