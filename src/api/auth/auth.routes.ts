import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateTokens } from "../../utils/jwt";
import { addRefresh, findRefreshToken, deleteRefreshTokenById } from "./auth.services";
import { findUserById, findUserByEmail, createUserByEmailAndPassword } from "../user/user.services";
import { z } from "zod";
import { generateAccessToken } from "../../utils/jwt";
import { authenticateToken } from "../../middleware/validateToken";

const router = Router();

const UserData = z.object({
  email: z.string(),
  password: z.string().min(8),
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const result = UserData.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Validation errors" });
    }

    const { email, password } = result.data;
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const user = await createUserByEmailAndPassword({ email, password });

    const { accessToken, refreshToken } = generateTokens(user);
    await addRefresh({ refreshToken, id: user.id });

    return res.status(200).json({
      accessToken,
      refreshToken
    });
  } catch (er) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const result = UserData.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  try {
    const { email, password } = result.data;

    const existing = await findUserByEmail(email);
    if (!existing) {
      return res.status(400).json({ message: "Email already not in use" });
    }

    const valid = await bcrypt.compare(password, existing.password);
    if (!valid) {
      return res.status(400).json({ Message: "Invalid login" });
    }

    const { accessToken, refreshToken } = generateTokens(existing);
    await addRefresh({ refreshToken, id: existing.id });

    res.status(200).json({
      accessToken,
      refreshToken
    });
  } catch (err) {
  }
})

router.post("/refresh", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userData = req.user as { id: string, email: string };

    const accessToken = generateAccessToken(userData);
    return res.status(200).json({ accessToken });

  } catch (err) {
    return res.status(500).json({ message: "Internal server Error" });
  }
})


export { router };

