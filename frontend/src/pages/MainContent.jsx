import React, { useState,useEffect } from 'react';
import ProductCarousel from '../components/ProductCarousel';
import { getNewArrivals, getRecommendations } from '../api/products';
import { getNews } from '../api/news';
function MainContent() {
    const [newArrivals, setNewArrivals] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [news, setNews] = useState([]);
    
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

    return (
        <div>
            {/* Telegram Section */}
            <section className="telegram-section">
                <div className="content">
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
            <ProductCarousel title="НГМасса рекомендует" products={recommendations} itemType="product" />

            {/* Novelty Section */}
            <ProductCarousel title="Новинки" products={newArrivals} itemType="product" />
            
            {/* News Section */}
            <ProductCarousel title="Новости" products={news} itemType="news" />

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
