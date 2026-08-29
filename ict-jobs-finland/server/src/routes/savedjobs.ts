import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

interface JwtPayload {
  userId: string;
  email: string;
}

function getUserIdFromToken(req: any): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as JwtPayload;

    return decoded.userId;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}

// Get user's saved jobs
router.get("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(savedJobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch saved jobs",
    });
  }
});

// Save a job
router.post("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { jobId } = req.body;

    if (!jobId) {
      res.status(400).json({
        message: "jobId is required",
      });
      return;
    }

    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingSavedJob) {
      res.status(409).json({
        message: "Job is already saved",
      });
      return;
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    res.status(201).json(savedJob);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save job",
    });
  }
});

// Remove saved job
router.delete("/:jobId", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { jobId } = req.params;

    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (!existingSavedJob) {
      res.status(404).json({
        message: "Saved job not found",
      });
      return;
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    res.json({
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to remove saved job",
    });
  }
});

export default router;