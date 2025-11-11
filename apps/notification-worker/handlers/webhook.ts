import axios from "axios";

export async function sendWebhook(config: any, event: any) {
  const response = await axios.post(
    config.webhookUrl,
    {
      event: event.type,
      url: event.url,
      status: "down",
      region: event.regionId,
      responseTime: event.responseTime,
      timestamp: event.timestamp,
    },
    {
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
      timeout: 5000,
    }
  );
  console.log('✓ Webhook sent:', config.webhookUrl, response.status);
}
