@echo off
echo ========================================
echo  Temenos PAP UI Explorer - Stopping...
echo ========================================
echo.

cd /d "%~dp0\.."

set found=0

:: ----------------------------------------
:: 1. Stop Next.js
:: ----------------------------------------
:: Kill any process on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo [INFO] Stopping process on port 3000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
    set found=1
)

:: Also kill any node processes running next
for /f "tokens=2" %%a in ('tasklist ^| findstr "node.exe" 2^>nul') do (
    wmic process where "ProcessId=%%a" get CommandLine 2>nul | findstr "next" >nul 2>&1
    if not errorlevel 1 (
        echo [INFO] Stopping Next.js node process (PID: %%a)
        taskkill /PID %%a /F >nul 2>&1
        set found=1
    )
)

if %found%==0 (
    echo [INFO] No running Next.js server found.
) else (
    echo [OK]   Next.js server stopped.
)

:: ----------------------------------------
:: 2. Stop ChromaDB (Podman)
:: ----------------------------------------
echo.
echo [CHECK] ChromaDB...
podman stop chromadb >nul 2>&1
if %errorlevel%==0 (
    echo [OK]   ChromaDB container stopped.
) else (
    echo [INFO] ChromaDB container was not running.
)

:: ----------------------------------------
:: 3. Stop Ollama (Podman)
:: ----------------------------------------
echo [CHECK] Ollama...
podman stop ollama >nul 2>&1
if %errorlevel%==0 (
    echo [OK]   Ollama container stopped.
) else (
    echo [INFO] Ollama container was not running.
)

echo.
echo [DONE] All services stopped.
echo.
pause
