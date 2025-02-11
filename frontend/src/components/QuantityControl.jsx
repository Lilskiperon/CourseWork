import React from "react";
import './QuantityControl.css';
const QuantityControl = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="item-quantity">
      <div className="quantity-content">
        <button onClick={onDecrease}>
          <svg className="svgicon">
            <use href="/assets/svg/sprite-icons.svg#icon-minus"></use>
          </svg>
        </button>
        <span>{quantity}</span>
        <button onClick={onIncrease}>
          <svg className="svgicon">
            <use href="/assets/svg/sprite-icons.svg#icon-plus"></use>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuantityControl;
