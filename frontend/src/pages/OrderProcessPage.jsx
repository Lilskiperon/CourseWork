import './OrderProcessPage.css';
import { ShoppingCart, Truck, UserPen , Mail } from 'lucide-react';

const steps = [
  {
    icon: <ShoppingCart />, 
    lines: [
      'Add the desired item to your shopping cart.',
      'Everything on the website is in stock..'
    ]
  },
  {
    icon: <Truck />,
    lines: [
      'Go to the Shopping Cart, select the delivery method, and click “Place Order.”.'
    ]
  },
  {
    icon: <UserPen  />,
    lines: [
      'Enter your full name, your email address (payment details will be sent to this address), enter your delivery address, and click “Confirm order.”.'
    ]
  },
  {
    icon: <Mail />,
    lines: [
      'Next, we await order processing and an email with payment details sent to your email address..'
    ]
  }
];

function OrderProcessPage() {
  return (
    <div className="order-steps">
      <h1 className="order-steps__title">How to place an order</h1>
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
          For all questions, please write to the following email address <a href="mailto:ngmassa13@gmail.com">ngmassa13@gmail.com</a> or telegram <a href="https://t.me/Ngmassa">@Ngmassa</a> or in the chat on the website
        </span>
        <button className="order-steps__alert-close">&times;</button>
      </div>
    </div>
  );
}

export default OrderProcessPage;