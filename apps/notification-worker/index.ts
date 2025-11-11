import { KafkaConsumer, TOPICS, EVENT_TYPES } from "kafka";
import { prismaClient } from "store/client";
import { sendEmail } from "./handlers/email";
import { sendWebhook } from "./handlers/webhook";
import { sendSlack } from "./handlers/slack";
import { sendDiscord } from "./handlers/discord";
import { sendTelegram } from "./handlers/telegram";

async function handleEvent(event: any) {
  if (event.type !== EVENT_TYPES.WEBSITE_DOWN) {
    return;
  }

  console.log(`Processing notification for: ${event.url}`);

  const integrations = await prismaClient.integration.findMany({
    where: {
      user_id: event.userId,
      enabled: true,
    },
  });

  console.log(`Found ${integrations.length} enabled integrations`);

  //send email to all embled channels

  for (const integration of integrations) {
    try {
      console.log(`Sending ${integration.type} notification...`);

      switch (integration.type) {
        case "EMAIL":
          await sendEmail(integration.config, event);
          break;
        case "WEBHOOK":
          await sendWebhook(integration.config, event);
          break;
        case "SLACK":
          await sendSlack(integration.config, event);
          break;
        case "DISCORD":
          await sendDiscord(integration.config, event);
          break;
        case "TELEGRAM":
          await sendTelegram(integration.config, event);
          break;
      }
      await prismaClient.notification_log.create({
        data: {
          event_type: event.type,
          integration_id: integration.id,
          status: "SENT",
          payload: event,
        },
      });
      console.log(`✓ ${integration.type} notification sent`);
    } catch (err: any) {
      console.error(`✗ ${integration.type} notification failed:`, err.message);

      await prismaClient.notification_log.create({
        data: {
          event_type: event.type,
          integration_id: integration.id,
          status: "FAILED",
          payload: event,
          error_message: err.message,
        },
      });
    }
  }
}

async function main() {
  console.log("🚀 Starting Notification Worker...");

  const consumer = new KafkaConsumer("notification-group", [
    TOPICS.WEBSITE_EVENTS,
  ]);

  await consumer.start(handleEvent);

  console.log("✓ Notification Worker is running");
}

main().catch(console.error);
