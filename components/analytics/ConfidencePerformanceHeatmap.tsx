import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  data: {
    level: string;
    count: number;
    pnl: number;
  }[];
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Confidence Heatmap",
    title: "Performance confidence",
    description:
      "VOLTIS confronta confidence e risultato economico per capire se la convinzione operativa è davvero allineata al tuo edge.",
  },
  en: {
    eyebrow: "Confidence Heatmap",
    title: "Confidence Performance",
    description:
      "VOLTIS compares confidence and economic result to understand whether operational conviction is truly aligned with your edge.",
  },
  uk: {
    eyebrow: "Confidence Heatmap",
    title: "Performance confidence",
    description:
      "VOLTIS порівнює confidence та економічний результат, щоб зрозуміти, чи операційна переконаність справді узгоджена з твоїм edge.",
  },
  ru: {
    eyebrow: "Confidence Heatmap",
    title: "Performance confidence",
    description:
      "VOLTIS сравнивает confidence и экономический результат, чтобы понять, действительно ли операционная убежденность совпадает с твоим edge.",
  },
  es: {
    eyebrow: "Confidence Heatmap",
    title: "Performance confidence",
    description:
      "VOLTIS compara confidence y resultado económico para entender si la convicción operativa está realmente alineada con tu edge.",
  },
  fr: {
    eyebrow: "Confidence Heatmap",
    title: "Performance confidence",
    description:
      "VOLTIS compare confidence et résultat économique pour comprendre si la conviction opérationnelle est réellement alignée avec ton edge.",
  },
  de: {
    eyebrow: "Confidence Heatmap",
    title: "Confidence Performance",
    description:
      "VOLTIS vergleicht Confidence und wirtschaftliches Ergebnis, um zu verstehen, ob die operative Überzeugung wirklich mit deinem Edge übereinstimmt.",
  },
};

function getTone(pnl: number) {
  if (pnl > 0) {
    return "border-green-500/20 bg-green-500/10";
  }

  if (pnl < 0) {
    return "border-red-500/20 bg-red-500/10";
  }

  return "border-white/10 bg-white/[0.03]";
}

export default function ConfidencePerformanceHeatmap({
  data,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.level}
              className={`rounded-2xl border p-5 ${getTone(
                item.pnl
              )}`}
            >
              <p className="text-sm text-gray-400">
                {item.level}
              </p>

              <h3 className="mt-3 text-3xl font-black text-white">
                {item.count}
              </h3>

              <p
                className={`mt-2 text-sm font-bold ${
                  item.pnl >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {item.pnl >= 0 ? "+" : ""}
                {item.pnl.toFixed(0)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}
