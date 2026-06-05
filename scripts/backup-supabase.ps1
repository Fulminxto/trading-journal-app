$pgDump = (Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter pg_dump.exe -ErrorAction SilentlyContinue | Select-Object -First 1).FullName

if (-not $pgDump) {
    Write-Error "pg_dump.exe non trovato. Installa PostgreSQL Command Line Tools."
    exit 1
}

# Il backup usa il pooler session mode (porta 5432) perché l'host diretto Supabase
# non è raggiungibile da reti senza IPv6. Non sostituire con l'host diretto.
$backupUrlLine = Get-Content .\.env | Where-Object { $_ -match "^BACKUP_DATABASE_URL=" } | Select-Object -First 1

if (-not $backupUrlLine) {
    Write-Error "BACKUP_DATABASE_URL non trovato nel file .env. Aggiungi la variabile con l'URL del pooler Supabase in session mode (porta 5432, es. postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres). Non usare l'host diretto db.xxx.supabase.co."
    exit 1
}

$directUrl = $backupUrlLine -replace "^BACKUP_DATABASE_URL=", ""
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
