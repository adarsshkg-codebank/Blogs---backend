import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authrouter } from './api/auth/auth.routes';
import { Userrouter } from './controllers/user';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/test', (req, res) => {
  res.json('The server is alive');
})

app.use("/auth", authrouter);
app.use("/user", Userrouter);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
})
