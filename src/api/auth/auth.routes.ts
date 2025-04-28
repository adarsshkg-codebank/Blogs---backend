import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { generateTokens } from "../../utils/jwt";
import { addRefresh, findRefreshToken, deleteRefreshTokenById } from "./auth.services";
import { findUserById, findUserByEmail, createUserByEmailAndPassword } from "../user/user.services";
import { z } from "zod";
import { generateAccessToken } from "../../utils/jwt";
import { authenticateToken } from "../../middleware/validateToken";

const router = express.Router();

const UserData = z.object({
  email: z.string(),
  password: z.string().min(8),
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const result = UserData.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ message: "Validation errors" });
      return
    }

    const { email, password } = result.data;
    const existing = await findUserByEmail(email);
    if (existing) {
      res.status(400).json({ message: "Email already in use" });
      return
    }

    const user = await createUserByEmailAndPassword({ email, password });

    const { accessToken, refreshToken } = generateTokens(user);
    await addRefresh({ refreshToken, id: user.id });

    res.status(200).json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    return
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const result = UserData.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: "Invalid email or password" });
    return
  }

  try {
    const { email, password } = result.data;

    const existing = await findUserByEmail(email);
    if (!existing) {
      res.status(400).json({ message: "Email already not in use" });
      return
    }

    const valid = await bcrypt.compare(password, existing.password);
    if (!valid) {
      res.status(400).json({ Message: "Invalid login" });
      return
    }

    const { accessToken, refreshToken } = generateTokens(existing);
    await addRefresh({ refreshToken, id: existing.id });

    res.status(200).json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    return
  }
})

router.post("/refresh", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userData = req.user as { id: string, email: string };

    const accessToken = generateAccessToken(userData);
    res.status(200).json({ accessToken });
    return

  } catch (err) {
    res.status(500).json({ message: "Internal server Error" });
    return
  }
})


export { Router }
