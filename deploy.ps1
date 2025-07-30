# Green Community Deployment Script for Windows
Write-Host "Green Community Docker Deployment Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Set Docker paths
$dockerPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
$dockerComposePath = "C:\Program Files\Docker\Docker\resources\bin\docker-compose.exe"
$dockerCredentialPath = "C:\Program Files\Docker\Docker\resources\bin"

# Add Docker bin directory to PATH for this session
$env:PATH = "$dockerCredentialPath;$env:PATH"

# Check if Docker is installed
if (-not (Test-Path $dockerPath)) {
    Write-Host "Docker is not found at expected location. Please ensure Docker Desktop is installed." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
if (-not (Test-Path $dockerComposePath)) {
    Write-Host "Docker Compose is not found. Please ensure Docker Desktop is properly installed." -ForegroundColor Red
    exit 1
}

Write-Host "Docker Desktop found!" -ForegroundColor Green

# Check Docker credential helper
$dockerCredentialDesktop = "C:\Program Files\Docker\Docker\resources\bin\docker-credential-desktop.exe"
if (-not (Test-Path $dockerCredentialDesktop)) {
    Write-Host "Docker credential helper not found. This might cause authentication issues." -ForegroundColor Yellow
}

# Check if Server/.env file exists
if (-not (Test-Path "Server\.env")) {
    Write-Host "Server\.env file not found!" -ForegroundColor Red
    Write-Host "Please make sure you have a .env file in the Server directory with your configuration." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "Found Server\.env file" -ForegroundColor Green
}

# Build and start the application
Write-Host "Building and starting Green Community application..." -ForegroundColor Cyan
& $dockerComposePath down --volumes --remove-orphans
& $dockerComposePath build --no-cache
& $dockerComposePath up -d

# Wait for services to start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if services are running
Write-Host "Checking service status..." -ForegroundColor Cyan
& $dockerComposePath ps

# Show logs
Write-Host "Recent logs:" -ForegroundColor Cyan
& $dockerComposePath logs --tail=20

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Client is available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Server API is available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "MongoDB Atlas is connected via your .env file" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs: & '$dockerComposePath' logs -f" -ForegroundColor Yellow
Write-Host "To stop: & '$dockerComposePath' down" -ForegroundColor Yellow
Write-Host "To restart: & '$dockerComposePath' restart" -ForegroundColor Yellow
