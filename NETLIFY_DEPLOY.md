# 🚀 Manual Netlify Deployment Guide

## Quick Steps to Deploy SkyWay Airlines to Netlify

---

## Method 1: Drag & Drop (Easiest)

### Step 1: Build Your Project
```bash
cd c:/Users/HP/Desktop/airlines/frontend
npm run build
```

### Step 2: Go to Netlify
1. Open: https://app.netlify.com/drop
2. Drag the `dist` folder from your project
3. Netlify will deploy instantly
4. Copy the live URL

---

## Method 2: Netlify CLI

### Install Netlify CLI:
```bash
npm install -g netlify-cli
```

### Login to Netlify:
```bash
netlify login
```

### Deploy:
```bash
cd c:/Users/HP/Desktop/airlines/frontend
netlify deploy --prod
```

---

## Method 3: GitHub + Netlify

### Step 1: Push to GitHub
```bash
cd c:/Users/HP/Desktop/airlines
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skyway-airlines.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Choose GitHub
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click "Deploy site"

---

## Expected Live URL Format:
```
https://skyway-airlines-XXXX.netlify.app
```

Replace XXXX with your unique site ID

---

## 🔧 Build Configuration

Your `netlify.toml` should contain:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ✅ After Deployment:

1. **Test the live URL**
2. **Login with demo credentials:**
   - User: user@skyway.com / user123
   - Admin: admin@skyway.com / admin123
3. **Check all features work**
4. **Share the link!**

---

## 🎯 Your Website Will Have:

- ✅ Login/Logout System
- ✅ Flight Search
- ✅ Seat Selection
- ✅ Payment System
- ✅ WhatsApp/Email Sharing
- ✅ Admin Panel
- ✅ Mobile Responsive Design

---

## 📱 Live Site Features:

Your deployed site will include all components:
1. Authentication system
2. Flight booking
3. Seat selection (window/middle/aisle)
4. Payment module (QR code, card, bank)
5. Social sharing
6. Digital tickets

---

**Go to https://app.netlify.com/drop now and deploy your SkyWay Airlines!** 🚀
