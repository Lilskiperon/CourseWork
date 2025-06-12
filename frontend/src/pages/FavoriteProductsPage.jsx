import React, { useState } from 'react';
import './FavoriteProductsPage.css';
import { useCartStore } from '../stores/useCartStore';
const FavoriteProducts = () => {
    const { wishlist, removeFromWishlist } = useCartStore();
    return (
        <div className="favorite-products-page">
            <h2>Selected products</h2>

            <div className="favorites-container">
                {wishlist.length > 0 ? (
                    wishlist.map((product) => (
                        <div className="favorite-card" key={product._id}>
                            <img
                                src={product.productImageUrl}
                                alt={product.productId.productName}
                                className="favorite-image"
                            />
                            <div className="favorite-details">
                                <h3>{product.productId.productName}</h3>
                                <p className="product-description">{product.productId.description}</p>
                                <div className="product-price">
                                    <span>{product.price} $</span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromWishlist(product._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No selected products</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteProducts;
