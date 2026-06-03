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
    eyebrow: "Novità",
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
    eyebrow: "Що нового",
    title: "Оновлення застосунку",
    description:
      "Усі опубліковані оновлення, нові функції, виправлення помилок і важливі повідомлення VOLTIS.",
    empty: "Поки що немає опублікованих оновлень.",
    published: "Опубліковано",

    typeFeature: "Функція",
    typeBugfix: "Виправлення",
    typeMaintenance: "Обслуговування",
    typeAnnouncement: "Оголошення",

    priorityLow: "Низький",
    priorityMedium: "Середній",
    priorityHigh: "Високий",
    priorityCritical: "Критичний",
  },

  ru: {
    eyebrow: "Что нового",
    title: "Обновления приложения",
    description:
      "Все опубликованные обновления, новые функции, исправления ошибок и важные сообщения VOLTIS.",
    empty: "Пока нет опубликованных обновлений.",
    published: "Опубликовано",

    typeFeature: "Функция",
    typeBugfix: "Исправление",
    typeMaintenance: "Обслуживание",
    typeAnnouncement: "Объявление",

    priorityLow: "Низкий",
    priorityMedium: "Средний",
    priorityHigh: "Высокий",
    priorityCritical: "Критический",
  },

  es: {
    eyebrow: "Novedades",
    title: "Actualizaciones de la app",
    description:
      "Todas las actualizaciones publicadas, nuevas funciones, correcciones de errores y comunicaciones importantes de VOLTIS.",
    empty: "No hay actualizaciones publicadas.",
    published: "Publicado",

    typeFeature: "Función",
    typeBugfix: "Corrección",
    typeMaintenance: "Mantenimiento",
    typeAnnouncement: "Comunicación",

    priorityLow: "Baja",
    priorityMedium: "Media",
    priorityHigh: "Alta",
    priorityCritical: "Crítica",
  },

  fr: {
    eyebrow: "Nouveautés",
    title: "Mises à jour de l’app",
    description:
      "Toutes les mises à jour publiées, nouvelles fonctionnalités, corrections de bugs et communications importantes de VOLTIS.",
    empty: "Aucune mise à jour publiée.",
    published: "Publié",

    typeFeature: "Fonctionnalité",
    typeBugfix: "Correction",
    typeMaintenance: "Maintenance",
    typeAnnouncement: "Communication",

    priorityLow: "Basse",
    priorityMedium: "Moyenne",
    priorityHigh: "Élevée",
    priorityCritical: "Critique",
  },

  de: {
    eyebrow: "Neuigkeiten",
    title: "App-Updates",
    description:
      "Alle veröffentlichten Updates, neue Funktionen, Fehlerbehebungen und wichtige VOLTIS-Mitteilungen.",
    empty: "Noch keine Updates veröffentlicht.",
    published: "Veröffentlicht",

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
          <Megaphone className="text-cyan-400" />
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
                      <Icon className="text-cyan-400" />

                      <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
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

                  <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
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
