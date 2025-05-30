const { Flavor, User } = require('../models');


// Получение товаров из корзины
exports.getCartProducts = async (req, res) => {
	try { 
        const sessionId = req.cookies.NgMassa;
        const user = await User.findOne({ sessionId });
		const products = await Flavor.find({ _id:  user.cartItems.map(item=>item.product) }).populate("packagingId").populate({
            path: "packagingId",
            populate: { path: "productId" }
        });; 
        
		const cartItems = products.map((product) => {
			const item = user.cartItems.find((cartItem) =>
				cartItem.product.toString() === product._id.toString()
			);
			return { 
                ...product.toJSON(), 
                quantity: item.quantity, 
            };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
exports.addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
        const sessionId = req.cookies.NgMassa;

        const user = await User.findOne({ sessionId });

		const existingItem = user.cartItems.find((item) =>
			item.product.toString() === productId 
		);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId,  quantity: 1 });
		}

		await user.save();
        
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}
    
exports.updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity  } = req.body;

        const sessionId = req.cookies.NgMassa;

        const user = await User.findOne({ sessionId });

        const existingItem = user.cartItems.find((item) =>
            item.product.toString() === productId
        );
        if (existingItem) {
            if (quantity === 0) {
                    user.cartItems = user.cartItems.filter((item) => item.id.toString() !== productId );
                    await user.save();
                    return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
           
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const sessionId = req.cookies.NgMassa;
        const user = await User.findOne({ sessionId });
        const existingItemIndex = user.cartItems.findIndex((item) =>
            item.product.toString() === productId 
        );

        if (existingItemIndex !== -1) {
            user.cartItems.splice(existingItemIndex, 1);
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("Error in removeFromCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.removeAllFromCart = async (req, res) => {
	try {
		const sessionId = req.cookies.NgMassa;
        const user = await User.findOne({ sessionId });
        user.cartItems = [];
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
    