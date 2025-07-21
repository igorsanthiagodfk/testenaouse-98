const express = require('express');
const { prisma } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/diagnostic/questions - Listar todas as perguntas
router.get('/questions', async (req, res) => {
  try {
    const questions = await prisma.diagnosticQuestion.findMany({
      orderBy: {
        orderIndex: 'asc'
      }
    });

    res.json(questions);
  } catch (error) {
    console.error('[Diagnostic] Erro ao buscar perguntas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/diagnostic/questions/:id - Buscar pergunta por ID
router.get('/questions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const question = await prisma.diagnosticQuestion.findUnique({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    res.json(question);
  } catch (error) {
    console.error('[Diagnostic] Erro ao buscar pergunta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/diagnostic/questions - Criar nova pergunta (Admin)
router.post('/questions', authenticateAdmin, async (req, res) => {
  try {
    const {
      text,
      type,
      options,
      required,
      orderIndex,
      description,
      conditionField
    } = req.body;

    // Validações básicas
    if (!text || !type || !orderIndex) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: text, type, orderIndex' 
      });
    }

    const question = await prisma.diagnosticQuestion.create({
      data: {
        text,
        type,
        options: options || [],
        required: required !== undefined ? required : true,
        orderIndex: parseInt(orderIndex),
        description,
        conditionField
      }
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('[Diagnostic] Erro ao criar pergunta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/diagnostic/questions/:id - Atualizar pergunta (Admin)
router.put('/questions/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const updateData = { ...req.body };
    if (updateData.orderIndex) {
      updateData.orderIndex = parseInt(updateData.orderIndex);
    }

    const question = await prisma.diagnosticQuestion.update({
      where: { id },
      data: updateData
    });

    res.json(question);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }
    console.error('[Diagnostic] Erro ao atualizar pergunta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/diagnostic/questions/:id - Deletar pergunta (Admin)
router.delete('/questions/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await prisma.diagnosticQuestion.delete({
      where: { id }
    });

    res.json({ message: 'Pergunta deletada com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }
    console.error('[Diagnostic] Erro ao deletar pergunta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;