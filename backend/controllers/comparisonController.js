const { Packaging, User } = require('../models');

exports.getComparisonProducts = async (req, res) => {
    try {
        const sessionId = req.cookies.NgMassa;
        const user = await User.findOne({ sessionId });
        const products = await Packaging.find({ _id: user.comparison }).populate("productId");
        
        res.json(products);
    } catch (error) {
        console.log("Error in getComparisonProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.addToComparison = async (req, res) => {
    try {
        const { productId } = req.body;
        const sessionId = req.cookies.NgMassa;
        
        const user = await User.findOne({ sessionId });
        
        if (!user.comparison.includes(productId)) {
            user.comparison.push(productId);
            await user.save();
        }
        
        res.json(user.comparison);
    } catch (error) {
        console.log("Error in addToComparison controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.removeFromComparison = async (req, res) => {
    try {
        const { productId } = req.body;
        const sessionId = req.cookies.NgMassa;
        
        const user = await User.findOne({ sessionId });
        user.comparison = user.comparison.filter((item)=> item.id.toString() !== productId);
        await user.save();
        
        res.json(user.comparison);
    } catch (error) {
        console.log("Error in removeFromComparison controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
