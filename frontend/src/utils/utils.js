import axios from 'axios';
import BASE_URL from './config';

const CART_KEY = 'cart';
const WISHLIST_KEY = 'wishlist';
const COMPARISON_KEY = 'comparison';

// Универсальная функция для получения данных из localStorage
const getItems = (key) => JSON.parse(localStorage.getItem(key)) || [];

// Универсальная функция для сохранения данных в localStorage
const saveItems = (key, items) => localStorage.setItem(key, JSON.stringify(items));

// Функции для получения данных
export const getCart = () => getItems(CART_KEY);
export const getWishlist = () => getItems(WISHLIST_KEY);
export const getComparison = () => getItems(COMPARISON_KEY);

// Универсальная функция для добавления элемента
const addItem = (key, itemId) => {
    const items = getItems(key);
    if (!items.includes(itemId)) {
        items.push(itemId);
        saveItems(key, items);
    }
};

// Универсальная функция для удаления элемента
const removeItem = (key, itemId) => {
    const items = getItems(key).filter(id => id !== itemId);
    saveItems(key, items);
};

// Функции для работы с корзиной, списком желаемого и сравнением
export const addToCart = (productId) => addItem(CART_KEY, productId);
export const removeFromCart = (productId) => removeItem(CART_KEY, productId);

export const addToWishlist = (productId) => addItem(WISHLIST_KEY, productId);
export const removeFromWishlist = (productId) => removeItem(WISHLIST_KEY, productId);

export const addToComparison = (productId) => addItem(COMPARISON_KEY, productId);
export const removeFromComparison = (productId) => removeItem(COMPARISON_KEY, productId);
