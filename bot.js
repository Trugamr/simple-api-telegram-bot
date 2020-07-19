// Environment variables setup
require('dotenv').config()

const Telegraf = require('telegraf')
const { fortune, randomCat, dogBreeds, randomDog } = require('./commands')

const { TELEGRAM_BOT_TOKEN } = process.env

const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

bot.start(ctx => {
  ctx.reply('Hello !')
})

// Custom commands
bot.command('fortune', fortune)
bot.command('cat', randomCat)
bot.command('dogbreeds', dogBreeds)
bot.command('dog', randomDog)

bot.launch()
