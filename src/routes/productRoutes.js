const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { resolveImageUrl } = require('../utils/resolveImageUrl');

const router = express.Router();
const prisma = new PrismaClient();

async function buildProductData(body) {
  const image = await resolveImageUrl(body.image);

  return {
    name: body.name,
    description: body.description,
    brand: body.brand || 'General',
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
    image: image,
    sku: body.sku,
    rating: Number(body.rating) || 0,
    reviews: Number(body.reviews) || 0,
    availability: body.availability !== false && body.availability !== 'false',
  };
}

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { name, description, price, sku } = req.body;

    if (!name || !description || price === undefined || !sku) {
      return res.status(400).json({
        success: false,
        message: 'name, description, price and sku are required',
      });
    }

    const product = await prisma.product.create({
      data: await buildProductData(req.body),
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products?q=keyword&page=1&brand=...
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;
    const keyword = req.query.q;
    const brand = req.query.brand;

    const conditions = [];

  // search by product name or brand only
    if (keyword) {
      conditions.push({
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { brand: { contains: keyword, mode: 'insensitive' } },
        ],
      });
    }

    if (brand) {
      conditions.push({ brand: { equals: brand, mode: 'insensitive' } });
    }

    const filter = conditions.length > 0 ? { AND: conditions } : {};

    const orderBy = req.query.sort === 'price'
      ? { price: 'asc' }
      : { reviews: 'desc' };

    const productList = await prisma.product.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy,
    });

    const totalCount = await prisma.product.count({ where: filter });
    const totalPages = Math.ceil(totalCount / limit) || 1;

    res.json({
      success: true,
      data: {
        products: productList,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage: page,
          limit,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/brands - for filter dropdown
router.get('/meta/brands', async (req, res) => {
  try {
    const rows = await prisma.product.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    const brands = rows.map((r) => r.brand);
    res.json({ success: true, data: brands });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/{searchWord}
router.get('/:searchWord', async (req, res) => {
  try {
    const searchWord = req.params.searchWord;

    if (searchWord === 'meta') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let product = null;
    const productId = parseInt(searchWord, 10);

    if (!isNaN(productId)) {
      product = await prisma.product.findUnique({ where: { id: productId } });
    } else {
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { sku: searchWord },
            { name: { contains: searchWord, mode: 'insensitive' } },
          ],
        },
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: await buildProductData(req.body),
    });

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    await prisma.product.delete({ where: { id: productId } });

    res.json({ success: true, data: { message: 'Product deleted' } });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
