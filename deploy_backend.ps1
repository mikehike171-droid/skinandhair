# Backend-Only Deployment Script v5
# This script builds and deploys ONLY the backend.

# --- Configuration ---
$IP = "13.62.241.115"
$KEY = ".\skinhair.pem"
$USR = "ubuntu"
$DIR = "/home/ubuntu/skinandhair"

Write-Host "--- Starting Backend-Only Deployment ---" -ForegroundColor Cyan

# 1. Local Build
Write-Host "[1] Building Backend..." -ForegroundColor Yellow
Push-Location "backend/settings-service"
npm install
npm run build
if ($LASTEXITCODE -ne 0) { 
    Write-Host "Build Failed!" -ForegroundColor Red; Pop-Location; exit 1 
}
Write-Host "Build Successful!" -ForegroundColor Green
Pop-Location

# 2. Package
Write-Host "[2] Zipping..." -ForegroundColor Yellow
if (Test-Path "backend_build.tar.gz") { Remove-Item "backend_build.tar.gz" }
tar.exe -czf backend_build.tar.gz -C "backend/settings-service" dist package.json package-lock.json

# 3. Transfer
Write-Host "[3] Transferring..." -ForegroundColor Yellow
scp -i $KEY backend_build.tar.gz "${USR}@${IP}:${DIR}/"
scp -i $KEY backend/settings-service/.env "${USR}@${IP}:${DIR}/backend/settings-service/.env"
scp -i $KEY clean_logs.sh "${USR}@${IP}:/home/ubuntu/clean_logs.sh"

# 4. Remote Commands
Write-Host "[4] Restarting on server..." -ForegroundColor Yellow
$C1 = "tar -xzf $DIR/backend_build.tar.gz -C $DIR/backend/settings-service"
$C2 = "cd $DIR/backend/settings-service && npm install --omit=dev"
$C3 = "pm2 restart backend || pm2 start dist/main.js --name backend --time"
$C4 = "chmod +x /home/ubuntu/clean_logs.sh"
$C5 = "(crontab -l 2>/dev/null | grep -F 'clean_logs.sh') || (crontab -l 2>/dev/null; echo '0 * * * * /home/ubuntu/clean_logs.sh >> /home/ubuntu/clean_logs.log 2>&1') | crontab -"
$C6 = "pm2 status"

$REMOTE_EXEC = "$C1 ; $C2 ; $C3 ; $C4 ; $C5 ; $C6"

ssh -i $KEY "${USR}@${IP}" "$REMOTE_EXEC"

Write-Host "Done!" -ForegroundColor Green
