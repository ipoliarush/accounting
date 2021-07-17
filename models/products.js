import mongoose from 'mongoose'
const { Schema } = mongoose

const ProductSchema = new Schema({
  name: {
    type: String
  },
  fullname: {
    type: String
  },
  group: {
    type: Object
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

export default mongoose.model('Products', ProductSchema)