const USER_ROLE = {
  BUYER: 'buyer',
  SELLER: 'seller',
  DELIVERY: 'delivery',
  ADMIN: 'admin',
};

const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

const DELIVERY_STATUS = {
  AVAILABLE: 'available',
  ACCEPTED: 'accepted',
  EN_ROUTE: 'en_route',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const REVIEW_TYPE = {
  PRODUCT: 'product',
  DELIVERY: 'delivery',
};

module.exports = {
  USER_ROLE,
  ORDER_STATUS,
  PAYMENT_STATUS,
  DELIVERY_STATUS,
  REVIEW_TYPE,
};
