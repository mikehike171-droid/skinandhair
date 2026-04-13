# Push to Git Script
# Target Repository: https://github.com/mikehike171-droid/skinandhair.git

Write-Host "--- Staging all changes ---" -ForegroundColor Cyan
git add .

Write-Host "--- Committing changes ---" -ForegroundColor Cyan
git commit -m "update: setting production details and project cleanup"

# If the branch is not already named main, rename it
Write-Host "--- Ensuring branch is 'main' ---" -ForegroundColor Cyan
git branch -M main

# Ensure remote is correct
Write-Host "--- Setting remote URL ---" -ForegroundColor Cyan
git remote set-url origin https://github.com/mikehike171-droid/skinandhair.git 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote add origin https://github.com/mikehike171-droid/skinandhair.git
}

Write-Host "--- Pushing to GitHub ---" -ForegroundColor Cyan
git push -u origin main

Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
Write-Host "Repository URL: https://github.com/mikehike171-droid/skinandhair.git" -ForegroundColor Green
