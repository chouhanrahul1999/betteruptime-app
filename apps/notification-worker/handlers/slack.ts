import axios from "axios";

export async function sendSlack(config: any, event: any) {
  await axios.post(config.webhookUrl, {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 Website Down Alert",
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Website:*\n${event.url}` },
          { type: "mrkdwn", text: `*Status:*\nDown` },
          { type: "mrkdwn", text: `*Region:*\n${event.regionId}` },
          { type: "mrkdwn", text: `*Response Time:*\n${event.responseTime}ms` },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Time: ${new Date(event.timestamp).toLocaleString()}`,
          },
        ],
      },
    ],
  });
}
