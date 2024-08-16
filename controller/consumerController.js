const Product = require("../model/productModel")
const User = require("../model/userModel")

exports.fetchSeller = async(req,res)=>{
    const data = await User.find({
        role : "seller"
    })
    res.status(200).json({
        message : "Seller fetched",
        data
    })
}

exports.getSellerProducts = async(req,res)=>{
    const {id} = req.params 
    console.log(id)
    const data = await Product.find({
        userId : id
    }).populate('userId')
    console.log(data)
    res.status(200).json({
        message : "Seller product fetched",
        data
    })
}


exports.addToCart = async(req,res)=>{
    // userId , productId 
    const userId = req.userId
    const {id:productId} = req.params
    if(!productId){
        return res.status(400).json({
            message : "Please provide ProductId"
        })
    }
    const productExist = await Product.findById(productId)
    if(!productExist){
        return res.status(404).json({
            message : "No product with that productId"
        })
    }
    const user = await User.findById(userId)
    // check if that productId already exist or not , yeti xa vaney qty matra badaunu paryo na vaye productId
    const existingCartItem = user.cart.find((item)=>item.product.equals(productId))

    if(existingCartItem){
        existingCartItem.quantity+=1;
    }else{
        user.cart.push({
            product : productId,
            quantity : 1
        })
    }
    await user.save()
    const updatedUser = await User.findById(userId).populate('cart.product')
    console.log(updatedUser)
    res.status(200).json({
        message: "Product added to cart",
       
    })

}

exports.getMyCartItems = async(req,res)=>{
    const userId = req.userId
    const userData = await User.findById(userId).populate({
        path : "cart.product",
       
    }) 
   
    res.status(200).json({
        message : "Cart Item Fetched Successfully",
        data  : userData.cart
    })
}

exports.deleteItemFromCart = async(req,res)=>{
    console.log("hite")
    const {id:productId} = req.params 
    console.log(productId)
    // const {productIds} = req.body 
    const userId = req.userId
    // check if that product exists or not
    const product = await Product.findById(productId)
    console.log(product)
    if(!product){
        return res.status(404).json({
            message : "No product with that productId"
        })
    }
    // get user cart
    const user = await User.findById(userId)
//     productIds.forEach(productIdd=>{
//   user.cart =   user.cart.filter(pId=>pId != productIdd) // [1,2,3] ==> 2 ==>fiter ==> [1,3] ==> user.cart = [1,3]

//     })
user.cart =   user.cart.filter(item=>item.product != productId) // [1,2,3] ==> 2 ==>fiter ==> [1,3] ==> user.cart = [1,3]

  await user.save()
  res.status(200).json({
    message : "Item removed From Cart"
  })
}


exports.rateSeller = async (req, res) => {
    const sellerId = req.params.sellerId;
    const userId = req.userId;
    const ratingNumber = req.body.rating; // Assuming rating is passed in the request body

    try {
        // Find the seller by sellerId
        const seller = await User.findById(sellerId);

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Check if the user has already rated the seller
        const alreadyRated = seller.rating.some(rate => rate.userId.equals(userId));

        if (alreadyRated) {
            return res.status(400).json({ message: 'You have already rated this seller' });
        }

        // Add the new rating to the seller's profile
        seller.rating.push({
            number: ratingNumber,
            userId: userId
        });

        // Calculate new average rating for the seller
        const totalRatings = seller.rating.length;
        let sumRatings = 0;

        seller.rating.forEach(rate => {
            sumRatings += rate.number;
        });

        seller.averageRating = sumRatings / totalRatings;

        // Save the updated seller information
        await seller.save();

        res.status(200).json({ message: 'Rating added successfully', averageRating: seller.averageRating });

    } catch (error) {
        res.status(500).json({ message: 'Error rating the seller', error: error.message });
    }
};

const bcrypt = require('bcrypt')
exports.editProfile = async(req,res)=>{
 try {
    const {email,firstName,lastName,password,address} = req.body 
    console.log(req.body)
    const userId= req.userId

   const data = await User.findByIdAndUpdate(userId,{
        email,
        firstName,
        lastName,
       
        address,
        password : bcrypt.hashSync(password,10)
    },{
        new : true
    })
    console.log(data)
    res.status(200).json({
        message : "Updated successfully"
    })
 } catch (error) {
    console.log(error)
    res.status(500).json({
        message : "Something went wrong"
    })
 }
}