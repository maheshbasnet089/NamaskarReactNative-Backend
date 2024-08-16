
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    consumerId : {
        type : Schema.Types.ObjectId,
        ref : "User",
      
    },
    sellerId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true,"A product must belong to user"] 
    },
  
    message : {
        type : String,
      
    },
    status : {
        type : String, 
        enum : ['read','unread'],
        default : 'unread'
    }
 
},{
    timestamps : true
})

const Notification = mongoose.model('Notification',notificationSchema)

module.exports = Notification