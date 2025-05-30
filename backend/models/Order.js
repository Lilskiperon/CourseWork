const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		orderNumber: {
			type: String,
			required: true,
			unique: true,
			default: () => `ORD-${Date.now()}`,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Flavor",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		stripeSessionId: {
			type: String,
			unique: true,
		},
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		shippingAddress: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
