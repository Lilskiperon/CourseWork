const { News } = require('../models');

// Получить все новости
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения новостей' });
  }
};

// Получить новость по ID
exports.getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await News.findByPk(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения новости' });
  }
};

// Добавить новость
exports.addNews = async (req, res) => {
  const { title, category, author, date, image_url, content } = req.body;
  try {
    const news = await News.create({ title, category, author, date, image_url, content });
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка добавления новости' });
  }
};

// Обновить новость
exports.updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, category, author, date, image_url, content } = req.body;
  try {
    const newsItem = await News.findByPk(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }
    await newsItem.update({ title, category, author, date, image_url, content });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления новости' });
  }
};

// Удалить новость
exports.deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await News.findByPk(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }
    await newsItem.destroy();
    res.json({ message: 'Новость успешно удалена' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления новости' });
  }
};
