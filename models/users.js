import mongoose from 'mongoose'
const { Schema } = mongoose

const UserSchema = new Schema({
  user_id: {
    type: Number
  },
  name: {
    type: String
  },
  phone: {
    type: Number
  },
  email: {
    type: String,
    lowercase: true
  },
  admin:{
    type: Boolean,
    require: true,
    default: false
  },
  super_admin:{
    type: Boolean,
    require: true,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

export default mongoose.model('Users', UserSchema)