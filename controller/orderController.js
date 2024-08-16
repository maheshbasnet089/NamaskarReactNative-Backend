const Notification = require("../model/notificationModel")
const Order = require("../model/orderModel")
const User = require("../model/userModel")
const axios = require('axios')


exports.createOrder = async(req,res)=>{
 const userId = req.userId
    const {shippingAddress,items,totalAmount,paymentType,phoneNumber,email} = req.body 
    console.log(req.body.items)
    if(!shippingAddress || !items.length > 0 || !totalAmount || !paymentType || !phoneNumber || !email){
        return res.status(400).json({
            message : "Please provide shippingAddress,items,totalAmount,paymentType,phoneNumber,email"
        })
    }
    const to = shippingAddress 
    const sellerId = items[0]?.product?.userId
    const sellerDetails = await User.findById(sellerId) 
    const from = sellerDetails.address
    const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${from}.json?access_token=pk.eyJ1IjoibWFuaXNoYmFzbmV0IiwiYSI6ImNsZjZmeno4aTFtZTczeW56ejdrNDNiNTAifQ.jYh8LZ3edkWkLeGcGdWwDA&country=NP`
      );
      const response2 = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${to}.json?access_token=pk.eyJ1IjoibWFuaXNoYmFzbmV0IiwiYSI6ImNsZjZmeno4aTFtZTczeW56ejdrNDNiNTAifQ.jYh8LZ3edkWkLeGcGdWwDA&country=NP`
      );
      const fromData = response.data.features[0].geometry.coordinates;
      const toData = response2.data.features[0].geometry.coordinates;
    // insert into orders 
    let createdOrder =  await Order.create({
        user : userId,
        shippingAddress,
        totalAmount,
        items,
        paymentDetails:{method:paymentType},
        phoneNumber,
        email,
        sellerId : sellerId,
        fromLatitude : fromData[1],
            fromLongitude : fromData[0],
            toLatitude : toData[1],
            toLongitude : toData[0],
    })
    console.log(createdOrder)
const user = await User.findById(userId)
user.cart = []
await user.save()
items.length > 0 && items.forEach(async(item)=>{
    await Notification.create({
        consumerId:userId,
        message : item?.product?.productName +  "ordered by " + phoneNumber,
        sellerId : item?.product?.userId
    })
})
if(paymentType == "khalti"){
    const data = {
        return_url : "http://localhost:5173/success/",
        purchase_order_id : createdOrder._id,
        amount : totalAmount * 100,
        website_url :"http://localhost:5173/",
        purchase_order_name : 'orderName_' + createdOrder._id
    }
   const response = await  axios.post('https://a.khalti.com/api/v2/epayment/initiate/',data,{
        headers : {
            'Authorization' : 'key 625cc1cff7cb408b8c84df0f7502a634'
        }
    })
    const khaltiResponse = response.data
    createdOrder.paymentDetails.status = 'paid'
    res.status(200).json({
        message : "order placed successfully",
        url : khaltiResponse.payment_url
    })
}else{

    res.status(200).json({
        message : "Order created successfully",
        data : createdOrder
    })
}

}
exports.getMyOrders = async(req,res)=>{
    const userId = req.userId
    const orders = await Order.find({user : userId}).populate({
        path:"items.product",
        model : "Product",
        // select : "-productStockQty -createdAt -updatedAt -reviews -__v"
    })
    if(orders.length == 0 ){
        return res.status(404).json({
            message : "No orders",
            data : []
        })
    }
    console.log(orders,"Orders")
    res.status(200).json({
        message : "Orders Fetched Successfully",
        data : orders
    })
}

exports.updateMyOrder = async(req,res)=>{
    const userId = req.user.id 
    const {id} = req.params
    const {shippingAddress,items } = req.body
    if(!shippingAddress || items.length == 0){
        return res.status(400).json({
            message : "Please provide shippingAddress,items"
        })
    } 
 // get order of above id 
 const existingOrder = await Order.findById(id) 
 if(!existingOrder ){
    return res.status(404).json({
        message : "No order with that id"
    })
 }
 // check if the trying to update user is true ordered User 
 if(existingOrder.user !== userId){
    return res.status(403).json({
        message : "You don't have permission to update this order"
    })
 }

 if( existingOrder.orderStatus == "ontheway") {
   return res.status(400).json({
    message : "You cannot update order when it is on the way "
   })
 }
const updatedOrder =  await Order.findByIdAndUpdate(id,{shippingAddress,items},{new:true})
res.status(200).json({
    message : "Order updated Successfully",
    data : updatedOrder
})

}


exports.deleteMyOrder = async(req,res)=>{
    const userId = req.user.id 
    const {id} = req.params 

    // check if order exists or not 
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "No order with that id"
        })
    }
    if(order.user != userId){
       return res.status(400).json({
        message : "You don't have permission to delete this order"
       })
    }
    if(order.orderStatus !=="pending"){
        return res.status(400).json({
            message : "You cannot delete this order as it is not pending"
        })
    }
    await Order.findByIdAndDelete(id)
    res.status(200).json({
        message : "Order deleted successfully",
        data : null
    })
}

exports.cancelOrder = async(req,res)=>{
    const {id}  = req.body 
    const userId = req.user.id 
  

    // check if order exists or not
    const order = await Order.findById(id)
    if(!order){
        return res.status(400).json({
            message : "No order with that id"
        })
    }

    if(order.user != userId){
       return res.status(400).json({
        message : "You don't have permission to delete this order"
       })
    }
    if(order.orderStatus !=="pending"){
        return res.status(400).json({
            message : "You cannot cancel this order as it is not pending"
        })
    }
   const updatedOrder =  await Order.findByIdAndUpdate(id,{
        orderStatus : "cancelled"
    },{new:true})
    res.status(200).json({
        message : "Order cancelled successfully",
        data : updatedOrder
    })

} 


exports.getSingleOrder = async(req,res)=>{
    console.log("hitted")
try {
    const orderId = req.params.id 
    const data = await Order.findById(orderId).populate({
        path : 'items.product'
    }).populate('user')
    console.log(data)
    res.status(200).json({
        message : "Single order fetched successfully",
        data
    })
} catch (error) {
    console.log(error)
}
}
exports.getOrders = async(req,res)=>{
    console.log('hited')
try {
    const userId = req.userId
    const data = await Order.find({
        sellerId : userId
    }).populate('user')
    console.log(data)
    res.status(200).json({
        message : " orders fetched successfully",
        data
    })
} catch (error) {
    console.log(error)
}
}

exports.updateLocation = async(req,res)=>{
    console.log('hited')
try {
    const orderId = req.params.id 

    const {currentAddress} = req.body
    const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${currentAddress}.json?access_token=pk.eyJ1IjoibWFuaXNoYmFzbmV0IiwiYSI6ImNsZjZmeno4aTFtZTczeW56ejdrNDNiNTAifQ.jYh8LZ3edkWkLeGcGdWwDA&country=NP`
      );
 
      const fromData = response.data.features[0].geometry.coordinates;
   
    const data = await Order.findByIdAndUpdate(orderId,{
        fromLatitude : fromData[1],
        fromLongitude : fromData[0]
    },{new:true})
    console.log(data)
    res.status(200).json({
        message : "orders updated successfully",
        data
    })
} catch (error) {
    console.log(error)
}
}

exports.getPayments = async(req,res)=>{
    try {
        const userId = req.userId
        const data = await Order.find({
            user : userId,
        
        })
        console.log(data)
        res.status(200).json({
            message : "payments fetched successfully",
            data
        })
    } catch (error) {
        console.log(error)
    }
}