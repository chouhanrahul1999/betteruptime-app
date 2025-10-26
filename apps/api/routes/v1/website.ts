import { Router } from "express";
import { prismaClient } from "db/client";

const router = Router();

router.post("/", async (req, res) => {
  if (!req.body.url) {
    res.status(400).json({
      error: "Missing url",
    });
    return;
  }
  const website = await prismaClient.website.create({
    data: {
      url: req.body.url,
      timeAdded: new Date(),
    },
  });
  res.json({
    id: website.id,
  });
});

router.get("/status/:websiteId", (req, res) => {});

export default router;
