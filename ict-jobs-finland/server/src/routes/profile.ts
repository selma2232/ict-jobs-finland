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
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string
    ) as unknown as {
      userId: string;
    };

    return decoded.userId;
  } catch {
    return null;
  }
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateProfile(data: {
  name: string;
  educationLevel: string;
  field: string;
  location: string;
  skills: string[];
  interests: string[];
}): string | null {
  if (!data.name) {
    return "Nimi on pakollinen.";
  }

  if (data.name.length > 100) {
    return "Nimi on liian pitkä.";
  }

  if (!data.educationLevel) {
    return "Koulutustaso on pakollinen.";
  }

  const allowedEducationLevels = [
    "amk",
    "vocational",
    "university",
    "graduated",
  ];

  if (!allowedEducationLevels.includes(data.educationLevel)) {
    return "Virheellinen koulutustaso.";
  }

  if (!data.field) {
    return "Ala on pakollinen.";
  }

  if (data.field.length > 150) {
    return "Ala on liian pitkä.";
  }

  if (!data.location) {
    return "Sijainti on pakollinen.";
  }

  if (data.location.length > 100) {
    return "Sijainti on liian pitkä.";
  }

  if (data.skills.length === 0) {
    return "Valitse vähintään yksi taito.";
  }

  if (data.skills.length > 20) {
    return "Voit valita enintään 20 taitoa.";
  }

  if (data.interests.length === 0) {
    return "Valitse vähintään yksi työpaikkatyyppi.";
  }

  if (data.interests.length > 10) {
    return "Valitse enintään 10 työpaikkatyyppiä.";
  }

  return null;
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

    const name = cleanString(req.body.name);
    const educationLevel = cleanString(
      req.body.educationLevel
    ).toLowerCase();
    const field = cleanString(req.body.field);
    const location = cleanString(req.body.location);

    const skills = cleanStringArray(req.body.skills);
    const interests = cleanStringArray(req.body.interests);

    const validationError = validateProfile({
      name,
      educationLevel,
      field,
      location,
      skills,
      interests,
    });

    if (validationError) {
      res.status(400).json({
        message: validationError,
      });
      return;
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name,

        profile: {
          upsert: {
            create: {
              educationLevel,
              field,
              location,
              skills,
              interests,
            },

            update: {
              educationLevel,
              field,
              location,
              skills,
              interests,
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