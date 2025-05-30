// Универсальная функция для работы с localStorage с sessionId
const storageHandler = {
  getItems: (sessionId, key) => {
      const items = JSON.parse(localStorage.getItem(`${sessionId}-${key}`)) || [];
      return items;
  },
  saveItems: (sessionId, key, items) => {
      localStorage.setItem(`${sessionId}-${key}`, JSON.stringify(items));
  },
  addItem: (sessionId, key, productId, flavorId, packagingId) => {
      const items = storageHandler.getItems(sessionId, key);
      const newItem = { productId, flavorId, packagingId };
      
      // Проверяем, чтобы элемент с такой комбинацией не был добавлен
      if (!items.some(item => 
          item.productId === productId && 
          item.flavorId === flavorId && 
          item.packagingId === packagingId
      )) {
          items.push(newItem);
          storageHandler.saveItems(sessionId, key, items);
      }
  },
  removeItem: (sessionId, key, productId, flavorId, packagingId) => {
      const items = storageHandler.getItems(sessionId, key).filter(item =>
          item.productId !== productId || 
          item.flavorId !== flavorId || 
          item.packagingId !== packagingId
      );
      storageHandler.saveItems(sessionId, key, items);
  }
};

// Функции для работы с корзиной, списком желаемого и сравнением
export const getCart = (sessionId) => storageHandler.getItems(sessionId, 'cart');
export const getWishlist = (sessionId) => storageHandler.getItems(sessionId, 'wishlist');
export const getComparison = (sessionId) => storageHandler.getItems(sessionId, 'comparison');

// Функции для добавления и удаления элементов
export const addToCart = (sessionId, productId, flavorId, packagingId) => {
  storageHandler.addItem(sessionId, 'cart', productId, flavorId, packagingId);
};

export const removeFromCart = (sessionId, productId, flavorId, packagingId) => {
  storageHandler.removeItem(sessionId, 'cart', productId, flavorId, packagingId);
};

export const addToWishlist = (sessionId, productId, flavorId, packagingId) => {
  storageHandler.addItem(sessionId, 'wishlist', productId, flavorId, packagingId);
};

export const removeFromWishlist = (sessionId, productId, flavorId, packagingId) => {
  storageHandler.removeItem(sessionId, 'wishlist', productId, flavorId, packagingId);
};

export const addToComparison = (sessionId, productId, flavorId, packagingId) => {
  storageHandler.addItem(sessionId, 'comparison', productId, flavorId, packagingId);
};

export const removeFromComparison = (sessionId, productId, flavorId, packagingId) => {
  storageHandler.removeItem(sessionId, 'comparison', productId, flavorId, packagingId);
};
