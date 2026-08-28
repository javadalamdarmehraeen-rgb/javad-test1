@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo Folder: %CD%
echo This script only shows extra untracked files. It does NOT reset hard.
echo It will NOT delete public/crm-*.js
echo.

if not exist "server.js" (
  echo ERROR: run inside javad-test1
  pause
  exit /b 1
)

where git >nul 2>&1
if errorlevel 1 (
  echo git not found
  pause
  exit /b 1
)

echo --- status ---
git status -sb
echo.
echo --- extra untracked (preview) ---
git clean -nd -e .env -e node_modules -e crm-backup-latest.json
echo.
echo Nothing was deleted. To restore missing source files:
echo   git restore -- public
echo   git restore -- OFFICIAL_FILELIST.txt
echo.
pause
