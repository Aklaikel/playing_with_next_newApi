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
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { id } = await idSchema.parseAsync(req.query);

      const todo = db.get(
        `SELECT * FROM todos WHERE id = ?`,
        [id],
        (error, row) => {
          if (error) throw error;
          if (!row) return res.status(404).json({ error: "Not Found" });
          res.status(200).json(row);
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.flatten() });
      }
      throw error;
    }
  },
  PATCH: async (req: NextApiRequest, res: NextApiResponse) => {},
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
