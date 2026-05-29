# SuperLabs - Product Listing (Backend Task)

Node.js + Express + PostgreSQL + Prisma

Task: Product listing APIs, admin forms, and a small frontend to test the APIs.

## Setup

```bash
cd superlabs-backend
npm install
```

Create `.env`:

```env
PORT=5001
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/superlabs_db?schema=public"
```

```bash
createdb superlabs_db
npx prisma migrate deploy
npx prisma generate
npm run db:seed
npm run dev
```

Open http://localhost:5001 (use 5001 if port 5000 is busy on Mac)

## Pages (frontend for testing)

| Page | URL |
|------|-----|
| Search + product list | http://localhost:5001/ |
| Product detail | http://localhost:5001/product.html?id=1 |
| Admin product list | http://localhost:5001/admin.html |
| Add product | http://localhost:5001/admin-create.html |
| Edit product | http://localhost:5001/admin-edit.html?id=1 |
| Swagger | http://localhost:5001/api/docs |

## APIs (as per task document)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products?q=keyword&page=1` | Search + pagination |
| GET | `/api/products/{searchWord}` | Product details (id / sku / name) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

Product fields: name, description, price, image, sku, id, reviews, availability

## Project structure

```
src/
  app.js
  swagger.js
  routes/productRoutes.js
  public/          (html + js for testing)
prisma/
  schema.prisma
  seed.js
```

## Deploy on Render (free live URL)

1. [render.com](https://render.com) → sign in with GitHub  
2. **New +** → **PostgreSQL** (Free) → copy **Internal Database URL**  
3. **New +** → **Web Service** → repo `superlabs`  
   - **Build:** `npm install && npm run render:build`  
   - **Start:** `npm start`  
   - **Env:** `DATABASE_URL` = Postgres URL, `NODE_ENV` = `production`  
4. After deploy → **Shell:** `npm run db:seed`  
5. Live URL: `https://your-service.onrender.com`

Share repo + live URL for SuperLabs submission.
