const mongoose = require('mongoose')
const seedAdmin = require('../adminSeeder')

const connectToDB = async()=>{
     mongoose.connect('mongodb+srv://easygrocery:easygrocery@cluster0.i1v1xmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
        console.log("connected to database")
     })
     seedAdmin()
     .catch((err)=>{
        console.log(err)
     })
}

module.exports = connectToDB