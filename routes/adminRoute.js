const { fetchConsumers, fetchSellers, getAllUsers, fetchSellerProducts, fetchSingleProduct, deleteProduct, deleteUser, getNotifications, updateNotification } = require("../controller/adminController")
const isAuthenticated = require("../middleware/isAuthenticated")

const router = require("express").Router()


router.route("/notification").get(isAuthenticated,getNotifications)
router.route("/notification/:id").get(updateNotification)
router.route("/customers").get(fetchConsumers)
router.route("/sellers").get(fetchSellers)
router.route("/users/:id").get(getAllUsers).delete(deleteUser)
router.route("/products").get(fetchSellerProducts)
router.route("/products/:id").get(fetchSingleProduct).delete(deleteProduct)


module.exports = router 