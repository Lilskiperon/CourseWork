import React, { useState }  from "react";
import { debounce } from 'lodash';
import { searchProducts } from '../../api/products';
import { useNavigate,Link } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import CartMenu from './CartMenu';
import DropdownMenu from './DropdownMenu'; 
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const {authState} = useAuth();
  const navigate = useNavigate(); 
  const {
    cart, wishlist, comparison,total
  } = useCart();
  
  const toggleMenu = () => {
    if (authState.isAuthenticated === true) {
      navigate('/profile');
    }
    else{
      setIsMenuVisible((prev) => !prev);
    }
  };
  
  const toggleCart = () => {
      setIsCartVisible((prev) => !prev); 
  };

  // Функция для поиска товаров
  const searchProductsDebounced = debounce(async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const data = await searchProducts(searchTerm); 
      setResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Ошибка при поиске товаров:', error);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchProductsDebounced(value);
  };

  const handleResultClick = (productId) => {
    console.log('Выбран товар с ID:', productId);
    setShowDropdown(false); 
  };

  return (
    <div className="wrapper">
    <div style={{
          top: "85px",
          position: "absolute",
        }} className="horizontal_line"></div>
    <header>
      <div className="header__container _container">
        <div className="nav_block" style={{ height: "85px" }}>
          <div className="logo">
            <Link to="/">
              <img src="/assets/img/logoSite.png" alt="Logo" />
            </Link>
            <div className="text_logo">
              <h1>Интернет-магазин</h1>
              <h1>
                <b>NG-MASSA</b>
              </h1>
            </div>
          </div>
          <div className="vertical_line"></div>
          <div className="search-box">
            <input
              type="text"
              id="productSearch"
              value={query}
              onChange={handleInputChange}
              placeholder="Введите название товара"
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && (
              <DropdownMenu results={results} onItemClick={handleResultClick} />
            )}
            <button>
            <svg className="svgicon">
              <use href="/assets/svg/sprite-icons.svg#icon-search"></use>
            </svg>
            </button>
          </div>
          <div className="vertical_line"></div>
          <div className="icons_support">
            <a href="#">
              <svg className="svgicon">
                <use href="/assets/svg/sprite-icons.svg#icon-email"></use>
              </svg>
            </a>
            <a href="#">
              <svg className="svgicon">
                <use href="/assets/svg/sprite-icons.svg#icon-telegram-blue"></use>
              </svg>
            </a>
          </div>
        </div>
        <div className="nav_block" style={{ height: "55px" }}>
          <div className="menu">
            <ul>
              <div className="moreItems">
                <li>
                  <Link to="/catalog">
                    <svg className="svgicon">
                      <use href="/assets/svg/sprite-icons.svg#icon-more-items"></use>
                    </svg>
                    <span>Каталог</span>
                  </Link>
                </li>
              </div>
              <li><Link to="/catalog?category=Protein">Протеиновые добавки</Link></li>
              <li><Link to="/catalog?category=Amino+Acids">Аминокислоты</Link></li>
              <li><Link to="/catalog?category=Vitamins">Витамины и минералы</Link></li>
              <li><Link to="/catalog?category=Mass+Gainer">Гейнеры</Link></li>
              <li><Link to="/catalog?category=Fat+burners">Жиросжигатели</Link></li>
            </ul>
          </div>
          <div className="icons"> 
            <div className="icon-wrapper">
            <svg className="svgicon" onClick={toggleMenu}>
              <use href="/assets/svg/sprite-icons.svg#icon-user"></use>
            </svg>

            {isMenuVisible && (
            <div className={`auth-menu ${isMenuVisible ? 'visible' : ''}`}>
              <div className="menu-pointer"></div> 
                <div className="menu-option">
                  <Link to="/login">
                    <button className="menu-btn">Вход</button>
                  </Link>
                </div>
                <div className="menu-option">
                  <Link to="/register">
                    <button className="menu-btn registration">Регистрация</button>
                  </Link>
                </div>
            </div>
            )}
            </div>

            <div className="icon-wrapper">
            <Link to="/compare">
            <svg className="svgicon">
              <use href="/assets/svg/sprite-icons.svg#icon-comparison"></use>
            </svg>
            </Link>
            <div className="tooltip-badge">{comparison.length}</div>
            </div>
            
            <div className="icon-wrapper">
            <Link to="/favorites">
            <svg className="svgicon">
              <use href="/assets/svg/sprite-icons.svg#icon-favorite"></use>
            </svg>
            </Link>
            <div className="tooltip-badge">{wishlist.length}</div>
            </div>

            <div className="icon-wrapper">
            <div className="cart">
              <svg className="svgicon" onClick={toggleCart}>
                <use href="/assets/svg/sprite-icons.svg#icon-cart"></use>
              </svg>
              <div className="cartInfo">
                <span className="price_item">{total} $</span>
                <span className="amount_items">{cart.length} товаров</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    {/* Корзина */}
    <CartMenu isVisible={isCartVisible} onClose={toggleCart} />

    </div>
  );
};

export default Header;
