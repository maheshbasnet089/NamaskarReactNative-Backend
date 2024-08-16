const { fetchSellerProducts } = require("../controller/adminController")
const { fetchSeller, getSellerProducts, addToCart, getMyCartItems, deleteItemFromCart, rateSeller, editProfile } = require("../controller/consumerController")
const { createOrder, getMyOrders, getSingleOrder, getOrders, updateLocation, getPayments } = require("../controller/orderController")
const { getSingleSellerProduct } = require("../controller/productController")
const isAuthenticated = require("../middleware/isAuthenticated")
const catchAsync = require("../services/catchAsync")

const router = require("express").Router()

router.route("/order").post(isAuthenticated,createOrder).get(isAuthenticated,getMyOrders)
router.route("/orders/payment").get(isAuthenticated,getPayments)
router.route("/orders").get(isAuthenticated,getOrders)
router.route("/order/:id").get(getSingleOrder).patch(updateLocation)

router.route("/sellers").get(catchAsync(fetchSeller))
router.route("/sellers/:id").get(catchAsync(getSellerProducts))
router.route("/cart").get(isAuthenticated,catchAsync(getMyCartItems))

router.route("/cart/:id").post(isAuthenticated,catchAsync(addToCart)).delete(isAuthenticated,catchAsync(deleteItemFromCart))
router.route("/rate/:sellerId").post(isAuthenticated,rateSeller)
router.route("/profile").patch(isAuthenticated,editProfile)

module.exports = router 