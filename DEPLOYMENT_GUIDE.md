# SkyWay Airlines - Deployment Guide

This guide explains how to deploy the SkyWay Airlines application to production.

## 1. Database (MongoDB Atlas)
Since your local MongoDB is not accessible from the internet, you must move to a cloud database.
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster and get your **Connection String**.
3. In your Backend deployment (Step 2), set the `MONGODB_URI` environment variable to this string.

## 2. Backend (Render / Railway)
The Node.js/Express backend should be hosted on a platform like Render or Railway.
1. Create an account on [Render](https://render.com/) or [Railway](https://railway.app/).
2. Connect your GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Add the following **Environment Variables**:
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (Your secret key)
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave as default)

## 3. Frontend (Netlify)
1. Go to [Netlify](https://www.netlify.com/) and connect your GitHub repository.
2. Set the **Base directory** to `frontend`.
3. Set the **Build command** to `npm run build`.
4. Set the **Publish directory** to `frontend/dist`.
5. Add the following **Environment Variable**:
   - `VITE_API_URL`: (The URL of your deployed backend, e.g., `https://your-backend.render.com/api`)

## Important: API URL
Ensure that after deploying the backend, you copy its URL and paste it into the Netlify environment variables as `VITE_API_URL`. This allows the frontend to talk to the production server instead of `localhost`.
