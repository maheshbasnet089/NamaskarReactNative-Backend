const Product = require("../model/productModel")

exports.createProduct = async(req,res)=>{


const {userId} = req
const [file] = req.files
console.log(file)
let filePath
 if(!file){
  filePath ="https://www.shutterstock.com/image-photo/fresh-fruits-260nw-372770197.jpg"
 }else{
  filePath = req.files[0].filename
 }
  const {productName,productDescription,productType,productPrice,productStatus,productDiscount,productStockQty} = req.body
//   if(!productName || !productDescription || !productPrice || !productStatus || !productStockQty || !productType){
//       return res.status(400).json({
//           message : "Please provide productName,productDescription,productPrice,productStatus,productStockQty,productType"
//       })
//   }
  // insert into the Product collection/table
const productCreated =  await Product.create({
      productName ,
      productDescription ,
      productPrice,
      productStatus,
      productStockQty,
      productType,
      productImage : file ? "http://10.0.2.2:3000/" +  filePath : filePath,
      userId,
      productDiscount

  })
  res.status(200).json({
      message : "Product Created Successfully",
      data : productCreated
  })

}


exports.getProducts = async(req,res)=>{
    const products = await Product.find().populate("userId")
    res.status(200).json({
        message : "Product Fetched",
        data:products
    })
}

exports.getMyProducts = async(req,res)=>{
    const products = await Product.find({
        userId : req.userId
    })
    console.log(products)
    res.status(200).json({
        message : "Product Fetched",
        data:products
    })
}

exports.getSingleSellerProduct = async(req,res)=>{
    const {id} = req.params 
    const products = await Product.find({
        userId : req.userId, 
        _id : id
    })
    res.status(200).json({
        message : "Product fetched",
        data : products
    })
}