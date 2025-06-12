// src/pages/admin/ProductsPage.jsx
import  {useState, useEffect } from 'react';
import axios from '../../lib/axios';
import './Products.css';

function ProductModal({ visible, onClose, onSubmit, form, onChange, isEdit }) {
  if (!visible) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEdit ? 'Edit Product' : 'New Product'}</h2>
        <form onSubmit={onSubmit} className="modal-form">
          {['productName','brand','category','form','type','description'].map(key => (
            <input
              key={key}
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={form[key]}
              onChange={onChange}
              required={key==='productName'}
            />
          ))}
          <input
            name="nutritionalValue"
            type="number"
            placeholder="Calories"
            value={form.nutritionalValue}
            onChange={onChange}
          />
          <div className="modal-buttons">
            <button type="submit" className="btn submit-btn">
              {isEdit ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ productName: '', brand: '', category: '', form: '', type: '', description: '', nutritionalValue: 0, _id: null });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const f = products.filter(p =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
    setPage(1);
  }, [products, search]);

  const fetchProducts = async () => {
    const { data } = await axios.get('/products/');
    setProducts(data);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'nutritionalValue' ? +value : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isEdit) await axios.put(`/products/${form._id}`, form);
    else await axios.post('/products', form);
    closeModal();
    fetchProducts();
  };

  const openCreate = () => {
    setForm({ productName: '', brand: '', category: '', form: '', type: '', description: '', nutritionalValue: 0, _id: null });
    setIsEdit(false);
    setShowModal(true);
  };

  const openEdit = product => {
    setForm({ ...product, _id: product._id });
    setIsEdit(true);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleDelete = async id => {
    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  const total = filtered.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const current = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Products</h1>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn add-btn" onClick={openCreate}>+ Add Product</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Form</th>
            <th>Type</th>
            <th>Calories</th>
            <th>Packaging & Flavors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {current.map(product => (
            <tr key={product._id} className="product-row">
              <td>{product.productName}</td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>{product.form}</td>
              <td>{product.type}</td>
              <td>{product.nutritionalValue}</td>
              <td>
                {product.packaging?.length ? (
                  product.packaging.map((pack, i) => (
                    <details key={i} className="pack-details">
                      <summary>{pack.type}</summary>
                      <ul className="flavors-list">
                        {pack.flavors.map((fl, idx) => <li key={idx}>{fl}</li>)}
                      </ul>
                    </details>
                  ))
                ) : '—'}
              </td>
              <td>
                <button className="btn edit-btn" onClick={() => openEdit(product)}>✏️</button>
                <button className="btn delete-btn" onClick={() => handleDelete(product._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
      </div>

      <ProductModal
        visible={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        isEdit={isEdit}
      />
    </div>
  );
}
