const bcrypt = require("bcrypt")
const User = require("./model/userModel")

async function seedAdmin(){
    const [data] = await User.find({
        
            email : "admin@gmail.com"
        
    })
    if(data){
       console.log("admin already seeded")
       return
    }
    await User.create({
        email : "admin@gmail.com",
        password : bcrypt.hashSync("password",8),
        role : "admin",
        firstName : 'admin',
        lastName : "admin"
    })
    console.log("Admin seeded successfuly")

}

module.exports = seedAdmin