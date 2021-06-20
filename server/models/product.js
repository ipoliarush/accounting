const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  delivered: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

module.exports = model('Product', ProductSchema)
