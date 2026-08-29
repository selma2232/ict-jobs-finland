import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

function getUserIdFromToken(req: any): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as {
      userId: string;
    };

    return decoded.userId;
  } catch {
    return null;
  }
}

// GET /api/profile
router.get("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load profile",
    });
  }
});

// PUT /api/profile
router.put("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const {
      name,
      educationLevel,
      field,
      location,
      skills,
      interests,
    } = req.body;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        profile: {
          upsert: {
            create: {
              educationLevel: educationLevel || null,
              field: field || null,
              location: location || null,
              skills: Array.isArray(skills) ? skills : [],
              interests: Array.isArray(interests) ? interests : [],
            },
            update: {
              educationLevel: educationLevel || null,
              field: field || null,
              location: location || null,
              skills: Array.isArray(skills) ? skills : [],
              interests: Array.isArray(interests) ? interests : [],
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save profile",
    });
  }
});

export default router;