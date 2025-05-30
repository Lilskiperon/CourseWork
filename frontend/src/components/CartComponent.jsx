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
    const handleSubmit = (e) => {
      e.preventDefault();
      if (user && user.isGuest === false) {
        setActiveTab(2);
      }
      else{
        const cleanPhone = (formData.phone || "").replace(/[+\s]/g, "");
        formData.phone = cleanPhone;
        let result;
        if (activeOption === "new") {
          result = signup(formData);
        } else {
          result = login(formData);
        }

        if (result.success==true) {
          setActiveTab(2);
        }
      }
    };
    return (
        <>
        <h2><ShoppingBasket className="success-icon" />Корзина</h2>
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
                <th>ТОВАР</th>
                <th>ЦЕНА</th>
                <th>КОЛИЧЕСТВО</th>
                <th>ПОДЫТОГ</th>
              </tr>
            </thead>
              <tbody>
                {cart.map((product, index) => (
                  <tr key={product._id || index}>
                    <td>
                      <svg
                        className="svgicon"
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
                    <th>Цена без скидки:</th>
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
                    <th>Скидка:</th>
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
                  <th>Всего:</th>
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
                <h3>Личные данные</h3>
                <div className="personal-data-form">
                  <form className="form-method" onSubmit={handleSubmit}>
                  {!user && user.isGuest === true ? (<div className="tabs">
                    <div 
                      className={`tab ${activeOption === "new" ? "active" : ""}`} 
                      onClick={() => setaActiveOption("new")}
                    >
                      Новый клиент
                    </div>
                    <div 
                      className={`tab ${activeOption === "existing" ? "active" : ""}`} 
                      onClick={() => setaActiveOption("existing")}
                    >
                      Постоянный клиент
                    </div>
                  </div>) : null}
                  <div className="tabs-content">
                      {user && user.isGuest === false ? (
                      <div className="user-info">
                        <div className="form-group">
                          <label>Имя</label>
                          <div>{user.firstName}</div>
                        </div>
                        <div className="form-group">
                          <label>Фамилия</label>
                          <div>{user.lastName}</div>
                        </div>
                        <div className="form-group">
                          <label>Телефон</label>
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
                        <label>Имя</label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Введите имя"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Фамилия</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Введите фамилию"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Ваш телефон</label>
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
                        <label>Ваша почта</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Введите e-mail"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Ваш пароль</label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Введите пароль"
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
                          <label htmlFor="remember">Запомнить меня</label>
                        </div>
                        <div className="forgot-password">
                          <Link to="/forgot-password">Забыли пароль?</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                  </div>
                  <button className="apply-order">Оформить заказ</button>
                  </form>
                </div>
                
                </motion.div>
              </div>
            </div>
        </>
    );
}

export default CartComponent;