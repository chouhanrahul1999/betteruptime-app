import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  
  const token = header.substring(7); // Remove 'Bearer ' prefix
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.userId = data.id as string;
    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",  
    });
  }
}
