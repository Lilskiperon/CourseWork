import  { useState, useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { getOrderHistory } from '../api/orders';
import { updateUser } from '../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const { tab } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  // Обновляем formData при изменении user
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      });
    }
  }, [user]);

  // Обработчик изменения полей ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Функция сохранения данных
  const handleSave = async () => {
    try {
      await updateUser(user._id, formData);
      setEditMode(false);
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  useEffect(() => {
    if (user === false) {
      navigate('/login');
      return;
    }

    if (tab === 'orders' && user) {
      getOrderHistory(user._id)
        .then(data => {
          setOrderHistory(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Не удалось загрузить историю заказов.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user, tab, navigate]);

  if (!user) {
    return <div>Пожалуйста, войдите в систему, чтобы просмотреть свой профиль.</div>;
  }

  const renderContent = () => {
    switch (tab) {
      case 'orders':
        if (loading) return <p>Загрузка...</p>;
        if (error) return <p>{error}</p>;
        return (
          <div>
            <h2>История заказов</h2>
            {orderHistory.length > 0 ? (
              orderHistory.map(order => (
                <div key={order._id}>
                  <p>Заказ №{order.orderNumber}: {order.status}</p>
                </div>
              ))
            ) : (
              <p>У вас пока нет заказов.</p>
            )}
          </div>
        );
      case 'settings':
        return <h2>Настройки</h2>;
      default:
        return (
          <>
            <h2>Основная информация</h2>
            <div>
              <strong>Email:</strong> {editMode ? (
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
              ) : (
                user.email
              )}
            </div>
            <div>
              <strong>Фамилия:</strong> {editMode ? (
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              ) : (
                user.lastName
              )}
            </div>
            <div>
              <strong>Имя:</strong> {editMode ? (
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              ) : (
                user.firstName
              )}
            </div>
            <div>
              <strong>Телефон:</strong> {editMode ? (
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              ) : (
                user.phone
              )}
            </div>
            {editMode ? (
              <button onClick={handleSave}>Сохранить</button>
            ) : (
              <button onClick={() => setEditMode(true)}>Редактировать</button>
            )}
          </>
        );
    }
  };

  return (
    <div className="profile-page">
      <h1>Добро пожаловать, {user.firstName} {user.lastName}</h1>
      <div className="profile-tabs">
        <button onClick={() => navigate('/profile')}>Основная информация</button>
        <button onClick={() => navigate('/profile/orders')}>История заказов</button>
        <button onClick={() => navigate('/profile/settings')}>Настройки</button>
      </div>
      <div className="profile-content">{renderContent()}</div>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

export default ProfilePage;
