import { Router } from "express";
import websiteRouter from "./website";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API v1" });
});

router.use("/website", websiteRouter);

export default router;