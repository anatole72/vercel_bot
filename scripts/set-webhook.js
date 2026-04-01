#!/usr/bin/env node
/**
 * Run once after deploy to register the webhook with Telegram:
 *   BOT_TOKEN=xxx VERCEL_URL=https://your-project.vercel.app node scripts/set-webhook.js
 */

const token = process.env.BOT_TOKEN;
const vercelUrl = process.env.VERCEL_URL;

if (!token || !vercelUrl) {
  console.error("Usage: BOT_TOKEN=xxx VERCEL_URL=https://your-project.vercel.app node scripts/set-webhook.js");
  process.exit(1);
}

const webhookUrl = `${vercelUrl}/api/webhook`;

fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: webhookUrl }),
})
  .then((r) => r.json())
  .then((data) => {
    if (data.ok) {
      console.log(`✅ Webhook set: ${webhookUrl}`);
    } else {
      console.error("❌ Failed:", data.description);
    }
  })
  .catch((e) => console.error("Error:", e));
