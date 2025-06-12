import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import LoaderComponent from './LoaderComponent';
const PurchaseSuccessComponent = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState(null);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        const response = await axios.post("/payments/checkout-success", { sessionId });
        setOrderData(response.data);
        const productsData = await fetchProductsByIds(response.data.products);
        setProducts(productsData);
  
        clearCart();
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };
  

    const fetchProductsByIds = async (products) => {
      try {
        const response = await axios.post('/flavors/products', { products });
        return response.data;
      } catch (error) {
        console.error('Error receiving products:', error.response?.data || error.message);
        return null;
      }
    };

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {    
			setError("No session ID found in the URL");
      setIsProcessing(false);
		}
    
	}, [clearCart]);
  
  if (isProcessing || !orderData) return (<LoaderComponent/>);
  return (
    <div className="success-container">
      <Confetti
        width={window.innerWidth - 20}
        height={window.innerHeight}
        gravity={0.1}
        className="confetti"
        numberOfPieces={700}
        recycle={false}
      />
        <h2><CheckCircle className="success-icon" /> Your order has been accepted.</h2>

          <table className="order-summary">
            <tbody>
            <tr className="order-row">
              <td><span>Order number:&nbsp;</span> <p>{orderData.orderNumber}</p></td>
              <td><span>Date:&nbsp;</span><p>{new Date(orderData.orderDate).toLocaleDateString()}</p></td>
              <td><span>Total:&nbsp;</span><p>{orderData.totalAmount.toFixed(2)} $</p></td>
            </tr>
            </tbody>
          </table>

          <div className="order-details">
            <h3 className="details-title">ORDER INFORMATION</h3>
            <div className="details-section">
              <strong>GOODS</strong>
              <strong></strong>
              {products.map((product, index) => (
                <>
                <p key={index}>
                  {product.packagingId.productId.productName} - {product.flavorName} ({product.packagingId.weight} g) × {product.quantity}
                </p>
                <p >{product.price.toFixed(2)}$</p>
                </>
              ))}
            </div>
            <div className="details-section">
              <strong>Delivery</strong>
              <strong>at the carrier's rates</strong>
            </div>
            <div className="details-section">
              <strong>Total</strong>
              <strong>{orderData.totalAmount.toFixed(2)} $</strong>
            </div>
            <Link to="/" className="continue-shopping-button">
              Continue shopping <ArrowRight className="button-icon" />
            </Link>
          </div>
    </div>
  );
};


export default PurchaseSuccessComponent;