# Deployment Guide - Law Virtualization

This guide explains how to deploy the Law Virtualization platform to production.

## 1. Prerequisites
- A GitHub repository with your code.
- Accounts on:
  - **Vercel** (Frontend)
  - **Render** (Backend)
  - **Aiven** or **TiDB** (Managed MySQL Database)

## 2. Database Setup (Aiven / Managed MySQL)
1.  Create a MySQL instance on [Aiven.io](https://aiven.io/).
2.  Once running, copy the **Service URI** or connection details.
3.  Note down the HOST, PORT, USER, PASSWORD, and DB_NAME.
4.  Run your local `setupDb.js` and `seed.js` scripts but point them to the remote DB by temporarily updating your `.env`.

## 3. Backend Deployment (Render)
1.  Connect your GitHub repo to **Render**.
2.  Select **Web Service**.
3.  **Root Directory**: `server`
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  **Environment Variables**:
    - `PORT`: 5000 (standard for our app)
    - `DB_HOST`: [Your Aiven Host]
    - `DB_USER`: [Your Aiven User]
    - `DB_PASS`: [Your Aiven Password]
    - `DB_NAME`: [Your Aiven DB Name]
    - `JWT_SECRET`: [A long random string]

## 4. Frontend Deployment (Netlify)
1.  Connect your GitHub repo to **Netlify**.
2.  Click **Add new site** > **Import an existing project**.
3.  **Project Settings**:
    - **Base directory**: `client`
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
4.  **Environment Variables**:
    - Add a variable `VITE_API_URL` with the value: `[Your Render Backend URL]/api`.
5.  Click **Deploy site**.

### Note on SPA Routing
The `client/public/_redirects` file has been added to ensure that refreshing the page on Netlify doesn't result in a 404 error.

## 5. Security Checklist
- [ ] Ensure `JWT_SECRET` is strong and unique.
- [ ] Ensure all API routes are protected.
- [ ] Verify CORS settings in `server/server.js` allow your Vercel domain.
