import TelegramBot from 'node-telegram-bot-api';
import { msgHandler } from './bot/msgHandler';
import { Imsg } from './types';
import * as dotenv from 'dotenv';

dotenv.config();

const TEST_TOKEN = process.env.TEST_TOKEN || '';

const bot = new TelegramBot(TEST_TOKEN, { polling: true });

// bot.onText(/\/echo (.+)/, (msg, match) => {
//   console.log(msg);

//   const chatId = msg.chat.id;
//   if (!match) return;
//   const resp = match[1];

//   console.log(msg);

//   bot.sendMessage(chatId, resp);
// });

bot.on('message', async (msg) => {
  // console.log(msg);
  try {
    const { chatId, text, additionalMSG } = await msgHandler(
      msg as unknown as Imsg
    );

    if (additionalMSG)
      bot.sendMessage(additionalMSG.chatId, additionalMSG.text);

    bot.sendMessage(chatId, text || '');
  } catch {
    console.log('Error when message processed');
  }
});
