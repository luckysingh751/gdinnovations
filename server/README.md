# GD Innovations Backend

## 1. Install
```bash
cd server
npm install
```

## 2. Configure env
Copy `.env.example` to `.env` and fill:
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `CLIENT_URL`

## 3. Seed initial data (optional)
```bash
npm run seed
```
This creates:
- Admin user: `admin@gdinnovations.com`
- Admin password: `Admin@12345`
- Sample products

## 4. Start API
```bash
npm run dev
```

## API base
`http://localhost:5000/api`

## Main endpoints
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /products`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)
- `POST /orders` (auth)
- `GET /orders/my` (auth)
- `GET /orders` (admin)
- `PATCH /orders/:id/status` (admin)
- `GET /content`
- `PUT /content` (admin)
- `POST /payments/create-checkout-session` (auth)
