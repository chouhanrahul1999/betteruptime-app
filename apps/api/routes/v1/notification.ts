import { Router } from "express";
import { prismaClient } from "store/client";
import nodemailer from "nodemailer";

const router = Router();

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
});

router.post("/send", async (req, res) => {
  try {
    const { type, websiteId, url, region, timestamp } = req.body;

    if (type === 'website_down') {
      // Get all email integrations
      const emailIntegrations = await prismaClient.integration.findMany({
        where: {
          type: 'EMAIL',
          enabled: true,
        },
      });

      // Send email to each integration
      for (const integration of emailIntegrations) {
        await sendEmail(integration.config.email, {
          subject: `🚨 Website Down Alert - ${url}`,
          body: `Website: ${url}\nStatus: DOWN\nRegion: ${region}\nTime: ${new Date(timestamp).toLocaleString()}\n\nPlease check your website immediately.`
        });
      }

      console.log(`✓ Sent ${emailIntegrations.length} email notifications for ${url}`);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Notification error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const logs = await prismaClient.notification_log.findMany({
      include: {
        integration: true,
      },
      orderBy: {
        sent_at: 'desc'
      }
    });

    res.json(logs);
  } catch (error: any) {
    console.error('Failed to fetch notification logs:', error);
    res.status(500).json({ error: error.message });
  }
});

async function sendEmail(to: string, { subject, body }: { subject: string; body: string }) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'your-email@gmail.com',
      to,
      subject,
      text: body
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`📧 Failed to send email to ${to}:`, error);
  }
}

export default router;