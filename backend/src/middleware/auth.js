const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Middleware para autenticação de administradores
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const token = authHeader.split(' ')[1]; // Remove "Bearer " prefix
    
    if (!token) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'isti-secret-key-2024');

    // Verificar se usuário ainda existe e está ativo
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Usuário inválido ou inativo' });
    }

    // Adicionar informações do usuário ao request
    req.user = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    console.error('[Auth Middleware] Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { authenticateAdmin };