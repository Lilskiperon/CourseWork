const { Coupon,User } = require('../models');

exports.getCoupon = async (req, res) => {
  try {
    const sessionId = req.cookies.NgMassa;
    const user = await User.findOne({ sessionId });
    const coupon = await Coupon.findOne({ userId: user._id, isActive: true });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const sessionId = req.cookies.NgMassa;
    const user = await User.findOne({ sessionId });
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code, userId: user._id, isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};