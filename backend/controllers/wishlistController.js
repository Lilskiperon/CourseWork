const { Packaging, User } = require('../models');

exports.getWishlistProducts = async (req, res) => {
    try {
        const sessionId = req.cookies.NgMassa;
        const user = await User.findOne({ sessionId });
        const products = await Packaging.find({ _id: user.wishlist }).populate("productId");
        
        res.json(products);
    } catch (error) {
        console.log("Error in getWishlistProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const sessionId = req.cookies.NgMassa;
        
        const user = await User.findOne({ sessionId });
        
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        
        res.json(user.wishlist);
    } catch (error) {
        console.log("Error in addToWishlist controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const sessionId = req.cookies.NgMassa;
        
        const user = await User.findOne({ sessionId });
        user.wishlist = user.wishlist.filter((item)=> item.id.toString() !== productId);
        await user.save();
        
        res.json(user.wishlist);    
    } catch (error) {
        console.log("Error in removeFromWishlist controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
