const { Order, Coupon, User } = require('../models');
const  stripe  = require("../config/stripe.js");
require('dotenv').config();

function calculateTotalAmount(products, discountPercentage = 0) {
    let total = 0;
    for (const product of products) {
        const amount = Math.round(product.packagingId.price * 100);
        total += amount * (product.quantity || 1);
    }
    if (discountPercentage > 0) {
        total -= Math.round((total * discountPercentage) / 100);
    }
    return total;
}
exports.createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, deliveryAddress } = req.body;
        let sessionId = req.cookies.NgMassa;
        let user = await User.findOne({ sessionId });
		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = calculateTotalAmount(products);
        const lineItems = products.map((product) => {
        const amount = Math.round(product.packagingId.price * 100);

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: `${product.packagingId.productId.productName} - ${product.flavorName} (${product.packagingId.weight}g)`,
						images: [product.packagingId.productImageUrl],
                        
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
        if (couponCode) {
                coupon = await Coupon.findOne({ code: couponCode, userId: user._id, isActive: true });
                if (coupon) {
                        totalAmount = calculateTotalAmount(products, coupon.discountPercentage);
                }
        }
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/cart?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/cart?session_id=Null`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.packagingId.price,
					}))
				),
				deliveryAddress: JSON.stringify(deliveryAddress),
			}
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(user._id.toString());
		}

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100, currency: "usd" });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

exports.checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		
		const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
		if (existingOrder) {
			return res.status(200).json({
				success: true,
				message: "Order already exists.",
				orderId: existingOrder._id,
				orderNumber: existingOrder.orderNumber,
				orderDate: existingOrder.createdAt,
				totalAmount: existingOrder.totalAmount,
				products: existingOrder.products,
				shippingAddress: existingOrder.shippingAddress,
			});
		}
		
		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}
			const orderNumber = Math.floor(100000 + Math.random() * 900000);
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				orderNumber: orderNumber,
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100,
				stripeSessionId: sessionId,
				shippingAddress: session.metadata.deliveryAddress,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
				orderNumber: orderNumber,
				orderDate: newOrder.createdAt,
				totalAmount: newOrder.totalAmount,
				products: products,
				shippingAddress: newOrder.shippingAddress,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}

exports.calculateTotalAmount = calculateTotalAmount;