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
            <h3>Online store Ng-MASSA</h3>
          </div>
          <p>
            Sports pharmacology store with delivery from Ukraine to Odessa,
Kyiv, and other cities. We also deliver anywhere in the world.
          </p>
        </div>
        <div className="footer__section">
          <h3>Categories</h3>
          <ul>
            <li><a href="#">Protein supplements</a></li>
            <li><a href="#">Amino acids</a></li>
            <li><a href="#">Vitamins and minerals</a></li>
            <li><a href="#">Gainers</a></li>
            <li><a href="#">Fat burners</a></li>
          </ul>
        </div>
        <div className="footer__section">
          <h3>How to place an order</h3>
          <ul>
            <li><a href="#">Payment</a></li>
            <li><a href="#">Delivery</a></li>
            <li><a href="#">Exchanges and returns</a></li>
            <li><a href="#">Reviews</a></li>
            <li><a href="#">Discounts</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Contacts</a></li>
          </ul>
        </div>
        <div className="footer__section">
          <h3>Contacts</h3>
          <ul>
            <li>Telephone: +380865533214</li>
            <li>
              Email: <a href="mailto:rumassa13@gmail.com">ngmassa13@gmail.com</a>
            </li>
            <li>
              Telegram for ordering: <a href="https://t.me/Rumassa_bot">@Ngmassa_bot</a>
            </li>
            <li>
              Telegram consultant: <a href="https://t.me/consultant_rumassa">@consultant_ngmassa</a>
            </li>
            <li>
              Telegram channel: <a href="https://t.me/Rumassa">@Ngmassa</a>
            </li>
          </ul>
        </div>
      </div>
      <div style={{position: "absolute", left:"-30px",width:"101.6%"}} className="horizontal_line"></div>
      <div className="footer__container _container footer__copyright">
        <p>© Copyright 2025
        </p>
        <a href="#">Privacy Policy</a>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
