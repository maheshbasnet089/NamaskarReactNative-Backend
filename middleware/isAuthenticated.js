const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const User = require("../model/userModel")

const isAuthenticated = async (req,res,next)=>{
    const token = req.headers.authorization
   console.log(token)
    if(!token){
      return  res.status(403).json({
            message : "Please login"
        })
    }
  try {
    
    const decoded = await promisify(jwt.verify)(token,"thisissecret")
   
    const doesUserExist =  await User.findOne({_id : decoded.id})
    console.log(decoded)
   if(!doesUserExist){
    return res.status(404).json({
        message : "User doesn't exists with that token/id"
    })
   }
   req.user  = doesUserExist
   req.userId = doesUserExist._id

   next()
  } catch (error) {
    res.status(500).json({
        message : error.message
    })
  }

}


module.exports = isAuthenticated