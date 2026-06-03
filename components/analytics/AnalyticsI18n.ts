import {
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

export type AnalyticsI18nProps = {
    appLanguage?: string | null;
};

type AnalyticsLabels = {
    psychologyHeatmap: string;
    emotionalStatePerformance: string;
    noEmotionalStates: string;
    emotionalHeatmapDescription: string;

    performanceInsights: string;
    voltisIntelligence: string;
    performanceHealth: string;
    positive: string;
    defensive: string;
    positivePerformanceText: string;
    defensivePerformanceText: string;
    winRateQuality: string;
    stable: string;
    review: string;
    stableWinRateText: string;
    weakWinRateText: string;
    riskReward: string;
    healthy: string;
    weak: string;
    healthyRiskRewardText: string;
    weakRiskRewardText: string;
    marketEdge: string;
    pending: string;
    bestSymbolText: (symbol: string) => string;
    noMarketEdgeText: string;

    setupHeatmap: string;
    setupQualityPerformance: string;
    setupHeatmapDescription: string;

    performanceHeatmap: string;
    weekdayPerformance: string;
    weekdayHeatmapDescription: string;
};

const labels: Record<AppLanguage, AnalyticsLabels> = {
    it: {
        psychologyHeatmap: "Psychology Heatmap",
        emotionalStatePerformance: "Performance per stato emotivo",
        noEmotionalStates: "Nessuno stato emotivo registrato.",
        emotionalHeatmapDescription:
            "VOLTIS collega stato emotivo e performance per individuare pattern psicologici ricorrenti.",

        performanceInsights: "Performance insights",
        voltisIntelligence: "VOLTIS Intelligence",
        performanceHealth: "Salute performance",
        positive: "Positiva",
        defensive: "Difensiva",
        positivePerformanceText:
            "Il conto è in fase positiva. Mantieni focus su esecuzione e gestione rischio.",
        defensivePerformanceText:
            "Il conto è in fase negativa. Riduci esposizione e concentrati sulla qualità dei setup.",
        winRateQuality: "Qualità win rate",
        stable: "Stabile",
        review: "Review",
        stableWinRateText:
            "Il win rate è sopra la soglia base. Ora il focus è migliorare il rapporto rischio/rendimento.",
        weakWinRateText:
            "Il win rate è sotto il 50%. Analizza gli errori ricorrenti e filtra meglio gli ingressi.",
        riskReward: "Risk reward",
        healthy: "Sano",
        weak: "Debole",
        healthyRiskRewardText:
            "Il rapporto rischio/rendimento è sano. Continua a proteggere questa metrica.",
        weakRiskRewardText:
            "Il rapporto rischio/rendimento può migliorare. Evita trade con upside debole.",
        marketEdge: "Edge di mercato",
        pending: "In attesa",
        bestSymbolText: (symbol) =>
            `${symbol} sembra essere lo strumento con maggiore edge operativo.`,
        noMarketEdgeText:
            "Non ci sono ancora abbastanza dati per identificare un mercato dominante.",

        setupHeatmap: "Setup Heatmap",
        setupQualityPerformance: "Performance qualità setup",
        setupHeatmapDescription:
            "VOLTIS confronta qualità del setup e risultato economico per capire quali condizioni tecniche generano edge reale.",

        performanceHeatmap: "Performance Heatmap",
        weekdayPerformance: "Performance per giorno",
        weekdayHeatmapDescription:
            "VOLTIS visualizza le performance per giorno della settimana per identificare pattern operativi ricorrenti e giornate ad alto edge.",
    },

    en: {
        psychologyHeatmap: "Psychology Heatmap",
        emotionalStatePerformance: "Emotional State Performance",
        noEmotionalStates: "No emotional state recorded.",
        emotionalHeatmapDescription:
            "VOLTIS connects emotional state and performance to identify recurring psychological patterns.",

        performanceInsights: "Performance insights",
        voltisIntelligence: "VOLTIS Intelligence",
        performanceHealth: "Performance Health",
        positive: "Positive",
        defensive: "Defensive",
        positivePerformanceText:
            "The account is in a positive phase. Keep focus on execution and risk management.",
        defensivePerformanceText:
            "The account is in a negative phase. Reduce exposure and focus on setup quality.",
        winRateQuality: "Win Rate Quality",
        stable: "Stable",
        review: "Review",
        stableWinRateText:
            "The win rate is above the base threshold. Now focus on improving risk/reward.",
        weakWinRateText:
            "The win rate is below 50%. Analyze recurring mistakes and filter entries better.",
        riskReward: "Risk Reward",
        healthy: "Healthy",
        weak: "Weak",
        healthyRiskRewardText:
            "The risk/reward ratio is healthy. Keep protecting this metric.",
        weakRiskRewardText:
            "The risk/reward ratio can improve. Avoid trades with weak upside.",
        marketEdge: "Market Edge",
        pending: "Pending",
        bestSymbolText: (symbol) =>
            `${symbol} appears to be the instrument with the strongest operational edge.`,
        noMarketEdgeText:
            "There is not enough data yet to identify a dominant market.",

        setupHeatmap: "Setup Heatmap",
        setupQualityPerformance: "Setup Quality Performance",
        setupHeatmapDescription:
            "VOLTIS compares setup quality and economic result to understand which technical conditions generate real edge.",

        performanceHeatmap: "Performance Heatmap",
        weekdayPerformance: "Weekday Performance",
        weekdayHeatmapDescription:
            "VOLTIS visualizes performance by weekday to identify recurring operational patterns and high-edge days.",
    },

    uk: {
        psychologyHeatmap: "Теплова карта психології",
        emotionalStatePerformance: "Performance за емоційним станом",
        noEmotionalStates: "Емоційні стани ще не зареєстровані.",
        emotionalHeatmapDescription:
            "VOLTIS пов’язує емоційний стан і performance, щоб виявляти повторювані психологічні патерни.",

        performanceInsights: "Інсайти performance",
        voltisIntelligence: "VOLTIS Intelligence",
        performanceHealth: "Стан performance",
        positive: "Позитивний",
        defensive: "Захисний",
        positivePerformanceText:
            "Акаунт у позитивній фазі. Тримайте фокус на виконанні та ризик-менеджменті.",
        defensivePerformanceText:
            "Акаунт у негативній фазі. Зменште експозицію та сфокусуйтесь на якості сетапів.",
        winRateQuality: "Якість win rate",
        stable: "Стабільно",
        review: "Review",
        stableWinRateText:
            "Win rate вище базового порогу. Тепер фокус на покращенні risk/reward.",
        weakWinRateText:
            "Win rate нижче 50%. Проаналізуйте повторювані помилки та краще фільтруйте входи.",
        riskReward: "Risk reward",
        healthy: "Здоровий",
        weak: "Слабкий",
        healthyRiskRewardText:
            "Risk/reward здоровий. Продовжуйте захищати цю метрику.",
        weakRiskRewardText:
            "Risk/reward можна покращити. Уникайте угод зі слабким потенціалом.",
        marketEdge: "Ринковий edge",
        pending: "Очікується",
        bestSymbolText: (symbol) =>
            `${symbol} виглядає інструментом із найсильнішим операційним edge.`,
        noMarketEdgeText:
            "Ще недостатньо даних, щоб визначити домінуючий ринок.",

        setupHeatmap: "Теплова карта сетапів",
        setupQualityPerformance: "Performance якості сетапів",
        setupHeatmapDescription:
            "VOLTIS порівнює якість сетапу та фінансовий результат, щоб зрозуміти, які технічні умови створюють реальний edge.",

        performanceHeatmap: "Теплова карта performance",
        weekdayPerformance: "Performance за днями тижня",
        weekdayHeatmapDescription:
            "VOLTIS показує performance за днями тижня, щоб виявити повторювані операційні патерни та дні з високим edge.",
    },

    ru: {
        psychologyHeatmap: "Тепловая карта психологии",
        emotionalStatePerformance: "Performance по эмоциональному состоянию",
        noEmotionalStates: "Эмоциональные состояния еще не зарегистрированы.",
        emotionalHeatmapDescription:
            "VOLTIS связывает эмоциональное состояние и performance, чтобы выявлять повторяющиеся психологические паттерны.",

        performanceInsights: "Инсайты performance",
        voltisIntelligence: "VOLTIS Intelligence",
        performanceHealth: "Состояние performance",
        positive: "Позитивное",
        defensive: "Защитное",
        positivePerformanceText:
            "Аккаунт находится в позитивной фазе. Сохраняйте фокус на исполнении и управлении риском.",
        defensivePerformanceText:
            "Аккаунт находится в негативной фазе. Снизьте экспозицию и сфокусируйтесь на качестве сетапов.",
        winRateQuality: "Качество win rate",
        stable: "Стабильно",
        review: "Review",
        stableWinRateText:
            "Win rate выше базового порога. Теперь фокус на улучшении risk/reward.",
        weakWinRateText:
            "Win rate ниже 50%. Проанализируйте повторяющиеся ошибки и лучше фильтруйте входы.",
        riskReward: "Risk reward",
        healthy: "Здоровый",
        weak: "Слабый",
        healthyRiskRewardText:
            "Risk/reward здоровый. Продолжайте защищать эту метрику.",
        weakRiskRewardText:
            "Risk/reward можно улучшить. Избегайте сделок со слабым потенциалом.",
        marketEdge: "Рыночный edge",
        pending: "Ожидание",
        bestSymbolText: (symbol) =>
            `${symbol} выглядит инструментом с самым сильным операционным edge.`,
        noMarketEdgeText:
            "Пока недостаточно данных, чтобы определить доминирующий рынок.",

        setupHeatmap: "Тепловая карта сетапов",
        setupQualityPerformance: "Performance качества сетапов",
        setupHeatmapDescription:
            "VOLTIS сравнивает качество сетапа и финансовый результат, чтобы понять, какие технические условия создают реальный edge.",

        performanceHeatmap: "Тепловая карта performance",
        weekdayPerformance: "Performance по дням недели",
        weekdayHeatmapDescription:
            "VOLTIS показывает performance по дням недели, чтобы выявить повторяющиеся операционные паттерны и дни с высоким edge.",
    },

    es: {
        psychologyHeatmap: "Mapa de psicología",
        emotionalStatePerformance: "Performance por estado emocional",
        noEmotionalStates: "No hay estados emocionales registrados.",
        emotionalHeatmapDescription:
            "VOLTIS conecta estado emocional y performance para identificar patrones psicológicos recurrentes.",

        performanceInsights: "Insights de performance",
        voltisIntelligence: "VOLTIS Intelligence",
        performanceHealth: "Salud de performance",
        positive: "Positiva",
        defensive: "Defensiva",
        positivePerformanceText:
            "La cuenta está en una fase positiva. Mantén el foco en ejecución y gestión del riesgo.",
        defensivePerformanceText:
            "La cuenta está en una fase negativa. Reduce exposición y concéntrate en la calidad de los setups.",
        winRateQuality: "Calidad del win rate",
        stable: "Estable",
        review: "Review",
        stableWinRateText:
            "El win rate está por encima del umbral base. Ahora el foco es mejorar el risk/reward.",
        weakWinRateText:
            "El win rate está por debajo del 50%. Analiza errores recurrentes y filtra mejor las entradas.",
        riskReward: "Risk reward",
        healthy: "Sano",
        weak: "Débil",
        healthyRiskRewardText:
            "El risk/reward es sano. Sigue protegiendo esta métrica.",
        weakRiskRewardText:
            "El risk/reward puede mejorar. Evita trades con poco potencial.",
        marketEdge: "Edge de mercado",
        pending: "Pendiente",
        bestSymbolText: (symbol) =>
            `${symbol} parece ser el instrumento con mayor edge operativo.`,
        noMarketEdgeText:
            "Aún no hay suficientes datos para identificar un mercado dominante.",

        setupHeatmap: "Mapa de setups",
        setupQualityPerformance: "Performance de calidad de setup",
        setupHeatmapDescription:
            "VOLTIS compara calidad del setup y resultado económico para entender qué condiciones técnicas generan edge real.",

        performanceHeatmap: "Mapa de performance",
        weekdayPerformance: "Performance por día",
        weekdayHeatmapDescription:
            "VOLTIS visualiza la performance por día de la semana para identificar patrones operativos recurrentes y días de alto edge.",
    },

    fr: {
        psychologyHeatmap: "Heatmap psychologie",
        emotionalStatePerformance: "Performance par état émotionnel",
        noEmotionalStates: "Aucun état émotionnel enregistré.",
        emotionalHeatmapDescription:
            "VOLTIS relie état émotionnel et performance pour identifier les schémas psychologiques récurrents.",

        performanceInsights: "Insights performance",
        voltisIntelligence: "VOLTIS Intelligence",
        performanceHealth: "Santé de performance",
        positive: "Positive",
        defensive: "Défensive",
        positivePerformanceText:
            "Le compte est dans une phase positive. Gardez le focus sur l’exécution et la gestion du risque.",
        defensivePerformanceText:
            "Le compte est dans une phase négative. Réduisez l’exposition et concentrez-vous sur la qualité des setups.",
        winRateQuality: "Qualité du win rate",
        stable: "Stable",
        review: "Review",
        stableWinRateText:
            "Le win rate est au-dessus du seuil de base. Le focus est maintenant d’améliorer le risk/reward.",
        weakWinRateText:
            "Le win rate est sous 50 %. Analysez les erreurs récurrentes et filtrez mieux les entrées.",
        riskReward: "Risk reward",
        healthy: "Sain",
        weak: "Faible",
        healthyRiskRewardText:
            "Le risk/reward est sain. Continuez à protéger cette métrique.",
        weakRiskRewardText:
            "Le risk/reward peut s’améliorer. Évitez les trades avec un potentiel faible.",
        marketEdge: "Edge de marché",
        pending: "En attente",
        bestSymbolText: (symbol) =>
            `${symbol} semble être l’instrument avec le meilleur edge opérationnel.`,
        noMarketEdgeText:
            "Il n’y a pas encore assez de données pour identifier un marché dominant.",

        setupHeatmap: "Heatmap setups",
        setupQualityPerformance: "Performance qualité setup",
        setupHeatmapDescription:
            "VOLTIS compare la qualité du setup et le résultat économique pour comprendre quelles conditions techniques génèrent un edge réel.",

        performanceHeatmap: "Heatmap performance",
        weekdayPerformance: "Performance par jour",
        weekdayHeatmapDescription:
            "VOLTIS visualise la performance par jour de la semaine pour identifier les schémas opérationnels récurrents et les jours à fort edge.",
    },

    de: {
        psychologyHeatmap: "Psychologie-Heatmap",
        emotionalStatePerformance: "Performance nach emotionalem Zustand",
        noEmotionalStates: "Noch kein emotionaler Zustand erfasst.",
        emotionalHeatmapDescription:
            "VOLTIS verbindet emotionalen Zustand und Performance, um wiederkehrende psychologische Muster zu erkennen.",

        performanceInsights: "Performance Insights",
        voltisIntelligence: "VOLTIS Intelligence",
        performanceHealth: "Performance Health",
        positive: "Positiv",
        defensive: "Defensiv",
        positivePerformanceText:
            "Das Konto befindet sich in einer positiven Phase. Halte den Fokus auf Execution und Risikomanagement.",
        defensivePerformanceText:
            "Das Konto befindet sich in einer negativen Phase. Reduziere Exposure und konzentriere dich auf Setup-Qualität.",
        winRateQuality: "Win-Rate-Qualität",
        stable: "Stabil",
        review: "Review",
        stableWinRateText:
            "Die Win Rate liegt über der Basisschwelle. Der Fokus liegt nun auf besserem Risk/Reward.",
        weakWinRateText:
            "Die Win Rate liegt unter 50 %. Analysiere wiederkehrende Fehler und filtere Einstiege besser.",
        riskReward: "Risk Reward",
        healthy: "Gesund",
        weak: "Schwach",
        healthyRiskRewardText:
            "Das Risk/Reward-Verhältnis ist gesund. Schütze diese Metrik weiter.",
        weakRiskRewardText:
            "Das Risk/Reward-Verhältnis kann verbessert werden. Vermeide Trades mit schwachem Upside.",
        marketEdge: "Market Edge",
        pending: "Ausstehend",
        bestSymbolText: (symbol) =>
            `${symbol} scheint das Instrument mit dem stärksten operativen Edge zu sein.`,
        noMarketEdgeText:
            "Es gibt noch nicht genug Daten, um einen dominanten Markt zu identifizieren.",

        setupHeatmap: "Setup-Heatmap",
        setupQualityPerformance: "Setup-Qualitätsperformance",
        setupHeatmapDescription:
            "VOLTIS vergleicht Setup-Qualität und finanzielles Ergebnis, um zu verstehen, welche technischen Bedingungen echten Edge erzeugen.",

        performanceHeatmap: "Performance-Heatmap",
        weekdayPerformance: "Performance nach Wochentag",
        weekdayHeatmapDescription:
            "VOLTIS visualisiert Performance nach Wochentag, um wiederkehrende operative Muster und Tage mit hohem Edge zu erkennen.",
    },
};

export function getAnalyticsLabels(
    appLanguage?: string | null
) {
    return labels[
        normalizeAppLanguage(appLanguage)
    ];
}
