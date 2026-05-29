-- Add fields inspired by reference product listing (brand, rating, sale price)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "brand" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "originalPrice" DOUBLE PRECISION;
