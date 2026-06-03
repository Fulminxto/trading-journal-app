import {
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

export type DashboardI18nProps = {
    appLanguage?: string | null;
};

type DashboardLabels = {
    eyebrow: string;
    description: string;
    currentEquity: string;
    totalPnl: string;
    winRate: string;
    trades: string;
};

const labels: Record<AppLanguage, DashboardLabels> = {
    it: {
        eyebrow: "VOLTIS Dashboard",
        description:
            "Performance di trading, execution tracking e analytics avanzati per monitorare crescita, disciplina e consistenza.",
        currentEquity: "Equity attuale",
        totalPnl: "PnL totale",
        winRate: "Win rate",
        trades: "Trade",
    },
    en: {
        eyebrow: "VOLTIS Dashboard",
        description:
            "Trading performance, execution tracking and advanced analytics to monitor growth, discipline and consistency.",
        currentEquity: "Current Equity",
        totalPnl: "Total PnL",
        winRate: "Win Rate",
        trades: "Trades",
    },
    uk: {
        eyebrow: "VOLTIS Dashboard",
        description:
            "Trading performance, execution tracking та розширена аналітика для контролю росту, дисципліни й стабільності.",
        currentEquity: "Поточна equity",
        totalPnl: "Загальний PnL",
        winRate: "Win rate",
        trades: "Угоди",
    },
    ru: {
        eyebrow: "VOLTIS Dashboard",
        description:
            "Trading performance, execution tracking и расширенная аналитика для контроля роста, дисциплины и стабильности.",
        currentEquity: "Текущая equity",
        totalPnl: "Общий PnL",
        winRate: "Win rate",
        trades: "Сделки",
    },
    es: {
        eyebrow: "VOLTIS Dashboard",
        description:
            "Performance de trading, execution tracking y analytics avanzados para monitorizar crecimiento, disciplina y consistencia.",
        currentEquity: "Equity actual",
        totalPnl: "PnL total",
        winRate: "Win rate",
        trades: "Trades",
    },
    fr: {
        eyebrow: "VOLTIS Dashboard",
        description:
            "Performance de trading, execution tracking et analytics avancés pour suivre croissance, discipline et consistance.",
        currentEquity: "Equity actuelle",
        totalPnl: "PnL total",
        winRate: "Win rate",
        trades: "Trades",
    },
    de: {
        eyebrow: "VOLTIS Dashboard",
        description:
            "Trading Performance, Execution Tracking und erweiterte Analytics, um Wachstum, Disziplin und Konsistenz zu überwachen.",
        currentEquity: "Aktuelle Equity",
        totalPnl: "Gesamt-PnL",
        winRate: "Win Rate",
        trades: "Trades",
    },
};

export function getDashboardLabels(
    appLanguage?: string | null
) {
    return labels[
        normalizeAppLanguage(appLanguage)
    ];
}
