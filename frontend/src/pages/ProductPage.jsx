import {useState, useEffect} from "react";
import "./ProductPage.css";
import QuantityControl from "../components/QuantityControl";
import axios from "../lib/axios";
import { useSearchParams, useLocation, useNavigate,useParams  } from "react-router-dom";

const ProductPage = () => {
  const location = useLocation();
  const productState = location.state;
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const packagingId = searchParams.get("packagingId");
  const flavorId = searchParams.get("flavorId");
  const navigate = useNavigate();

  const [product, setProduct] = useState(productState || {});
  const [packagings, setPackagings] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState(packagingId );
  const [selectedFlavor, setSelectedFlavor] = useState(flavorId);
  const [quantity,setQuantity] = useState(1);
  
  const updateSearchParams = () => {
    navigate({
      pathname: location.pathname,
      search: `?packagingId=${selectedPackaging}&flavorId=${selectedFlavor}`
    });
  };
  useEffect(() => {
    const packagingId = searchParams.get("packagingId");
    const flavorId = searchParams.get("flavorId");
    setSelectedPackaging(packagingId);
    setSelectedFlavor(flavorId);
  }, [searchParams]);

  useEffect(() => {
    axios.get(`/products/${productId}`)
        .then((res) => {
            setProduct(res.data);
        })
        .catch((err) => {
            console.error('Ошибка при загрузке продукта:', err);
            
        });
  }, [productId]);
  
  useEffect(() => {
      if (product && product._id) {
        axios.get(`/packagings/product/${product._id}`).then((res) => {
          setPackagings(res.data);
          const firstPackagingId = res.data[0]?._id;
          const packaginExists = res.data.some(packaging => packaging._id === packagingId);
          if (!packaginExists && firstPackagingId) {
            handlePackagingSelect(firstPackagingId);
          }
        }
      );
      }
  }, [product._id]);
  useEffect(() => {
    if (selectedPackaging) {
      axios.get(`/flavors/product/${selectedPackaging}`).then((res) => {
      setFlavors(res.data);
      const firstFlavorId = res.data[0]?._id;
      const flavorExists = res.data.some(flavor => flavor._id === flavorId);
        if (!flavorExists && firstFlavorId) {
          handleFlavorSelect(firstFlavorId);
        }
      });
    }
  }, [selectedPackaging]);


  useEffect(() => {
    if (selectedPackaging && selectedFlavor) {
      updateSearchParams();
    }
  }, [selectedPackaging, selectedFlavor]);

  const handlePackagingSelect = (id) => {
    if (selectedPackaging !== id) setSelectedPackaging(id);
  };

  const handleFlavorSelect = (id) => setSelectedFlavor(id);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };



  return (

    <div className="product-page">
      <div className="breadcrumbs">Главная / {product.category} / {product.productName}</div>
      <div className="product-container">
        <div className="image-section">
          <img
            className="main-image"
            src={packagings.find(p => p._id === selectedPackaging)?.productImageUrl || "-"}
            alt="Product"
          />
        </div>
        <div className="details-section">
          <h1 className="product-title">{product.productName}</h1>
          <div className="horizontal_line"></div>
          <div className="brand-section">
            <strong>Бренд:</strong> {product.brand}
          </div>
          <div className="horizontal_line"></div>
          <div className="categories-section">
            <strong>Категории:</strong> {product.category}
          </div>
          <div className="horizontal_line"></div>
          <div className="product-single-package_section">
            <div className="product-info__name">Фасовка</div>
            <div className="product-single-packages">
              {packagings.map((packaging) => (
                <button key={packaging._id} onClick={() => handlePackagingSelect(packaging._id)} className={`btn-select ${selectedPackaging === packaging._id ? "active" : ""}`}>
                  {packaging.weight} грамм
                </button>
              ))}
            </div>
          </div>
          <div className="horizontal_line"></div>
          <div className="product-single-attributes_section">
            <div className="product-info__name">Ассортимент вкусов</div>
            <div className="product-single-attributes">
            {flavors.map((flavor) => (
                <button key={flavor._id} onClick={() => handleFlavorSelect(flavor._id)} className={`btn-select ${selectedFlavor === flavor._id ? "active" : ""}`}>
                  {flavor.flavorName}
                </button>
              ))}
            </div>
          </div>
          <div className="horizontal_line"></div>
          <div className="price-section">
            <span className="price">{(packagings.find(p => p._id === selectedPackaging)?.price * quantity || "-")} $</span>
             <QuantityControl
              quantity={quantity}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
            />
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
