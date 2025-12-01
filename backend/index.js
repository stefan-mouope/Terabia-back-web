require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // ← Ajouté et configuré proprement
const sequelize = require('./config/sequelize');
const config = require('./config/config');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ====================== MIDDLEWARES ======================

// CORS : indispensable pour React Native (mobile + émulateur)
app.use(cors({
  origin: true, // autorise toutes les origines en dev (ou mets une liste précise en prod)
  credentials: true,
}));

// Body parser (JSON + URL encoded)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Morgan avec logs magnifiques + IP du client (très utile avec Genymotion/téléphone)
app.use(morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const color = status >= 500 ? 31   // rouge
              : status >= 400 ? 33   // jaune
              : status >= 300 ? 36   // cyan
              : status >= 200 ? 32   // vert
              : 0;

  return [
    '\x1b[35m➜',                              // flèche violette
    '\x1b[1m' + tokens.method(req, res) + '\x1b[0m',
    tokens.url(req, res),
    '\x1b[' + color + 'm' + status + '\x1b[0m',
    tokens['response-time'](req, res) + 'ms',
    '\x1b[90mfrom\x1b[0m',
    tokens['remote-addr'](req, res) || 'localhost',
    '\x1b[90m@\x1b[0m ' + new Date().toLocaleTimeString()
  ].join(' ');
}));

// Route de santé + info utile au démarrage
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Terabia API is running perfectly !',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/signup, /api/auth/login',
      users: '/api/users',
      products: '/api/products',
    }
  });
});

// ====================== ROUTES ======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);

// ====================== ERROR HANDLING ======================
app.use(notFound);
app.use(errorHandler);

// ====================== DEMARRAGE SERVEUR ======================
const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie.');

    await sequelize.sync({ alter: true }); // ou { force: false } en prod
    console.log('✅ Modèles synchronisés avec la BDD.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🎉 Serveur démarré avec succès !\n');
      console.log(`   🌍 Local:            http://localhost:${PORT}`);
      console.log(`   📱 Téléphone Android: http://192.168.0.110:${PORT}`);
      console.log(`   🖥️  Genymotion:       http://172.18.0.1:${PORT}`);
      console.log(`   🐳 Android Studio:    http://10.0.2.2:${PORT}\n`);
      console.log(`   ⏻ Arrêt: Ctrl+C\n`);
    });
  } catch (error) {
    console.error('💥 Impossible de démarrer le serveur :', error);
    process.exit(1);
  }
};

startServer();