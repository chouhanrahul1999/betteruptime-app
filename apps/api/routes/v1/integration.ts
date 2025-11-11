import { Router } from "express";
import { prismaClient } from "store/client";
import { authMiddleware } from "../../middleware";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { type, config } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const integration = await prismaClient.integration.create({
      data: {
        user_id: userId,
        type,
        config,
        enabled: true,
      },
    });
    res.json(integration);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const integrations = await prismaClient.integration.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });

    res.json(integrations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { config } = req.body;
    const userId = req.userId;

    const integration = await prismaClient.integration.updateMany({
      where: {
        id,
        user_id: userId,
      },
      data: { config },
    });

    res.json(integration);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const current = await prismaClient.integration.findFirst({
      where: { id, user_id: userId },
    });

    if (!current) {
      return res.status(404).json({ error: "Integration not found" });
    }

    const updated = await prismaClient.integration.update({
      where: { id },
      data: { enabled: !current.enabled },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await prismaClient.integration.deleteMany({
      where: {
        id,
        user_id: userId,
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
