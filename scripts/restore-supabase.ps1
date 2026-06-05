param (
    [Parameter(Mandatory=$false)]
    [string]$BackupFile,

    [Parameter(Mandatory=$false)]
    [string]$TargetUrl
)

# 1. Cerca psql.exe
$psql = (Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter psql.exe -ErrorAction SilentlyContinue | Select-Object -First 1).FullName

if (-not $psql) {
    Write-Error "psql.exe non trovato. Installa PostgreSQL Command Line Tools."
    exit 1
}

# 2. Determina l'URL di destinazione
if ($TargetUrl -eq "PROMPT") {
    Write-Host ""
    Write-Host "Inserisci l'URL del database di destinazione." -ForegroundColor Cyan
    Write-Host "(La password non verra' salvata nella cronologia del terminale.)" -ForegroundColor Cyan
    $directUrl = Read-Host "Target URL"
    if (-not $directUrl) {
        Write-Error "URL non inserito. Operazione annullata."
        exit 1
    }
} else {
    $directUrlLine = Get-Content .\.env | Where-Object { $_ -match "^DIRECT_URL=" } | Select-Object -First 1

    if (-not $directUrlLine) {
        Write-Error "DIRECT_URL non trovato nel file .env. Il restore richiede una connessione diretta. Aggiungi DIRECT_URL nel .env prima di eseguire il restore."
        exit 1
    }

    $directUrl = $directUrlLine -replace "^DIRECT_URL=", ""
    $directUrl = $directUrl.Trim('"').Trim("'")
}

# 3. Verifica parametro file di backup
if (-not $BackupFile) {
    Write-Error "Parametro mancante. Uso: .\scripts\restore-supabase.ps1 -BackupFile '.\backups\voltis-backup-YYYY-MM-DD_HH-mm-ss.sql'"
    exit 1
}

if (-not (Test-Path $BackupFile)) {
    Write-Error "File di backup non trovato: $BackupFile"
    exit 1
}

$backupItem = Get-Item $BackupFile

# 4. Estrai solo l'host dal DIRECT_URL (non mostrare password)
$hostMatch = [regex]::Match($directUrl, "@([^:/]+)")
$dbHost = if ($hostMatch.Success) { $hostMatch.Groups[1].Value } else { "(host non leggibile)" }

# 5. Avviso distruttivo + conferma esplicita
Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "   ATTENZIONE: OPERAZIONE DISTRUTTIVA  " -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Il restore SOVRASCRIVERA' i dati esistenti nel database." -ForegroundColor Yellow
Write-Host "Questa operazione non puo' essere annullata." -ForegroundColor Yellow
Write-Host ""
Write-Host "  File di backup : $($backupItem.FullName)" -ForegroundColor White
Write-Host "  Dimensione     : $($backupItem.Length) bytes" -ForegroundColor White
Write-Host "  Database host  : $dbHost" -ForegroundColor White
Write-Host ""
Write-Host "Per procedere, digita esattamente: CONFERMA" -ForegroundColor Cyan
Write-Host "Per annullare, digita qualsiasi altra cosa o premi Invio." -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Conferma"

if ($confirm -ne "CONFERMA") {
    Write-Host ""
    Write-Host "Restore annullato." -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "Avvio restore..." -ForegroundColor Yellow

& $psql "$directUrl" -f "$BackupFile"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Restore fallito con codice di uscita $LASTEXITCODE. Controlla l'output sopra per dettagli."
    exit 1
}

Write-Host ""
Write-Host "Restore completato." -ForegroundColor Green
Write-Host "Verifica manuale obbligatoria: login, account, trade, dashboard, permessi." -ForegroundColor Yellow
