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
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string
    ) as unknown as JwtPayload;

    return decoded.userId;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}

// Get user's applications
router.get("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const applications = await (prisma as any).application.findMany({
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
        appliedAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// Create application
router.post("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const {
      jobId,
      status,
      appliedAt,
      notes,
    } = req.body;

    if (!jobId) {
      res.status(400).json({
        message: "jobId is required",
      });
      return;
    }

    // Check that the job exists
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      res.status(404).json({
        message: "Job not found",
      });
      return;
    }

    // Check for duplicate application
    const existingApplication =
      await (prisma as any).application.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId,
          },
        },
      });

    if (existingApplication) {
      res.status(409).json({
        message: "Application already exists",
      });
      return;
    }

    const application = await (prisma as any).application.create({
      data: {
        userId,
        jobId,
        status: status || "applied",
        appliedAt: appliedAt
          ? new Date(appliedAt)
          : new Date(),
        notes: notes || null,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create application",
    });
  }
});

// Update application
router.put("/:id", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { id } = req.params;
    const {
      status,
      appliedAt,
      notes,
    } = req.body;

    const existingApplication =
      await (prisma as any).application.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!existingApplication) {
      res.status(404).json({
        message: "Application not found",
      });
      return;
    }

    const application =
      await (prisma as any).application.update({
        where: {
          id,
        },
        data: {
          ...(status !== undefined && {
            status,
          }),

          ...(appliedAt !== undefined && {
            appliedAt: new Date(appliedAt),
          }),

          ...(notes !== undefined && {
            notes: notes || null,
          }),
        },
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
      });

    res.json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update application",
    });
  }
});

// Delete application
router.delete("/:id", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { id } = req.params;

    const existingApplication =
      await (prisma as any).application.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!existingApplication) {
      res.status(404).json({
        message: "Application not found",
      });
      return;
    }

    await (prisma as any).application.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Application deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete application",
    });
  }
});

export default router;