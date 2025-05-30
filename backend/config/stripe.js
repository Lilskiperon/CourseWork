const Stripe = require('stripe');
require('dotenv').config();

// Проверка наличия API ключа
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Инициализация Stripe с проверкой ошибок
let stripeInstance;
try {
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16' // Укажите актуальную версию API
  });
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
  throw error;
}

module.exports = stripeInstance;