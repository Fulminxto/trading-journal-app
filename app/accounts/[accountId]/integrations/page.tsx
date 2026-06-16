import Link from "next/link";
import {
    ArrowLeft,
    Cable,
    CheckCircle2,
    DatabaseZap,
    KeyRound,
    Lock,
    RefreshCw,
    Server,
    Settings2,
    UploadCloud,
    Zap,
    type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import GlobalToast from "@/components/GlobalToast";

import {
    formatDateTimeByLanguage,
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

import {
    resetAccountSyncStatus,
    updateAccountIntegrations,
} from "./actions";

type StatusCardProps = {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    tone?: string;
};

type ReadinessItem = {
    label: string;
    ok: boolean;
};

type IntegrationsLabels = {
    modes: {
        manual: string;
        mt5: string;
        broker: string;
        hybrid: string;
    };

    statuses: {
        connected: string;
        pending: string;
        error: string;
        inactive: string;
    };

    common: {
        enabled: string;
        disabled: string;
        configured: string;
        missing: string;
        ok: string;
        never: string;
        import: string;
        updated: string;
        reset: string;
        settings: string;
    };

    readiness: {
        title: string;

        manualLabel: string;
        manualDescription: string;
        manualModeActive: string;
        automaticSyncDisabled: string;

        mt5Label: string;
        mt5Description: string;
        mt5ModeActive: string;
        autoSyncEnabled: string;
        mt5SourceEnabled: string;

        brokerLabel: string;
        brokerDescription: string;
        brokerModeActive: string;
        brokerSourceEnabled: string;

        hybridLabel: string;
        hybridDescription: string;
        hybridModeActive: string;

        neededLabel: string;
        neededDescription: string;
        integrationModeSelected: string;
    };

    hero: {
        badge: string;
        eyebrow: string;
        title: string;
        description: string;
        back: string;
    };

    cards: {
        integrationMode: string;
        integrationModeDescription: string;
        autoSync: string;
        autoSyncDescription: string;
        mt5Setup: string;
        mt5SetupDescription: string;
        lastSync: string;
        lastSyncDescription: string;
    };

    syncError: {
        eyebrow: string;
        title: string;
        description: string;
        latestError: string;
        resetButton: string;
    };

    form: {
        syncMode: string;
        integrationStrategy: string;
        integrationStrategyDescription: string;

        activation: string;
        sources: string;
        autoSyncDescription: string;
        mt5Description: string;
        brokerDescription: string;

        mt5Connector: string;
        mt5Details: string;
        mt5DetailsDescription: string;
        mt5AccountLoginPlaceholder: string;
        mt5ServerNamePlaceholder: string;

        brokerIntegration: string;
        brokerDetails: string;
        brokerDetailsDescription: string;
        brokerProviderPlaceholder: string;
        brokerAccountIdPlaceholder: string;

        connectorSetup: string;
        connectionDetails: string;
        connectionDescription: string;
        tradingAccountId: string;
        syncSecret: string;
        syncSecretStored: string;
        syncSecretDescription: string;
        healthEndpoint: string;
        importEndpoint: string;
        futureSyncFlow: string;
        futureSyncDescription: string;

        syncLogs: string;
        recentImportActivity: string;
        syncLogsDescription: string;
        noSyncActivity: string;

        securityNotice: string;
        noSensitiveCredentials: string;
        securityDescription: string;

        saveNote: string;
        saveButton: string;
    };
};

const labels: Record<AppLanguage, IntegrationsLabels> = {
    it: {
        modes: {
            manual: "Manual Only",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "Connesso",
            pending: "In attesa",
            error: "Errore",
            inactive: "Inattivo",
        },
        common: {
            enabled: "Attivo",
            disabled: "Disattivo",
            configured: "Configurato",
            missing: "Mancante",
            ok: "OK",
            never: "Mai",
            import: "Import",
            updated: "Aggiornato",
            reset: "Reset",
            settings: "Impostazioni",
        },
        readiness: {
            title: "Trade Sync Readiness",

            manualLabel: "Manual Mode",
            manualDescription:
                "Questo account Ã¨ impostato su Manual Only. I trade vengono gestiti manualmente dal Diary.",
            manualModeActive: "Manual mode active",
            automaticSyncDisabled: "Automatic sync disabled",

            mt5Label: "Pronto per MT5",
            mt5Description:
                "Questo account Ã¨ pronto per ricevere trade da un futuro MT5 Connector.",
            mt5ModeActive: "MT5 mode active",
            autoSyncEnabled: "Auto sync enabled",
            mt5SourceEnabled: "MT5 source enabled",

            brokerLabel: "Pronto per Broker",
            brokerDescription:
                "Questo account Ã¨ pronto per ricevere trade da una futura Broker Integration.",
            brokerModeActive: "Broker mode active",
            brokerSourceEnabled: "Broker source enabled",

            hybridLabel: "Pronto per MT5 + Broker",
            hybridDescription:
                "Questo account Ã¨ pronto per ricevere trade sia da MT5 sia da Broker Integration.",
            hybridModeActive: "Hybrid mode active",

            neededLabel: "Configurazione richiesta",
            neededDescription:
                "Questo account ha una modalitÃ  sync selezionata, ma la configurazione non Ã¨ ancora completa.",
            integrationModeSelected: "Integration mode selected",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Integrazioni account",
            title: "Integrazioni",
            description:
                "Configura la base per Manual, MT5, Broker e Hybrid Sync. In questa fase VOLTIS non salva password, token o API key: prepara solo la struttura sicura per la sincronizzazione.",
            back: "Torna allâ€™Account Hub",
        },
        cards: {
            integrationMode: "Integration Mode",
            integrationModeDescription:
                "Strategia di gestione dei trade per questo account.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Controlla se lâ€™account accetta import automatici.",
            mt5Setup: "MT5 Setup",
            mt5SetupDescription:
                "Login e server MT5 identificativi, senza credenziali sensibili.",
            lastSync: "Ultima Sync",
            lastSyncDescription:
                "Ultima sincronizzazione registrata dallâ€™account.",
        },
        syncError: {
            eyebrow: "Errore sync rilevato",
            title: "Ultima sincronizzazione fallita",
            description:
                "VOLTIS ha rilevato un errore durante lâ€™importazione automatica dei trade. Controlla configurazione, Account ID, secret e Sync Logs.",
            latestError: "Ultimo errore",
            resetButton: "Reset Sync",
        },
        form: {
            syncMode: "Sync mode",
            integrationStrategy: "Strategia di integrazione",
            integrationStrategyDescription:
                "Scegli come questo account dovrÃ  gestire i trade. Manual Only mantiene solo lâ€™inserimento manuale. MT5, Broker e Hybrid preparano il conto alla sincronizzazione automatica.",

            activation: "Attivazione",
            sources: "Sorgenti",
            autoSyncDescription:
                "Permette allâ€™account di accettare import automatici.",
            mt5Description:
                "Abilita la sorgente MT5 per il futuro connettore.",
            brokerDescription: "Abilita la sorgente Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Dettagli MetaTrader 5",
            mt5DetailsDescription:
                "Inserisci solo dati identificativi non sensibili. Password e token non vengono gestiti da VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Dettagli Broker",
            brokerDetailsDescription:
                "Salviamo solo provider e identificativo account. Le credenziali reali verranno aggiunte piÃ¹ avanti con storage sicuro.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Connector setup",
            connectionDetails: "Dettagli connessione",
            connectionDescription:
                "Questi dati serviranno per testare il futuro Expert Advisor MT5 o una futura integrazione Broker. Per ora sono informazioni di configurazione, non una connessione reale.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Salvato solo nellâ€™ambiente server",
            syncSecretDescription:
                "Non viene mostrata in app. VerrÃ  inserita manualmente nel connettore solo in fase di test controllato.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Future sync flow",
            futureSyncDescription:
                "Il connettore controllerÃ  prima lâ€™Health Check. Se VOLTIS risponde che la sync Ã¨ pronta, invierÃ  i trade chiusi allâ€™Import Endpoint. I trade entreranno nel Diary come importati e, se necessario, in stato Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "AttivitÃ  import recenti",
            syncLogsDescription:
                "Qui vedrai gli ultimi eventi collegati alla sincronizzazione automatica: trade importati, impostazioni aggiornate, reset e futuri errori MT5/Broker.",
            noSyncActivity:
                "Nessuna attivitÃ  sync registrata per ora. Quando un trade verrÃ  importato da MT5 o Broker, apparirÃ  qui.",

            securityNotice: "Avviso sicurezza",
            noSensitiveCredentials: "Nessuna credenziale sensibile salvata",
            securityDescription:
                "In questa fase VOLTIS non memorizza password MT5, API key broker, token o dati sensibili. La connessione reale verrÃ  costruita piÃ¹ avanti con un sistema dedicato e protetto.",

            saveNote:
                "Salva solo impostazioni non sensibili. La sync reale verrÃ  testata piÃ¹ avanti in ambiente controllato.",
            saveButton: "Salva impostazioni integrazione",
        },
    },

    en: {
        modes: {
            manual: "Manual Only",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "Connected",
            pending: "Pending",
            error: "Error",
            inactive: "Inactive",
        },
        common: {
            enabled: "Enabled",
            disabled: "Disabled",
            configured: "Configured",
            missing: "Missing",
            ok: "OK",
            never: "Never",
            import: "Import",
            updated: "Updated",
            reset: "Reset",
            settings: "Settings",
        },
        readiness: {
            title: "Trade Sync Readiness",

            manualLabel: "Manual Mode",
            manualDescription:
                "This account is set to Manual Only. Trades are managed manually from the Diary.",
            manualModeActive: "Manual mode active",
            automaticSyncDisabled: "Automatic sync disabled",

            mt5Label: "Ready for MT5",
            mt5Description:
                "This account is ready to receive trades from a future MT5 Connector.",
            mt5ModeActive: "MT5 mode active",
            autoSyncEnabled: "Auto sync enabled",
            mt5SourceEnabled: "MT5 source enabled",

            brokerLabel: "Ready for Broker",
            brokerDescription:
                "This account is ready to receive trades from a future Broker Integration.",
            brokerModeActive: "Broker mode active",
            brokerSourceEnabled: "Broker source enabled",

            hybridLabel: "Ready for MT5 + Broker",
            hybridDescription:
                "This account is ready to receive trades from both MT5 and Broker Integration.",
            hybridModeActive: "Hybrid mode active",

            neededLabel: "Configuration Needed",
            neededDescription:
                "This account has a sync mode selected, but the configuration is not complete yet.",
            integrationModeSelected: "Integration mode selected",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Account integrations",
            title: "Integrations",
            description:
                "Configure the base for Manual, MT5, Broker and Hybrid Sync. At this stage VOLTIS does not store passwords, tokens or API keys: it only prepares the secure structure for synchronization.",
            back: "Back to Account Hub",
        },
        cards: {
            integrationMode: "Integration Mode",
            integrationModeDescription:
                "Trade management strategy for this account.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Controls whether the account accepts automatic imports.",
            mt5Setup: "MT5 Setup",
            mt5SetupDescription:
                "MT5 login and server identifiers, without sensitive credentials.",
            lastSync: "Last Sync",
            lastSyncDescription:
                "Last synchronization recorded by the account.",
        },
        syncError: {
            eyebrow: "Sync Error Detected",
            title: "Last synchronization failed",
            description:
                "VOLTIS detected an error during automatic trade import. Check configuration, Account ID, secret and Sync Logs.",
            latestError: "Latest Error",
            resetButton: "Reset Sync",
        },
        form: {
            syncMode: "Sync mode",
            integrationStrategy: "Integration Strategy",
            integrationStrategyDescription:
                "Choose how this account should manage trades. Manual Only keeps manual entry only. MT5, Broker and Hybrid prepare the account for automatic synchronization.",

            activation: "Activation",
            sources: "Sources",
            autoSyncDescription:
                "Allows the account to accept automatic imports.",
            mt5Description:
                "Enables the MT5 source for the future connector.",
            brokerDescription: "Enables the Broker Integration source.",

            mt5Connector: "MT5 Connector",
            mt5Details: "MetaTrader 5 Details",
            mt5DetailsDescription:
                "Enter only non-sensitive identifying data. Passwords and tokens are not managed by VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Broker Details",
            brokerDetailsDescription:
                "We only store provider and account identifier. Real credentials will be added later with secure storage.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Connector setup",
            connectionDetails: "Connection Details",
            connectionDescription:
                "These data will be used to test the future MT5 Expert Advisor or a future Broker integration. For now they are configuration information, not a real connection.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Stored only on server environment",
            syncSecretDescription:
                "It is not shown in the app. It will be entered manually in the connector only during controlled testing.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Future sync flow",
            futureSyncDescription:
                "The connector will first check the Health Check. If VOLTIS replies that sync is ready, it will send closed trades to the Import Endpoint. Trades will enter the Diary as imported and, if needed, in Needs Review status.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Recent Import Activity",
            syncLogsDescription:
                "Here you will see the latest events connected to automatic synchronization: imported trades, updated settings, resets and future MT5/Broker errors.",
            noSyncActivity:
                "No sync activity recorded yet. When a trade is imported from MT5 or Broker, it will appear here.",

            securityNotice: "Security Notice",
            noSensitiveCredentials: "No sensitive credentials stored",
            securityDescription:
                "At this stage VOLTIS does not store MT5 passwords, broker API keys, tokens or sensitive data. The real connection will be built later with a dedicated and protected system.",

            saveNote:
                "Save only non-sensitive settings. The real sync will be tested later in a controlled environment.",
            saveButton: "Save Integration Settings",
        },
    },

    uk: {
        modes: {
            manual: "Ð¢Ñ–Ð»ÑŒÐºÐ¸ Ð²Ñ€ÑƒÑ‡Ð½Ñƒ",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "ÐŸÑ–Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¾",
            pending: "Ð’ Ð¾Ñ‡Ñ–ÐºÑƒÐ²Ð°Ð½Ð½Ñ–",
            error: "ÐŸÐ¾Ð¼Ð¸Ð»ÐºÐ°",
            inactive: "ÐÐµÐ°ÐºÑ‚Ð¸Ð²Ð½Ð¾",
        },
        common: {
            enabled: "Ð£Ð²Ñ–Ð¼ÐºÐ½ÐµÐ½Ð¾",
            disabled: "Ð’Ð¸Ð¼ÐºÐ½ÐµÐ½Ð¾",
            configured: "ÐÐ°Ð»Ð°ÑˆÑ‚Ð¾Ð²Ð°Ð½Ð¾",
            missing: "Ð’Ñ–Ð´ÑÑƒÑ‚Ð½Ñ”",
            ok: "OK",
            never: "ÐÑ–ÐºÐ¾Ð»Ð¸",
            import: "Ð†Ð¼Ð¿Ð¾Ñ€Ñ‚",
            updated: "ÐžÐ½Ð¾Ð²Ð»ÐµÐ½Ð¾",
            reset: "Ð¡ÐºÐ¸Ð´Ð°Ð½Ð½Ñ",
            settings: "ÐÐ°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ",
        },
        readiness: {
            title: "Ð“Ð¾Ñ‚Ð¾Ð²Ð½Ñ–ÑÑ‚ÑŒ Trade Sync",

            manualLabel: "Ð ÑƒÑ‡Ð½Ð¸Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼",
            manualDescription:
                "Ð¦ÐµÐ¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð½Ð°Ð»Ð°ÑˆÑ‚Ð¾Ð²Ð°Ð½Ð¸Ð¹ ÑÐº Manual Only. Ð£Ð³Ð¾Ð´Ð¸ ÐºÐµÑ€ÑƒÑŽÑ‚ÑŒÑÑ Ð²Ñ€ÑƒÑ‡Ð½Ñƒ Ñ‡ÐµÑ€ÐµÐ· Diary.",
            manualModeActive: "Ð ÑƒÑ‡Ð½Ð¸Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹",
            automaticSyncDisabled: "ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ð° ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ Ð²Ð¸Ð¼ÐºÐ½ÐµÐ½Ð°",

            mt5Label: "Ð“Ð¾Ñ‚Ð¾Ð²Ð¾ Ð´Ð»Ñ MT5",
            mt5Description:
                "Ð¦ÐµÐ¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð³Ð¾Ñ‚Ð¾Ð²Ð¸Ð¹ Ð¾Ñ‚Ñ€Ð¸Ð¼ÑƒÐ²Ð°Ñ‚Ð¸ ÑƒÐ³Ð¾Ð´Ð¸ Ð· Ð¼Ð°Ð¹Ð±ÑƒÑ‚Ð½ÑŒÐ¾Ð³Ð¾ MT5 Connector.",
            mt5ModeActive: "Ð ÐµÐ¶Ð¸Ð¼ MT5 Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹",
            autoSyncEnabled: "ÐÐ²Ñ‚Ð¾ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ ÑƒÐ²Ñ–Ð¼ÐºÐ½ÐµÐ½Ð°",
            mt5SourceEnabled: "Ð”Ð¶ÐµÑ€ÐµÐ»Ð¾ MT5 ÑƒÐ²Ñ–Ð¼ÐºÐ½ÐµÐ½Ðµ",

            brokerLabel: "Ð“Ð¾Ñ‚Ð¾Ð²Ð¾ Ð´Ð»Ñ Broker",
            brokerDescription:
                "Ð¦ÐµÐ¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð³Ð¾Ñ‚Ð¾Ð²Ð¸Ð¹ Ð¾Ñ‚Ñ€Ð¸Ð¼ÑƒÐ²Ð°Ñ‚Ð¸ ÑƒÐ³Ð¾Ð´Ð¸ Ð· Ð¼Ð°Ð¹Ð±ÑƒÑ‚Ð½ÑŒÐ¾Ñ— Broker Integration.",
            brokerModeActive: "Ð ÐµÐ¶Ð¸Ð¼ Broker Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹",
            brokerSourceEnabled: "Ð”Ð¶ÐµÑ€ÐµÐ»Ð¾ Broker ÑƒÐ²Ñ–Ð¼ÐºÐ½ÐµÐ½Ðµ",

            hybridLabel: "Ð“Ð¾Ñ‚Ð¾Ð²Ð¾ Ð´Ð»Ñ MT5 + Broker",
            hybridDescription:
                "Ð¦ÐµÐ¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð³Ð¾Ñ‚Ð¾Ð²Ð¸Ð¹ Ð¾Ñ‚Ñ€Ð¸Ð¼ÑƒÐ²Ð°Ñ‚Ð¸ ÑƒÐ³Ð¾Ð´Ð¸ Ñ– Ð· MT5, Ñ– Ð· Broker Integration.",
            hybridModeActive: "Ð“Ñ–Ð±Ñ€Ð¸Ð´Ð½Ð¸Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹",

            neededLabel: "ÐŸÐ¾Ñ‚Ñ€Ñ–Ð±Ð½Ðµ Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ",
            neededDescription:
                "Ð”Ð»Ñ Ñ†ÑŒÐ¾Ð³Ð¾ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð° Ð²Ð¸Ð±Ñ€Ð°Ð½Ð¾ Ñ€ÐµÐ¶Ð¸Ð¼ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ—, Ð°Ð»Ðµ ÐºÐ¾Ð½Ñ„Ñ–Ð³ÑƒÑ€Ð°Ñ†Ñ–Ñ Ñ‰Ðµ Ð½Ðµ Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð°.",
            integrationModeSelected: "Ð ÐµÐ¶Ð¸Ð¼ Ñ–Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ— Ð²Ð¸Ð±Ñ€Ð°Ð½Ð¾",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Ð†Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ— Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°",
            title: "Ð†Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ—",
            description:
                "ÐÐ°Ð»Ð°ÑˆÑ‚ÑƒÐ¹Ñ‚Ðµ Ð±Ð°Ð·Ñƒ Ð´Ð»Ñ Manual, MT5, Broker Ñ– Hybrid Sync. ÐÐ° Ñ†ÑŒÐ¾Ð¼Ñƒ ÐµÑ‚Ð°Ð¿Ñ– VOLTIS Ð½Ðµ Ð·Ð±ÐµÑ€Ñ–Ð³Ð°Ñ” Ð¿Ð°Ñ€Ð¾Ð»Ñ–, Ñ‚Ð¾ÐºÐµÐ½Ð¸ Ð°Ð±Ð¾ API-ÐºÐ»ÑŽÑ‡Ñ–: Ð²Ñ–Ð½ Ð»Ð¸ÑˆÐµ Ð³Ð¾Ñ‚ÑƒÑ” Ð±ÐµÐ·Ð¿ÐµÑ‡Ð½Ñƒ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ð´Ð»Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ—.",
            back: "ÐÐ°Ð·Ð°Ð´ Ð´Ð¾ Account Hub",
        },
        cards: {
            integrationMode: "Ð ÐµÐ¶Ð¸Ð¼ Ñ–Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ—",
            integrationModeDescription:
                "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ ÐºÐµÑ€ÑƒÐ²Ð°Ð½Ð½Ñ ÑƒÐ³Ð¾Ð´Ð°Ð¼Ð¸ Ð´Ð»Ñ Ñ†ÑŒÐ¾Ð³Ð¾ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŽÑ”, Ñ‡Ð¸ Ð¿Ñ€Ð¸Ð¹Ð¼Ð°Ñ” Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ñ– Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¸.",
            mt5Setup: "ÐÐ°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ MT5",
            mt5SetupDescription:
                "Ð†Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ñ–ÐºÐ°Ñ‚Ð¾Ñ€Ð¸ Ð»Ð¾Ð³Ñ–Ð½Ð° Ñ‚Ð° ÑÐµÑ€Ð²ÐµÑ€Ð° MT5 Ð±ÐµÐ· Ñ‡ÑƒÑ‚Ð»Ð¸Ð²Ð¸Ñ… Ð´Ð°Ð½Ð¸Ñ….",
            lastSync: "ÐžÑÑ‚Ð°Ð½Ð½Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ",
            lastSyncDescription:
                "ÐžÑÑ‚Ð°Ð½Ð½Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ, Ð·Ð°Ñ„Ñ–ÐºÑÐ¾Ð²Ð°Ð½Ð° Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð¼.",
        },
        syncError: {
            eyebrow: "Ð’Ð¸ÑÐ²Ð»ÐµÐ½Ð¾ Ð¿Ð¾Ð¼Ð¸Ð»ÐºÑƒ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ—",
            title: "ÐžÑÑ‚Ð°Ð½Ð½Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ Ð½Ðµ Ð²Ð´Ð°Ð»Ð°ÑÑ",
            description:
                "VOLTIS Ð²Ð¸ÑÐ²Ð¸Ð² Ð¿Ð¾Ð¼Ð¸Ð»ÐºÑƒ Ð¿Ñ–Ð´ Ñ‡Ð°Ñ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ð¾Ð³Ð¾ Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ñƒ ÑƒÐ³Ð¾Ð´. ÐŸÐµÑ€ÐµÐ²Ñ–Ñ€Ñ‚Ðµ ÐºÐ¾Ð½Ñ„Ñ–Ð³ÑƒÑ€Ð°Ñ†Ñ–ÑŽ, Account ID, secret Ñ– Sync Logs.",
            latestError: "ÐžÑÑ‚Ð°Ð½Ð½Ñ Ð¿Ð¾Ð¼Ð¸Ð»ÐºÐ°",
            resetButton: "Ð¡ÐºÐ¸Ð½ÑƒÑ‚Ð¸ Sync",
        },
        form: {
            syncMode: "Ð ÐµÐ¶Ð¸Ð¼ Sync",
            integrationStrategy: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ Ñ–Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ—",
            integrationStrategyDescription:
                "Ð’Ð¸Ð±ÐµÑ€Ñ–Ñ‚ÑŒ, ÑÐº Ñ†ÐµÐ¹ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð¼Ð°Ñ” ÐºÐµÑ€ÑƒÐ²Ð°Ñ‚Ð¸ ÑƒÐ³Ð¾Ð´Ð°Ð¼Ð¸. Manual Only Ð·Ð°Ð»Ð¸ÑˆÐ°Ñ” Ð»Ð¸ÑˆÐµ Ñ€ÑƒÑ‡Ð½Ðµ Ð²Ð²ÐµÐ´ÐµÐ½Ð½Ñ. MT5, Broker Ñ– Hybrid Ð³Ð¾Ñ‚ÑƒÑŽÑ‚ÑŒ Ð°ÐºÐ°ÑƒÐ½Ñ‚ Ð´Ð¾ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ð¾Ñ— ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ—.",

            activation: "ÐÐºÑ‚Ð¸Ð²Ð°Ñ†Ñ–Ñ",
            sources: "Ð”Ð¶ÐµÑ€ÐµÐ»Ð°",
            autoSyncDescription:
                "Ð”Ð¾Ð·Ð²Ð¾Ð»ÑÑ” Ð°ÐºÐ°ÑƒÐ½Ñ‚Ñƒ Ð¿Ñ€Ð¸Ð¹Ð¼Ð°Ñ‚Ð¸ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ñ– Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¸.",
            mt5Description:
                "Ð’Ð¼Ð¸ÐºÐ°Ñ” Ð´Ð¶ÐµÑ€ÐµÐ»Ð¾ MT5 Ð´Ð»Ñ Ð¼Ð°Ð¹Ð±ÑƒÑ‚Ð½ÑŒÐ¾Ð³Ð¾ ÐºÐ¾Ð½ÐµÐºÑ‚Ð¾Ñ€Ð°.",
            brokerDescription: "Ð’Ð¼Ð¸ÐºÐ°Ñ” Ð´Ð¶ÐµÑ€ÐµÐ»Ð¾ Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Ð”Ð°Ð½Ñ– MetaTrader 5",
            mt5DetailsDescription:
                "Ð’Ð²Ð¾Ð´ÑŒÑ‚Ðµ Ð»Ð¸ÑˆÐµ Ð½ÐµÑ‡ÑƒÑ‚Ð»Ð¸Ð²Ñ– Ñ–Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ñ–ÐºÐ°Ñ†Ñ–Ð¹Ð½Ñ– Ð´Ð°Ð½Ñ–. ÐŸÐ°Ñ€Ð¾Ð»Ñ– Ñ‚Ð° Ñ‚Ð¾ÐºÐµÐ½Ð¸ Ð½Ðµ ÐºÐµÑ€ÑƒÑŽÑ‚ÑŒÑÑ VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Ð”Ð°Ð½Ñ– Broker",
            brokerDetailsDescription:
                "ÐœÐ¸ Ð·Ð±ÐµÑ€Ñ–Ð³Ð°Ñ”Ð¼Ð¾ Ð»Ð¸ÑˆÐµ Ð¿Ñ€Ð¾Ð²Ð°Ð¹Ð´ÐµÑ€Ð° Ñ‚Ð° Ñ–Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ñ–ÐºÐ°Ñ‚Ð¾Ñ€ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°. Ð ÐµÐ°Ð»ÑŒÐ½Ñ– Ð¾Ð±Ð»Ñ–ÐºÐ¾Ð²Ñ– Ð´Ð°Ð½Ñ– Ð±ÑƒÐ´ÑƒÑ‚ÑŒ Ð´Ð¾Ð´Ð°Ð½Ñ– Ð¿Ñ–Ð·Ð½Ñ–ÑˆÐµ Ð· Ð±ÐµÐ·Ð¿ÐµÑ‡Ð½Ð¸Ð¼ Ð·Ð±ÐµÑ€Ñ–Ð³Ð°Ð½Ð½ÑÐ¼.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "ÐÐ°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ ÐºÐ¾Ð½ÐµÐºÑ‚Ð¾Ñ€Ð°",
            connectionDetails: "Ð”Ð°Ð½Ñ– Ð¿Ñ–Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð½Ñ",
            connectionDescription:
                "Ð¦Ñ– Ð´Ð°Ð½Ñ– Ð±ÑƒÐ´ÑƒÑ‚ÑŒ Ð²Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð°Ð½Ñ– Ð´Ð»Ñ Ñ‚ÐµÑÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ Ð¼Ð°Ð¹Ð±ÑƒÑ‚Ð½ÑŒÐ¾Ð³Ð¾ MT5 Expert Advisor Ð°Ð±Ð¾ Ð¼Ð°Ð¹Ð±ÑƒÑ‚Ð½ÑŒÐ¾Ñ— Broker Ñ–Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ—. ÐÐ°Ñ€Ð°Ð·Ñ– Ñ†Ðµ Ñ–Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ñ–Ñ ÐºÐ¾Ð½Ñ„Ñ–Ð³ÑƒÑ€Ð°Ñ†Ñ–Ñ—, Ð° Ð½Ðµ Ñ€ÐµÐ°Ð»ÑŒÐ½Ðµ Ð¿Ñ–Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð½Ñ.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Ð—Ð±ÐµÑ€Ñ–Ð³Ð°Ñ”Ñ‚ÑŒÑÑ Ð»Ð¸ÑˆÐµ Ð² ÑÐµÑ€Ð²ÐµÑ€Ð½Ð¾Ð¼Ñƒ ÑÐµÑ€ÐµÐ´Ð¾Ð²Ð¸Ñ‰Ñ–",
            syncSecretDescription:
                "Ð’Ñ–Ð½ Ð½Ðµ Ð¿Ð¾ÐºÐ°Ð·ÑƒÑ”Ñ‚ÑŒÑÑ Ð² Ð·Ð°ÑÑ‚Ð¾ÑÑƒÐ½ÐºÑƒ. Ð™Ð¾Ð³Ð¾ Ð±ÑƒÐ´Ðµ Ð²Ñ€ÑƒÑ‡Ð½Ñƒ Ð²Ð²ÐµÐ´ÐµÐ½Ð¾ Ð² ÐºÐ¾Ð½ÐµÐºÑ‚Ð¾Ñ€ Ð»Ð¸ÑˆÐµ Ð¿Ñ–Ð´ Ñ‡Ð°Ñ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ¾Ð²Ð°Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "ÐœÐ°Ð¹Ð±ÑƒÑ‚Ð½Ñ–Ð¹ Ð¿Ð¾Ñ‚Ñ–Ðº ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ—",
            futureSyncDescription:
                "ÐšÐ¾Ð½ÐµÐºÑ‚Ð¾Ñ€ ÑÐ¿Ð¾Ñ‡Ð°Ñ‚ÐºÑƒ Ð¿ÐµÑ€ÐµÐ²Ñ–Ñ€Ð¸Ñ‚ÑŒ Health Check. Ð¯ÐºÑ‰Ð¾ VOLTIS Ð²Ñ–Ð´Ð¿Ð¾Ð²Ñ–ÑÑ‚ÑŒ, Ñ‰Ð¾ sync Ð³Ð¾Ñ‚Ð¾Ð²Ð¸Ð¹, Ð²Ñ–Ð½ Ð²Ñ–Ð´Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ Ð·Ð°ÐºÑ€Ð¸Ñ‚Ñ– ÑƒÐ³Ð¾Ð´Ð¸ Ð½Ð° Import Endpoint. Ð£Ð³Ð¾Ð´Ð¸ Ð¿Ð¾Ñ‚Ñ€Ð°Ð¿Ð»ÑÑ‚ÑŒ Ñƒ Diary ÑÐº Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¾Ð²Ð°Ð½Ñ– Ñ‚Ð°, Ð·Ð° Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸, Ñƒ ÑÑ‚Ð°Ñ‚ÑƒÑ Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "ÐžÑÑ‚Ð°Ð½Ð½Ñ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ–ÑÑ‚ÑŒ Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ñƒ",
            syncLogsDescription:
                "Ð¢ÑƒÑ‚ Ð±ÑƒÐ´ÑƒÑ‚ÑŒ Ð¾ÑÑ‚Ð°Ð½Ð½Ñ– Ð¿Ð¾Ð´Ñ–Ñ—, Ð¿Ð¾Ð²â€™ÑÐ·Ð°Ð½Ñ– Ð· Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ð¾ÑŽ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ”ÑŽ: Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¾Ð²Ð°Ð½Ñ– ÑƒÐ³Ð¾Ð´Ð¸, Ð¾Ð½Ð¾Ð²Ð»ÐµÐ½Ñ– Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ, ÑÐºÐ¸Ð´Ð°Ð½Ð½Ñ Ñ‚Ð° Ð¼Ð°Ð¹Ð±ÑƒÑ‚Ð½Ñ– Ð¿Ð¾Ð¼Ð¸Ð»ÐºÐ¸ MT5/Broker.",
            noSyncActivity:
                "ÐŸÐ¾ÐºÐ¸ Ñ‰Ð¾ Ð½ÐµÐ¼Ð°Ñ” Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ñ– sync. ÐšÐ¾Ð»Ð¸ ÑƒÐ³Ð¾Ð´Ñƒ Ð±ÑƒÐ´Ðµ Ñ–Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¾Ð²Ð°Ð½Ð¾ Ð· MT5 Ð°Ð±Ð¾ Broker, Ð²Ð¾Ð½Ð° Ð·â€™ÑÐ²Ð¸Ñ‚ÑŒÑÑ Ñ‚ÑƒÑ‚.",

            securityNotice: "ÐŸÐ¾Ð²Ñ–Ð´Ð¾Ð¼Ð»ÐµÐ½Ð½Ñ Ð±ÐµÐ·Ð¿ÐµÐºÐ¸",
            noSensitiveCredentials: "Ð§ÑƒÑ‚Ð»Ð¸Ð²Ñ– Ð¾Ð±Ð»Ñ–ÐºÐ¾Ð²Ñ– Ð´Ð°Ð½Ñ– Ð½Ðµ Ð·Ð±ÐµÑ€Ñ–Ð³Ð°ÑŽÑ‚ÑŒÑÑ",
            securityDescription:
                "ÐÐ° Ñ†ÑŒÐ¾Ð¼Ñƒ ÐµÑ‚Ð°Ð¿Ñ– VOLTIS Ð½Ðµ Ð·Ð±ÐµÑ€Ñ–Ð³Ð°Ñ” Ð¿Ð°Ñ€Ð¾Ð»Ñ– MT5, API-ÐºÐ»ÑŽÑ‡Ñ– Ð±Ñ€Ð¾ÐºÐµÑ€Ð°, Ñ‚Ð¾ÐºÐµÐ½Ð¸ Ð°Ð±Ð¾ Ñ‡ÑƒÑ‚Ð»Ð¸Ð²Ñ– Ð´Ð°Ð½Ñ–. Ð ÐµÐ°Ð»ÑŒÐ½Ðµ Ð¿Ñ–Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð½Ñ Ð±ÑƒÐ´Ðµ Ð¿Ð¾Ð±ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¾ Ð¿Ñ–Ð·Ð½Ñ–ÑˆÐµ Ñ‡ÐµÑ€ÐµÐ· ÑÐ¿ÐµÑ†Ñ–Ð°Ð»ÑŒÐ½Ñƒ Ð·Ð°Ñ…Ð¸Ñ‰ÐµÐ½Ñƒ ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ.",

            saveNote:
                "Ð—Ð±ÐµÑ€Ñ–Ð³Ð°Ð¹Ñ‚Ðµ Ð»Ð¸ÑˆÐµ Ð½ÐµÑ‡ÑƒÑ‚Ð»Ð¸Ð²Ñ– Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ. Ð ÐµÐ°Ð»ÑŒÐ½Ð° ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ñ–Ð·Ð°Ñ†Ñ–Ñ Ð±ÑƒÐ´Ðµ Ð¿Ñ€Ð¾Ñ‚ÐµÑÑ‚Ð¾Ð²Ð°Ð½Ð° Ð¿Ñ–Ð·Ð½Ñ–ÑˆÐµ Ð² ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ¾Ð²Ð°Ð½Ð¾Ð¼Ñƒ ÑÐµÑ€ÐµÐ´Ð¾Ð²Ð¸Ñ‰Ñ–.",
            saveButton: "Ð—Ð±ÐµÑ€ÐµÐ³Ñ‚Ð¸ Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ Ñ–Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ñ–Ñ—",
        },
    },

    ru: {
        modes: {
            manual: "Ð¢Ð¾Ð»ÑŒÐºÐ¾ Ð²Ñ€ÑƒÑ‡Ð½ÑƒÑŽ",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¾",
            pending: "Ð’ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ð¸",
            error: "ÐžÑˆÐ¸Ð±ÐºÐ°",
            inactive: "ÐÐµÐ°ÐºÑ‚Ð¸Ð²Ð½Ð¾",
        },
        common: {
            enabled: "Ð’ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¾",
            disabled: "Ð’Ñ‹ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¾",
            configured: "ÐÐ°ÑÑ‚Ñ€Ð¾ÐµÐ½Ð¾",
            missing: "ÐžÑ‚ÑÑƒÑ‚ÑÑ‚Ð²ÑƒÐµÑ‚",
            ok: "OK",
            never: "ÐÐ¸ÐºÐ¾Ð³Ð´Ð°",
            import: "Ð˜Ð¼Ð¿Ð¾Ñ€Ñ‚",
            updated: "ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾",
            reset: "Ð¡Ð±Ñ€Ð¾Ñ",
            settings: "ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸",
        },
        readiness: {
            title: "Ð“Ð¾Ñ‚Ð¾Ð²Ð½Ð¾ÑÑ‚ÑŒ Trade Sync",

            manualLabel: "Ð ÑƒÑ‡Ð½Ð¾Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼",
            manualDescription:
                "Ð­Ñ‚Ð¾Ñ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÐ½ ÐºÐ°Ðº Manual Only. Ð¡Ð´ÐµÐ»ÐºÐ¸ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÑÑŽÑ‚ÑÑ Ð²Ñ€ÑƒÑ‡Ð½ÑƒÑŽ Ñ‡ÐµÑ€ÐµÐ· Diary.",
            manualModeActive: "Ð ÑƒÑ‡Ð½Ð¾Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼ Ð°ÐºÑ‚Ð¸Ð²ÐµÐ½",
            automaticSyncDisabled: "ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¾Ñ‚ÐºÐ»ÑŽÑ‡ÐµÐ½Ð°",

            mt5Label: "Ð“Ð¾Ñ‚Ð¾Ð²Ð¾ Ð´Ð»Ñ MT5",
            mt5Description:
                "Ð­Ñ‚Ð¾Ñ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð³Ð¾Ñ‚Ð¾Ð² Ð¿Ð¾Ð»ÑƒÑ‡Ð°Ñ‚ÑŒ ÑÐ´ÐµÐ»ÐºÐ¸ Ð¸Ð· Ð±ÑƒÐ´ÑƒÑ‰ÐµÐ³Ð¾ MT5 Connector.",
            mt5ModeActive: "Ð ÐµÐ¶Ð¸Ð¼ MT5 Ð°ÐºÑ‚Ð¸Ð²ÐµÐ½",
            autoSyncEnabled: "ÐÐ²Ñ‚Ð¾ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð²ÐºÐ»ÑŽÑ‡ÐµÐ½Ð°",
            mt5SourceEnabled: "Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº MT5 Ð²ÐºÐ»ÑŽÑ‡ÐµÐ½",

            brokerLabel: "Ð“Ð¾Ñ‚Ð¾Ð²Ð¾ Ð´Ð»Ñ Broker",
            brokerDescription:
                "Ð­Ñ‚Ð¾Ñ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð³Ð¾Ñ‚Ð¾Ð² Ð¿Ð¾Ð»ÑƒÑ‡Ð°Ñ‚ÑŒ ÑÐ´ÐµÐ»ÐºÐ¸ Ð¸Ð· Ð±ÑƒÐ´ÑƒÑ‰ÐµÐ¹ Broker Integration.",
            brokerModeActive: "Ð ÐµÐ¶Ð¸Ð¼ Broker Ð°ÐºÑ‚Ð¸Ð²ÐµÐ½",
            brokerSourceEnabled: "Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº Broker Ð²ÐºÐ»ÑŽÑ‡ÐµÐ½",

            hybridLabel: "Ð“Ð¾Ñ‚Ð¾Ð²Ð¾ Ð´Ð»Ñ MT5 + Broker",
            hybridDescription:
                "Ð­Ñ‚Ð¾Ñ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð³Ð¾Ñ‚Ð¾Ð² Ð¿Ð¾Ð»ÑƒÑ‡Ð°Ñ‚ÑŒ ÑÐ´ÐµÐ»ÐºÐ¸ Ð¸ Ð¸Ð· MT5, Ð¸ Ð¸Ð· Broker Integration.",
            hybridModeActive: "Ð“Ð¸Ð±Ñ€Ð¸Ð´Ð½Ñ‹Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼ Ð°ÐºÑ‚Ð¸Ð²ÐµÐ½",

            neededLabel: "Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°",
            neededDescription:
                "Ð”Ð»Ñ ÑÑ‚Ð¾Ð³Ð¾ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð° Ð²Ñ‹Ð±Ñ€Ð°Ð½ Ñ€ÐµÐ¶Ð¸Ð¼ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸, Ð½Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ñ ÐµÑ‰Ðµ Ð½Ðµ Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð°.",
            integrationModeSelected: "Ð ÐµÐ¶Ð¸Ð¼ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸ Ð²Ñ‹Ð±Ñ€Ð°Ð½",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Ð˜Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°",
            title: "Ð˜Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸",
            description:
                "ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹Ñ‚Ðµ Ð±Ð°Ð·Ñƒ Ð´Ð»Ñ Manual, MT5, Broker Ð¸ Hybrid Sync. ÐÐ° ÑÑ‚Ð¾Ð¼ ÑÑ‚Ð°Ð¿Ðµ VOLTIS Ð½Ðµ Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ Ð¿Ð°Ñ€Ð¾Ð»Ð¸, Ñ‚Ð¾ÐºÐµÐ½Ñ‹ Ð¸Ð»Ð¸ API-ÐºÐ»ÑŽÑ‡Ð¸: Ð¾Ð½ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÑ‚ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½ÑƒÑŽ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ð´Ð»Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸.",
            back: "ÐÐ°Ð·Ð°Ð´ Ð² Account Hub",
        },
        cards: {
            integrationMode: "Ð ÐµÐ¶Ð¸Ð¼ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸",
            integrationModeDescription:
                "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑÐ´ÐµÐ»ÐºÐ°Ð¼Ð¸ Ð´Ð»Ñ ÑÑ‚Ð¾Ð³Ð¾ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐµÑ‚, Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÑ‚ Ð»Ð¸ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ñ‹.",
            mt5Setup: "ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ° MT5",
            mt5SetupDescription:
                "Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ‚Ð¾Ñ€Ñ‹ Ð»Ð¾Ð³Ð¸Ð½Ð° Ð¸ ÑÐµÑ€Ð²ÐµÑ€Ð° MT5 Ð±ÐµÐ· Ñ‡ÑƒÐ²ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ….",
            lastSync: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ",
            lastSyncDescription:
                "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ, Ð·Ð°Ð¿Ð¸ÑÐ°Ð½Ð½Ð°Ñ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð¼.",
        },
        syncError: {
            eyebrow: "ÐžÐ±Ð½Ð°Ñ€ÑƒÐ¶ÐµÐ½Ð° Ð¾ÑˆÐ¸Ð±ÐºÐ° ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸",
            title: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð½Ðµ ÑƒÐ´Ð°Ð»Ð°ÑÑŒ",
            description:
                "VOLTIS Ð¾Ð±Ð½Ð°Ñ€ÑƒÐ¶Ð¸Ð» Ð¾ÑˆÐ¸Ð±ÐºÑƒ Ð²Ð¾ Ð²Ñ€ÐµÐ¼Ñ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð° ÑÐ´ÐµÐ»Ð¾Ðº. ÐŸÑ€Ð¾Ð²ÐµÑ€ÑŒÑ‚Ðµ ÐºÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸ÑŽ, Account ID, secret Ð¸ Sync Logs.",
            latestError: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ Ð¾ÑˆÐ¸Ð±ÐºÐ°",
            resetButton: "Ð¡Ð±Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Sync",
        },
        form: {
            syncMode: "Ð ÐµÐ¶Ð¸Ð¼ Sync",
            integrationStrategy: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸",
            integrationStrategyDescription:
                "Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ, ÐºÐ°Ðº ÑÑ‚Ð¾Ñ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ð´Ð¾Ð»Ð¶ÐµÐ½ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÑÑ‚ÑŒ ÑÐ´ÐµÐ»ÐºÐ°Ð¼Ð¸. Manual Only Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ñ€ÑƒÑ‡Ð½Ð¾Ð¹ Ð²Ð²Ð¾Ð´. MT5, Broker Ð¸ Hybrid Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð°Ð²Ð»Ð¸Ð²Ð°ÑŽÑ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚ Ðº Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸.",

            activation: "ÐÐºÑ‚Ð¸Ð²Ð°Ñ†Ð¸Ñ",
            sources: "Ð˜ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¸",
            autoSyncDescription:
                "ÐŸÐ¾Ð·Ð²Ð¾Ð»ÑÐµÑ‚ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ñƒ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°Ñ‚ÑŒ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ñ‹.",
            mt5Description:
                "Ð’ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº MT5 Ð´Ð»Ñ Ð±ÑƒÐ´ÑƒÑ‰ÐµÐ³Ð¾ ÐºÐ¾Ð½Ð½ÐµÐºÑ‚Ð¾Ñ€Ð°.",
            brokerDescription: "Ð’ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ðº Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Ð”Ð°Ð½Ð½Ñ‹Ðµ MetaTrader 5",
            mt5DetailsDescription:
                "Ð’Ð²Ð¾Ð´Ð¸Ñ‚Ðµ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½ÐµÑ‡ÑƒÐ²ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¸Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ. ÐŸÐ°Ñ€Ð¾Ð»Ð¸ Ð¸ Ñ‚Ð¾ÐºÐµÐ½Ñ‹ Ð½Ðµ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÑÑŽÑ‚ÑÑ VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Ð”Ð°Ð½Ð½Ñ‹Ðµ Broker",
            brokerDetailsDescription:
                "ÐœÑ‹ ÑÐ¾Ñ…Ñ€Ð°Ð½ÑÐµÐ¼ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ñ€Ð¾Ð²Ð°Ð¹Ð´ÐµÑ€Ð° Ð¸ Ð¸Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ‚Ð¾Ñ€ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°. Ð ÐµÐ°Ð»ÑŒÐ½Ñ‹Ðµ ÑƒÑ‡ÐµÑ‚Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð±ÑƒÐ´ÑƒÑ‚ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ñ‹ Ð¿Ð¾Ð·Ð¶Ðµ Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ñ‹Ð¼ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸ÐµÐ¼.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ° ÐºÐ¾Ð½Ð½ÐµÐºÑ‚Ð¾Ñ€Ð°",
            connectionDetails: "Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ",
            connectionDescription:
                "Ð­Ñ‚Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð±ÑƒÐ´ÑƒÑ‚ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ñ‹ Ð´Ð»Ñ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð±ÑƒÐ´ÑƒÑ‰ÐµÐ³Ð¾ MT5 Expert Advisor Ð¸Ð»Ð¸ Ð±ÑƒÐ´ÑƒÑ‰ÐµÐ¹ Broker Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸. Ð¡ÐµÐ¹Ñ‡Ð°Ñ ÑÑ‚Ð¾ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ ÐºÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ð¸, Ð° Ð½Ðµ Ñ€ÐµÐ°Ð»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Ð¥Ñ€Ð°Ð½Ð¸Ñ‚ÑÑ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð² ÑÐµÑ€Ð²ÐµÑ€Ð½Ð¾Ð¹ ÑÑ€ÐµÐ´Ðµ",
            syncSecretDescription:
                "ÐžÐ½ Ð½Ðµ Ð¾Ñ‚Ð¾Ð±Ñ€Ð°Ð¶Ð°ÐµÑ‚ÑÑ Ð² Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ð¸. ÐžÐ½ Ð±ÑƒÐ´ÐµÑ‚ Ð²Ñ€ÑƒÑ‡Ð½ÑƒÑŽ Ð²Ð²ÐµÐ´ÐµÐ½ Ð² ÐºÐ¾Ð½Ð½ÐµÐºÑ‚Ð¾Ñ€ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½Ð° ÑÑ‚Ð°Ð¿Ðµ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐµÐ¼Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Ð‘ÑƒÐ´ÑƒÑ‰Ð¸Ð¹ Ð¿Ð¾Ñ‚Ð¾Ðº ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸",
            futureSyncDescription:
                "ÐšÐ¾Ð½Ð½ÐµÐºÑ‚Ð¾Ñ€ ÑÐ½Ð°Ñ‡Ð°Ð»Ð° Ð¿Ñ€Ð¾Ð²ÐµÑ€Ð¸Ñ‚ Health Check. Ð•ÑÐ»Ð¸ VOLTIS Ð¾Ñ‚Ð²ÐµÑ‚Ð¸Ñ‚, Ñ‡Ñ‚Ð¾ sync Ð³Ð¾Ñ‚Ð¾Ð², Ð¾Ð½ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ Ð·Ð°ÐºÑ€Ñ‹Ñ‚Ñ‹Ðµ ÑÐ´ÐµÐ»ÐºÐ¸ Ð½Ð° Import Endpoint. Ð¡Ð´ÐµÐ»ÐºÐ¸ Ð¿Ð¾Ð¿Ð°Ð´ÑƒÑ‚ Ð² Diary ÐºÐ°Ðº Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð¸, Ð¿Ñ€Ð¸ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ÑÑ‚Ð¸, Ð² ÑÑ‚Ð°Ñ‚ÑƒÑ Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð°",
            syncLogsDescription:
                "Ð—Ð´ÐµÑÑŒ Ð±ÑƒÐ´ÑƒÑ‚ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ñ, ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ðµ Ñ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸ÐµÐ¹: Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ ÑÐ´ÐµÐ»ÐºÐ¸, Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸, ÑÐ±Ñ€Ð¾ÑÑ‹ Ð¸ Ð±ÑƒÐ´ÑƒÑ‰Ð¸Ðµ Ð¾ÑˆÐ¸Ð±ÐºÐ¸ MT5/Broker.",
            noSyncActivity:
                "ÐŸÐ¾ÐºÐ° Ð½ÐµÑ‚ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸ sync. ÐšÐ¾Ð³Ð´Ð° ÑÐ´ÐµÐ»ÐºÐ° Ð±ÑƒÐ´ÐµÑ‚ Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð° Ð¸Ð· MT5 Ð¸Ð»Ð¸ Broker, Ð¾Ð½Ð° Ð¿Ð¾ÑÐ²Ð¸Ñ‚ÑÑ Ð·Ð´ÐµÑÑŒ.",

            securityNotice: "Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸",
            noSensitiveCredentials: "Ð§ÑƒÐ²ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ ÑƒÑ‡ÐµÑ‚Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð½Ðµ ÑÐ¾Ñ…Ñ€Ð°Ð½ÑÑŽÑ‚ÑÑ",
            securityDescription:
                "ÐÐ° ÑÑ‚Ð¾Ð¼ ÑÑ‚Ð°Ð¿Ðµ VOLTIS Ð½Ðµ Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ Ð¿Ð°Ñ€Ð¾Ð»Ð¸ MT5, API-ÐºÐ»ÑŽÑ‡Ð¸ Ð±Ñ€Ð¾ÐºÐµÑ€Ð°, Ñ‚Ð¾ÐºÐµÐ½Ñ‹ Ð¸Ð»Ð¸ Ñ‡ÑƒÐ²ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ. Ð ÐµÐ°Ð»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð±ÑƒÐ´ÐµÑ‚ Ð¿Ð¾ÑÑ‚Ñ€Ð¾ÐµÐ½Ð¾ Ð¿Ð¾Ð·Ð¶Ðµ Ñ‡ÐµÑ€ÐµÐ· ÑÐ¿ÐµÑ†Ð¸Ð°Ð»ÑŒÐ½ÑƒÑŽ Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð½ÑƒÑŽ ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ.",

            saveNote:
                "Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÑÐ¹Ñ‚Ðµ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½ÐµÑ‡ÑƒÐ²ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸. Ð ÐµÐ°Ð»ÑŒÐ½Ð°Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð±ÑƒÐ´ÐµÑ‚ Ð¿Ñ€Ð¾Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð° Ð¿Ð¾Ð·Ð¶Ðµ Ð² ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐµÐ¼Ð¾Ð¹ ÑÑ€ÐµÐ´Ðµ.",
            saveButton: "Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸",
        },
    },

    es: {
        modes: {
            manual: "Solo manual",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "Conectado",
            pending: "Pendiente",
            error: "Error",
            inactive: "Inactivo",
        },
        common: {
            enabled: "Activado",
            disabled: "Desactivado",
            configured: "Configurado",
            missing: "Falta",
            ok: "OK",
            never: "Nunca",
            import: "Import",
            updated: "Actualizado",
            reset: "Reset",
            settings: "Ajustes",
        },
        readiness: {
            title: "PreparaciÃ³n Trade Sync",

            manualLabel: "Modo manual",
            manualDescription:
                "Esta cuenta estÃ¡ configurada como Manual Only. Las operaciones se gestionan manualmente desde el Diary.",
            manualModeActive: "Modo manual activo",
            automaticSyncDisabled: "SincronizaciÃ³n automÃ¡tica desactivada",

            mt5Label: "Lista para MT5",
            mt5Description:
                "Esta cuenta estÃ¡ lista para recibir operaciones desde un futuro MT5 Connector.",
            mt5ModeActive: "Modo MT5 activo",
            autoSyncEnabled: "Auto sync activado",
            mt5SourceEnabled: "Fuente MT5 activada",

            brokerLabel: "Lista para Broker",
            brokerDescription:
                "Esta cuenta estÃ¡ lista para recibir operaciones desde una futura Broker Integration.",
            brokerModeActive: "Modo Broker activo",
            brokerSourceEnabled: "Fuente Broker activada",

            hybridLabel: "Lista para MT5 + Broker",
            hybridDescription:
                "Esta cuenta estÃ¡ lista para recibir operaciones tanto desde MT5 como desde Broker Integration.",
            hybridModeActive: "Modo hÃ­brido activo",

            neededLabel: "ConfiguraciÃ³n requerida",
            neededDescription:
                "Esta cuenta tiene un modo sync seleccionado, pero la configuraciÃ³n aÃºn no estÃ¡ completa.",
            integrationModeSelected: "Modo de integraciÃ³n seleccionado",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Integraciones de cuenta",
            title: "Integraciones",
            description:
                "Configura la base para Manual, MT5, Broker y Hybrid Sync. En esta fase VOLTIS no guarda contraseÃ±as, tokens ni API keys: solo prepara la estructura segura para la sincronizaciÃ³n.",
            back: "Volver al Account Hub",
        },
        cards: {
            integrationMode: "Modo de integraciÃ³n",
            integrationModeDescription:
                "Estrategia de gestiÃ³n de operaciones para esta cuenta.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Controla si la cuenta acepta importaciones automÃ¡ticas.",
            mt5Setup: "ConfiguraciÃ³n MT5",
            mt5SetupDescription:
                "Identificadores de login y servidor MT5, sin credenciales sensibles.",
            lastSync: "Ãšltima sync",
            lastSyncDescription:
                "Ãšltima sincronizaciÃ³n registrada por la cuenta.",
        },
        syncError: {
            eyebrow: "Error de sync detectado",
            title: "La Ãºltima sincronizaciÃ³n fallÃ³",
            description:
                "VOLTIS detectÃ³ un error durante la importaciÃ³n automÃ¡tica de operaciones. Revisa configuraciÃ³n, Account ID, secret y Sync Logs.",
            latestError: "Ãšltimo error",
            resetButton: "Reset Sync",
        },
        form: {
            syncMode: "Modo sync",
            integrationStrategy: "Estrategia de integraciÃ³n",
            integrationStrategyDescription:
                "Elige cÃ³mo esta cuenta debe gestionar las operaciones. Manual Only mantiene solo la entrada manual. MT5, Broker y Hybrid preparan la cuenta para sincronizaciÃ³n automÃ¡tica.",

            activation: "ActivaciÃ³n",
            sources: "Fuentes",
            autoSyncDescription:
                "Permite que la cuenta acepte importaciones automÃ¡ticas.",
            mt5Description:
                "Activa la fuente MT5 para el futuro conector.",
            brokerDescription: "Activa la fuente Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Detalles MetaTrader 5",
            mt5DetailsDescription:
                "Introduce solo datos identificativos no sensibles. ContraseÃ±as y tokens no son gestionados por VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Detalles Broker",
            brokerDetailsDescription:
                "Guardamos solo proveedor e identificador de cuenta. Las credenciales reales se aÃ±adirÃ¡n mÃ¡s adelante con almacenamiento seguro.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "ConfiguraciÃ³n del conector",
            connectionDetails: "Detalles de conexiÃ³n",
            connectionDescription:
                "Estos datos servirÃ¡n para probar el futuro Expert Advisor MT5 o una futura integraciÃ³n Broker. Por ahora son informaciÃ³n de configuraciÃ³n, no una conexiÃ³n real.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Guardado solo en el entorno servidor",
            syncSecretDescription:
                "No se muestra en la app. Se introducirÃ¡ manualmente en el conector solo durante pruebas controladas.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Flujo sync futuro",
            futureSyncDescription:
                "El conector comprobarÃ¡ primero el Health Check. Si VOLTIS responde que la sync estÃ¡ lista, enviarÃ¡ las operaciones cerradas al Import Endpoint. Las operaciones entrarÃ¡n en el Diary como importadas y, si hace falta, en estado Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Actividad reciente de importaciÃ³n",
            syncLogsDescription:
                "AquÃ­ verÃ¡s los Ãºltimos eventos conectados a la sincronizaciÃ³n automÃ¡tica: operaciones importadas, ajustes actualizados, resets y futuros errores MT5/Broker.",
            noSyncActivity:
                "AÃºn no hay actividad sync registrada. Cuando una operaciÃ³n se importe desde MT5 o Broker, aparecerÃ¡ aquÃ­.",

            securityNotice: "Aviso de seguridad",
            noSensitiveCredentials: "No se guardan credenciales sensibles",
            securityDescription:
                "En esta fase VOLTIS no almacena contraseÃ±as MT5, API keys de broker, tokens ni datos sensibles. La conexiÃ³n real se construirÃ¡ mÃ¡s adelante con un sistema dedicado y protegido.",

            saveNote:
                "Guarda solo ajustes no sensibles. La sync real se probarÃ¡ mÃ¡s adelante en un entorno controlado.",
            saveButton: "Guardar ajustes de integraciÃ³n",
        },
    },

    fr: {
        modes: {
            manual: "Manuel uniquement",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "ConnectÃ©",
            pending: "En attente",
            error: "Erreur",
            inactive: "Inactif",
        },
        common: {
            enabled: "ActivÃ©",
            disabled: "DÃ©sactivÃ©",
            configured: "ConfigurÃ©",
            missing: "Manquant",
            ok: "OK",
            never: "Jamais",
            import: "Import",
            updated: "Mis Ã  jour",
            reset: "Reset",
            settings: "ParamÃ¨tres",
        },
        readiness: {
            title: "PrÃ©paration Trade Sync",

            manualLabel: "Mode manuel",
            manualDescription:
                "Ce compte est configurÃ© en Manual Only. Les trades sont gÃ©rÃ©s manuellement depuis le Diary.",
            manualModeActive: "Mode manuel actif",
            automaticSyncDisabled: "Synchronisation automatique dÃ©sactivÃ©e",

            mt5Label: "PrÃªt pour MT5",
            mt5Description:
                "Ce compte est prÃªt Ã  recevoir des trades depuis un futur MT5 Connector.",
            mt5ModeActive: "Mode MT5 actif",
            autoSyncEnabled: "Auto sync activÃ©",
            mt5SourceEnabled: "Source MT5 activÃ©e",

            brokerLabel: "PrÃªt pour Broker",
            brokerDescription:
                "Ce compte est prÃªt Ã  recevoir des trades depuis une future Broker Integration.",
            brokerModeActive: "Mode Broker actif",
            brokerSourceEnabled: "Source Broker activÃ©e",

            hybridLabel: "PrÃªt pour MT5 + Broker",
            hybridDescription:
                "Ce compte est prÃªt Ã  recevoir des trades depuis MT5 et Broker Integration.",
            hybridModeActive: "Mode hybride actif",

            neededLabel: "Configuration requise",
            neededDescription:
                "Ce compte a un mode sync sÃ©lectionnÃ©, mais la configuration nâ€™est pas encore complÃ¨te.",
            integrationModeSelected: "Mode dâ€™intÃ©gration sÃ©lectionnÃ©",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "IntÃ©grations du compte",
            title: "IntÃ©grations",
            description:
                "Configure la base pour Manual, MT5, Broker et Hybrid Sync. Ã€ ce stade VOLTIS ne stocke pas de mots de passe, tokens ou clÃ©s API : il prÃ©pare seulement la structure sÃ©curisÃ©e pour la synchronisation.",
            back: "Retour Ã  lâ€™Account Hub",
        },
        cards: {
            integrationMode: "Mode dâ€™intÃ©gration",
            integrationModeDescription:
                "StratÃ©gie de gestion des trades pour ce compte.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "ContrÃ´le si le compte accepte les imports automatiques.",
            mt5Setup: "Configuration MT5",
            mt5SetupDescription:
                "Identifiants login et serveur MT5, sans donnÃ©es sensibles.",
            lastSync: "DerniÃ¨re sync",
            lastSyncDescription:
                "DerniÃ¨re synchronisation enregistrÃ©e par le compte.",
        },
        syncError: {
            eyebrow: "Erreur sync dÃ©tectÃ©e",
            title: "La derniÃ¨re synchronisation a Ã©chouÃ©",
            description:
                "VOLTIS a dÃ©tectÃ© une erreur pendant lâ€™import automatique des trades. VÃ©rifie la configuration, Account ID, secret et Sync Logs.",
            latestError: "DerniÃ¨re erreur",
            resetButton: "Reset Sync",
        },
        form: {
            syncMode: "Mode sync",
            integrationStrategy: "StratÃ©gie dâ€™intÃ©gration",
            integrationStrategyDescription:
                "Choisis comment ce compte doit gÃ©rer les trades. Manual Only garde seulement la saisie manuelle. MT5, Broker et Hybrid prÃ©parent le compte Ã  la synchronisation automatique.",

            activation: "Activation",
            sources: "Sources",
            autoSyncDescription:
                "Permet au compte dâ€™accepter les imports automatiques.",
            mt5Description:
                "Active la source MT5 pour le futur connecteur.",
            brokerDescription: "Active la source Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "DÃ©tails MetaTrader 5",
            mt5DetailsDescription:
                "Saisis uniquement des donnÃ©es dâ€™identification non sensibles. Les mots de passe et tokens ne sont pas gÃ©rÃ©s par VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "DÃ©tails Broker",
            brokerDetailsDescription:
                "Nous stockons seulement le fournisseur et lâ€™identifiant du compte. Les vÃ©ritables identifiants seront ajoutÃ©s plus tard avec un stockage sÃ©curisÃ©.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Configuration du connecteur",
            connectionDetails: "DÃ©tails de connexion",
            connectionDescription:
                "Ces donnÃ©es serviront Ã  tester le futur Expert Advisor MT5 ou une future intÃ©gration Broker. Pour lâ€™instant ce sont des informations de configuration, pas une connexion rÃ©elle.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "StockÃ© uniquement dans lâ€™environnement serveur",
            syncSecretDescription:
                "Il nâ€™est pas affichÃ© dans lâ€™app. Il sera saisi manuellement dans le connecteur uniquement pendant les tests contrÃ´lÃ©s.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Flux sync futur",
            futureSyncDescription:
                "Le connecteur vÃ©rifiera dâ€™abord le Health Check. Si VOLTIS rÃ©pond que la sync est prÃªte, il enverra les trades clÃ´turÃ©s Ã  lâ€™Import Endpoint. Les trades entreront dans le Diary comme importÃ©s et, si nÃ©cessaire, avec le statut Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "ActivitÃ© dâ€™import rÃ©cente",
            syncLogsDescription:
                "Ici tu verras les derniers Ã©vÃ©nements liÃ©s Ã  la synchronisation automatique : trades importÃ©s, paramÃ¨tres mis Ã  jour, resets et futures erreurs MT5/Broker.",
            noSyncActivity:
                "Aucune activitÃ© sync enregistrÃ©e pour le moment. Quand un trade sera importÃ© depuis MT5 ou Broker, il apparaÃ®tra ici.",

            securityNotice: "Avis de sÃ©curitÃ©",
            noSensitiveCredentials: "Aucun identifiant sensible stockÃ©",
            securityDescription:
                "Ã€ ce stade VOLTIS ne stocke pas de mots de passe MT5, clÃ©s API broker, tokens ou donnÃ©es sensibles. La connexion rÃ©elle sera construite plus tard avec un systÃ¨me dÃ©diÃ© et protÃ©gÃ©.",

            saveNote:
                "Sauvegarde uniquement les paramÃ¨tres non sensibles. La sync rÃ©elle sera testÃ©e plus tard dans un environnement contrÃ´lÃ©.",
            saveButton: "Sauvegarder les paramÃ¨tres dâ€™intÃ©gration",
        },
    },

    de: {
        modes: {
            manual: "Nur manuell",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "Verbunden",
            pending: "Ausstehend",
            error: "Fehler",
            inactive: "Inaktiv",
        },
        common: {
            enabled: "Aktiviert",
            disabled: "Deaktiviert",
            configured: "Konfiguriert",
            missing: "Fehlt",
            ok: "OK",
            never: "Nie",
            import: "Import",
            updated: "Aktualisiert",
            reset: "Reset",
            settings: "Einstellungen",
        },
        readiness: {
            title: "Trade-Sync-Bereitschaft",

            manualLabel: "Manueller Modus",
            manualDescription:
                "Dieses Konto ist auf Manual Only eingestellt. Trades werden manuell im Diary verwaltet.",
            manualModeActive: "Manueller Modus aktiv",
            automaticSyncDisabled: "Automatische Synchronisierung deaktiviert",

            mt5Label: "Bereit fÃ¼r MT5",
            mt5Description:
                "Dieses Konto ist bereit, Trades von einem zukÃ¼nftigen MT5 Connector zu empfangen.",
            mt5ModeActive: "MT5-Modus aktiv",
            autoSyncEnabled: "Auto Sync aktiviert",
            mt5SourceEnabled: "MT5-Quelle aktiviert",

            brokerLabel: "Bereit fÃ¼r Broker",
            brokerDescription:
                "Dieses Konto ist bereit, Trades von einer zukÃ¼nftigen Broker Integration zu empfangen.",
            brokerModeActive: "Broker-Modus aktiv",
            brokerSourceEnabled: "Broker-Quelle aktiviert",

            hybridLabel: "Bereit fÃ¼r MT5 + Broker",
            hybridDescription:
                "Dieses Konto ist bereit, Trades sowohl von MT5 als auch von Broker Integration zu empfangen.",
            hybridModeActive: "Hybrid-Modus aktiv",

            neededLabel: "Konfiguration erforderlich",
            neededDescription:
                "FÃ¼r dieses Konto wurde ein Sync-Modus ausgewÃ¤hlt, aber die Konfiguration ist noch nicht vollstÃ¤ndig.",
            integrationModeSelected: "Integrationsmodus ausgewÃ¤hlt",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Konto-Integrationen",
            title: "Integrationen",
            description:
                "Konfiguriere die Basis fÃ¼r Manual, MT5, Broker und Hybrid Sync. In dieser Phase speichert VOLTIS keine PasswÃ¶rter, Tokens oder API-SchlÃ¼ssel: es bereitet nur die sichere Struktur fÃ¼r die Synchronisierung vor.",
            back: "ZurÃ¼ck zum Account Hub",
        },
        cards: {
            integrationMode: "Integrationsmodus",
            integrationModeDescription:
                "Trade-Verwaltungsstrategie fÃ¼r dieses Konto.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Steuert, ob das Konto automatische Importe akzeptiert.",
            mt5Setup: "MT5-Setup",
            mt5SetupDescription:
                "MT5-Login- und Server-Kennungen ohne sensible Zugangsdaten.",
            lastSync: "Letzte Sync",
            lastSyncDescription:
                "Letzte vom Konto aufgezeichnete Synchronisierung.",
        },
        syncError: {
            eyebrow: "Sync-Fehler erkannt",
            title: "Letzte Synchronisierung fehlgeschlagen",
            description:
                "VOLTIS hat einen Fehler beim automatischen Trade-Import erkannt. PrÃ¼fe Konfiguration, Account ID, Secret und Sync Logs.",
            latestError: "Letzter Fehler",
            resetButton: "Sync zurÃ¼cksetzen",
        },
        form: {
            syncMode: "Sync-Modus",
            integrationStrategy: "Integrationsstrategie",
            integrationStrategyDescription:
                "WÃ¤hle, wie dieses Konto Trades verwalten soll. Manual Only behÃ¤lt nur die manuelle Eingabe. MT5, Broker und Hybrid bereiten das Konto auf automatische Synchronisierung vor.",

            activation: "Aktivierung",
            sources: "Quellen",
            autoSyncDescription:
                "Erlaubt dem Konto, automatische Importe zu akzeptieren.",
            mt5Description:
                "Aktiviert die MT5-Quelle fÃ¼r den zukÃ¼nftigen Connector.",
            brokerDescription: "Aktiviert die Broker Integration-Quelle.",

            mt5Connector: "MT5 Connector",
            mt5Details: "MetaTrader 5 Details",
            mt5DetailsDescription:
                "Gib nur nicht sensible Identifikationsdaten ein. PasswÃ¶rter und Tokens werden nicht von VOLTIS verwaltet.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Broker Details",
            brokerDetailsDescription:
                "Wir speichern nur Anbieter und Konto-ID. Echte Zugangsdaten werden spÃ¤ter mit sicherem Speicher hinzugefÃ¼gt.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Connector-Setup",
            connectionDetails: "Verbindungsdetails",
            connectionDescription:
                "Diese Daten dienen zum Testen des zukÃ¼nftigen MT5 Expert Advisor oder einer zukÃ¼nftigen Broker-Integration. Derzeit sind es Konfigurationsinformationen, keine echte Verbindung.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Nur in der Serverumgebung gespeichert",
            syncSecretDescription:
                "Es wird in der App nicht angezeigt. Es wird nur wÃ¤hrend kontrollierter Tests manuell in den Connector eingetragen.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "ZukÃ¼nftiger Sync-Flow",
            futureSyncDescription:
                "Der Connector prÃ¼ft zuerst den Health Check. Wenn VOLTIS antwortet, dass die Sync bereit ist, sendet er geschlossene Trades an den Import Endpoint. Trades gelangen als importiert ins Diary und, falls nÃ¶tig, in den Status Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Aktuelle ImportaktivitÃ¤t",
            syncLogsDescription:
                "Hier siehst du die letzten Ereignisse zur automatischen Synchronisierung: importierte Trades, aktualisierte Einstellungen, Resets und zukÃ¼nftige MT5/Broker-Fehler.",
            noSyncActivity:
                "Noch keine Sync-AktivitÃ¤t aufgezeichnet. Wenn ein Trade aus MT5 oder Broker importiert wird, erscheint er hier.",

            securityNotice: "Sicherheitshinweis",
            noSensitiveCredentials: "Keine sensiblen Zugangsdaten gespeichert",
            securityDescription:
                "In dieser Phase speichert VOLTIS keine MT5-PasswÃ¶rter, Broker-API-SchlÃ¼ssel, Tokens oder sensiblen Daten. Die echte Verbindung wird spÃ¤ter mit einem dedizierten und geschÃ¼tzten System aufgebaut.",

            saveNote:
                "Speichere nur nicht sensible Einstellungen. Die echte Sync wird spÃ¤ter in einer kontrollierten Umgebung getestet.",
            saveButton: "Integrationseinstellungen speichern",
        },
    },
};

function getModeLabel(
    mode: string | null | undefined,
    t: IntegrationsLabels
) {
    if (mode === "mt5") {
        return t.modes.mt5;
    }

    if (mode === "broker") {
        return t.modes.broker;
    }

    if (mode === "hybrid") {
        return t.modes.hybrid;
    }

    return t.modes.manual;
}

function getStatusLabel(
    status: string | null | undefined,
    t: IntegrationsLabels
) {
    if (status === "connected") {
        return t.statuses.connected;
    }

    if (status === "pending") {
        return t.statuses.pending;
    }

    if (status === "error") {
        return t.statuses.error;
    }

    return t.statuses.inactive;
}

function getStatusClass(status?: string | null) {
    if (status === "connected") {
        return "border-accent/20 bg-accent/10 text-accent";
    }

    if (status === "pending") {
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }

    if (status === "error") {
        return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-white/10 bg-white/10 text-gray-300";
}

function formatDate(
    date: Date | null | undefined,
    language: AppLanguage,
    fallback: string
) {
    if (!date) {
        return fallback;
    }

    return formatDateTimeByLanguage(date, language);
}

function getSyncReadiness(
    account: {
        integrationMode: string | null;
        autoSyncEnabled: boolean;
        mt5Enabled: boolean;
        brokerSyncEnabled: boolean;
        syncStatus: string | null;
    },
    t: IntegrationsLabels
) {
    if (
        !account.integrationMode ||
        account.integrationMode === "manual"
    ) {
        return {
            label: t.readiness.manualLabel,
            tone: "border-white/10 bg-white/[0.04] text-gray-300",
            description: t.readiness.manualDescription,
            checklist: [
                {
                    label: t.readiness.manualModeActive,
                    ok: true,
                },
                {
                    label: t.readiness.automaticSyncDisabled,
                    ok: !account.autoSyncEnabled,
                },
            ] satisfies ReadinessItem[],
        };
    }

    if (
        account.integrationMode === "mt5" &&
        account.autoSyncEnabled &&
        account.mt5Enabled
    ) {
        return {
            label: t.readiness.mt5Label,
            tone: "border-accent-bright/20 bg-accent-bright/[0.08] text-accent-bright",
            description: t.readiness.mt5Description,
            checklist: [
                {
                    label: t.readiness.mt5ModeActive,
                    ok: true,
                },
                {
                    label: t.readiness.autoSyncEnabled,
                    ok: true,
                },
                {
                    label: t.readiness.mt5SourceEnabled,
                    ok: true,
                },
            ] satisfies ReadinessItem[],
        };
    }

    if (
        account.integrationMode === "broker" &&
        account.autoSyncEnabled &&
        account.brokerSyncEnabled
    ) {
        return {
            label: t.readiness.brokerLabel,
            tone: "border-blue-500/20 bg-blue-500/[0.08] text-blue-300",
            description: t.readiness.brokerDescription,
            checklist: [
                {
                    label: t.readiness.brokerModeActive,
                    ok: true,
                },
                {
                    label: t.readiness.autoSyncEnabled,
                    ok: true,
                },
                {
                    label: t.readiness.brokerSourceEnabled,
                    ok: true,
                },
            ] satisfies ReadinessItem[],
        };
    }

    if (
        account.integrationMode === "hybrid" &&
        account.autoSyncEnabled &&
        account.mt5Enabled &&
        account.brokerSyncEnabled
    ) {
        return {
            label: t.readiness.hybridLabel,
            tone: "border-accent/20  param($m) $m.Value -replace 'green-500', 'accent'  text-accent",
            description: t.readiness.hybridDescription,
            checklist: [
                {
                    label: t.readiness.hybridModeActive,
                    ok: true,
                },
                {
                    label: t.readiness.autoSyncEnabled,
                    ok: true,
                },
                {
                    label: t.readiness.mt5SourceEnabled,
                    ok: true,
                },
                {
                    label: t.readiness.brokerSourceEnabled,
                    ok: true,
                },
            ] satisfies ReadinessItem[],
        };
    }

    return {
        label: t.readiness.neededLabel,
        tone: "border-yellow-500/20 bg-yellow-500/[0.08] text-yellow-300",
        description: t.readiness.neededDescription,
        checklist: [
            {
                label: t.readiness.integrationModeSelected,
                ok:
                    Boolean(account.integrationMode) &&
                    account.integrationMode !== "manual",
            },
            {
                label: t.readiness.autoSyncEnabled,
                ok: account.autoSyncEnabled,
            },
            {
                label: t.readiness.mt5SourceEnabled,
                ok:
                    account.integrationMode === "broker"
                        ? true
                        : account.mt5Enabled,
            },
            {
                label: t.readiness.brokerSourceEnabled,
                ok:
                    account.integrationMode === "mt5"
                        ? true
                        : account.brokerSyncEnabled,
            },
        ] satisfies ReadinessItem[],
    };
}

function getAppBaseUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return "http://localhost:3000";
}

function StatusCard({
    label,
    value,
    description,
    icon: Icon,
    tone = "text-white",
}: StatusCardProps) {
    return (
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-400">
                        {label}
                    </p>

                    <h2 className={`mt-3 text-2xl font-black ${tone}`}>
                        {value}
                    </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-accent-bright">
                    <Icon size={20} />
                </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
                {description}
            </p>
        </div>
    );
}

function ToggleRow({
    name,
    title,
    description,
    defaultChecked,
}: {
    name: string;
    title: string;
    description: string;
    defaultChecked: boolean;
}) {
    return (
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.04]">
            <input
                name={name}
                type="checkbox"
                defaultChecked={defaultChecked}
                className="mt-1 h-5 w-5 accent-green-500"
            />

            <div>
                <p className="font-bold text-white">
                    {title}
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                    {description}
                </p>
            </div>
        </label>
    );
}

export default async function IntegrationsPage({
    params,
    searchParams,
}: {
    params: Promise<{
        accountId: string;
    }>;

    searchParams: Promise<{
        toast?: string;
    }>;
}) {
    const { accountId } = await params;
    const query = await searchParams;

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            appLanguage: true,
        },
    });

    const language = normalizeAppLanguage(
        currentUser?.appLanguage
    );

    const t = labels[language];

    const membership =
        await prisma.accountMember.findFirst({
            where: {
                userId: session.user.id,
                tradingAccountId: accountId,
            },
            include: {
                tradingAccount: true,
            },
        });

    if (!membership) {
        redirect("/accounts");
    }

    const isManager =
        membership.role === "MANAGER";

    const canManageIntegrations =
        isManager || membership.canManageAccount;

    if (!canManageIntegrations) {
        redirect(`/accounts/${accountId}`);
    }

    if (
        membership.tradingAccount.status === "ARCHIVED"
    ) {
        redirect(`/accounts/${accountId}`);
    }

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            lastSeenAt: new Date(),
            lastActivityAt: new Date(),
        },
    });

    const account = membership.tradingAccount;

    const recentSyncLogs =
        await prisma.activityLog.findMany({
            where: {
                accountId,
                type: {
                    in: [
                        "TRADE_IMPORTED",
                        "TRADE_SYNC_UPDATED",
                        "TRADE_SYNC_ERROR",
                        "INTEGRATION_SETTINGS_UPDATED",
                        "INTEGRATION_SYNC_RESET",
                    ],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 8,
        });

    const latestSyncError =
        recentSyncLogs.find(
            (log) => log.type === "TRADE_SYNC_ERROR"
        );

    const syncReadiness =
        getSyncReadiness(account, t);

    const appBaseUrl = getAppBaseUrl();

    const healthEndpoint =
        `${appBaseUrl}/api/trade-sync/health`;

    const importEndpoint =
        `${appBaseUrl}/api/trade-sync/import`;

    const updateIntegrationsAction =
        updateAccountIntegrations.bind(
            null,
            accountId
        );

    const resetSyncStatusAction =
        resetAccountSyncStatus.bind(
            null,
            accountId
        );

    const mt5Configured =
        Boolean(account.mt5AccountLogin) &&
        Boolean(account.mt5ServerName);
return (
        <div className="space-y-8">
            <GlobalToast status={query.toast} />

            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_14%,transparent),transparent_35%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_35%)]" />

                <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-accent-bright/20 bg-accent-bright/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-accent-bright">
                                {t.hero.badge}
                            </span>

                            <span className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${getStatusClass(account.syncStatus)}`}>
                                {getStatusLabel(account.syncStatus, t)}
                            </span>

                            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                                {getModeLabel(account.integrationMode, t)}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400">
                            {t.hero.eyebrow}
                        </p>

                        <h1 className="mt-3 flex items-center gap-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
                            <Cable className="hidden text-accent-bright sm:block" />
                            {t.hero.title}
                        </h1>

                        <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
                            {t.hero.description}
                        </p>
                    </div>

                    <Link
                        href={`/accounts/${accountId}`}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                    >
                        <ArrowLeft size={16} />
                        {t.hero.back}
                    </Link>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatusCard
                    label={t.cards.integrationMode}
                    value={getModeLabel(account.integrationMode, t)}
                    description={t.cards.integrationModeDescription}
                    icon={DatabaseZap}
                />

                <StatusCard
                    label={t.cards.autoSync}
                    value={
                        account.autoSyncEnabled
                            ? t.common.enabled
                            : t.common.disabled
                    }
                    description={t.cards.autoSyncDescription}
                    icon={RefreshCw}
                    tone={
                        account.autoSyncEnabled
                            ? "text-green-400"
                            : "text-gray-300"
                    }
                />

                <StatusCard
                    label={t.cards.mt5Setup}
                    value={
                        mt5Configured
                            ? t.common.configured
                            : t.common.missing
                    }
                    description={t.cards.mt5SetupDescription}
                    icon={Server}
                    tone={
                        mt5Configured
                            ? "text-green-400"
                            : "text-yellow-300"
                    }
                />

                <StatusCard
                    label={t.cards.lastSync}
                    value={formatDate(
                        account.lastSyncedAt,
                        language,
                        t.common.never
                    )}
                    description={t.cards.lastSyncDescription}
                    icon={CheckCircle2}
                />
            </section>

            <section className={`rounded-3xl border p-6 ${syncReadiness.tone}`}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] opacity-80">
                            {t.readiness.title}
                        </p>

                        <h2 className="mt-2 text-3xl font-black">
                            {syncReadiness.label}
                        </h2>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
                            {syncReadiness.description}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white">
                        {getModeLabel(account.integrationMode, t)}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {syncReadiness.checklist.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                        >
                            <span className="text-sm text-gray-300">
                                {item.label}
                            </span>

                            <span
                                className={
                                    item.ok
                                        ? "text-sm font-black text-accent"
                                        : "text-sm font-black text-red-400"
                                }
                            >
                                {item.ok ? t.common.ok : t.common.missing}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {account.syncStatus === "error" && (
                <section className="rounded-3xl border border-red-500/20 bg-red-500/[0.08] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-red-400">
                                {t.syncError.eyebrow}
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-white">
                                {t.syncError.title}
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
                                {t.syncError.description}
                            </p>

                            {latestSyncError?.description && (
                                <div className="mt-5 rounded-2xl border border-red-500/20 bg-black/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-red-300">
                                        {t.syncError.latestError}
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-300">
                                        {latestSyncError.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        <form action={resetSyncStatusAction}>
                            <button
                                type="submit"
                                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
                            >
                                {t.syncError.resetButton}
                            </button>
                        </form>
                    </div>
                </section>
            )}

            <form
                action={updateIntegrationsAction}
                className="space-y-8"
            >
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    {t.form.syncMode}
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-white">
                                    {t.form.integrationStrategy}
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                                    {t.form.integrationStrategyDescription}
                                </p>
                            </div>

                            <Settings2 className="text-accent-bright" />
                        </div>

                        <select
                            name="integrationMode"
                            defaultValue={
                                account.integrationMode ||
                                "manual"
                            }
                            className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition focus:border-green-500/40"
                        >
                            <option value="manual">
                                {t.modes.manual}
                            </option>

                            <option value="mt5">
                                {t.modes.mt5}
                            </option>

                            <option value="broker">
                                {t.modes.broker}
                            </option>

                            <option value="hybrid">
                                {t.modes.hybrid}
                            </option>
                        </select>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-400">
                                {t.form.activation}
                            </p>

                            <h2 className="mt-1 text-2xl font-black text-white">
                                {t.form.sources}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <ToggleRow
                                name="autoSyncEnabled"
                                title={t.cards.autoSync}
                                description={t.form.autoSyncDescription}
                                defaultChecked={
                                    account.autoSyncEnabled
                                }
                            />

                            <ToggleRow
                                name="mt5Enabled"
                                title="MT5"
                                description={t.form.mt5Description}
                                defaultChecked={
                                    account.mt5Enabled
                                }
                            />

                            <ToggleRow
                                name="brokerSyncEnabled"
                                title="Broker"
                                description={t.form.brokerDescription}
                                defaultChecked={
                                    account.brokerSyncEnabled
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    {t.form.mt5Connector}
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-white">
                                    {t.form.mt5Details}
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    {t.form.mt5DetailsDescription}
                                </p>
                            </div>

                            <Cable className="text-accent" />
                        </div>

                        <div className="space-y-4">
                            <input
                                name="mt5AccountLogin"
                                defaultValue={
                                    account.mt5AccountLogin || ""
                                }
                                placeholder={t.form.mt5AccountLoginPlaceholder}
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />

                            <input
                                name="mt5ServerName"
                                defaultValue={
                                    account.mt5ServerName || ""
                                }
                                placeholder={t.form.mt5ServerNamePlaceholder}
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-400">
                                    {t.form.brokerIntegration}
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-white">
                                    {t.form.brokerDetails}
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    {t.form.brokerDetailsDescription}
                                </p>
                            </div>

                            <UploadCloud className="text-blue-300" />
                        </div>

                        <div className="space-y-4">
                            <input
                                name="brokerProvider"
                                defaultValue={
                                    account.brokerProvider || ""
                                }
                                placeholder={t.form.brokerProviderPlaceholder}
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />

                            <input
                                name="brokerAccountId"
                                defaultValue={
                                    account.brokerAccountId || ""
                                }
                                placeholder={t.form.brokerAccountIdPlaceholder}
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-accent/20  param($m) $m.Value -replace 'green-500', 'accent'  p-6">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
                            <KeyRound size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-accent">
                                {t.form.connectorSetup}
                            </p>

                            <h2 className="mt-1 text-2xl font-black text-white">
                                {t.form.connectionDetails}
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                                {t.form.connectionDescription}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                {t.form.tradingAccountId}
                            </p>

                            <p className="mt-3 break-all font-mono text-sm font-bold text-white">
                                {account.id}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                {t.form.syncSecret}
                            </p>

                            <p className="mt-3 text-sm font-bold text-yellow-300">
                                {t.form.syncSecretStored}
                            </p>

                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                {t.form.syncSecretDescription}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                {t.form.healthEndpoint}
                            </p>

                            <p className="mt-3 break-all font-mono text-sm font-bold text-white">
                                {healthEndpoint}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                                {t.form.importEndpoint}
                            </p>

                            <p className="mt-3 break-all font-mono text-sm font-bold text-white">
                                {importEndpoint}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-sm font-bold text-white">
                            {t.form.futureSyncFlow}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            {t.form.futureSyncDescription}
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">
                                {t.form.syncLogs}
                            </p>

                            <h2 className="mt-1 text-2xl font-black text-white">
                                {t.form.recentImportActivity}
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
                                {t.form.syncLogsDescription}
                            </p>
                        </div>

                        <Zap className="text-accent-bright" />
                    </div>

                    {recentSyncLogs.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <p className="text-sm leading-6 text-gray-400">
                                {t.form.noSyncActivity}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentSyncLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                                >
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                <span className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-300">
                                                    {log.type}
                                                </span>

                                                {log.type === "TRADE_IMPORTED" && (
                                                    <span className="rounded-xl border border-accent-bright/20 bg-accent-bright/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-bright">
                                                        {t.common.import}
                                                    </span>
                                                )}

                                                {log.type === "TRADE_SYNC_UPDATED" && (
                                                    <span className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                                                        {t.common.updated}
                                                    </span>
                                                )}

                                                {log.type === "TRADE_SYNC_ERROR" && (
                                                    <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-red-400">
                                                        {t.statuses.error}
                                                    </span>
                                                )}

                                                {log.type === "INTEGRATION_SYNC_RESET" && (
                                                    <span className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-yellow-300">
                                                        {t.common.reset}
                                                    </span>
                                                )}

                                                {log.type === "INTEGRATION_SETTINGS_UPDATED" && (
                                                    <span className="rounded-xl border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                                                        {t.common.settings}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-base font-black text-white">
                                                {log.title}
                                            </h3>

                                            {log.description && (
                                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                                    {log.description}
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            {formatDate(
                                                log.createdAt,
                                                language,
                                                t.common.never
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <Lock className="text-accent" />

                        <div>
                            <p className="text-sm text-gray-400">
                                {t.form.securityNotice}
                            </p>

                            <h2 className="text-2xl font-black text-white">
                                {t.form.noSensitiveCredentials}
                            </h2>
                        </div>
                    </div>

                    <p className="max-w-3xl text-sm leading-6 text-gray-400">
                        {t.form.securityDescription}
                    </p>
                </section>

                <input
                    type="hidden"
                    name="syncStatus"
                    value={account.syncStatus || "inactive"}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-gray-500">
                        {t.form.saveNote}
                    </p>

                    <button
                        type="submit"
                        className="rounded-2xl bg-accent px-6 py-4 font-black text-white transition hover:bg-accent-bright"
                    >
                        {t.form.saveButton}
                    </button>
                </div>
            </form>
        </div>
    );
}


