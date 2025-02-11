import React, { useState } from "react";
import { useCart } from '../context/CartContext';
import QuantityControl from "../components/QuantityControl";
import "./CartPage.css";

function CartPage() {
  const [activeTab, setActiveTab] = useState(1);
  const {
    cartItems,
    total, 
    increaseQuantity,
    decreaseQuantity,
    handleRemoveFromCart,
  } = useCart();

  const [selectedOption, setSelectedOption] = useState("cod");

  const paymentDescriptions = {
    cod: "Оплата наличными при доставке заказа. Перевозчик взимает дополнительную комиссию за услугу наложенного платежа в размере 2% от суммы + 20 грн.",
    online: "Онлайн оплата на сайте через систему Visa/MasterCard (LiqPay).",
    bank: "Оплата на расчетный счет.",
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    region: "",
    city: "",
    postalCode: "",
    address: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <>
            <h2>Корзина</h2>
            {/* Cart Items */}
            <div className="cartpage-content">
            <div className="table-content">
            <table>
              <tr>
                <th></th>
                <th>ТОВАР</th>
                <th>ЦЕНА</th>
                <th>КОЛИЧЕСТВО</th>
                <th>ПОДЫТОГ</th>
              </tr>
              {/*Example Product Items*/}
              <tbody>
                {cartItems.map((product, index) => (
                  <tr key={product.productId || index}>
                    <td>
                      <svg
                        className="svgicon"
                        onClick={() => handleRemoveFromCart(product.productId)}
                      >
                        <use href="/assets/svg/sprite-icons.svg#icon-close"></use>
                      </svg>
                    </td>
                    <td>
                      <div className="cartproduct-title">
                        <img src={product.productImageUrl} alt={product.productName} />
                        {product.productName}({product.weight} гр.)
                      </div>
                    </td>
                    <td>{product.price} $</td>
                    <td>
                    <QuantityControl
                       quantity={product.quantity}
                       onIncrease={() => increaseQuantity(product.productId)}
                       onDecrease={() => decreaseQuantity(product.productId)}
                    />
                    </td>
                    <td>{product.price * product.quantity} $</td>
                  </tr>
                ))}
              </tbody>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>Всего:</th>
                <th>{total} $</th>
                </tr>
            </table>
            <div className="cart-coupon">
                <input
                  type="text"
                  placeholder="Код купона"
                  className="coupon-input"
                />
                <button className="apply-coupon">Применить купон</button>
              </div>
            </div>
            <div className="content-options">
            <div className="payment-options">
            <h3>Способ оплаты</h3>
            <form>
              <div className="payment-method">
                <label>
                  <input
                    type="radio"
                    name="payment-method"
                    value="cod"
                    checked={selectedOption === "cod"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  Оплата при получении товара{" "}
                  <span className="info-icon">
                    <svg className="svgicon">
                      <use href="/assets/svg/sprite-icons.svg#icon-info"></use>
                    </svg>
                  </span>
                </label>
                {selectedOption === "cod" && (
                  <p className="description">{paymentDescriptions.cod}</p>
                )}

                <label>
                  <input
                    type="radio"
                    name="payment-method"
                    value="online"
                    checked={selectedOption === "online"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  Оплатить сейчас онлайн на сайте (LiqPay)
                </label>
                {selectedOption === "online" && (
                  <p className="description">{paymentDescriptions.online}</p>
                )}

                <label>
                  <input
                    type="radio"
                    name="payment-method"
                    value="bank"
                    checked={selectedOption === "bank"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  Оплата на счет по банковским реквизитам
                </label>
                {selectedOption === "bank" && (
                  <p className="description">{paymentDescriptions.bank}</p>
                )}
              </div>
            </form>
            </div>
            <button className="apply-order" onClick={() => setActiveTab(2)}>Оформить заказ</button>
            </div>
          </div>
          </>
        );
      case 2:
        return (
          <div className="address-page">
            <h2>Адрес доставки</h2>
            <form onSubmit={handleSubmit} className="address-form">
              <h3>Оплата и доставка</h3>
              
              <div className="form-group">
                <label>ФИО*</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="ФИО*"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>E-mail*</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Ваш email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Страна/регион*</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите страну</option>
                  <option value="Россия">Россия</option>
                  <option value="Украина">Украина</option>
                  <option value="Беларусь">Беларусь</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Область*</label>
                <input
                  type="text"
                  name="region"
                  placeholder="Область"
                  value={formData.region}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Город*</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Город"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Индекс*</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Индекс"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Улица, номер дома, квартира</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Улица, номер дома, квартира"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Примечание (необязательно)</label>
                <textarea
                  name="notes"
                  placeholder="Напишите, если есть особые инструкции"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
              
              <button type="submit" className="submit-button">
                Подтвердить заказ
              </button>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="order-ready">
            <h2>Заказ готов</h2>
            <p>Спасибо за ваш заказ!</p>
            <p>Ваш заказ будет доставлен в ближайшее время.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cartpage-container">
      {/* Header Progress */}
      <div className="cartpage-progress">
        <div className="step-content">
          <span
            className={`step ${activeTab === 1 ? "active" : ""}${activeTab > 1 ? "selected" : ""}`}
            onClick={() => setActiveTab(1)}
          ><p>1</p>
          </span>
          Корзина
        </div>
        <div className="step-content">
          <span
            className={`step ${activeTab === 2 ? "active" : ""}${activeTab > 2 ? "selected" : ""}`}
            onClick={() => setActiveTab(2)}
          ><p>2</p>
          </span>
          Адрес доставки
        </div>
        <div className="step-content">
          <span
            className={`step ${activeTab === 3 ? "active" : ""}`}
            onClick={() => setActiveTab(3)}
          ><p>3</p>
          </span>
          Заказ готов
        </div>
        </div>
      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}

export default CartPage;
