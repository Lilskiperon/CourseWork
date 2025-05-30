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
          <h2> <Package className="success-icon" />Адрес доставки</h2>
          <div className="address-container">
            
           <div className="address-form-container">
           <h3>Оплата и доставка</h3>
            <form onSubmit={handlePayment}>

              <div className="form-group">
                <label>ФИО*</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="ФИО*"
                  value={formDelivery.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Страна/регион*</label>
                <select
                  name="country"
                  value={formDelivery.country}
                  onChange={handleChange}
                  required
                >
                  <option value="Россия">Украина</option>
                  <option value="Украина">Румыния</option>
                  <option value="Беларусь">Молдова</option>
                  <option value="Словакия">Словакия</option>
                  <option value="Венгрия">Венгрия</option>
                  <option value="Польша">Польша</option>
                </select>
              </div>

              <div className="form-group">
                <label>Область*</label>
                <input
                  type="text"
                  name="region"
                  placeholder="Область"
                  value={formDelivery.region}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Город*</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Город"
                  value={formDelivery.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Индекс*</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Индекс"
                  value={formDelivery.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Улица, номер дома, квартира</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Улица, номер дома, квартира"
                  value={formDelivery.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Примечание (необязательно)</label>
                <textarea
                  name="notes"
                  placeholder="Напишите, если есть особые инструкции"
                  value={formDelivery.notes}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="apply-order">
                Подтвердить заказ
              </button>
            </form>
        </div>
        <div className="cart-summary">
          <h3>Ваш Заказ</h3>
          <div className="cart-items">
            <div className="cart-item">
              <div className="cart-item-details">
                <span className="cart-item-header">Товар</span>
                <span className="cart-item-header">Сумма</span>
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
                <p className="cart-item-header">Всего</p>
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