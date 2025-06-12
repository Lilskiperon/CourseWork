import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./CartMenu.css";
import QuantityControl from "../components/QuantityControl";
import { useCartStore } from "../stores/useCartStore";
// eslint-disable-next-line react/prop-types
const CartMenu = ({ isVisible, onClose }) => {
  const {cart, calculateItem, updateQuantity, removeFromCart, total} = useCartStore();
  const cartRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose();
      }
    };
    const cartContent = document.getElementsByClassName('cart-content');
    if (cart.length > 5){
      cartContent[0].style.overflowY = "auto";
    }
    else{
      cartContent[0].style.overflowY = "hidden";
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isVisible, onClose]);

  return (
    <div className={`cart-menu-wrapper ${isVisible ? "visible" : ""}`}>
      <div ref={cartRef} className="cart-menu">
        <div className="card-header">
          <h1>Goods</h1>
          <span onClick={onClose}>
            Close
            <svg className="svgicon">
              <use href="/assets/svg/sprite-icons.svg#icon-close"></use>
            </svg>
          </span>
        </div>
        <div className="horizontal_line"></div>
        <div className="cart-content">
          <AnimatePresence>
            {cart.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="cart-item"
              >
                <div className="item-block">
                  <img src={product.packagingId.productImageUrl} alt={product.packagingId.productId.productName} />
                  <div className="item-info">
                    <span className="item-name">
                      {product.packagingId.productId.productName.length > 20
                        ? product.packagingId.productId.productName.slice(0, 20) + "..."
                        : product.packagingId.productId.productName}{" "}
                      ({product.packagingId.weight} g)
                    </span>
                    <span className="item-flavor">{product.flavorName}</span>
                    <QuantityControl
                      quantity={product.quantity}
                      onIncrease={() => updateQuantity(product._id, product.quantity + 1)}
                      onDecrease={() => updateQuantity(product._id, product.quantity - 1)}
                    />
                    <span className="item-price">{calculateItem(product._id)} $</span>
                  </div>
                </div>
                <svg className="delete-btn" onClick={() => removeFromCart(product._id)}>
                  <use href="/assets/svg/sprite-icons.svg#icon-close"></use>
                </svg>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="horizontal_line"></div>
        <div className="total">
          <h1>Summary</h1>
          <h1>{total} $</h1>
        </div>
        <Link to="/cart" onClick={onClose} className="checkout-btn">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
};

export default CartMenu;
