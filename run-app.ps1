# PowerShell script to run the application with environment variables
Write-Host "Starting the AtollsVibe application..."

# Read the environment variables from .env file
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            if ($value -match '^["''](.*)["'']$') {
                $value = $matches[1]
            }
            # Set environment variable
            [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
            Write-Host "Set environment variable: $key"
        }
    }
    Write-Host "Environment variables loaded from .env file"
} else {
    Write-Host "Warning: .env file not found at $envPath"
}

# Run npm dev command
Write-Host "Starting development server..."
npm run dev
