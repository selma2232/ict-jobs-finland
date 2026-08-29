import "dotenv/config";

import express from "express";
import cors from "cors";
import jobsRouter from "./routes/jobs";
import companiesRouter from "./routes/companies";
import savedJobsRouter from "./routes/savedjobs";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/saved-jobs", savedJobsRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "ICT Jobs Finland API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});