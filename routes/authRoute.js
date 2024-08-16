const { loginUser } = require("../controller/authController")
const { registerUser } = require("../controller/authController")

const router = require("express").Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

module.exports = router