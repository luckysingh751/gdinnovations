# GD Innovations Deployment Guide

This project is ready to deploy as:
- frontend on Vercel
- backend on Render
- database on MongoDB Atlas

## 1. Before you deploy

Make sure you have:
- MongoDB Atlas connection string
- JWT secret
- Stripe secret key later, when you are ready
- GitHub repository with this code pushed

Important:
- change the default admin password after the first production login
- do not commit `.env` files

## 2. Deploy the backend on Render

Render service settings:
- Runtime: `Node`
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm run start`
- Health check path: `/api/health`

You can either:
- create the service manually in the Render dashboard, or
- use the included [render.yaml](C:\Users\Administrator\OneDrive\Desktop\GDinnovations\render.yaml)

Backend environment variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `STRIPE_SECRET_KEY`
- `CLIENT_URL` = your deployed frontend URL

After deployment, your backend URL will look like:
- `https://your-backend-name.onrender.com`

Health check:
- `https://your-backend-name.onrender.com/api/health`

## 3. Deploy the frontend on Vercel

Deploy the `client` app as a separate Vercel project.

Recommended settings:
- Framework preset: `Vite`
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Frontend environment variable:
- `VITE_API_URL=https://your-backend-name.onrender.com/api`

The file [vercel.json](C:\Users\Administrator\OneDrive\Desktop\GDinnovations\client\vercel.json) is included so React Router routes work correctly on refresh.

## 4. Connect frontend and backend

After Vercel gives you the frontend URL:
1. copy the Vercel site URL
2. go back to Render
3. set `CLIENT_URL` to that Vercel URL
4. redeploy the backend

This is required for:
- CORS
- Stripe success/cancel redirects
- referral links

## 5. Stripe later

Stripe is already wired into the app, but the secret key is still optional until you want real checkout.

When you are ready:
1. create a Stripe account
2. enable test mode
3. copy the test secret key
4. update `STRIPE_SECRET_KEY` in Render
5. redeploy backend

## 6. Final production checklist

Before sharing the live site:
1. confirm `/api/health` works
2. confirm admin login works
3. change the default admin password
4. create a test customer account
5. place a test cart order
6. test `Buy Now`
7. test referral registration with a code
8. test referral and affiliate forms
9. test mobile layout once on phone sizes
10. add Stripe key later when ready

## 7. Local env reference

Frontend local env:
- [client/.env.example](C:\Users\Administrator\OneDrive\Desktop\GDinnovations\client\.env.example)

Backend local env:
- [server/.env.example](C:\Users\Administrator\OneDrive\Desktop\GDinnovations\server\.env.example)
