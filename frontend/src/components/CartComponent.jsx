import  { useState,useEffect } from "react";
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import { ShoppingBasket } from 'lucide-react';
import InputMask from "react-input-mask";
import { motion } from "framer-motion";
import QuantityControl from "../components/QuantityControl";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const CartComponent= ({ setActiveTab}) => {
    const { user, login,signup } = useUserStore();
    const [userInputCode, setUserInputCode] = useState("");
    const [activeOption, setaActiveOption] = useState("new");
    const {
      cart,
      total,
      coupon,
      isCouponApplied,
      applyCoupon,
      getMyCoupon,
      updateQuantity,
      calculateItem,
      removeFromCart,
    } = useCartStore();
      
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        rememberMe: false,
      });

    useEffect(() => {
		  getMyCoupon();
	  }, [getMyCoupon]);
    
    useEffect(() => {
	  	if (coupon) setUserInputCode(coupon.code);
	  }, [coupon]);
    const handleApplyCoupon = () => {
	  	if (!userInputCode) return;
	  	applyCoupon(userInputCode);
      
	  };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSubmit = async(e) => {
      e.preventDefault();
      if (user && user.isGuest === false) {
        setActiveTab(2);
      }
      else{
        const cleanPhone = (formData.phone || "").replace(/[+\s]/g, "");
        formData.phone = cleanPhone;
        let result
        if (activeOption === "new") {
          result = await signup(formData)
        } else {
          result = await login(formData)
        }

        if (result.success) {
          setActiveTab(2);
        }
      }
    };
    return (
        <>
        <h2><ShoppingBasket className="success-icon" />Basket</h2>
            <div className="cartpage-content">
            <motion.div
              className="table-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
            <table>
            <thead>
              <tr>
                <th></th>
                <th>GOODS</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>SUMMARY</th>
              </tr>
            </thead>
              <tbody>
                {cart.map((product, index) => (
                  <tr key={product._id || index}>
                    <td>
                      <svg
                        className="svgicon  delete-btn"
                        onClick={() => removeFromCart(product._id)}
                      >
                        <use href="/assets/svg/sprite-icons.svg#icon-close"></use>
                      </svg>
                    </td>
                    <td>
                      <div className="cartproduct-title">
                        <img src={product.packagingId.productImageUrl} alt={product.packagingId.productId.productName} />
                        <div className="cartproduct-info">
                          {product.packagingId.productId.productName}({product.packagingId.weight} g)
                          <p>{product.flavorName}</p>
                        </div>
                      </div>
                    </td>
                    <td>{product.packagingId.price} $</td>
                    <td>
                    <QuantityControl quantity={product.quantity} onIncrease={() => updateQuantity(product._id, product.quantity + 1)}  onDecrease={() => updateQuantity(product._id, product.quantity - 1)}/>
                    </td>
                    <td>{calculateItem(product._id)} $</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {isCouponApplied && (
                <>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Price without discount:</th>
                    <th>
                      {/* Показываем цену без скидки */}
                      {coupon 
                        ? `${Math.round(total / (1 - coupon.discountPercentage / 100))} $`
                        : coupon && coupon.discountType === "fixed"
                        ? `${total + coupon.discountPercentage} $`
                        : null}
                    </th>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Discount:</th>
                    <th>
                      {coupon.discountPercentage}%
                    </th>
                  </tr>
                  
                </>
              )}
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Total:</th>
                  <th>{total} $</th>
                </tr>
              
              </tfoot>
            </table>
            <div className="cart-coupon">
                <input
                  type="text"
                  placeholder='Enter code here'
                  className="coupon-input"
                  value={userInputCode}
                  onChange={(e) => setUserInputCode(e.target.value)}
                />
                <button className="apply-coupon" onClick={handleApplyCoupon}>Apply Code</button>
              </div>
            </motion.div>
            <div className="content-options">
              <motion.div
                className="personal-data"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <h3>Personal data</h3>
                <div className="personal-data-form">
                  <form className="form-method" onSubmit={handleSubmit}>
                  {user.isGuest === true ? (<div className="tabs">
                    <div 
                      className={`tab ${activeOption === "new" ? "active" : ""}`} 
                      onClick={() => setaActiveOption("new")}
                    >
                      New customer
                    </div>
                    <div 
                      className={`tab ${activeOption === "existing" ? "active" : ""}`} 
                      onClick={() => setaActiveOption("existing")}
                    >
                      Regular customer
                    </div>
                  </div>) : null}
                  <div className="tabs-content">
                      {user && user.isGuest === false ? (
                      <div className="user-info">
                        <div className="form-group">
                          <label>Name</label>
                          <div>{user.firstName}</div>
                        </div>
                        <div className="form-group">
                          <label>Last name</label>
                          <div>{user.lastName}</div>
                        </div>
                        <div className="form-group">
                          <label>Telephone</label>
                          <div>{user.phone}</div>
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <div>{user.email}</div>
                        </div>
                      </div>
                    ) :activeOption === "new" ? (
                    <div className="login-form">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Your phone</label>
                          <InputMask
                            type="tel"
                            name="phone"
                            mask="+38 999 999 99 99" 
                            placeholder="+38 067 922 22 22"
                            onChange={handleChange}
                            required
                          />
                      </div>
                      <div className="form-group">
                        <label>Your mail</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter e-mail"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Your password</label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    ) : (<div className="tab-content">
                    <div className="login-form"> 
                      <div className="form-group">
                        <input type="text" name="email" placeholder="E-mail" onChange={handleChange} required />
                      </div>
                      <div className="form-group">
                        <input type="text" name="password" placeholder="Пароль" onChange={handleChange} required />
                      </div>
                      <div className="forgotRemember-group">
                        <div className="remember-me">
                          <input
                            type="checkbox"
                            id="remember"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                          />
                          <label htmlFor="remember">Remember me</label>
                        </div>
                        <div className="forgot-password">
                          <Link to="/forgot-password">Forgot your password?</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                  </div>
                  <button className="apply-order">Place an order</button>
                  </form>
                </div>
                
                </motion.div>
              </div>
            </div>
        </>
    );
}

export default CartComponent;