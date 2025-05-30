import { useState,useEffect,useRef } from 'react';
import ProductCarousel from '../components/ProductCarousel';
import { getNewArrivals, getRecommendations } from '../api/products';
import { getNews } from '../api/news';
import { motion, useInView } from "framer-motion";
function MainContent() {
    const [newArrivals, setNewArrivals] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [news, setNews] = useState([]);
    const [hasAnimated, setHasAnimated] = useState({
      section1: false,
      section2: false,
      section3: false,
  });
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
  
    const isInView1 = useInView(ref1, { triggerOnce: true,margin:"-200px"});
    const isInView2 = useInView(ref2, { triggerOnce: true,margin:"-200px"});
    const isInView3 = useInView(ref3, { triggerOnce: true,margin:"-200px"});
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Параллельные запросы
            const [newArrivalsData, recommendationsData, newsData] = await Promise.all([
              getNewArrivals(),
              getRecommendations(),
              getNews(),
            ]);
    
            // Установка данных в состояние
            setNewArrivals(newArrivalsData);
            setRecommendations(recommendationsData);
            setNews(newsData);
          } catch (error) {
            console.error('Ошибка загрузки данных:', error);
          }
        };
    
        fetchData();
    }, []);
    useEffect(() => {
      if (isInView1 && !hasAnimated.section1) {
          setHasAnimated((prev) => ({ ...prev, section1: true }));
      }
      if (isInView2 && !hasAnimated.section2) {
          setHasAnimated((prev) => ({ ...prev, section2: true }));
      }
      if (isInView3 && !hasAnimated.section3) {
          setHasAnimated((prev) => ({ ...prev, section3: true }));
      }
    }, [isInView1, isInView2, isInView3, hasAnimated]);
    return (
        <div className="content">
            {/* Telegram Section */}
            <section className="telegram-section">
                <div className="telegram-content">
                    <div className="text-block">
                        <h2>Присоединяйтесь<br/> к нашему сообществу<br/> в Телеграмм!</h2>
                        <p>
                            Более 3000 довольных клиентов оставляют свои видео-отзывы о нашей <br/>
                            продукции и делятся достижениями в спорте!
                        </p>
                        <a href="#" className="telegram-btn">
                            <svg>
                                <use href="/assets/svg/sprite-icons.svg#icon-telegram-white"></use>
                            </svg>
                            Telegram
                        </a>
                    </div>
                    <div className="image-block">
                        <img src="/assets/img/muscle-man3.png" alt="Muscle Man" />
                    </div>
                </div>
            </section>

            {/* Recommendation Section */}
            <motion.div
              ref={ref1}
              initial={{ opacity: 0, x: 100 }}
              animate={hasAnimated.section1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
                <ProductCarousel title="НГМасса рекомендует" products={recommendations} itemType="product" />
            </motion.div>   
            {/* Novelty Section */}
            <motion.div
              ref={ref2}
              initial={{ opacity: 0, x: -100 }}
              animate={hasAnimated.section2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
                <ProductCarousel title="Новинки" products={newArrivals} itemType="product" />
            </motion.div> 
            {/* News Section */}
            <motion.div
              ref={ref3}
              initial={{ opacity: 0, x: 100 }}
              animate={hasAnimated.section3 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
                <ProductCarousel title="Новости" products={news} itemType="news" />
            </motion.div> 
            {/* Subscription Section */}
            <div className="subscription-section">
                <div className="subscription-content">
                  <h1>Подпишись на нашу рассылку</h1>
                  <p>Подписывайся на рассылку и получай на каждый товар -5%</p>
                  <input type="email" placeholder="E-mail" className="email-input" />
                  <button className="subscribe-button">Подписаться</button>
                </div>
                <img src="/assets/img/muscle-man2.png" alt="Muscle Man"></img>
            </div>
        </div>
    );
}

export default MainContent;
