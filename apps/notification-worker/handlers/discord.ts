import axios from "axios";

export async function sendDiscord(config: any, event: any) {
  await axios.post(config.webhookUrl, {
    embeds: [
      {
        title: "🚨 Website Down Alert",
        color: 0xff0000,
        fields: [
          { name: "Website", value: event.url, inline: true },
          { name: "Status", value: "Down", inline: true },
          { name: "Region", value: event.regionId, inline: true },
          {
            name: "Response Time",
            value: `${event.responseTime}ms`,
            inline: true,
          },
          { name: "Time", value: new Date(event.timestamp).toLocaleString() },
        ],
        timestamp: new Date(event.timestamp).toISOString(),
      },
    ],
  });
}
