@echo off
REM Quick Git Commit and Push Script for Jabwood
REM Usage: quick-push.bat "Your commit message"
REM Or just run quick-push.bat and you'll be prompted for a message

echo ========================================
echo    Jabwood Quick Git Push
echo ========================================
echo.

REM Check if a commit message was provided as argument
if "%~1"=="" (
    set /p commit_msg="Enter commit message: "
) else (
    set commit_msg=%~1
)

REM Check if commit message is empty
if "%commit_msg%"=="" (
    echo Error: Commit message cannot be empty!
    pause
    exit /b 1
)

echo.
echo Adding all changes...
git add .

echo.
echo Committing changes with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing to main branch...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Success! Changes pushed to main branch
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Error: Push failed! Check the output above
    echo ========================================
    pause
    exit /b 1
)

echo.
pause

