const { loginUser } = require("../controller/authController")
const { registerUser } = require("../controller/authController")
const { createProduct, getProducts, getMyProducts, getSingleSellerProduct } = require("../controller/productController")
const isAuthenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")
const catchAsync = require("../services/catchAsync")

const router = require("express").Router()
const {multer,storage  } = require("../middleware/multerConfig")

const upload = multer({storage : storage})

router.route("/product").post(isAuthenticated,
upload.array('image'),
 catchAsync(createProduct)).get(catchAsync(getProducts))

 router.route("/myproducts").get(isAuthenticated,catchAsync(getMyProducts))
 router.route("/myproducts/:id").get(isAuthenticated,catchAsync(getSingleSellerProduct))
module.exports = router