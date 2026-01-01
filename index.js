const express = require('express');
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = process.env.PORT || 3000;

// ENV variables (Railway)
const bot = new TelegramBot(process.env.BOT_TOKEN);
const chatId = process.env.CHAT_ID;

// allow big base64
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.post('/snap', async (req, res) => {
  try {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(__dirname, 'photo.png');

    fs.writeFileSync(filePath, base64Data, 'base64');

    await bot.sendPhoto(chatId, fs.createReadStream(filePath));

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
