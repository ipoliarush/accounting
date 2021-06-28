const { Schema, model } = require('mongoose')

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  vendorCode: {
    type: Number,
    required: true,
    trim: true
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

module.exports = model('Group', GroupSchema)
