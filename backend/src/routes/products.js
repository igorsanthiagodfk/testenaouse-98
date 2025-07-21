const express = require('express');
const { prisma } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const where = category ? { category } : {};
    
    const products = await prisma.product.findMany({
      where,
      include: {
        categoryRef: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    res.json(products);
  } catch (error) {
    console.error('[Products] Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/products/categories - Listar categorias
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    res.json(categories);
  } catch (error) {
    console.error('[Products] Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/products/:id - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categoryRef: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('[Products] Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/products - Criar novo produto (Admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      category,
      name,
      price,
      image,
      images,
      tags,
      promotionalBadges,
      shortDescription,
      longDescription,
      specifications
    } = req.body;

    // Validações básicas
    if (!category || !name || !price || !shortDescription) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: category, name, price, shortDescription' 
      });
    }

    const product = await prisma.product.create({
      data: {
        category,
        name,
        price: parseFloat(price),
        image,
        images: images || [],
        tags: tags || [],
        promotionalBadges: promotionalBadges || [],
        shortDescription,
        longDescription,
        specifications: specifications || []
      },
      include: {
        categoryRef: true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('[Products] Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/products/:id - Atualizar produto (Admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const updateData = { ...req.body };
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categoryRef: true
      }
    });

    res.json(product);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    console.error('[Products] Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/products/:id - Deletar produto (Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    console.error('[Products] Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;