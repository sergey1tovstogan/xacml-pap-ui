@echo off
setlocal enabledelayedexpansion
:: Background script to pull Ollama models while the frontend is starting

echo [PULL]  Pulling nomic-embed-text model...
podman exec ollama ollama pull nomic-embed-text
if !errorlevel!==0 (
    echo [OK]    nomic-embed-text model ready.
) else (
    echo [WARN]  Failed to pull nomic-embed-text model.
)

echo [PULL]  Pulling llama3.1:8b model...
podman exec ollama ollama pull llama3.1:8b
if !errorlevel!==0 (
    echo [OK]    llama3.1:8b model ready.
) else (
    echo [WARN]  Failed to pull llama3.1:8b model.
)

echo [OK]    All model pulls complete.
