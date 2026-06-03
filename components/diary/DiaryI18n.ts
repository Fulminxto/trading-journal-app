import {
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

export type DiaryI18nProps = {
    appLanguage?: string | null;
};

type DiaryLabels = {
    adaptiveCoaching: string;
    coachLayer: string;
    mainGuidance: string;
    traderProfile: string;
    currentWeakness: string;
    warning: string;
    strongAdvice: string;
    mediumAdvice: string;
    weakAdvice: string;
    weakExecutionWarning: string;
    emotionalWarning: string;
    noCriticalWarning: string;
    coachingDescription: string;

    marketPsychology: string;
    psychologyEngine: string;
    emotionalTrades: string;
    lowConfidence: string;
    psychologyStatus: string;
    atRisk: string;
    stable: string;
    psychologyDescription: string;
};

const labels: Record<AppLanguage, DiaryLabels> = {
    it: {
        adaptiveCoaching: "Adaptive Coaching",
        coachLayer: "VOLTIS Coach Layer",
        mainGuidance: "Guida principale",
        traderProfile: "Profilo trader",
        currentWeakness: "Debolezza attuale",
        warning: "Warning",
        strongAdvice:
            "Continua a proteggere il tuo processo. Il focus ora è scalare senza perdere disciplina.",
        mediumAdvice:
            "La base è buona, ma serve più costanza. Concentrati su qualità setup e review post-trade.",
        weakAdvice:
            "Riduci complessità e rischio. Prima di aumentare performance, stabilizza esecuzione e disciplina.",
        weakExecutionWarning:
            "Hai diverse esecuzioni deboli: evita trade non pianificati e aumenta il filtro prima dell’ingresso.",
        emotionalWarning:
            "La componente emotiva è presente: monitora impulsività, FOMO e revenge trading.",
        noCriticalWarning:
            "Nessun warning critico rilevato. Continua a rispettare il processo.",
        coachingDescription:
            "Il coaching layer usa disciplina, qualità esecutiva, stato emotivo e profilo operativo per generare feedback contestuale.",

        marketPsychology: "Market Psychology",
        psychologyEngine: "Psychology Engine",
        emotionalTrades: "Trade emotivi",
        lowConfidence: "Bassa confidence",
        psychologyStatus: "Stato psicologico",
        atRisk: "A rischio",
        stable: "Stabile",
        psychologyDescription:
            "VOLTIS monitora stato emotivo, confidence e qualità dei trade per individuare rischi psicologici prima che impattino la performance.",
    },

    en: {
        adaptiveCoaching: "Adaptive Coaching",
        coachLayer: "VOLTIS Coach Layer",
        mainGuidance: "Main Guidance",
        traderProfile: "Trader Profile",
        currentWeakness: "Current Weakness",
        warning: "Warning",
        strongAdvice:
            "Keep protecting your process. The focus now is scaling without losing discipline.",
        mediumAdvice:
            "The foundation is good, but you need more consistency. Focus on setup quality and post-trade review.",
        weakAdvice:
            "Reduce complexity and risk. Before increasing performance, stabilize execution and discipline.",
        weakExecutionWarning:
            "You have several weak executions: avoid unplanned trades and increase the filter before entry.",
        emotionalWarning:
            "The emotional component is present: monitor impulsivity, FOMO and revenge trading.",
        noCriticalWarning:
            "No critical warning detected. Keep respecting the process.",
        coachingDescription:
            "The coaching layer uses discipline, execution quality, emotional state and operational profile to generate contextual feedback.",

        marketPsychology: "Market Psychology",
        psychologyEngine: "Psychology Engine",
        emotionalTrades: "Emotional Trades",
        lowConfidence: "Low Confidence",
        psychologyStatus: "Psychology Status",
        atRisk: "At Risk",
        stable: "Stable",
        psychologyDescription:
            "VOLTIS monitors emotional state, confidence and trade quality to identify psychological risks before they impact performance.",
    },

    uk: {
        adaptiveCoaching: "Адаптивний коучинг",
        coachLayer: "VOLTIS Coach Layer",
        mainGuidance: "Головна рекомендація",
        traderProfile: "Профіль трейдера",
        currentWeakness: "Поточна слабкість",
        warning: "Попередження",
        strongAdvice:
            "Продовжуйте захищати свій процес. Фокус зараз — масштабування без втрати дисципліни.",
        mediumAdvice:
            "База хороша, але потрібна більша стабільність. Сфокусуйтесь на якості сетапів і post-trade review.",
        weakAdvice:
            "Зменште складність і ризик. Перед зростанням performance стабілізуйте виконання й дисципліну.",
        weakExecutionWarning:
            "Є кілька слабких виконань: уникайте незапланованих угод і посильте фільтр перед входом.",
        emotionalWarning:
            "Емоційний компонент присутній: відстежуйте імпульсивність, FOMO та revenge trading.",
        noCriticalWarning:
            "Критичних warning не виявлено. Продовжуйте дотримуватися процесу.",
        coachingDescription:
            "Коучинг-шар використовує дисципліну, якість виконання, емоційний стан і операційний профіль для контекстного feedback.",

        marketPsychology: "Психологія ринку",
        psychologyEngine: "Psychology Engine",
        emotionalTrades: "Емоційні угоди",
        lowConfidence: "Низька confidence",
        psychologyStatus: "Психологічний стан",
        atRisk: "Під ризиком",
        stable: "Стабільно",
        psychologyDescription:
            "VOLTIS відстежує емоційний стан, confidence і якість угод, щоб виявляти психологічні ризики до того, як вони вплинуть на performance.",
    },

    ru: {
        adaptiveCoaching: "Адаптивный коучинг",
        coachLayer: "VOLTIS Coach Layer",
        mainGuidance: "Главная рекомендация",
        traderProfile: "Профиль трейдера",
        currentWeakness: "Текущая слабость",
        warning: "Предупреждение",
        strongAdvice:
            "Продолжайте защищать свой процесс. Фокус сейчас — масштабирование без потери дисциплины.",
        mediumAdvice:
            "База хорошая, но нужна большая стабильность. Сфокусируйтесь на качестве сетапов и post-trade review.",
        weakAdvice:
            "Снизьте сложность и риск. Перед ростом performance стабилизируйте исполнение и дисциплину.",
        weakExecutionWarning:
            "Есть несколько слабых исполнений: избегайте незапланированных сделок и усиливайте фильтр перед входом.",
        emotionalWarning:
            "Эмоциональный компонент присутствует: отслеживайте импульсивность, FOMO и revenge trading.",
        noCriticalWarning:
            "Критических warning не обнаружено. Продолжайте соблюдать процесс.",
        coachingDescription:
            "Коучинг-слой использует дисциплину, качество исполнения, эмоциональное состояние и операционный профиль для контекстного feedback.",

        marketPsychology: "Психология рынка",
        psychologyEngine: "Psychology Engine",
        emotionalTrades: "Эмоциональные сделки",
        lowConfidence: "Низкая confidence",
        psychologyStatus: "Психологическое состояние",
        atRisk: "Под риском",
        stable: "Стабильно",
        psychologyDescription:
            "VOLTIS отслеживает эмоциональное состояние, confidence и качество сделок, чтобы выявлять психологические риски до влияния на performance.",
    },

    es: {
        adaptiveCoaching: "Coaching adaptativo",
        coachLayer: "VOLTIS Coach Layer",
        mainGuidance: "Guía principal",
        traderProfile: "Perfil trader",
        currentWeakness: "Debilidad actual",
        warning: "Warning",
        strongAdvice:
            "Sigue protegiendo tu proceso. El foco ahora es escalar sin perder disciplina.",
        mediumAdvice:
            "La base es buena, pero necesitas más consistencia. Concéntrate en calidad de setup y review post-trade.",
        weakAdvice:
            "Reduce complejidad y riesgo. Antes de aumentar performance, estabiliza ejecución y disciplina.",
        weakExecutionWarning:
            "Tienes varias ejecuciones débiles: evita trades no planificados y aumenta el filtro antes de entrar.",
        emotionalWarning:
            "La parte emocional está presente: monitorea impulsividad, FOMO y revenge trading.",
        noCriticalWarning:
            "No se detectaron warnings críticos. Sigue respetando el proceso.",
        coachingDescription:
            "El coaching layer usa disciplina, calidad de ejecución, estado emocional y perfil operativo para generar feedback contextual.",

        marketPsychology: "Psicología de mercado",
        psychologyEngine: "Psychology Engine",
        emotionalTrades: "Trades emocionales",
        lowConfidence: "Baja confidence",
        psychologyStatus: "Estado psicológico",
        atRisk: "En riesgo",
        stable: "Estable",
        psychologyDescription:
            "VOLTIS monitorea estado emocional, confidence y calidad de trades para identificar riesgos psicológicos antes de que impacten la performance.",
    },

    fr: {
        adaptiveCoaching: "Coaching adaptatif",
        coachLayer: "VOLTIS Coach Layer",
        mainGuidance: "Guidance principale",
        traderProfile: "Profil trader",
        currentWeakness: "Faiblesse actuelle",
        warning: "Warning",
        strongAdvice:
            "Continuez à protéger votre processus. Le focus est maintenant de scaler sans perdre la discipline.",
        mediumAdvice:
            "La base est bonne, mais il faut plus de constance. Concentrez-vous sur la qualité des setups et la review post-trade.",
        weakAdvice:
            "Réduisez complexité et risque. Avant d’augmenter la performance, stabilisez l’exécution et la discipline.",
        weakExecutionWarning:
            "Vous avez plusieurs exécutions faibles : évitez les trades non planifiés et augmentez le filtre avant l’entrée.",
        emotionalWarning:
            "La composante émotionnelle est présente : surveillez impulsivité, FOMO et revenge trading.",
        noCriticalWarning:
            "Aucun warning critique détecté. Continuez à respecter le processus.",
        coachingDescription:
            "Le coaching layer utilise discipline, qualité d’exécution, état émotionnel et profil opérationnel pour générer un feedback contextuel.",

        marketPsychology: "Psychologie de marché",
        psychologyEngine: "Psychology Engine",
        emotionalTrades: "Trades émotionnels",
        lowConfidence: "Faible confidence",
        psychologyStatus: "État psychologique",
        atRisk: "À risque",
        stable: "Stable",
        psychologyDescription:
            "VOLTIS surveille l’état émotionnel, la confidence et la qualité des trades pour identifier les risques psychologiques avant qu’ils n’impactent la performance.",
    },

    de: {
        adaptiveCoaching: "Adaptives Coaching",
        coachLayer: "VOLTIS Coach Layer",
        mainGuidance: "Hauptempfehlung",
        traderProfile: "Trader-Profil",
        currentWeakness: "Aktuelle Schwäche",
        warning: "Warning",
        strongAdvice:
            "Schütze deinen Prozess weiter. Der Fokus liegt jetzt auf Skalierung ohne Disziplinverlust.",
        mediumAdvice:
            "Die Basis ist gut, aber es braucht mehr Konsistenz. Konzentriere dich auf Setup-Qualität und Post-Trade-Review.",
        weakAdvice:
            "Reduziere Komplexität und Risiko. Bevor Performance steigt, stabilisiere Execution und Disziplin.",
        weakExecutionWarning:
            "Du hast mehrere schwache Executions: vermeide ungeplante Trades und erhöhe den Filter vor dem Einstieg.",
        emotionalWarning:
            "Die emotionale Komponente ist vorhanden: beobachte Impulsivität, FOMO und Revenge Trading.",
        noCriticalWarning:
            "Keine kritische Warnung erkannt. Halte dich weiter an den Prozess.",
        coachingDescription:
            "Der Coaching Layer nutzt Disziplin, Execution-Qualität, emotionalen Zustand und operatives Profil, um kontextbezogenes Feedback zu erzeugen.",

        marketPsychology: "Marktpsychologie",
        psychologyEngine: "Psychology Engine",
        emotionalTrades: "Emotionale Trades",
        lowConfidence: "Niedrige Confidence",
        psychologyStatus: "Psychologischer Status",
        atRisk: "Gefährdet",
        stable: "Stabil",
        psychologyDescription:
            "VOLTIS überwacht emotionalen Zustand, Confidence und Trade-Qualität, um psychologische Risiken zu erkennen, bevor sie die Performance beeinflussen.",
    },
};

export function getDiaryLabels(
    appLanguage?: string | null
) {
    return labels[
        normalizeAppLanguage(appLanguage)
    ];
}
