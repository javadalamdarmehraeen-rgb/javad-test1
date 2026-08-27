@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo Cleanup extra files (local). Safe: does not delete CRM source JS.
echo Folder: %CD%
echo.

if not exist "server.js" (
  echo ERROR: run this inside javad-test1
  pause
  exit /b 1
)

if exist "namayandeelmi-v11.68.0.zip" del /f /q "namayandeelmi-v11.68.0.zip"
if exist "namayandeelmi-v11.69.0.zip" del /f /q "namayandeelmi-v11.69.0.zip"
if exist "namayandeelmi-v11.70.0.zip" del /f /q "namayandeelmi-v11.70.0.zip"
if exist "namayandeelmi-v11.71.0.zip" del /f /q "namayandeelmi-v11.71.0.zip"
if exist "namayandeelmi-v11.78.0.zip" del /f /q "namayandeelmi-v11.78.0.zip"
if exist "download-v11.68.0.html" del /f /q "download-v11.68.0.html"
if exist "download-v11.69.0.html" del /f /q "download-v11.69.0.html"
if exist "download-v11.70.0.html" del /f /q "download-v11.70.0.html"
if exist ".next" rd /s /q ".next"
if exist "coverage" rd /s /q "coverage"
if exist "__pycache__" rd /s /q "__pycache__"

echo.
echo --- git status ---
git status -sb
echo.
echo Extra files above are NOT deleted automatically.
echo Restore deleted CRM sources with: git restore -- public
echo.
pause
