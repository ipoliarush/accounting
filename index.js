import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Product from './models/products.js'
import { getMainMenuKeyboard, getBackKeyboard, getProductsKeyboard, getSaveProductsKeyboard, getDeleteGroupKeyboard, getDeleteProductKeyboard } from './telegram/keyboards.js'
import bot from './telegram.js'
import startCommand from './controllers/start.js'
import STATE from './state/state.js'



mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})



const start = () => {

  startCommand()

  bot.on('callback_query', async query => {
    
    const data = query.data
    const chat_id = query.from.id
    const message_id = query.message.message_id

    if(data === 'products') {
      STATE[chat_id] = 'products'
      
      await bot.editMessageReplyMarkup(getBackKeyboard(), { chat_id:chat_id , message_id: message_id })
      //Выбор всех товаров с группировкой по группам и сортировкой по алфавиту
      await Product.find({}, null, { sort: { 'group.id': -1, name: 'asc' } }, async (err, arr) => {
        if (err) {
          return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
        } else {
          let products = ''
          let group = ''
          //Вывод списка товаров
          for(const element of arr) {
            //Добавить название группы товаров
            if(element.group.id !== group) {
              products += `\n<b>${element.group.name}</b>:\n`
            }
            products += `- ${element.name}\n`
            group = element.group.id
          }
          return bot.sendMessage(chat_id, products, getProductsKeyboard())
        }
      })

      await bot.answerCallbackQuery(query.id)

      bot.once('callback_query', query => {
        bot.answerCallbackQuery(query.id)
        const data = query.data
        const chat_id = query.from.id
        const message_id = query.message.message_id
         
        if(data === 'add_product') {
         
          //Зафиксировать состояние начала процеса добавления товара
          STATE[chat_id] = 0
          //Изменить клавиатуру после нажатия кнопки "Добавить"
          bot.editMessageReplyMarkup(getBackKeyboard(), { chat_id: chat_id , message_id: message_id })
          const product = {}
    
          bot.sendMessage(chat_id, `Введите наименование товара:`)
          bot.once('message', msg => {
            product.name = msg.text
    
            bot.sendMessage(chat_id, `Введите полное наименование товара:`)
            bot.once('message', msg => {
              product.fullname = msg.text
    
              Product.distinct('group', (err, group) => {
                if (err) {
                  return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
                } else {
    
                  let groupsStr = ''
                  for(const element of group) {
                    groupsStr += `${element.id} ${element.name}\n`
                  }
                  bot.sendMessage(chat_id, `Выберите (достаточно только цифры) или введите группу товара в формате (номер наименование):\n\n${groupsStr}`)
                  bot.once('message', msg => {
                    if(Number(msg.text)) {
                      for(const element of group) {
    
                        if(element.id === msg.text) {
                          product.group_name = element.name
                          product.group_id = element.id
                        }
                      }
                    } 
                    else {
                      product.group_name = msg.text.split(/\d+\s/)[1]
                      product.group_id = msg.text.split(' ')[0]
                    }
                    
                    bot.sendMessage(chat_id, `Наименование: ${product.name}\n\nПолное наименование: ${product.fullname}\n\nГруппа: ${product.group_id} ${product.group_name}`, getSaveProductsKeyboard())
                    bot.once('callback_query', query => {

                      const chat_id = query.from.id
                      const message_id = query.message.message_id

                      if(query.data === 'save_product') {
                        bot.editMessageReplyMarkup(getBackKeyboard(), { chat_id: chat_id , message_id: message_id })
                        bot.answerCallbackQuery(query.id)
                        //Записать дынные о новом товаре
                        const newProduct = new Product({
                          name: product.name,
                          fullname: product.fullname,
                          group: {
                            id: product.group_id,
                            name: product.group_name
                          }
                        })
    
                        newProduct.save(async err => {
                          if (err) {
                            return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
                          } else {
                            bot.sendMessage(chat_id, 'Товар успешно сохранен. ✅')
                            //Чтобы записать в состояние завершение действий добавления товара
                            STATE[chat_id] = 1
                            return bot.sendMessage(chat_id, `Выберите интересующий раздел:`, getMainMenuKeyboard())
                          } 
                        })
                      }
                    })
                  })
                } 
              })
            })
          })
        }
        else if(data === 'delete_product') {
          
          //Зафиксировать состояние начала процеса добавления товара
          STATE[chat_id] = 0
          //Изменить клавиатуру после нажатия кнопки "Добавить"
          bot.editMessageReplyMarkup(getBackKeyboard(), { chat_id: chat_id , message_id: message_id })
          //Отобрать и показать группы, чтобы выбрать товар для удаления
          Product.distinct('group', (err, group) => {
            if (err) {
              return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
            }
            else {
              return bot.sendMessage(chat_id, `Выберите группу в которой следует удалить товар:`, getDeleteGroupKeyboard(group))
            }
          })

    
          bot.once('callback_query', query => {
            const data = query.data
            if(data !== 'main_menu') {
              const group_id = data.split('group_id_')[1]
              //Отобрать товары из группы которую выбрал пользователь для удаления
              Product.find({ 'group.id': group_id }, null, { sort:{ name: 'asc' } }, async (err, product) => {
                if (err) {
                  return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
                }
                else {
                  await bot.answerCallbackQuery(query.id)
                  return bot.sendMessage(chat_id, `Выберите товар который следует удалить:`, getDeleteProductKeyboard(product))
                }
              })
    
              bot.once('callback_query', query => {
                const data = query.data
                if(data !== 'main_menu') {
                  const product_id = data.split('product_id_')[1]
        
                  //Удалить товар который выбрал пользователь
                  Product.deleteOne({ _id: product_id }, async err => {
                    if (err) {
                      return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
                    }
                    else {
                      await bot.sendMessage(chat_id, 'Товар успешно удален. ✅')
                      await bot.answerCallbackQuery(query.id)
                      return bot.sendMessage(chat_id, `Выберите интересующий раздел:`, getMainMenuKeyboard())
                    }
                  })
                }
              })
            }
          })
        }
        else if(data === 'update_product') {
          STATE[chat_id] = 'update_product'
          bot.editMessageReplyMarkup(getBackKeyboard(), { chat_id:chat_id , message_id: message_id })
        }
      })
    } 
    else if(data == 'main_menu') {
      await bot.sendMessage(chat_id, `Выберите интересующий раздел:`, getMainMenuKeyboard())
      //Чтобы стереть слушателей отправки сообщений если состояние пользователя чата небыло завершено
      if(STATE[chat_id] === 0) {
        bot.removeListener('message')
      }
      return bot.answerCallbackQuery(query.id)
    }
  })
}

start()