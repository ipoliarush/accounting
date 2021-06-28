const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  vendor_code: {
    type: Number,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    default: 0
  },
  delivered: {
    type: Number,
    default: 0
  },
  reserved: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    get: getPrice, 
    set: setPrice
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

getPrice(num => {
  (num / 100).toFixed(2)
})

setPrice(num => {
  num * 100
})


module.exports = model('Product', ProductSchema)
