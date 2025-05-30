const express = require('express');
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.post('/logout',  authController.logoutUser);
router.get("/profile", authController.getProfile);
router.get("/check-guest", authController.checkOrCreateGuest);

module.exports = router;
