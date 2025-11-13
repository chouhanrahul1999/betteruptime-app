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

  await prismaClient.region.createMany({
    data: [
      { id: "india", name: "India" },
      { id: "usa", name: "USA" },
    ],
    skipDuplicates: true,
  });
  
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
        take: 100,
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
    user_id: website.user_id,
    ticks: website.ticks,
  });
});

router.get("/websites", authMiddleware, async (req, res) => {
  const websites = await prismaClient.website.findMany({
    where: {
      user_id: req.userId,
    },
    include: {
      ticks: {
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
  });

  res.status(200).json({
    websites,
  });
});

router.delete("/:websiteId", authMiddleware, async (req, res) => {
  try {
    // First delete all related ticks
    await prismaClient.website_tick.deleteMany({
      where: {
        website_id: req.params.websiteId,
      },
    });
    
    // Then delete the website
    await prismaClient.website.deleteMany({
      where: {
        id: req.params.websiteId,
        user_id: req.userId!,
      },
    });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
