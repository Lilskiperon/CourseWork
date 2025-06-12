const { News } = require('../models'); 

// Получить все новости
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Error receiving news' });
  }
};

// Получить новость по ID
exports.getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await News.findById(id); 
    if (!newsItem) {
      return res.status(404).json({ error: 'No news found' });
    }
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ error: 'Error receiving news' });
  }
};

exports.addNews = async (req, res) => {
  const { title, category, author, date, image_url, content } = req.body;
  try {
    const news = await News.create({ title, category, author, date, image_url, content });
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Error adding news' });
  }
};

// Обновить новость
exports.updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, category, author, date, image_url, content } = req.body;
  try {
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'No news found' });
    }
    newsItem.title = title;
    newsItem.category = category;
    newsItem.author = author;
    newsItem.date = date;
    newsItem.image_url = image_url;
    newsItem.content = content;
    await newsItem.save();  
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ error: 'News update error' });
  }
};

// Удалить новость
exports.deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await News.findById(id);  
    if (!newsItem) {
      return res.status(404).json({ error: 'No news found' });
    }
    await newsItem.remove(); 
    res.json({ message: 'News successfully deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting news' });
  }
};
