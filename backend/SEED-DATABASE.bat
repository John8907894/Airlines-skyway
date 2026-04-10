@echo off
title SkyWay Airlines Database Seeding
color 0E
echo.
echo 🧹 Clearing and Seeding Database...
echo.
cd /d "%~dp0database"
node seed.js
echo.
echo ✅ Seeding complete!
pause
