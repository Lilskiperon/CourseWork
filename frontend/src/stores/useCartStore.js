import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	wishlist: [],
    comparison: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	clearCart: async () => {
		try {
			await axios.delete("/cart/all");
			set({ cart: [], coupon: null, total: 0, subtotal: 0 });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");

		}
	},

	addToCart: async (productId) => {
        try {
			const {data: productData} = await axios.get(`/flavors/${productId}`);
			await axios.post("/cart", { productId });
			toast.success("Product added to cart");
			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === productId);
				if(!existingItem){
					const newProduct = { ...productData, quantity: 1};
					const newCart = [...prevState.cart, newProduct ];
            		return {
            	    	cart: newCart,
            		};
				}
			});
            get().calculateTotals();
        } catch (error) {
            console.log("Error adding product to cart:", error.message);
        }
    },
    
    removeFromCart: async (productId) => {
        try {
            await axios.delete(`/cart`, { data: { productId } });
			toast.success("Product removed from cart");
            set((prevState) => ({
                cart: prevState.cart.filter(
                    (item) => item._id !== productId
                ),
            }));
    
            get().calculateTotals(); 
        } catch (error) {
            console.log("Error removing product from cart:", error.message);
        }
    },
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}
		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},
	getWishlist: async () => {
        try {
            const res = await axios.get("/wishlist");
            set({ wishlist: res.data });
        } catch (error) {
            set({ wishlist: [] });
			toast.error(error.response.data.message || "An error occurred");

        }
    },

    getComparison: async () => {
        try {
            const res = await axios.get("/comparison");
            set({ comparison: res.data });
        } catch (error) {
            set({ comparison: [] });
			toast.error(error.response.data.message || "An error occurred");

        }
    },

    addToWishlist: async (product) => {
        try {
            await axios.post("/wishlist", { productId: product._id });
		    toast.success("Product added to wishlist");
            set((prevState) => {
				const newWishlist = [...prevState.wishlist, { ...product }];
				return { wishlist: newWishlist };
			});
        } catch (error) {
            console.error("Error adding to wishlist", error);
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            await axios.delete("/wishlist", { data: { productId } });
			toast.success("Product removed from wishlist");
			set((prevState) => ({
                wishlist: prevState.wishlist.filter(
                    (item) => item._id !== productId
                ),
            }));
        } catch (error) {
            console.error("Error removing from wishlist", error);
        }
    },

    addToComparison: async (product) => {
        try {;
			await axios.post("/comparison", { productId: product._id });
			toast.success("Product added to comparison");
			set((prevState) => {
				const newComparison = [...prevState.comparison, { ...product }];
				return { comparison: newComparison };
			});
        } catch (error) {
            console.error("Error adding to comparison", error);
        }
    },

    removeFromComparison: async (productId) => {
        try {
            await axios.delete("/comparison", { data: { productId } });
			toast.success("Product removed from comparison");
            set((prevState) => ({
                comparison: prevState.comparison.filter(
                    (item) => item._id !== productId
                ),
            }));
        } catch (error) {
            console.error("Error removing from comparison", error);
        }
    },
	calculateItem:(productId) =>{
		const {cart} = get();
		const item = cart.find(item => item._id.toString() === productId.toString());
		return item ? item.packagingId.price * item.quantity : 0;


	},
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.packagingId.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));