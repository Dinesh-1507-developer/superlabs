const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample products for SuperLabs product listing task (mock eCommerce data)
const products = [
  {
    name: 'Wireless Optical Mouse',
    description: 'Ergonomic wireless mouse with long battery life.',
    brand: 'Logitech',
    price: 29.99,
    originalPrice: 34.99,
    image: 'https://placehold.co/400x300?text=Wireless+Mouse',
    sku: 'SL-WM-001',
    rating: 4.3,
    reviews: 142,
    availability: true,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit keyboard with tactile switches.',
    brand: 'Redragon',
    price: 89.99,
    originalPrice: null,
    image: 'https://placehold.co/400x300?text=Keyboard',
    sku: 'SL-KB-002',
    rating: 4.6,
    reviews: 328,
    availability: true,
  },
  {
    name: 'USB-C Hub 7-in-1',
    description: 'Multiport adapter with HDMI and card reader.',
    brand: 'Anker',
    price: 45.5,
    originalPrice: 55.0,
    image: 'https://placehold.co/400x300?text=USB-C+Hub',
    sku: 'SL-HUB-003',
    rating: 4.5,
    reviews: 76,
    availability: true,
  },
  {
    name: 'Aluminium Laptop Stand',
    description: 'Adjustable stand for better desk posture.',
    brand: 'Rain Design',
    price: 35.0,
    originalPrice: null,
    image: 'https://placehold.co/400x300?text=Laptop+Stand',
    sku: 'SL-LS-004',
    rating: 4.2,
    reviews: 54,
    availability: false,
  },
  {
    name: 'HD Webcam 1080p',
    description: 'Web camera with built-in microphone.',
    brand: 'Logitech',
    price: 59.99,
    originalPrice: null,
    image: 'https://placehold.co/400x300?text=Webcam',
    sku: 'SL-WC-005',
    rating: 4.4,
    reviews: 210,
    availability: true,
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Over-ear headphones with active noise cancellation.',
    brand: 'Sony',
    price: 149.99,
    originalPrice: 179.99,
    image: 'https://placehold.co/400x300?text=Headphones',
    sku: 'SL-HP-006',
    rating: 4.8,
    reviews: 512,
    availability: true,
  },
  {
    name: 'Portable SSD 1TB',
    description: 'External solid state drive, USB 3.2.',
    brand: 'Samsung',
    price: 119.0,
    originalPrice: null,
    image: 'https://placehold.co/400x300?text=SSD',
    sku: 'SL-SSD-007',
    rating: 4.7,
    reviews: 189,
    availability: true,
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable brightness desk lamp.',
    brand: 'Philips',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://placehold.co/400x300?text=Desk+Lamp',
    sku: 'SL-DL-008',
    rating: 4.1,
    reviews: 38,
    availability: true,
  },
];

async function main() {
  console.log('Seeding SuperLabs product data...');
  await prisma.product.deleteMany();

  for (const item of products) {
    await prisma.product.upsert({
      where: { sku: item.sku },
      update: item,
      create: item,
    });
  }

  console.log('Seed completed.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
