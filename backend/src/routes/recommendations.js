const express = require('express');
const { prisma } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/recommendations - Listar todas as recomendações
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    
    let where = {};
    if (active !== undefined) {
      where.isActive = active === 'true';
    }
    
    const recommendations = await prisma.recommendation.findMany({
      where,
      orderBy: {
        priority: 'desc'
      }
    });

    res.json(recommendations);
  } catch (error) {
    console.error('[Recommendations] Erro ao buscar recomendações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/recommendations/find-match - Encontrar recomendação baseada em respostas do quiz
router.post('/find-match', async (req, res) => {
  try {
    const { quizAnswers } = req.body;

    if (!quizAnswers) {
      return res.status(400).json({ error: 'Quiz answers são obrigatórias' });
    }

    console.log('[Recommendations] 🚀 NOVA ENGINE: Procurando recomendação para:', quizAnswers);

    // Buscar todas as recomendações ativas
    const activeRecommendations = await prisma.recommendation.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' }
    });

    const matchingRecommendations = [];

    // ETAPA 1: Encontrar todas as recomendações que batem
    for (const recommendation of activeRecommendations) {
      let allRulesMatch = true;
      
      console.log(`[Recommendations] Testando regra: ${recommendation.name} (Prioridade: ${recommendation.priority})`);
      
      for (const rule of recommendation.rules) {
        const questionId = rule.questionId;
        const expectedValue = rule.expectedValue;
        
        // Mapear ID da pergunta para nome do campo
        const fieldMap = {
          1: 'ramo',
          2: 'prioridade', 
          3: 'porte',
          4: 'prioridadeTecnica',
          5: 'acesso'
        };
        
        const fieldName = fieldMap[questionId];
        const actualValue = quizAnswers[fieldName];
        
        console.log('[Recommendations] Verificando regra:', {
          questionId,
          fieldName,
          expectedValue,
          actualValue,
          matches: actualValue === expectedValue
        });
        
        if (actualValue !== expectedValue) {
          allRulesMatch = false;
          break;
        }
      }
      
      if (allRulesMatch) {
        console.log(`[Recommendations] ✅ Regra compatível: ${recommendation.name}`);
        matchingRecommendations.push(recommendation);
      }
    }

    // ETAPA 2: Se não encontrou nenhuma, retorna null
    if (matchingRecommendations.length === 0) {
      console.log('[Recommendations] ❌ Nenhuma recomendação específica encontrada');
      return res.json({ recommendation: null });
    }

    // ETAPA 3: A primeira já é a de maior prioridade (ordenado por priority desc)
    const winnerRecommendation = matchingRecommendations[0];
    console.log(`[Recommendations] 🏆 VENCEDORA: ${winnerRecommendation.name} (Prioridade: ${winnerRecommendation.priority})`);
    
    if (matchingRecommendations.length > 1) {
      console.log('[Recommendations] 📊 Outras recomendações encontradas:', 
        matchingRecommendations.slice(1).map(r => `${r.name} (${r.priority})`));
    }

    // Buscar soluções e produtos recomendados
    const [solutions, products] = await Promise.all([
      prisma.solution.findMany({
        where: {
          id: { in: winnerRecommendation.recommendedSolutions }
        }
      }),
      prisma.product.findMany({
        where: {
          id: { in: winnerRecommendation.recommendedProducts }
        },
        include: {
          categoryRef: true
        }
      })
    ]);

    res.json({
      recommendation: winnerRecommendation,
      solutions,
      products
    });
  } catch (error) {
    console.error('[Recommendations] Erro ao encontrar recomendação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/recommendations/:id - Buscar recomendação por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const recommendation = await prisma.recommendation.findUnique({
      where: { id }
    });

    if (!recommendation) {
      return res.status(404).json({ error: 'Recomendação não encontrada' });
    }

    res.json(recommendation);
  } catch (error) {
    console.error('[Recommendations] Erro ao buscar recomendação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/recommendations - Criar nova recomendação (Admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      priority,
      rules,
      recommendedSolutions,
      recommendedProducts,
      customTitle,
      customText,
      isActive
    } = req.body;

    // Validações básicas
    if (!name || !customText) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: name, customText' 
      });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        name,
        priority: priority || 0,
        rules: rules || [],
        recommendedSolutions: recommendedSolutions || [],
        recommendedProducts: recommendedProducts || [],
        customTitle,
        customText,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json(recommendation);
  } catch (error) {
    console.error('[Recommendations] Erro ao criar recomendação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/recommendations/:id - Atualizar recomendação (Admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const updateData = { ...req.body };
    if (updateData.priority) {
      updateData.priority = parseInt(updateData.priority);
    }

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: updateData
    });

    res.json(recommendation);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Recomendação não encontrada' });
    }
    console.error('[Recommendations] Erro ao atualizar recomendação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/recommendations/:id - Deletar recomendação (Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await prisma.recommendation.delete({
      where: { id }
    });

    res.json({ message: 'Recomendação deletada com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Recomendação não encontrada' });
    }
    console.error('[Recommendations] Erro ao deletar recomendação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;