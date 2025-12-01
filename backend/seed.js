const { sequelize, User, Category, Product, Order, Delivery, Transaction, Review, AuthUser } = require('./models');
const bcrypt = require('bcryptjs');
const { USER_ROLE, ORDER_STATUS, PAYMENT_STATUS, DELIVERY_STATUS, REVIEW_TYPE } = require('./constants/enums');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database & tables created!');

    // Create Auth Users and Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminAuth = await AuthUser.create({
      id: uuidv4(),
      email: 'admin@example.com',
      encrypted_password: hashedPassword,
    });
    const adminUser = await User.create({
      id: adminAuth.id,
      role: USER_ROLE.ADMIN,
      name: 'Admin User',
      phone: '111-222-3333',
      city: 'Admin City',
    });

    const sellerAuth = await AuthUser.create({
      id: uuidv4(),
      email: 'seller@example.com',
      encrypted_password: hashedPassword,
    });
    const sellerUser = await User.create({
      id: sellerAuth.id,
      role: USER_ROLE.SELLER,
      name: 'Seller One',
      phone: '444-555-6666',
      city: 'Seller Town',
      cni: 'SELLERCNI123',
      rating: 4.5,
      total_ratings: 10,
    });

    const buyerAuth = await AuthUser.create({
      id: uuidv4(),
      email: 'buyer@example.com',
      encrypted_password: hashedPassword,
    });
    const buyerUser = await User.create({
      id: buyerAuth.id,
      role: USER_ROLE.BUYER,
      name: 'Buyer One',
      phone: '777-888-9999',
      city: 'Buyer City',
    });

    const deliveryAuth = await AuthUser.create({
      id: uuidv4(),
      email: 'delivery@example.com',
      encrypted_password: hashedPassword,
    });
    const deliveryUser = await User.create({
      id: deliveryAuth.id,
      role: USER_ROLE.DELIVERY,
      name: 'Delivery Guy',
      phone: '000-111-2222',
      city: 'Delivery City',
      cni: 'DELIVERYCNI456',
      rating: 4.8,
      total_ratings: 5,
    });

    console.log('Sample users created!');

    // Create Categories
    const categoriesData = [
      { name: 'Vegetables', slug: 'vegetables', icon: '🥬', description: 'Fresh vegetables and greens' },
      { name: 'Fruits', slug: 'fruits', icon: '🍎', description: 'Seasonal fruits' },
      { name: 'Grains & Cereals', slug: 'grains-cereals', icon: '🌾', description: 'Rice, corn, wheat, and more' },
      { name: 'Livestock', slug: 'livestock', icon: '🐄', description: 'Cattle, goats, sheep' },
      { name: 'Poultry', slug: 'poultry', icon: '🐔', description: 'Chickens, ducks, eggs' },
      { name: 'Dairy', slug: 'dairy', icon: '🥛', description: 'Milk, cheese, butter' },
      { name: 'Roots & Tubers', slug: 'roots-tubers', icon: '🥔', description: 'Cassava, yams, potatoes' },
      { name: 'Spices & Herbs', slug: 'spices-herbs', icon: '🌿', description: 'Fresh and dried spices' },
    ];

    const createdCategories = await Promise.all(
      categoriesData.map(cat => Category.create(cat))
    );
    const vegetablesCategory = createdCategories[0];
    const fruitsCategory = createdCategories[1];
    console.log('Sample categories created!');

    // Create Products
    const product1 = await Product.create({
      seller_id: sellerUser.id,
      category_id: vegetablesCategory.id,
      title: 'Organic Tomatoes',
      description: 'Freshly picked organic tomatoes from our farm.',
      price: 5.50,
      currency: 'XAF',
      stock: 100,
      unit: 'kg',
      images: ['https://example.com/tomato1.jpg', 'https://example.com/tomato2.jpg'],
      location_city: sellerUser.city,
      is_active: true,
    });

    const product2 = await Product.create({
      seller_id: sellerUser.id,
      category_id: fruitsCategory.id,
      title: 'Sweet Apples',
      description: 'Crispy and sweet red apples.',
      price: 3.20,
      currency: 'XAF',
      stock: 200,
      unit: 'kg',
      images: ['https://example.com/apple1.jpg'],
      location_city: sellerUser.city,
      is_active: true,
    });
    console.log('Sample products created!');

    // Create Order
    const order1 = await Order.create({
      buyer_id: buyerUser.id,
      order_number: `TRB${Date.now()}`,
      items: [
        { productId: product1.id, title: product1.title, price: product1.price, quantity: 2, unit: product1.unit },
        { productId: product2.id, title: product2.title, price: product2.price, quantity: 3, unit: product2.unit },
      ],
      subtotal: (product1.price * 2) + (product2.price * 3),
      delivery_fee: 2.00,
      total: (product1.price * 2) + (product2.price * 3) + 2.00,
      status: ORDER_STATUS.PENDING,
      payment_status: PAYMENT_STATUS.PENDING,
      delivery_address: '123 Buyer St',
      delivery_city: buyerUser.city,
      delivery_agency_id: null,
      buyer_notes: 'Please deliver in the evening.',
    });
    console.log('Sample order created!');

    // Create Delivery
    const delivery1 = await Delivery.create({
      order_id: order1.id,
      agency_id: deliveryUser.id,
      status: DELIVERY_STATUS.ACCEPTED,
      pickup_address: '456 Seller Rd',
      delivery_address: order1.delivery_address,
      estimated_fee: 2.00,
      notes: 'Handle with care.',
    });
    console.log('Sample delivery created!');

    // Create Transaction
    const transaction1 = await Transaction.create({
      order_id: order1.id,
      amount: order1.total,
      provider: 'Mobile Money',
      status: PAYMENT_STATUS.SUCCESS,
      payment_reference: 'TXN' + Date.now(),
      phone_number: buyerUser.phone,
    });
    console.log('Sample transaction created!');

    // Create Review
    const review1 = await Review.create({
      order_id: order1.id,
      reviewer_id: buyerUser.id,
      reviewee_id: sellerUser.id,
      rating: 5,
      comment: 'Great tomatoes and apples!',
      type: REVIEW_TYPE.PRODUCT,
    });
    console.log('Sample review created!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
