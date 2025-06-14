import  { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { useCartStore } from '../stores/useCartStore';
const stripePromise = loadStripe(
	"pk_test_51R6ycNI7hbNwoKlKmJ7uGlSEbv71ntojpkZuifUUDuy1E55UKJ349uB7f6MiKQZz2hjbkt8Vc0DFhoC4JuIz1QnX00Gi2qZ37v"
);
const DeliveryAddressComponent = () => {
    const{cart,coupon,total}=useCartStore();

    useEffect(() => {
        const savedAddress = localStorage.getItem("deliveryAddress");
        if (savedAddress) {
          setFormDelivery(JSON.parse(savedAddress));
        }
      }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
		const stripe = await stripePromise;
		const res = await axios.post("/payments/create-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
      deliveryAddress: toString(formDelivery.fullName+", "+formDelivery.country+", "+formDelivery.region+", "+formDelivery.city+", "+formDelivery.postalCode+", "+formDelivery.address), 
		});

		const session = res.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			console.error("Error:", result.error);
		}
	};

    const [formDelivery, setFormDelivery] = useState({
        fullName:"",
        country: "",
        region: "",
        city: "",
        postalCode: "",
        address: "",
        notes: "",
      });
      
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formDelivery, [name]: value };
        setFormDelivery(updatedData);
        localStorage.setItem("deliveryAddress", JSON.stringify(updatedData));
    };

    return(
        <>
          <h2> <Package className="success-icon" />Delivery address</h2>
          <div className="address-container">
            
           <div className="address-form-container">
           <h3>Payment and delivery</h3>
            <form onSubmit={handlePayment}>

              <div className="form-group">
                <label>Full name*</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name*"
                  value={formDelivery.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Country*</label>
                <select
                  name="country"
                  value={formDelivery.country}
                  onChange={handleChange}
                  required
                >
                  <option value="Ukraine">Ukraine</option>
                  <option value="Romania">Romania</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Poland">Poland</option>
                </select>
              </div>

              <div className="form-group">
                <label>Region*</label>
                <input
                  type="text"
                  name="region"
                  placeholder="Region"
                  value={formDelivery.region}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>City*</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formDelivery.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Index*</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Index"
                  value={formDelivery.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Street, house number, apartment</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street, house number, apartment"
                  value={formDelivery.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Note (optional)</label>
                <textarea
                  name="notes"
                  placeholder="Please write if there are any special instructions."
                  value={formDelivery.notes}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="apply-order">
                Confirm order
              </button>
            </form>
        </div>
        <div className="cart-summary">
          <h3>Your Order</h3>
          <div className="cart-items">
            <div className="cart-item">
              <div className="cart-item-details">
                <span className="cart-item-header">Goods</span>
                <span className="cart-item-header">Amount</span>
              </div> 
              {cart.map((product, index) => (
                  <div key={index} className="cart-item-details">
                    <span className="cart-item-info">{product.packagingId.productId.productName} - ({product.flavorName}), {product.packagingId.weight}г x {product.quantity}</span>
                    <span className="cart-item-price">
                      {(product.packagingId.price * product.quantity).toFixed(2)} $
                    </span>
                  </div>  
              ))}
              <div className="cart-item-details">
                <p className="cart-item-header">Total</p>
                <p className="cart-item-price">{total.toFixed(2)} $</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    )
};
export default DeliveryAddressComponent;