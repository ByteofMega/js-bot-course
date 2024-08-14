const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '7468100093:AAH5OsTFBCNsXSqkXyf6ZLiwGS8V6E3yUOg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало работы'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Запуск игры'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg)
        if (text === '/start') {
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAAEMpNJmvF_S_Chonsp45luTeZU-cQkirQACHkwAAtJ4mUk9n65ia4VY7zUE')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Моя твоя не понимать')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()