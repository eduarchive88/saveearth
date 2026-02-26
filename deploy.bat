@echo off
echo ========================================
echo Climate War Game - Auto Deploy Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo Please install Git from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [1/5] Initializing Git repository...
git init
git add .
git commit -m "Initial commit: Climate War Game"
git branch -M main

echo.
echo [2/5] Please create a GitHub repository:
echo 1. Go to: https://github.com/new
echo 2. Repository name: saveearth
echo 3. Click 'Create repository'
echo 4. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/saveearth.git)
echo.
set /p REPO_URL="Enter your GitHub repository URL: "

echo.
echo [3/5] Connecting to GitHub...
git remote add origin %REPO_URL%

echo.
echo [4/5] Pushing to GitHub...
git push -u origin main

echo.
echo [5/5] GitHub upload complete!
echo.
echo ========================================
echo Next: Deploy to Vercel
echo ========================================
echo.
echo Option 1 - Vercel Website (Recommended):
echo 1. Go to: https://vercel.com/new
echo 2. Login with GitHub
echo 3. Select 'saveearth' repository
echo 4. Click 'Deploy'
echo.
echo Option 2 - Vercel CLI:
echo Run: npm install -g vercel
echo Then: vercel login
echo Then: vercel
echo.
echo ========================================
echo Deployment URL will be: https://saveearth-xxx.vercel.app
echo ========================================
pause
