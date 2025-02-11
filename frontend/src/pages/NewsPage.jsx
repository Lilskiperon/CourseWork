import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NewsPage.css';

const NewsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { news } = location.state || {};

  if (!news) {
    return <p>Новость не найдена.</p>;
  }

  return (
    <div className="news-page">
      <div className="news-page-header">
        <h1>{news.title}</h1>
        <p className="news-page-meta">
          {new Date(news.date).toLocaleDateString()} | Автор: {news.author} | Категория: {news.category || 'Без рубрики'}
        </p>
      </div>
      <img className="news-page-image" src={news.image_url} alt={news.title} />
      <div className="news-page-content">
        <p>{news.content}</p>
      </div>
      <div className="news-page-footer">
        <button className="back-button" onClick={() => navigate(-1)}>
          Назад к новостям
        </button>
      </div>
    </div>
  );
};

export default NewsPage;
