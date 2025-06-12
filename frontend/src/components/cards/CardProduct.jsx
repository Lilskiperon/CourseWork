/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlavors } from '../../api/products';
import { useCartStore } from '../../stores/useCartStore';

function CardProduct({ product }) {
    const { cart, addToCart, removeFromCart, wishlist, comparison, addToWishlist, removeFromWishlist, addToComparison, removeFromComparison } = useCartStore();
    const [flavors, setFlavors] = useState([]);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    useEffect(() => {
        const firstAvailableFlavor = flavors.find(flavor => flavor.stockQuantity > 0);
        if (firstAvailableFlavor) {
            setSelectedFlavor(firstAvailableFlavor._id);
        }
    }, [flavors]);
    const isInCart = cart.some(item => item._id === selectedFlavor);
    const isInWishlist = wishlist.some(item => item._id === product._id);
    const isInComparison = comparison.some(item => item._id === product._id);

    const navigate = useNavigate();

    const handleReadMore = () => {
    
        navigate(`/product/${product.productId._id}?packagingId=${product._id}&flavorId=${selectedFlavor}`, { state: product.productId });
    };

    useEffect(() => {
        const fetchFlavors = async () => {
            try {
                const data = await getFlavors(product._id);
                setFlavors(data);
            } catch (error) {
                console.error('Flavor loading error:', error);
            }
        };

        fetchFlavors();
    }, [product._id]);



    const handleFlavorChange = (event) => {
        setSelectedFlavor(event.target.value);
    };

    return (
        <div className="card-product" onClick={handleReadMore}>
            <img src={product.productImageUrl} alt={product.productId?.productName} />
            <div className="text-block">
                <h3>{product.productId?.productName} <span>({product.weight} g.)</span></h3>
                <p>{product.productId?.description}</p>
                <div className="select-container" onClick={(e) => e.stopPropagation()}>
                    <select value={selectedFlavor || ''} onChange={handleFlavorChange}>
                        {flavors.map((flavor) => (
                            <option
                                key={flavor._id}
                                value={flavor._id}
                                disabled={flavor.stockQuantity === 0}
                            >
                                {flavor.flavorName} {flavor.stockQuantity === 0 ? '(not available)' : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="price">Price: {product.price} $</p>
                <button
                    className={`add-to-cart${isInCart ? '-remove' : '-add'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        isInCart ? removeFromCart(selectedFlavor) : addToCart(selectedFlavor);
                    }}
                >
                    {isInCart ? 'Remove from basket' : 'Add to cart'}
                </button>
            </div>
            <a className="ngmassa-favorite"
                title={isInWishlist ? 'Remove from favorites' : 'Add to desired'}
                onClick={(e) => {
                    e.stopPropagation();
                    isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product);
                }}
            >
                <svg data-toggle="tooltip" className={`svgicon svgicon-favorites${isInWishlist ? '-add' : '-remove'}`}>
                    <use href="/assets/svg/sprite-icons.svg#icon-favorite-default"></use>
                </svg>
            </a>
            <a className="ngmassa-comparison"
                title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
                onClick={(e) => {
                    e.stopPropagation();
                    isInComparison ? removeFromComparison(product._id) : addToComparison(product);
                }}
            >
                <svg data-toggle="tooltip" className={`svgicon svgicon-comparison${isInComparison ? '-add' : '-remove'}`}>
                    <use href="/assets/svg/sprite-icons.svg#icon-comparison-default"></use>
                </svg>
            </a>
        </div>
    );
}

export default CardProduct;
