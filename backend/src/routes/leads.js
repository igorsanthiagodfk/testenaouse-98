const express = require('express');
const { prisma } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/leads - Criar novo lead
router.post('/', async (req, res) => {
  try {
    const {
      nome,
      empresa,
      ramo,
      sistemaRecomendado,
      utmSource,
      utmMedium,
      utmCampaign,
      pdfBaixado,
      whatsapp,
      quizAnswers
    } = req.body;

    // Validações básicas
    if (!nome || !empresa || !ramo) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: nome, empresa, ramo' 
      });
    }

    const lead = await prisma.lead.create({
      data: {
        nome,
        empresa,
        ramo,
        sistemaRecomendado,
        utmSource,
        utmMedium,
        utmCampaign,
        pdfBaixado: pdfBaixado || false,
        whatsapp,
        quizAnswers: quizAnswers || null
      }
    });

    console.log('[Leads] Novo lead capturado:', { nome, empresa, ramo });
    res.status(201).json(lead);
  } catch (error) {
    console.error('[Leads] Erro ao criar lead:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/leads - Listar todos os leads (Admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    
    let where = {};
    if (search) {
      where = {
        OR: [
          { nome: { contains: search, mode: 'insensitive' } },
          { empresa: { contains: search, mode: 'insensitive' } },
          { sistemaRecomendado: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.lead.count({ where })
    ]);

    res.json({
      leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('[Leads] Erro ao buscar leads:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/leads/stats - Estatísticas dos leads (Admin)
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [
      totalLeads,
      leadsWithPdf,
      uniqueCompanies,
      leadsToday
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { pdfBaixado: true } }),
      prisma.lead.groupBy({
        by: ['empresa'],
        _count: { empresa: true }
      }).then(result => result.length),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    res.json({
      totalLeads,
      leadsWithPdf,
      uniqueCompanies,
      leadsToday
    });
  } catch (error) {
    console.error('[Leads] Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/leads/:id - Buscar lead por ID (Admin)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const lead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    res.json(lead);
  } catch (error) {
    console.error('[Leads] Erro ao buscar lead:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/leads/:id - Atualizar lead (Admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: req.body
    });

    res.json(lead);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    console.error('[Leads] Erro ao atualizar lead:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/leads/:id - Deletar lead (Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await prisma.lead.delete({
      where: { id }
    });

    res.json({ message: 'Lead deletado com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    console.error('[Leads] Erro ao deletar lead:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;