import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; 
import { getProductsByIds } from '../api/products'; 
import './CompareProductsPage.css';

const ComparisonCard = React.memo(({ product, handleRemoveFromComparison }) => {
    return (
        <div className="comparison-card">
            <div className="comparison-card-header">
                <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="comparison-image"
                />
                <h3>{product.productName}</h3>
                <p className="comparison-price">{product.price} $</p>
                <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromComparison(product.productId)}
                >
                    Удалить
                </button>
            </div>
            <div className="comparison-card-body">
                <p><strong>Бренд:</strong> {product.brand}</p>
                <p><strong>Категория:</strong> {product.category}</p>
                <p><strong>Вес:</strong> {product.weight} г</p>
                <p><strong>Форма:</strong> {product.form}</p>
                <p><strong>Тип:</strong> {product.type}</p>
                <p><strong>Описание:</strong> {product.description}</p>
                <p><strong>Пищевая ценность:</strong> {product.nutritionalValue} ккал</p>
            </div>
        </div>
    );
});

const CompareProductsPage = () => {
    const { comparison, handleRemoveFromComparison } = useCart();
    const [comparisonList, setComparisonList] = useState([]);
    const [sortOption, setSortOption] = useState('price');

    useEffect(() => {
        const fetchComparisonProducts = async () => {
            if (comparison.length === 0) {
                setComparisonList([]); // Если список пустой, сбрасываем
                return;
            }

            try {
                const products = await getProductsByIds(comparison);
                const sortedProducts = [...products].sort((a, b) => {
                    if (sortOption === 'price') {
                        return a.price - b.price;
                    }
                    // Добавьте другие варианты сортировки по мере необходимости
                    return 0;
                });
                setComparisonList(sortedProducts);
            } catch (error) {
                console.error('Ошибка загрузки товаров для сравнения:', error);
            }
        };

        fetchComparisonProducts();
    }, [comparison, sortOption]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <div className="comparison-page">
            <h2>Сравнение товаров</h2>
            <div className="sort-options">
                <label htmlFor="sort">Сортировать по: </label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                    <option value="price">Цена</option>
                    {/* Добавьте другие варианты сортировки по мере необходимости */}
                </select>
            </div>
            {comparisonList.length > 0 ? (
                <div className="comparison-container">
                    {comparisonList.map((product) => (
                        <ComparisonCard
                            key={product.productId}
                            product={product}
                            handleRemoveFromComparison={handleRemoveFromComparison}
                        />
                    ))}
                </div>
            ) : (
                <p>Нет товаров для сравнения</p>
            )}
        </div>
    );
};

export default CompareProductsPage;