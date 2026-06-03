import {
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

export type CopilotI18nProps = {
    appLanguage?: string | null;
};

export type CopilotLabels = {
    common: {
        yes: string;
        no: string;
        stable: string;
        detected: string;
        declining: string;
        decay: string;
        volatile: string;
        online: string;
        required: string;
        locked: string;
        review: string;
        open: string;
        notes: string;
        signals: string;
        memories: string;
        patterns: string;
        insights: string;
        trades: string;
        score: string;
        status: string;
        confidence: string;
        execution: string;
        discipline: string;
        behavioralRisk: string;
        totalTrades: string;
        activeMemories: string;
        highRisk: string;
        tone: string;
        occurrences: string;
        updatedRecently: string;
        qualityScore: string;
    };

    statuses: Record<string, string>;

    page: {
        controlRoom: string;
        snapshotTitle: string;
        snapshotDescription: string;
        reviewTimeline: string;
        persistentReviewMemory: string;
        noReviewNotes: string;
        protectionLayer: string;
        riskSupervision: string;
        riskSupervisionDescription: string;
        aiSummary: string;
        operationalIntelligence: string;
        strategicFocus: string;
        memorySystem: string;
        activeOperationalMemory: string;
        memoryDescription: string;
        noMemories: string;
        memoryType: string;
        summaryNoData: string;
        summaryStable: string;
        summaryHighRisk: string;
        summaryDeveloping: string;
        strategicItems: string[];
    };

    components: {
        adaptiveCoaching: {
            eyebrow: string;
        };
        aiReviewEngine: {
            eyebrow: string;
            title: string;
            reviewScore: string;
            averageExecution: string;
            averageConfidence: string;
        };
        aiRiskSupervisor: {
            eyebrow: string;
            title: string;
            riskSignals: string;
            drift: string;
            execution: string;
            confidence: string;
        };
        behavioralDrift: {
            eyebrow: string;
            title: string;
            recentQuality: string;
            previousQuality: string;
            driftDetected: string;
        };
        confidenceStability: {
            eyebrow: string;
            title: string;
            recentConfidence: string;
            previousConfidence: string;
        };
        consistencyEngine: {
            eyebrow: string;
            title: string;
            consistencyScore: string;
        };
        conversation: {
            eyebrow: string;
            title: string;
            emptyMessage: string;
            placeholder: string;
            send: string;
        };
        hero: {
            eyebrow: string;
            title: string;
            description: string;
        };
        criticalAlert: {
            eyebrow: string;
            title: string;
            description: string;
        };
        dailyFeed: {
            eyebrow: string;
            title: string;
            empty: string;
        };
        elevatedRisk: {
            eyebrow: string;
            title: string;
            description: string;
        };
        emotionalStability: {
            eyebrow: string;
            title: string;
            emotionalInstability: string;
            emotionalTrades: string;
        };
        executionStability: {
            eyebrow: string;
            title: string;
            recentExecution: string;
            previousExecution: string;
        };
        mandatoryReview: {
            eyebrow: string;
            title: string;
            description: string;
            steps: {
                eyebrow: string;
                title: string;
                description: string;
            }[];
        };
        patternMemory: {
            eyebrow: string;
            title: string;
            empty: string;
        };
        performanceTimeline: {
            eyebrow: string;
            title: string;
            empty: string;
            trade: string;
        };
        recoveryChecklist: {
            eyebrow: string;
            title: string;
            items: string[];
        };
        recoveryIntelligence: {
            eyebrow: string;
            title: string;
            recoveryScore: string;
            recentWins: string;
            recentLosses: string;
        };
        recoveryStatus: {
            eyebrow: string;
            lockedMessage: string;
            reviewMessage: string;
            clearedMessage: string;
        };
        riskEscalation: {
            eyebrow: string;
            title: string;
            protectionRequired: string;
            cooldownRecommended: string;
        };
        sessionLock: {
            eyebrow: string;
            title: string;
            sessionLocked: string;
            reviewRequired: string;
        };
        tradeReview: {
            eyebrow: string;
            title: string;
            badge: string;
            latestTrade: string;
            emotionalState: string;
            empty: string;
        };
    };
};

const labels: Record<AppLanguage, CopilotLabels> = {
    it: {
        common: {
            yes: "Sì",
            no: "No",
            stable: "Stabile",
            detected: "Rilevato",
            declining: "In calo",
            decay: "Decadimento",
            volatile: "Volatile",
            online: "Online",
            required: "Richiesto",
            locked: "Bloccato",
            review: "Review",
            open: "Aperta",
            notes: "Note",
            signals: "Segnali",
            memories: "Memorie",
            patterns: "Pattern",
            insights: "Insight",
            trades: "Trade",
            score: "Score",
            status: "Stato",
            confidence: "Confidence",
            execution: "Execution",
            discipline: "Disciplina",
            behavioralRisk: "Rischio comportamentale",
            totalTrades: "Trade totali",
            activeMemories: "Memorie attive",
            highRisk: "Alto rischio",
            tone: "Tono",
            occurrences: "Occorrenze",
            updatedRecently: "Aggiornato di recente",
            qualityScore: "Quality Score",
        },
        statuses: {
            critical: "Critico",
            high: "Alto",
            medium: "Medio",
            moderate: "Moderato",
            low: "Basso",
            stable: "Stabile",
            detected: "Rilevato",
            declining: "In calo",
            decay: "Decadimento",
            volatile: "Volatile",
            protection: "Protezione",
            cooldown: "Cooldown",
            monitor: "Monitoraggio",
            locked: "Bloccato",
            review: "Review",
            open: "Aperta",
            cleared: "Libera",
            required: "Richiesto",
        },
        page: {
            controlRoom: "Copilot Control Room",
            snapshotTitle: "Snapshot intelligente dell’account",
            snapshotDescription:
                "Una lettura rapida dello stato operativo del conto: disciplina, rischio comportamentale, review e memoria attiva.",
            reviewTimeline: "Timeline review AI",
            persistentReviewMemory: "Memoria persistente delle review",
            noReviewNotes: "Nessuna review AI salvata al momento.",
            protectionLayer: "Protection Layer",
            riskSupervision: "Supervisione del rischio",
            riskSupervisionDescription:
                "Controlli dedicati a rischio, escalation, blocco sessione e recupero operativo.",
            aiSummary: "AI Summary",
            operationalIntelligence: "Intelligenza operativa",
            strategicFocus: "Focus strategico",
            memorySystem: "Sistema memoria Copilot",
            activeOperationalMemory: "Memoria operativa attiva",
            memoryDescription:
                "VOLTIS conserva pattern, rischi e punti di forza ricorrenti del tuo account per rendere il Copilot sempre più contestuale.",
            noMemories:
                "Nessuna memoria operativa attiva. Usa il Copilot dopo aver inserito trade, sessioni e review per generare pattern persistenti.",
            memoryType: "Tipo memoria",
            summaryNoData:
                "Non ci sono ancora abbastanza dati per generare una lettura intelligente del conto.",
            summaryStable:
                "VOLTIS ha rilevato una struttura operativa stabile. La disciplina rimane elevata e il rischio comportamentale appare controllato.",
            summaryHighRisk:
                "VOLTIS rileva segnali di rischio comportamentale elevato. Serve ridurre impulsività, migliorare review e proteggere execution.",
            summaryDeveloping:
                "VOLTIS rileva una struttura in sviluppo. Il focus principale è migliorare consistenza, selezione setup e stabilità decisionale.",
            strategicItems: [
                "Ridurre frequenza operativa dopo una perdita consecutiva.",
                "Proteggere qualità execution durante alta volatilità.",
                "Mantenere focus su setup ad alta probabilità.",
            ],
        },
        components: {
            adaptiveCoaching: { eyebrow: "Adaptive Coaching" },
            aiReviewEngine: {
                eyebrow: "AI Review Engine",
                title: "Analisi qualità decisionale",
                reviewScore: "Review Score",
                averageExecution: "Execution media",
                averageConfidence: "Confidence media",
            },
            aiRiskSupervisor: {
                eyebrow: "AI Risk Supervisor",
                title: "Panoramica rischio operativo",
                riskSignals: "Segnali rischio",
                drift: "Drift",
                execution: "Execution",
                confidence: "Confidence",
            },
            behavioralDrift: {
                eyebrow: "Rilevamento drift comportamentale",
                title: "Monitor decadimento qualità",
                recentQuality: "Qualità recente",
                previousQuality: "Qualità precedente",
                driftDetected: "Drift rilevato",
            },
            confidenceStability: {
                eyebrow: "Stabilità confidence",
                title: "Monitor qualità confidence",
                recentConfidence: "Confidence recente",
                previousConfidence: "Confidence precedente",
            },
            consistencyEngine: {
                eyebrow: "Consistency Engine",
                title: "Stabilità operativa",
                consistencyScore: "Consistency Score",
            },
            conversation: {
                eyebrow: "Conversazione AI",
                title: "Assistente VOLTIS",
                emptyMessage:
                    "Ciao, sono VOLTIS Copilot. Scrivimi una domanda sul tuo account, sulla tua performance o sui tuoi pattern operativi.",
                placeholder: "Chiedi a VOLTIS Copilot...",
                send: "Invia",
            },
            hero: {
                eyebrow: "VOLTIS Copilot",
                title: "AI Trading Copilot",
                description:
                    "Assistente intelligente per analizzare performance, comportamento, execution, psicologia operativa e pattern ricorrenti.",
            },
            criticalAlert: {
                eyebrow: "Allarme critico",
                title: "Escalation rischio comportamentale",
                description:
                    "VOLTIS AI ha rilevato pattern comportamentali ad alto rischio che potrebbero compromettere la stabilità operativa.",
            },
            dailyFeed: {
                eyebrow: "Daily Intelligence Feed",
                title: "Highlight operativi",
                empty: "Nessun insight operativo disponibile al momento.",
            },
            elevatedRisk: {
                eyebrow: "Rischio elevato",
                title: "Avviso comportamentale",
                description:
                    "VOLTIS rileva pattern ad alto rischio che potrebbero ridurre qualità decisionale, disciplina ed execution.",
            },
            emotionalStability: {
                eyebrow: "Stabilità emotiva",
                title: "Monitor volatilità emotiva",
                emotionalInstability: "Instabilità emotiva",
                emotionalTrades: "Trade emotivi",
            },
            executionStability: {
                eyebrow: "Stabilità execution",
                title: "Monitor qualità execution",
                recentExecution: "Execution recente",
                previousExecution: "Execution precedente",
            },
            mandatoryReview: {
                eyebrow: "Review obbligatoria",
                title: "Protocollo recovery richiesto",
                description:
                    "VOLTIS consiglia una review mentale e operativa prima di continuare. L’obiettivo è ridurre impulsività, ripristinare lucidità e proteggere qualità decisionale.",
                steps: [
                    {
                        eyebrow: "Step 1",
                        title: "Stop operativo",
                        description:
                            "Prenditi una pausa prima di valutare nuove operazioni.",
                    },
                    {
                        eyebrow: "Step 2",
                        title: "Review mentale",
                        description:
                            "Identifica stato emotivo, trigger e qualità della decisione.",
                    },
                    {
                        eyebrow: "Step 3",
                        title: "Reset execution",
                        description:
                            "Torna solo su setup chiari, pianificati e ad alta qualità.",
                    },
                ],
            },
            patternMemory: {
                eyebrow: "Memoria pattern",
                title: "Intelligenza comportamentale",
                empty: "Nessun pattern comportamentale rilevato al momento.",
            },
            performanceTimeline: {
                eyebrow: "Timeline performance AI",
                title: "Tracking evoluzione trader",
                empty: "Nessun dato disponibile per costruire la timeline AI.",
                trade: "Trade",
            },
            recoveryChecklist: {
                eyebrow: "Recovery Checklist",
                title: "Reset pre-execution",
                items: [
                    "Ho interrotto l’operatività per almeno qualche minuto.",
                    "Ho identificato se sto operando per paura, fretta o recupero.",
                    "Ho controllato se il prossimo trade rispetta il piano.",
                    "Ho accettato che non devo recuperare subito una perdita.",
                ],
            },
            recoveryIntelligence: {
                eyebrow: "AI Recovery Intelligence",
                title: "Analisi recovery dal drawdown",
                recoveryScore: "Recovery Score",
                recentWins: "Win recenti",
                recentLosses: "Loss recenti",
            },
            recoveryStatus: {
                eyebrow: "Recovery Status",
                lockedMessage:
                    "La sessione richiede protezione massima prima di continuare.",
                reviewMessage: "Completa il reset operativo prima di riprendere.",
                clearedMessage: "La sessione è stabile e non richiede recovery immediata.",
            },
            riskEscalation: {
                eyebrow: "Risk Escalation",
                title: "Protocollo protezione",
                protectionRequired: "Protezione richiesta",
                cooldownRecommended: "Cooldown consigliato",
            },
            sessionLock: {
                eyebrow: "Sistema blocco sessione",
                title: "Trading Protection Gate",
                sessionLocked: "Sessione bloccata",
                reviewRequired: "Review richiesta",
            },
            tradeReview: {
                eyebrow: "Review trade-by-trade",
                title: "Intelligence ultimo trade",
                badge: "Review AI",
                latestTrade: "Ultimo trade",
                emotionalState: "Stato emotivo",
                empty: "Nessun trade disponibile per la review AI.",
            },
        },
    },

    en: {
        common: {
            yes: "Yes", no: "No", stable: "Stable", detected: "Detected", declining: "Declining", decay: "Decay", volatile: "Volatile", online: "Online", required: "Required", locked: "Locked", review: "Review", open: "Open", notes: "Notes", signals: "Signals", memories: "Memories", patterns: "Patterns", insights: "Insights", trades: "Trades", score: "Score", status: "Status", confidence: "Confidence", execution: "Execution", discipline: "Discipline", behavioralRisk: "Behavioral Risk", totalTrades: "Total Trades", activeMemories: "Active Memories", highRisk: "High Risk", tone: "Tone", occurrences: "Occurrences", updatedRecently: "Updated recently", qualityScore: "Quality Score",
        },
        statuses: {
            critical: "Critical", high: "High", medium: "Medium", moderate: "Moderate", low: "Low", stable: "Stable", detected: "Detected", declining: "Declining", decay: "Decay", volatile: "Volatile", protection: "Protection", cooldown: "Cooldown", monitor: "Monitor", locked: "Locked", review: "Review", open: "Open", cleared: "Cleared", required: "Required",
        },
        page: {
            controlRoom: "Copilot Control Room",
            snapshotTitle: "Account Intelligence Snapshot",
            snapshotDescription: "A fast reading of the account’s operational state: discipline, behavioral risk, review and active memory.",
            reviewTimeline: "AI Review Timeline",
            persistentReviewMemory: "Persistent Review Memory",
            noReviewNotes: "No AI reviews saved yet.",
            protectionLayer: "Protection Layer",
            riskSupervision: "Risk Supervision",
            riskSupervisionDescription: "Controls dedicated to risk, escalation, session lock and operational recovery.",
            aiSummary: "AI Summary",
            operationalIntelligence: "Operational Intelligence",
            strategicFocus: "Strategic Focus",
            memorySystem: "Copilot Memory System",
            activeOperationalMemory: "Active Operational Memory",
            memoryDescription: "VOLTIS keeps recurring patterns, risks and strengths of your account to make Copilot increasingly contextual.",
            noMemories: "No active operational memory yet. Use Copilot after entering trades, sessions and reviews to generate persistent patterns.",
            memoryType: "Memory type",
            summaryNoData: "There is not enough data yet to generate an intelligent reading of the account.",
            summaryStable: "VOLTIS detected a stable operational structure. Discipline remains high and behavioral risk appears controlled.",
            summaryHighRisk: "VOLTIS detects high behavioral risk signals. Reduce impulsiveness, improve review and protect execution.",
            summaryDeveloping: "VOLTIS detects a developing structure. The main focus is improving consistency, setup selection and decision stability.",
            strategicItems: ["Reduce trading frequency after consecutive losses.", "Protect execution quality during high volatility.", "Maintain focus on high-probability setups."],
        },
        components: {} as CopilotLabels["components"],
    },
    uk: {} as CopilotLabels,
    ru: {} as CopilotLabels,
    es: {} as CopilotLabels,
    fr: {} as CopilotLabels,
    de: {} as CopilotLabels,
};

labels.en.components = {
    adaptiveCoaching: { eyebrow: "Adaptive Coaching" },
    aiReviewEngine: { eyebrow: "AI Review Engine", title: "Decision Quality Analysis", reviewScore: "Review Score", averageExecution: "Avg Execution", averageConfidence: "Avg Confidence" },
    aiRiskSupervisor: { eyebrow: "AI Risk Supervisor", title: "Operational Risk Overview", riskSignals: "Risk Signals", drift: "Drift", execution: "Execution", confidence: "Confidence" },
    behavioralDrift: { eyebrow: "Behavioral Drift Detection", title: "Quality Decay Monitor", recentQuality: "Recent Quality", previousQuality: "Previous Quality", driftDetected: "Drift Detected" },
    confidenceStability: { eyebrow: "Confidence Stability", title: "Confidence Quality Monitor", recentConfidence: "Recent Confidence", previousConfidence: "Previous Confidence" },
    consistencyEngine: { eyebrow: "Consistency Engine", title: "Operational Stability", consistencyScore: "Consistency Score" },
    conversation: { eyebrow: "AI Conversation", title: "VOLTIS Assistant", emptyMessage: "Hi, I am VOLTIS Copilot. Ask me a question about your account, performance or operational patterns.", placeholder: "Ask VOLTIS Copilot...", send: "Send" },
    hero: { eyebrow: "VOLTIS Copilot", title: "AI Trading Copilot", description: "Intelligent assistant for analyzing performance, behavior, execution, operational psychology and recurring patterns." },
    criticalAlert: { eyebrow: "Critical Alert", title: "Behavioral Risk Escalation", description: "VOLTIS AI detected high-risk behavioral patterns that could compromise operational stability." },
    dailyFeed: { eyebrow: "Daily Intelligence Feed", title: "Operational Highlights", empty: "No operational insight available right now." },
    elevatedRisk: { eyebrow: "Elevated Risk", title: "Behavioral Warning", description: "VOLTIS detects high-risk patterns that could reduce decision quality, discipline and execution." },
    emotionalStability: { eyebrow: "Emotional Stability", title: "Emotional Volatility Monitor", emotionalInstability: "Emotional Instability", emotionalTrades: "Emotional Trades" },
    executionStability: { eyebrow: "Execution Stability", title: "Execution Quality Monitor", recentExecution: "Recent Execution", previousExecution: "Previous Execution" },
    mandatoryReview: { eyebrow: "Mandatory Review", title: "Recovery Protocol Required", description: "VOLTIS recommends a mental and operational review before continuing. The goal is to reduce impulsiveness, restore clarity and protect decision quality.", steps: [{ eyebrow: "Step 1", title: "Operational stop", description: "Take a pause before evaluating new trades." }, { eyebrow: "Step 2", title: "Mental review", description: "Identify emotional state, triggers and decision quality." }, { eyebrow: "Step 3", title: "Execution reset", description: "Return only to clear, planned and high-quality setups." }] },
    patternMemory: { eyebrow: "Pattern Memory", title: "Behavioral Intelligence", empty: "No behavioral pattern detected right now." },
    performanceTimeline: { eyebrow: "AI Performance Timeline", title: "Trader Evolution Tracking", empty: "No data available to build the AI timeline.", trade: "Trade" },
    recoveryChecklist: { eyebrow: "Recovery Checklist", title: "Pre-Execution Reset", items: ["I stopped trading for at least a few minutes.", "I identified whether I am trading from fear, rush or recovery.", "I checked whether the next trade respects the plan.", "I accepted that I do not need to recover a loss immediately."] },
    recoveryIntelligence: { eyebrow: "AI Recovery Intelligence", title: "Drawdown Recovery Analysis", recoveryScore: "Recovery Score", recentWins: "Recent Wins", recentLosses: "Recent Losses" },
    recoveryStatus: { eyebrow: "Recovery Status", lockedMessage: "The session requires maximum protection before continuing.", reviewMessage: "Complete the operational reset before resuming.", clearedMessage: "The session is stable and does not require immediate recovery." },
    riskEscalation: { eyebrow: "Risk Escalation", title: "Protection Protocol", protectionRequired: "Protection Required", cooldownRecommended: "Cooldown Recommended" },
    sessionLock: { eyebrow: "Session Lock System", title: "Trading Protection Gate", sessionLocked: "Session Locked", reviewRequired: "Review Required" },
    tradeReview: { eyebrow: "Trade-by-Trade Review", title: "Latest Trade Intelligence", badge: "AI Review", latestTrade: "Latest Trade", emotionalState: "Emotional State", empty: "No trade available for AI review." },
};

function makeCopy(base: CopilotLabels, overrides: Partial<CopilotLabels>): CopilotLabels {
    return {
        ...base,
        ...overrides,
        common: { ...base.common, ...(overrides.common ?? {}) },
        statuses: { ...base.statuses, ...(overrides.statuses ?? {}) },
        page: { ...base.page, ...(overrides.page ?? {}) },
        components: {
            ...base.components,
            ...(overrides.components ?? {}),
            mandatoryReview: {
                ...base.components.mandatoryReview,
                ...(overrides.components?.mandatoryReview ?? {}),
            },
            recoveryChecklist: {
                ...base.components.recoveryChecklist,
                ...(overrides.components?.recoveryChecklist ?? {}),
            },
        },
    };
}

labels.uk = makeCopy(labels.en, {
    common: { yes: "Так", no: "Ні", stable: "Стабільно", detected: "Виявлено", declining: "Погіршується", decay: "Падіння", volatile: "Волатильно", online: "Онлайн", required: "Потрібно", locked: "Заблоковано", review: "Review", open: "Відкрито", notes: "Нотатки", signals: "Сигнали", memories: "Пам’ять", patterns: "Патерни", insights: "Інсайти", trades: "Угоди", score: "Score", status: "Статус", confidence: "Confidence", execution: "Execution", discipline: "Дисципліна", behavioralRisk: "Поведінковий ризик", totalTrades: "Усього угод", activeMemories: "Активна пам’ять", highRisk: "Високий ризик", tone: "Тон", occurrences: "Повторення", updatedRecently: "Оновлено нещодавно", qualityScore: "Quality Score" },
    statuses: { critical: "Критично", high: "Високий", medium: "Середній", moderate: "Помірний", low: "Низький", stable: "Стабільно", detected: "Виявлено", declining: "Погіршується", decay: "Падіння", volatile: "Волатильно", protection: "Захист", cooldown: "Пауза", monitor: "Моніторинг", locked: "Заблоковано", review: "Review", open: "Відкрито", cleared: "Очищено", required: "Потрібно" },
    page: { ...labels.en.page, snapshotTitle: "Інтелектуальний знімок акаунта", snapshotDescription: "Швидке читання операційного стану акаунта: дисципліна, поведінковий ризик, review і активна пам’ять.", noReviewNotes: "Поки немає збережених AI review.", riskSupervision: "Нагляд за ризиком", operationalIntelligence: "Операційна аналітика", strategicFocus: "Стратегічний фокус", activeOperationalMemory: "Активна операційна пам’ять", noMemories: "Поки немає активної операційної пам’яті.", summaryNoData: "Поки недостатньо даних для інтелектуального аналізу акаунта.", summaryStable: "VOLTIS виявив стабільну операційну структуру.", summaryHighRisk: "VOLTIS виявляє високі сигнали поведінкового ризику.", summaryDeveloping: "VOLTIS бачить структуру в розвитку.", strategicItems: ["Зменшити частоту торгівлі після серії втрат.", "Захищати якість execution під час високої волатильності.", "Тримати фокус на сетапах з високою ймовірністю."] },
});
labels.ru = makeCopy(labels.en, {
    common: { yes: "Да", no: "Нет", stable: "Стабильно", detected: "Обнаружено", declining: "Снижается", decay: "Падение", volatile: "Волатильно", online: "Онлайн", required: "Требуется", locked: "Заблокировано", review: "Review", open: "Открыто", notes: "Заметки", signals: "Сигналы", memories: "Память", patterns: "Паттерны", insights: "Инсайты", trades: "Сделки", score: "Score", status: "Статус", confidence: "Confidence", execution: "Execution", discipline: "Дисциплина", behavioralRisk: "Поведенческий риск", totalTrades: "Всего сделок", activeMemories: "Активная память", highRisk: "Высокий риск", tone: "Тон", occurrences: "Повторения", updatedRecently: "Обновлено недавно", qualityScore: "Quality Score" },
    statuses: { critical: "Критично", high: "Высокий", medium: "Средний", moderate: "Умеренный", low: "Низкий", stable: "Стабильно", detected: "Обнаружено", declining: "Снижается", decay: "Падение", volatile: "Волатильно", protection: "Защита", cooldown: "Пауза", monitor: "Мониторинг", locked: "Заблокировано", review: "Review", open: "Открыто", cleared: "Очищено", required: "Требуется" },
    page: { ...labels.en.page, snapshotTitle: "Интеллектуальный снимок аккаунта", snapshotDescription: "Быстрое чтение операционного состояния аккаунта: дисциплина, поведенческий риск, review и активная память.", noReviewNotes: "Пока нет сохраненных AI review.", riskSupervision: "Надзор за риском", operationalIntelligence: "Операционная аналитика", strategicFocus: "Стратегический фокус", activeOperationalMemory: "Активная операционная память", noMemories: "Пока нет активной операционной памяти.", summaryNoData: "Пока недостаточно данных для интеллектуального анализа аккаунта.", summaryStable: "VOLTIS выявил стабильную операционную структуру.", summaryHighRisk: "VOLTIS выявляет высокие сигналы поведенческого риска.", summaryDeveloping: "VOLTIS видит структуру в развитии.", strategicItems: ["Снизить частоту торговли после серии убытков.", "Защищать качество execution при высокой волатильности.", "Держать фокус на сетапах с высокой вероятностью."] },
});
labels.es = makeCopy(labels.en, {
    common: { yes: "Sí", no: "No", stable: "Estable", detected: "Detectado", declining: "En descenso", decay: "Deterioro", volatile: "Volátil", online: "Online", required: "Requerido", locked: "Bloqueado", review: "Review", open: "Abierto", notes: "Notas", signals: "Señales", memories: "Memorias", patterns: "Patrones", insights: "Insights", trades: "Trades", score: "Score", status: "Estado", confidence: "Confidence", execution: "Execution", discipline: "Disciplina", behavioralRisk: "Riesgo conductual", totalTrades: "Trades totales", activeMemories: "Memorias activas", highRisk: "Alto riesgo", tone: "Tono", occurrences: "Ocurrencias", updatedRecently: "Actualizado recientemente", qualityScore: "Quality Score" },
    statuses: { critical: "Crítico", high: "Alto", medium: "Medio", moderate: "Moderado", low: "Bajo", stable: "Estable", detected: "Detectado", declining: "En descenso", decay: "Deterioro", volatile: "Volátil", protection: "Protección", cooldown: "Pausa", monitor: "Monitor", locked: "Bloqueado", review: "Review", open: "Abierto", cleared: "Libre", required: "Requerido" },
    page: { ...labels.en.page, snapshotTitle: "Snapshot inteligente de la cuenta", snapshotDescription: "Lectura rápida del estado operativo: disciplina, riesgo conductual, review y memoria activa.", noReviewNotes: "Aún no hay reviews AI guardadas.", riskSupervision: "Supervisión del riesgo", operationalIntelligence: "Inteligencia operativa", strategicFocus: "Foco estratégico", activeOperationalMemory: "Memoria operativa activa", noMemories: "Aún no hay memoria operativa activa.", summaryNoData: "Todavía no hay suficientes datos para generar una lectura inteligente.", summaryStable: "VOLTIS detectó una estructura operativa estable.", summaryHighRisk: "VOLTIS detecta señales de alto riesgo conductual.", summaryDeveloping: "VOLTIS detecta una estructura en desarrollo.", strategicItems: ["Reducir la frecuencia operativa tras pérdidas consecutivas.", "Proteger la calidad de execution durante alta volatilidad.", "Mantener foco en setups de alta probabilidad."] },
});
labels.fr = makeCopy(labels.en, {
    common: { yes: "Oui", no: "Non", stable: "Stable", detected: "Détecté", declining: "En baisse", decay: "Dégradation", volatile: "Volatile", online: "En ligne", required: "Requis", locked: "Bloqué", review: "Review", open: "Ouvert", notes: "Notes", signals: "Signaux", memories: "Mémoires", patterns: "Patterns", insights: "Insights", trades: "Trades", score: "Score", status: "Statut", confidence: "Confidence", execution: "Execution", discipline: "Discipline", behavioralRisk: "Risque comportemental", totalTrades: "Trades totaux", activeMemories: "Mémoires actives", highRisk: "Risque élevé", tone: "Ton", occurrences: "Occurrences", updatedRecently: "Mis à jour récemment", qualityScore: "Quality Score" },
    statuses: { critical: "Critique", high: "Élevé", medium: "Moyen", moderate: "Modéré", low: "Faible", stable: "Stable", detected: "Détecté", declining: "En baisse", decay: "Dégradation", volatile: "Volatile", protection: "Protection", cooldown: "Pause", monitor: "Surveillance", locked: "Bloqué", review: "Review", open: "Ouvert", cleared: "Libre", required: "Requis" },
    page: { ...labels.en.page, snapshotTitle: "Snapshot intelligent du compte", snapshotDescription: "Lecture rapide de l’état opérationnel: discipline, risque comportemental, review et mémoire active.", noReviewNotes: "Aucune review AI enregistrée pour le moment.", riskSupervision: "Supervision du risque", operationalIntelligence: "Intelligence opérationnelle", strategicFocus: "Focus stratégique", activeOperationalMemory: "Mémoire opérationnelle active", noMemories: "Aucune mémoire opérationnelle active pour le moment.", summaryNoData: "Il n’y a pas encore assez de données pour générer une lecture intelligente.", summaryStable: "VOLTIS a détecté une structure opérationnelle stable.", summaryHighRisk: "VOLTIS détecte des signaux de risque comportemental élevé.", summaryDeveloping: "VOLTIS détecte une structure en développement.", strategicItems: ["Réduire la fréquence après des pertes consécutives.", "Protéger la qualité d’execution pendant forte volatilité.", "Rester concentré sur les setups à forte probabilité."] },
});
labels.de = makeCopy(labels.en, {
    common: { yes: "Ja", no: "Nein", stable: "Stabil", detected: "Erkannt", declining: "Rückläufig", decay: "Abfall", volatile: "Volatil", online: "Online", required: "Erforderlich", locked: "Gesperrt", review: "Review", open: "Offen", notes: "Notizen", signals: "Signale", memories: "Speicher", patterns: "Muster", insights: "Insights", trades: "Trades", score: "Score", status: "Status", confidence: "Confidence", execution: "Execution", discipline: "Disziplin", behavioralRisk: "Verhaltensrisiko", totalTrades: "Trades gesamt", activeMemories: "Aktive Speicher", highRisk: "Hohes Risiko", tone: "Ton", occurrences: "Vorkommen", updatedRecently: "Kürzlich aktualisiert", qualityScore: "Quality Score" },
    statuses: { critical: "Kritisch", high: "Hoch", medium: "Mittel", moderate: "Moderat", low: "Niedrig", stable: "Stabil", detected: "Erkannt", declining: "Rückläufig", decay: "Abfall", volatile: "Volatil", protection: "Schutz", cooldown: "Cooldown", monitor: "Monitor", locked: "Gesperrt", review: "Review", open: "Offen", cleared: "Freigegeben", required: "Erforderlich" },
    page: { ...labels.en.page, snapshotTitle: "Intelligenter Account-Snapshot", snapshotDescription: "Schnelle Analyse des operativen Zustands: Disziplin, Verhaltensrisiko, Review und aktiver Speicher.", noReviewNotes: "Noch keine AI Reviews gespeichert.", riskSupervision: "Risikoüberwachung", operationalIntelligence: "Operative Intelligenz", strategicFocus: "Strategischer Fokus", activeOperationalMemory: "Aktiver operativer Speicher", noMemories: "Noch kein aktiver operativer Speicher vorhanden.", summaryNoData: "Es gibt noch nicht genug Daten für eine intelligente Account-Analyse.", summaryStable: "VOLTIS hat eine stabile operative Struktur erkannt.", summaryHighRisk: "VOLTIS erkennt hohe Verhaltensrisiko-Signale.", summaryDeveloping: "VOLTIS erkennt eine Struktur in Entwicklung.", strategicItems: ["Handelsfrequenz nach aufeinanderfolgenden Verlusten reduzieren.", "Execution-Qualität bei hoher Volatilität schützen.", "Fokus auf Setups mit hoher Wahrscheinlichkeit halten."] },
});

export function getCopilotLabels(language?: string | null) {
    const appLanguage = normalizeAppLanguage(language);
    return labels[appLanguage] ?? labels.en;
}

export function getCopilotStatusLabel(
    value: string | null | undefined,
    t: CopilotLabels
) {
    if (!value) return "";

    const key = value
        .toLowerCase()
        .replaceAll(" ", "")
        .replaceAll("_", "")
        .replaceAll("-", "");

    const directKey = value.toLowerCase();

    const normalizedMap: Record<string, string> = {
        critical: "critical",
        high: "high",
        medium: "medium",
        moderate: "moderate",
        low: "low",
        stable: "stable",
        detected: "detected",
        declining: "declining",
        decay: "decay",
        volatile: "volatile",
        protection: "protection",
        cooldown: "cooldown",
        monitor: "monitor",
        locked: "locked",
        review: "review",
        open: "open",
        cleared: "cleared",
        required: "required",
        "drift detected": "detected",
        driftdetected: "detected",
        reviewrequired: "review",
    };

    const statusKey =
        normalizedMap[directKey] ?? normalizedMap[key];

    return statusKey ? t.statuses[statusKey] ?? value : value;
}

export function getBooleanLabel(value: boolean, t: CopilotLabels) {
    return value ? t.common.yes : t.common.no;
}

export function getArrayCount(value: unknown) {
    if (Array.isArray(value)) {
        return value.length;
    }

    if (typeof value === "number") {
        return value;
    }

    return 0;
}


