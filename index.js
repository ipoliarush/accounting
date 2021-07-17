import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Product from './models/products.js'
import User from './models/users.js'
import { getMainMenuKeyboard, getProductsKeyboard, getSaveProductsKeyboard } from './telegram/keyboards.js'
import bot from './telegram.js'
import startCommand from './controllers/start.js'
import getProducts from './function/getProducts.js'



mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

const start = () => {

  startCommand()

  bot.on('callback_query', async query => {
    const data = await query.data
    const chat_id = await query.message.chat.id

    if(data === 'products') {
      //Выбор всех товаров с группировкой по группам и сортировкой по алфавиту
      Product.find({}, null, { sort:{ 'group.id': -1, name: 'asc' } }, async (err, arr) => {
        if (err) {
          return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
        } else {
          let products = ''
          let group = ''
          //Вывод списка товаров
          for(const element of arr) {
            //Добавить название группы товаров
            if(element.group.id !== group) {
              products += await `\n<b>${element.group.name}</b>:\n`
            }
            products += await `- ${element.name}\n`
            group = element.group.id
          }
          return bot.sendMessage(chat_id, products, getProductsKeyboard())
        }
      })
      
    } else if(data === 'add_product') {

      let product = {}

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
                } else {
                  product.group_name = msg.text.split(/\d+\s/)[1]
                  product.group_id = msg.text.split(' ')[0]
                }

                bot.sendMessage(chat_id, `Наименование: ${product.name}\nПолное наименование: ${product.fullname}\nГруппа: ${product.group_id} ${product.group_name}`, getSaveProductsKeyboard())
                bot.on('callback_query', async query => {
                  if(query.data === 'save_product') {
                    const newProduct = new Product({
                      name: product.name,
                      fullname: product.fullnam,
                      group: {
                        id: product.group_id,
                        name: product.group_name
                      }
                    })

                    newProduct.save(async err => {
                      if (err) {
                        return bot.sendMessage(chat_id, 'Возникли проблемы. Попробуйте еще раз.')
                      } else {
                        await bot.sendMessage(chat_id, 'Товар успешно сохранен. ✅')
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
  })
}

start()