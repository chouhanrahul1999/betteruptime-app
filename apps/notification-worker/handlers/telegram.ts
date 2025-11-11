import axios from "axios";

export async function sendTelegram(config: any, event: any) {
  const message = `
    🚨 *Website Down Alert*
    
    *Website:* ${event.url}
    *Status:* Down
    *Region:* ${event.regionId}
    *Response Time:* ${event.responseTime}ms
    *Time:* ${new Date(event.timestamp).toLocaleString()}
      `;

  await axios.post(
    `https://api.telegram.org/bot${config.botToken}/sendMessage`,
    {
      chat_id: config.chatId,
      text: message,
      parse_mode: "Markdown",
    }
  );
}
