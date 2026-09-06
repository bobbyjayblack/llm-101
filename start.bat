@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0service.ps1" start
if errorlevel 1 (
  pause
  exit /b 1
)
