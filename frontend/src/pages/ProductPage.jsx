import React,{useState,useEffect} from "react";
import { useCart } from '../context/CartContext';
import "./ProductPage.css";

const ProductPage = () => {
  const {increaseQuantity, decreaseQuantity} = useCart();
  

  return (
    <div className="product-page">
      <div className="breadcrumbs">Главная / Оральные препараты / Stanozolol 10mg/tab, 100tab</div>
      <div className="product-container">
        <div className="image-section">
          <img
            className="main-image"
            src=""
            alt="Product"
          />
        </div>
        <div className="details-section">
          <h1 className="product-title">Stanozolol 10mg/tab, 100tab</h1>
          <div className="horizontal_line"></div>
          <div className="brand-section">
            <strong>Бренд:</strong> MyProtein
          </div>
          <div className="horizontal_line"></div>
          <div className="categories-section">
            <strong>Категории:</strong> ERGO, Оральные препараты, Станозолол
          </div>
          <div className="horizontal_line"></div>
          <div className="product-single-package_section">
            <div className="product-info__name">Фасовка</div>
            <div className="product-single-packages">
                <a href="" className="btn-select active">25 грамм</a>
                <a href="" className="btn-select ">1000 грамм</a>
                <a href="" className="btn-select ">2500 грамм</a>
                <a href="" className="btn-select ">5000 грамм</a>
            </div>
          </div>
          <div className="horizontal_line"></div>
          <div className="product-single-attributes_section">
            <div className="product-info__name">Ассортимент вкусов</div>
            <div className="product-single-attributes">
                <div className="btn-select active" data-id="12564" data-count="128" data-sales="1 067 грн">Натуральна полуниця</div>
                <div className="btn-select " data-id="12580" data-count="124" data-sales="1 067 грн" >Натуральный шоколад</div>
                <div className="btn-select " data-id="12570" data-count="123" data-sales="1 067 грн" >Шоколадный брауни</div>
            </div>
          </div>
          <div className="horizontal_line"></div>
          <div className="price-section">
            <span className="price">880 ₽</span>
            <div className="item-quantity">
                  <div className="quantity-content">
                    <button onClick={() => decreaseQuantity(1)}>
                      <svg className="svgicon">
                        <use href="/assets/svg/sprite-icons.svg#icon-minus"></use>
                      </svg>
                    </button>
                    <span>1</span>
                    <button onClick={() => increaseQuantity(1)}>
                      <svg className="svgicon">
                        <use href="/assets/svg/sprite-icons.svg#icon-plus"></use>
                      </svg>
                    </button>
                  </div>
                </div>
            <button className="add-to-cart-btn">В корзину</button>
          </div>
          <div className="horizontal_line"></div>
          <div className="reviews">
            <strong>Отзывы (0):</strong> Отзывов пока нет.
            <p className="review-prompt">
              Будьте первым, кто оставил отзыв на “Stanozolol 10mg/tab, 100tab”
            </p>
          </div>
        </div>
        
        <div className="additional-info">
            <div className="delivery-section">
        
            <h3 className="title">
              <svg className="truck_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-truck"></use>
                  </svg>
                  Доставка</h3>
              <div className="text_wr">
                <p className="text semibold">по Киеву</p>
                <p className="text">Оформляйте заказ и забирайте товар в магазинах в Киеве</p>
              </div>
              <div className="info_delivery__addresses">
                <span className="addresses_item">
                  <svg className="map_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-map"></use>
                  </svg>
                  <a className="mapLink" href="//goo.gl/maps/t8G8CfFMtxQ2" rel="nofollow" target="_blank">Пр-т Мира, 2/3</a></span>
                <span className="addresses_item">
                  <svg className="map_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-map"></use>
                  </svg>
                  <a className="mapLink" href="//goo.gl/maps/or8575rANuw" rel="nofollow" target="_blank">Площадь Оболонская, 1</a></span>
                <span className="addresses_item">
                  <svg className="map_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-map"></use>
                  </svg>
                  <a className="mapLink" href="//goo.gl/maps/nbQ9vTY9Rvq" rel="nofollow" target="_blank">Пр-т Воздушных Сил, 7</a></span>
                <span className="addresses_item">
                  <svg className="car_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-car"></use>
                  </svg>
                  <p className="addresses_item addresses_item--car">Курьером по Киеву 65 грн</p>
                </span>
              </div>
            </div>
            <div className="delivery-section">
              <div className="text_wr">
                  <p className="text semibold">по Украине</p>
                  <p className="text">Заказы оплаченные после 15:00 отправляются <b>на следующий день</b></p>
                </div>
                <div className="text_wr_np">
                    <svg className="np_svg">
                      <use href="/assets/svg/sprite-icons.svg#icon-np"></use>
                    </svg>
                    <div className="text_wr">
                        <p className="text">
                            <span className="semibold">
                                Нова пошта от 60 грн</span>
                        </p>
                        <p className="text">При оплате наложенным платежом отправка заказов в течении 1-2 дней</p>
                    </div>
                </div>
                <div className="text_wr_up">
                    <svg className="up_svg">
                      <use href="/assets/svg/sprite-icons.svg#icon-up"></use>
                    </svg>
                    <div className="text_wr">
                        <p className="text">
                            <span className="semibold">
                                Укрпошта от 29 грн</span>
                        </p>
                        <p className="text">Только для оплаченных заказов.<br />Оплата считается произведённой в момент зачисления денежных средств на банковский счёт продавца</p>
                        <p className="text delivery_check_terms_link js_simple_popup_link" data-content="324">Правила проверки комплектации и сохранности товара при получении заказа</p>
                    </div>
                </div>
                </div>
              </div>
        </div>
    </div>
  );
};

export default ProductPage;
