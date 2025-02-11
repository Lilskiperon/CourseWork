import React from "react";
import "./OrderProcessPage.css";

const OrderProcessPage = () => {
  return (
    <div className="order-process-page">
      <div className="header">
        <h1>Как оформить заказ</h1>
      </div>

      <div className="steps-container">
        <div className="step">
          <p>Добавляем нужный товар в корзину. Всё, что есть на сайте, в наличии.</p>
        </div>
        <div className="step">
          <p>
            Переходим в Корзину, выбираем способ доставки, жмём
            <strong> "Оформить заказ"</strong>.
          </p>
        </div>
        <div className="step">
          <p>
            Вводим ФИО, ваш e-mail (на него придут реквизиты для оплаты), вводим адрес
            доставки, жмём <strong>"Подтвердить заказ"</strong>.
          </p>
        </div>
        <div className="step">
          <p>
            Далее ждём обработки заказа и письма с реквизитами для оплаты на ваш
            e-mail.
          </p>
        </div>
      </div>

      <div className="contact-info">
        <p>
          По всем вопросам пишите на почту{" "}
          <a href="mailto:rumassa13@gmail.com">rumassa13@gmail.com</a> или телеграм{" "}
          <a href="https://t.me/Rumassa">@Rumassa</a>, или в чате на сайте.
        </p>
      </div>
    </div>
  );
};

export default OrderProcessPage;
