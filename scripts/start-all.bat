@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Temenos PAP UI Explorer - Starting...
echo ========================================
echo.

cd /d "%~dp0\.."

:: ----------------------------------------
:: 1. Start Ollama (Podman)
:: ----------------------------------------
echo [CHECK] Ollama...
curl -s http://localhost:11434 >nul 2>&1
if !errorlevel!==0 (
    echo [OK]    Ollama is already running.
) else (
    echo [INFO]  Starting Ollama via Podman...
    podman start ollama >nul 2>&1
    if !errorlevel! neq 0 (
        podman image exists docker.io/ollama/ollama >nul 2>&1
        if !errorlevel! neq 0 (
            echo [INFO]  Pulling Ollama image ^(first time may take a few minutes^)...
            podman pull docker.io/ollama/ollama
        )
        echo [INFO]  Creating Ollama container...
        podman run -d --name ollama -p 11434:11434 -v ollama_data:/root/.ollama docker.io/ollama/ollama >nul 2>&1
    )
    :: Wait for Ollama to be ready
    set retries=0
    :wait_ollama
    if !retries! geq 15 (
        echo [WARN]  Ollama did not start within 15 seconds.
        goto check_chroma
    )
    curl -s http://localhost:11434 >nul 2>&1
    if !errorlevel!==0 (
        echo [OK]    Ollama started.
    ) else (
        set /a retries+=1
        timeout /t 1 /nobreak >nul
        goto wait_ollama
    )
)

:: ----------------------------------------
:: 2. Start ChromaDB (Podman)
:: ----------------------------------------
:check_chroma
echo [CHECK] ChromaDB...
curl -s http://localhost:8000/api/v1/heartbeat >nul 2>&1
if !errorlevel!==0 (
    echo [OK]    ChromaDB is already running.
) else (
    echo [INFO]  Starting ChromaDB via Podman...
    podman start chromadb >nul 2>&1
    if !errorlevel! neq 0 (
        podman image exists docker.io/chromadb/chroma >nul 2>&1
        if !errorlevel! neq 0 (
            echo [INFO]  Pulling ChromaDB image ^(first time may take a few minutes^)...
            podman pull docker.io/chromadb/chroma
        )
        echo [INFO]  Creating ChromaDB container...
        podman run -d --name chromadb -p 8000:8000 -v chroma_data:/chroma/chroma docker.io/chromadb/chroma >nul 2>&1
    )
    :: Wait for ChromaDB to be ready
    set retries=0
    :wait_chroma
    if !retries! geq 15 (
        echo [WARN]  ChromaDB did not start within 15 seconds.
        goto start_next
    )
    curl -s http://localhost:8000/api/v1/heartbeat >nul 2>&1
    if !errorlevel!==0 (
        echo [OK]    ChromaDB started.
    ) else (
        set /a retries+=1
        timeout /t 1 /nobreak >nul
        goto wait_chroma
    )
)

:: ----------------------------------------
:: 3. Start Next.js
:: ----------------------------------------
:start_next
echo.

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
