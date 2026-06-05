# VOLTIS — Backup & Restore Procedure

## Stato

VOLTIS usa Supabase come database remoto.

Il backup manuale del database viene fatto con pg_dump tramite lo script:

powershell -ExecutionPolicy Bypass -File .\scripts\backup-supabase.ps1

I backup vengono salvati localmente nella cartella:

/backups/

La cartella backups è esclusa da Git per evitare di caricare dati sensibili nel repository.

---

## Quando fare un backup

Fare un backup manuale:

- prima di modifiche importanti al database
- prima di test MT5 reali
- prima di nuove migration Prisma
- prima di import automatici trade
- prima di deploy importanti
- periodicamente quando ci sono dati reali

---

## Come creare un backup

Eseguire:

powershell -ExecutionPolicy Bypass -File .\scripts\backup-supabase.ps1

Poi verificare:

Get-ChildItem .\backups | Sort-Object LastWriteTime -Descending | Select-Object -First 5 Name, Length, LastWriteTime

Un backup valido deve avere Length maggiore di 0.

---

## Dove conservare i backup

Non lasciare i backup solo dentro la cartella locale del progetto.

Copiare almeno il backup più recente anche in una posizione esterna, per esempio:

- OneDrive
- Google Drive
- disco esterno
- chiavetta USB
- cartella privata protetta

---

## Cosa contiene il backup

Il backup .sql contiene il database PostgreSQL.

Può contenere dati sensibili, quindi non va condiviso e non va caricato su Git.

---

## Cosa NON copre completamente

Il backup database non sostituisce il backup completo della piattaforma Supabase.

Alcune cose possono richiedere configurazione manuale in caso di ripristino:

- Auth settings
- API keys
- Edge Functions
- Realtime settings
- Storage files
- variabili ambiente Vercel
- configurazioni esterne

---

## Restore — procedura da usare solo in emergenza

Il ripristino non va fatto sul database di produzione senza prima sapere esattamente cosa si sta facendo.

Procedura consigliata:

1. creare un nuovo progetto Supabase di test
2. configurare le variabili ambiente su un ambiente separato
3. ripristinare il file .sql sul nuovo database con lo script ufficiale
4. testare login, account, trades, dashboard, permessi e pagine principali
5. solo dopo valutare eventuale ripristino reale

### Script ufficiale di restore

Eseguire dalla root del progetto:

powershell -ExecutionPolicy Bypass -File .\scripts\restore-supabase.ps1 -BackupFile ".\backups\NOME_BACKUP.sql"

Lo script:
- verifica che psql.exe sia installato
- legge DIRECT_URL dal .env (connessione diretta, non pooler)
- mostra host di destinazione e dimensione del file
- chiede conferma esplicita digitando "CONFERMA" prima di procedere
- segnala errore se il restore fallisce

Non eseguire il restore sul database principale senza un backup aggiornato e senza aver testato su un ambiente separato.

---

## Regola VOLTIS

Backup prima.
Modifica dopo.