export function getMainMenuKeyboard() { 
  return {
    "parse_mode": "Markdown",
    "reply_markup": {
      "resize_keyboard": true,
      "inline_keyboard": [
        [{ text: "Товары", callback_data: 'products'}],
        [{ text: "Заказы", callback_data: 'orders'}],
        [{ text: "Продажи", callback_data: 'sales'}]
      ]
    }
  }
}

export function getProductsKeyboard() {
  return {
    "parse_mode": "HTML",
    "reply_markup": {
      "resize_keyboard": true,
      "inline_keyboard": [
        [{ text: "Удалить", callback_data: 'delete_product'}, { text: "Изменить", callback_data: 'update_product'}, { text: "Добавить", callback_data: 'add_product'}],
        [{ text: "Главное меню", callback_data: 'main_menu'}]
      ]
    }
  }
}

export function getSaveProductsKeyboard() {
  return {
    "parse_mode": "HTML",
    "reply_markup": {
      "resize_keyboard": true,
      "inline_keyboard": [
        [{ text: "Сохранить", callback_data: 'save_product'}],
        [{ text: "Главное меню", callback_data: 'main_menu'}]
      ]
    }
  }
}

export function getFindOutContactKeyboard() {
  return {
    "parse_mode": "Markdown",
    "reply_markup": {
      "resize_keyboard": true,
      "one_time_keyboard": true,
      "keyboard": [
        [{ text: "Отправить свой телефон", request_contact: true }]
      ]
    }
  }
}