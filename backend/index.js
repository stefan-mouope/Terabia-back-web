// index.js / server.js → VERSION ULTIME, PROPRE, SILENCIEUSE & PUISSANTE

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const sequelize = require('./config/sequelize');
const config = require('./config/config');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ====================== 1. CORS ======================
app.use(cors({
  origin: true,
  credentials: true,
}));

// ====================== 2. JSON + URLENCODED ======================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ====================== 3. Morgan (propre & intelligent) ======================
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// ====================== 4. Route santé ======================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Terabia API running perfectly !',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ====================== 5. Routes ======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);      // multer + images = OK
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// ====================== 6. Images statiques ======================
app.use('/uploads', express.static('uploads'));

// ====================== 7. Errors ======================
app.use(notFound);
app.use(errorHandler);

// ====================== Socket.IO ======================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Ton code Socket.IO ici (inchangé)
const connectedUsers = new Map();
io.on("connection", (socket) => {
  // ... ton code existant ...
});

// ====================== Démarrage ======================
const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion BDD OK');
    await sequelize.sync({});
    console.log('Modèles synchronisés');

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\nServeur démarré → http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('Erreur démarrage serveur:', error);
    process.exit(1);
  }
};

startServer();