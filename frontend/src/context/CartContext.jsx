import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, getWishlist, getComparison, addToCart, removeFromCart, addToWishlist, removeFromWishlist, addToComparison, removeFromComparison } from '../utils/utils';
import { getProductsByIds,getProductById} from '../api/products';
import ToastNotification from '../components/layout/ToastNotification';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(getCart());
    const [wishlist, setWishlist] = useState(getWishlist());
    const [comparison, setComparison] = useState(getComparison());
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [toast, setToast] = useState(null);

    useEffect(() => {

        setCart(getCart());
        setWishlist(getWishlist());
        setComparison(getComparison());
        
    }, []);

    useEffect(() => {
      const fetchCartItems = async () => {
        const cartIds = getCart();
  
        if (cartIds.length > 0) {
          try {
            const response = await getProductsByIds(cartIds); // Загружаем товары из API
            const itemsWithQuantities = response.map((item) => {
              const savedQuantity = localStorage.getItem(`product-${item.productId}`);
              return {
                ...item,
                quantity: savedQuantity ? parseInt(savedQuantity, 10) : 1, // Устанавливаем количество
              };
            });
  
            setCartItems(itemsWithQuantities);
          } catch (err) {
            console.error('Ошибка загрузки товаров из корзины:', err);
          }
        }
      };
  
      fetchCartItems();
    }, []);
  
    
    useEffect(() => {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotal(totalAmount);
  
      // Сохраняем корзину в localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const increaseQuantity = (id) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      const updatedItem = cartItems.find((item) => item.productId === id);
      localStorage.setItem(`product-${id}`, updatedItem.quantity + 1);
    };
  
    const decreaseQuantity = (id) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      const updatedItem = cartItems.find((item) => item.productId === id);
      localStorage.setItem(`product-${id}`, updatedItem.quantity - 1);
    };

    const handleAddToCart = async (productId) => {
      const product = await getProductById(productId);
    
      if (product) {
        setCartItems((prevItems) => [
          ...prevItems,
          { ...product, quantity: 1 } 
        ]);
      }
      addToCart(productId);
      setCart(prevCart => [...prevCart, productId]);
      
      showToast('Товар добавлен в корзину');
    };

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
        setCart(prevCart => prevCart.filter(id => id !== productId));
        setCartItems((prevItems) => prevItems.filter(item => item.productId !== productId));
        localStorage.removeItem(`product-${productId}`);
        showToast('Товар убран из корзины');
    };

    const handleAddToWishlist = (productId) => {
        addToWishlist(productId);
        setWishlist(prevWishlist => [...prevWishlist, productId]);
        showToast('Товар добавлен в желаемое');
    };

    const handleRemoveFromWishlist = (productId) => {
        removeFromWishlist(productId);
        setWishlist(prevWishlist => prevWishlist.filter(id => id !== productId));
        showToast('Товар убран из желаемого');
    };

    const handleAddToComparison = (productId) => {
        addToComparison(productId);
        setComparison(prevComparison => [...prevComparison, productId]);
        showToast('Товар добавлен в сравнение');
    };

    const handleRemoveFromComparison = (productId) => {
        removeFromComparison(productId);
        setComparison(prevComparison => prevComparison.filter(id => id !== productId));
        showToast('Товар убран из сравнения');
    };

    const showToast = (message) => {
      setToast(message);
      setTimeout(() => setToast(null), 3000);
    };
    return (
        <>
        {toast && <ToastNotification message={toast} onClose={() => setToast(null)} />} {/* Уведомление */}
        <CartContext.Provider
            value={{
                cart,
                wishlist,
                comparison,
                handleAddToCart,
                handleRemoveFromCart,
                handleAddToWishlist,
                handleRemoveFromWishlist,
                handleAddToComparison,
                handleRemoveFromComparison,
                cartItems,
                total,
                increaseQuantity,
                decreaseQuantity
            }}
        >
            {children}
        </CartContext.Provider>
      </>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
