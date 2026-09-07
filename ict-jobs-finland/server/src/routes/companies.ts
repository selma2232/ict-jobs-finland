import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Get all companies
router.get("/", async (_req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(companies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch companies",
    });
  }
});

// Get one company
router.get("/:id", async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        jobs: true,
      },
    });

    if (!company) {
      res.status(404).json({
        message: "Company not found",
      });

      return;
    }

    res.json(company);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch company",
    });
  }
});

export default router;