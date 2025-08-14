# PowerShell script to test all FootprintLog APIs with login
# Usage: Run in PowerShell from the project root

$baseUrl = "http://localhost:5000/api"
$email = "dolarjay3454@gmail.com"
$password = "Dolar@1234"

function Login {
    $body = @{ email = $email; password = $password } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
    return $response.token
}

$token = Login
Write-Host "Logged in. Token: $token"

function Test-CreateLog {
    $body = @{ 
        activityType = "transport"
        activity     = "car trip"
        details      = @{ mode = "car"; distance = 10 }
        notes        = "Test log"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/footprintlog" -Method Post -Body $body -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
}

function Test-GetLogs {
    Invoke-RestMethod -Uri "$baseUrl/footprintlog" -Method Get -Headers @{ Authorization = "Bearer $token" }
}

function Test-GetTotal {
    Invoke-RestMethod -Uri "$baseUrl/footprintlog/total" -Method Get -Headers @{ Authorization = "Bearer $token" }
}

function Test-GetBreakdown {
    Invoke-RestMethod -Uri "$baseUrl/footprintlog/breakdown/activityType" -Method Get -Headers @{ Authorization = "Bearer $token" }
    Invoke-RestMethod -Uri "$baseUrl/footprintlog/breakdown/category" -Method Get -Headers @{ Authorization = "Bearer $token" }
}

Write-Host "Creating log..."
Test-CreateLog | ConvertTo-Json | Write-Host

Write-Host "Getting all logs..."
Test-GetLogs | ConvertTo-Json | Write-Host

Write-Host "Getting total emissions..."
Test-GetTotal | ConvertTo-Json | Write-Host

Write-Host "Getting breakdowns..."
Test-GetBreakdown | ConvertTo-Json | Write-Host
