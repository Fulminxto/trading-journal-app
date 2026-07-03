# VOLTIS — REBRAND BLUEPRINT

> Documento unico di consolidamento del rebranding progettato nella fase di design sartoriale. Estrae e ordina solo ciò che è già stato deciso o discusso. Riferimento per Claude Code. Non introduce idee nuove.

---

## 0. Valori finali ratificati (audit)

Valori canonici da usare in costruzione. Sovrascrivono qualsiasi valore indicativo citato altrove nel documento.

**Typography**
- Hero → 36 / 800
- Section → 24 / 700

**Radius**
- 8 → controls
- 14 → cards
- 20 → hero containers
- 999 → pills

**Motion (durate)**
- Hover → 160ms
- Transition → 220ms
- Modal → 260ms
- Page → 320ms
- Ceremony → 360ms

**Motion di cerimonia consentite**
- scan
- shimmer

**Surface depth**
- 5 livelli (bg-deep → bg-base → surface-1 → surface-2 → cristallo elevato)

**Notifications**
- "View all" → `/notifications` obbligatorio nel pannello notifiche (ogni stato, incluso vuoto)

---

## 1. Rebrand Goal

L'obiettivo del rebranding è trasformare VOLTIS da un trading journal dall'aspetto generico e "spento" — pieno di superfici nero-buco, accenti arcobaleno usati a caso, metriche in scatoloni mezzi vuoti e pagine che si clonavano tra loro — in un **sistema operativo di trading premium con un'anima coerente e riconoscibile**.

Il rebranding nasce da una brand story precisa ("cristallo e fulmine") e da un metodo: **design sartoriale**, cioè disegnare ogni schermata come mockup approvato dal founder PRIMA di costruire, così che la costruzione sia poi filata e senza incertezze. Ogni pagina è stata rivista con lo stesso metro: diagnosi della "malattia" → cura con anima → identità distinta → collegamenti di sistema.

Il fine ultimo: che ogni schermata dell'app parli la stessa lingua visiva, che l'energia creativa sia spesa dove conta (gli eroi di pagina, i momenti vivi), e che il resto sia calmo, pulito e curato — perché in VOLTIS **il lusso è la sottrazione**.

---

## 2. Brand Direction

L'identità finale desiderata è **"cristallo e fulmine"**: freddo, elettrico, notturno, preciso, ad alta tensione.
- **Cristallo** = valore, struttura, disciplina (superfici solide e preziose con accenno di sfaccettatura, angoli affilati).
- **Frattura / fulmine** = energia, volatilità (la firma vive nel movimento, mai come icona-fulmine stock).

VOLTIS deve sentirsi:
- **Premium** — curato in ogni dettaglio, per sottrazione, non per decorazione.
- **Privato / selettivo** — accesso riservato, "per pochi eletti", non mass market. La copertina (login) e la cerimonia d'ingresso (onboarding) lo dichiarano.
- **Serio** — uno strumento professionale che non finge profondità con zeri finti; dichiara l'incertezza quando i dati sono pochi.
- **Trading operating system** — un OS operativo ("Private Trading OS"), non un'app tra tante.

VOLTIS NON deve sembrare:
- un **SaaS generico** (card templated, dashboard piatte);
- una **dashboard crypto/game** (glow diffuso ovunque, accenti arcobaleno, neon costante).

Premium per il founder = **esclusività + crescita + cura**: un'app riservata, gratuita, fatta per FAR CRESCERE il trader, non per estrarre soldi — l'opposto delle app di massa. I riferimenti (Sintra/DeepSage/FTMO/TradingView) si studiano per tecnica, non si copiano.

App gemella: **VITALIS** (personal OS, calda — "foglia e crescita", oro→verde, "respira"), controparte calda di VOLTIS. Fuori perimetro qui, ma coerente come sistema.

---

## 3. Visual Identity

### Palette colori (token in globals.css, Tailwind 4 CSS-first)
```
--color-accent:        #2E62E6   (blu)
--color-accent-bright: #5BE0FF   (ciano — accento vivo)
--color-flash:         #EAF7FF   (bianco-ghiaccio, testo forte / punta scintilla)
--color-halo:          #34A8FF   (alone — solo in movimento)
--color-bg-base:       #0C1430   (fondo notturno)
--color-bg-deep:       #060A1A   (fondo profondo)
--color-surface-1:     #071018   (sidebar / dropdown / card)
--color-surface-2:     #0A1020   (input / sub-card, blu-navy)
--color-positive:      #4ADE80   (verde)
--color-negative:      #F87171   (rosso)
--color-warning:       #FCD34D   (giallo)
testo muto:            #9fb4dd / #7d8db5 / #5f7099  (dal più chiaro al più scuro)
```

**Regola d'oro del colore (fondamentale):** accenti UNIFORMI e semantici.
- ciano = neutro / info / hover / attivo
- verde = positivo (profitto)
- rosso = negativo (perdita)
- giallo = warning
- Mai arcobaleno. Lo stesso dato non cambia colore secondo la posizione. **Il colore lo accendono i dati, non il design.** I numeri restano neutri finché un dato non li accende.
- **Colore-etichetta in famiglia fredda**: dove serve un colore solo per *distinguere* (non per *significare*) — es. colore-strategia in Playbook, badge-ruolo in Members — usare tonalità fredde (ciano/blu/halo/neutro), MAI verde/rosso/giallo. Quei tre restano riservati al significato semantico. Un linguaggio di colore solo.

### Font
- **Inter ovunque**, un solo font in tutta l'app. Pulsanti a peso normale e dimensione contenuta; mai font marcati che "stonano".
- Scala tipografica — **valori finali ratificati (audit):**
  - **Hero → 36 / 800**
  - **Section → 24 / 700**
  - (a contorno, non ratificati in audit ma in uso: subsection 18/600, metric-lg 32/800 tabular, metric 24/700 tabular, body 14/400, caption 12/500, micro 11/500, tabular-nums per i numeri.)
- Tracking label .16em / section .20 / hero .25 / brand .42em.

### Spacing & ritmo
- Le pagine hanno un **ritmo**, non monotonia: eroe dominante → metriche compatte → sezioni a contorno. Niente "muri" (di campi o di card).
- Metriche COMPATTE (tessere piccole ordinate), mai scatoloni enormi mezzi vuoti con spazio morto.

### Radius — valori finali ratificati (audit)
- **8** — controls (input, pulsanti, toggle, dropdown)
- **14** — cards
- **20** — hero containers
- **999** — pills

### Shadows
- A riposo: nessuna ombra "urlata", nessun glow.
- Hover cliccabile: `box-shadow: 0 10px 30px rgba(0,0,0,.3), 0 0 22px rgba(52,168,255,.12)` + `translateY(-2px)`.

### Surfaces — profondità a 5 livelli (ratificata, audit)
Il sistema di superfici ha **5 livelli di profondità** (dal fondo alla superficie più alta), così che la gerarchia sia leggibile per elevazione e non per colori diversi:
1. **bg-deep** (#060A1A) — fondo profondo dell'app.
2. **bg-base** (#0C1430) — fondo pagina / notturno.
3. **surface-1** (#071018) — sidebar / dropdown / card di primo livello.
4. **surface-2** (#0A1020, blu-navy) — sub-card / input / campi dentro una card.
5. **cristallo elevato** — l'eroe e le superfici in risalto: card cristallo `linear-gradient(160deg, rgba(46,98,230,.08), #071018 55%, #0A1020)` + bordo `0.5px rgba(234,247,255,.1)` + **faccia luminosa in alto** (linea bianca sfumata, `::before`).
- Freddo notturno, MAI nero-buco (il nero piatto/spento è bandito: tutte le superfici hanno la tinta blu del cristallo).

### Icon style
- Icone **Tabler outline**, sempre in **tessera-cristallo neutra** a riposo (`linear-gradient(145deg, rgba(234,247,255,.06), rgba(10,16,32,.6))`, bordo 0.5px, icona #9fb4dd). La luce ciano arriva **solo all'hover**.
- Tutte le icone distinte tra loro (niente duplicati). Nessuna icona-fulmine stock (la frattura è geometria + energia, non un'icona).
- Niente emoji nell'interfaccia.

### Logo usage
- Logo-cristallo in tessera in alto nella sidebar, accompagnato da "VOLTIS / Performance System"; footer-firma "Private Trading OS / v0.1.0".
- Il logo può pulsare/avere un micro-guizzo solo in momenti-cerimonia (login, avvio) — mai un glow fisso a riposo.

### Loader usage
- **VoltisLightningLoader** (loader-fulmine) già ribrandizzato ai colori VOLTIS (RGB 46,98,230, bg-base). Usato durante i caricamenti (es. login "Accedi").
- (VITALIS avrà come controparte un "breathing leaf" loader — fuori perimetro VOLTIS.)

---

## 4. Layout System

### Sidebar
- Gradiente surface-1→surface-2, logo-cristallo + "VOLTIS / Performance System" in alto, footer-firma "Private Trading OS / v0.1.0" in basso.
- Voci divise in **gruppi con micro-etichette**: **WORKSPACE** (Dashboard, Trading Diary, Calendar, Equity, Analytics, Reports, Copilot, Sessions, Rules & Goals, Integrations) e **GENERALE** (Updates, Switch Account), separati da divisore sottile. Etichette micro e tenui (uppercase, tracking, peso normale).
- Voce attiva = **sfumato ciano** (gradiente, non velo piatto, non neon) + barra-edge.
- **Edge che scivola**: la barra-edge ciano + lo sfondo sfumato della voce attiva SCIVOLANO fluidi (transition transform .4s cubic-bezier) da una voce all'altra al cambio pagina — il "particolare" della sidebar sta nel movimento, non in orpelli.
- **Scrollbar nascosta + sfumato** ai bordi (le voci svaniscono in alto/basso quando c'è altro da scorrere; lo sfumato sparisce agli estremi).
- Icone tutte distinte e neutre (ciano solo hover).

### Top / header areas
- Topbar: pannelli **cristallo** (freddo notturno, non nero-buco) con faccia luminosa in alto. Campanella in pulsante-cristallo con puntino ciano; avatar in tessera-cristallo con iniziale.
- Header di pagina: eyebrow (uppercase tenue) + titolo + edge ciano-firma + eventuale badge identità (pill outline tenue).

### Dashboard structure
- Vedi §5 (Dashboard Blueprint).

### Cards
- Card cristallo (vedi §3 Surfaces). Card cliccabili si **accendono all'hover** col ciano (bordo + alone + translateY -2px). Card normali calme a riposo.
- Sotto-card / metriche compatte in tessere-cristallo, mai nere.

### Hero sections
- **Un eroe per pagina**, con firma piena: spigolo tagliato (clip-path = frattura geometrica) + edge-firma verticale 3px ciano→blu che pulsa (+ eventuale scan lento ciano). Tutto il resto della pagina è calmo.
- L'eroe cambia natura secondo la pagina (curva, mappa, masthead/referto, form, voce+chat) per dare identità distinta.

### Notification panel
- Menu notifiche in pannello cristallo con empty state curato ("Nessuna notifica"). Righe notifica preziose (icona tipo neutra + testo + tempo + stato letto/non letto con pallino ciano). Coerente con la pagina Notifications.
- **"View all" obbligatorio (ratificato, audit)**: il pannello notifiche deve sempre chiudere con un link/azione **"View all" → `/notifications`**, presente in ogni stato (anche vuoto), che porta alla pagina completa delle notifiche.

### Settings
- Raggruppate in sezioni con micro-etichette (Account · Notifiche · Aspetto · Privacy/Sicurezza), non un muro. Righe-impostazione cristallo (label + descrizione + controllo: toggle/dropdown/input cristallo). Switch cristallo per i toggle.

### Page rhythm
- Ogni pagina: header → (ScopeBar se pagina di performance) → EROE dominante → metriche compatte (una volta sola) → sezioni a contorno che dicono ognuna una cosa NUOVA.
- Due stati obbligatori per pagina ricca di dati: **PIENO** e **FALLBACK ONESTO** (niente zeri finti; invita a creare / dichiara "ancora pochi dati").

---

## 5. Dashboard Blueprint

La Dashboard è il **cruscotto / panoramica**: risponde a "come sta andando l'account, in generale, adesso?". È stata la pagina-modello da cui è nato tutto.

### Cosa deve vedere l'utente subito
- Header (eyebrow + titolo account + badge stato) con edge ciano.
- Subito sotto, l'**EROE = la curva equity** dominante — a colpo d'occhio l'utente vede l'andamento del capitale.

### Gerarchia delle metriche
- **Primario**: la curva equity (eroe unico, firma piena).
- **Secondario**: 4 metriche cristallo compatte (Total PnL, Win Rate, Trades, Equity) con count-up all'ingresso.
- **Terziario**: parte bassa a contorno — Risk (Max Drawdown + barra esposizione viva), 3 sotto-cristalli (Outcome Split / Averages / Extremes), Recent Trades (riga preziosa), What to watch (callout con accento giallo).

### Disposizione dei blocchi
Header → ScopeBar → EROE equity → 4 metriche → parte bassa (Risk + 3 sotto-cristalli + Recent Trades + What to watch).

### Equity / chart logic
- Curva elettrica che **si disegna** (stroke-dashoffset), gradiente stroke blu→ciano→bianco, glow tenue sotto, **scintilla bianca in punta** che pulsa.
- Card eroe con **spigolo tagliato** (clip-path = cristallo sfaccettato).
- Assi leggibili + scala per periodo + punti trade (ciano win / rosso loss) + **linea del capitale iniziale**.
- Principio deciso: la curva mostra la storia del conto con il periodo selezionato evidenziato (non una fetta isolata).

### Filtri temporali
- Governati dalla ScopeBar (Periodo: Giorno · Settimana · Mese · Anno · All-time), non da un selettore interno.

### Trader / account selector
- **ScopeBar condizionale**: account condiviso → Trader (`Tutti` + membri, solo se ≥2 persone) + Periodo; account personale → solo Periodo. Pill attiva = ciano sfumato + avatar nelle pill trader; altre outline tenue.

### Primario / secondario / terziario
- Primario = equity (eroe). Secondario = 4 metriche compatte. Terziario = Risk, split/medie/estremi, recent trades, watch. La firma piena vive solo sull'eroe; il resto è calmo.

> Nota: la Dashboard è stata disegnata prima di alcune regole (glow, icone neutre, sfumato) → in costruzione applicare quelle regole anche qui (niente glow a riposo, icone neutre, sfumato su liste, font Inter, card cliccabili che si accendono all'hover).

---

## 6. Components System

Componenti da standardizzare (con le loro "ricette" già decise):

### Buttons
- **CTA Fulmine** (primario importante): `linear-gradient(120deg, #2E62E6, #3f86e8 60%, #5BE0FF)`, testo bianco, peso 600. Solo per CTA che contano (Accedi, Add trade, Continue, Apply filters, Esporta PDF, Salva sessione, Connetti, invio chat, Crea/Invita).
- **Servizio** (secondario): outline sobrio `border 0.5px rgba(234,247,255,.12); color #9fb4dd`, peso normale. Tutti uguali tra loro (es. Manage/Create/Admin).
- Mai un secondo font o pesi marcati. Font Inter.

### Cards
- Card cristallo (gradiente 160deg + faccia luminosa top + bordo 0.5px). Cliccabili → hover ciano (bordo + alone + translateY -2px).

### Metric cards
- Tessere compatte cristallo, label micro-uppercase muta + valore tabular. Neutre di default; colore solo semantico. Valore mancante = "—" (mai giallo-warning fasullo). Count-up all'ingresso dove ha senso.

### Charts
- Curva elettrica eroe (draw + glow + scintilla). Mini-curve secondarie più sobrie (glow ridotto, così l'eroe resta dominante). Zone semantiche (es. drawdown rosso tenue). Heatmap a celle semantiche (verde/rosso a intensità per valore).

### Sidebar items
- Riga con icona distinta neutra + label; attiva = sfumato ciano + edge; edge che scivola al cambio pagina; gruppi con micro-etichette.

### Modals
- Cristallo (freddo notturno, non nero), faccia luminosa in alto. Input cristallo focus ciano. Usati per invito membro, config integrazione, nuova regola/strategia, ecc.

### Empty states
- **Onestà**: niente griglie di zeri. Un pannello dignitoso "Ancora pochi dati…" o un invito ("Invita il primo membro", "Pianifica la prima sessione", "Crea la prima strategia"). Empty state curato per notifiche ("Nessuna notifica") — anche in stato vuoto il pannello notifiche mantiene il **"View all" → `/notifications`** (ratificato, audit).

### Loaders
- VoltisLightningLoader (loader-fulmine) ai colori VOLTIS, durante i caricamenti.

### Toggles
- Switch cristallo: on = ciano, off = neutro. Usati in permessi (Members), settings, modalità integrazione, on/off regole.

### Badges
- Pill semantiche (verde/rosso/giallo/ciano) per stati. Badge di distinzione (ruoli, colore-strategia) in **famiglia fredda** (ciano/blu/halo/neutro), mai verde/rosso/giallo. Badge trade LONG/SHORT + WIN/LOSS colorati semanticamente.

### Tables
- Contenitore cristallo, header colonne micro-uppercase tenue. **Riga preziosa** che si accende all'hover (bordo ciano + solleva). Lista lunga → scrollbar nascosta + sfumato ai bordi. Righe con badge/valori semantici.

---

## 7. Motion & Experience

Principio: **la motion è identità**. L'energia (fulmine) vive nel movimento, non in decorazioni fisse. E: il "particolare" sta nel comportamento, non negli orpelli.

### Durate finali ratificate (audit)
- **Hover → 160ms**
- **Transition → 220ms**
- **Modal → 260ms**
- **Page → 320ms**
- **Ceremony → 360ms**
Movimenti fluidi con cubic-bezier, mai scatti secchi.

### Motion di cerimonia consentite (audit)
Nelle cerimonie (login, onboarding, avvii) sono consentite **solo** due motion-firma:
- **scan** (passaggio di luce ciano lento sull'eroe)
- **shimmer** (riflesso di cristallo che attraversa il pannello)
Nessun'altra motion decorativa di cerimonia. Restano validi gli elementi-firma in movimento non-cerimoniali (edge-bar che pulsa, curva che si disegna, barra che si riempie, edge sidebar che scivola).

### Page reveal
- Ingresso a **cascata** (stagger): gli elementi entrano con rise+fade, delay progressivi (~.05–.7s). Racconto orchestrato (es. login, onboarding, ogni pagina).

### Card reveal
- Le card entrano a cascata; le celle (calendario) entrano con micro-scale+fade in sequenza.

### Chart animation
- La curva equity si **disegna** (stroke-dashoffset), la scintilla in punta appare e poi pulsa; le barre/esposizioni si **riempiono** all'ingresso; le zone drawdown appaiono dopo il disegno della curva. La barra di progresso (onboarding, goal) si riempie.

### Sidebar behavior
- Edge che **scivola** fluido tra le voci al cambio pagina (transition transform .4s). Etichette che entrano a cascata all'espansione. Scrollbar nascosta + sfumato dinamico.

### Hover states
- Card/righe/celle cliccabili si **accendono** all'hover (bordo ciano + alone + translateY -2px). Le icone prendono il ciano solo all'hover. Questo è il "momento vivo" — la luce vive qui, non a riposo.

### Transitions
- Durate finali ratificate: hover 160ms · transition 220ms · modal 260ms · page 320ms · ceremony 360ms (vedi sopra). Movimenti fluidi con cubic-bezier, mai scatti secchi.

### Loader behavior
- Loader-fulmine durante i caricamenti (es. "Accedi"). Cerimonie (login/onboarding) con le sole motion consentite **scan** e **shimmer** (il riflesso di cristallo che attraversa il pannello).

### Cosa deve sentirsi "alive" e cosa deve restare stabile
- **Alive** (movimento-firma): l'eroe di pagina (edge-bar che pulsa, scan, curva che si disegna), gli hover, le barre che si riempiono, l'edge sidebar che scivola, il cursore chat del Copilot che lampeggia.
- **Stabile** (calmo a riposo): tutte le card normali, le icone di servizio, le superfici. **Nessun glow/alone fisso a riposo, da nessuna parte, nemmeno sugli eroi.** La luce vive solo nell'hover e negli elementi-firma in movimento.

---

## 8. What Must Stay

- L'**anima "cristallo e fulmine"** e i suoi 5 principi.
- La **palette/token** (Fase 1) già in globals.css e il loro uso semantico.
- **Inter** come font unico.
- Il **loader-fulmine** VoltisLightningLoader (già ribrandizzato).
- La **struttura** già buona di molte pagine (Dashboard, Account Hub, Onboarding, Diary, Replay, Reports) — le ossa erano solide, si è cambiato il vestito e l'organizzazione, non l'impianto.
- I **contenuti/messaggi** forti già presenti: "Accesso riservato / non mass market" (login), "Measure · Protect · Improve" (onboarding), i capitoli del referto.
- I **badge trade** e i dati semantici (LONG/WIN, PnL) col loro colore.
- La ScopeBar come componente del telaio (Ondata 1), riusata ovunque serva.
- Le **10 regole d'oro** e la **cura comune** come metro di ogni pagina.
- Le **identità distinte** di ogni pagina (per non clonarsi).

---

## 9. What Must Change

- **Superfici nero-buco → cristallo freddo notturno** ovunque (pannelli, sotto-card, input, modali, filtri).
- **Accenti arcobaleno → accenti uniformi semantici** (il caso più marcato: Calendar e le pagine Intelligence).
- **Scatoloni-metrica vuoti → metriche compatte** con gerarchia.
- **Muri (di campi o card) → sezioni logiche** con ritmo (form AddTrade a 5 sezioni; Settings a sezioni; form Sessions a 2 fasi).
- **Icone con glow/riquadro ciano fisso → icone neutre**, ciano solo all'hover.
- **Curva equity mancante/piatta → curva-eroe elettrica in grande** (soprattutto Equity).
- **Equity troppo simile alla Dashboard → Equity differenziata** col drawdown protagonista (zone di drawdown + mini-curva underwater) — incarna il "Protect".
- **Calendar spento → griglia viva** (giorni con sfondo semantico tenue, hover che accende, filtro trader condizionale).
- **Form Add Trade come muro → 5 sezioni numerate** con input cristallo ed etichette sopra i campi.
- **Replay col buco "price data not available" → anatomia del prezzo visiva** (entry/stop/target/exit) coi dati posseduti, zero costi.
- **Sidebar senza separazione → gruppi WORKSPACE/GENERALE** con micro-etichette; scrollbar nascosta + sfumato; edge che scivola.
- **Pagine Intelligence che si clonano e ripetono i KPI → identità distinte** (Analytics=microscopio, Reports=referto, Sessions=rituale, Copilot=assistente) con eco tagliato.
- **Members/Workspace gemelle → sdoppiate** (permessi vs attività); dare una **home ai permessi** (oggi in /admin).
- **Rules & Goals con statistiche protagoniste → regole come eroe** (patto di disciplina).
- **Integrations con stato ripetuto e tutti i campi insieme → stato una volta sola + campi condizionali** alla modalità.
- **Playbook con arcobaleno di colori-strategia → palette fredda** per le etichette.

---

## 10. What Must Be Removed

Tutto ciò che indebolisce il premium o crea incoerenza:
- **Glow / aloni fissi a riposo** ovunque (icone di servizio, icone-eroe, tessere) — bandire la luce diffusa.
- **Neon costante** e superfici nero-buco piatte.
- **Accenti arcobaleno** e sfondi-sezione tinti a caso; lo stesso dato che cambia colore secondo la posizione.
- **Eco dei numeri**: i KPI ristampati decine di volte lungo pagine altissime; la ripetizione della Dashboard nelle altre pagine.
- **Zeri disonesti** ("0", "0/10", "—", "+0" finti) messi per riempire lo schermo quando i dati mancano.
- **Sezioni doppie/clonate**: due "Risk Concentration" in Analytics; Weekly/Monthly come sezioni separate in Reports (assorbite dal periodo ScopeBar); i 5 "Monitor" quasi identici del Copilot (raccolti in sensori); "Trader Psychology" duplicato in Analytics; doppio hero in Sessions; le note triplicate del Copilot.
- **Emoji** nell'interfaccia (sostituite da icone Tabler).
- **Font marcati/estranei** sui pulsanti (tutto Inter).
- **ScopeBar sulle pagine di gestione/squadra** (Members, Workspace) dove filtrare per trader non ha senso.
- **Pulsanti primari multipli in competizione** (es. tre "Open Account" blu pieni) → un solo primario, il resto discreto.
- **Colore semantico (verde/rosso/giallo) usato per semplice distinzione** (colore-strategia, badge-ruolo) → famiglia fredda.

---

## 11. Open Questions

Dubbi/decisioni non ancora chiusi (emersi ma parcheggiati):
- **ScopeBar navigabile**: rendere il periodo navigabile (Anno → griglia anni/anni passati, Mese → griglia mesi, frecce ‹›). Deciso di NON farlo su una pagina sola per non divergere → va affrontato in un **passaggio ScopeBar a livello di sistema**, applicato a tutte le pagine insieme. Per ora "Anno" è una pill semplice.
- **Workspace senza filtro periodo**: giusto oggi; da rivalutare se/quando i membri e l'attività diventeranno molti (eventuale filtro leggero per tipo evento o "oggi/settimana").
- **Rules & Goals — colori del progresso**: verificare in costruzione che "raggiunto" (ciano) e "in corsa bene" (verde) si distinguano chiaramente e non confondano.
- **Playbook — metrica di "strategia migliore"** nell'eroe: non definita (PnL? win rate? profit factor?) — da decidere in costruzione (suggerito PnL).
- **Copilot — chat reale**: assicurarsi che la logica per generare le frasi/risposte esista davvero (structured i18n + LLM/regole); se non pronta, meglio un Copilot "in arrivo" onesto che uno che finge di parlare.
- **Soglie fallback**: definire N minimo per accendere sezioni/curve (suggerito ≥5 sessioni/dati) in costruzione.
- **VITALIS**: "breathing leaf" loader ancora da fare (fuori perimetro VOLTIS, ma in sospeso come sistema).

---

## 12. Execution Roadmap

### P0 — Critical (fondamenta, senza cui il resto non regge)
- Applicare i **token** ovunque: sostituire colori/raggi/durate/tipografia hardcoded "sporchi" rimasti nei file (la Fase 1 ha creato i token; la sostituzione effettiva era stata rimandata).
- Standardizzare i **componenti riusabili**: card cristallo, edge-firma, input cristallo, pill, riga-lista preziosa, sfumato+scrollbar nascosta, tessera-icona neutra, ScopeBar (con logica condizionale).
- Costruire il **telaio**: sidebar definitiva (gruppi WORKSPACE/GENERALE, edge che scivola, sfumato), topbar, ScopeBar.
- Bug funzionali bloccanti: **"Create Account" → /accounts/create** (non /accounts/manage).
- **Members = home dei permessi**: i permessi come fonte unica per i gate (UI + API) di Rules&Goals/Copilot.

### P1 — Important (le pagine, ondata per ondata, coi file di design come contratto)
- Ondata 0/2/3: Dashboard (allineata alle regole nuove), Login, Accounts Overview, Account Hub, Onboarding, Diary, Equity, Calendar, Add/Edit Trade, Replay.
- Ondata 4: Analytics, Reports, Sessions, Copilot (Copilot per ultimo tra le intelligenti).
- Ondata 5: Members, Workspace, Rules & Goals, Integrations, Playbook.
- **Feature vere** (non restyling): Copilot chat che risponde (LLM/regole + structured i18n); azioni-Copilot che creano regole/alert (integrazione Rules&Goals/notifiche); drill-down su metriche/heatmap/sensori (Analytics/Reports) senza duplicare in pagina.
- Fix dati/contenuto: Reports "fragilità operativa" con 0 perdite → "non misurabile"; Copilot note duplicate → dedup; **i18n misto IT/EN** → structured i18n (type+params+template), non patch frase-per-frase.
- Integrations: campi condizionali alla modalità; dettagli tecnici/log nascosti in Manuale; **mai** salvare/inserire credenziali sensibili.

### P2 — Polish (rifiniture e sistema)
- Ondate 6/7/8: Area utente (Profile, Settings, Support, Notifications, Updates, Activities), Admin (un modello propagato), Stati (un modello "schermata-stato" per Maintenance/Frozen/Review + form per Create/Manage).
- **ScopeBar navigabile** (periodo con frecce/griglia) applicata a tutte le pagine insieme, come lavoro di sistema dedicato.
- Rimuovere l'overlay dev residuo lato percezione (badge "1 Issue" / "N" = overlay Next.js, non app — solo chiarezza, non un fix di prodotto).
- Rifiniture di motion e coerenza finale su tutte le pagine.

---

## 13. Designer Notes

### Cosa è forte
- **L'anima è chiara e coerente.** "Cristallo e fulmine" non è uno slogan: si traduce in regole precise (freddo notturno, spigolo tagliato, luce solo in movimento, colore dai dati). Questo dà a VOLTIS un'identità riconoscibile che poche app-journal hanno.
- **La cura comune e le identità distinte.** Aver diagnosticato le stesse quattro malattie (eco, arcobaleno, nessun eroe, zeri disonesti) e curato ogni gruppo con una regola sola, dando a ogni pagina un motivo di esistere (Equity=Protect, Analytics=microscopio, Reports=referto, Sessions=rituale, Copilot=assistente), è ragionamento di prodotto maturo, non restyling.
- **Le regole di sistema** (glow raro, icone neutre, colore dai dati, colore-etichetta freddo, ScopeBar solo sulle pagine performance, ScopeBar condizionale) formano un linguaggio unico che si autogoverna: ogni dubbio risolto una volta vale per tutte le pagine.
- **L'onestà come principio** ("uno strumento serio non finge profondità"): il fallback onesto invece degli zeri è ciò che fa sembrare l'app professionale e non un demo gonfiato.

### Cosa è fragile
- **La distanza tra design e costruito.** Tutto questo vive come mockup approvati; il valore reale dipende dall'implementazione fedele (soprattutto la motion e gli stati onesti).
- **Il Copilot** è l'anello più fragile: richiede backend vero (chat, azioni che creano regole, i18n strutturato). Se costruito come "restyling", tradirebbe la sua identità di assistente che parla.
- **La ScopeBar navigabile** parcheggiata: se affrontata a pezzi diverge; va fatta a livello di sistema.
- **Le soglie di fallback** non ancora definite: senza una soglia N chiara, il confine tra "pieno" e "onesto" resta arbitrario.

### Cosa rischia di sembrare economico
- **Il glow diffuso e il neon** se rientrassero: sono il primo segnale di "dashboard crypto/game". La regola "niente glow a riposo" è la difesa principale — va tenuta con disciplina.
- **Gli accenti arcobaleno** e le superfici nero-buco: erano la malattia originale; ogni ricaduta riabbassa subito la percezione a "SaaS generico".
- **Gli zeri finti** per riempire schermo: fanno sembrare l'app un guscio vuoto.
- **Le scrollbar di sistema visibili** e i "muri" di campi/card: dettagli che, se trascurati, tradiscono la mancanza di cura.

### Cosa renderebbe il prodotto davvero premium
- **La disciplina del "meno"**: il premium qui nasce per sottrazione. Superfici pulite, un eroe solo per pagina, luce rara e preziosa, un solo linguaggio di colore.
- **I dettagli sartoriali invisibili**: lo sfumato al posto delle scrollbar, l'edge che scivola, l'anatomia del prezzo che trasforma un vincolo (niente dati di mercato) in un punto di forza, la griglia-calendario che "parla" a colpo d'occhio. Sono le cose che non si notano consapevolmente ma si *sentono* come cura.
- **La coerenza assoluta**: che ogni pagina, dall'accesso all'admin, parli identica. È la coerenza — più di ogni singolo effetto — a comunicare "prodotto serio e curato".
- **La motion come firma**, non come decorazione: l'energia che vive solo quando interagisci, mai a gridare a riposo. È ciò che dà a VOLTIS la sua "alta tensione" senza stancare.
