// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import "@/server/db";
import { db } from "@/server/db";

import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const todoSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(5).max(255),
});

const idSchema = z.object({ id: z.string().transform((v) => parseInt(v)) });

const controllers: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => unknown
> = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    try {

      const { name, description } = await todoSchema.parseAsync(req.body);

      db.run(
        "INSERT INTO todos (name, description) VALUES (?, ?)",
        [name, description],
        (err) => {
          if (err) throw err;
          console.log("Created the todos table.");
          res.status(201).json({ success: true });
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ issues: error.issues });
      }
      throw error;
    }
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    db.all("SELECT * FROM todos", (err, rows) => {
      if (err) throw err;
      res.status(200).json(rows);
    });
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.method) return;
  const callback = controllers[req.method];
  if (!callback) return res.status(405).end("Method Not Allowed");

  try {
    await callback(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
