import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.get('/test', (req, res) => {
  res.json('The server is alive');
})

app.listen(port, () => {
  console.log(`Server running at ${port}`);
})
