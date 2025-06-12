import { useState,useEffect,useRef } from 'react';
import { useCartStore } from '../stores/useCartStore';
import './CompareProductsPage.css';

const CompareProductsPage = () => {
    const {comparison, removeFromComparison } = useCartStore();
    const [showAllFeatures, setShowAllFeatures] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef(null);
    const groupedByCategory = comparison.reduce((acc, product) => {
      const category = product.productId.category || "Без категории";
      if (!acc[category]) {
          acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    useEffect(() => {
        const firstCategory = Object.keys(groupedByCategory)[0];
        if (!selectedCategory) {
            setSelectedCategory(firstCategory);
        }
    }, [selectedCategory,groupedByCategory]);

    const products = groupedByCategory[selectedCategory] || [];
    useEffect(() => { 
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    const itemsPerView = Math.max(Math.floor(containerWidth / 300), 1); 
    const maxIndex = Math.max(products.length - itemsPerView, 0);


    return (
        <div className="comparison-page">
            <h2>Comparison</h2>
            <div className="categories">
                {Object.entries(groupedByCategory).map(([category, products]) => (
                    <div
                        key={category}
                        className={`category ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => setSelectedCategory(category)} 
                    >
                        <span className="category-name">{category}</span>
                        <span className="category-count">({products.length})</span>
                    </div>
                ))}
            </div>
              <div className="navigation-buttons">
                <button
                   onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentIndex === 0}
                >
                    ←
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(prev + 1, products.length - 1))}
                    disabled={currentIndex >= maxIndex}
                  
                >
                    →
                </button>
            </div>
              <div className="comparison-table-wrapper">
                 <div
                    className="slider-track"
                    style={{
                        transform: `translateX(-${currentIndex * (containerWidth)}px)`,
                        transition: 'transform 0.3s ease-in-out',
                        width: `${(products.length * 300)}px`,
                        display: 'flex'
                    }}
                >
            <table className="comparison-table">
              <thead>
                <tr>
                  <th><button>Add Product</button></th>
                  {products.map((product,index) => (<td key={`${product._id || index}-image`} className="product-image">
                    <button className="remove-button" onClick={() => removeFromComparison(product._id)}>
                      <svg className="svgicon">
                        <use href="/assets/svg/sprite-icons.svg#icon-close"></use>
                      </svg></button>
                    <img src={product.productImageUrl}/>
                    </td> ))}

                </tr>
                <tr>
                  <th>
                    <div className='select-option'>
                        <label>
                            <input type="radio" name="features"checked={showAllFeatures} onChange={() => setShowAllFeatures(true)} />
                            Select all
                        </label>
                        <label>
                          <input type="radio"  name="features" checked={!showAllFeatures} onChange={() => setShowAllFeatures(false)}/>
                        Select different</label>
                    </div>
                  </th>
                  {products.map((product,index) => (<td key={`${product._id || index}-price`} className="product-price">
                    {product.price}. -
                    </td> ))}

                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Brand</th>
                  {products.map((product, index) => (
                    <td key={`${product._id || index}-brand`}>{product.productId.brand}</td>
                  ))}
                </tr>
                <tr>
                  <th>Form</th>
                  {products.map((product, index) => (
                    <td key={`${product._id || index}-form`}>{product.productId.form}</td>
                  ))}
                </tr>
                <tr>
                  <th>Type</th>
                  {products.map((product, index) => (
                    <td key={`${product._id || index}-type`}>{product.productId.type}</td>
                  ))}
                </tr>
                <tr>
                  <th>Description</th>
                  {products.map((product, index) => (
                    <td key={`${product._id || index}-description`}>{product.productId.description}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
    );
};

export default CompareProductsPage;