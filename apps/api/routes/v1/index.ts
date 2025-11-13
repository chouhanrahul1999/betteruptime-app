import { Router } from "express";
import websiteRouter from "./website";
import userRouter from "./user";
import integrationRoutes from './integration';
import notificationRoutes from './notification';

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API v1" });
});

router.use("/website", websiteRouter);
router.use("/user", userRouter);
router.use("/integrations", integrationRoutes);
router.use("/notifications", notificationRoutes);

export default router;