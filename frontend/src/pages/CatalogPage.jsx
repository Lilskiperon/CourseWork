import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './CatalogPage.css';
import { getBrands } from '../api/brands';
import { getProducts } from '../api/products';
import CardProduct from '../components/cards/CardProduct';

const Catalog = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true);
  const [loadCount, setLoadCount] = useState(10);
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') ? searchParams.get('brand').split(',') : [],
    category: searchParams.get('category') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    sortField: searchParams.get('sortField') || '',
    sortOrder: searchParams.get('sortOrder') || 'asc',
  });
  useEffect(() => {
    setFilters({
      brand: searchParams.get('brand') ? searchParams.get('brand').split(',') : [],
      category: searchParams.get('category') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      sortField: searchParams.get('sortField') || '',
      sortOrder: searchParams.get('sortOrder') || 'asc',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Ошибка при загрузке брендов:', error);
      }
    };
    fetchBrandsData();
  }, []);

  const fetchProductsData = async (newPage = 1) => {
    try {
      const data = await getProducts({ ...filters, page: newPage });
      if (newPage === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
      setHasMore(data.hasMore); 
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
    }
  };

  useEffect(() => {
    fetchProductsData(1);
    setPage(1); 
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const updatedBrands = checked
        ? [...prev.brand, value]
        : prev.brand.filter((brand) => brand !== value);
      return { ...prev, brand: updatedBrands };
    });
  };
  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setLoadCount(value);
    }
  };

  const loadMoreProducts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProductsData(nextPage);
  };

  useEffect(() => {
    const params = { ...filters };
    if (Array.isArray(params.brand)) {
      params.brand = params.brand.join(',');
    }
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    setSearchParams(params);
  }, [filters]);

  return (
    <div className="catalog-container">
      <aside className="filters">
        <div className="filter-group">
          <h3>Бренды</h3>
          {brands.map((product) => (
            <label key={product.brand} className="filter-item">
              <input
                type="checkbox"
                value={product.brand}
                checked={filters.brand.includes(product.brand)}
                onChange={handleCheckboxChange}
              />
              <span>{product.brand}</span>
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h3>Категория</h3>
          <input
            type="text"
            name="category"
            placeholder="Введите категорию"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <h3>Цена</h3>
          <div className="price-inputs">
            <input
              type="number"
              name="priceMin"
              placeholder="Минимум"
              value={filters.priceMin}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="number"
              name="priceMax"
              placeholder="Максимум"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
        </div>
        <div className="filter-group">
          <h3>Сортировка</h3>
          <select
            name="sortField"
            value={filters.sortField}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="price">По цене</option>
            <option value="brand">По бренду</option>
            <option value="weight">По весу</option>
          </select>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </div>
        <div className="filter-group">
          <h3>Количество отображаемого товара</h3>
          <select
            value={loadCount}
            onChange={handleLimitChange}
            className="filter-select"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </aside>
      <div>
        <main className="products">
          {products.length > 0 ? (
            <>
              {products.map((product) => (
                <CardProduct key={product.productId} product={product} />
              ))}

            </>
          ) : (
            <p>Нет товаров</p>
          )}
        </main>
        {hasMore && (
          <div className="button-container">
            <button onClick={loadMoreProducts} className="load-more-button">
              Загрузить ещё
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
