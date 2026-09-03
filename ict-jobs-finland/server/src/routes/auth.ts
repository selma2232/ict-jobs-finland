import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
}

function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      message: "Invalid authorization header",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string
    ) as unknown as JwtPayload;

    if (
      !decoded ||
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError
    ) {
      res.status(401).json({
        message: "Token expired",
      });
      return;
    }

    res.status(401).json({
      message: "Invalid token",
    });
  }
}

/*
 * REGISTER
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const name =
      typeof req.body.name === "string"
        ? req.body.name.trim()
        : "";

    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string"
        ? req.body.password
        : "";

    if (!name || !email || !password) {
      res.status(400).json({
        message:
          "Nimi, sähköposti ja salasana ovat pakollisia.",
      });
      return;
    }

    if (name.length > 100) {
      res.status(400).json({
        message: "Nimi on liian pitkä.",
      });
      return;
    }

    if (email.length > 255) {
      res.status(400).json({
        message: "Sähköposti on liian pitkä.",
      });
      return;
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      res.status(400).json({
        message: "Anna kelvollinen sähköpostiosoite.",
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        message:
          "Salasanan tulee olla vähintään 8 merkkiä pitkä.",
      });
      return;
    }

    if (password.length > 100) {
      res.status(400).json({
        message: "Salasana on liian pitkä.",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(409).json({
        message: "Tällä sähköpostiosoitteella on jo käyttäjä.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Rekisteröityminen epäonnistui.",
    });
  }
});

/*
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string"
        ? req.body.password
        : "";

    if (!email || !password) {
      res.status(400).json({
        message:
          "Sähköposti ja salasana ovat pakollisia.",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "Virheellinen sähköposti tai salasana.",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      res.status(401).json({
        message: "Virheellinen sähköposti tai salasana.",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Kirjautuminen epäonnistui.",
    });
  }
});

/*
 * CURRENT USER
 * GET /api/auth/me
 */
router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        res.status(401).json({
          message: "Authentication required",
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
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
      console.error("AUTH ME ERROR:", error);

      res.status(500).json({
        message: "Käyttäjän tietojen hakeminen epäonnistui.",
      });
    }
  }
);

export { authenticateToken };

export default router;