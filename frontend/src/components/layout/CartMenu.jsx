import React, { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartMenu.css';
import QuantityControl from "../QuantityControl";

const CartMenu = ({ isVisible, onClose }) => {
  const { cartItems, total, increaseQuantity, decreaseQuantity, handleRemoveFromCart } = useCart();
  const cartRef = useRef(null);

  // Обработчик клика вне корзины
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }


    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isVisible, onClose]);

  return (
    <div className={`cart-menu-wrapper ${isVisible ? 'visible' : ''}`}>
      <div ref={cartRef} className="cart-menu">
        <div className="card-header">
          <h1>Товары</h1>
          <span onClick={onClose}>Закрыть 
            <svg className="svgicon">
              <use href="/assets/svg/sprite-icons.svg#icon-close"></use>
            </svg>
          </span>
        </div>
        <div className="horizontal_line"></div>
        <div className="cart-content">
          {cartItems.map((product) => (
            <div className="cart-item" key={product.productId}>
              <div className="item-block">
                <img src={product.productImageUrl} alt={product.productName} />
                <div className="item-info">
                  <span className="item-name">
                    {product.productName}
                  </span>
                  <QuantityControl
                    quantity={product.quantity}
                    onIncrease={() => increaseQuantity(product.productId)}
                    onDecrease={() => decreaseQuantity(product.productId)}
                  />
                  <span className="item-price">{product.price * product.quantity} $</span>
                </div>
              </div>
              <svg className="delete-btn" onClick={() => handleRemoveFromCart(product.productId)}>
                <use href="/assets/svg/sprite-icons.svg#icon-close"></use>
              </svg>
            </div>
          ))}
        </div>
        <div className="horizontal_line"></div>
        <div className="total">
          <h1>Подытог</h1>
          <h1>{total} $</h1>
        </div>
        <Link to="/cart" onClick={onClose} className="checkout-btn">Оформить заказ</Link>
      </div>
    </div>
  );
};

export default CartMenu;
