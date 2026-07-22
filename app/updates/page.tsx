import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import UpdatesPageContent from "./UpdatesPageContent";

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

  return (
    <UpdatesPageContent
      labels={{
        eyebrow: t.eyebrow,
        title: t.title,
        description: t.description,
        empty: t.empty,
      }}
    />
  );
}
