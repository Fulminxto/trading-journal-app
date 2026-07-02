import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Phrase = {
  it: string;
  en: string;
};

const phrases: Phrase[] = [
  {
    it: "Ho analizzato",
    en: "I analyzed",
  },
  {
    it: "trade. Win rate:",
    en: "trade. Win rate:",
  },
  {
    it: "disciplina:",
    en: "discipline:",
  },
  {
    it: "rischio comportamentale:",
    en: "behavioral risk:",
  },
  {
    it: "Streak attuale:",
    en: "Current streak:",
  },
  {
    it: "win consecutivi",
    en: "consecutive wins",
  },
  {
    it: "loss consecutivi",
    en: "consecutive losses",
  },
  {
    it: "Il trade recente non mostra anomalie operative significative.",
    en: "The recent trade does not show significant operational anomalies.",
  },
  {
    it: "Non rilevo segnali forti di revenge trading nei dati attuali. Continua comunque a monitorare le operazioni successive a una perdita.",
    en: "I do not detect strong revenge trading signals in the current data. Keep monitoring trades taken after a loss.",
  },
  {
    it: "Per ora i dati sono concentrati in una sola sessione, quindi non posso confrontare in modo affidabile sessione migliore e peggiore. Inserisci trade in pi� fasce orarie per attivare un confronto reale.",
    en: "For now, the data is concentrated in a single session, so I cannot reliably compare the best and worst session. Add trades across more time windows to activate a real comparison.",
  },
  {
    it: "La struttura operativa � stabile. Focus: ottimizzare edge, scalare con controllo e mantenere disciplina.",
    en: "The operating structure is stable. Focus: optimize edge, scale with control and maintain discipline.",
  },
  {
    it: "VOLTIS rileva rischio operativo critico. Priorit�: ridurre frequenza, proteggere capitale e fare review prima di nuove operazioni.",
    en: "VOLTIS detects critical operational risk. Priority: reduce frequency, protect capital and complete a review before taking new trades.",
  },
  {
    it: "VOLTIS rileva rischio comportamentale elevato. Focus: execution pulita, niente revenge trading e massima selettivit�.",
    en: "VOLTIS detects elevated behavioral risk. Focus: clean execution, no revenge trading and maximum selectivity.",
  },
  {
    it: "VOLTIS rileva una fase di sviluppo. Focus: costruire routine, migliorare consistenza e ridurre errori ripetuti.",
    en: "VOLTIS detects a development phase. Focus: build routine, improve consistency and reduce repeated mistakes.",
  },
  {
    it: "Possibili segnali di revenge trading dopo operazioni negative.",
    en: "Possible revenge trading signals after negative trades.",
  },
  {
    it: "Possibili segnali di revenge trading dopo una perdita.",
    en: "Possible revenge trading signals after a loss.",
  },
  {
    it: "Qualit� execution ridotta nelle fasce orarie serali.",
    en: "Reduced execution quality detected during evening time windows.",
  },
  {
    it: "Behavioral drift rilevato:",
    en: "Behavioral drift detected:",
  },
  {
    it: "qualit� recente",
    en: "recent quality",
  },
  {
    it: "precedente",
    en: "previous",
  },
  {
    it: "Execution stability rileva deterioramento:",
    en: "Execution stability detects deterioration:",
  },
  {
    it: "Confidence stability rileva deterioramento:",
    en: "Confidence stability detects deterioration:",
  },
  {
    it: "Emotional stability engine rileva instabilit� emotiva elevata",
    en: "Emotional stability engine detects elevated emotional instability",
  },
  {
    it: "Consistency engine rileva instabilit� operativa e deterioramento decisionale.",
    en: "Consistency engine detects operational instability and decision-making deterioration.",
  },
  {
    it: "AI Review Engine rileva deterioramento nella qualit� decisionale e execution.",
    en: "AI Review Engine detects deterioration in decision quality and execution.",
  },
  {
    it: "AI Review Engine rileva deterioramento nella qualit� decisionale e execution.",
    en: "AI Review Engine detects deterioration in decision quality and execution.",
  },
  {
    it: "Trade recente eseguito con buona qualit� decisionale, execution stabile e confidence coerente.",
    en: "Recent trade executed with good decision quality, stable execution and consistent confidence.",
  },
  {
    it: "La perdita recente mostra segnali di weak execution. Priorit�: migliorare selezione setup ed evitare ingressi impulsivi.",
    en: "The recent loss shows weak execution signals. Priority: improve setup selection and avoid impulsive entries.",
  },
  {
    it: "La perdita recente evidenzia bassa confidence operativa. Il focus � evitare trade presi senza piena convinzione.",
    en: "The recent loss highlights low operational confidence. The focus is to avoid trades taken without full conviction.",
  },
  {
    it: "Componente emotiva rilevata nel trade recente. VOLTIS consiglia review comportamentale post-sessione.",
    en: "Emotional component detected in the recent trade. VOLTIS recommends a post-session behavioral review.",
  },
  {
    it: "VOLTIS non ha ancora abbastanza trade per costruire una memoria operativa affidabile.",
    en: "VOLTIS does not have enough trades yet to build reliable operational memory.",
  },
  {
    it: "La disciplina operativa richiede attenzione.",
    en: "Operational discipline requires attention.",
  },
  {
    it: "Rischio comportamentale elevato:",
    en: "Elevated behavioral risk:",
  },
  {
    it: "Rischio comportamentale sotto controllo:",
    en: "Behavioral risk under control:",
  },
  {
    it: "Execution debole, bassa confidence o componente emotiva stanno incidendo.",
    en: "Weak execution, low confidence or emotional components are affecting performance.",
  },
  {
    it: "Win rate attuale:",
    en: "Current win rate:",
  },
  {
    it: "Trade analizzati:",
    en: "Trades analyzed:",
  },
  {
    it: "PnL totale analizzato dal Copilot:",
    en: "Total PnL analyzed by Copilot:",
  },
  {
    it: "Peggior drawdown registrato:",
    en: "Worst drawdown recorded:",
  },
  {
    it: "Possibili segnali di revenge trading rilevati dopo una perdita:",
    en: "Possible revenge trading signals detected after a loss:",
  },
  {
    it: "Trade con confidence bassa:",
    en: "Trades with low confidence:",
  },
  {
    it: "Score medio delle ultime sessioni:",
    en: "Average score of recent sessions:",
  },
  {
    it: "Streak negativa attuale:",
    en: "Current negative streak:",
  },
  {
    it: "Streak positiva attuale:",
    en: "Current positive streak:",
  },
  {
    it: "loss consecutive",
    en: "consecutive losses",
  },
  {
    it: "win consecutive",
    en: "consecutive wins",
  },
];

const brokenEncodingPairs: Phrase[] = [
  {
    it: "La struttura operativa è stabile. Focus: ottimizzare edge, scalare con controllo e mantenere disciplina.",
    en: "The operating structure is stable. Focus: optimize edge, scale with control and maintain discipline.",
  },
  {
    it: "AI Review Engine rileva deterioramento nella qualit� decisionale e execution.",
    en: "AI Review Engine detects deterioration in decision quality and execution.",
  },
  {
    it: "AI Review Engine rileva deterioramento nella qualit�  decisionale e execution.",
    en: "AI Review Engine detects deterioration in decision quality and execution.",
  },
  {
    it: "Trade recente eseguito con buona qualit�  decisionale, execution stabile e confidence coerente.",
    en: "Recent trade executed with good decision quality, stable execution and consistent confidence.",
  },
  {
    it: "La perdita recente mostra segnali di weak execution. Priorit� : migliorare selezione setup ed evitare ingressi impulsivi.",
    en: "The recent loss shows weak execution signals. Priority: improve setup selection and avoid impulsive entries.",
  },
  {
    it: "La perdita recente evidenzia bassa confidence operativa. Il focus è evitare trade presi senza piena convinzione.",
    en: "The recent loss highlights low operational confidence. The focus is to avoid trades taken without full conviction.",
  },
  {
    it: "Per ora i dati sono concentrati in una sola sessione, quindi non posso confrontare in modo affidabile sessione migliore e peggiore. Inserisci trade in più fasce orarie per attivare un confronto reale.",
    en: "For now, the data is concentrated in a single session, so I cannot reliably compare the best and worst session. Add trades across more time windows to activate a real comparison.",
  },
  {
    it: "Qualit�  execution ridotta nelle fasce orarie serali.",
    en: "Reduced execution quality detected during evening time windows.",
  },
  {
    it: "Behavioral drift rilevato: qualit�  recente",
    en: "Behavioral drift detected: recent quality",
  },
  {
    it: "Emotional stability engine rileva instabilit�  emotiva elevata",
    en: "Emotional stability engine detects elevated emotional instability",
  },
  {
    it: "Consistency engine rileva instabilit�  operativa e deterioramento decisionale.",
    en: "Consistency engine detects operational instability and decision-making deterioration.",
  },
];

function cleanupEncoding(value: string) {
  return value
    .replaceAll("è", "�")
    .replaceAll("é", "�")
    .replaceAll("ì", "�")
    .replaceAll("ò", "�")
    .replaceAll("ù", "�")
    .replaceAll("� ", "�")
    .replaceAll("À", "�")
    .replaceAll("È", "�")
    .replaceAll("É", "�")
    .replaceAll("Ì", "�")
    .replaceAll("Ò", "�")
    .replaceAll("Ù", "�")
    .replaceAll("�", "")
    .replaceAll("’", "�")
    .replaceAll("“", "�")
    .replaceAll("”", "�")
    .replaceAll("�", "�");
}

export function renderCopilotText(
  value: string | null | undefined,
  appLanguage?: string | null
) {
  if (!value) {
    return "";
  }

  const language = normalizeAppLanguage(appLanguage);
  const target: AppLanguage =
    language === "it" ? "it" : "en";

  let text = cleanupEncoding(value);

  const allPhrases = [
    ...brokenEncodingPairs,
    ...phrases,
  ];

  for (const phrase of allPhrases) {
    if (target === "en") {
      text = text
        .split(phrase.it)
        .join(phrase.en);
    } else {
      text = text
        .split(phrase.en)
        .join(phrase.it);
    }
  }


  // COPILOT_FINAL_VISIBLE_TEXT_PATCH
  if (target === "en") {
    text = text
      .replace(
        /AI Review Engine rileva deterioramento nella qualit\S*\s+decisionale e execution\./g,
        "AI Review Engine detects deterioration in decision quality and execution."
      )
      .replace(
        /Memoria operativa attiva:\s*VOLTIS riconosce\s*(\d+)\s*pattern ricorrenti nel tuo storico\.\s*Pattern principale:/g,
        "Active operating memory: VOLTIS recognizes $1 recurring patterns in your history. Main pattern:"
      )
      .replace(
        /VOLTIS riconosce\s*(\d+)\s*pattern ricorrenti nel tuo storico\./g,
        "VOLTIS recognizes $1 recurring patterns in your history."
      )
      .replace(
        /Pattern principale:/g,
        "Main pattern:"
      );
  }
  return cleanupEncoding(text);
}

