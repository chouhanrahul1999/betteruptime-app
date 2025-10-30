import { Router } from "express";
import websiteRouter from "./website";
import userRouter from "./user"

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API v1" });
});

router.use("/website", websiteRouter);
router.use("/user", userRouter)

export default router;