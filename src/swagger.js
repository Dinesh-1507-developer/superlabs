module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'SuperLabs Product Listing API',
    version: '1.0.0',
    description: 'SuperLabs Backend Developer Task - eCommerce product service',
  },
  servers: [{ url: 'http://localhost:5001' }],
  paths: {
    '/api/products': {
      get: {
        summary: 'Search products with pagination',
        description: 'Search by name or brand. Example: GET /api/products?q=keyword&page=1&limit=6',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'brand', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['relevance', 'price'] } },
        ],
        responses: { 200: { description: 'product list' } },
      },
      post: { summary: 'Create product', responses: { 201: { description: 'created' } } },
    },
    '/api/products/meta/brands': {
      get: { summary: 'List brands for filter', responses: { 200: { description: 'brand names' } } },
    },
    '/api/products/{searchWord}': {
      get: {
        summary: 'Product details',
        description: 'Task example: GET /api/products/{search word}',
        parameters: [{ name: 'searchWord', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'name, description, price, image, sku, id, rating, reviews, availability, brand' } },
      },
    },
    '/api/products/{id}': {
      put: { summary: 'Update product', responses: { 200: { description: 'updated' } } },
      delete: { summary: 'Delete product', responses: { 200: { description: 'deleted' } } },
    },
  },
};
