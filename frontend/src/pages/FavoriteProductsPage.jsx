import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; 
import { getProductsByIds } from '../api/products'; 
import './FavoriteProductsPage.css';
const FavoriteProducts = () => {
    const { wishlist, handleRemoveFromWishlist } = useCart();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
          if (wishlist.length === 0) {
            setFavorites([]); // Если список пустой, сбрасываем
            return;
          }
    
          try {
            const products = await getProductsByIds(wishlist);
            setFavorites(products);
          } catch (error) {
            console.error('Ошибка загрузки товаров для сравнения:', error);
          }
        };
    
        fetchWishlistProducts();
    }, [wishlist]);

    return (
        <div className="favorite-products-page">
            <h2>Избранные товары</h2>

            <div className="favorites-container">
                {favorites.length > 0 ? (
                    favorites.map((product) => (
                        <div className="favorite-card" key={product.productId}>
                            <img
                                src={product.productImageUrl}
                                alt={product.productName}
                                className="favorite-image"
                            />
                            <div className="favorite-details">
                                <h3>{product.productName}</h3>
                                <p className="product-description">{product.description}</p>
                                <div className="product-price">
                                    <span>{product.price} $</span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemoveFromWishlist(product.productId)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Нет избранных товаров</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteProducts;
