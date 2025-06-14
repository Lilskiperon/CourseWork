import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { getOrderHistory } from '../api/orders';
import { updateUser, getAllUsers, getUserById } from '../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage () {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const { tab } = useParams();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(user?._id);
  const [currentUser, setCurrentUser] = useState(user);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (user?.isGuest) {
      navigate('/login');
    }
  }, [user, navigate]);
  useEffect(() => {
    if (user?.isAdmin) {
      getAllUsers()
        .then(data => setUsers(data))
        .catch(err => console.error('Failed to load users', err));
    }
  }, [user]);

  // Determine which user to display
  useEffect(() => {
    if (user?.isAdmin && selectedUserId && selectedUserId !== user._id) {
      getUserById(selectedUserId)
        .then(u => setCurrentUser(u))
        .catch(err => console.error('Failed to load user', err));
    } else {
      setCurrentUser(user);
    }
  }, [selectedUserId, user]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setLoadingOrders(true);
      getOrderHistory(currentUser._id)
        .then(data => {
          setOrderHistory(data);
          setLoadingOrders(false);
        })
        .catch(() => {
          setError('Unable to load order history.');
          setLoadingOrders(false);
        });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in to view your profile..</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUser(currentUser._id, formData);
      setEditMode(false);
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderOverview = () => (
    <div className="profile-overview">
      <div className="info-row">
        <label>Email:</label>
        {editMode ? (
          <input type="text" name="email" value={formData.email} onChange={handleChange} />
        ) : (
          <span>{currentUser.email}</span>
        )}
      </div>
      <div className="info-row">
        <label>Last name:</label>
        {editMode ? (
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        ) : (
          <span>{currentUser.lastName}</span>
        )}
      </div>
      <div className="info-row">
        <label>Name:</label>
        {editMode ? (
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        ) : (
          <span>{currentUser.firstName}</span>
        )}
      </div>
      <div className="info-row">
        <label>Telephone:</label>
        {editMode ? (
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        ) : (
          <span>{currentUser.phone}</span>
        )}
      </div>
      <div className="action-row">
        {editMode ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit</button>
        )}
      </div>
    </div>
  );

  const renderOrders = () => {
    if (loadingOrders) return <p>Download order history...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
      <div className="orders-section">
        {orderHistory.length ? (
          orderHistory.map(order => (
            <div key={order._id} className="order-card">
              <h3>Order №{order.orderNumber}</h3>
              <div className="order-details">
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                {order.products.map(item => (
                  <p key={item.product._id}>
                    {item.product.flavorName} × {item.quantity} = {item.quantity * item.price}$
                  </p>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: {order.products.reduce((sum, i) => sum + i.quantity * i.price, 0)}$</span>
              </div>
            </div>
          ))
        ) : (
          <p>You don't have any orders yet..</p>
        )}
      </div>
    );
  };

  return (
      <div className="main-container">
        <div className="profile-page">
          <div className="profile-header">
            <h1>Welcome, {currentUser.firstName} {currentUser.lastName}</h1>
            <button className="logout-btn" onClick={handleLogout}>Exit</button>
          </div>

          <div className="profile-tabs">
            <button className={!tab ? 'active' : ''} onClick={() => navigate('/profile')}>Basic information</button>
            <button className={tab==='orders' ? 'active' : ''} onClick={() => navigate('/profile/orders')}>Order history</button>
            {user?.isAdmin && (
              <button className={!tab ? 'active' : ''} onClick={() => navigate('/admin')}>Dashboard</button>
            )}
          </div>

          <div className="profile-content">
            {tab==='orders' ? renderOrders() : renderOverview()}
          </div>
        </div>
      </div>
  );
};

