/* eslint-disable react/prop-types */
import './DropdownMenu.css';

const DropdownMenu = ({ results, onItemClick }) => {
  if (!results || !Array.isArray(results)) {
    return null;
  }

  return (
    <ul className="dropdown-menu">
      {results.map((product) => (
        <li
          key={product._id}
          className="dropdown-item"
          onClick={() => onItemClick(product.productId._id, product._id)}
        >
          <img
            src={product.productImageUrl}
            alt={product.productId.productName}
            className="dropdown-item-image"
          />
          <span>{product.productId.productName} - {product.weight}g</span>
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
