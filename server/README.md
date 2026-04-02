# GD Innovations Backend

## Local setup
```bash
cd server
npm install
```

## Environment
Copy `.env.example` to `.env` and set:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `STRIPE_SECRET_KEY`
- `CLIENT_URL`

Notes:
- `CLIENT_URL` should match your frontend URL exactly.
- Leave `STRIPE_SECRET_KEY` as a placeholder only if you are not testing real Stripe checkout yet.

## Seed initial data
```bash
npm run seed
```

This creates:
- Admin user: `admin@gdinnovations.com`
- Admin password: `Admin@12345`
- Starter content and products

Optional extra product seed:
```bash
npm run seed:products
```

## Start the API
```bash
npm run start
```

API base:
`http://localhost:5000/api`

## Security already enabled
- `helmet` security headers
- global request rate limit
- stricter auth rate limit on login/register
- JWT-protected admin routes
- CORS allowlist based on `CLIENT_URL`

## Production checklist
Before deployment:
1. Replace the default admin password after first login.
2. Use a long random `JWT_SECRET`.
3. Set a real `STRIPE_SECRET_KEY` when you are ready for live checkout testing.
4. Set `CLIENT_URL` to your deployed frontend domain.
5. Seed the database once, not on every deployment.
6. Do not commit `.env`.

## Main endpoints
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/referrals/my`
- `GET /auth/referrals` (admin)
- `PATCH /auth/referrals/:id/pay` (admin)
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
