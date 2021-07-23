import bot from '../telegram.js'
import User from '../models/users.js'
import { getMainMenuKeyboard } from '../telegram/keyboards.js'
import STATE from '../state/state.js'

export default function startCommand() {
  bot.onText(/\/start/, msg => {
    //Поиск пользователя по id чата в бд
    User.findOne({ user_id: msg.chat.id }, (err, user) => {
      if (err) {
        return bot.sendMessage(msg.chat.id, 'Возникли проблемы. Попробуйте еще раз.')
      } else if(user) {
        //Показать главное меню если пользователь зарегистрирован
        STATE[msg.chat.id] = 'main_menu'
        return bot.sendMessage(msg.chat.id, `Выберите интересующий раздел:`, getMainMenuKeyboard())
      } 
      //Сообщить админу если незарегистрированый пользователь вошел в бот
      return bot.sendMessage(408201340, `Не зарегистрированный пользователь ${ msg.chat.first_name } ${ msg.chat.last_name } вошел.`)
    })
  })
}