import Product from '../models/products.js'

export default async function getProducts() {
  // //Выбор всех товаров с группировкой по группам и сортировкой по алфавиту
  // Product.find({}, null, { sort:{ 'group.id': -1, name: 'asc' } }, async (err, arr) => {
  //   if (err) {
  //     return bot.sendMessage(user, 'Возникли проблемы. Попробуйте еще раз.')
  //   } else {
  //     let products = group = ''
  //     //Вывод списка товаров
  //     for(const element of arr) {
  //       //Добавить название группы товаров
  //       if(element.group.id !== group) products += await `<b>${element.group.name}</b>:\n`
  //       products += await `${element.name}\n\n`
  //       group = element.group.id
  //     }
  
  //     return bot.sendMessage(chatId, products, keyProducts)
  //   } 
    
  // })

  
}