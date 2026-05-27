# Server Optimization Script
# This script adds a 4GB Swap File to your server to speed up slow builds.

# --- Configuration ---
$SERVER_IP = "13.62.241.115"
$SSH_KEY = "C:\SSHKeys\skinhair.pem"
$USER = "ubuntu"

Write-Host "--- Optimizing Server RAM at $SERVER_IP ---" -ForegroundColor Cyan

# Commands to run on the server
$REMOTE_COMMANDS = @"
echo 'Checking Current RAM and Swap...'
free -m

if [ ! -f /swapfile ]; then
    echo 'No swap file found. Creating 4GB swap file to speed up builds...'
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo 'Swap file created and enabled!'
else
    echo 'Swap file already exists.'
fi

echo 'Final Memory Status:'
free -m
"@

ssh -i "$SSH_KEY" "${USER}@${SERVER_IP}" "$REMOTE_COMMANDS"

Write-Host "`nServer optimization complete! Your builds should be much faster now." -ForegroundColor Green
