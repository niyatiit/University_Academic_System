@echo off
cd /d "%~dp0"

start "Backend" cmd /k "cd /d Server && npm run dev"
start "Frontend" cmd /k "cd /d Client && npm run dev"

timeout /t 8 /nobreak >nul
start http://localhost:5173