// index.js
const express = require("express");
const fs = require("fs");
const os = require("os");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const port = process.env.PORT || 3000;

// Railway Variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("Missing BOT_TOKEN or CHAT_ID in environment variables.");
}

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// Allow large base64 payloads
app.use(express.json({ limit: "15mb" }));
app.use(express.static("public"));

app.post("/snap", async (req, res) => {
  try {
    const dataUrl = req.body?.image;
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).send("Missing image");
    }

    // Strip data URL prefix (png/jpg/etc.)
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");

    // Write into temp dir (Railway-friendly)
    const filePath = path.join(os.tmpdir(), `photo-${Date.now()}.png`);
    fs.writeFileSync(filePath, base64, "base64");

    await bot.sendPhoto(CHAT_ID, fs.createReadStream(filePath));

    // Cleanup (optional)
    try { fs.unlinkSync(filePath); } catch (_) {}

    return res.sendStatus(200);
  } catch (err) {
    console.error("SNAP ERROR:", err);
    return res.sendStatus(500);
  }
});

// Quick test route (optional)
app.get("/health", (req, res) => res.send("OK"));

app.listen(port, () => console.log("Server running on port", port));
