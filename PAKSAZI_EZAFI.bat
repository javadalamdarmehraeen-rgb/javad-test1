@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo پاکسازی فایل و فولدر اضافی — محلی سپس گیت‌هاب
echo مسیر: %CD%
echo.
if not exist "server.js" (
  echo خطا: این فایل را داخل فولدر javad-test1 اجرا کنید.
  pause
  exit /b 1
)
echo --- حذف زباله‌های شناخته‌شده ---
for %%Z in (namayandeelmi-v11.68.0.zip namayandeelmi-v11.69.0.zip download-v11.68.0.html download-v11.69.0.html) do if exist "%%Z" del /f /q "%%Z"
if exist ".next" rd /s /q ".next"
if exist "coverage" rd /s /q "coverage"
if exist "__pycache__" rd /s /q "__pycache__"
echo.
echo --- فایل‌های اضافه نسبت به گیت ---
git status -sb
echo.
echo اگر بالا فایل اضافه دیدی، با دستورهای پایان چت commit/push کن.
echo گیت‌لب فقط اگر remote به نام gitlab داشته باشی پوش می‌شود.
echo.
pause
