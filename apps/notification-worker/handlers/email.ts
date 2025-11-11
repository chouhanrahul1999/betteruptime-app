import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(config: any, event: any) {
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: config.email,
    subject: `🚨 Website Down Alert: ${event.url}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🚨 Website Down Alert</h2>
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Website:</strong> ${event.url}</p>
          <p><strong>Status:</strong> Down</p>
          <p><strong>Region:</strong> ${event.regionId}</p>
          <p><strong>Time:</strong> ${new Date(event.timestamp).toLocaleString()}</p>
          <p><strong>Response Time:</strong> ${event.responseTime}ms</p>
        </div>
        <p style="color: #666;">This is an automated alert from your uptime monitoring system.</p>
      </div>
    `,
  });
  console.log('✓ Email sent:', info.messageId);
}
