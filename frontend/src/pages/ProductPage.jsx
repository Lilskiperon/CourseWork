import {useState, useEffect} from "react";
import "./ProductPage.css";
import QuantityControl from "../components/QuantityControl";
import axios from "../lib/axios";
import { useSearchParams, useLocation, useNavigate,useParams  } from "react-router-dom";
import {useCartStore} from "../stores/useCartStore";

const ProductPage = () => {
  const { addToCart,updateQuantity,removeFromCart, cart } = useCartStore();
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
  const isInCart = cart.some(item => item._id === selectedFlavor);
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
            console.error('Error loading product:', err);
            
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
      <div className="breadcrumbs">Home / {product.category} / {product.productName}</div>
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
            <strong>Brand:</strong> {product.brand}
          </div>
          <div className="horizontal_line"></div>
          <div className="categories-section">
            <strong>Categories:</strong> {product.category}
          </div>
          <div className="horizontal_line"></div>
          <div className="product-single-package_section">
            <div className="product-info__name">Packaging</div>
            <div className="product-single-packages">
              {packagings.map((packaging) => (
                <button key={packaging._id} onClick={() => handlePackagingSelect(packaging._id)} className={`btn-select ${selectedPackaging === packaging._id ? "active" : ""}`}>
                  {packaging.weight} gram
                </button>
              ))}
            </div>
          </div>
          <div className="horizontal_line"></div>
          <div className="product-single-attributes_section">
            <div className="product-info__name">Range of flavors</div>
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
             {isInCart &&
             <QuantityControl
              quantity={quantity}
              onIncrease={() => updateQuantity(selectedFlavor, quantity + 1)}
              onDecrease={() => updateQuantity(selectedFlavor, quantity - 1)}
            />}
            <button className="add-to-cart-btn" onClick={(e) =>{
              e.stopPropagation();
              isInCart ? removeFromCart(selectedFlavor) : addToCart(selectedFlavor);
            }}>{isInCart ? 'Remove from basket' : 'Add to cart'}</button>
          </div>
          <div className="horizontal_line"></div>
          <div className="reviews">
            <strong>Reviews (0):</strong> No reviews yet.
            <p className="review-prompt">
              {product.productName}
            </p>
          </div>
        </div>
        
        <div className="additional-info">
            <div className="delivery-section">
        
            <h3 className="title">
              <svg className="truck_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-truck"></use>
                  </svg>
                  Delivery</h3>
              <div className="text_wr">
                <p className="text semibold">in Kiev</p>
                <p className="text">Place your order and pick up your goods at stores in Kiev</p>
              </div>
              <div className="info_delivery__addresses">
                <span className="addresses_item">
                  <svg className="map_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-map"></use>
                  </svg>
                  <a className="mapLink" href="//goo.gl/maps/t8G8CfFMtxQ2" rel="nofollow" target="_blank">2/3 Mira Avenue</a></span>
                <span className="addresses_item">
                  <svg className="map_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-map"></use>
                  </svg>
                  <a className="mapLink" href="//goo.gl/maps/or8575rANuw" rel="nofollow" target="_blank">1 Obolonskaya Square</a></span>
                <span className="addresses_item">
                  <svg className="map_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-map"></use>
                  </svg>
                  <a className="mapLink" href="//goo.gl/maps/nbQ9vTY9Rvq" rel="nofollow" target="_blank">7 Air Force Avenue</a></span>
                <span className="addresses_item">
                  <svg className="car_svg">
                    <use href="/assets/svg/sprite-icons.svg#icon-car"></use>
                  </svg>
                  <p className="addresses_item addresses_item--car">Courier delivery in Kiev 5$</p>
                </span>
              </div>
            </div>
            <div className="delivery-section">
              <div className="text_wr">
                  <p className="text semibold">across Ukraine</p>
                  <p className="text">Orders paid after 3 p.m. are shipped <b>the next day</b></p>
                </div>
                <div className="text_wr_np">
                    <svg className="np_svg">
                      <use href="/assets/svg/sprite-icons.svg#icon-np"></use>
                    </svg>
                    <div className="text_wr">
                        <p className="text">
                            <span className="semibold">
                                New mail from 6$</span>
                        </p>
                        <p className="text">When paying by cash on delivery, orders are shipped within 1-2 days.</p>
                    </div>
                </div>
                <div className="text_wr_up">
                    <svg className="up_svg">
                      <use href="/assets/svg/sprite-icons.svg#icon-up"></use>
                    </svg>
                    <div className="text_wr">
                        <p className="text">
                            <span className="semibold">
                                Ukrposhta from 2$</span>
                        </p>
                        <p className="text">Only for paid orders.<br />Payment is considered to have been made at the moment the funds are credited to the seller's bank account.</p>
                        <p className="text delivery_check_terms_link js_simple_popup_link" data-content="324">Rules for checking the completeness and condition of goods upon receipt of an order</p>
                    </div>
                </div>
                </div>
              </div>
        </div>
    </div>
  );
};

export default ProductPage;
