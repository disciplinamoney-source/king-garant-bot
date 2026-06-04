import app from "./app";
import { logger } from "./lib/logger";
import { createBot } from "./bot";
import { webhookCallback } from "grammy";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const bot = createBot();

if (bot) {
  const webhookUrl = process.env.WEBHOOK_URL;

  if (webhookUrl) {
    // Режим вебхука — для Render и любого продакшн-хостинга
    const hookPath = `/api/tg-webhook`;
    app.post(hookPath, webhookCallback(bot, "express"));

    bot.api.setWebhook(`${webhookUrl}${hookPath}`)
      .then(() => logger.info({ webhookUrl }, "Telegram webhook set"))
      .catch((err) => logger.error({ err }, "Failed to set webhook"));

    logger.info("Bot running in webhook mode");
  } else {
    // Режим long polling — для локальной разработки на Replit
    bot.start({
      onStart: (me) => logger.info({ username: me.username }, "Telegram bot started (long polling)"),
    }).catch((err) => {
      logger.error({ err }, "Telegram bot crashed");
    });
  }
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
