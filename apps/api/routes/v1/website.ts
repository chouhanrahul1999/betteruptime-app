import { Router } from "express";
import { prismaClient } from "store/client";
import { authMiddleware } from "../../middleware";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  if (!req.body.url) {
    res.status(400).json({
      error: "Missing url",
    });
    return;
  }
  const website = await prismaClient.website.create({
    data: {
      url: req.body.url,
      time_added: new Date(),
      user_id: req.userId!,
    },
  });
  res.json({
    id: website.id,
  });
});

router.get("/status/:websiteId", authMiddleware, async (req, res) => {
  const website = await prismaClient.website.findFirst({
    where: {
      id: req.params.websiteId,
      user_id: req.userId!,
    },
    include: {
      ticks: {
        orderBy: [
          {
            created_at: "desc",
          },
        ],
        take: 10,
      },
    },
  });
  if (!website) {
    return res.status(409).json({
      message: "Not found",
    });
  }
  res.json({
    url: website.url,
    id: website.id,
    user_id: website.user_id
  });
});

export default router;
