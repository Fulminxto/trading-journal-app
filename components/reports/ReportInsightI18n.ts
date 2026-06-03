import {
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

export type ReportInsightLabels = {
    primaryFocus: string;
    status: string;
    structure: string;
    stability: string;
    identity: string;
    psychology: string;
    traderStage: string;

    aiCoachingLayer: string;
    coachingReport: string;
    disciplineExecution: string;
    behavioralStability: string;
    setupQuality: string;
    scalingConsistency: string;
    disciplineExecutionMessage: string;
    behavioralStabilityMessage: string;
    setupQualityMessage: string;
    scalingConsistencyMessage: string;

    behavioralReport: string;
    traderBehaviorAnalysis: string;
    riskScore: string;
    highBehavioralRisk: string;
    behaviorWatchlist: string;
    stableBehavior: string;
    aiBehavioralSummary: string;
    behavioralHighMessage: string;
    behavioralWatchMessage: string;
    behavioralStableMessage: string;

    cognitiveIntelligence: string;
    cognitivePerformanceReport: string;
    cognitiveScore: string;
    cognitiveLoad: string;
    aiCognitiveAssessment: string;
    highCognitiveClarity: string;
    moderateCognitiveStability: string;
    cognitiveInstability: string;
    cognitiveHighMessage: string;
    cognitiveModerateMessage: string;
    cognitiveLowMessage: string;

    confidenceIntelligence: string;
    confidenceReport: string;
    confidenceScore: string;
    highConfidenceStability: string;
    developingConfidence: string;
    confidenceFragility: string;
    aiConfidenceAssessment: string;
    confidenceHighMessage: string;
    confidenceDevelopingMessage: string;
    confidenceLowMessage: string;

    consistencyIntelligence: string;
    consistencyReport: string;
    emotionalRatio: string;
    eliteConsistency: string;
    developingConsistency: string;
    inconsistentStructure: string;
    aiConsistencyAssessment: string;
    consistencyEliteMessage: string;
    consistencyDevelopingMessage: string;
    consistencyWeakMessage: string;

    decisionIntelligence: string;
    decisionQualityReport: string;
    decisionScore: string;
    highDecisionQuality: string;
    developingDecisionProcess: string;
    unstableDecisionProcess: string;
    aiDecisionAssessment: string;
    decisionHighMessage: string;
    decisionDevelopingMessage: string;
    decisionLowMessage: string;

    disciplineIntelligence: string;
    disciplineReport: string;
    disciplineScore: string;
    eliteDiscipline: string;
    developingDiscipline: string;
    disciplineInstability: string;
    aiDisciplineAssessment: string;
    disciplineEliteMessage: string;
    disciplineDevelopingMessage: string;
    disciplineLowMessage: string;

    edgeAnalysis: string;
    aiEdgeEngine: string;
    edgeScore: string;
    strongEdge: string;
    developingEdge: string;
    weakEdge: string;
    aiEdgeAssessment: string;
    edgeStrongMessage: string;
    edgeDevelopingMessage: string;
    edgeWeakMessage: string;

    emotionalIntelligence: string;
    emotionalStabilityReport: string;
    emotionalScore: string;
    emotionallyStable: string;
    moderateEmotionalStability: string;
    emotionalInstability: string;
    aiEmotionalAssessment: string;
    emotionalStableMessage: string;
    emotionalModerateMessage: string;
    emotionalLowMessage: string;

    executionIntelligence: string;
    executionReport: string;
    executionScore: string;
    executionRatio: string;
    eliteExecution: string;
    stableExecution: string;
    executionInstability: string;
    aiExecutionAssessment: string;
    executionEliteMessage: string;
    executionStableMessage: string;
    executionLowMessage: string;

    growthRoadmap: string;
    aiGrowthEngine: string;
    nextTraderPhase: string;
    scalingPhase: string;
    stabilizationPhase: string;
    foundationPhase: string;
    scalingAction: string;
    stabilizationAction: string;
    foundationAction: string;

    mentalResilience: string;
    resilienceReport: string;
    resilienceScore: string;
    pressureRatio: string;
    highMentalResilience: string;
    moderateResilience: string;
    mentalFragility: string;
    aiResilienceAssessment: string;
    resilienceHighMessage: string;
    resilienceModerateMessage: string;
    resilienceLowMessage: string;

    performanceForecast: string;
    aiForecastEngine: string;
    netPnl: string;
    highGrowthPotential: string;
    stableDevelopment: string;
    performanceInstability: string;
    aiForecastAssessment: string;
    forecastHighMessage: string;
    forecastStableMessage: string;
    forecastLowMessage: string;

    psychologicalStability: string;
    psychologyReport: string;
    stableMindset: string;
    moderateStability: string;
    psychologicalFragility: string;
    aiPsychologicalAssessment: string;
    psychologyStableMessage: string;
    psychologyModerateMessage: string;
    psychologyFragileMessage: string;

    riskManagement: string;
    riskReport: string;
    riskReward: string;
    controlledRisk: string;
    moderateRisk: string;
    riskExposure: string;
    aiRiskAssessment: string;
    riskControlledMessage: string;
    riskModerateMessage: string;
    riskExposureMessage: string;

    setupIntelligence: string;
    setupQualityReport: string;
    setupScore: string;
    eliteSetupSelection: string;
    developingSetupQuality: string;
    weakSetupStructure: string;
    aiSetupAssessment: string;
    setupEliteMessage: string;
    setupDevelopingMessage: string;
    setupWeakMessage: string;

    traderEvolution: string;
    evolutionReport: string;
    advancedTrader: string;
    developingTraderConsistency: string;
    earlyStageTrader: string;
    stable: string;
    watchlist: string;
    unstable: string;
    aiEvolutionInsight: string;
    evolutionAdvancedMessage: string;
    evolutionDevelopingMessage: string;
    evolutionEarlyMessage: string;

    traderIdentity: string;
    identityReport: string;
    structuredTrader: string;
    developingTrader: string;
    emotionalTrader: string;
    unstableTrader: string;
    aiIdentityAssessment: string;
    identityStructuredMessage: string;
    identityDevelopingMessage: string;
    identityEmotionalMessage: string;
    identityUnstableMessage: string;
};

const labels: Record<AppLanguage, ReportInsightLabels> = {
    it: {
        primaryFocus: "Focus principale", status: "Stato", structure: "Struttura", stability: "Stabilità", identity: "Identità", psychology: "Psicologia", traderStage: "Fase trader",
        aiCoachingLayer: "AI Coaching Layer", coachingReport: "Report Coaching", disciplineExecution: "Disciplina & Esecuzione", behavioralStability: "Stabilità comportamentale", setupQuality: "Qualità setup", scalingConsistency: "Scalabilità e consistenza", disciplineExecutionMessage: "Riduci overtrading, migliora review e aumenta la qualità media dei setup.", behavioralStabilityMessage: "Monitora impulsività, emotional trading e gestione psicologica.", setupQualityMessage: "Concentrati solo sui setup ad alto edge e riduci esposizione inutile.", scalingConsistencyMessage: "La struttura è positiva. Ora il focus è mantenere consistenza e scalabilità.",
        behavioralReport: "Report comportamentale", traderBehaviorAnalysis: "Analisi comportamento trader", riskScore: "Risk Score", highBehavioralRisk: "Rischio comportamentale alto", behaviorWatchlist: "Comportamento da monitorare", stableBehavior: "Comportamento stabile", aiBehavioralSummary: "Sintesi comportamentale AI", behavioralHighMessage: "Il comportamento operativo mostra segnali di rischio elevato. Priorità: ridurre impulsività, migliorare review e filtrare meglio i setup.", behavioralWatchMessage: "Sono presenti alcuni segnali da monitorare. Mantieni focus su execution, confidence e disciplina emotiva.", behavioralStableMessage: "La struttura comportamentale appare stabile. Continua a proteggere processo, routine e qualità decisionale.",
        cognitiveIntelligence: "Intelligenza cognitiva", cognitivePerformanceReport: "Report performance cognitiva", cognitiveScore: "Cognitive Score", cognitiveLoad: "Carico cognitivo", aiCognitiveAssessment: "Valutazione cognitiva AI", highCognitiveClarity: "Alta lucidità cognitiva", moderateCognitiveStability: "Stabilità cognitiva moderata", cognitiveInstability: "Instabilità cognitiva", cognitiveHighMessage: "Il trader mantiene lucidità operativa, chiarezza decisionale e stabilità cognitiva.", cognitiveModerateMessage: "La struttura cognitiva è discreta ma vulnerabile durante pressione operativa.", cognitiveLowMessage: "La performance cognitiva mostra overload decisionale e instabilità mentale.",
        confidenceIntelligence: "Confidence Intelligence", confidenceReport: "Report confidence", confidenceScore: "Confidence Score", highConfidenceStability: "Stabilità della confidence alta", developingConfidence: "Confidence in sviluppo", confidenceFragility: "Fragilità della confidence", aiConfidenceAssessment: "Valutazione confidence AI", confidenceHighMessage: "Il trader mostra sicurezza operativa stabile e fiducia coerente nel processo.", confidenceDevelopingMessage: "La confidence operativa è in crescita ma ancora vulnerabile.", confidenceLowMessage: "La struttura mentale mostra instabilità e mancanza di fiducia nel processo.",
        consistencyIntelligence: "Consistency Intelligence", consistencyReport: "Report consistenza", emotionalRatio: "Rapporto emotivo", eliteConsistency: "Consistenza elite", developingConsistency: "Consistenza in sviluppo", inconsistentStructure: "Struttura incostante", aiConsistencyAssessment: "Valutazione consistenza AI", consistencyEliteMessage: "Il trader mostra una struttura operativa stabile e ripetibile.", consistencyDevelopingMessage: "La consistenza è in crescita ma necessita consolidamento.", consistencyWeakMessage: "La struttura operativa mostra instabilità e variabilità elevata.",
        decisionIntelligence: "Decision Intelligence", decisionQualityReport: "Report qualità decisionale", decisionScore: "Decision Score", highDecisionQuality: "Alta qualità decisionale", developingDecisionProcess: "Processo decisionale in sviluppo", unstableDecisionProcess: "Processo decisionale instabile", aiDecisionAssessment: "Valutazione decisionale AI", decisionHighMessage: "Il trader mostra una struttura decisionale disciplinata e stabile.", decisionDevelopingMessage: "La qualità decisionale è in crescita ma ancora vulnerabile sotto pressione.", decisionLowMessage: "La struttura decisionale mostra instabilità e rischio comportamentale elevato.",
        disciplineIntelligence: "Discipline Intelligence", disciplineReport: "Report disciplina", disciplineScore: "Discipline Score", eliteDiscipline: "Disciplina elite", developingDiscipline: "Disciplina in sviluppo", disciplineInstability: "Instabilità disciplinare", aiDisciplineAssessment: "Valutazione disciplina AI", disciplineEliteMessage: "Il trader mostra alta disciplina, controllo operativo e forte stabilità comportamentale.", disciplineDevelopingMessage: "La disciplina operativa è in crescita ma ancora vulnerabile sotto pressione.", disciplineLowMessage: "La struttura disciplinare mostra instabilità e mancanza di controllo operativo.",
        edgeAnalysis: "Analisi edge", aiEdgeEngine: "AI Edge Engine", edgeScore: "Edge Score", strongEdge: "Edge forte", developingEdge: "Edge in sviluppo", weakEdge: "Edge debole", aiEdgeAssessment: "Valutazione edge AI", edgeStrongMessage: "Il trader mostra una struttura profittevole con edge operativo riconoscibile.", edgeDevelopingMessage: "L'edge operativo è presente ma necessita più consistenza e stabilità.", edgeWeakMessage: "La struttura operativa non mostra ancora un edge sufficientemente stabile.",
        emotionalIntelligence: "Intelligenza emotiva", emotionalStabilityReport: "Report stabilità emotiva", emotionalScore: "Emotional Score", emotionallyStable: "Stabile emotivamente", moderateEmotionalStability: "Stabilità emotiva moderata", emotionalInstability: "Instabilità emotiva", aiEmotionalAssessment: "Valutazione emotiva AI", emotionalStableMessage: "Il trader mostra buona stabilità emotiva e controllo psicologico operativo.", emotionalModerateMessage: "La stabilità emotiva è discreta ma vulnerabile durante pressione o drawdown.", emotionalLowMessage: "La struttura emotiva mostra instabilità e forte influenza psicologica sulle decisioni.",
        executionIntelligence: "Execution Intelligence", executionReport: "Report esecuzione", executionScore: "Execution Score", executionRatio: "Rapporto esecuzione", eliteExecution: "Esecuzione elite", stableExecution: "Esecuzione stabile", executionInstability: "Instabilità esecutiva", aiExecutionAssessment: "Valutazione esecuzione AI", executionEliteMessage: "L'esecuzione operativa mostra alta qualità, controllo e ripetibilità.", executionStableMessage: "La qualità esecutiva è discreta ma necessita maggiore consistenza.", executionLowMessage: "La struttura esecutiva mostra instabilità e vulnerabilità operative.",
        growthRoadmap: "Roadmap crescita", aiGrowthEngine: "AI Growth Engine", nextTraderPhase: "Prossima fase trader", scalingPhase: "Fase di scaling", stabilizationPhase: "Fase di stabilizzazione", foundationPhase: "Fase fondamenta", scalingAction: "Incrementare consistenza, proteggere edge e ottimizzare execution.", stabilizationAction: "Ridurre variabilità emotiva e migliorare qualità media dei setup.", foundationAction: "Costruire disciplina, review process e routine operative solide.",
        mentalResilience: "Resilienza mentale", resilienceReport: "Report resilienza", resilienceScore: "Resilience Score", pressureRatio: "Pressure Ratio", highMentalResilience: "Alta resilienza mentale", moderateResilience: "Resilienza moderata", mentalFragility: "Fragilità mentale", aiResilienceAssessment: "Valutazione resilienza AI", resilienceHighMessage: "Il trader mostra capacità di mantenere stabilità e lucidità anche sotto pressione.", resilienceModerateMessage: "La resilienza mentale è discreta ma vulnerabile durante drawdown o volatilità.", resilienceLowMessage: "La struttura mentale mostra fragilità operative sotto pressione emotiva e decisionale.",
        performanceForecast: "Forecast performance", aiForecastEngine: "AI Forecast Engine", netPnl: "PnL netto", highGrowthPotential: "Alto potenziale di crescita", stableDevelopment: "Sviluppo stabile", performanceInstability: "Instabilità performance", aiForecastAssessment: "Valutazione forecast AI", forecastHighMessage: "La struttura operativa suggerisce forte potenziale di crescita e scalabilità.", forecastStableMessage: "Il trader sta costruendo una base operativa stabile ma ancora migliorabile.", forecastLowMessage: "La struttura operativa mostra instabilità che potrebbe limitare la crescita futura.",
        psychologicalStability: "Stabilità psicologica", psychologyReport: "Report psicologia", stableMindset: "Mindset stabile", moderateStability: "Stabilità moderata", psychologicalFragility: "Fragilità psicologica", aiPsychologicalAssessment: "Valutazione psicologica AI", psychologyStableMessage: "Il trader mantiene buona stabilità emotiva e controllo operativo.", psychologyModerateMessage: "La stabilità psicologica è discreta ma ancora vulnerabile sotto pressione.", psychologyFragileMessage: "La struttura psicologica mostra segnali di instabilità operativa ed emotiva.",
        riskManagement: "Gestione rischio", riskReport: "Report rischio", riskReward: "Risk Reward", controlledRisk: "Rischio controllato", moderateRisk: "Rischio moderato", riskExposure: "Esposizione al rischio", aiRiskAssessment: "Valutazione rischio AI", riskControlledMessage: "La gestione del rischio appare strutturata e sostenibile.", riskModerateMessage: "La gestione del rischio è discreta ma ancora migliorabile.", riskExposureMessage: "La struttura rischio/rendimento mostra fragilità operative.",
        setupIntelligence: "Setup Intelligence", setupQualityReport: "Report qualità setup", setupScore: "Setup Score", eliteSetupSelection: "Selezione setup elite", developingSetupQuality: "Qualità setup in sviluppo", weakSetupStructure: "Struttura setup debole", aiSetupAssessment: "Valutazione setup AI", setupEliteMessage: "Il trader mostra alta qualità nella selezione dei setup e buona precisione operativa.", setupDevelopingMessage: "La qualità dei setup è discreta ma ancora migliorabile.", setupWeakMessage: "La struttura dei setup mostra instabilità e mancanza di selettività.",
        traderEvolution: "Evoluzione trader", evolutionReport: "Report evoluzione", advancedTrader: "Trader avanzato", developingTraderConsistency: "Consistenza in sviluppo", earlyStageTrader: "Trader fase iniziale", stable: "Stabile", watchlist: "Da monitorare", unstable: "Instabile", aiEvolutionInsight: "Insight evoluzione AI", evolutionAdvancedMessage: "Il trader sta costruendo una struttura operativa avanzata con buona stabilità comportamentale.", evolutionDevelopingMessage: "La crescita è positiva, ma serve più consistenza nella qualità esecutiva.", evolutionEarlyMessage: "La priorità è costruire disciplina, routine e ripetibilità del processo.",
        traderIdentity: "Identità trader", identityReport: "Report identità", structuredTrader: "Trader strutturato", developingTrader: "Trader in sviluppo", emotionalTrader: "Trader emotivo", unstableTrader: "Trader instabile", aiIdentityAssessment: "Valutazione identità AI", identityStructuredMessage: "Il trader mostra struttura operativa stabile, controllo emotivo e processo ripetibile.", identityDevelopingMessage: "La struttura operativa è in crescita ma necessita consolidamento.", identityEmotionalMessage: "Le emozioni stanno influenzando significativamente il processo decisionale.", identityUnstableMessage: "La struttura operativa mostra instabilità e mancanza di coerenza.",
    },
    en: {
        primaryFocus: "Primary Focus", status: "Status", structure: "Structure", stability: "Stability", identity: "Identity", psychology: "Psychology", traderStage: "Trader Stage",
        aiCoachingLayer: "AI Coaching Layer", coachingReport: "Coaching Report", disciplineExecution: "Discipline & Execution", behavioralStability: "Behavioral Stability", setupQuality: "Setup Quality", scalingConsistency: "Scaling Consistency", disciplineExecutionMessage: "Reduce overtrading, improve reviews and raise average setup quality.", behavioralStabilityMessage: "Monitor impulsiveness, emotional trading and psychological management.", setupQualityMessage: "Focus only on high-edge setups and reduce unnecessary exposure.", scalingConsistencyMessage: "The structure is positive. The focus now is maintaining consistency and scalability.",
        behavioralReport: "Behavioral Report", traderBehaviorAnalysis: "Trader Behavior Analysis", riskScore: "Risk Score", highBehavioralRisk: "High Behavioral Risk", behaviorWatchlist: "Behavior Watchlist", stableBehavior: "Stable Behavior", aiBehavioralSummary: "AI Behavioral Summary", behavioralHighMessage: "Operational behavior shows elevated risk signals. Priority: reduce impulsiveness, improve reviews and filter setups better.", behavioralWatchMessage: "Some signals need monitoring. Keep focus on execution, confidence and emotional discipline.", behavioralStableMessage: "The behavioral structure appears stable. Keep protecting process, routine and decision quality.",
        cognitiveIntelligence: "Cognitive Intelligence", cognitivePerformanceReport: "Cognitive Performance Report", cognitiveScore: "Cognitive Score", cognitiveLoad: "Cognitive Load", aiCognitiveAssessment: "AI Cognitive Assessment", highCognitiveClarity: "High Cognitive Clarity", moderateCognitiveStability: "Moderate Cognitive Stability", cognitiveInstability: "Cognitive Instability", cognitiveHighMessage: "The trader maintains operational clarity, decision clarity and cognitive stability.", cognitiveModerateMessage: "The cognitive structure is decent but vulnerable under operational pressure.", cognitiveLowMessage: "Cognitive performance shows decision overload and mental instability.",
        confidenceIntelligence: "Confidence Intelligence", confidenceReport: "Confidence Report", confidenceScore: "Confidence Score", highConfidenceStability: "High Confidence Stability", developingConfidence: "Developing Confidence", confidenceFragility: "Confidence Fragility", aiConfidenceAssessment: "AI Confidence Assessment", confidenceHighMessage: "The trader shows stable operational confidence and trust in the process.", confidenceDevelopingMessage: "Operational confidence is improving but remains vulnerable.", confidenceLowMessage: "The mental structure shows instability and lack of trust in the process.",
        consistencyIntelligence: "Consistency Intelligence", consistencyReport: "Consistency Report", emotionalRatio: "Emotional Ratio", eliteConsistency: "Elite Consistency", developingConsistency: "Developing Consistency", inconsistentStructure: "Inconsistent Structure", aiConsistencyAssessment: "AI Consistency Assessment", consistencyEliteMessage: "The trader shows a stable and repeatable operating structure.", consistencyDevelopingMessage: "Consistency is improving but needs consolidation.", consistencyWeakMessage: "The operating structure shows instability and high variability.",
        decisionIntelligence: "Decision Intelligence", decisionQualityReport: "Decision Quality Report", decisionScore: "Decision Score", highDecisionQuality: "High Decision Quality", developingDecisionProcess: "Developing Decision Process", unstableDecisionProcess: "Unstable Decision Process", aiDecisionAssessment: "AI Decision Assessment", decisionHighMessage: "The trader shows a disciplined and stable decision structure.", decisionDevelopingMessage: "Decision quality is improving but still vulnerable under pressure.", decisionLowMessage: "The decision structure shows instability and elevated behavioral risk.",
        disciplineIntelligence: "Discipline Intelligence", disciplineReport: "Discipline Report", disciplineScore: "Discipline Score", eliteDiscipline: "Elite Discipline", developingDiscipline: "Developing Discipline", disciplineInstability: "Discipline Instability", aiDisciplineAssessment: "AI Discipline Assessment", disciplineEliteMessage: "The trader shows high discipline, operational control and strong behavioral stability.", disciplineDevelopingMessage: "Operational discipline is improving but still vulnerable under pressure.", disciplineLowMessage: "The discipline structure shows instability and lack of operational control.",
        edgeAnalysis: "Edge Analysis", aiEdgeEngine: "AI Edge Engine", edgeScore: "Edge Score", strongEdge: "Strong Edge", developingEdge: "Developing Edge", weakEdge: "Weak Edge", aiEdgeAssessment: "AI Edge Assessment", edgeStrongMessage: "The trader shows a profitable structure with recognizable operational edge.", edgeDevelopingMessage: "Operational edge is present but needs more consistency and stability.", edgeWeakMessage: "The operating structure does not yet show a sufficiently stable edge.",
        emotionalIntelligence: "Emotional Intelligence", emotionalStabilityReport: "Emotional Stability Report", emotionalScore: "Emotional Score", emotionallyStable: "Emotionally Stable", moderateEmotionalStability: "Moderate Emotional Stability", emotionalInstability: "Emotional Instability", aiEmotionalAssessment: "AI Emotional Assessment", emotionalStableMessage: "The trader shows good emotional stability and psychological operational control.", emotionalModerateMessage: "Emotional stability is decent but vulnerable during pressure or drawdown.", emotionalLowMessage: "The emotional structure shows instability and strong psychological influence on decisions.",
        executionIntelligence: "Execution Intelligence", executionReport: "Execution Report", executionScore: "Execution Score", executionRatio: "Execution Ratio", eliteExecution: "Elite Execution", stableExecution: "Stable Execution", executionInstability: "Execution Instability", aiExecutionAssessment: "AI Execution Assessment", executionEliteMessage: "Operational execution shows high quality, control and repeatability.", executionStableMessage: "Execution quality is decent but needs more consistency.", executionLowMessage: "The execution structure shows instability and operational vulnerability.",
        growthRoadmap: "Growth Roadmap", aiGrowthEngine: "AI Growth Engine", nextTraderPhase: "Next Trader Phase", scalingPhase: "Scaling Phase", stabilizationPhase: "Stabilization Phase", foundationPhase: "Foundation Phase", scalingAction: "Increase consistency, protect edge and optimize execution.", stabilizationAction: "Reduce emotional variability and improve average setup quality.", foundationAction: "Build discipline, review process and solid operating routines.",
        mentalResilience: "Mental Resilience", resilienceReport: "Resilience Report", resilienceScore: "Resilience Score", pressureRatio: "Pressure Ratio", highMentalResilience: "High Mental Resilience", moderateResilience: "Moderate Resilience", mentalFragility: "Mental Fragility", aiResilienceAssessment: "AI Resilience Assessment", resilienceHighMessage: "The trader can maintain stability and clarity even under pressure.", resilienceModerateMessage: "Mental resilience is decent but vulnerable during drawdown or volatility.", resilienceLowMessage: "The mental structure shows operational fragility under emotional and decision pressure.",
        performanceForecast: "Performance Forecast", aiForecastEngine: "AI Forecast Engine", netPnl: "Net PnL", highGrowthPotential: "High Growth Potential", stableDevelopment: "Stable Development", performanceInstability: "Performance Instability", aiForecastAssessment: "AI Forecast Assessment", forecastHighMessage: "The operating structure suggests strong growth and scalability potential.", forecastStableMessage: "The trader is building a stable operating base that can still improve.", forecastLowMessage: "The operating structure shows instability that could limit future growth.",
        psychologicalStability: "Psychological Stability", psychologyReport: "Psychology Report", stableMindset: "Stable Mindset", moderateStability: "Moderate Stability", psychologicalFragility: "Psychological Fragility", aiPsychologicalAssessment: "AI Psychological Assessment", psychologyStableMessage: "The trader maintains good emotional stability and operational control.", psychologyModerateMessage: "Psychological stability is decent but still vulnerable under pressure.", psychologyFragileMessage: "The psychological structure shows signs of operational and emotional instability.",
        riskManagement: "Risk Management", riskReport: "Risk Report", riskReward: "Risk Reward", controlledRisk: "Controlled Risk", moderateRisk: "Moderate Risk", riskExposure: "Risk Exposure", aiRiskAssessment: "AI Risk Assessment", riskControlledMessage: "Risk management appears structured and sustainable.", riskModerateMessage: "Risk management is decent but still improvable.", riskExposureMessage: "The risk/reward structure shows operational fragility.",
        setupIntelligence: "Setup Intelligence", setupQualityReport: "Setup Quality Report", setupScore: "Setup Score", eliteSetupSelection: "Elite Setup Selection", developingSetupQuality: "Developing Setup Quality", weakSetupStructure: "Weak Setup Structure", aiSetupAssessment: "AI Setup Assessment", setupEliteMessage: "The trader shows high quality in setup selection and good operational precision.", setupDevelopingMessage: "Setup quality is decent but still improvable.", setupWeakMessage: "Setup structure shows instability and lack of selectivity.",
        traderEvolution: "Trader Evolution", evolutionReport: "Evolution Report", advancedTrader: "Advanced Trader", developingTraderConsistency: "Developing Consistency", earlyStageTrader: "Early Stage Trader", stable: "Stable", watchlist: "Watchlist", unstable: "Unstable", aiEvolutionInsight: "AI Evolution Insight", evolutionAdvancedMessage: "The trader is building an advanced operating structure with good behavioral stability.", evolutionDevelopingMessage: "Growth is positive, but more consistency in execution quality is needed.", evolutionEarlyMessage: "The priority is building discipline, routine and process repeatability.",
        traderIdentity: "Trader Identity", identityReport: "Identity Report", structuredTrader: "Structured Trader", developingTrader: "Developing Trader", emotionalTrader: "Emotional Trader", unstableTrader: "Unstable Trader", aiIdentityAssessment: "AI Identity Assessment", identityStructuredMessage: "The trader shows stable operating structure, emotional control and repeatable process.", identityDevelopingMessage: "The operating structure is improving but needs consolidation.", identityEmotionalMessage: "Emotions are significantly influencing the decision-making process.", identityUnstableMessage: "The operating structure shows instability and lack of consistency.",
    },
    uk: {} as ReportInsightLabels,
    ru: {} as ReportInsightLabels,
    es: {} as ReportInsightLabels,
    fr: {} as ReportInsightLabels,
    de: {} as ReportInsightLabels,
};

labels.uk = {
    ...labels.en,
    primaryFocus: "Головний фокус", status: "Статус", structure: "Структура", stability: "Стабільність", identity: "Ідентичність", psychology: "Психологія", traderStage: "Етап трейдера",
    coachingReport: "Звіт коучингу", disciplineExecution: "Дисципліна та виконання", behavioralStability: "Поведінкова стабільність", setupQuality: "Якість сетапів", scalingConsistency: "Масштабування й консистентність",
    behavioralReport: "Поведінковий звіт", traderBehaviorAnalysis: "Аналіз поведінки трейдера", riskScore: "Оцінка ризику", highBehavioralRisk: "Високий поведінковий ризик", behaviorWatchlist: "Поведінка під наглядом", stableBehavior: "Стабільна поведінка",
    cognitivePerformanceReport: "Звіт когнітивної продуктивності", confidenceReport: "Звіт впевненості", consistencyReport: "Звіт консистентності", decisionQualityReport: "Звіт якості рішень", disciplineReport: "Звіт дисципліни", edgeAnalysis: "Аналіз edge", emotionalStabilityReport: "Звіт емоційної стабільності", executionReport: "Звіт виконання", growthRoadmap: "Дорожня карта росту", mentalResilience: "Ментальна стійкість", resilienceReport: "Звіт стійкості", performanceForecast: "Прогноз продуктивності", psychologicalStability: "Психологічна стабільність", psychologyReport: "Звіт психології", riskManagement: "Управління ризиком", riskReport: "Звіт ризику", setupQualityReport: "Звіт якості сетапів", traderEvolution: "Еволюція трейдера", evolutionReport: "Звіт еволюції", traderIdentity: "Ідентичність трейдера", identityReport: "Звіт ідентичності",
};
labels.ru = {
    ...labels.en,
    primaryFocus: "Главный фокус", status: "Статус", structure: "Структура", stability: "Стабильность", identity: "Идентичность", psychology: "Психология", traderStage: "Этап трейдера",
    coachingReport: "Коучинг-отчет", disciplineExecution: "Дисциплина и исполнение", behavioralStability: "Поведенческая стабильность", setupQuality: "Качество сетапов", scalingConsistency: "Масштабирование и стабильность",
    behavioralReport: "Поведенческий отчет", traderBehaviorAnalysis: "Анализ поведения трейдера", riskScore: "Оценка риска", highBehavioralRisk: "Высокий поведенческий риск", behaviorWatchlist: "Поведение под наблюдением", stableBehavior: "Стабильное поведение",
    cognitivePerformanceReport: "Отчет когнитивной производительности", confidenceReport: "Отчет уверенности", consistencyReport: "Отчет стабильности", decisionQualityReport: "Отчет качества решений", disciplineReport: "Отчет дисциплины", edgeAnalysis: "Анализ edge", emotionalStabilityReport: "Отчет эмоциональной стабильности", executionReport: "Отчет исполнения", growthRoadmap: "Дорожная карта роста", mentalResilience: "Ментальная устойчивость", resilienceReport: "Отчет устойчивости", performanceForecast: "Прогноз производительности", psychologicalStability: "Психологическая стабильность", psychologyReport: "Отчет психологии", riskManagement: "Управление риском", riskReport: "Отчет риска", setupQualityReport: "Отчет качества сетапов", traderEvolution: "Эволюция трейдера", evolutionReport: "Отчет эволюции", traderIdentity: "Идентичность трейдера", identityReport: "Отчет идентичности",
};
labels.es = {
    ...labels.en,
    primaryFocus: "Foco principal", status: "Estado", structure: "Estructura", stability: "Estabilidad", identity: "Identidad", psychology: "Psicología", traderStage: "Etapa del trader",
    coachingReport: "Reporte de coaching", disciplineExecution: "Disciplina y ejecución", behavioralStability: "Estabilidad conductual", setupQuality: "Calidad de setups", scalingConsistency: "Escalabilidad y consistencia",
    behavioralReport: "Reporte conductual", traderBehaviorAnalysis: "Análisis del comportamiento del trader", riskScore: "Puntuación de riesgo", highBehavioralRisk: "Alto riesgo conductual", behaviorWatchlist: "Comportamiento a vigilar", stableBehavior: "Comportamiento estable",
    cognitivePerformanceReport: "Reporte de rendimiento cognitivo", confidenceReport: "Reporte de confianza", consistencyReport: "Reporte de consistencia", decisionQualityReport: "Reporte de calidad decisional", disciplineReport: "Reporte de disciplina", edgeAnalysis: "Análisis de edge", emotionalStabilityReport: "Reporte de estabilidad emocional", executionReport: "Reporte de ejecución", growthRoadmap: "Ruta de crecimiento", mentalResilience: "Resiliencia mental", resilienceReport: "Reporte de resiliencia", performanceForecast: "Pronóstico de rendimiento", psychologicalStability: "Estabilidad psicológica", psychologyReport: "Reporte psicológico", riskManagement: "Gestión de riesgo", riskReport: "Reporte de riesgo", setupQualityReport: "Reporte de calidad de setups", traderEvolution: "Evolución del trader", evolutionReport: "Reporte de evolución", traderIdentity: "Identidad del trader", identityReport: "Reporte de identidad",
};
labels.fr = {
    ...labels.en,
    primaryFocus: "Focus principal", status: "Statut", structure: "Structure", stability: "Stabilité", identity: "Identité", psychology: "Psychologie", traderStage: "Étape du trader",
    coachingReport: "Rapport de coaching", disciplineExecution: "Discipline et exécution", behavioralStability: "Stabilité comportementale", setupQuality: "Qualité des setups", scalingConsistency: "Scalabilité et constance",
    behavioralReport: "Rapport comportemental", traderBehaviorAnalysis: "Analyse du comportement du trader", riskScore: "Score de risque", highBehavioralRisk: "Risque comportemental élevé", behaviorWatchlist: "Comportement à surveiller", stableBehavior: "Comportement stable",
    cognitivePerformanceReport: "Rapport de performance cognitive", confidenceReport: "Rapport de confiance", consistencyReport: "Rapport de constance", decisionQualityReport: "Rapport de qualité décisionnelle", disciplineReport: "Rapport de discipline", edgeAnalysis: "Analyse de l’edge", emotionalStabilityReport: "Rapport de stabilité émotionnelle", executionReport: "Rapport d’exécution", growthRoadmap: "Feuille de route de croissance", mentalResilience: "Résilience mentale", resilienceReport: "Rapport de résilience", performanceForecast: "Prévision de performance", psychologicalStability: "Stabilité psychologique", psychologyReport: "Rapport psychologique", riskManagement: "Gestion du risque", riskReport: "Rapport de risque", setupQualityReport: "Rapport de qualité des setups", traderEvolution: "Évolution du trader", evolutionReport: "Rapport d’évolution", traderIdentity: "Identité du trader", identityReport: "Rapport d’identité",
};
labels.de = {
    ...labels.en,
    primaryFocus: "Hauptfokus", status: "Status", structure: "Struktur", stability: "Stabilität", identity: "Identität", psychology: "Psychologie", traderStage: "Trader-Phase",
    coachingReport: "Coaching-Bericht", disciplineExecution: "Disziplin & Ausführung", behavioralStability: "Verhaltensstabilität", setupQuality: "Setup-Qualität", scalingConsistency: "Skalierung & Konstanz",
    behavioralReport: "Verhaltensbericht", traderBehaviorAnalysis: "Analyse des Trader-Verhaltens", riskScore: "Risiko-Score", highBehavioralRisk: "Hohes Verhaltensrisiko", behaviorWatchlist: "Verhalten beobachten", stableBehavior: "Stabiles Verhalten",
    cognitivePerformanceReport: "Kognitiver Performance-Bericht", confidenceReport: "Confidence-Bericht", consistencyReport: "Konstanz-Bericht", decisionQualityReport: "Entscheidungsqualitäts-Bericht", disciplineReport: "Disziplin-Bericht", edgeAnalysis: "Edge-Analyse", emotionalStabilityReport: "Bericht emotionale Stabilität", executionReport: "Ausführungsbericht", growthRoadmap: "Wachstums-Roadmap", mentalResilience: "Mentale Resilienz", resilienceReport: "Resilienz-Bericht", performanceForecast: "Performance-Prognose", psychologicalStability: "Psychologische Stabilität", psychologyReport: "Psychologie-Bericht", riskManagement: "Risikomanagement", riskReport: "Risikobericht", setupQualityReport: "Setup-Qualitätsbericht", traderEvolution: "Trader-Entwicklung", evolutionReport: "Entwicklungsbericht", traderIdentity: "Trader-Identität", identityReport: "Identitätsbericht",
};

export function getReportInsightLabels(language?: string | null) {
    const appLanguage = normalizeAppLanguage(language);
    return labels[appLanguage] ?? labels.en;
}
