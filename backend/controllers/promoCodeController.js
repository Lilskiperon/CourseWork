const { Sequelize,PromoCode } = require('../models');

  // Получение всех промокодов
exports.getAllPromoCodes= async (req, res) => {
    try {
      const promoCodes = await PromoCode.findAll();
      res.json(promoCodes);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error });
    }
};

  // Проверка промокода
exports.checkPromoCode= async (req, res) => {
    try {
      const { code } = req.params;
      const promoCode = await PromoCode.findOne({
        where: {
          code,
          usesLeft: { [Sequelize.Op.gt]: 0 },
          [Sequelize.Op.or]: [{ expiresAt: null }, { expiresAt: { [Sequelize.Op.gt]: new Date() } }],
        },
      });

      if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Промокод не найден или истёк.' });
      }

      res.json({ success: true, promoCode });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error });
    }
};

  // Применение промокода
  exports.applyPromoCode= async (req, res) => {
    try {
      const { code } = req.body;
      const promoCode = await PromoCode.findOne({
        where: {
          code,
          usesLeft: { [Sequelize.Op.gt]: 0 },
          [Sequelize.Op.or]: [{ expiresAt: null }, { expiresAt: { [Sequelize.Op.gt]: new Date() } }],
        },
      });

      if (!promoCode) {
        return res.status(404).json({ success: false, message: 'Промокод не найден или истёк.' });
      }

      promoCode.usesLeft -= 1;
      await promoCode.save();

      res.json({ success: true, promoCode });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error });
    }
};

