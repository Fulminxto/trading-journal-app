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
                "Questo account è impostato su Manual Only. I trade vengono gestiti manualmente dal Diary.",
            manualModeActive: "Manual mode active",
            automaticSyncDisabled: "Automatic sync disabled",

            mt5Label: "Pronto per MT5",
            mt5Description:
                "Questo account è pronto per ricevere trade da un futuro MT5 Connector.",
            mt5ModeActive: "MT5 mode active",
            autoSyncEnabled: "Auto sync enabled",
            mt5SourceEnabled: "MT5 source enabled",

            brokerLabel: "Pronto per Broker",
            brokerDescription:
                "Questo account è pronto per ricevere trade da una futura Broker Integration.",
            brokerModeActive: "Broker mode active",
            brokerSourceEnabled: "Broker source enabled",

            hybridLabel: "Pronto per MT5 + Broker",
            hybridDescription:
                "Questo account è pronto per ricevere trade sia da MT5 sia da Broker Integration.",
            hybridModeActive: "Hybrid mode active",

            neededLabel: "Configurazione richiesta",
            neededDescription:
                "Questo account ha una modalità sync selezionata, ma la configurazione non è ancora completa.",
            integrationModeSelected: "Integration mode selected",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Integrazioni account",
            title: "Integrazioni",
            description:
                "Configura la base per Manual, MT5, Broker e Hybrid Sync. In questa fase VOLTIS non salva password, token o API key: prepara solo la struttura sicura per la sincronizzazione.",
            back: "Torna all’Account Hub",
        },
        cards: {
            integrationMode: "Integration Mode",
            integrationModeDescription:
                "Strategia di gestione dei trade per questo account.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Controlla se l’account accetta import automatici.",
            mt5Setup: "MT5 Setup",
            mt5SetupDescription:
                "Login e server MT5 identificativi, senza credenziali sensibili.",
            lastSync: "Ultima Sync",
            lastSyncDescription:
                "Ultima sincronizzazione registrata dall’account.",
        },
        syncError: {
            eyebrow: "Errore sync rilevato",
            title: "Ultima sincronizzazione fallita",
            description:
                "VOLTIS ha rilevato un errore durante l’importazione automatica dei trade. Controlla configurazione, Account ID, secret e Sync Logs.",
            latestError: "Ultimo errore",
            resetButton: "Reset Sync",
        },
        form: {
            syncMode: "Sync mode",
            integrationStrategy: "Strategia di integrazione",
            integrationStrategyDescription:
                "Scegli come questo account dovrà gestire i trade. Manual Only mantiene solo l’inserimento manuale. MT5, Broker e Hybrid preparano il conto alla sincronizzazione automatica.",

            activation: "Attivazione",
            sources: "Sorgenti",
            autoSyncDescription:
                "Permette all’account di accettare import automatici.",
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
                "Salviamo solo provider e identificativo account. Le credenziali reali verranno aggiunte più avanti con storage sicuro.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Connector setup",
            connectionDetails: "Dettagli connessione",
            connectionDescription:
                "Questi dati serviranno per testare il futuro Expert Advisor MT5 o una futura integrazione Broker. Per ora sono informazioni di configurazione, non una connessione reale.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Salvato solo nell’ambiente server",
            syncSecretDescription:
                "Non viene mostrata in app. Verrà inserita manualmente nel connettore solo in fase di test controllato.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Future sync flow",
            futureSyncDescription:
                "Il connettore controllerà prima l’Health Check. Se VOLTIS risponde che la sync è pronta, invierà i trade chiusi all’Import Endpoint. I trade entreranno nel Diary come importati e, se necessario, in stato Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Attività import recenti",
            syncLogsDescription:
                "Qui vedrai gli ultimi eventi collegati alla sincronizzazione automatica: trade importati, impostazioni aggiornate, reset e futuri errori MT5/Broker.",
            noSyncActivity:
                "Nessuna attività sync registrata per ora. Quando un trade verrà importato da MT5 o Broker, apparirà qui.",

            securityNotice: "Avviso sicurezza",
            noSensitiveCredentials: "Nessuna credenziale sensibile salvata",
            securityDescription:
                "In questa fase VOLTIS non memorizza password MT5, API key broker, token o dati sensibili. La connessione reale verrà costruita più avanti con un sistema dedicato e protetto.",

            saveNote:
                "Salva solo impostazioni non sensibili. La sync reale verrà testata più avanti in ambiente controllato.",
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
            manual: "Тільки вручну",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "Підключено",
            pending: "В очікуванні",
            error: "Помилка",
            inactive: "Неактивно",
        },
        common: {
            enabled: "Увімкнено",
            disabled: "Вимкнено",
            configured: "Налаштовано",
            missing: "Відсутнє",
            ok: "OK",
            never: "Ніколи",
            import: "Імпорт",
            updated: "Оновлено",
            reset: "Скидання",
            settings: "Налаштування",
        },
        readiness: {
            title: "Готовність Trade Sync",

            manualLabel: "Ручний режим",
            manualDescription:
                "Цей акаунт налаштований як Manual Only. Угоди керуються вручну через Diary.",
            manualModeActive: "Ручний режим активний",
            automaticSyncDisabled: "Автоматична синхронізація вимкнена",

            mt5Label: "Готово для MT5",
            mt5Description:
                "Цей акаунт готовий отримувати угоди з майбутнього MT5 Connector.",
            mt5ModeActive: "Режим MT5 активний",
            autoSyncEnabled: "Автосинхронізація увімкнена",
            mt5SourceEnabled: "Джерело MT5 увімкнене",

            brokerLabel: "Готово для Broker",
            brokerDescription:
                "Цей акаунт готовий отримувати угоди з майбутньої Broker Integration.",
            brokerModeActive: "Режим Broker активний",
            brokerSourceEnabled: "Джерело Broker увімкнене",

            hybridLabel: "Готово для MT5 + Broker",
            hybridDescription:
                "Цей акаунт готовий отримувати угоди і з MT5, і з Broker Integration.",
            hybridModeActive: "Гібридний режим активний",

            neededLabel: "Потрібне налаштування",
            neededDescription:
                "Для цього акаунта вибрано режим синхронізації, але конфігурація ще не завершена.",
            integrationModeSelected: "Режим інтеграції вибрано",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Інтеграції акаунта",
            title: "Інтеграції",
            description:
                "Налаштуйте базу для Manual, MT5, Broker і Hybrid Sync. На цьому етапі VOLTIS не зберігає паролі, токени або API-ключі: він лише готує безпечну структуру для синхронізації.",
            back: "Назад до Account Hub",
        },
        cards: {
            integrationMode: "Режим інтеграції",
            integrationModeDescription:
                "Стратегія керування угодами для цього акаунта.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Контролює, чи приймає акаунт автоматичні імпорти.",
            mt5Setup: "Налаштування MT5",
            mt5SetupDescription:
                "Ідентифікатори логіна та сервера MT5 без чутливих даних.",
            lastSync: "Остання синхронізація",
            lastSyncDescription:
                "Остання синхронізація, зафіксована акаунтом.",
        },
        syncError: {
            eyebrow: "Виявлено помилку синхронізації",
            title: "Остання синхронізація не вдалася",
            description:
                "VOLTIS виявив помилку під час автоматичного імпорту угод. Перевірте конфігурацію, Account ID, secret і Sync Logs.",
            latestError: "Остання помилка",
            resetButton: "Скинути Sync",
        },
        form: {
            syncMode: "Режим Sync",
            integrationStrategy: "Стратегія інтеграції",
            integrationStrategyDescription:
                "Виберіть, як цей акаунт має керувати угодами. Manual Only залишає лише ручне введення. MT5, Broker і Hybrid готують акаунт до автоматичної синхронізації.",

            activation: "Активація",
            sources: "Джерела",
            autoSyncDescription:
                "Дозволяє акаунту приймати автоматичні імпорти.",
            mt5Description:
                "Вмикає джерело MT5 для майбутнього конектора.",
            brokerDescription: "Вмикає джерело Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Дані MetaTrader 5",
            mt5DetailsDescription:
                "Вводьте лише нечутливі ідентифікаційні дані. Паролі та токени не керуються VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Дані Broker",
            brokerDetailsDescription:
                "Ми зберігаємо лише провайдера та ідентифікатор акаунта. Реальні облікові дані будуть додані пізніше з безпечним зберіганням.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Налаштування конектора",
            connectionDetails: "Дані підключення",
            connectionDescription:
                "Ці дані будуть використані для тестування майбутнього MT5 Expert Advisor або майбутньої Broker інтеграції. Наразі це інформація конфігурації, а не реальне підключення.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Зберігається лише в серверному середовищі",
            syncSecretDescription:
                "Він не показується в застосунку. Його буде вручну введено в конектор лише під час контрольованого тестування.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Майбутній потік синхронізації",
            futureSyncDescription:
                "Конектор спочатку перевірить Health Check. Якщо VOLTIS відповість, що sync готовий, він відправить закриті угоди на Import Endpoint. Угоди потраплять у Diary як імпортовані та, за потреби, у статус Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Остання активність імпорту",
            syncLogsDescription:
                "Тут будуть останні події, пов’язані з автоматичною синхронізацією: імпортовані угоди, оновлені налаштування, скидання та майбутні помилки MT5/Broker.",
            noSyncActivity:
                "Поки що немає активності sync. Коли угоду буде імпортовано з MT5 або Broker, вона з’явиться тут.",

            securityNotice: "Повідомлення безпеки",
            noSensitiveCredentials: "Чутливі облікові дані не зберігаються",
            securityDescription:
                "На цьому етапі VOLTIS не зберігає паролі MT5, API-ключі брокера, токени або чутливі дані. Реальне підключення буде побудовано пізніше через спеціальну захищену систему.",

            saveNote:
                "Зберігайте лише нечутливі налаштування. Реальна синхронізація буде протестована пізніше в контрольованому середовищі.",
            saveButton: "Зберегти налаштування інтеграції",
        },
    },

    ru: {
        modes: {
            manual: "Только вручную",
            mt5: "MT5 Connector",
            broker: "Broker Integration",
            hybrid: "MT5 + Broker",
        },
        statuses: {
            connected: "Подключено",
            pending: "В ожидании",
            error: "Ошибка",
            inactive: "Неактивно",
        },
        common: {
            enabled: "Включено",
            disabled: "Выключено",
            configured: "Настроено",
            missing: "Отсутствует",
            ok: "OK",
            never: "Никогда",
            import: "Импорт",
            updated: "Обновлено",
            reset: "Сброс",
            settings: "Настройки",
        },
        readiness: {
            title: "Готовность Trade Sync",

            manualLabel: "Ручной режим",
            manualDescription:
                "Этот аккаунт настроен как Manual Only. Сделки управляются вручную через Diary.",
            manualModeActive: "Ручной режим активен",
            automaticSyncDisabled: "Автоматическая синхронизация отключена",

            mt5Label: "Готово для MT5",
            mt5Description:
                "Этот аккаунт готов получать сделки из будущего MT5 Connector.",
            mt5ModeActive: "Режим MT5 активен",
            autoSyncEnabled: "Автосинхронизация включена",
            mt5SourceEnabled: "Источник MT5 включен",

            brokerLabel: "Готово для Broker",
            brokerDescription:
                "Этот аккаунт готов получать сделки из будущей Broker Integration.",
            brokerModeActive: "Режим Broker активен",
            brokerSourceEnabled: "Источник Broker включен",

            hybridLabel: "Готово для MT5 + Broker",
            hybridDescription:
                "Этот аккаунт готов получать сделки и из MT5, и из Broker Integration.",
            hybridModeActive: "Гибридный режим активен",

            neededLabel: "Требуется настройка",
            neededDescription:
                "Для этого аккаунта выбран режим синхронизации, но конфигурация еще не завершена.",
            integrationModeSelected: "Режим интеграции выбран",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Интеграции аккаунта",
            title: "Интеграции",
            description:
                "Настройте базу для Manual, MT5, Broker и Hybrid Sync. На этом этапе VOLTIS не хранит пароли, токены или API-ключи: он только подготавливает безопасную структуру для синхронизации.",
            back: "Назад в Account Hub",
        },
        cards: {
            integrationMode: "Режим интеграции",
            integrationModeDescription:
                "Стратегия управления сделками для этого аккаунта.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Контролирует, принимает ли аккаунт автоматические импорты.",
            mt5Setup: "Настройка MT5",
            mt5SetupDescription:
                "Идентификаторы логина и сервера MT5 без чувствительных данных.",
            lastSync: "Последняя синхронизация",
            lastSyncDescription:
                "Последняя синхронизация, записанная аккаунтом.",
        },
        syncError: {
            eyebrow: "Обнаружена ошибка синхронизации",
            title: "Последняя синхронизация не удалась",
            description:
                "VOLTIS обнаружил ошибку во время автоматического импорта сделок. Проверьте конфигурацию, Account ID, secret и Sync Logs.",
            latestError: "Последняя ошибка",
            resetButton: "Сбросить Sync",
        },
        form: {
            syncMode: "Режим Sync",
            integrationStrategy: "Стратегия интеграции",
            integrationStrategyDescription:
                "Выберите, как этот аккаунт должен управлять сделками. Manual Only оставляет только ручной ввод. MT5, Broker и Hybrid подготавливают аккаунт к автоматической синхронизации.",

            activation: "Активация",
            sources: "Источники",
            autoSyncDescription:
                "Позволяет аккаунту принимать автоматические импорты.",
            mt5Description:
                "Включает источник MT5 для будущего коннектора.",
            brokerDescription: "Включает источник Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Данные MetaTrader 5",
            mt5DetailsDescription:
                "Вводите только нечувствительные идентификационные данные. Пароли и токены не управляются VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Данные Broker",
            brokerDetailsDescription:
                "Мы сохраняем только провайдера и идентификатор аккаунта. Реальные учетные данные будут добавлены позже с безопасным хранением.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Настройка коннектора",
            connectionDetails: "Данные подключения",
            connectionDescription:
                "Эти данные будут использованы для тестирования будущего MT5 Expert Advisor или будущей Broker интеграции. Сейчас это информация конфигурации, а не реальное подключение.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Хранится только в серверной среде",
            syncSecretDescription:
                "Он не отображается в приложении. Он будет вручную введен в коннектор только на этапе контролируемого тестирования.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Будущий поток синхронизации",
            futureSyncDescription:
                "Коннектор сначала проверит Health Check. Если VOLTIS ответит, что sync готов, он отправит закрытые сделки на Import Endpoint. Сделки попадут в Diary как импортированные и, при необходимости, в статус Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Последняя активность импорта",
            syncLogsDescription:
                "Здесь будут последние события, связанные с автоматической синхронизацией: импортированные сделки, обновленные настройки, сбросы и будущие ошибки MT5/Broker.",
            noSyncActivity:
                "Пока нет активности sync. Когда сделка будет импортирована из MT5 или Broker, она появится здесь.",

            securityNotice: "Уведомление безопасности",
            noSensitiveCredentials: "Чувствительные учетные данные не сохраняются",
            securityDescription:
                "На этом этапе VOLTIS не хранит пароли MT5, API-ключи брокера, токены или чувствительные данные. Реальное подключение будет построено позже через специальную защищенную систему.",

            saveNote:
                "Сохраняйте только нечувствительные настройки. Реальная синхронизация будет протестирована позже в контролируемой среде.",
            saveButton: "Сохранить настройки интеграции",
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
            title: "Preparación Trade Sync",

            manualLabel: "Modo manual",
            manualDescription:
                "Esta cuenta está configurada como Manual Only. Las operaciones se gestionan manualmente desde el Diary.",
            manualModeActive: "Modo manual activo",
            automaticSyncDisabled: "Sincronización automática desactivada",

            mt5Label: "Lista para MT5",
            mt5Description:
                "Esta cuenta está lista para recibir operaciones desde un futuro MT5 Connector.",
            mt5ModeActive: "Modo MT5 activo",
            autoSyncEnabled: "Auto sync activado",
            mt5SourceEnabled: "Fuente MT5 activada",

            brokerLabel: "Lista para Broker",
            brokerDescription:
                "Esta cuenta está lista para recibir operaciones desde una futura Broker Integration.",
            brokerModeActive: "Modo Broker activo",
            brokerSourceEnabled: "Fuente Broker activada",

            hybridLabel: "Lista para MT5 + Broker",
            hybridDescription:
                "Esta cuenta está lista para recibir operaciones tanto desde MT5 como desde Broker Integration.",
            hybridModeActive: "Modo híbrido activo",

            neededLabel: "Configuración requerida",
            neededDescription:
                "Esta cuenta tiene un modo sync seleccionado, pero la configuración aún no está completa.",
            integrationModeSelected: "Modo de integración seleccionado",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Integraciones de cuenta",
            title: "Integraciones",
            description:
                "Configura la base para Manual, MT5, Broker y Hybrid Sync. En esta fase VOLTIS no guarda contraseñas, tokens ni API keys: solo prepara la estructura segura para la sincronización.",
            back: "Volver al Account Hub",
        },
        cards: {
            integrationMode: "Modo de integración",
            integrationModeDescription:
                "Estrategia de gestión de operaciones para esta cuenta.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Controla si la cuenta acepta importaciones automáticas.",
            mt5Setup: "Configuración MT5",
            mt5SetupDescription:
                "Identificadores de login y servidor MT5, sin credenciales sensibles.",
            lastSync: "Última sync",
            lastSyncDescription:
                "Última sincronización registrada por la cuenta.",
        },
        syncError: {
            eyebrow: "Error de sync detectado",
            title: "La última sincronización falló",
            description:
                "VOLTIS detectó un error durante la importación automática de operaciones. Revisa configuración, Account ID, secret y Sync Logs.",
            latestError: "Último error",
            resetButton: "Reset Sync",
        },
        form: {
            syncMode: "Modo sync",
            integrationStrategy: "Estrategia de integración",
            integrationStrategyDescription:
                "Elige cómo esta cuenta debe gestionar las operaciones. Manual Only mantiene solo la entrada manual. MT5, Broker y Hybrid preparan la cuenta para sincronización automática.",

            activation: "Activación",
            sources: "Fuentes",
            autoSyncDescription:
                "Permite que la cuenta acepte importaciones automáticas.",
            mt5Description:
                "Activa la fuente MT5 para el futuro conector.",
            brokerDescription: "Activa la fuente Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Detalles MetaTrader 5",
            mt5DetailsDescription:
                "Introduce solo datos identificativos no sensibles. Contraseñas y tokens no son gestionados por VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Detalles Broker",
            brokerDetailsDescription:
                "Guardamos solo proveedor e identificador de cuenta. Las credenciales reales se añadirán más adelante con almacenamiento seguro.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Configuración del conector",
            connectionDetails: "Detalles de conexión",
            connectionDescription:
                "Estos datos servirán para probar el futuro Expert Advisor MT5 o una futura integración Broker. Por ahora son información de configuración, no una conexión real.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Guardado solo en el entorno servidor",
            syncSecretDescription:
                "No se muestra en la app. Se introducirá manualmente en el conector solo durante pruebas controladas.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Flujo sync futuro",
            futureSyncDescription:
                "El conector comprobará primero el Health Check. Si VOLTIS responde que la sync está lista, enviará las operaciones cerradas al Import Endpoint. Las operaciones entrarán en el Diary como importadas y, si hace falta, en estado Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Actividad reciente de importación",
            syncLogsDescription:
                "Aquí verás los últimos eventos conectados a la sincronización automática: operaciones importadas, ajustes actualizados, resets y futuros errores MT5/Broker.",
            noSyncActivity:
                "Aún no hay actividad sync registrada. Cuando una operación se importe desde MT5 o Broker, aparecerá aquí.",

            securityNotice: "Aviso de seguridad",
            noSensitiveCredentials: "No se guardan credenciales sensibles",
            securityDescription:
                "En esta fase VOLTIS no almacena contraseñas MT5, API keys de broker, tokens ni datos sensibles. La conexión real se construirá más adelante con un sistema dedicado y protegido.",

            saveNote:
                "Guarda solo ajustes no sensibles. La sync real se probará más adelante en un entorno controlado.",
            saveButton: "Guardar ajustes de integración",
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
            connected: "Connecté",
            pending: "En attente",
            error: "Erreur",
            inactive: "Inactif",
        },
        common: {
            enabled: "Activé",
            disabled: "Désactivé",
            configured: "Configuré",
            missing: "Manquant",
            ok: "OK",
            never: "Jamais",
            import: "Import",
            updated: "Mis à jour",
            reset: "Reset",
            settings: "Paramètres",
        },
        readiness: {
            title: "Préparation Trade Sync",

            manualLabel: "Mode manuel",
            manualDescription:
                "Ce compte est configuré en Manual Only. Les trades sont gérés manuellement depuis le Diary.",
            manualModeActive: "Mode manuel actif",
            automaticSyncDisabled: "Synchronisation automatique désactivée",

            mt5Label: "Prêt pour MT5",
            mt5Description:
                "Ce compte est prêt à recevoir des trades depuis un futur MT5 Connector.",
            mt5ModeActive: "Mode MT5 actif",
            autoSyncEnabled: "Auto sync activé",
            mt5SourceEnabled: "Source MT5 activée",

            brokerLabel: "Prêt pour Broker",
            brokerDescription:
                "Ce compte est prêt à recevoir des trades depuis une future Broker Integration.",
            brokerModeActive: "Mode Broker actif",
            brokerSourceEnabled: "Source Broker activée",

            hybridLabel: "Prêt pour MT5 + Broker",
            hybridDescription:
                "Ce compte est prêt à recevoir des trades depuis MT5 et Broker Integration.",
            hybridModeActive: "Mode hybride actif",

            neededLabel: "Configuration requise",
            neededDescription:
                "Ce compte a un mode sync sélectionné, mais la configuration n’est pas encore complète.",
            integrationModeSelected: "Mode d’intégration sélectionné",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Intégrations du compte",
            title: "Intégrations",
            description:
                "Configure la base pour Manual, MT5, Broker et Hybrid Sync. À ce stade VOLTIS ne stocke pas de mots de passe, tokens ou clés API : il prépare seulement la structure sécurisée pour la synchronisation.",
            back: "Retour à l’Account Hub",
        },
        cards: {
            integrationMode: "Mode d’intégration",
            integrationModeDescription:
                "Stratégie de gestion des trades pour ce compte.",
            autoSync: "Auto Sync",
            autoSyncDescription:
                "Contrôle si le compte accepte les imports automatiques.",
            mt5Setup: "Configuration MT5",
            mt5SetupDescription:
                "Identifiants login et serveur MT5, sans données sensibles.",
            lastSync: "Dernière sync",
            lastSyncDescription:
                "Dernière synchronisation enregistrée par le compte.",
        },
        syncError: {
            eyebrow: "Erreur sync détectée",
            title: "La dernière synchronisation a échoué",
            description:
                "VOLTIS a détecté une erreur pendant l’import automatique des trades. Vérifie la configuration, Account ID, secret et Sync Logs.",
            latestError: "Dernière erreur",
            resetButton: "Reset Sync",
        },
        form: {
            syncMode: "Mode sync",
            integrationStrategy: "Stratégie d’intégration",
            integrationStrategyDescription:
                "Choisis comment ce compte doit gérer les trades. Manual Only garde seulement la saisie manuelle. MT5, Broker et Hybrid préparent le compte à la synchronisation automatique.",

            activation: "Activation",
            sources: "Sources",
            autoSyncDescription:
                "Permet au compte d’accepter les imports automatiques.",
            mt5Description:
                "Active la source MT5 pour le futur connecteur.",
            brokerDescription: "Active la source Broker Integration.",

            mt5Connector: "MT5 Connector",
            mt5Details: "Détails MetaTrader 5",
            mt5DetailsDescription:
                "Saisis uniquement des données d’identification non sensibles. Les mots de passe et tokens ne sont pas gérés par VOLTIS.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Détails Broker",
            brokerDetailsDescription:
                "Nous stockons seulement le fournisseur et l’identifiant du compte. Les véritables identifiants seront ajoutés plus tard avec un stockage sécurisé.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Configuration du connecteur",
            connectionDetails: "Détails de connexion",
            connectionDescription:
                "Ces données serviront à tester le futur Expert Advisor MT5 ou une future intégration Broker. Pour l’instant ce sont des informations de configuration, pas une connexion réelle.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Stocké uniquement dans l’environnement serveur",
            syncSecretDescription:
                "Il n’est pas affiché dans l’app. Il sera saisi manuellement dans le connecteur uniquement pendant les tests contrôlés.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Flux sync futur",
            futureSyncDescription:
                "Le connecteur vérifiera d’abord le Health Check. Si VOLTIS répond que la sync est prête, il enverra les trades clôturés à l’Import Endpoint. Les trades entreront dans le Diary comme importés et, si nécessaire, avec le statut Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Activité d’import récente",
            syncLogsDescription:
                "Ici tu verras les derniers événements liés à la synchronisation automatique : trades importés, paramètres mis à jour, resets et futures erreurs MT5/Broker.",
            noSyncActivity:
                "Aucune activité sync enregistrée pour le moment. Quand un trade sera importé depuis MT5 ou Broker, il apparaîtra ici.",

            securityNotice: "Avis de sécurité",
            noSensitiveCredentials: "Aucun identifiant sensible stocké",
            securityDescription:
                "À ce stade VOLTIS ne stocke pas de mots de passe MT5, clés API broker, tokens ou données sensibles. La connexion réelle sera construite plus tard avec un système dédié et protégé.",

            saveNote:
                "Sauvegarde uniquement les paramètres non sensibles. La sync réelle sera testée plus tard dans un environnement contrôlé.",
            saveButton: "Sauvegarder les paramètres d’intégration",
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

            mt5Label: "Bereit für MT5",
            mt5Description:
                "Dieses Konto ist bereit, Trades von einem zukünftigen MT5 Connector zu empfangen.",
            mt5ModeActive: "MT5-Modus aktiv",
            autoSyncEnabled: "Auto Sync aktiviert",
            mt5SourceEnabled: "MT5-Quelle aktiviert",

            brokerLabel: "Bereit für Broker",
            brokerDescription:
                "Dieses Konto ist bereit, Trades von einer zukünftigen Broker Integration zu empfangen.",
            brokerModeActive: "Broker-Modus aktiv",
            brokerSourceEnabled: "Broker-Quelle aktiviert",

            hybridLabel: "Bereit für MT5 + Broker",
            hybridDescription:
                "Dieses Konto ist bereit, Trades sowohl von MT5 als auch von Broker Integration zu empfangen.",
            hybridModeActive: "Hybrid-Modus aktiv",

            neededLabel: "Konfiguration erforderlich",
            neededDescription:
                "Für dieses Konto wurde ein Sync-Modus ausgewählt, aber die Konfiguration ist noch nicht vollständig.",
            integrationModeSelected: "Integrationsmodus ausgewählt",
        },
        hero: {
            badge: "Trade Sync",
            eyebrow: "Konto-Integrationen",
            title: "Integrationen",
            description:
                "Konfiguriere die Basis für Manual, MT5, Broker und Hybrid Sync. In dieser Phase speichert VOLTIS keine Passwörter, Tokens oder API-Schlüssel: es bereitet nur die sichere Struktur für die Synchronisierung vor.",
            back: "Zurück zum Account Hub",
        },
        cards: {
            integrationMode: "Integrationsmodus",
            integrationModeDescription:
                "Trade-Verwaltungsstrategie für dieses Konto.",
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
                "VOLTIS hat einen Fehler beim automatischen Trade-Import erkannt. Prüfe Konfiguration, Account ID, Secret und Sync Logs.",
            latestError: "Letzter Fehler",
            resetButton: "Sync zurücksetzen",
        },
        form: {
            syncMode: "Sync-Modus",
            integrationStrategy: "Integrationsstrategie",
            integrationStrategyDescription:
                "Wähle, wie dieses Konto Trades verwalten soll. Manual Only behält nur die manuelle Eingabe. MT5, Broker und Hybrid bereiten das Konto auf automatische Synchronisierung vor.",

            activation: "Aktivierung",
            sources: "Quellen",
            autoSyncDescription:
                "Erlaubt dem Konto, automatische Importe zu akzeptieren.",
            mt5Description:
                "Aktiviert die MT5-Quelle für den zukünftigen Connector.",
            brokerDescription: "Aktiviert die Broker Integration-Quelle.",

            mt5Connector: "MT5 Connector",
            mt5Details: "MetaTrader 5 Details",
            mt5DetailsDescription:
                "Gib nur nicht sensible Identifikationsdaten ein. Passwörter und Tokens werden nicht von VOLTIS verwaltet.",
            mt5AccountLoginPlaceholder: "MT5 account login",
            mt5ServerNamePlaceholder: "MT5 server name",

            brokerIntegration: "Broker Integration",
            brokerDetails: "Broker Details",
            brokerDetailsDescription:
                "Wir speichern nur Anbieter und Konto-ID. Echte Zugangsdaten werden später mit sicherem Speicher hinzugefügt.",
            brokerProviderPlaceholder: "Broker provider",
            brokerAccountIdPlaceholder: "Broker account ID",

            connectorSetup: "Connector-Setup",
            connectionDetails: "Verbindungsdetails",
            connectionDescription:
                "Diese Daten dienen zum Testen des zukünftigen MT5 Expert Advisor oder einer zukünftigen Broker-Integration. Derzeit sind es Konfigurationsinformationen, keine echte Verbindung.",
            tradingAccountId: "Trading Account ID",
            syncSecret: "Sync Secret",
            syncSecretStored: "Nur in der Serverumgebung gespeichert",
            syncSecretDescription:
                "Es wird in der App nicht angezeigt. Es wird nur während kontrollierter Tests manuell in den Connector eingetragen.",
            healthEndpoint: "Health Check Endpoint",
            importEndpoint: "Import Endpoint",
            futureSyncFlow: "Zukünftiger Sync-Flow",
            futureSyncDescription:
                "Der Connector prüft zuerst den Health Check. Wenn VOLTIS antwortet, dass die Sync bereit ist, sendet er geschlossene Trades an den Import Endpoint. Trades gelangen als importiert ins Diary und, falls nötig, in den Status Needs Review.",

            syncLogs: "Sync Logs",
            recentImportActivity: "Aktuelle Importaktivität",
            syncLogsDescription:
                "Hier siehst du die letzten Ereignisse zur automatischen Synchronisierung: importierte Trades, aktualisierte Einstellungen, Resets und zukünftige MT5/Broker-Fehler.",
            noSyncActivity:
                "Noch keine Sync-Aktivität aufgezeichnet. Wenn ein Trade aus MT5 oder Broker importiert wird, erscheint er hier.",

            securityNotice: "Sicherheitshinweis",
            noSensitiveCredentials: "Keine sensiblen Zugangsdaten gespeichert",
            securityDescription:
                "In dieser Phase speichert VOLTIS keine MT5-Passwörter, Broker-API-Schlüssel, Tokens oder sensiblen Daten. Die echte Verbindung wird später mit einem dedizierten und geschützten System aufgebaut.",

            saveNote:
                "Speichere nur nicht sensible Einstellungen. Die echte Sync wird später in einer kontrollierten Umgebung getestet.",
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
        return "border-green-500/20 bg-green-500/10 text-green-400";
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
            tone: "border-cyan-500/20 bg-cyan-500/[0.08] text-cyan-300",
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
            tone: "border-green-500/20 bg-green-500/[0.08] text-green-400",
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

                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
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

    const brokerConfigured =
        Boolean(account.brokerProvider) &&
        Boolean(account.brokerAccountId);

    return (
        <div className="space-y-8">
            <GlobalToast status={query.toast} />

            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

                <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
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
                            <Cable className="hidden text-cyan-300 sm:block" />
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
                                        ? "text-sm font-black text-green-400"
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

                            <Settings2 className="text-cyan-300" />
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

                            <Cable className="text-green-400" />
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

                <section className="rounded-3xl border border-green-500/20 bg-green-500/[0.05] p-6">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-green-400">
                            <KeyRound size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-green-400">
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

                        <Zap className="text-cyan-300" />
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
                                                    <span className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cyan-300">
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
                                                    <span className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-green-400">
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
                        <Lock className="text-green-400" />

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
                        className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition hover:bg-green-400"
                    >
                        {t.form.saveButton}
                    </button>
                </div>
            </form>
        </div>
    );
}
