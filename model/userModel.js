
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: String,
    lastName : String,
    email : {
        type : String,
        unique : true 
    },
    password : String,
    address : String,
    role : {
        type : String,
        enum : ['seller','consumer','admin']
    },
    cart : [{
        quantity : {
            type : Number,
            required : true
        },
        product : {type : Schema.Types.ObjectId, ref : "Product"}
    }],
    rating: [{
        number: {
            type: Number,
            required: false
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    }


})

const User = mongoose.model('User',userSchema)

module.exports = User