import './OrderProcessPage.css';
import { ShoppingCart, Truck, UserPen , Mail } from 'lucide-react';

const steps = [
  {
    icon: <ShoppingCart />, 
    lines: [
      'Добавляем нужный товар в корзину.',
      'Все что есть на сайте, то в наличии.'
    ]
  },
  {
    icon: <Truck />,
    lines: [
      'Переходим в Корзину, выбираем способ доставки, жмем “Оформить заказ”.'
    ]
  },
  {
    icon: <UserPen  />,
    lines: [
      'Вводим ФИО, ваш e-mail (на него придут реквизиты для оплаты),вводим адрес доставки, жмем “Подтвердить заказ”.'
    ]
  },
  {
    icon: <Mail />,
    lines: [
      'Далее ждем обработки заказа и письмо с реквизитами для оплаты на ваш e-mail.'
    ]
  }
];

function OrderProcessPage() {
  return (
    <div className="order-steps">
      <h1 className="order-steps__title">Как оформить заказ</h1>
      <div className="order-steps__cards">
        {steps.map((step, idx) => (
          <div key={idx} className="order-steps__card">
            <div className="order-steps__icon">{step.icon}</div>
            <div className="order-steps__description">
              {step.lines.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <div className="order-steps__arrow">&gt;</div>
          </div>
        ))}
      </div>
      <div className="order-steps__alert">
        <span>
          По всем вопросам пишите на почту <a href="mailto:rumassa13@gmail.com">rumassa13@gmail.com</a> или телеграм <a href="https://t.me/Rumassa">@Rumassa</a> или в чате на сайте
        </span>
        <button className="order-steps__alert-close">&times;</button>
      </div>
    </div>
  );
}

export default OrderProcessPage;