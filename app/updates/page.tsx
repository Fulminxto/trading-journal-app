import {
  Megaphone,
  Wrench,
  Sparkles,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  formatDateByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type UpdatesLabels = {
  eyebrow: string;
  title: string;
  description: string;
  empty: string;
  published: string;

  typeFeature: string;
  typeBugfix: string;
  typeMaintenance: string;
  typeAnnouncement: string;

  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  priorityCritical: string;
};

const updatesLabels: Record<AppLanguage, UpdatesLabels> = {
  it: {
    eyebrow: "NovitÃ ",
    title: "Aggiornamenti App",
    description:
      "Tutti gli aggiornamenti pubblicati, nuove feature, bug fix e comunicazioni importanti di VOLTIS.",
    empty: "Nessun aggiornamento pubblicato.",
    published: "Pubblicato",

    typeFeature: "Feature",
    typeBugfix: "Bug fix",
    typeMaintenance: "Manutenzione",
    typeAnnouncement: "Comunicazione",

    priorityLow: "Bassa",
    priorityMedium: "Media",
    priorityHigh: "Alta",
    priorityCritical: "Critica",
  },

  en: {
    eyebrow: "What's New",
    title: "App Updates",
    description:
      "All published updates, new features, bug fixes and important VOLTIS communications.",
    empty: "No updates published yet.",
    published: "Published",

    typeFeature: "Feature",
    typeBugfix: "Bug fix",
    typeMaintenance: "Maintenance",
    typeAnnouncement: "Announcement",

    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    priorityCritical: "Critical",
  },

  uk: {
    eyebrow: "Ð©Ð¾ Ð½Ð¾Ð²Ð¾Ð³Ð¾",
    title: "ÐžÐ½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ Ð·Ð°ÑÑ‚Ð¾ÑÑƒÐ½ÐºÑƒ",
    description:
      "Ð£ÑÑ– Ð¾Ð¿ÑƒÐ±Ð»Ñ–ÐºÐ¾Ð²Ð°Ð½Ñ– Ð¾Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ, Ð½Ð¾Ð²Ñ– Ñ„ÑƒÐ½ÐºÑ†Ñ–Ñ—, Ð²Ð¸Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð½Ñ Ð¿Ð¾Ð¼Ð¸Ð»Ð¾Ðº Ñ– Ð²Ð°Ð¶Ð»Ð¸Ð²Ñ– Ð¿Ð¾Ð²Ñ–Ð´Ð¾Ð¼Ð»ÐµÐ½Ð½Ñ VOLTIS.",
    empty: "ÐŸÐ¾ÐºÐ¸ Ñ‰Ð¾ Ð½ÐµÐ¼Ð°Ñ” Ð¾Ð¿ÑƒÐ±Ð»Ñ–ÐºÐ¾Ð²Ð°Ð½Ð¸Ñ… Ð¾Ð½Ð¾Ð²Ð»ÐµÐ½ÑŒ.",
    published: "ÐžÐ¿ÑƒÐ±Ð»Ñ–ÐºÐ¾Ð²Ð°Ð½Ð¾",

    typeFeature: "Ð¤ÑƒÐ½ÐºÑ†Ñ–Ñ",
    typeBugfix: "Ð’Ð¸Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð½Ñ",
    typeMaintenance: "ÐžÐ±ÑÐ»ÑƒÐ³Ð¾Ð²ÑƒÐ²Ð°Ð½Ð½Ñ",
    typeAnnouncement: "ÐžÐ³Ð¾Ð»Ð¾ÑˆÐµÐ½Ð½Ñ",

    priorityLow: "ÐÐ¸Ð·ÑŒÐºÐ¸Ð¹",
    priorityMedium: "Ð¡ÐµÑ€ÐµÐ´Ð½Ñ–Ð¹",
    priorityHigh: "Ð’Ð¸ÑÐ¾ÐºÐ¸Ð¹",
    priorityCritical: "ÐšÑ€Ð¸Ñ‚Ð¸Ñ‡Ð½Ð¸Ð¹",
  },

  ru: {
    eyebrow: "Ð§Ñ‚Ð¾ Ð½Ð¾Ð²Ð¾Ð³Ð¾",
    title: "ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ",
    description:
      "Ð’ÑÐµ Ð¾Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ, Ð½Ð¾Ð²Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸, Ð¸ÑÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð¾ÑˆÐ¸Ð±Ð¾Ðº Ð¸ Ð²Ð°Ð¶Ð½Ñ‹Ðµ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ñ VOLTIS.",
    empty: "ÐŸÐ¾ÐºÐ° Ð½ÐµÑ‚ Ð¾Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ð¹.",
    published: "ÐžÐ¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð¾",

    typeFeature: "Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ",
    typeBugfix: "Ð˜ÑÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ",
    typeMaintenance: "ÐžÐ±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ",
    typeAnnouncement: "ÐžÐ±ÑŠÑÐ²Ð»ÐµÐ½Ð¸Ðµ",

    priorityLow: "ÐÐ¸Ð·ÐºÐ¸Ð¹",
    priorityMedium: "Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹",
    priorityHigh: "Ð’Ñ‹ÑÐ¾ÐºÐ¸Ð¹",
    priorityCritical: "ÐšÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹",
  },

  es: {
    eyebrow: "Novedades",
    title: "Actualizaciones de la app",
    description:
      "Todas las actualizaciones publicadas, nuevas funciones, correcciones de errores y comunicaciones importantes de VOLTIS.",
    empty: "No hay actualizaciones publicadas.",
    published: "Publicado",

    typeFeature: "FunciÃ³n",
    typeBugfix: "CorrecciÃ³n",
    typeMaintenance: "Mantenimiento",
    typeAnnouncement: "ComunicaciÃ³n",

    priorityLow: "Baja",
    priorityMedium: "Media",
    priorityHigh: "Alta",
    priorityCritical: "CrÃ­tica",
  },

  fr: {
    eyebrow: "NouveautÃ©s",
    title: "Mises Ã  jour de lâ€™app",
    description:
      "Toutes les mises Ã  jour publiÃ©es, nouvelles fonctionnalitÃ©s, corrections de bugs et communications importantes de VOLTIS.",
    empty: "Aucune mise Ã  jour publiÃ©e.",
    published: "PubliÃ©",

    typeFeature: "FonctionnalitÃ©",
    typeBugfix: "Correction",
    typeMaintenance: "Maintenance",
    typeAnnouncement: "Communication",

    priorityLow: "Basse",
    priorityMedium: "Moyenne",
    priorityHigh: "Ã‰levÃ©e",
    priorityCritical: "Critique",
  },

  de: {
    eyebrow: "Neuigkeiten",
    title: "App-Updates",
    description:
      "Alle verÃ¶ffentlichten Updates, neue Funktionen, Fehlerbehebungen und wichtige VOLTIS-Mitteilungen.",
    empty: "Noch keine Updates verÃ¶ffentlicht.",
    published: "VerÃ¶ffentlicht",

    typeFeature: "Funktion",
    typeBugfix: "Fehlerbehebung",
    typeMaintenance: "Wartung",
    typeAnnouncement: "Mitteilung",

    priorityLow: "Niedrig",
    priorityMedium: "Mittel",
    priorityHigh: "Hoch",
    priorityCritical: "Kritisch",
  },
};

function getUpdateIcon(type: string | null): LucideIcon {
  if (type === "feature") {
    return Sparkles;
  }

  if (type === "bugfix") {
    return Wrench;
  }

  if (type === "maintenance") {
    return AlertTriangle;
  }

  return Megaphone;
}

function getTypeLabel(
  type: string | null,
  labels: UpdatesLabels
) {
  if (type === "feature") {
    return labels.typeFeature;
  }

  if (type === "bugfix") {
    return labels.typeBugfix;
  }

  if (type === "maintenance") {
    return labels.typeMaintenance;
  }

  return labels.typeAnnouncement;
}

function getPriorityLabel(
  priority: string | null,
  labels: UpdatesLabels
) {
  if (priority === "critical") {
    return labels.priorityCritical;
  }

  if (priority === "high") {
    return labels.priorityHigh;
  }

  if (priority === "medium") {
    return labels.priorityMedium;
  }

  return labels.priorityLow;
}

export default async function UpdatesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        appLanguage: true,
      },
    });

  const appLanguage = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t = updatesLabels[appLanguage];

  const updates =
    await prisma.releaseNote.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400">
          {t.eyebrow}
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
          <Megaphone className="text-accent-bright" />
          {t.title}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>

      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm text-gray-400">
              {t.empty}
            </p>
          </div>
        ) : (
          updates.map((update) => {
            const Icon = getUpdateIcon(update.type);

            return (
              <div
                key={update.id}
                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <Icon className="text-accent-bright" />

                      <p className="text-xs uppercase tracking-[0.15em] text-accent-bright">
                        {getTypeLabel(update.type, t)}
                      </p>
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-white">
                      {update.title}
                    </h2>

                    <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-300">
                      {update.content}
                    </p>

                    <p className="mt-5 text-xs text-gray-500">
                      {t.published}:{" "}
                      {formatDateByLanguage(
                        update.createdAt,
                        appLanguage
                      )}
                    </p>
                  </div>

                  <div className="rounded-full border border-accent-bright/20 bg-accent-bright/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-accent-bright">
                    {getPriorityLabel(
                      update.priority,
                      t
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
