$pgDump = (Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter pg_dump.exe -ErrorAction SilentlyContinue | Select-Object -First 1).FullName

if (-not $pgDump) {
    Write-Error "pg_dump.exe non trovato. Installa PostgreSQL Command Line Tools."
    exit 1
}

$databaseUrlLine = Get-Content .\.env | Where-Object { $_ -match "^DATABASE_URL=" } | Select-Object -First 1

if (-not $databaseUrlLine) {
    Write-Error "DATABASE_URL non trovato nel file .env."
    exit 1
}

$databaseUrl = $databaseUrlLine -replace "^DATABASE_URL=", ""
$databaseUrl = $databaseUrl.Trim('"').Trim("'")

New-Item -ItemType Directory -Force .\backups | Out-Null

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFile = ".\backups\voltis-backup-$timestamp.sql"

& $pgDump "$databaseUrl" --clean --if-exists --no-owner --no-privileges --file "$backupFile"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Backup fallito."
    exit 1
}

$file = Get-Item $backupFile

if ($file.Length -le 0) {
    Write-Error "Backup creato ma vuoto. Controllare connessione database."
    exit 1
}

Write-Host "Backup completato:"
Write-Host $file.FullName
Write-Host "Dimensione:" $file.Length "bytes"