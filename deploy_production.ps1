# Production Deployment Script v3 (Local Build & Push)
# This script builds locally, zips the artifacts, and deploys to 13.62.241.115.

# --- Configuration ---
$SERVER_IP = "13.62.241.115"
$SSH_KEY = ".\skinhair.pem"
$USER = "ubuntu"
$REMOTE_PATH = "/home/ubuntu/skinandhair"

Write-Host "--- Starting Local Build & Deployment to $SERVER_IP ---" -ForegroundColor Cyan

# 1. Local Build
Write-Host "`n[1/5] Building Backend locally..." -ForegroundColor Yellow
Push-Location "backend/settings-service"
npm install
npm run build
Pop-Location

Write-Host "`n[1/5] Building Frontend locally..." -ForegroundColor Yellow
Push-Location "frontend"
npm install
npm run build
Pop-Location

# 2. Package Artifacts
Write-Host "`n[2/5] Zipping build artifacts (using tar for speed)..." -ForegroundColor Yellow
# Backend Tar
if (Test-Path "backend_build.tar.gz") { Remove-Item "backend_build.tar.gz" }
tar.exe -czf backend_build.tar.gz -C "backend/settings-service" dist package.json package-lock.json

# Frontend Tar (Excluding cache)
Write-Host "Cleaning up large .next/cache to speed up transfer..." -ForegroundColor Cyan
if (Test-Path "frontend/.next/cache") { Remove-Item -Recurse -Force "frontend/.next/cache" }
if (Test-Path "frontend_build.tar.gz") { Remove-Item "frontend_build.tar.gz" }
tar.exe -czf frontend_build.tar.gz -C "frontend" .next public package.json package-lock.json next.config.mjs

# 3. Transfer Artifacts and Env files
Write-Host "`n[3/5] Transferring files to server..." -ForegroundColor Yellow
scp -i "$SSH_KEY" "backend_build.tar.gz" "frontend_build.tar.gz" "${USER}@${SERVER_IP}:${REMOTE_PATH}/"
# Transfer secrets
scp -i "$SSH_KEY" "backend/settings-service/.env" "${USER}@${SERVER_IP}:${REMOTE_PATH}/backend/settings-service/.env"
scp -i "$SSH_KEY" "frontend/.env.local" "${USER}@${SERVER_IP}:${REMOTE_PATH}/frontend/.env.local"
scp -i "$SSH_KEY" "clean_logs.sh" "${USER}@${SERVER_IP}:/home/ubuntu/clean_logs.sh"

# 4. Remote Extraction and Cleanup
Write-Host "`n[4/5] Extracting artifacts on server..." -ForegroundColor Yellow
$REMOTE_COMMANDS = @"
set -e
cd $REMOTE_PATH

echo "Extracting Backend..."
mkdir -p backend/settings-service/dist
tar -xzf backend_build.tar.gz -C backend/settings-service/dist
cd backend/settings-service
npm install --omit=dev

echo "Extracting Frontend..."
cd $REMOTE_PATH
mkdir -p frontend
tar -xzf frontend_build.tar.gz -C frontend/
cd frontend
npm install --omit=dev

echo "Restarting services with PM2..."
pm2 delete all || true
cd $REMOTE_PATH/backend/settings-service
pm2 start dist/main.js --name backend --time
cd $REMOTE_PATH/frontend
pm2 start npm --name frontend --time -- start

echo "Verifying service status..."
pm2 status
pm2 list

echo "Setting up hourly log cleanup..."
chmod +x /home/ubuntu/clean_logs.sh
(crontab -l 2>/dev/null | grep -F "clean_logs.sh") || (crontab -l 2>/dev/null; echo "0 * * * * /home/ubuntu/clean_logs.sh >> /home/ubuntu/clean_logs.log 2>&1") | crontab -
echo "Log cleanup cron job registered."

# Clean up artifacts
cd $REMOTE_PATH
rm backend_build.tar.gz frontend_build.tar.gz
"@

ssh -i "$SSH_KEY" "${USER}@${SERVER_IP}" "$REMOTE_COMMANDS"

Write-Host "`nDeployment Complete!" -ForegroundColor Green
Write-Host "You can verify the site at http://$SERVER_IP:3000/admin/login" -ForegroundColor Green
