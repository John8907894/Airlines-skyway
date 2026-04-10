@echo off
title SkyWay Airlines - Full Stack
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✈️ SKYWAY AIRLINES                        ║
echo ║                  Online Reservation System                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Starting SkyWay Airlines Services...
echo.

:: Start Backend in a new window
echo 📡 Starting Backend API...
start "SkyWay Backend" cmd /c "cd backend && npm run dev"

:: Start Frontend in this window
echo 💻 Starting Frontend Application...
cd frontend
npm run dev

pause
