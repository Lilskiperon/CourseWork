import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './CatalogPage.css';
import { getBrands } from '../api/brands';
import { getProducts } from '../api/products';
import CardProduct from '../components/cards/CardProduct';

const Catalog = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') ? searchParams.get('brand').split(',') : [],
    category: searchParams.get('category') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    sortField: searchParams.get('sortField') || 'price',
    sortOrder: searchParams.get('sortOrder') || 'asc',
    limit: searchParams.get('limit')|| '10',
    page: parseInt(searchParams.get('page')) || 1,
  });
  useEffect(() => {
    setFilters({
      brand: searchParams.get('brand') ? searchParams.get('brand').split(',') : [],
      category: searchParams.get('category') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      sortField: searchParams.get('sortField') || 'price',
      sortOrder: searchParams.get('sortOrder') || 'asc',
      limit: searchParams.get('limit')|| '10',
      page: parseInt(searchParams.get('page')) || '1',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error loading brands:', error);
      }
    };
    fetchBrandsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const data = await getProducts({ ...filters});
      setProducts([ ...data.products ]);
      setHasMore(data.hasMore); 
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    fetchProductsData(filters.page);
  }, [filters]);
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const updatedBrands = checked
        ? [...prev.brand, value]
        : prev.brand.filter((brand) => brand !== value);
      return { ...prev, brand: updatedBrands };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  


  const loadProducts = () => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + 1, // Increment the page number
    }));
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
          <h3>Brands</h3>
          {brands.map((brand) => (
            <label key={brand} className="filter-item">
              <input
                type="checkbox"
                value={brand}
                checked={filters.brand?.includes(brand)}
                onChange={handleCheckboxChange}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h3>Category</h3>
          <input
            type="text"
            name="category"
            placeholder="Enter category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <h3>Price</h3>
          <div className="price-inputs">
            <input
              type="number"
              name="priceMin"
              placeholder="Minimum"
              value={filters.priceMin}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="number"
              name="priceMax"
              placeholder="Maximum"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
        </div>
        <div className="filter-group">
          <h3>Sorting</h3>
          <select
            name="sortField"
            value={filters.sortField}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="price">By price</option>
            <option value="brand">By brand</option>
            <option value="weight">By weight</option>
          </select>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="asc">In ascending order</option>
            <option value="desc">In descending order</option>
          </select>
        </div>
        <div className="filter-group">
          <h3>Number of items displayed</h3>
          <select
            name="limit"
            value={filters.limit}
            onChange={handleFilterChange}
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
                <CardProduct key={product._id} product={product} />
              ))}

            </>
          ) : (
            <p>No products</p>
          )}
        </main>
        {hasMore && (
          <div className="button-container">
            <button onClick={loadProducts} className="load-more-button">
              Download more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
