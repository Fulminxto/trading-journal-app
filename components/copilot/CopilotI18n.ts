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
            yes: "SÃ¬",
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
            snapshotTitle: "Snapshot intelligente dellâ€™account",
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
                "VOLTIS conserva pattern, rischi e punti di forza ricorrenti del tuo account per rendere il Copilot sempre piÃ¹ contestuale.",
            noMemories:
                "Nessuna memoria operativa attiva. Usa il Copilot dopo aver inserito trade, sessioni e review per generare pattern persistenti.",
            memoryType: "Tipo memoria",
            summaryNoData:
                "Non ci sono ancora abbastanza dati per generare una lettura intelligente del conto.",
            summaryStable:
                "VOLTIS ha rilevato una struttura operativa stabile. La disciplina rimane elevata e il rischio comportamentale appare controllato.",
            summaryHighRisk:
                "VOLTIS rileva segnali di rischio comportamentale elevato. Serve ridurre impulsivitÃ , migliorare review e proteggere execution.",
            summaryDeveloping:
                "VOLTIS rileva una struttura in sviluppo. Il focus principale Ã¨ migliorare consistenza, selezione setup e stabilitÃ  decisionale.",
            strategicItems: [
                "Ridurre frequenza operativa dopo una perdita consecutiva.",
                "Proteggere qualitÃ  execution durante alta volatilitÃ .",
                "Mantenere focus su setup ad alta probabilitÃ .",
            ],
        },
        components: {
            adaptiveCoaching: { eyebrow: "Adaptive Coaching" },
            aiReviewEngine: {
                eyebrow: "AI Review Engine",
                title: "Analisi qualitÃ  decisionale",
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
                title: "Monitor decadimento qualitÃ ",
                recentQuality: "QualitÃ  recente",
                previousQuality: "QualitÃ  precedente",
                driftDetected: "Drift rilevato",
            },
            confidenceStability: {
                eyebrow: "StabilitÃ  confidence",
                title: "Monitor qualitÃ  confidence",
                recentConfidence: "Confidence recente",
                previousConfidence: "Confidence precedente",
            },
            consistencyEngine: {
                eyebrow: "Consistency Engine",
                title: "StabilitÃ  operativa",
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
                    "VOLTIS AI ha rilevato pattern comportamentali ad alto rischio che potrebbero compromettere la stabilitÃ  operativa.",
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
                    "VOLTIS rileva pattern ad alto rischio che potrebbero ridurre qualitÃ  decisionale, disciplina ed execution.",
            },
            emotionalStability: {
                eyebrow: "StabilitÃ  emotiva",
                title: "Monitor volatilitÃ  emotiva",
                emotionalInstability: "InstabilitÃ  emotiva",
                emotionalTrades: "Trade emotivi",
            },
            executionStability: {
                eyebrow: "StabilitÃ  execution",
                title: "Monitor qualitÃ  execution",
                recentExecution: "Execution recente",
                previousExecution: "Execution precedente",
            },
            mandatoryReview: {
                eyebrow: "Review obbligatoria",
                title: "Protocollo recovery richiesto",
                description:
                    "VOLTIS consiglia una review mentale e operativa prima di continuare. Lâ€™obiettivo Ã¨ ridurre impulsivitÃ , ripristinare luciditÃ  e proteggere qualitÃ  decisionale.",
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
                            "Identifica stato emotivo, trigger e qualitÃ  della decisione.",
                    },
                    {
                        eyebrow: "Step 3",
                        title: "Reset execution",
                        description:
                            "Torna solo su setup chiari, pianificati e ad alta qualitÃ .",
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
                    "Ho interrotto lâ€™operativitÃ  per almeno qualche minuto.",
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
                clearedMessage: "La sessione Ã¨ stabile e non richiede recovery immediata.",
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
            snapshotDescription: "A fast reading of the accountâ€™s operational state: discipline, behavioral risk, review and active memory.",
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
    common: { yes: "Ð¢Ð°Ðº", no: "ÐÑ–", stable: "Ð¡Ñ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¾", detected: "Ð’Ð¸ÑÐ²Ð»ÐµÐ½Ð¾", declining: "ÐŸÐ¾Ð³Ñ–Ñ€ÑˆÑƒÑ”Ñ‚ÑŒÑÑ", decay: "ÐŸÐ°Ð´Ñ–Ð½Ð½Ñ", volatile: "Ð’Ð¾Ð»Ð°Ñ‚Ð¸Ð»ÑŒÐ½Ð¾", online: "ÐžÐ½Ð»Ð°Ð¹Ð½", required: "ÐŸÐ¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾", locked: "Ð—Ð°Ð±Ð»Ð¾ÐºÐ¾Ð²Ð°Ð½Ð¾", review: "Review", open: "Ð’Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ð¾", notes: "ÐÐ¾Ñ‚Ð°Ñ‚ÐºÐ¸", signals: "Ð¡Ð¸Ð³Ð½Ð°Ð»Ð¸", memories: "ÐŸÐ°Ð¼â€™ÑÑ‚ÑŒ", patterns: "ÐŸÐ°Ñ‚ÐµÑ€Ð½Ð¸", insights: "Ð†Ð½ÑÐ°Ð¹Ñ‚Ð¸", trades: "Ð£Ð³Ð¾Ð´Ð¸", score: "Score", status: "Ð¡Ñ‚Ð°Ñ‚ÑƒÑ", confidence: "Confidence", execution: "Execution", discipline: "Ð”Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ð°", behavioralRisk: "ÐŸÐ¾Ð²ÐµÐ´Ñ–Ð½ÐºÐ¾Ð²Ð¸Ð¹ Ñ€Ð¸Ð·Ð¸Ðº", totalTrades: "Ð£ÑÑŒÐ¾Ð³Ð¾ ÑƒÐ³Ð¾Ð´", activeMemories: "ÐÐºÑ‚Ð¸Ð²Ð½Ð° Ð¿Ð°Ð¼â€™ÑÑ‚ÑŒ", highRisk: "Ð’Ð¸ÑÐ¾ÐºÐ¸Ð¹ Ñ€Ð¸Ð·Ð¸Ðº", tone: "Ð¢Ð¾Ð½", occurrences: "ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€ÐµÐ½Ð½Ñ", updatedRecently: "ÐžÐ½Ð¾Ð²Ð»ÐµÐ½Ð¾ Ð½ÐµÑ‰Ð¾Ð´Ð°Ð²Ð½Ð¾", qualityScore: "Quality Score" },
    statuses: { critical: "ÐšÑ€Ð¸Ñ‚Ð¸Ñ‡Ð½Ð¾", high: "Ð’Ð¸ÑÐ¾ÐºÐ¸Ð¹", medium: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹", moderate: "ÐŸÐ¾Ð¼Ñ–Ñ€Ð½Ð¸Ð¹", low: "ÐÐ¸Ð·ÑŒÐºÐ¸Ð¹", stable: "Ð¡Ñ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¾", detected: "Ð’Ð¸ÑÐ²Ð»ÐµÐ½Ð¾", declining: "ÐŸÐ¾Ð³Ñ–Ñ€ÑˆÑƒÑ”Ñ‚ÑŒÑÑ", decay: "ÐŸÐ°Ð´Ñ–Ð½Ð½Ñ", volatile: "Ð’Ð¾Ð»Ð°Ñ‚Ð¸Ð»ÑŒÐ½Ð¾", protection: "Ð—Ð°Ñ…Ð¸ÑÑ‚", cooldown: "ÐŸÐ°ÑƒÐ·Ð°", monitor: "ÐœÐ¾Ð½Ñ–Ñ‚Ð¾Ñ€Ð¸Ð½Ð³", locked: "Ð—Ð°Ð±Ð»Ð¾ÐºÐ¾Ð²Ð°Ð½Ð¾", review: "Review", open: "Ð’Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ð¾", cleared: "ÐžÑ‡Ð¸Ñ‰ÐµÐ½Ð¾", required: "ÐŸÐ¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾" },
    page: { ...labels.en.page, snapshotTitle: "Ð†Ð½Ñ‚ÐµÐ»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¸Ð¹ Ð·Ð½Ñ–Ð¼Ð¾Ðº Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°", snapshotDescription: "Ð¨Ð²Ð¸Ð´ÐºÐµ Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¾Ð³Ð¾ ÑÑ‚Ð°Ð½Ñƒ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°: Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ð°, Ð¿Ð¾Ð²ÐµÐ´Ñ–Ð½ÐºÐ¾Ð²Ð¸Ð¹ Ñ€Ð¸Ð·Ð¸Ðº, review Ñ– Ð°ÐºÑ‚Ð¸Ð²Ð½Ð° Ð¿Ð°Ð¼â€™ÑÑ‚ÑŒ.", noReviewNotes: "ÐŸÐ¾ÐºÐ¸ Ð½ÐµÐ¼Ð°Ñ” Ð·Ð±ÐµÑ€ÐµÐ¶ÐµÐ½Ð¸Ñ… AI review.", riskSupervision: "ÐÐ°Ð³Ð»ÑÐ´ Ð·Ð° Ñ€Ð¸Ð·Ð¸ÐºÐ¾Ð¼", operationalIntelligence: "ÐžÐ¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð° Ð°Ð½Ð°Ð»Ñ–Ñ‚Ð¸ÐºÐ°", strategicFocus: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ñ–Ñ‡Ð½Ð¸Ð¹ Ñ„Ð¾ÐºÑƒÑ", activeOperationalMemory: "ÐÐºÑ‚Ð¸Ð²Ð½Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð° Ð¿Ð°Ð¼â€™ÑÑ‚ÑŒ", noMemories: "ÐŸÐ¾ÐºÐ¸ Ð½ÐµÐ¼Ð°Ñ” Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾Ñ— Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¾Ñ— Ð¿Ð°Ð¼â€™ÑÑ‚Ñ–.", summaryNoData: "ÐŸÐ¾ÐºÐ¸ Ð½ÐµÐ´Ð¾ÑÑ‚Ð°Ñ‚Ð½ÑŒÐ¾ Ð´Ð°Ð½Ð¸Ñ… Ð´Ð»Ñ Ñ–Ð½Ñ‚ÐµÐ»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ñ–Ð·Ñƒ Ð°ÐºÐ°ÑƒÐ½Ñ‚Ð°.", summaryStable: "VOLTIS Ð²Ð¸ÑÐ²Ð¸Ð² ÑÑ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ñƒ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñƒ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ.", summaryHighRisk: "VOLTIS Ð²Ð¸ÑÐ²Ð»ÑÑ” Ð²Ð¸ÑÐ¾ÐºÑ– ÑÐ¸Ð³Ð½Ð°Ð»Ð¸ Ð¿Ð¾Ð²ÐµÐ´Ñ–Ð½ÐºÐ¾Ð²Ð¾Ð³Ð¾ Ñ€Ð¸Ð·Ð¸ÐºÑƒ.", summaryDeveloping: "VOLTIS Ð±Ð°Ñ‡Ð¸Ñ‚ÑŒ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ð² Ñ€Ð¾Ð·Ð²Ð¸Ñ‚ÐºÑƒ.", strategicItems: ["Ð—Ð¼ÐµÐ½ÑˆÐ¸Ñ‚Ð¸ Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ñƒ Ñ‚Ð¾Ñ€Ð³Ñ–Ð²Ð»Ñ– Ð¿Ñ–ÑÐ»Ñ ÑÐµÑ€Ñ–Ñ— Ð²Ñ‚Ñ€Ð°Ñ‚.", "Ð—Ð°Ñ…Ð¸Ñ‰Ð°Ñ‚Ð¸ ÑÐºÑ–ÑÑ‚ÑŒ execution Ð¿Ñ–Ð´ Ñ‡Ð°Ñ Ð²Ð¸ÑÐ¾ÐºÐ¾Ñ— Ð²Ð¾Ð»Ð°Ñ‚Ð¸Ð»ÑŒÐ½Ð¾ÑÑ‚Ñ–.", "Ð¢Ñ€Ð¸Ð¼Ð°Ñ‚Ð¸ Ñ„Ð¾ÐºÑƒÑ Ð½Ð° ÑÐµÑ‚Ð°Ð¿Ð°Ñ… Ð· Ð²Ð¸ÑÐ¾ÐºÐ¾ÑŽ Ð¹Ð¼Ð¾Ð²Ñ–Ñ€Ð½Ñ–ÑÑ‚ÑŽ."] },
});
labels.ru = makeCopy(labels.en, {
    common: { yes: "Ð”Ð°", no: "ÐÐµÑ‚", stable: "Ð¡Ñ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾", detected: "ÐžÐ±Ð½Ð°Ñ€ÑƒÐ¶ÐµÐ½Ð¾", declining: "Ð¡Ð½Ð¸Ð¶Ð°ÐµÑ‚ÑÑ", decay: "ÐŸÐ°Ð´ÐµÐ½Ð¸Ðµ", volatile: "Ð’Ð¾Ð»Ð°Ñ‚Ð¸Ð»ÑŒÐ½Ð¾", online: "ÐžÐ½Ð»Ð°Ð¹Ð½", required: "Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ", locked: "Ð—Ð°Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¾", review: "Review", open: "ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ð¾", notes: "Ð—Ð°Ð¼ÐµÑ‚ÐºÐ¸", signals: "Ð¡Ð¸Ð³Ð½Ð°Ð»Ñ‹", memories: "ÐŸÐ°Ð¼ÑÑ‚ÑŒ", patterns: "ÐŸÐ°Ñ‚Ñ‚ÐµÑ€Ð½Ñ‹", insights: "Ð˜Ð½ÑÐ°Ð¹Ñ‚Ñ‹", trades: "Ð¡Ð´ÐµÐ»ÐºÐ¸", score: "Score", status: "Ð¡Ñ‚Ð°Ñ‚ÑƒÑ", confidence: "Confidence", execution: "Execution", discipline: "Ð”Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ð°", behavioralRisk: "ÐŸÐ¾Ð²ÐµÐ´ÐµÐ½Ñ‡ÐµÑÐºÐ¸Ð¹ Ñ€Ð¸ÑÐº", totalTrades: "Ð’ÑÐµÐ³Ð¾ ÑÐ´ÐµÐ»Ð¾Ðº", activeMemories: "ÐÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð¿Ð°Ð¼ÑÑ‚ÑŒ", highRisk: "Ð’Ñ‹ÑÐ¾ÐºÐ¸Ð¹ Ñ€Ð¸ÑÐº", tone: "Ð¢Ð¾Ð½", occurrences: "ÐŸÐ¾Ð²Ñ‚Ð¾Ñ€ÐµÐ½Ð¸Ñ", updatedRecently: "ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾ Ð½ÐµÐ´Ð°Ð²Ð½Ð¾", qualityScore: "Quality Score" },
    statuses: { critical: "ÐšÑ€Ð¸Ñ‚Ð¸Ñ‡Ð½Ð¾", high: "Ð’Ñ‹ÑÐ¾ÐºÐ¸Ð¹", medium: "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹", moderate: "Ð£Ð¼ÐµÑ€ÐµÐ½Ð½Ñ‹Ð¹", low: "ÐÐ¸Ð·ÐºÐ¸Ð¹", stable: "Ð¡Ñ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾", detected: "ÐžÐ±Ð½Ð°Ñ€ÑƒÐ¶ÐµÐ½Ð¾", declining: "Ð¡Ð½Ð¸Ð¶Ð°ÐµÑ‚ÑÑ", decay: "ÐŸÐ°Ð´ÐµÐ½Ð¸Ðµ", volatile: "Ð’Ð¾Ð»Ð°Ñ‚Ð¸Ð»ÑŒÐ½Ð¾", protection: "Ð—Ð°Ñ‰Ð¸Ñ‚Ð°", cooldown: "ÐŸÐ°ÑƒÐ·Ð°", monitor: "ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³", locked: "Ð—Ð°Ð±Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¾", review: "Review", open: "ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ð¾", cleared: "ÐžÑ‡Ð¸Ñ‰ÐµÐ½Ð¾", required: "Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ" },
    page: { ...labels.en.page, snapshotTitle: "Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ñ‹Ð¹ ÑÐ½Ð¸Ð¼Ð¾Ðº Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°", snapshotDescription: "Ð‘Ñ‹ÑÑ‚Ñ€Ð¾Ðµ Ñ‡Ñ‚ÐµÐ½Ð¸Ðµ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð³Ð¾ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ñ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°: Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ð°, Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ñ‡ÐµÑÐºÐ¸Ð¹ Ñ€Ð¸ÑÐº, review Ð¸ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð¿Ð°Ð¼ÑÑ‚ÑŒ.", noReviewNotes: "ÐŸÐ¾ÐºÐ° Ð½ÐµÑ‚ ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð½Ñ‹Ñ… AI review.", riskSupervision: "ÐÐ°Ð´Ð·Ð¾Ñ€ Ð·Ð° Ñ€Ð¸ÑÐºÐ¾Ð¼", operationalIntelligence: "ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð°Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ°", strategicFocus: "Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ñ„Ð¾ÐºÑƒÑ", activeOperationalMemory: "ÐÐºÑ‚Ð¸Ð²Ð½Ð°Ñ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð°Ñ Ð¿Ð°Ð¼ÑÑ‚ÑŒ", noMemories: "ÐŸÐ¾ÐºÐ° Ð½ÐµÑ‚ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾Ð¹ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ Ð¿Ð°Ð¼ÑÑ‚Ð¸.", summaryNoData: "ÐŸÐ¾ÐºÐ° Ð½ÐµÐ´Ð¾ÑÑ‚Ð°Ñ‚Ð¾Ñ‡Ð½Ð¾ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð´Ð»Ñ Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°.", summaryStable: "VOLTIS Ð²Ñ‹ÑÐ²Ð¸Ð» ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½ÑƒÑŽ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½ÑƒÑŽ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ.", summaryHighRisk: "VOLTIS Ð²Ñ‹ÑÐ²Ð»ÑÐµÑ‚ Ð²Ñ‹ÑÐ¾ÐºÐ¸Ðµ ÑÐ¸Ð³Ð½Ð°Ð»Ñ‹ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ Ñ€Ð¸ÑÐºÐ°.", summaryDeveloping: "VOLTIS Ð²Ð¸Ð´Ð¸Ñ‚ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ð² Ñ€Ð°Ð·Ð²Ð¸Ñ‚Ð¸Ð¸.", strategicItems: ["Ð¡Ð½Ð¸Ð·Ð¸Ñ‚ÑŒ Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ñƒ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»Ð¸ Ð¿Ð¾ÑÐ»Ðµ ÑÐµÑ€Ð¸Ð¸ ÑƒÐ±Ñ‹Ñ‚ÐºÐ¾Ð².", "Ð—Ð°Ñ‰Ð¸Ñ‰Ð°Ñ‚ÑŒ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ execution Ð¿Ñ€Ð¸ Ð²Ñ‹ÑÐ¾ÐºÐ¾Ð¹ Ð²Ð¾Ð»Ð°Ñ‚Ð¸Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸.", "Ð”ÐµÑ€Ð¶Ð°Ñ‚ÑŒ Ñ„Ð¾ÐºÑƒÑ Ð½Ð° ÑÐµÑ‚Ð°Ð¿Ð°Ñ… Ñ Ð²Ñ‹ÑÐ¾ÐºÐ¾Ð¹ Ð²ÐµÑ€Ð¾ÑÑ‚Ð½Ð¾ÑÑ‚ÑŒÑŽ."] },
});
labels.es = makeCopy(labels.en, {
    common: { yes: "SÃ­", no: "No", stable: "Estable", detected: "Detectado", declining: "En descenso", decay: "Deterioro", volatile: "VolÃ¡til", online: "Online", required: "Requerido", locked: "Bloqueado", review: "Review", open: "Abierto", notes: "Notas", signals: "SeÃ±ales", memories: "Memorias", patterns: "Patrones", insights: "Insights", trades: "Trades", score: "Score", status: "Estado", confidence: "Confidence", execution: "Execution", discipline: "Disciplina", behavioralRisk: "Riesgo conductual", totalTrades: "Trades totales", activeMemories: "Memorias activas", highRisk: "Alto riesgo", tone: "Tono", occurrences: "Ocurrencias", updatedRecently: "Actualizado recientemente", qualityScore: "Quality Score" },
    statuses: { critical: "CrÃ­tico", high: "Alto", medium: "Medio", moderate: "Moderado", low: "Bajo", stable: "Estable", detected: "Detectado", declining: "En descenso", decay: "Deterioro", volatile: "VolÃ¡til", protection: "ProtecciÃ³n", cooldown: "Pausa", monitor: "Monitor", locked: "Bloqueado", review: "Review", open: "Abierto", cleared: "Libre", required: "Requerido" },
    page: { ...labels.en.page, snapshotTitle: "Snapshot inteligente de la cuenta", snapshotDescription: "Lectura rÃ¡pida del estado operativo: disciplina, riesgo conductual, review y memoria activa.", noReviewNotes: "AÃºn no hay reviews AI guardadas.", riskSupervision: "SupervisiÃ³n del riesgo", operationalIntelligence: "Inteligencia operativa", strategicFocus: "Foco estratÃ©gico", activeOperationalMemory: "Memoria operativa activa", noMemories: "AÃºn no hay memoria operativa activa.", summaryNoData: "TodavÃ­a no hay suficientes datos para generar una lectura inteligente.", summaryStable: "VOLTIS detectÃ³ una estructura operativa estable.", summaryHighRisk: "VOLTIS detecta seÃ±ales de alto riesgo conductual.", summaryDeveloping: "VOLTIS detecta una estructura en desarrollo.", strategicItems: ["Reducir la frecuencia operativa tras pÃ©rdidas consecutivas.", "Proteger la calidad de execution durante alta volatilidad.", "Mantener foco en setups de alta probabilidad."] },
});
labels.fr = makeCopy(labels.en, {
    common: { yes: "Oui", no: "Non", stable: "Stable", detected: "DÃ©tectÃ©", declining: "En baisse", decay: "DÃ©gradation", volatile: "Volatile", online: "En ligne", required: "Requis", locked: "BloquÃ©", review: "Review", open: "Ouvert", notes: "Notes", signals: "Signaux", memories: "MÃ©moires", patterns: "Patterns", insights: "Insights", trades: "Trades", score: "Score", status: "Statut", confidence: "Confidence", execution: "Execution", discipline: "Discipline", behavioralRisk: "Risque comportemental", totalTrades: "Trades totaux", activeMemories: "MÃ©moires actives", highRisk: "Risque Ã©levÃ©", tone: "Ton", occurrences: "Occurrences", updatedRecently: "Mis Ã  jour rÃ©cemment", qualityScore: "Quality Score" },
    statuses: { critical: "Critique", high: "Ã‰levÃ©", medium: "Moyen", moderate: "ModÃ©rÃ©", low: "Faible", stable: "Stable", detected: "DÃ©tectÃ©", declining: "En baisse", decay: "DÃ©gradation", volatile: "Volatile", protection: "Protection", cooldown: "Pause", monitor: "Surveillance", locked: "BloquÃ©", review: "Review", open: "Ouvert", cleared: "Libre", required: "Requis" },
    page: { ...labels.en.page, snapshotTitle: "Snapshot intelligent du compte", snapshotDescription: "Lecture rapide de lâ€™Ã©tat opÃ©rationnel: discipline, risque comportemental, review et mÃ©moire active.", noReviewNotes: "Aucune review AI enregistrÃ©e pour le moment.", riskSupervision: "Supervision du risque", operationalIntelligence: "Intelligence opÃ©rationnelle", strategicFocus: "Focus stratÃ©gique", activeOperationalMemory: "MÃ©moire opÃ©rationnelle active", noMemories: "Aucune mÃ©moire opÃ©rationnelle active pour le moment.", summaryNoData: "Il nâ€™y a pas encore assez de donnÃ©es pour gÃ©nÃ©rer une lecture intelligente.", summaryStable: "VOLTIS a dÃ©tectÃ© une structure opÃ©rationnelle stable.", summaryHighRisk: "VOLTIS dÃ©tecte des signaux de risque comportemental Ã©levÃ©.", summaryDeveloping: "VOLTIS dÃ©tecte une structure en dÃ©veloppement.", strategicItems: ["RÃ©duire la frÃ©quence aprÃ¨s des pertes consÃ©cutives.", "ProtÃ©ger la qualitÃ© dâ€™execution pendant forte volatilitÃ©.", "Rester concentrÃ© sur les setups Ã  forte probabilitÃ©."] },
});
labels.de = makeCopy(labels.en, {
    common: { yes: "Ja", no: "Nein", stable: "Stabil", detected: "Erkannt", declining: "RÃ¼cklÃ¤ufig", decay: "Abfall", volatile: "Volatil", online: "Online", required: "Erforderlich", locked: "Gesperrt", review: "Review", open: "Offen", notes: "Notizen", signals: "Signale", memories: "Speicher", patterns: "Muster", insights: "Insights", trades: "Trades", score: "Score", status: "Status", confidence: "Confidence", execution: "Execution", discipline: "Disziplin", behavioralRisk: "Verhaltensrisiko", totalTrades: "Trades gesamt", activeMemories: "Aktive Speicher", highRisk: "Hohes Risiko", tone: "Ton", occurrences: "Vorkommen", updatedRecently: "KÃ¼rzlich aktualisiert", qualityScore: "Quality Score" },
    statuses: { critical: "Kritisch", high: "Hoch", medium: "Mittel", moderate: "Moderat", low: "Niedrig", stable: "Stabil", detected: "Erkannt", declining: "RÃ¼cklÃ¤ufig", decay: "Abfall", volatile: "Volatil", protection: "Schutz", cooldown: "Cooldown", monitor: "Monitor", locked: "Gesperrt", review: "Review", open: "Offen", cleared: "Freigegeben", required: "Erforderlich" },
    page: { ...labels.en.page, snapshotTitle: "Intelligenter Account-Snapshot", snapshotDescription: "Schnelle Analyse des operativen Zustands: Disziplin, Verhaltensrisiko, Review und aktiver Speicher.", noReviewNotes: "Noch keine AI Reviews gespeichert.", riskSupervision: "RisikoÃ¼berwachung", operationalIntelligence: "Operative Intelligenz", strategicFocus: "Strategischer Fokus", activeOperationalMemory: "Aktiver operativer Speicher", noMemories: "Noch kein aktiver operativer Speicher vorhanden.", summaryNoData: "Es gibt noch nicht genug Daten fÃ¼r eine intelligente Account-Analyse.", summaryStable: "VOLTIS hat eine stabile operative Struktur erkannt.", summaryHighRisk: "VOLTIS erkennt hohe Verhaltensrisiko-Signale.", summaryDeveloping: "VOLTIS erkennt eine Struktur in Entwicklung.", strategicItems: ["Handelsfrequenz nach aufeinanderfolgenden Verlusten reduzieren.", "Execution-QualitÃ¤t bei hoher VolatilitÃ¤t schÃ¼tzen.", "Fokus auf Setups mit hoher Wahrscheinlichkeit halten."] },
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

