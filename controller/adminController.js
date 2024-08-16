const Notification = require("../model/notificationModel")
const Product = require("../model/productModel")
const User = require("../model/userModel")

exports.getAllUsers = async(req,res)=>{
    const data = await User.find()


    res.status(200).json({
        message : "User fetched",
        data 
    })
}

exports.fetchSellers = async(req,res)=>{
    const data = await User.find({
        
            role : "seller"
        
    })
    console.log(data)
    res.status(200).json({
        message : "user fetched successfully",
        data
    })
}

exports.fetchConsumers = async (req,res)=>{
    const data = await User.find({
        
            role : "consumer"
        
    })
    console.log(data)
    res.status(200).json({
        message : "Customer fetched",
        data
    })
}

exports.fetchSellerProducts = async(req,res)=>{
    
    const data = await Product.find().populate('userId')
    console.log(data)
    res.status(200).json({
        message : "Product fetched",
        data
    })

}

exports.fetchSingleProduct = async (req,res)=>{
    const {id} = req.params
    const data = await Product.findById(id)
    res.status(200).json({
        message : "Single Product fetched",
        data
    })
}

exports.deleteProduct = async(req,res)=>{
    const {id} = req.params 
    const data  = await Product.findByIdAndDelete(id)
    res.status(200).json({
        message : "Product deleted successfully"
    })
}

exports.deleteUser = async(req,res)=>{
    const {id} = req.params 
    const data  = await User.findByIdAndDelete(id)
    res.status(200).json({
        message : "User deleted successfully"
    })
}


exports.getNotifications = async(req,res)=>{
    const userId = req.userId 
    const data = await Notification.find({
        sellerId : userId,
        status : 'unread'
    })
    res.status(200).json({
        message : "Notification fetched",
        data
    })
}

exports.updateNotification = async(req,res)=>{
    console.log(req.params.id)
   await Notification.findByIdAndUpdate(req.params.id,{
    status : 'read'
   })
   res.status(200).json({
    message : "notification updated"
   })
}