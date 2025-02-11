import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getFlavors } from '../../api/products';

function CardProduct({product, packagingOption}) {
    const { cart, wishlist, comparison, handleAddToCart, handleRemoveFromCart, handleAddToWishlist, handleRemoveFromWishlist, handleAddToComparison, handleRemoveFromComparison } = useCart();
    const [flavors, setFlavors] = useState([]);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const isInCart = cart.includes(product.productId);
    const isInWishlist = wishlist.includes(product.productId);  
    const isInComparison = comparison.includes(product.productId);

    const navigate = useNavigate();

    const handleReadMore = () => {
        navigate(`/product/${packagingOption.packagingId}`, { state: { product, packagingOption } });
    };
    useEffect(() => {
        const fetchFlavors = async () => {
            try {
                const data = await getFlavors(packagingOption.packagingId);
                setFlavors(data);
            } catch (error) {
                console.error('Ошибка загрузки вкусов:', error);
            }
        };
    
        fetchFlavors();
    }, [product.packagingId]);

    useEffect(() => {
        const firstAvailableFlavor = flavors.find(flavor => flavor.stockQuantity > 0);
        if (firstAvailableFlavor) {
            setSelectedFlavor(firstAvailableFlavor.flavorID);
        }
    }, [flavors]);

    const handleFlavorChange = (event) => {
        setSelectedFlavor(event.target.value);
    };

return (
    <div className="card"  onClick={handleReadMore}>
        <img src={packagingOption.productImageUrl} alt={product.productName}></img>
        <div className="text-block">
            <h3>{product.productName}<span> ({packagingOption.weight} гр.)</span></h3>
            <p>{product.description}</p>
            <div className="select-container"  onClick={(e) => e.stopPropagation()}>
                <select value={selectedFlavor || ''} onChange={handleFlavorChange}>
                    {flavors.map((flavor) => (
                        <option
                            key={flavor.flavorID}
                            value={flavor.flavorID}
                            disabled={flavor.stockQuantity === 0}
                        >
                            {flavor.flavorName} {flavor.stockQuantity === 0 ? '(нет в наличии)' : ''}
                        </option>
                    ))}
                </select>
            </div>
            <p className="price">Цена: {packagingOption.price} грн.</p>
            <button
                    className={`add-to-cart${isInCart ? '-remove' : '-add'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        isInCart
                            ? handleRemoveFromCart(product.productId)
                            : handleAddToCart(product.productId);
                    }}
                >
                    {isInCart ? 'Убрать из корзины' : 'В корзину'}
                </button>
        </div>
        <a className="ngmassa-favorite"
                title={isInWishlist ? 'Удалить из желаемого' : 'Добавить в желаемое'}
                onClick={(e) => {
                    e.stopPropagation();
                    isInWishlist
                        ? handleRemoveFromWishlist(product.productId)
                        : handleAddToWishlist(product.productId);
                }}
            >
            <svg data-toggle="tooltip" className={`svgicon svgicon-favorites${isInWishlist ? '-add' : '-remove'}`}>
                <use href="/assets/svg/sprite-icons.svg#icon-favorite-default"></use>
            </svg>
        </a>
        <a className="ngmassa-comparison"
                title={isInComparison ? 'Удалить из сравнения' : 'Добавить в сравнение'}
                onClick={(e) => {
                    e.stopPropagation();
                    isInComparison
                        ? handleRemoveFromComparison(product.productId)
                        : handleAddToComparison(product.productId);
                }}
            >
            <svg data-toggle="tooltip" className={`svgicon svgicon-comparison${isInComparison ? '-add' : '-remove'}`}>
                <use href="/assets/svg/sprite-icons.svg#icon-comparison-default"></use>
            </svg>
        </a>
    </div>
    )
}

export default CardProduct;