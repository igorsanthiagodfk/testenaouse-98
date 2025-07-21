const express = require('express');
const { prisma } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/solutions - Listar todas as soluções
router.get('/', async (req, res) => {
  try {
    const { tags } = req.query;
    
    let where = {};
    if (tags) {
      const tagArray = tags.split(',');
      where = {
        tags: {
          hasSome: tagArray
        }
      };
    }
    
    const solutions = await prisma.solution.findMany({
      where,
      orderBy: {
        id: 'asc'
      }
    });

    res.json(solutions);
  } catch (error) {
    console.error('[Solutions] Erro ao buscar soluções:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/solutions/:id - Buscar solução por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const solution = await prisma.solution.findUnique({
      where: { id }
    });

    if (!solution) {
      return res.status(404).json({ error: 'Solução não encontrada' });
    }

    res.json(solution);
  } catch (error) {
    console.error('[Solutions] Erro ao buscar solução:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/solutions/slug/:slug - Buscar solução por slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const solution = await prisma.solution.findUnique({
      where: { slug: slug.startsWith('/') ? slug : `/${slug}` }
    });

    if (!solution) {
      return res.status(404).json({ error: 'Solução não encontrada' });
    }

    res.json(solution);
  } catch (error) {
    console.error('[Solutions] Erro ao buscar solução por slug:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/solutions - Criar nova solução (Admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      icon,
      tags,
      shortDescription,
      longDescription,
      features,
      pdfUrl,
      slug,
      maxPdvs
    } = req.body;

    // Validações básicas
    if (!name || !shortDescription || !longDescription || !pdfUrl || !slug) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: name, shortDescription, longDescription, pdfUrl, slug' 
      });
    }

    const solution = await prisma.solution.create({
      data: {
        name,
        icon: icon || 'Building2',
        tags: tags || [],
        shortDescription,
        longDescription,
        features: features || [],
        pdfUrl,
        slug,
        maxPdvs: maxPdvs ? parseInt(maxPdvs) : null
      }
    });

    res.status(201).json(solution);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Slug já existe' });
    }
    console.error('[Solutions] Erro ao criar solução:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/solutions/:id - Atualizar solução (Admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const updateData = { ...req.body };
    if (updateData.maxPdvs) {
      updateData.maxPdvs = parseInt(updateData.maxPdvs);
    }

    const solution = await prisma.solution.update({
      where: { id },
      data: updateData
    });

    res.json(solution);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Solução não encontrada' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Slug já existe' });
    }
    console.error('[Solutions] Erro ao atualizar solução:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/solutions/:id - Deletar solução (Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await prisma.solution.delete({
      where: { id }
    });

    res.json({ message: 'Solução deletada com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Solução não encontrada' });
    }
    console.error('[Solutions] Erro ao deletar solução:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;