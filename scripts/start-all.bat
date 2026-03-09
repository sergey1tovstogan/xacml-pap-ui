@echo off
echo ========================================
echo  Temenos PAP UI Explorer - Starting...
echo ========================================
echo.

cd /d "%~dp0\.."

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    echo.
)

:: Kill any existing Next.js dev server on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo [INFO] Stopping existing process on port 3000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

echo [INFO] Starting Next.js dev server on http://localhost:3000
echo [INFO] Press Ctrl+C to stop
echo.

start "" http://localhost:3000

call npx next dev
