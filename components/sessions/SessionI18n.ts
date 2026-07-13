import {
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

export type SessionsCopy = {
    common: {
        stable: string;
        warningsActive: string;
    };

    page: {
        workspaceBadge: string;
        titleSmall: string;
        title: string;
        description: string;
        backToAccountHub: string;

        totalSessions: string;
        totalSessionsDescription: string;
        averageScore: string;
        averageScoreDescription: string;
        reviewCompletion: string;
        reviewCompletionDescription: string;
        highQualitySessions: string;
        highQualitySessionsDescription: string;

        focusedSessions: string;
        focusedSessionsDescription: string;
        reviewedSessions: string;
        reviewedSessionsDescription: string;
        highScoreSessions: string;
        highScoreSessionsDescription: string;

        newSessionEyebrow: string;
        preMarketPlanning: string;
        preMarketDescription: string;

        titlePlaceholder: string;
        sessionTypePlaceholder: string;
        marketBiasPlaceholder: string;
        focusPlaceholder: string;
        emotionalStatePlaceholder: string;
        checklistPlaceholder: string;
        goalsPlaceholder: string;
        mistakesPlaceholder: string;
        reviewPlaceholder: string;
        finalScorePlaceholder: string;
        saveSession: string;

        sessionHistory: string;
        recentSessions: string;
        last: string;
        emptySessions: string;
        defaultSessionTitle: string;

        sessionType: string;
        emotionalState: string;
        score: string;
        marketBias: string;
        focus: string;
        goals: string;
        checklist: string;
        mistakesToAvoid: string;
        sessionReview: string;
    };

    hero: {
        badge: string;
        title: string;
        description: string;
        totalSessions: string;
        averageScore: string;
    };

    insights: {
        behaviorEyebrow: string;
        behaviorTitle: string;
        behaviorDescription: string;
        lowScoreSessions: string;
        pendingReviews: string;

        executionEyebrow: string;
        executionTitle: string;
        executionDescription: string;
        reviewRate: string;
        highQuality: string;
        weakExecution: string;

        postMarketEyebrow: string;
        postMarketTitle: string;
        reviewed: string;
        pendingReview: string;
        highScore: string;
    };

    options: {
        asia: string;
        london: string;
        newYork: string;
        overlap: string;
        calm: string;
        focused: string;
        confident: string;
        tired: string;
        stressed: string;
        impulsive: string;
    };
};

const labels: Record<AppLanguage, SessionsCopy> = {
    it: {
        common: {
            stable: "Stabile",
            warningsActive: "Avvisi attivi",
        },
        page: {
            workspaceBadge: "Session workspace",
            titleSmall: "Trading Sessions",
            title: "Plan. Execute. Review.",
            description:
                "Organizza mindset, focus, checklist e review operative. Questa pagina serve a proteggere la qualità della sessione prima e dopo il mercato.",
            backToAccountHub: "Torna alla Dashboard",

            totalSessions: "Sessioni totali",
            totalSessionsDescription:
                "Sessioni pianificate o revisionate in questo account.",
            averageScore: "Score medio",
            averageScoreDescription:
                "Media del punteggio finale registrato nelle sessioni.",
            reviewCompletion: "Review completate",
            reviewCompletionDescription:
                "Percentuale di sessioni con review post-market compilata.",
            highQualitySessions: "Sessioni di qualità",
            highQualitySessionsDescription:
                "Quota di sessioni con score operativo pari o superiore a 8/10.",

            focusedSessions: "Sessioni focalizzate",
            focusedSessionsDescription:
                "Sessioni con focus operativo dettagliato e pianificazione reale.",
            reviewedSessions: "Sessioni revisionate",
            reviewedSessionsDescription:
                "Sessioni con review post-market completata.",
            highScoreSessions: "Sessioni high score",
            highScoreSessionsDescription:
                "Sessioni con execution score superiore a 8/10.",

            newSessionEyebrow: "Nuova sessione",
            preMarketPlanning: "Pre Market Planning",
            preMarketDescription:
                "Compila il piano prima della sessione e usa la review finale per trasformare l’esecuzione in feedback reale.",

            titlePlaceholder: "Titolo sessione",
            sessionTypePlaceholder: "Tipo sessione",
            marketBiasPlaceholder: "Market Bias",
            focusPlaceholder: "Focus del giorno",
            emotionalStatePlaceholder: "Stato emotivo",
            checklistPlaceholder: "Checklist",
            goalsPlaceholder: "Obiettivi",
            mistakesPlaceholder: "Errori da evitare",
            reviewPlaceholder: "Review finale",
            finalScorePlaceholder: "Final Score (1-10)",
            saveSession: "Salva sessione",

            sessionHistory: "Storico sessioni",
            recentSessions: "Sessioni recenti",
            last: "Ultima",
            emptySessions: "Nessuna sessione registrata.",
            defaultSessionTitle: "Trading Session",

            sessionType: "Tipo sessione",
            emotionalState: "Stato emotivo",
            score: "Score",
            marketBias: "Market Bias",
            focus: "Focus",
            goals: "Obiettivi",
            checklist: "Checklist",
            mistakesToAvoid: "Errori da evitare",
            sessionReview: "Review sessione",
        },
        hero: {
            badge: "VOLTIS Sessions",
            title: "Trading Sessions",
            description:
                "Pianificazione pre-market, execution review e psychology tracking per costruire disciplina e consistenza operativa.",
            totalSessions: "Sessioni totali",
            averageScore: "Score medio",
        },
        insights: {
            behaviorEyebrow: "Behavior Intelligence",
            behaviorTitle: "Avvisi disciplina",
            behaviorDescription:
                "VOLTIS monitora disciplina, review post-market e consistenza operativa per identificare comportamenti che possono ridurre la performance nel lungo periodo.",
            lowScoreSessions: "Sessioni low score",
            pendingReviews: "Review mancanti",

            executionEyebrow: "Execution Intelligence",
            executionTitle: "Qualità esecutiva",
            executionDescription:
                "Questa sezione misura la qualità dell’esecuzione e quanto il trader sta realmente completando il ciclo: pianificazione, esecuzione e review.",
            reviewRate: "Review rate",
            highQuality: "Alta qualità",
            weakExecution: "Esecuzione debole",

            postMarketEyebrow: "Post Market Intelligence",
            postMarketTitle: "Disciplina review",
            reviewed: "Revisionate",
            pendingReview: "Review mancanti",
            highScore: "High score",
        },
        options: {
            asia: "Asia",
            london: "Londra",
            newYork: "New York",
            overlap: "Overlap",
            calm: "Calmo",
            focused: "Focalizzato",
            confident: "Sicuro",
            tired: "Stanco",
            stressed: "Stressato",
            impulsive: "Impulsivo",
        },
    },

    en: {
        common: {
            stable: "Stable",
            warningsActive: "Warnings Active",
        },
        page: {
            workspaceBadge: "Session workspace",
            titleSmall: "Trading Sessions",
            title: "Plan. Execute. Review.",
            description:
                "Organize mindset, focus, checklist and operational reviews. This page protects session quality before and after the market.",
            backToAccountHub: "Back to Dashboard",

            totalSessions: "Total Sessions",
            totalSessionsDescription:
                "Sessions planned or reviewed in this account.",
            averageScore: "Average Score",
            averageScoreDescription:
                "Average final score recorded across sessions.",
            reviewCompletion: "Review Completion",
            reviewCompletionDescription:
                "Percentage of sessions with completed post-market review.",
            highQualitySessions: "High Quality Sessions",
            highQualitySessionsDescription:
                "Share of sessions with an operational score equal to or above 8/10.",

            focusedSessions: "Focused Sessions",
            focusedSessionsDescription:
                "Sessions with detailed operational focus and real planning.",
            reviewedSessions: "Reviewed Sessions",
            reviewedSessionsDescription:
                "Sessions with completed post-market review.",
            highScoreSessions: "High Score Sessions",
            highScoreSessionsDescription:
                "Sessions with execution score above 8/10.",

            newSessionEyebrow: "New session",
            preMarketPlanning: "Pre Market Planning",
            preMarketDescription:
                "Complete the plan before the session and use the final review to turn execution into real feedback.",

            titlePlaceholder: "Session title",
            sessionTypePlaceholder: "Session Type",
            marketBiasPlaceholder: "Market Bias",
            focusPlaceholder: "Daily focus",
            emotionalStatePlaceholder: "Emotional State",
            checklistPlaceholder: "Checklist",
            goalsPlaceholder: "Goals",
            mistakesPlaceholder: "Mistakes to avoid",
            reviewPlaceholder: "Final review",
            finalScorePlaceholder: "Final Score (1-10)",
            saveSession: "Save session",

            sessionHistory: "Session history",
            recentSessions: "Recent Sessions",
            last: "Last",
            emptySessions: "No sessions recorded.",
            defaultSessionTitle: "Trading Session",

            sessionType: "Session Type",
            emotionalState: "Emotional State",
            score: "Score",
            marketBias: "Market Bias",
            focus: "Focus",
            goals: "Goals",
            checklist: "Checklist",
            mistakesToAvoid: "Mistakes To Avoid",
            sessionReview: "Session Review",
        },
        hero: {
            badge: "VOLTIS Sessions",
            title: "Trading Sessions",
            description:
                "Pre-market planning, execution review and psychology tracking to build discipline and operational consistency.",
            totalSessions: "Total Sessions",
            averageScore: "Average Score",
        },
        insights: {
            behaviorEyebrow: "Behavior Intelligence",
            behaviorTitle: "Discipline Warnings",
            behaviorDescription:
                "VOLTIS monitors discipline, post-market reviews and operational consistency to identify behaviors that can reduce long-term performance.",
            lowScoreSessions: "Low Score Sessions",
            pendingReviews: "Pending Reviews",

            executionEyebrow: "Execution Intelligence",
            executionTitle: "Execution Quality",
            executionDescription:
                "This section measures execution quality and how much the trader is completing the real cycle: planning, execution and review.",
            reviewRate: "Review Rate",
            highQuality: "High Quality",
            weakExecution: "Weak Execution",

            postMarketEyebrow: "Post Market Intelligence",
            postMarketTitle: "Review Discipline",
            reviewed: "Reviewed",
            pendingReview: "Pending Review",
            highScore: "High Score",
        },
        options: {
            asia: "Asia",
            london: "London",
            newYork: "New York",
            overlap: "Overlap",
            calm: "Calm",
            focused: "Focused",
            confident: "Confident",
            tired: "Tired",
            stressed: "Stressed",
            impulsive: "Impulsive",
        },
    },

    uk: {
        common: {
            stable: "Стабільно",
            warningsActive: "Активні попередження",
        },
        page: {
            workspaceBadge: "Робочий простір сесії",
            titleSmall: "Торгові сесії",
            title: "Плануй. Виконуй. Аналізуй.",
            description:
                "Організуй мислення, фокус, чеклист і операційні review. Ця сторінка допомагає захищати якість сесії до і після ринку.",
            backToAccountHub: "Назад до Dashboard",

            totalSessions: "Усього сесій",
            totalSessionsDescription:
                "Сесії, заплановані або переглянуті в цьому акаунті.",
            averageScore: "Середній бал",
            averageScoreDescription:
                "Середній фінальний бал, зафіксований у сесіях.",
            reviewCompletion: "Завершення review",
            reviewCompletionDescription:
                "Відсоток сесій із заповненим post-market review.",
            highQualitySessions: "Сесії високої якості",
            highQualitySessionsDescription:
                "Частка сесій з операційним балом 8/10 або вище.",

            focusedSessions: "Сфокусовані сесії",
            focusedSessionsDescription:
                "Сесії з детальним операційним фокусом і реальним плануванням.",
            reviewedSessions: "Переглянуті сесії",
            reviewedSessionsDescription:
                "Сесії із завершеним post-market review.",
            highScoreSessions: "Сесії з високим балом",
            highScoreSessionsDescription:
                "Сесії з execution score вище 8/10.",

            newSessionEyebrow: "Нова сесія",
            preMarketPlanning: "Pre Market Planning",
            preMarketDescription:
                "Заповни план перед сесією і використай фінальне review, щоб перетворити виконання на реальний feedback.",

            titlePlaceholder: "Назва сесії",
            sessionTypePlaceholder: "Тип сесії",
            marketBiasPlaceholder: "Market Bias",
            focusPlaceholder: "Фокус дня",
            emotionalStatePlaceholder: "Емоційний стан",
            checklistPlaceholder: "Чеклист",
            goalsPlaceholder: "Цілі",
            mistakesPlaceholder: "Помилки, яких уникати",
            reviewPlaceholder: "Фінальне review",
            finalScorePlaceholder: "Фінальний бал (1-10)",
            saveSession: "Зберегти сесію",

            sessionHistory: "Історія сесій",
            recentSessions: "Останні сесії",
            last: "Остання",
            emptySessions: "Сесій ще немає.",
            defaultSessionTitle: "Торгова сесія",

            sessionType: "Тип сесії",
            emotionalState: "Емоційний стан",
            score: "Бал",
            marketBias: "Market Bias",
            focus: "Фокус",
            goals: "Цілі",
            checklist: "Чеклист",
            mistakesToAvoid: "Помилки, яких уникати",
            sessionReview: "Review сесії",
        },
        hero: {
            badge: "VOLTIS Sessions",
            title: "Торгові сесії",
            description:
                "Планування до ринку, review виконання і відстеження психології для побудови дисципліни та операційної стабільності.",
            totalSessions: "Усього сесій",
            averageScore: "Середній бал",
        },
        insights: {
            behaviorEyebrow: "Behavior Intelligence",
            behaviorTitle: "Попередження дисципліни",
            behaviorDescription:
                "VOLTIS відстежує дисципліну, post-market review і операційну стабільність, щоб виявляти поведінку, яка може знижувати довгострокову performance.",
            lowScoreSessions: "Сесії з низьким балом",
            pendingReviews: "Незавершені review",

            executionEyebrow: "Execution Intelligence",
            executionTitle: "Якість виконання",
            executionDescription:
                "Ця секція вимірює якість виконання і те, наскільки трейдер реально завершує цикл: планування, виконання та review.",
            reviewRate: "Review rate",
            highQuality: "Висока якість",
            weakExecution: "Слабке виконання",

            postMarketEyebrow: "Post Market Intelligence",
            postMarketTitle: "Дисципліна review",
            reviewed: "Переглянуто",
            pendingReview: "Незавершені review",
            highScore: "Високий бал",
        },
        options: {
            asia: "Азія",
            london: "Лондон",
            newYork: "Нью-Йорк",
            overlap: "Overlap",
            calm: "Спокійний",
            focused: "Сфокусований",
            confident: "Впевнений",
            tired: "Втомлений",
            stressed: "У стресі",
            impulsive: "Імпульсивний",
        },
    },

    ru: {
        common: {
            stable: "Стабильно",
            warningsActive: "Предупреждения активны",
        },
        page: {
            workspaceBadge: "Рабочая зона сессии",
            titleSmall: "Торговые сессии",
            title: "Планируй. Исполняй. Анализируй.",
            description:
                "Организуй мышление, фокус, чеклист и операционные review. Эта страница помогает защищать качество сессии до и после рынка.",
            backToAccountHub: "Назад в Dashboard",

            totalSessions: "Всего сессий",
            totalSessionsDescription:
                "Сессии, запланированные или пересмотренные в этом аккаунте.",
            averageScore: "Средний балл",
            averageScoreDescription:
                "Средний финальный балл, зафиксированный в сессиях.",
            reviewCompletion: "Завершение review",
            reviewCompletionDescription:
                "Процент сессий с заполненным post-market review.",
            highQualitySessions: "Сессии высокого качества",
            highQualitySessionsDescription:
                "Доля сессий с операционным баллом 8/10 или выше.",

            focusedSessions: "Сфокусированные сессии",
            focusedSessionsDescription:
                "Сессии с детальным операционным фокусом и реальным планированием.",
            reviewedSessions: "Проверенные сессии",
            reviewedSessionsDescription:
                "Сессии с завершенным post-market review.",
            highScoreSessions: "Сессии с высоким баллом",
            highScoreSessionsDescription:
                "Сессии с execution score выше 8/10.",

            newSessionEyebrow: "Новая сессия",
            preMarketPlanning: "Pre Market Planning",
            preMarketDescription:
                "Заполни план перед сессией и используй финальное review, чтобы превратить исполнение в реальный feedback.",

            titlePlaceholder: "Название сессии",
            sessionTypePlaceholder: "Тип сессии",
            marketBiasPlaceholder: "Market Bias",
            focusPlaceholder: "Фокус дня",
            emotionalStatePlaceholder: "Эмоциональное состояние",
            checklistPlaceholder: "Чеклист",
            goalsPlaceholder: "Цели",
            mistakesPlaceholder: "Ошибки, которых избежать",
            reviewPlaceholder: "Финальное review",
            finalScorePlaceholder: "Финальный балл (1-10)",
            saveSession: "Сохранить сессию",

            sessionHistory: "История сессий",
            recentSessions: "Недавние сессии",
            last: "Последняя",
            emptySessions: "Сессии не зарегистрированы.",
            defaultSessionTitle: "Торговая сессия",

            sessionType: "Тип сессии",
            emotionalState: "Эмоциональное состояние",
            score: "Балл",
            marketBias: "Market Bias",
            focus: "Фокус",
            goals: "Цели",
            checklist: "Чеклист",
            mistakesToAvoid: "Ошибки, которых избежать",
            sessionReview: "Review сессии",
        },
        hero: {
            badge: "VOLTIS Sessions",
            title: "Торговые сессии",
            description:
                "Планирование перед рынком, review исполнения и tracking психологии для построения дисциплины и операционной стабильности.",
            totalSessions: "Всего сессий",
            averageScore: "Средний балл",
        },
        insights: {
            behaviorEyebrow: "Behavior Intelligence",
            behaviorTitle: "Предупреждения дисциплины",
            behaviorDescription:
                "VOLTIS отслеживает дисциплину, post-market review и операционную стабильность, чтобы выявлять поведение, которое может снижать долгосрочную performance.",
            lowScoreSessions: "Сессии с низким баллом",
            pendingReviews: "Незавершенные review",

            executionEyebrow: "Execution Intelligence",
            executionTitle: "Качество исполнения",
            executionDescription:
                "Эта секция измеряет качество исполнения и то, насколько трейдер реально завершает цикл: планирование, исполнение и review.",
            reviewRate: "Review rate",
            highQuality: "Высокое качество",
            weakExecution: "Слабое исполнение",

            postMarketEyebrow: "Post Market Intelligence",
            postMarketTitle: "Дисциплина review",
            reviewed: "Проверено",
            pendingReview: "Незавершенные review",
            highScore: "Высокий балл",
        },
        options: {
            asia: "Азия",
            london: "Лондон",
            newYork: "Нью-Йорк",
            overlap: "Overlap",
            calm: "Спокойный",
            focused: "Сфокусированный",
            confident: "Уверенный",
            tired: "Уставший",
            stressed: "В стрессе",
            impulsive: "Импульсивный",
        },
    },

    es: {
        common: {
            stable: "Estable",
            warningsActive: "Alertas activas",
        },
        page: {
            workspaceBadge: "Espacio de sesión",
            titleSmall: "Sesiones de trading",
            title: "Planifica. Ejecuta. Revisa.",
            description:
                "Organiza mentalidad, foco, checklist y reviews operativas. Esta página protege la calidad de la sesión antes y después del mercado.",
            backToAccountHub: "Volver al Dashboard",

            totalSessions: "Sesiones totales",
            totalSessionsDescription:
                "Sesiones planificadas o revisadas en esta cuenta.",
            averageScore: "Puntuación media",
            averageScoreDescription:
                "Media del score final registrado en las sesiones.",
            reviewCompletion: "Reviews completadas",
            reviewCompletionDescription:
                "Porcentaje de sesiones con review post-market completada.",
            highQualitySessions: "Sesiones de alta calidad",
            highQualitySessionsDescription:
                "Porcentaje de sesiones con score operativo igual o superior a 8/10.",

            focusedSessions: "Sesiones enfocadas",
            focusedSessionsDescription:
                "Sesiones con foco operativo detallado y planificación real.",
            reviewedSessions: "Sesiones revisadas",
            reviewedSessionsDescription:
                "Sesiones con review post-market completada.",
            highScoreSessions: "Sesiones high score",
            highScoreSessionsDescription:
                "Sesiones con execution score superior a 8/10.",

            newSessionEyebrow: "Nueva sesión",
            preMarketPlanning: "Pre Market Planning",
            preMarketDescription:
                "Completa el plan antes de la sesión y usa la review final para convertir la ejecución en feedback real.",

            titlePlaceholder: "Título de la sesión",
            sessionTypePlaceholder: "Tipo de sesión",
            marketBiasPlaceholder: "Market Bias",
            focusPlaceholder: "Foco del día",
            emotionalStatePlaceholder: "Estado emocional",
            checklistPlaceholder: "Checklist",
            goalsPlaceholder: "Objetivos",
            mistakesPlaceholder: "Errores a evitar",
            reviewPlaceholder: "Review final",
            finalScorePlaceholder: "Score final (1-10)",
            saveSession: "Guardar sesión",

            sessionHistory: "Historial de sesiones",
            recentSessions: "Sesiones recientes",
            last: "Última",
            emptySessions: "No hay sesiones registradas.",
            defaultSessionTitle: "Sesión de trading",

            sessionType: "Tipo de sesión",
            emotionalState: "Estado emocional",
            score: "Score",
            marketBias: "Market Bias",
            focus: "Foco",
            goals: "Objetivos",
            checklist: "Checklist",
            mistakesToAvoid: "Errores a evitar",
            sessionReview: "Review de sesión",
        },
        hero: {
            badge: "VOLTIS Sessions",
            title: "Sesiones de trading",
            description:
                "Planificación pre-market, review de ejecución y tracking psicológico para construir disciplina y consistencia operativa.",
            totalSessions: "Sesiones totales",
            averageScore: "Score medio",
        },
        insights: {
            behaviorEyebrow: "Behavior Intelligence",
            behaviorTitle: "Alertas de disciplina",
            behaviorDescription:
                "VOLTIS monitorea disciplina, reviews post-market y consistencia operativa para identificar comportamientos que pueden reducir el rendimiento a largo plazo.",
            lowScoreSessions: "Sesiones low score",
            pendingReviews: "Reviews pendientes",

            executionEyebrow: "Execution Intelligence",
            executionTitle: "Calidad de ejecución",
            executionDescription:
                "Esta sección mide la calidad de ejecución y cuánto el trader completa realmente el ciclo: planificación, ejecución y review.",
            reviewRate: "Review rate",
            highQuality: "Alta calidad",
            weakExecution: "Ejecución débil",

            postMarketEyebrow: "Post Market Intelligence",
            postMarketTitle: "Disciplina de review",
            reviewed: "Revisadas",
            pendingReview: "Reviews pendientes",
            highScore: "High score",
        },
        options: {
            asia: "Asia",
            london: "Londres",
            newYork: "Nueva York",
            overlap: "Overlap",
            calm: "Calma",
            focused: "Enfocado",
            confident: "Confiado",
            tired: "Cansado",
            stressed: "Estresado",
            impulsive: "Impulsivo",
        },
    },

    fr: {
        common: {
            stable: "Stable",
            warningsActive: "Alertes actives",
        },
        page: {
            workspaceBadge: "Espace de session",
            titleSmall: "Sessions de trading",
            title: "Planifier. Exécuter. Revoir.",
            description:
                "Organise le mindset, le focus, la checklist et les reviews opérationnelles. Cette page protège la qualité de la session avant et après le marché.",
            backToAccountHub: "Retour au Dashboard",

            totalSessions: "Sessions totales",
            totalSessionsDescription:
                "Sessions planifiées ou revues dans ce compte.",
            averageScore: "Score moyen",
            averageScoreDescription:
                "Moyenne du score final enregistré dans les sessions.",
            reviewCompletion: "Reviews complétées",
            reviewCompletionDescription:
                "Pourcentage de sessions avec review post-market complétée.",
            highQualitySessions: "Sessions de haute qualité",
            highQualitySessionsDescription:
                "Part des sessions avec un score opérationnel égal ou supérieur à 8/10.",

            focusedSessions: "Sessions focalisées",
            focusedSessionsDescription:
                "Sessions avec un focus opérationnel détaillé et une vraie planification.",
            reviewedSessions: "Sessions revues",
            reviewedSessionsDescription:
                "Sessions avec review post-market complétée.",
            highScoreSessions: "Sessions high score",
            highScoreSessionsDescription:
                "Sessions avec execution score supérieur à 8/10.",

            newSessionEyebrow: "Nouvelle session",
            preMarketPlanning: "Pre Market Planning",
            preMarketDescription:
                "Complète le plan avant la session et utilise la review finale pour transformer l’exécution en feedback réel.",

            titlePlaceholder: "Titre de session",
            sessionTypePlaceholder: "Type de session",
            marketBiasPlaceholder: "Market Bias",
            focusPlaceholder: "Focus du jour",
            emotionalStatePlaceholder: "État émotionnel",
            checklistPlaceholder: "Checklist",
            goalsPlaceholder: "Objectifs",
            mistakesPlaceholder: "Erreurs à éviter",
            reviewPlaceholder: "Review finale",
            finalScorePlaceholder: "Score final (1-10)",
            saveSession: "Enregistrer la session",

            sessionHistory: "Historique des sessions",
            recentSessions: "Sessions récentes",
            last: "Dernière",
            emptySessions: "Aucune session enregistrée.",
            defaultSessionTitle: "Session de trading",

            sessionType: "Type de session",
            emotionalState: "État émotionnel",
            score: "Score",
            marketBias: "Market Bias",
            focus: "Focus",
            goals: "Objectifs",
            checklist: "Checklist",
            mistakesToAvoid: "Erreurs à éviter",
            sessionReview: "Review de session",
        },
        hero: {
            badge: "VOLTIS Sessions",
            title: "Sessions de trading",
            description:
                "Planification pre-market, review d’exécution et tracking psychologique pour construire discipline et consistance opérationnelle.",
            totalSessions: "Sessions totales",
            averageScore: "Score moyen",
        },
        insights: {
            behaviorEyebrow: "Behavior Intelligence",
            behaviorTitle: "Alertes de discipline",
            behaviorDescription:
                "VOLTIS surveille la discipline, les reviews post-market et la consistance opérationnelle pour identifier les comportements qui peuvent réduire la performance à long terme.",
            lowScoreSessions: "Sessions low score",
            pendingReviews: "Reviews en attente",

            executionEyebrow: "Execution Intelligence",
            executionTitle: "Qualité d’exécution",
            executionDescription:
                "Cette section mesure la qualité de l’exécution et à quel point le trader complète réellement le cycle : planification, exécution et review.",
            reviewRate: "Review rate",
            highQuality: "Haute qualité",
            weakExecution: "Exécution faible",

            postMarketEyebrow: "Post Market Intelligence",
            postMarketTitle: "Discipline de review",
            reviewed: "Revues",
            pendingReview: "Reviews en attente",
            highScore: "High score",
        },
        options: {
            asia: "Asie",
            london: "Londres",
            newYork: "New York",
            overlap: "Overlap",
            calm: "Calme",
            focused: "Focalisé",
            confident: "Confiant",
            tired: "Fatigué",
            stressed: "Stressé",
            impulsive: "Impulsif",
        },
    },

    de: {
        common: {
            stable: "Stabil",
            warningsActive: "Warnungen aktiv",
        },
        page: {
            workspaceBadge: "Session-Arbeitsbereich",
            titleSmall: "Trading Sessions",
            title: "Planen. Ausführen. Überprüfen.",
            description:
                "Organisiere Mindset, Fokus, Checkliste und operative Reviews. Diese Seite schützt die Qualität der Session vor und nach dem Markt.",
            backToAccountHub: "Zurück zum Dashboard",

            totalSessions: "Sessions gesamt",
            totalSessionsDescription:
                "Geplante oder überprüfte Sessions in diesem Konto.",
            averageScore: "Durchschnittsscore",
            averageScoreDescription:
                "Durchschnittlicher finaler Score der gespeicherten Sessions.",
            reviewCompletion: "Review-Abschluss",
            reviewCompletionDescription:
                "Anteil der Sessions mit abgeschlossener Post-Market-Review.",
            highQualitySessions: "High-Quality-Sessions",
            highQualitySessionsDescription:
                "Anteil der Sessions mit operativem Score von mindestens 8/10.",

            focusedSessions: "Fokussierte Sessions",
            focusedSessionsDescription:
                "Sessions mit detailliertem operativem Fokus und echter Planung.",
            reviewedSessions: "Überprüfte Sessions",
            reviewedSessionsDescription:
                "Sessions mit abgeschlossener Post-Market-Review.",
            highScoreSessions: "High-Score-Sessions",
            highScoreSessionsDescription:
                "Sessions mit Execution Score über 8/10.",

            newSessionEyebrow: "Neue Session",
            preMarketPlanning: "Pre Market Planning",
            preMarketDescription:
                "Fülle den Plan vor der Session aus und nutze die finale Review, um Execution in echtes Feedback zu verwandeln.",

            titlePlaceholder: "Session-Titel",
            sessionTypePlaceholder: "Session-Typ",
            marketBiasPlaceholder: "Market Bias",
            focusPlaceholder: "Tagesfokus",
            emotionalStatePlaceholder: "Emotionaler Zustand",
            checklistPlaceholder: "Checkliste",
            goalsPlaceholder: "Ziele",
            mistakesPlaceholder: "Zu vermeidende Fehler",
            reviewPlaceholder: "Finale Review",
            finalScorePlaceholder: "Final Score (1-10)",
            saveSession: "Session speichern",

            sessionHistory: "Session-Verlauf",
            recentSessions: "Aktuelle Sessions",
            last: "Letzte",
            emptySessions: "Keine Sessions registriert.",
            defaultSessionTitle: "Trading Session",

            sessionType: "Session-Typ",
            emotionalState: "Emotionaler Zustand",
            score: "Score",
            marketBias: "Market Bias",
            focus: "Fokus",
            goals: "Ziele",
            checklist: "Checkliste",
            mistakesToAvoid: "Zu vermeidende Fehler",
            sessionReview: "Session Review",
        },
        hero: {
            badge: "VOLTIS Sessions",
            title: "Trading Sessions",
            description:
                "Pre-Market-Planung, Execution Review und Psychology Tracking, um Disziplin und operative Konsistenz aufzubauen.",
            totalSessions: "Sessions gesamt",
            averageScore: "Durchschnittsscore",
        },
        insights: {
            behaviorEyebrow: "Behavior Intelligence",
            behaviorTitle: "Disziplin-Warnungen",
            behaviorDescription:
                "VOLTIS überwacht Disziplin, Post-Market-Reviews und operative Konsistenz, um Verhaltensweisen zu erkennen, die die langfristige Performance reduzieren können.",
            lowScoreSessions: "Low-Score-Sessions",
            pendingReviews: "Offene Reviews",

            executionEyebrow: "Execution Intelligence",
            executionTitle: "Execution-Qualität",
            executionDescription:
                "Diese Sektion misst die Qualität der Execution und wie stark der Trader den echten Zyklus abschließt: Planung, Ausführung und Review.",
            reviewRate: "Review rate",
            highQuality: "Hohe Qualität",
            weakExecution: "Schwache Execution",

            postMarketEyebrow: "Post Market Intelligence",
            postMarketTitle: "Review-Disziplin",
            reviewed: "Reviewed",
            pendingReview: "Offene Reviews",
            highScore: "High Score",
        },
        options: {
            asia: "Asien",
            london: "London",
            newYork: "New York",
            overlap: "Overlap",
            calm: "Ruhig",
            focused: "Fokussiert",
            confident: "Selbstbewusst",
            tired: "Müde",
            stressed: "Gestresst",
            impulsive: "Impulsiv",
        },
    },
};

export function getSessionsCopy(
    language?: string | null
) {
    return labels[normalizeAppLanguage(language)];
}
