const sequelize = require('../config/database');
const Product = require('./Product');
const User = require('./User');
const News = require('./News');
const Order = require('./Order');
const Review = require('./Review');
const CartItem = require('./CartItem');
const Wishlist = require('./Wishlist');
const Flavor = require('./Flavor');
const Comparison = require('./Comparison');
const ShoppingCart = require('./ShoppingCart');
const PromoCode = require('./Promocode');
const Packaging = require('./Packaging');

// User -> Order
User.hasMany(Order, { foreignKey: 'user_Id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_Id' });

// User -> Wishlist
User.hasMany(Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

// User -> Review
User.hasMany(Review, { foreignKey: 'user_Id', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'user_Id' });

// Product -> Review
Product.hasMany(Review, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'product_id' });
// Product -> CartItem
Product.hasMany(CartItem, { foreignKey: 'product_Id', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_Id' });

// User -> CartItem (внешний ключ userId)
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

// CartItem -> User
User.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'cartId' });

// User -> Comparison
User.hasMany(Comparison, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comparison.belongsTo(User, { foreignKey: 'userId' });

// Product -> Comparison
Product.hasMany(Comparison, { foreignKey: 'productId', onDelete: 'CASCADE' });
Comparison.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(Packaging, { foreignKey: 'productId',onDelete: 'CASCADE', as:'packagingOptions' });
Packaging.belongsTo(Product, { foreignKey: 'productId', as:'product' });

Flavor.hasMany(Packaging, { foreignKey: 'packagingId',onDelete: 'CASCADE', as:'packagingOptions' });
Packaging.belongsTo(Flavor, { foreignKey: 'packagingId', as:'flavor' });

module.exports = {
    sequelize,
    Product,
    News,
    User,
    Order,
    Review,
    CartItem,
    Wishlist,
    Flavor,
    Comparison,
    ShoppingCart,
    PromoCode,
    Packaging,
};
