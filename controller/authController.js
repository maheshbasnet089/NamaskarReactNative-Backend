const User = require("../model/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerUser = async(req,res)=>{
try {
    const {email,firstName,lastName,role,password,address} = req.body 
    console.log(req.body)
    if(!email || !firstName || !lastName || !role || !password){
        return res.status(400).json({
            message : "Provide email,firstName,lastName,role,password"
        })
    }
   const data = await User.create({
        email,
        firstName,
        lastName,
        role,
        address,
        password : bcrypt.hashSync(password,10)
    })
    console.log(data,"Data")
    res.status(200).json({
        message : "User registered",
        data
    })
} catch (error) {
    console.log(error)
    res.status(400).json({
        message : error.message
    })
}
}

exports.loginUser = async(req,res)=>{
    const {email,password} = req.body
    console.log(req.body)
    if(!email || !password){
        return res.status(400).json({
            message : "Please provide email,password"
        })
    }

    // check if that email user exists or not
    const userFound = await User.find({email : email})
    console.log(userFound)
    if(userFound.length == 0){
        return res.status(404).json({
            message : "User with that email is not Registered"
        })
    }

 
    // password check 
    const isMatched = bcrypt.compareSync(password,userFound[0].password)
    console.log(isMatched)
    if(isMatched){
        // generate token 
       const token = jwt.sign({id : userFound[0]._id},"thisissecret",{
        expiresIn : '30d'
       })

        res.status(200).json({
            message : "User logged in successfully",
           data :  userFound,
           token : token
        })
    }else{
        res.status(400).json({
            message : "Invalid Password"
        })
    }
}