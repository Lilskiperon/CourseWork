import { useState,useEffect  } from "react";
import { useLocation } from "react-router-dom";
import "./CartPage.css";
import CartComponent from "../components/CartComponent";
import DeliveryAddressComponent from "../components/DeliveryAddressComponent";
import PurchaseSuccessComponent from "../components/PurchaseSuccessComponent";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("session_id")) {
      setActiveTab(3);
    }
  }, [location]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <CartComponent setActiveTab={setActiveTab} />
        );
      case 2:
        return (
          <DeliveryAddressComponent setActiveTab={setActiveTab} />
        );
      case 3:
        return (
          <PurchaseSuccessComponent/>
        );
      default:
        return null;
    }
  };
  
  const progressWidth = ((activeTab - 1) / 2) * 100;
  return (
    <div className="cartpage-container">
      <div className="cartpage-progress">
        <div className="progress-line">
          <motion.div
            className="progress"
            style={{ width: `${progressWidth}%` }}
            initial={{ width: 0 }} 
            animate={{ width: `${progressWidth}%` }} 
            transition={{ duration: 0.2 }} 
          />
        </div>
        <div className="step-content">
          <span
            className={`step ${activeTab === 1 ? "active" : ""}${activeTab > 1 ? "selected" : ""}`}
          >
            <p>1</p>
          </span>
          Корзина
        </div>
        <div className="step-content">
          <span
            className={`step ${activeTab === 2 ? "active" : ""}${activeTab > 2 ? "selected" : ""}`}
          >
            <p>2</p>
          </span>
          Адрес доставки
        </div>
        <div className="step-content">
          <span
            className={`step ${activeTab === 3 ? "active" : ""}`}
          >
            <p>3</p>
          </span>
          Заказ готов
        </div>
      </div>
      {/* Tab Content */}
      <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
      </AnimatePresence>
      
    </div>
  );
}

export default CartPage;
