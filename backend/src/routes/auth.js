const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

const router = express.Router();

// POST /api/auth/login - Login do administrador
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário admin
    const admin = await prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        isActive: true
      }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        name: admin.name 
      },
      process.env.JWT_SECRET || 'isti-secret-key-2024',
      { expiresIn: '24h' }
    );

    console.log('[Auth] Login realizado:', admin.email);

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('[Auth] Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/verify - Verificar token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório' });
    }

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
      return res.status(401).json({ error: 'Token inválido' });
    }

    res.json({
      valid: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    console.error('[Auth] Erro na verificação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;