
import { useNavigate } from 'react-router-dom';
import './CardNews.css'; // Стили карточки

const CardNews = ({ news }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/news/${news._id}`, { state: { news } });
  };

  return (
    <div className="news-card">
      <div className="news-category">{news.category || 'Uncategorized'}</div>
      <img className="news-image" src={news.image_url} alt={news.title} />
      <div className="news-content">
        <h3 className="news-title">{news.title}</h3>
        <div className="horizontal_line"></div>
        <div className="news-meta">
          <span className="news-date"><svg style={{width: "12px",height:"12px"}} ><use href='/assets/svg/sprite-icons.svg#icon-calendar'/>
            </svg>{new Date(news.date).toLocaleDateString()}</span>
          <span className="news-author">Автор: <img src='/assets/img/avatar_1.png'/> {news.author}</span>
        </div>
        <div className="horizontal_line"></div>
        <p className="news-description">{news.content.slice(0, 45)}...</p>
        <div className="horizontal_line"></div>
        <button className="news-button" onClick={handleReadMore}>Читать</button>
      </div>
    </div>
  );
};

export default CardNews;
