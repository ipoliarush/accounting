import dotenv from 'dotenv'
dotenv.config()

import TelegramBot from 'node-telegram-bot-api'
const bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true })

export default bot