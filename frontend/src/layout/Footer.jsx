import logo from '/assets/img/logoSite.png';
const Footer = () => {
  return (
    <div className="wrapper">
    <div className="horizontal_line"></div>
    <footer>
      <div className="footer__container _container">
        <div className="footer__section">
          <div className="block-logo">
            <img src={logo} alt="Logo"/>
            <h3>Интернет-магазин Ng-MASSA</h3>
          </div>
          <p>
            Магазин спортивной фармакологии с доставкой из Украины в Одессу,
            Киев и другие города. Так же доставляем в любую точку мира.
          </p>
        </div>
        <div className="footer__section">
          <h3>Категории</h3>
          <ul>
            <li><a href="#">Протеиновые добавки</a></li>
            <li><a href="#">Аминокислоты</a></li>
            <li><a href="#">Витамины и минералы</a></li>
            <li><a href="#">Гейнеры</a></li>
            <li><a href="#">Жиросжигатели</a></li>
          </ul>
        </div>
        <div className="footer__section">
          <h3>Как оформить заказ</h3>
          <ul>
            <li><a href="#">Оплата</a></li>
            <li><a href="#">Доставка</a></li>
            <li><a href="#">Обмен и возврат</a></li>
            <li><a href="#">Отзывы</a></li>
            <li><a href="#">Скидки</a></li>
            <li><a href="#">Новости</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
        </div>
        <div className="footer__section">
          <h3>Контакты</h3>
          <ul>
            <li>Телефон: +380865533214</li>
            <li>
              Email: <a href="mailto:rumassa13@gmail.com">ngmassa13@gmail.com</a>
            </li>
            <li>
              Telegram для заказа: <a href="https://t.me/Rumassa_bot">@Ngmassa_bot</a>
            </li>
            <li>
              Telegram консультант: <a href="https://t.me/consultant_rumassa">@consultant_ngmassa</a>
            </li>
            <li>
              Telegram канал: <a href="https://t.me/Rumassa">@Ngmassa</a>
            </li>
          </ul>
        </div>
      </div>
      <div style={{position: "absolute", left:"-30px",width:"101.6%"}} className="horizontal_line"></div>
      <div className="footer__container _container footer__copyright">
        <p>© Copyright 2025
        </p>
        <a href="#">Политика конфиденциальности</a>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
