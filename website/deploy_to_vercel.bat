@echo off
echo ===================================================
echo   Deploying Gym Tracker Website to Vercel
echo ===================================================
echo.
echo Running Vercel deployment...
npx -y vercel --prod
echo.
echo If prompted, log into your Vercel account in the browser.
echo Deployment finished!
pause
