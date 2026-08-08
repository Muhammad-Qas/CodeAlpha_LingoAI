@echo off
title LingoAI - CodeAlpha Task 1

echo ========================================
echo        LingoAI Translation Tool
echo        CodeAlpha Task 1
echo ========================================
echo.

cd /d "%~dp0backend"

echo Starting LingoAI backend...
start "" cmd /c "python app.py"

timeout /t 3 /nobreak >nul

echo Opening LingoAI in your browser...
start "" http://127.0.0.1:5000

echo.
echo LingoAI is running.
echo Keep this window open while using the application.
echo.
pause