const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const User = require('./userModel')(sequelize, Sequelize);
const Category = require('./categoryModel')(sequelize, Sequelize);
const Product = require('./productModel')(sequelize, Sequelize);
const Order = require('./orderModel')(sequelize, Sequelize);
const Delivery = require('./deliveryModel')(sequelize, Sequelize);
const Transaction = require('./transactionModel')(sequelize, Sequelize);
const Review = require('./reviewModel')(sequelize, Sequelize);
const AuthUser = require('./authUserModel')(sequelize, Sequelize);

// Define Associations
AuthUser.hasOne(User, { foreignKey: 'id', onDelete: 'CASCADE' });
User.belongsTo(AuthUser, { foreignKey: 'id' });

User.hasMany(Product, { foreignKey: 'seller_id', as: "products", onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'seller_id', as: "seller" });


Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Order, { foreignKey: 'buyer_id' });
Order.belongsTo(User, { foreignKey: 'buyer_id' });

User.hasMany(Delivery, { foreignKey: 'agency_id' });
Delivery.belongsTo(User, { foreignKey: 'agency_id' });

Order.hasOne(Delivery, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Delivery.belongsTo(Order, { foreignKey: 'order_id' });

Order.hasMany(Transaction, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Transaction.belongsTo(Order, { foreignKey: 'order_id' });

Order.hasMany(Review, { foreignKey: 'order_id' });
Review.belongsTo(Order, { foreignKey: 'order_id' });

User.hasMany(Review, { foreignKey: 'reviewer_id' });
Review.belongsTo(User, { foreignKey: 'reviewer_id' });

User.hasMany(Review, { foreignKey: 'reviewee_id' });
Review.belongsTo(User, { foreignKey: 'reviewee_id' });


module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  Delivery,
  Transaction,
  Review,
  AuthUser
};
