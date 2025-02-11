import React from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ results, onItemClick }) => {
  if (!results.length) {
    return null;
  }

  return (
    <ul className="dropdown-menu">
      {results.map((product) => (
        <li
          key={product.productId}
          className="dropdown-item"
          onClick={() => onItemClick(product.productId)}
        >
          <img
            src={product.productImageUrl}
            alt={product.productName}
            className="dropdown-item-image"
          />
          <span>{product.productName}</span>
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
