import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        company: true,
      },
    });

    if (!job) {
      res.status(404).json({
        message: "Job not found",
      });

      return;
    }

    res.json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
});

export default router;