const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar rotas
const productRoutes = require('./routes/products');
const solutionRoutes = require('./routes/solutions');
const diagnosticRoutes = require('./routes/diagnostic');
const recommendationRoutes = require('./routes/recommendations');
const leadRoutes = require('./routes/leads');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança e logging
app.use(helmet());
app.use(morgan('combined'));

// CORS configurado para permitir acesso do frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5679',
  credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ISTI Backend API'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/diagnostic', diagnosticRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/leads', leadRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ISTI Backend API rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5679'}`);
});