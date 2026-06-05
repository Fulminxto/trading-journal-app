$pgDump = (Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter pg_dump.exe -ErrorAction SilentlyContinue | Select-Object -First 1).FullName

if (-not $pgDump) {
    Write-Error "pg_dump.exe non trovato. Installa PostgreSQL Command Line Tools."
    exit 1
}

$directUrlLine = Get-Content .\.env | Where-Object { $_ -match "^DIRECT_URL=" } | Select-Object -First 1

if (-not $directUrlLine) {
    Write-Error "DIRECT_URL non trovato nel file .env. pg_dump richiede una connessione diretta (non il pooler). Aggiungi DIRECT_URL nel .env prima di eseguire il backup."
    exit 1
}

$directUrl = $directUrlLine -replace "^DIRECT_URL=", ""
$directUrl = $directUrl.Trim('"').Trim("'")

New-Item -ItemType Directory -Force .\backups | Out-Null

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFile = ".\backups\voltis-backup-$timestamp.sql"

& $pgDump "$directUrl" --clean --if-exists --no-owner --no-privileges --file "$backupFile"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Backup fallito."
    exit 1
}

$file = Get-Item $backupFile

if ($file.Length -le 0) {
    Write-Error "Backup creato ma vuoto. Controllare connessione database."
    exit 1
}

$createTableCount = (Select-String -Path $backupFile -Pattern "CREATE TABLE" -SimpleMatch).Count

if ($createTableCount -eq 0) {
    Write-Error "Backup creato ma non contiene nessuna definizione CREATE TABLE. Il dump e' parziale o corrotto. Non usare questo file per restore."
    exit 1
}

Write-Host "Backup completato:"
Write-Host $file.FullName
Write-Host "Dimensione:" $file.Length "bytes"
Write-Host "Tabelle trovate nel dump: $createTableCount"
