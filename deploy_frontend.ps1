$IP = "13.62.241.115"
$USR = "ubuntu"
$KEY = ".\skinhair.pem"
$DIR = "/home/ubuntu/skinandhair"

Write-Host "--- Starting Frontend Deployment ---" -ForegroundColor Cyan

# 1. Build
Write-Host "[1] Building Frontend..." -ForegroundColor Yellow
cd frontend
npm run build
cd ..

# 2. Package
Write-Host "[2] Zipping..." -ForegroundColor Yellow
if (Test-Path "frontend_build.tar.gz") { Remove-Item "frontend_build.tar.gz" }
tar.exe -czf frontend_build.tar.gz -C frontend .next public package.json package-lock.json .env.local

# 3. Transfer
Write-Host "[3] Transferring..." -ForegroundColor Yellow
scp -i $KEY frontend_build.tar.gz "${USR}@${IP}:${DIR}/"
scp -i $KEY clean_logs.sh "${USR}@${IP}:/home/ubuntu/clean_logs.sh"

# 4. Remote Extraction & Restart
Write-Host "[4] Restarting on server..." -ForegroundColor Yellow
$SSH_CMD = "cd $DIR && mkdir -p frontend && tar -xzf frontend_build.tar.gz -C frontend/ && cd frontend && npm install --omit=dev && (pm2 restart frontend || pm2 start npm --name frontend --time -- start) && chmod +x /home/ubuntu/clean_logs.sh && ((crontab -l 2>/dev/null | grep -F 'clean_logs.sh') || (crontab -l 2>/dev/null; echo '0 * * * * /home/ubuntu/clean_logs.sh >> /home/ubuntu/clean_logs.log 2>&1') | crontab -)"
ssh -i $KEY "${USR}@${IP}" "$SSH_CMD"

Write-Host "Done! Your updated logo and build are now live." -ForegroundColor Green
