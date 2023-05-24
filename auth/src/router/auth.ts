import express from "express";
import z from "zod";
import type { Request, Response } from "express";
import { RequestValidationError } from "../errors/request-validation-errors";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .min(4, "Password must be between 4 and 20 characters")
    .max(20, "Password must be between 4 and 20 characters"),
});

const authRouter = express.Router();

authRouter.post("/signup", (req: Request, res: Response) => {
  const validation = signupSchema.safeParse(req.body);

  if (!validation.success) {
    throw new RequestValidationError(validation.error);
  }

  console.log("Creating user...");

  throw new DatabaseConnectionError();

  res.send({});
});

export default authRouter;
