import express, { Request, Response, Router } from 'express';
import { db } from '../utils/db';
import { string, z } from 'zod';
import { authenticateToken } from '../middleware/validateToken';

const blogSchema = z.object({
  email: string(),
  title: z.string(),
  desc: z.string(),
  content: z.string(),
  categories: z.array(z.string()).optional(),
})

const UpdateBlogSchema = z.object({
  userId: string(),
  id: string(),
  title: z.string().optional(),
  desc: z.string().optional(),
  content: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

type createBlogInput = z.infer<typeof blogSchema>;
type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;

export const createPost = async (req: Request, res: Response) => {
  try {
    const result = blogSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Validation error" });
      return
    }

    const { email, title, desc, content, categories = [] } = result.data as createBlogInput;
    const createBlog = await db.blog.create({
      data: {
        email,
        title,
        desc,
        content,
        categories,
      },
    });

    res.status(200).json({ message: "success" });


  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
    return
  }
}


export const editBlog = async (req: Request, res: Response) => {
  try {
    const result = UpdateBlogSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ message: "Validation error" });
      return
    }
    const ID = req.params.id;
    const update = result.data as UpdateBlogInput;
    const updateBlog = await db.blog.update({
      where: {
        id: ID,
        email: req.user?.email,
      },
      data: {
        title: update.title,
        desc: update.desc,
        content: update.content,
        categories: update.categories,
      },
    });
    res.status(200).json({ message: "Blog has been updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" });
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const ID = req.params.id;
    const email = req.user?.email;

    const exist = await db.blog.findUnique({
      where: {
        id: ID,
      },
    });
    if (!exist) {
      res.status(403).json({ message: "Blog post not found" });
      return
    }

    if (exist.email !== email) {
      res.status(403).json({ message: "Not the Author" });
    }

    await db.blog.delete({
      where: {
        id: ID,
        email: email,
      }
    });
    res.status(200).json({ message: "Blog has been deleted" });

  } catch (err) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

const Userrouter: Router = express.Router();
Userrouter.post('/posts', authenticateToken, createPost);
Userrouter.patch('/posts/:id', authenticateToken, createPost);
Userrouter.delete('/posts/:id', authenticateToken, deletePost);

export { Userrouter };
