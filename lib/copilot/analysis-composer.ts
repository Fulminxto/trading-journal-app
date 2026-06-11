import type { AppLanguage } from "@/lib/i18n";

export type AnalysisInput = {
  totalTrades: number;
  winRate: number;
  disciplineScore: number;
  behavioralRisk: number;
  weakExecutionTrades: number;
  emotionalTrades: number;
  lowConfidenceTrades: number;
  lossStreak: number;
  winStreak: number;
  revengeRiskTrades: number;
  weakTimeTrades: number;
  executionDecay: boolean;
  confidenceDecay: boolean;
  behavioralDrift: boolean;
  emotionalVolatility: boolean;
  emotionalInstabilityScore: number;
  supervisorLevel: string;
  averageExecution: number;
  averageConfidence: number;
  reviewScore: number;
  consistencyScore: number;
  consistencyLabel: string;
  recoveryDetected: boolean;
  recoveryScore: number;
  recoveryLabel: string;
  sessionLocked: boolean;
  reviewRequired: boolean;
  coachingTone: string;
  escalationLevel: string;
};

type Variant = readonly [string, string, string];
type LangTexts = Record<AppLanguage, Variant>;

type Observation = {
  id: string;
  condition: (d: AnalysisInput) => boolean;
  priority: (d: AnalysisInput) => number;
  value: (d: AnalysisInput) => number;
  texts: LangTexts;
};

const TONE_BASE: Record<string, 0 | 1 | 2> = {
  strict: 0,
  direct: 1,
  growth: 2,
  supportive: 2,
};

function pickVariant(tone: string, seed: number): 0 | 1 | 2 {
  const base = (TONE_BASE[tone] ?? 1) as 0 | 1 | 2;
  return ((base + (seed % 2)) % 3) as 0 | 1 | 2;
}

function applyValue(text: string, n: number): string {
  return text.replace(/\{n\}/g, String(n));
}

function pickObservation(
  pool: Observation[],
  data: AnalysisInput,
  seed: number
): Observation | null {
  const applicable = pool.filter((o) => o.condition(data));
  if (applicable.length === 0) return null;
  const maxPriority = Math.max(...applicable.map((o) => o.priority(data)));
  const top = applicable.filter((o) => o.priority(data) >= maxPriority);
  return top[seed % top.length];
}

// ---------------------------------------------------------------------------
// Section 1 — DISCIPLINA
// ---------------------------------------------------------------------------

const DISCIPLINA: Observation[] = [
  {
    id: "low-discipline",
    condition: (d) => d.disciplineScore < 50,
    priority: () => 500,
    value: (d) => d.disciplineScore,
    texts: {
      it: [
        "Disciplina al {n}% — struttura operativa instabile. Riduci la frequenza dei trade e concentrati esclusivamente sui setup migliori.",
        "Disciplina all'{n}%. Ricostruisci una routine decisionale solida ed elimina gli ingressi impulsivi dal tuo processo.",
        "Disciplina al {n}% — ampio margine di miglioramento. Lavora su un setup alla volta con una checklist pre-trade per costruire consistenza.",
      ],
      en: [
        "Discipline at {n}% — unstable operational foundation. Reduce trade frequency and focus exclusively on your best setups.",
        "Discipline: {n}%. Rebuild a consistent decision routine and eliminate impulsive entries from your process.",
        "Discipline at {n}% — significant room to grow. Work on one setup at a time with a pre-trade checklist to build consistency.",
      ],
      uk: [
        "Дисципліна на рівні {n}% — операційна основа нестабільна. Зменш частоту угод і зосередься виключно на найкращих сетапах.",
        "Дисципліна: {n}%. Відновити послідовну рутину прийняття рішень і усунути імпульсивні входи.",
        "Дисципліна {n}% — значний потенціал для зростання. Працюй над одним сетапом за раз із чеклистом перед угодою.",
      ],
      ru: [
        "Дисциплина на уровне {n}% — операционная основа нестабильна. Снизь частоту сделок и сосредоточься исключительно на лучших сетапах.",
        "Дисциплина: {n}%. Восстановить последовательную рутину принятия решений и исключить импульсивные входы.",
        "Дисциплина {n}% — значительный потенциал для роста. Работай над одним сетапом за раз с чеклистом перед сделкой.",
      ],
      es: [
        "Disciplina al {n}% — base operativa inestable. Reduce la frecuencia de operaciones y céntrate exclusivamente en tus mejores setups.",
        "Disciplina: {n}%. Reconstruye una rutina decisional consistente y elimina entradas impulsivas de tu proceso.",
        "Disciplina al {n}% — amplio margen de mejora. Trabaja en un setup a la vez con una checklist pre-operación.",
      ],
      fr: [
        "Discipline à {n}% — base opérationnelle instable. Réduisez la fréquence des trades et concentrez-vous exclusivement sur vos meilleurs setups.",
        "Discipline: {n}%. Reconstruisez une routine décisionnelle cohérente et éliminez les entrées impulsives.",
        "Discipline à {n}% — potentiel de croissance significatif. Travaillez sur un setup à la fois avec une checklist pré-trade.",
      ],
      de: [
        "Disziplin bei {n}% — instabile operative Grundlage. Reduziere die Handelsfrequenz und konzentriere dich ausschließlich auf deine besten Setups.",
        "Disziplin: {n}%. Baue eine konsistente Entscheidungsroutine auf und eliminiere impulsive Einstiege.",
        "Disziplin bei {n}% — erhebliches Wachstumspotenzial. Arbeite an einem Setup nach dem anderen mit einer Pre-Trade-Checkliste.",
      ],
    },
  },
  {
    id: "weak-execution",
    condition: (d) => d.weakExecutionTrades >= 3,
    priority: () => 400,
    value: (d) => d.weakExecutionTrades,
    texts: {
      it: [
        "{n} trade mostrano un'esecuzione debole (rating ≤4). È un problema strutturale — rivedi ogni punto di ingresso e smetti di operare su setup che non ti convincono pienamente.",
        "{n} trade con qualità di esecuzione bassa registrati. Identifica l'elemento comune e aggiungi un filtro alla tua routine pre-ingresso.",
        "{n} esecuzioni sotto standard rilevate. Ogni ingresso debole è un'opportunità di apprendimento — analizzali uno per uno e affina i tuoi criteri.",
      ],
      en: [
        "{n} trades show weak execution (rating ≤4). This is a structural issue — review each entry and stop trading setups you are not fully confident in.",
        "{n} trades with low execution quality recorded. Identify the common element and add a filter to your pre-entry routine.",
        "{n} below-standard executions detected. Every weak entry is a learning opportunity — review them one by one and sharpen your criteria.",
      ],
      uk: [
        "{n} угод показують слабку виконання (рейтинг ≤4). Це структурна проблема — переглянь кожний вхід і перестань торгувати сетапами, в яких не впевнений.",
        "{n} угод із низькою якістю виконання зафіксовано. Визнач спільний елемент і додай фільтр до своєї рутини перед входом.",
        "{n} виконань нижче стандарту виявлено. Кожен слабкий вхід — це можливість навчання.",
      ],
      ru: [
        "{n} сделок показывают слабое исполнение (рейтинг ≤4). Это структурная проблема — пересмотри каждый вход и прекрати торговать сетапами, в которых не уверен.",
        "{n} сделок с низким качеством исполнения зафиксировано. Определи общий элемент и добавь фильтр в свою рутину перед входом.",
        "{n} исполнений ниже стандарта обнаружено. Каждый слабый вход — это возможность для обучения.",
      ],
      es: [
        "{n} operaciones muestran ejecución débil (rating ≤4). Es un problema estructural — revisa cada entrada y deja de operar setups en los que no estás completamente seguro.",
        "{n} operaciones con baja calidad de ejecución registradas. Identifica el elemento común y añade un filtro a tu rutina pre-entrada.",
        "{n} ejecuciones por debajo del estándar detectadas. Cada entrada débil es una oportunidad de aprendizaje — analízalas una por una.",
      ],
      fr: [
        "{n} trades montrent une exécution faible (note ≤4). C'est un problème structurel — révisez chaque entrée et arrêtez de trader des setups peu convaincants.",
        "{n} trades avec une faible qualité d'exécution enregistrés. Identifiez l'élément commun et ajoutez un filtre à votre routine pré-entrée.",
        "{n} exécutions sous la norme détectées. Chaque entrée faible est une opportunité d'apprentissage — analysez-les une par une.",
      ],
      de: [
        "{n} Trades zeigen schwache Ausführung (Bewertung ≤4). Das ist ein strukturelles Problem — überprüfe jeden Einstieg und höre auf, Setups zu handeln, von denen du nicht überzeugt bist.",
        "{n} Trades mit niedriger Ausführungsqualität erfasst. Identifiziere das gemeinsame Element und füge deiner Pre-Entry-Routine einen Filter hinzu.",
        "{n} unterdurchschnittliche Ausführungen erkannt. Jeder schwache Einstieg ist eine Lernmöglichkeit — analysiere sie einzeln.",
      ],
    },
  },
  {
    id: "low-win-rate",
    condition: (d) => d.winRate < 40 && d.totalTrades >= 10,
    priority: () => 350,
    value: (d) => d.winRate,
    texts: {
      it: [
        "Win rate al {n}% — sotto la soglia minima per un'operatività profittevole. Rivedi i criteri di selezione setup e riduci il sizing fino al ritorno della chiarezza.",
        "Win rate: {n}%. Il processo di selezione attuale necessita di miglioramento. Identifica quali setup stanno perdendo e smetti di prenderli.",
        "Win rate al {n}% — chiaro spazio di miglioramento. Prendi meno trade, solo ad alta convinzione, e osserva cosa cambia.",
      ],
      en: [
        "Win rate at {n}% — below the minimum threshold for profitable operation. Review setup selection criteria and reduce size until clarity returns.",
        "Win rate: {n}%. The current selection process needs improvement. Identify which setups are losing and stop taking them.",
        "Win rate at {n}% — clear room for improvement. Take fewer, higher-conviction trades and observe what changes.",
      ],
      uk: [
        "Відсоток виграшів {n}% — нижче мінімального порогу для прибуткової торгівлі. Переглянь критерії вибору сетапів і зменш розмір позиції.",
        "Відсоток виграшів: {n}%. Поточний процес відбору потребує вдосконалення. Визнач, які сетапи програють, і перестань їх брати.",
        "Відсоток виграшів {n}% — є очевидний простір для покращення. Торгуй менше, тільки з високою впевненістю.",
      ],
      ru: [
        "Процент выигрышей {n}% — ниже минимального порога для прибыльной торговли. Пересмотри критерии отбора сетапов и снизь размер позиции.",
        "Процент выигрышей: {n}%. Текущий процесс отбора требует улучшения. Определи, какие сетапы убыточны, и прекрати их брать.",
        "Процент выигрышей {n}% — есть явный потенциал для улучшения. Торгуй меньше, только с высокой убежденностью.",
      ],
      es: [
        "Tasa de éxito al {n}% — por debajo del umbral mínimo para operar de forma rentable. Revisa los criterios de selección de setups y reduce el tamaño hasta que regrese la claridad.",
        "Tasa de éxito: {n}%. El proceso de selección actual necesita mejora. Identifica qué setups están perdiendo y deja de tomarlos.",
        "Tasa de éxito al {n}% — claro margen de mejora. Opera menos, solo con alta convicción, y observa qué cambia.",
      ],
      fr: [
        "Taux de réussite à {n}% — en dessous du seuil minimum pour une opération rentable. Révisez les critères de sélection des setups et réduisez la taille jusqu'au retour de la clarté.",
        "Taux de réussite: {n}%. Le processus de sélection actuel nécessite une amélioration. Identifiez quels setups perdent et arrêtez de les prendre.",
        "Taux de réussite à {n}% — marge d'amélioration claire. Prenez moins de trades, uniquement à forte conviction.",
      ],
      de: [
        "Win-Rate bei {n}% — unter der Mindestgrenze für profitables Trading. Überprüfe die Setup-Auswahlkriterien und reduziere die Größe, bis die Klarheit zurückkehrt.",
        "Win-Rate: {n}%. Der aktuelle Auswahlprozess muss verbessert werden. Identifiziere, welche Setups verlieren, und höre auf, sie zu handeln.",
        "Win-Rate bei {n}% — klares Verbesserungspotenzial. Handle weniger, nur mit hoher Überzeugung, und beobachte was sich ändert.",
      ],
    },
  },
  {
    id: "medium-discipline",
    condition: (d) => d.disciplineScore >= 50 && d.disciplineScore < 75,
    priority: () => 200,
    value: (d) => d.disciplineScore,
    texts: {
      it: [
        "Disciplina al {n}% — accettabile ma non sufficiente. La consistenza operativa richiede di eliminare i setup più deboli dalla tua rotazione.",
        "Punteggio disciplina: {n}%. La struttura si sta sviluppando. Mantieni i setup migliori e taglia gli ingressi a bassa chiarezza.",
        "Disciplina al {n}% — stai costruendo una base solida. Continua a raffinare le tue regole di ingresso e traccia il rispetto della tua routine.",
      ],
      en: [
        "Discipline at {n}% — acceptable but not enough. Operational consistency requires eliminating your weakest setups from the rotation.",
        "Discipline score: {n}%. The structure is developing. Keep your best setups and cut entries with low clarity.",
        "Discipline at {n}% — you are building a solid base. Keep refining your entry rules and track your routine adherence.",
      ],
      uk: [
        "Дисципліна {n}% — прийнятно, але недостатньо. Операційна послідовність вимагає усунення найслабших сетапів з ротації.",
        "Показник дисципліни: {n}%. Структура розвивається. Зберігай найкращі сетапи і скорочуй входи з низькою чіткістю.",
        "Дисципліна {n}% — ти будуєш міцну основу. Продовжуй вдосконалювати правила входу і відстежуй дотримання рутини.",
      ],
      ru: [
        "Дисциплина {n}% — приемлемо, но недостаточно. Операционная последовательность требует устранения самых слабых сетапов из ротации.",
        "Показатель дисциплины: {n}%. Структура развивается. Сохраняй лучшие сетапы и сокращай входы с низкой четкостью.",
        "Дисциплина {n}% — ты строишь прочную основу. Продолжай совершенствовать правила входа и отслеживай соблюдение рутины.",
      ],
      es: [
        "Disciplina al {n}% — aceptable pero no suficiente. La consistencia operativa requiere eliminar los setups más débiles de tu rotación.",
        "Puntuación de disciplina: {n}%. La estructura se está desarrollando. Mantén tus mejores setups y elimina entradas con poca claridad.",
        "Disciplina al {n}% — estás construyendo una base sólida. Sigue refinando tus reglas de entrada y rastrea tu adherencia a la rutina.",
      ],
      fr: [
        "Discipline à {n}% — acceptable mais insuffisant. La cohérence opérationnelle nécessite d'éliminer vos setups les plus faibles de la rotation.",
        "Score de discipline: {n}%. La structure se développe. Gardez vos meilleurs setups et supprimez les entrées à faible clarté.",
        "Discipline à {n}% — vous construisez une base solide. Continuez à affiner vos règles d'entrée et suivez votre adhérence à la routine.",
      ],
      de: [
        "Disziplin bei {n}% — akzeptabel, aber nicht ausreichend. Operative Konsistenz erfordert die Eliminierung der schwächsten Setups aus der Rotation.",
        "Disziplinwert: {n}%. Die Struktur entwickelt sich. Halte deine besten Setups und eliminiere Einstiege mit geringer Klarheit.",
        "Disziplin bei {n}% — du baust eine solide Basis auf. Verfeinere weiter deine Einstiegsregeln und verfolge die Einhaltung deiner Routine.",
      ],
    },
  },
  {
    id: "high-consistency",
    condition: (d) => d.consistencyScore >= 65,
    priority: () => 120,
    value: (d) => d.consistencyScore,
    texts: {
      it: [
        "Consistenza al {n}% — la struttura operativa è stabile. Questo è il risultato della ripetizione disciplinata: proteggi questo livello.",
        "Consistenza: {n}%. Stai operando con uno schema affidabile. Mantieni la tua routine e evita deviazioni sotto pressione di mercato.",
        "Punteggio di consistenza {n}% — un segnale forte di progresso. Stai costruendo le abitudini di un trader professionale.",
      ],
      en: [
        "Consistency at {n}% — the operating structure is stable. This is the result of disciplined repetition — protect this level.",
        "Consistency: {n}%. You are operating with a reliable pattern. Maintain your routine and avoid deviation under market pressure.",
        "Consistency score {n}% — a strong sign of progress. You are building the habits of a professional trader.",
      ],
      uk: [
        "Послідовність {n}% — операційна структура стабільна. Це результат дисциплінованого повторення — захищай цей рівень.",
        "Послідовність: {n}%. Ти працюєш за надійним патерном. Підтримуй рутину і уникай відхилень під тиском ринку.",
        "Показник послідовності {n}% — сильний знак прогресу. Ти будуєш звички професійного трейдера.",
      ],
      ru: [
        "Последовательность {n}% — операционная структура стабильна. Это результат дисциплинированного повторения — защищай этот уровень.",
        "Последовательность: {n}%. Ты работаешь по надежному паттерну. Поддерживай рутину и избегай отклонений под давлением рынка.",
        "Показатель последовательности {n}% — сильный знак прогресса. Ты строишь привычки профессионального трейдера.",
      ],
      es: [
        "Consistencia al {n}% — la estructura operativa es estable. Este es el resultado de la repetición disciplinada — protege este nivel.",
        "Consistencia: {n}%. Estás operando con un patrón confiable. Mantén tu rutina y evita desviaciones bajo presión del mercado.",
        "Puntuación de consistencia {n}% — una señal fuerte de progreso. Estás construyendo los hábitos de un trader profesional.",
      ],
      fr: [
        "Cohérence à {n}% — la structure opérationnelle est stable. C'est le résultat d'une répétition disciplinée — protégez ce niveau.",
        "Cohérence: {n}%. Vous opérez selon un schéma fiable. Maintenez votre routine et évitez les déviations sous pression du marché.",
        "Score de cohérence {n}% — un signe fort de progrès. Vous construisez les habitudes d'un trader professionnel.",
      ],
      de: [
        "Konsistenz bei {n}% — die operative Struktur ist stabil. Das ist das Ergebnis disziplinierter Wiederholung — schütze dieses Niveau.",
        "Konsistenz: {n}%. Du arbeitest mit einem zuverlässigen Muster. Halte deine Routine bei und vermeide Abweichungen unter Marktdruck.",
        "Konsistenzwert {n}% — ein starkes Zeichen des Fortschritts. Du baust die Gewohnheiten eines professionellen Traders auf.",
      ],
    },
  },
  {
    id: "high-win-rate",
    condition: (d) => d.winRate >= 65 && d.totalTrades >= 10,
    priority: () => 110,
    value: (d) => d.winRate,
    texts: {
      it: [
        "Win rate al {n}% — i risultati sono forti. Mantieni la disciplina che ha prodotto questi esiti e non espandere verso setup di qualità inferiore.",
        "Win rate: {n}%. Il processo di selezione funziona. Concentrati su scalare la qualità, non la quantità.",
        "Win rate al {n}% — eccellente qualità di selezione. Sei in una fase operativa forte. Continua a fidarti del tuo processo.",
      ],
      en: [
        "Win rate at {n}% — results are strong. Maintain the discipline that produced these outcomes and do not expand into lower-quality setups.",
        "Win rate: {n}%. The setup selection process is working. Focus on scaling quality, not quantity.",
        "Win rate at {n}% — excellent selection quality. You are in a strong operational phase. Keep trusting your process.",
      ],
      uk: [
        "Відсоток виграшів {n}% — результати сильні. Підтримуй дисципліну, яка забезпечила ці результати, і не розширюйся на сетапи нижчої якості.",
        "Відсоток виграшів: {n}%. Процес відбору сетапів працює. Зосередься на масштабуванні якості, а не кількості.",
        "Відсоток виграшів {n}% — відмінна якість відбору. Ти в сильній операційній фазі. Продовжуй довіряти своєму процесу.",
      ],
      ru: [
        "Процент выигрышей {n}% — результаты сильные. Поддерживай дисциплину, которая обеспечила эти результаты, и не расширяйся на сетапы более низкого качества.",
        "Процент выигрышей: {n}%. Процесс отбора сетапов работает. Сосредоточься на масштабировании качества, а не количества.",
        "Процент выигрышей {n}% — отличное качество отбора. Ты в сильной операционной фазе. Продолжай доверять своему процессу.",
      ],
      es: [
        "Tasa de éxito al {n}% — los resultados son sólidos. Mantén la disciplina que produjo estos resultados y no te expandas hacia setups de menor calidad.",
        "Tasa de éxito: {n}%. El proceso de selección de setups funciona. Enfócate en escalar la calidad, no la cantidad.",
        "Tasa de éxito al {n}% — excelente calidad de selección. Estás en una fase operativa fuerte. Sigue confiando en tu proceso.",
      ],
      fr: [
        "Taux de réussite à {n}% — les résultats sont solides. Maintenez la discipline qui a produit ces résultats et n'expandez pas vers des setups de moindre qualité.",
        "Taux de réussite: {n}%. Le processus de sélection des setups fonctionne. Concentrez-vous sur l'amélioration de la qualité, pas de la quantité.",
        "Taux de réussite à {n}% — excellente qualité de sélection. Vous êtes dans une phase opérationnelle forte. Continuez à faire confiance à votre processus.",
      ],
      de: [
        "Win-Rate bei {n}% — die Ergebnisse sind stark. Halte die Disziplin aufrecht, die diese Ergebnisse erzeugt hat, und weite dich nicht auf Setups niedrigerer Qualität aus.",
        "Win-Rate: {n}%. Der Setup-Auswahlprozess funktioniert. Konzentriere dich darauf, Qualität zu skalieren, nicht Quantität.",
        "Win-Rate bei {n}% — ausgezeichnete Auswahlqualität. Du befindest dich in einer starken operativen Phase. Vertraue weiter deinem Prozess.",
      ],
    },
  },
  {
    id: "high-discipline",
    condition: (d) => d.disciplineScore >= 75,
    priority: () => 100,
    value: (d) => d.disciplineScore,
    texts: {
      it: [
        "Disciplina al {n}% — la base strutturale è solida. Proteggi questo livello non abbassando gli standard di esecuzione sotto pressione.",
        "Punteggio disciplina: {n}%. La fondazione operativa è forte. Mantieni questo standard e usalo come riferimento quando le condizioni di mercato cambiano.",
        "Disciplina al {n}% — ottimo lavoro. Questo livello di consistenza è ciò che separa i trader profittevoli. Continua a proteggerlo.",
      ],
      en: [
        "Discipline at {n}% — the structural base is solid. Protect this level by not lowering execution standards under pressure.",
        "Discipline score: {n}%. The operational foundation is strong. Maintain this standard and use it as a reference when market conditions shift.",
        "Discipline at {n}% — excellent work. This level of consistency is what separates profitable traders. Keep protecting it.",
      ],
      uk: [
        "Дисципліна {n}% — структурна основа міцна. Захищай цей рівень, не знижуючи стандарти виконання під тиском.",
        "Показник дисципліни: {n}%. Операційна основа сильна. Підтримуй цей стандарт і використовуй його як орієнтир при зміні ринкових умов.",
        "Дисципліна {n}% — відмінна робота. Цей рівень послідовності — те, що відрізняє прибуткових трейдерів.",
      ],
      ru: [
        "Дисциплина {n}% — структурная основа прочная. Защищай этот уровень, не снижая стандарты исполнения под давлением.",
        "Показатель дисциплины: {n}%. Операционная основа сильная. Поддерживай этот стандарт и используй его как ориентир при изменении рыночных условий.",
        "Дисциплина {n}% — отличная работа. Этот уровень последовательности — то, что отличает прибыльных трейдеров.",
      ],
      es: [
        "Disciplina al {n}% — la base estructural es sólida. Protege este nivel no bajando los estándares de ejecución bajo presión.",
        "Puntuación de disciplina: {n}%. La base operativa es sólida. Mantén este estándar y úsalo como referencia cuando las condiciones del mercado cambien.",
        "Disciplina al {n}% — excelente trabajo. Este nivel de consistencia es lo que separa a los traders rentables.",
      ],
      fr: [
        "Discipline à {n}% — la base structurelle est solide. Protégez ce niveau en ne baissant pas les standards d'exécution sous pression.",
        "Score de discipline: {n}%. La base opérationnelle est solide. Maintenez ce standard et utilisez-le comme référence lorsque les conditions du marché changent.",
        "Discipline à {n}% — excellent travail. Ce niveau de cohérence est ce qui sépare les traders rentables.",
      ],
      de: [
        "Disziplin bei {n}% — die strukturelle Basis ist solide. Schütze dieses Niveau, indem du die Ausführungsstandards unter Druck nicht senkst.",
        "Disziplinwert: {n}%. Die operative Grundlage ist stark. Halte diesen Standard aufrecht und nutze ihn als Referenz, wenn sich die Marktbedingungen ändern.",
        "Disziplin bei {n}% — ausgezeichnete Arbeit. Dieses Konsistenzniveau ist das, was profitable Trader unterscheidet.",
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Section 2 — RISCHIO
// ---------------------------------------------------------------------------

const RISCHIO: Observation[] = [
  {
    id: "loss-streak",
    condition: (d) => d.lossStreak >= 3,
    priority: (d) => 500 + d.lossStreak * 10,
    value: (d) => d.lossStreak,
    texts: {
      it: [
        "{n} perdite consecutive rilevate — segnale di stop obbligatorio. Non prendere altri trade prima di completare una revisione completa delle decisioni recenti.",
        "{n} perdite di fila. Analizza il filo conduttore tra questi trade e identifica cosa è cambiato nella tua esecuzione o selezione.",
        "{n} perdite consecutive — il mercato ti sta dando un segnale. Usa questa pausa per riconnetterti con i tuoi migliori criteri di setup.",
      ],
      en: [
        "{n} consecutive losses detected — mandatory stop signal. Do not take another trade before completing a full review of your recent decisions.",
        "{n} losses in a row. Review the common thread across these trades and identify what changed in your execution or selection.",
        "{n} consecutive losses — the market is sending you a signal. Use this pause to reconnect with your best setup criteria.",
      ],
      uk: [
        "{n} послідовних збитків виявлено — обов'язковий сигнал зупинки. Не відкривай нових угод, поки не завершиш повний огляд останніх рішень.",
        "{n} збитків поспіль. Проаналізуй спільну нитку між цими угодами і визнач, що змінилося у виконанні чи відборі.",
        "{n} послідовних збитків — ринок надсилає тобі сигнал. Використай цю паузу для відновлення зв'язку з кращими критеріями сетапу.",
      ],
      ru: [
        "{n} последовательных убытков обнаружено — обязательный сигнал остановки. Не открывай новых сделок, пока не завершишь полный обзор последних решений.",
        "{n} убытков подряд. Проанализируй общую нить между этими сделками и определи, что изменилось в исполнении или отборе.",
        "{n} последовательных убытков — рынок посылает тебе сигнал. Используй эту паузу для восстановления связи с лучшими критериями сетапа.",
      ],
      es: [
        "{n} pérdidas consecutivas detectadas — señal de parada obligatoria. No tomes otra operación antes de completar una revisión completa de tus decisiones recientes.",
        "{n} pérdidas seguidas. Analiza el hilo común entre estas operaciones e identifica qué cambió en tu ejecución o selección.",
        "{n} pérdidas consecutivas — el mercado te está enviando una señal. Usa esta pausa para reconectarte con tus mejores criterios de setup.",
      ],
      fr: [
        "{n} pertes consécutives détectées — signal d'arrêt obligatoire. Ne prenez pas d'autre trade avant de compléter une révision complète de vos décisions récentes.",
        "{n} pertes d'affilée. Analysez le fil conducteur entre ces trades et identifiez ce qui a changé dans votre exécution ou sélection.",
        "{n} pertes consécutives — le marché vous envoie un signal. Utilisez cette pause pour vous reconnecter avec vos meilleurs critères de setup.",
      ],
      de: [
        "{n} aufeinanderfolgende Verluste erkannt — obligatorisches Stoppsignal. Eröffne keinen weiteren Trade, bevor du eine vollständige Überprüfung deiner jüngsten Entscheidungen abgeschlossen hast.",
        "{n} Verluste in Folge. Analysiere den gemeinsamen Nenner dieser Trades und identifiziere, was sich in deiner Ausführung oder Auswahl geändert hat.",
        "{n} aufeinanderfolgende Verluste — der Markt sendet dir ein Signal. Nutze diese Pause, um dich wieder mit deinen besten Setup-Kriterien zu verbinden.",
      ],
    },
  },
  {
    id: "revenge-trading",
    condition: (d) => d.revengeRiskTrades >= 2,
    priority: (d) => 450 + d.revengeRiskTrades * 10,
    value: (d) => d.revengeRiskTrades,
    texts: {
      it: [
        "{n} segnali di revenge trading rilevati. Entrare dopo una perdita con metriche degradate è uno dei modi più veloci per amplificare le perdite — stop obbligatorio dopo ogni trade negativo.",
        "{n} potenziali trade per vendetta identificati. Dopo una perdita, allontanati prima del prossimo ingresso — il miglior trade successivo è spesso nessun trade.",
        "{n} segnali di trading dopo una perdita con qualità ridotta. Una pausa obbligatoria dopo le perdite non è debolezza — è strategia.",
      ],
      en: [
        "{n} revenge trading signals detected. Entering after a loss with degraded metrics is one of the fastest ways to compound losses — mandatory stop after every losing trade.",
        "{n} potential revenge trades identified. After a loss, step back before the next entry — the best next trade is usually no trade.",
        "{n} signals of trading after a loss with reduced quality. A mandatory pause after losses is not weakness — it is strategy.",
      ],
      uk: [
        "{n} сигналів revenge trading виявлено. Вхід після збитку з погіршеними метриками — один із найшвидших способів накопичити збитки.",
        "{n} потенційних реваншних угод ідентифіковано. Після збитку зроби крок назад перед наступним входом — найкращий наступний трейд — це часто відсутність угоди.",
        "{n} сигналів торгівлі після збитку зі зниженою якістю. Обов'язкова пауза після збитків — це не слабкість, це стратегія.",
      ],
      ru: [
        "{n} сигналов revenge trading обнаружено. Вход после убытка с ухудшенными метриками — один из самых быстрых способов накопить убытки.",
        "{n} потенциальных реваншных сделок идентифицировано. После убытка сделай шаг назад перед следующим входом — лучшая следующая сделка — это часто отсутствие сделки.",
        "{n} сигналов торговли после убытка со сниженным качеством. Обязательная пауза после убытков — это не слабость, это стратегия.",
      ],
      es: [
        "{n} señales de revenge trading detectadas. Entrar después de una pérdida con métricas degradadas es una de las formas más rápidas de acumular pérdidas.",
        "{n} posibles operaciones de venganza identificadas. Después de una pérdida, da un paso atrás antes de la siguiente entrada — la mejor siguiente operación suele ser ninguna.",
        "{n} señales de operar después de una pérdida con calidad reducida. Una pausa obligatoria después de pérdidas no es debilidad — es estrategia.",
      ],
      fr: [
        "{n} signaux de revenge trading détectés. Entrer après une perte avec des métriques dégradées est l'un des moyens les plus rapides d'amplifier les pertes.",
        "{n} trades de vengeance potentiels identifiés. Après une perte, reculez avant la prochaine entrée — le meilleur prochain trade est souvent aucun trade.",
        "{n} signaux de trading après une perte avec une qualité réduite. Une pause obligatoire après les pertes n'est pas une faiblesse — c'est une stratégie.",
      ],
      de: [
        "{n} Revenge-Trading-Signale erkannt. Nach einem Verlust mit verschlechterten Metriken einzusteigen, ist einer der schnellsten Wege, Verluste zu verstärken.",
        "{n} potenzielle Revenge-Trades identifiziert. Nach einem Verlust, tritt vor dem nächsten Einstieg zurück — der beste nächste Trade ist oft kein Trade.",
        "{n} Signale für Trading nach einem Verlust mit reduzierter Qualität. Eine obligatorische Pause nach Verlusten ist keine Schwäche — es ist Strategie.",
      ],
    },
  },
  {
    id: "high-risk",
    condition: (d) => d.behavioralRisk >= 50,
    priority: () => 400,
    value: (d) => d.behavioralRisk,
    texts: {
      it: [
        "Rischio comportamentale al {n}% — livello critico. Esecuzioni deboli, trade emotivi e bassa confidence si sommano. Stop, revisione, riduzione del sizing.",
        "Rischio comportamentale: {n}%. Più fattori di rischio sono attivi contemporaneamente. Riduci l'esposizione e completa una revisione di sessione prima di continuare.",
        "Rischio comportamentale al {n}% — questo è un segnale per fermarsi e resettare. Ogni trade saltato mentre il rischio è alto è una vittoria.",
      ],
      en: [
        "Behavioral risk at {n}% — critical level. Weak executions, emotional trades and low confidence are compounding. Stop, review, reduce size.",
        "Behavioral risk: {n}%. Multiple risk factors are active simultaneously. Reduce exposure and complete a session review before continuing.",
        "Behavioral risk at {n}% — this is a signal to pause and reset. Every trade you skip while the risk is high is a win.",
      ],
      uk: [
        "Поведінковий ризик {n}% — критичний рівень. Слабкі виконання, емоційні угоди та низька впевненість накопичуються. Стоп, огляд, зменшення розміру.",
        "Поведінковий ризик: {n}%. Декілька факторів ризику активні одночасно. Зменши експозицію і проведи огляд сесії перед продовженням.",
        "Поведінковий ризик {n}% — це сигнал для паузи і скидання. Кожна угода, яку ти пропускаєш при високому ризику — це перемога.",
      ],
      ru: [
        "Поведенческий риск {n}% — критический уровень. Слабые исполнения, эмоциональные сделки и низкая уверенность накапливаются. Стоп, обзор, снижение размера.",
        "Поведенческий риск: {n}%. Несколько факторов риска активны одновременно. Снизь экспозицию и проведи обзор сессии перед продолжением.",
        "Поведенческий риск {n}% — это сигнал для паузы и перезагрузки. Каждая сделка, которую ты пропускаешь при высоком риске — это победа.",
      ],
      es: [
        "Riesgo conductual al {n}% — nivel crítico. Ejecuciones débiles, operaciones emocionales y baja confianza se acumulan. Para, revisa, reduce el tamaño.",
        "Riesgo conductual: {n}%. Múltiples factores de riesgo están activos simultáneamente. Reduce la exposición y completa una revisión de sesión antes de continuar.",
        "Riesgo conductual al {n}% — esta es una señal para pausar y reiniciar. Cada operación que omites mientras el riesgo es alto es una victoria.",
      ],
      fr: [
        "Risque comportemental à {n}% — niveau critique. Exécutions faibles, trades émotionnels et faible confiance s'accumulent. Arrêtez, révisez, réduisez la taille.",
        "Risque comportemental: {n}%. Plusieurs facteurs de risque sont actifs simultanément. Réduisez l'exposition et complétez une révision de session avant de continuer.",
        "Risque comportemental à {n}% — c'est un signal pour faire une pause et se réinitialiser. Chaque trade que vous sautez lorsque le risque est élevé est une victoire.",
      ],
      de: [
        "Verhaltensrisiko bei {n}% — kritisches Niveau. Schwache Ausführungen, emotionale Trades und niedrige Confidence summieren sich. Stopp, Review, Größenreduzierung.",
        "Verhaltensrisiko: {n}%. Mehrere Risikofaktoren sind gleichzeitig aktiv. Reduziere das Exposure und schließe eine Session-Review ab, bevor du weitermachst.",
        "Verhaltensrisiko bei {n}% — das ist ein Signal zum Pausieren und Zurücksetzen. Jeder Trade, den du bei hohem Risiko auslässt, ist ein Sieg.",
      ],
    },
  },
  {
    id: "decay-signal",
    condition: (d) => d.executionDecay || d.confidenceDecay,
    priority: () => 300,
    value: () => 0,
    texts: {
      it: [
        "Rilevato deterioramento nelle metriche di esecuzione e/o confidence rispetto alle medie recenti. Questo pattern di decadimento richiede attenzione immediata — stringi i tuoi criteri.",
        "Un calo nella qualità di esecuzione o confidence è visibile. Rivedi i trade recenti e identifica dove ha avuto inizio il degrado.",
        "Le tue metriche mostrano un declino graduale. È un ciclo naturale — riconoscilo, adatta la tua routine e correggi rotta prima che peggiori.",
      ],
      en: [
        "Deterioration detected in execution and/or confidence metrics compared to recent averages. This decay pattern requires immediate attention — tighten your criteria.",
        "A decline in execution or confidence quality is visible. Review your recent trades and identify where the degradation started.",
        "Your metrics show a gradual decline. This is a natural cycle — acknowledge it, adjust your routine, and course-correct before it worsens.",
      ],
      uk: [
        "Виявлено погіршення в метриках виконання та/або впевненості порівняно з останніми середніми. Цей патерн занепаду вимагає негайної уваги — посили свої критерії.",
        "Видно зниження якості виконання або впевненості. Переглянь останні угоди і визнач, де почалося погіршення.",
        "Твої метрики показують поступове зниження. Це природний цикл — визнай це, скоригуй рутину і виправ курс до погіршення.",
      ],
      ru: [
        "Обнаружено ухудшение в метриках исполнения и/или уверенности по сравнению с последними средними. Этот паттерн деградации требует немедленного внимания — ужесточи свои критерии.",
        "Виден спад качества исполнения или уверенности. Пересмотри последние сделки и определи, где началась деградация.",
        "Твои метрики показывают постепенный спад. Это естественный цикл — признай это, скорректируй рутину и исправь курс до ухудшения.",
      ],
      es: [
        "Deterioro detectado en métricas de ejecución y/o confianza en comparación con los promedios recientes. Este patrón de deterioro requiere atención inmediata — endurece tus criterios.",
        "Se observa una disminución en la calidad de ejecución o confianza. Revisa tus operaciones recientes e identifica dónde comenzó la degradación.",
        "Tus métricas muestran una disminución gradual. Es un ciclo natural — reconócelo, ajusta tu rutina y corrige el rumbo antes de que empeore.",
      ],
      fr: [
        "Détérioration détectée dans les métriques d'exécution et/ou de confiance par rapport aux moyennes récentes. Ce pattern de dégradation nécessite une attention immédiate — resserrez vos critères.",
        "Un déclin de la qualité d'exécution ou de confiance est visible. Révisez vos trades récents et identifiez où la dégradation a commencé.",
        "Vos métriques montrent un déclin progressif. C'est un cycle naturel — reconnaissez-le, ajustez votre routine et corrigez le cap avant que cela s'aggrave.",
      ],
      de: [
        "Verschlechterung in Ausführungs- und/oder Confidence-Metriken im Vergleich zu jüngsten Durchschnittswerten erkannt. Dieses Verfallsmuster erfordert sofortige Aufmerksamkeit — verschärfe deine Kriterien.",
        "Ein Rückgang der Ausführungs- oder Confidence-Qualität ist sichtbar. Überprüfe deine letzten Trades und identifiziere, wo die Verschlechterung begann.",
        "Deine Metriken zeigen einen allmählichen Rückgang. Das ist ein natürlicher Zyklus — erkenne es, passe deine Routine an und korrigiere den Kurs, bevor es schlimmer wird.",
      ],
    },
  },
  {
    id: "moderate-risk",
    condition: (d) => d.behavioralRisk >= 25 && d.behavioralRisk < 50,
    priority: () => 200,
    value: (d) => d.behavioralRisk,
    texts: {
      it: [
        "Rischio comportamentale al {n}% — nella fascia accettabile ma da monitorare. Mantieni gli standard di esecuzione e il controllo emotivo.",
        "Rischio comportamentale: {n}%. Alcuni fattori di rischio sono presenti. Rivedi gli ultimi 5 trade e verifica la presenza di pattern nelle esecuzioni deboli.",
        "Rischio comportamentale al {n}% — gestibile. Mantieni forte la tua routine pre-trade e rimani coerente con le regole di ingresso.",
      ],
      en: [
        "Behavioral risk at {n}% — within acceptable range but worth monitoring. Maintain execution standards and emotional control.",
        "Behavioral risk: {n}%. Some risk factors are present. Review your last 5 trades and check for patterns in weak executions.",
        "Behavioral risk at {n}% — manageable. Keep your pre-trade routine strong and stay consistent with your entry rules.",
      ],
      uk: [
        "Поведінковий ризик {n}% — в прийнятному діапазоні, але варто спостерігати. Підтримуй стандарти виконання та емоційний контроль.",
        "Поведінковий ризик: {n}%. Деякі фактори ризику присутні. Переглянь останні 5 угод і перевір наявність патернів у слабких виконаннях.",
        "Поведінковий ризик {n}% — керований. Тримай свою рутину перед угодою сильною і залишайся послідовним у правилах входу.",
      ],
      ru: [
        "Поведенческий риск {n}% — в приемлемом диапазоне, но стоит наблюдать. Поддерживай стандарты исполнения и эмоциональный контроль.",
        "Поведенческий риск: {n}%. Некоторые факторы риска присутствуют. Пересмотри последние 5 сделок и проверь наличие паттернов в слабых исполнениях.",
        "Поведенческий риск {n}% — управляемый. Держи свою рутину перед сделкой сильной и оставайся последовательным в правилах входа.",
      ],
      es: [
        "Riesgo conductual al {n}% — dentro del rango aceptable pero vale la pena monitorear. Mantén los estándares de ejecución y el control emocional.",
        "Riesgo conductual: {n}%. Algunos factores de riesgo están presentes. Revisa tus últimas 5 operaciones y verifica patrones en ejecuciones débiles.",
        "Riesgo conductual al {n}% — manejable. Mantén fuerte tu rutina pre-operación y permanece consistente con tus reglas de entrada.",
      ],
      fr: [
        "Risque comportemental à {n}% — dans la plage acceptable mais mérite surveillance. Maintenez les standards d'exécution et le contrôle émotionnel.",
        "Risque comportemental: {n}%. Certains facteurs de risque sont présents. Révisez vos 5 derniers trades et vérifiez les patterns dans les exécutions faibles.",
        "Risque comportemental à {n}% — gérable. Maintenez votre routine pré-trade solide et restez cohérent avec vos règles d'entrée.",
      ],
      de: [
        "Verhaltensrisiko bei {n}% — im akzeptablen Bereich, aber überwachungswürdig. Halte Ausführungsstandards und emotionale Kontrolle aufrecht.",
        "Verhaltensrisiko: {n}%. Einige Risikofaktoren sind vorhanden. Überprüfe deine letzten 5 Trades und suche nach Mustern in schwachen Ausführungen.",
        "Verhaltensrisiko bei {n}% — handhabbar. Halte deine Pre-Trade-Routine stark und bleibe konsistent mit deinen Einstiegsregeln.",
      ],
    },
  },
  {
    id: "win-streak",
    condition: (d) => d.winStreak >= 3,
    priority: (d) => 120 + d.winStreak * 5,
    value: (d) => d.winStreak,
    texts: {
      it: [
        "{n} vittorie consecutive — fase forte. Mantieni criteri rigorosi e non lasciare che la fiducia in eccesso abbassi i tuoi standard di ingresso.",
        "{n} vittorie di fila. Il processo funziona. Mantieni la stessa disciplina e non espandere il rischio solo perché i risultati sono positivi.",
        "{n} vittorie consecutive — ottimo momento. Celebra il processo, non solo il risultato, e continua a fidarti dei tuoi criteri di setup.",
      ],
      en: [
        "{n} consecutive wins — strong phase. Maintain strict criteria and do not let overconfidence lower your entry standards.",
        "{n} wins in a row. The process is working. Keep the same discipline and avoid expanding your risk just because results are positive.",
        "{n} consecutive wins — great momentum. Celebrate the process, not just the outcome, and keep trusting your setup criteria.",
      ],
      uk: [
        "{n} послідовних виграшів — сильна фаза. Підтримуй суворі критерії і не дозволяй надмірній впевненості знизити стандарти входу.",
        "{n} виграшів поспіль. Процес працює. Дотримуйся тієї ж дисципліни і не розширюй ризик лише тому, що результати позитивні.",
        "{n} послідовних виграшів — відмінна динаміка. Святкуй процес, а не лише результат, і продовжуй довіряти критеріям сетапу.",
      ],
      ru: [
        "{n} последовательных выигрышей — сильная фаза. Поддерживай строгие критерии и не позволяй чрезмерной уверенности снижать стандарты входа.",
        "{n} выигрышей подряд. Процесс работает. Придерживайся той же дисциплины и не расширяй риск только потому, что результаты позитивные.",
        "{n} последовательных выигрышей — отличная динамика. Отмечай процесс, а не только результат, и продолжай доверять критериям сетапа.",
      ],
      es: [
        "{n} victorias consecutivas — fase fuerte. Mantén criterios estrictos y no dejes que la sobreconfianza baje tus estándares de entrada.",
        "{n} victorias seguidas. El proceso está funcionando. Mantén la misma disciplina y evita expandir tu riesgo solo porque los resultados son positivos.",
        "{n} victorias consecutivas — gran impulso. Celebra el proceso, no solo el resultado, y sigue confiando en tus criterios de setup.",
      ],
      fr: [
        "{n} victoires consécutives — phase forte. Maintenez des critères stricts et ne laissez pas la surconfiance abaisser vos standards d'entrée.",
        "{n} victoires d'affilée. Le processus fonctionne. Gardez la même discipline et évitez d'augmenter votre risque juste parce que les résultats sont positifs.",
        "{n} victoires consécutives — excellent élan. Célébrez le processus, pas seulement le résultat, et continuez à faire confiance à vos critères de setup.",
      ],
      de: [
        "{n} aufeinanderfolgende Gewinne — starke Phase. Halte strenge Kriterien aufrecht und lass Überconfidence nicht deine Einstiegsstandards senken.",
        "{n} Gewinne in Folge. Der Prozess funktioniert. Halte die gleiche Disziplin aufrecht und weite das Risiko nicht aus, nur weil die Ergebnisse positiv sind.",
        "{n} aufeinanderfolgende Gewinne — toller Schwung. Feiere den Prozess, nicht nur das Ergebnis, und vertraue weiter deinen Setup-Kriterien.",
      ],
    },
  },
  {
    id: "low-risk",
    condition: (d) => d.behavioralRisk < 25 && d.totalTrades >= 5,
    priority: () => 100,
    value: (d) => d.behavioralRisk,
    texts: {
      it: [
        "Rischio comportamentale al {n}% — sotto controllo. La struttura operativa è pulita. Proteggi questo livello mantenendo criteri di selezione rigorosi.",
        "Rischio comportamentale: {n}%. Le metriche di rischio sono sane. Continua con la stessa disciplina ed evita trade al di fuori dei tuoi setup di prima scelta.",
        "Rischio comportamentale al {n}% — eccellente fondamento. Stai operando in modo pulito. Questo è il risultato della coerenza nel seguire il processo.",
      ],
      en: [
        "Behavioral risk at {n}% — controlled. The operating structure is clean. Protect this level by maintaining strict selection criteria.",
        "Behavioral risk: {n}%. Risk metrics are healthy. Continue with the same discipline and avoid trades outside your A-list setups.",
        "Behavioral risk at {n}% — excellent foundation. You are operating cleanly. This is the result of consistent process adherence.",
      ],
      uk: [
        "Поведінковий ризик {n}% — під контролем. Операційна структура чиста. Захищай цей рівень, підтримуючи суворі критерії відбору.",
        "Поведінковий ризик: {n}%. Метрики ризику здорові. Продовжуй з тією ж дисципліною та уникай угод поза своїми кращими сетапами.",
        "Поведінковий ризик {n}% — відмінна основа. Ти працюєш чисто. Це результат послідовного дотримання процесу.",
      ],
      ru: [
        "Поведенческий риск {n}% — под контролем. Операционная структура чистая. Защищай этот уровень, поддерживая строгие критерии отбора.",
        "Поведенческий риск: {n}%. Метрики риска здоровые. Продолжай с той же дисциплиной и избегай сделок вне своих лучших сетапов.",
        "Поведенческий риск {n}% — отличная основа. Ты работаешь чисто. Это результат последовательного соблюдения процесса.",
      ],
      es: [
        "Riesgo conductual al {n}% — controlado. La estructura operativa es limpia. Protege este nivel manteniendo criterios de selección estrictos.",
        "Riesgo conductual: {n}%. Las métricas de riesgo son saludables. Continúa con la misma disciplina y evita operaciones fuera de tus mejores setups.",
        "Riesgo conductual al {n}% — excelente fundamento. Estás operando limpiamente. Este es el resultado de la adherencia consistente al proceso.",
      ],
      fr: [
        "Risque comportemental à {n}% — contrôlé. La structure opérationnelle est propre. Protégez ce niveau en maintenant des critères de sélection stricts.",
        "Risque comportemental: {n}%. Les métriques de risque sont saines. Continuez avec la même discipline et évitez les trades en dehors de vos meilleurs setups.",
        "Risque comportemental à {n}% — excellent fondement. Vous opérez proprement. C'est le résultat d'une adhérence cohérente au processus.",
      ],
      de: [
        "Verhaltensrisiko bei {n}% — kontrolliert. Die operative Struktur ist sauber. Schütze dieses Niveau durch strenge Auswahlkriterien.",
        "Verhaltensrisiko: {n}%. Die Risikometriken sind gesund. Fahre mit der gleichen Disziplin fort und vermeide Trades außerhalb deiner besten Setups.",
        "Verhaltensrisiko bei {n}% — ausgezeichnetes Fundament. Du operierst sauber. Das ist das Ergebnis konsistenter Prozesstreue.",
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Section 3 — PSICOLOGIA
// ---------------------------------------------------------------------------

const PSICOLOGIA: Observation[] = [
  {
    id: "session-locked",
    condition: (d) => d.sessionLocked,
    priority: () => 1000,
    value: () => 0,
    texts: {
      it: [
        "VOLTIS ha bloccato questa sessione per rischio operativo elevato. Non prendere nuovi trade finché non completi una revisione obbligatoria. La gestione del rischio è la priorità assoluta.",
        "Il blocco sessione è attivo. Continuare a operare nelle condizioni attuali aumenterebbe l'esposizione al rischio. Completa una revisione prima di rientrare.",
        "Il blocco sessione è una misura protettiva, non una punizione. Usa questo tempo per rivedere, resettare e tornare più forte.",
      ],
      en: [
        "VOLTIS has locked this session due to elevated operational risk. Do not take new trades until completing a mandatory review. Risk management is the absolute priority.",
        "Session lock is active. Continuing to trade under current conditions would increase risk exposure. Complete a review before re-entering.",
        "A session lock is a protective measure, not a punishment. Use this time to review, reset and come back stronger.",
      ],
      uk: [
        "VOLTIS заблокував цю сесію через підвищений операційний ризик. Не відкривай нових угод, поки не завершиш обов'язковий огляд. Управління ризиком — абсолютний пріоритет.",
        "Блокування сесії активне. Продовження торгівлі за поточних умов збільшить ризикову експозицію. Заверши огляд перед поверненням.",
        "Блокування сесії — захисна міра, а не покарання. Використай цей час для огляду, скидання і повернення сильнішим.",
      ],
      ru: [
        "VOLTIS заблокировал эту сессию из-за повышенного операционного риска. Не открывай новых сделок, пока не завершишь обязательный обзор. Управление риском — абсолютный приоритет.",
        "Блокировка сессии активна. Продолжение торговли в текущих условиях увеличит рисковую экспозицию. Заверши обзор перед возвращением.",
        "Блокировка сессии — защитная мера, а не наказание. Используй это время для обзора, перезагрузки и возвращения более сильным.",
      ],
      es: [
        "VOLTIS ha bloqueado esta sesión por riesgo operativo elevado. No tomes nuevas operaciones hasta completar una revisión obligatoria. La gestión del riesgo es la prioridad absoluta.",
        "El bloqueo de sesión está activo. Continuar operando en las condiciones actuales aumentaría la exposición al riesgo. Completa una revisión antes de volver.",
        "Un bloqueo de sesión es una medida protectora, no un castigo. Usa este tiempo para revisar, resetear y volver más fuerte.",
      ],
      fr: [
        "VOLTIS a bloqué cette session en raison d'un risque opérationnel élevé. Ne prenez pas de nouveaux trades avant de compléter une révision obligatoire. La gestion du risque est la priorité absolue.",
        "Le blocage de session est actif. Continuer à trader dans les conditions actuelles augmenterait l'exposition au risque. Complétez une révision avant de revenir.",
        "Un blocage de session est une mesure protectrice, pas une punition. Utilisez ce temps pour réviser, réinitialiser et revenir plus fort.",
      ],
      de: [
        "VOLTIS hat diese Session aufgrund erhöhten operativen Risikos gesperrt. Eröffne keine neuen Trades, bevor du eine obligatorische Überprüfung abgeschlossen hast. Risikomanagement ist die absolute Priorität.",
        "Sessionsperre ist aktiv. Unter den aktuellen Bedingungen weiter zu handeln würde das Risikoexposure erhöhen. Schließe eine Überprüfung ab, bevor du zurückkehrst.",
        "Eine Sessionsperre ist eine Schutzmaßnahme, keine Strafe. Nutze diese Zeit zum Überprüfen, Zurücksetzen und Stärker-Zurückkehren.",
      ],
    },
  },
  {
    id: "high-emotional",
    condition: (d) => d.emotionalInstabilityScore >= 60,
    priority: () => 500,
    value: (d) => d.emotionalInstabilityScore,
    texts: {
      it: [
        "Instabilità emotiva al {n}% — critica. Gli stati emotivi stanno interferendo con la chiarezza operativa. Pausa obbligatoria e revisione prima di qualsiasi nuovo trade.",
        "Instabilità emotiva al {n}%. I pattern emotivi stanno impattando significativamente la qualità delle decisioni. Fai un passo indietro e ripristina la chiarezza mentale.",
        "Instabilità emotiva al {n}% — la tua mente sta lavorando contro la tua strategia. Riposa, resetta e torna con la testa libera.",
      ],
      en: [
        "Emotional instability at {n}% — critical. Emotional states are interfering with operational clarity. Mandatory break and review before any new trade.",
        "Emotional instability at {n}%. Emotional patterns are significantly impacting decision quality. Step back and restore mental clarity.",
        "Emotional instability at {n}% — your mind is working against your strategy. Rest, reset, and return with a clear head.",
      ],
      uk: [
        "Емоційна нестабільність {n}% — критична. Емоційні стани заважають операційній ясності. Обов'язкова перерва і огляд перед будь-якою новою угодою.",
        "Емоційна нестабільність {n}%. Емоційні патерни суттєво впливають на якість рішень. Відступи і відновлюй ментальну ясність.",
        "Емоційна нестабільність {n}% — твій розум працює проти твоєї стратегії. Відпочинь, скинь і повернись з ясною головою.",
      ],
      ru: [
        "Эмоциональная нестабильность {n}% — критическая. Эмоциональные состояния мешают операционной ясности. Обязательная пауза и обзор перед любой новой сделкой.",
        "Эмоциональная нестабильность {n}%. Эмоциональные паттерны существенно влияют на качество решений. Отступи и восстанови ментальную ясность.",
        "Эмоциональная нестабильность {n}% — твой разум работает против твоей стратегии. Отдохни, перезагрузись и вернись с ясной головой.",
      ],
      es: [
        "Inestabilidad emocional al {n}% — crítica. Los estados emocionales están interfiriendo con la claridad operativa. Pausa obligatoria y revisión antes de cualquier nueva operación.",
        "Inestabilidad emocional al {n}%. Los patrones emocionales están impactando significativamente la calidad de las decisiones. Da un paso atrás y restaura la claridad mental.",
        "Inestabilidad emocional al {n}% — tu mente está trabajando contra tu estrategia. Descansa, resetea y vuelve con la cabeza despejada.",
      ],
      fr: [
        "Instabilité émotionnelle à {n}% — critique. Les états émotionnels interfèrent avec la clarté opérationnelle. Pause obligatoire et révision avant tout nouveau trade.",
        "Instabilité émotionnelle à {n}%. Les patterns émotionnels impactent significativement la qualité des décisions. Prenez du recul et restaurez la clarté mentale.",
        "Instabilité émotionnelle à {n}% — votre esprit travaille contre votre stratégie. Reposez-vous, réinitialisez et revenez avec la tête libre.",
      ],
      de: [
        "Emotionale Instabilität bei {n}% — kritisch. Emotionale Zustände beeinträchtigen die operative Klarheit. Obligatorische Pause und Überprüfung vor jedem neuen Trade.",
        "Emotionale Instabilität bei {n}%. Emotionale Muster beeinflussen die Entscheidungsqualität erheblich. Tritt zurück und stelle mentale Klarheit wieder her.",
        "Emotionale Instabilität bei {n}% — dein Geist arbeitet gegen deine Strategie. Ruh dich aus, setze zurück und kehre mit klarem Kopf zurück.",
      ],
    },
  },
  {
    id: "behavioral-drift",
    condition: (d) => d.behavioralDrift,
    priority: () => 400,
    value: () => 0,
    texts: {
      it: [
        "Rilevato drift comportamentale: le performance recenti si sono deteriorate significativamente rispetto alla tua baseline. Questo è un avviso strutturale — rivedi il tuo processo decisionale.",
        "Un deterioramento nella qualità operativa è visibile tra i tuoi trade recenti e quelli precedenti. Identifica cosa è cambiato e torna alla tua routine collaudata.",
        "I tuoi trade recenti mostrano un drift rispetto al tuo periodo migliore. È correggibile — riconnettiti con ciò che funzionava e ricostruisci la tua routine.",
      ],
      en: [
        "Behavioral drift detected: recent performance has degraded significantly from your baseline. This is a structural warning — review your decision-making process.",
        "A deterioration in operational quality is visible between your recent and previous trades. Identify what changed and return to your proven routine.",
        "Your recent trades show a drift from your better period. This is correctable — reconnect with what worked and rebuild your routine.",
      ],
      uk: [
        "Виявлено поведінковий дрейф: останні показники суттєво погіршились порівняно з базовим рівнем. Це структурне попередження — переглянь свій процес прийняття рішень.",
        "Погіршення операційної якості видно між останніми і попередніми угодами. Визнач, що змінилось, і повернись до перевіреної рутини.",
        "Твої останні угоди показують дрейф від кращого періоду. Це піддається корекції — відновіть зв'язок з тим, що працювало.",
      ],
      ru: [
        "Обнаружен поведенческий дрейф: последние показатели существенно ухудшились по сравнению с базовым уровнем. Это структурное предупреждение — пересмотри свой процесс принятия решений.",
        "Ухудшение операционного качества видно между последними и предыдущими сделками. Определи, что изменилось, и вернись к проверенной рутине.",
        "Твои последние сделки показывают дрейф от лучшего периода. Это поддается коррекции — восстанови связь с тем, что работало.",
      ],
      es: [
        "Deriva conductual detectada: el rendimiento reciente se ha deteriorado significativamente desde tu línea base. Esta es una advertencia estructural — revisa tu proceso de toma de decisiones.",
        "Un deterioro en la calidad operativa es visible entre tus operaciones recientes y anteriores. Identifica qué cambió y vuelve a tu rutina probada.",
        "Tus operaciones recientes muestran una deriva de tu mejor período. Es corregible — reconéctate con lo que funcionaba y reconstruye tu rutina.",
      ],
      fr: [
        "Dérive comportementale détectée: les performances récentes se sont dégradées significativement par rapport à votre ligne de base. C'est un avertissement structurel — révisez votre processus décisionnel.",
        "Une dégradation de la qualité opérationnelle est visible entre vos trades récents et précédents. Identifiez ce qui a changé et revenez à votre routine éprouvée.",
        "Vos trades récents montrent une dérive par rapport à votre meilleure période. C'est corrigible — reconnectez-vous avec ce qui fonctionnait et reconstruisez votre routine.",
      ],
      de: [
        "Verhaltens-Drift erkannt: die jüngste Performance hat sich im Vergleich zur Baseline erheblich verschlechtert. Das ist eine strukturelle Warnung — überprüfe deinen Entscheidungsprozess.",
        "Eine Verschlechterung der operativen Qualität ist zwischen deinen letzten und vorherigen Trades sichtbar. Identifiziere, was sich geändert hat, und kehre zu deiner bewährten Routine zurück.",
        "Deine letzten Trades zeigen einen Drift von deiner besseren Phase. Das ist korrigierbar — verbinde dich wieder mit dem, was funktioniert hat.",
      ],
    },
  },
  {
    id: "moderate-emotional",
    condition: (d) => d.emotionalTrades >= 3 && d.emotionalInstabilityScore < 60,
    priority: (d) => 300 + d.emotionalTrades * 3,
    value: (d) => d.emotionalTrades,
    texts: {
      it: [
        "{n} trade mostrano una componente emotiva. Il trading emotivo è un pattern che deve essere gestito attivamente — registra il tuo stato prima di ogni ingresso.",
        "{n} trade con stati emotivi registrati. Traccia le emozioni che compaiono più frequentemente e costruisci un filtro nella tua routine pre-trade.",
        "{n} trade con consapevolezza emotiva registrata. Riconoscere il tuo stato emotivo è il primo passo — ora usalo per filtrare gli ingressi.",
      ],
      en: [
        "{n} trades show an emotional component. Emotional trading is a pattern that must be actively managed — log your state before each entry.",
        "{n} trades with emotional states recorded. Track the emotions that appear most frequently and build a filter into your pre-trade routine.",
        "{n} trades with emotional awareness logged. Recognizing your emotional state is the first step — now use it to filter your entries.",
      ],
      uk: [
        "{n} угод показують емоційну компоненту. Емоційна торгівля — це патерн, яким треба активно керувати — реєструй свій стан перед кожним входом.",
        "{n} угод із зафіксованими емоційними станами. Відстежуй емоції, що з'являються найчастіше, і будуй фільтр у рутині перед угодою.",
        "{n} угод із зафіксованою емоційною усвідомленістю. Визнання емоційного стану — це перший крок — тепер використовуй це для фільтрації входів.",
      ],
      ru: [
        "{n} сделок показывают эмоциональную компоненту. Эмоциональная торговля — это паттерн, которым нужно активно управлять — регистрируй свое состояние перед каждым входом.",
        "{n} сделок с зафиксированными эмоциональными состояниями. Отслеживай эмоции, которые появляются чаще всего, и строй фильтр в рутине перед сделкой.",
        "{n} сделок с зафиксированной эмоциональной осознанностью. Признание эмоционального состояния — это первый шаг — теперь используй это для фильтрации входов.",
      ],
      es: [
        "{n} operaciones muestran un componente emocional. El trading emocional es un patrón que debe gestionarse activamente — registra tu estado antes de cada entrada.",
        "{n} operaciones con estados emocionales registrados. Rastrea las emociones que aparecen con más frecuencia y construye un filtro en tu rutina pre-operación.",
        "{n} operaciones con conciencia emocional registrada. Reconocer tu estado emocional es el primer paso — ahora úsalo para filtrar tus entradas.",
      ],
      fr: [
        "{n} trades montrent une composante émotionnelle. Le trading émotionnel est un pattern qui doit être géré activement — enregistrez votre état avant chaque entrée.",
        "{n} trades avec des états émotionnels enregistrés. Suivez les émotions qui apparaissent le plus fréquemment et construisez un filtre dans votre routine pré-trade.",
        "{n} trades avec conscience émotionnelle enregistrée. Reconnaître votre état émotionnel est la première étape — utilisez-le maintenant pour filtrer vos entrées.",
      ],
      de: [
        "{n} Trades zeigen eine emotionale Komponente. Emotionales Trading ist ein Muster, das aktiv gemanagt werden muss — erfasse deinen Zustand vor jedem Einstieg.",
        "{n} Trades mit aufgezeichneten emotionalen Zuständen. Verfolge die Emotionen, die am häufigsten auftreten, und baue einen Filter in deine Pre-Trade-Routine ein.",
        "{n} Trades mit erfasster emotionaler Bewusstheit. Das Erkennen deines emotionalen Zustands ist der erste Schritt — nutze es jetzt zur Filterung deiner Einstiege.",
      ],
    },
  },
  {
    id: "strong-recovery",
    condition: (d) => d.recoveryDetected && d.recoveryScore >= 60,
    priority: (d) => 200 + d.recoveryScore,
    value: (d) => d.recoveryScore,
    texts: {
      it: [
        "Recovery rilevato — punteggio {n}%. I trade recenti mostrano un ritorno alla qualità. Mantieni la disciplina che ha guidato questo miglioramento.",
        "Punteggio recovery: {n}%. Stai tornando da una fase difficile. Continua con lo stesso processo che ha invertito il trend.",
        "Punteggio recovery {n}% — resilienza notevole. Hai identificato il problema e lo hai corretto. Continua a costruire su questo slancio.",
      ],
      en: [
        "Recovery detected — score {n}%. The recent trades show a return to quality. Maintain the discipline that drove this improvement.",
        "Recovery score: {n}%. You are coming back from a difficult phase. Keep the same process that reversed the trend.",
        "Recovery score {n}% — impressive resilience. You identified what was wrong and corrected it. Keep building on this momentum.",
      ],
      uk: [
        "Виявлено відновлення — показник {n}%. Останні угоди показують повернення до якості. Підтримуй дисципліну, яка зумовила це покращення.",
        "Показник відновлення: {n}%. Ти повертаєшся з важкої фази. Продовжуй з тим самим процесом, який змінив тренд.",
        "Показник відновлення {n}% — вражаюча стійкість. Ти визначив проблему і виправив її. Продовжуй нарощувати цей імпульс.",
      ],
      ru: [
        "Обнаружено восстановление — показатель {n}%. Последние сделки показывают возвращение к качеству. Поддерживай дисциплину, которая обусловила это улучшение.",
        "Показатель восстановления: {n}%. Ты возвращаешься из трудной фазы. Продолжай с тем же процессом, который изменил тренд.",
        "Показатель восстановления {n}% — впечатляющая устойчивость. Ты определил проблему и исправил её. Продолжай наращивать этот импульс.",
      ],
      es: [
        "Recuperación detectada — puntuación {n}%. Las operaciones recientes muestran un retorno a la calidad. Mantén la disciplina que impulsó esta mejora.",
        "Puntuación de recuperación: {n}%. Estás volviendo de una fase difícil. Sigue con el mismo proceso que invirtió la tendencia.",
        "Puntuación de recuperación {n}% — resiliencia impresionante. Identificaste el problema y lo corregiste. Sigue construyendo sobre este impulso.",
      ],
      fr: [
        "Récupération détectée — score {n}%. Les trades récents montrent un retour à la qualité. Maintenez la discipline qui a conduit cette amélioration.",
        "Score de récupération: {n}%. Vous revenez d'une phase difficile. Continuez avec le même processus qui a inversé la tendance.",
        "Score de récupération {n}% — résilience impressionnante. Vous avez identifié le problème et l'avez corrigé. Continuez à construire sur cet élan.",
      ],
      de: [
        "Erholung erkannt — Score {n}%. Die letzten Trades zeigen eine Rückkehr zur Qualität. Halte die Disziplin aufrecht, die diese Verbesserung vorangetrieben hat.",
        "Erholungs-Score: {n}%. Du kommst aus einer schwierigen Phase zurück. Halte denselben Prozess aufrecht, der den Trend umgekehrt hat.",
        "Erholungs-Score {n}% — beeindruckende Resilienz. Du hast das Problem identifiziert und korrigiert. Baue weiter auf diesem Schwung auf.",
      ],
    },
  },
  {
    id: "strict-coaching",
    condition: (d) => d.coachingTone === "strict",
    priority: () => 150,
    value: () => 0,
    texts: {
      it: [
        "VOLTIS ha attivato la modalità supervisione rigorosa. Il pattern attuale richiede una correzione ferma. Ogni trade deve soddisfare i criteri di ingresso completi — nessuna eccezione.",
        "La modalità coaching rigoroso è attiva. Significa che il pattern comportamentale attuale necessita di correzione immediata e coerente su ogni trade.",
        "Sei in una fase che richiede disciplina extra. La modalità rigorosa è attiva — usala come framework per ricostruire le tue abitudini operative.",
      ],
      en: [
        "VOLTIS has activated strict supervision mode. The current pattern requires firm correction. Every trade must meet full entry criteria — no exceptions.",
        "Strict coaching mode is active. The current behavioral pattern needs immediate and consistent correction across every trade.",
        "You are in a phase that requires extra discipline. Strict mode is active — use it as a framework to rebuild your operational habits.",
      ],
      uk: [
        "VOLTIS активував режим суворого нагляду. Поточний патерн вимагає твердої корекції. Кожна угода повинна відповідати повним критеріям входу — без винятків.",
        "Режим суворого коучингу активний. Поточний поведінковий патерн потребує негайної і послідовної корекції в кожній угоді.",
        "Ти в фазі, яка вимагає додаткової дисципліни. Суворий режим активний — використовуй його як рамку для відновлення операційних звичок.",
      ],
      ru: [
        "VOLTIS активировал режим строгого надзора. Текущий паттерн требует твердой коррекции. Каждая сделка должна соответствовать полным критериям входа — без исключений.",
        "Режим строгого коучинга активен. Текущий поведенческий паттерн требует немедленной и последовательной коррекции в каждой сделке.",
        "Ты в фазе, которая требует дополнительной дисциплины. Строгий режим активен — используй его как рамку для восстановления операционных привычек.",
      ],
      es: [
        "VOLTIS ha activado el modo de supervisión estricta. El patrón actual requiere corrección firme. Cada operación debe cumplir todos los criterios de entrada — sin excepciones.",
        "El modo de coaching estricto está activo. El patrón conductual actual necesita corrección inmediata y consistente en cada operación.",
        "Estás en una fase que requiere disciplina extra. El modo estricto está activo — úsalo como marco para reconstruir tus hábitos operativos.",
      ],
      fr: [
        "VOLTIS a activé le mode de supervision stricte. Le pattern actuel nécessite une correction ferme. Chaque trade doit répondre à tous les critères d'entrée — sans exception.",
        "Le mode coaching strict est actif. Le pattern comportemental actuel nécessite une correction immédiate et cohérente sur chaque trade.",
        "Vous êtes dans une phase qui nécessite une discipline supplémentaire. Le mode strict est actif — utilisez-le comme cadre pour reconstruire vos habitudes opérationnelles.",
      ],
      de: [
        "VOLTIS hat den strikten Überwachungsmodus aktiviert. Das aktuelle Muster erfordert eine feste Korrektur. Jeder Trade muss alle Einstiegskriterien erfüllen — keine Ausnahmen.",
        "Strikter Coaching-Modus ist aktiv. Das aktuelle Verhaltensmuster benötigt sofortige und konsistente Korrektur bei jedem Trade.",
        "Du befindest dich in einer Phase, die zusätzliche Disziplin erfordert. Der strikte Modus ist aktiv — nutze ihn als Rahmen, um deine operativen Gewohnheiten neu aufzubauen.",
      ],
    },
  },
  {
    id: "psychological-stability",
    condition: (d) =>
      !d.emotionalVolatility &&
      d.emotionalInstabilityScore < 30 &&
      d.totalTrades >= 5,
    priority: () => 100,
    value: (d) => d.emotionalInstabilityScore,
    texts: {
      it: [
        "Instabilità emotiva al {n}% — la base psicologica è solida. Mantieni questo stato evitando la sovraesposizione e rispettando i tuoi limiti.",
        "La stabilità emotiva è forte ({n}% di instabilità). La chiarezza mentale supporta decisioni migliori. Proteggila gestendo la durata delle tue sessioni.",
        "Stabilità emotiva al {n}% di instabilità — eccellente fondamento mentale. La tua chiarezza psicologica è un asset. Continua a renderla prioritaria.",
      ],
      en: [
        "Emotional instability at {n}% — the psychological foundation is sound. Maintain this state by avoiding overexposure and respecting your limits.",
        "Emotional stability is strong ({n}% instability). Mental clarity supports better decision-making. Protect it by managing your session length.",
        "Emotional instability at {n}% — excellent mental foundation. Your psychological clarity is an asset. Continue to prioritize it.",
      ],
      uk: [
        "Емоційна нестабільність {n}% — психологічна основа міцна. Підтримуй цей стан, уникаючи надмірної експозиції і поважаючи свої ліміти.",
        "Емоційна стабільність сильна ({n}% нестабільності). Ментальна ясність підтримує кращі рішення. Захищай її, керуючи тривалістю сесій.",
        "Емоційна нестабільність {n}% — відмінна ментальна основа. Твоя психологічна ясність — це актив. Продовжуй ставити її в пріоритет.",
      ],
      ru: [
        "Эмоциональная нестабильность {n}% — психологическая основа прочная. Поддерживай это состояние, избегая чрезмерной экспозиции и уважая свои лимиты.",
        "Эмоциональная стабильность сильная ({n}% нестабильности). Ментальная ясность поддерживает лучшие решения. Защищай её, управляя продолжительностью сессий.",
        "Эмоциональная нестабильность {n}% — отличная ментальная основа. Твоя психологическая ясность — это актив. Продолжай ставить её в приоритет.",
      ],
      es: [
        "Inestabilidad emocional al {n}% — la base psicológica es sólida. Mantén este estado evitando la sobreexposición y respetando tus límites.",
        "La estabilidad emocional es fuerte ({n}% de inestabilidad). La claridad mental apoya mejores decisiones. Protégela gestionando la duración de tus sesiones.",
        "Inestabilidad emocional al {n}% — excelente base mental. Tu claridad psicológica es un activo. Continúa priorizándola.",
      ],
      fr: [
        "Instabilité émotionnelle à {n}% — la base psychologique est solide. Maintenez cet état en évitant la surexposition et en respectant vos limites.",
        "La stabilité émotionnelle est forte ({n}% d'instabilité). La clarté mentale soutient de meilleures décisions. Protégez-la en gérant la durée de vos sessions.",
        "Instabilité émotionnelle à {n}% — excellente base mentale. Votre clarté psychologique est un atout. Continuez à la prioriser.",
      ],
      de: [
        "Emotionale Instabilität bei {n}% — die psychologische Grundlage ist solide. Halte diesen Zustand aufrecht, indem du Überexposure vermeidest und deine Grenzen respektierst.",
        "Emotionale Stabilität ist stark ({n}% Instabilität). Mentale Klarheit unterstützt bessere Entscheidungen. Schütze sie, indem du deine Session-Länge managst.",
        "Emotionale Instabilität bei {n}% — ausgezeichnete mentale Grundlage. Deine psychologische Klarheit ist ein Asset. Fahre fort, sie zu priorisieren.",
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Opening and closing sentences
// ---------------------------------------------------------------------------

const OPENING: Record<AppLanguage, Variant> = {
  it: [
    "Analisi operativa VOLTIS — rilevamento completato su tutti i trade registrati.",
    "Ecco la tua analisi operativa basata sui dati di trading attuali.",
    "Analisi personalizzata del tuo andamento — una panoramica di dove sei e dove puoi arrivare.",
  ],
  en: [
    "VOLTIS operational analysis — detection completed across all recorded trades.",
    "Here is your operational analysis based on current trading data.",
    "Personalized performance analysis — an overview of where you stand and where you can go.",
  ],
  uk: [
    "Операційний аналіз VOLTIS — виявлення завершено по всіх зареєстрованих угодах.",
    "Ось твій операційний аналіз на основі поточних даних торгівлі.",
    "Персоналізований аналіз результатів — огляд того, де ти знаходишся і куди можеш прийти.",
  ],
  ru: [
    "Операционный анализ VOLTIS — обнаружение завершено по всем зафиксированным сделкам.",
    "Вот твой операционный анализ на основе текущих данных торговли.",
    "Персонализированный анализ результатов — обзор того, где ты находишься и куда можешь прийти.",
  ],
  es: [
    "Análisis operativo VOLTIS — detección completada en todas las operaciones registradas.",
    "Aquí está tu análisis operativo basado en los datos de trading actuales.",
    "Análisis de rendimiento personalizado — una visión de dónde estás y adónde puedes llegar.",
  ],
  fr: [
    "Analyse opérationnelle VOLTIS — détection complétée sur tous les trades enregistrés.",
    "Voici votre analyse opérationnelle basée sur les données de trading actuelles.",
    "Analyse de performance personnalisée — un aperçu de où vous en êtes et où vous pouvez aller.",
  ],
  de: [
    "VOLTIS-Betriebsanalyse — Erkennung über alle aufgezeichneten Trades abgeschlossen.",
    "Hier ist deine operative Analyse basierend auf aktuellen Trading-Daten.",
    "Personalisierte Performance-Analyse — ein Überblick darüber, wo du stehst und wohin du gehen kannst.",
  ],
};

const CLOSING: Record<AppLanguage, Variant> = {
  it: [
    "Applica questi segnali immediatamente. La disciplina sotto pressione è ciò che distingue i professionisti.",
    "Usa questi dati per guidare le prossime decisioni operative. La coerenza è la chiave.",
    "Ogni osservazione qui è un'opportunità di crescita. Continua a lavorare con intenzione.",
  ],
  en: [
    "Apply these signals immediately. Discipline under pressure is what separates professionals.",
    "Use these insights to guide your next operational decisions. Consistency is the key.",
    "Every observation here is an opportunity to grow. Keep working with intention.",
  ],
  uk: [
    "Застосовуй ці сигнали негайно. Дисципліна під тиском — це те, що відрізняє професіоналів.",
    "Використовуй ці дані для керування наступними операційними рішеннями. Послідовність — це ключ.",
    "Кожне спостереження тут — це можливість для зростання. Продовжуй працювати з наміром.",
  ],
  ru: [
    "Применяй эти сигналы немедленно. Дисциплина под давлением — это то, что отличает профессионалов.",
    "Используй эти данные для управления следующими операционными решениями. Последовательность — это ключ.",
    "Каждое наблюдение здесь — это возможность для роста. Продолжай работать с намерением.",
  ],
  es: [
    "Aplica estas señales inmediatamente. La disciplina bajo presión es lo que distingue a los profesionales.",
    "Usa estos insights para guiar tus próximas decisiones operativas. La consistencia es la clave.",
    "Cada observación aquí es una oportunidad de crecimiento. Sigue trabajando con intención.",
  ],
  fr: [
    "Appliquez ces signaux immédiatement. La discipline sous pression est ce qui distingue les professionnels.",
    "Utilisez ces insights pour guider vos prochaines décisions opérationnelles. La cohérence est la clé.",
    "Chaque observation ici est une opportunité de croissance. Continuez à travailler avec intention.",
  ],
  de: [
    "Wende diese Signale sofort an. Disziplin unter Druck ist das, was Profis auszeichnet.",
    "Nutze diese Erkenntnisse, um deine nächsten operativen Entscheidungen zu leiten. Konsistenz ist der Schlüssel.",
    "Jede Beobachtung hier ist eine Wachstumsmöglichkeit. Arbeite weiter mit Absicht.",
  ],
};

const NO_DATA: Record<AppLanguage, string> = {
  it: "Nessun trade registrato. Aggiungi trade al Diario per attivare il motore di analisi e ricevere feedback operativi personalizzati.",
  en: "No trades recorded yet. Add trades to the Diary to activate the analysis engine and receive personalized operational feedback.",
  uk: "Угод ще не зафіксовано. Додай угоди до Щоденника, щоб активувати аналітичний двигун і отримати персоналізований операційний зворотній зв'язок.",
  ru: "Сделок пока не зафиксировано. Добавь сделки в Дневник, чтобы активировать аналитический движок и получить персонализированную операционную обратную связь.",
  es: "Aún no hay operaciones registradas. Agrega operaciones al Diario para activar el motor de análisis y recibir feedback operativo personalizado.",
  fr: "Aucun trade enregistré pour l'instant. Ajoutez des trades au Journal pour activer le moteur d'analyse et recevoir des retours opérationnels personnalisés.",
  de: "Noch keine Trades aufgezeichnet. Füge Trades zum Tagebuch hinzu, um die Analyse-Engine zu aktivieren und personalisiertes operatives Feedback zu erhalten.",
};

// ---------------------------------------------------------------------------
// Public composer function
// ---------------------------------------------------------------------------

const SUPPORTED: AppLanguage[] = ["it", "en", "uk", "ru", "es", "fr", "de"];

function normalizeLang(lang: string | null | undefined): AppLanguage {
  return SUPPORTED.includes(lang as AppLanguage) ? (lang as AppLanguage) : "en";
}

export function composeAnalysis(
  data: AnalysisInput,
  language?: string | null
): string {
  const lang = normalizeLang(language);

  if (data.totalTrades === 0) {
    return NO_DATA[lang];
  }

  const now = new Date();
  const seed = data.totalTrades + now.getDate() + now.getMonth();
  const variant = pickVariant(data.coachingTone, seed);

  const parts: string[] = [];

  parts.push(OPENING[lang][variant]);

  for (const pool of [DISCIPLINA, RISCHIO, PSICOLOGIA]) {
    const obs = pickObservation(pool, data, seed);
    if (obs) {
      parts.push(applyValue(obs.texts[lang][variant], obs.value(data)));
    }
  }

  parts.push(CLOSING[lang][variant]);

  return parts.join(" ");
}
