import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Zap, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import LoginForm from "./LoginForm";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type LoginCopy = {
  privateAccess: string;
  eyebrow: string;
  title: string;
  description: string;
  manifesto: string;
  selectedAccess: string;
  selectedAccessDescription: string;
  seriousTool: string;
  seriousToolDescription: string;
  notMassMarket: string;
  notMassMarketDescription: string;
};

const loginCopy: Record<AppLanguage, LoginCopy> = {
  it: {
    privateAccess: "Private Access",
    eyebrow: "VOLTIS",
    title: "Accesso riservato",
    description:
      "Accedi al tuo private trading operating system.",
    manifesto:
      "VOLTIS è creato per trader selezionati che vogliono misurare, proteggere e migliorare il proprio comportamento operativo.",
    selectedAccess: "Accesso selezionato",
    selectedAccessDescription:
      "Non è aperto a tutti. L’accesso viene concesso intenzionalmente.",
    seriousTool: "Strumento serio",
    seriousToolDescription:
      "Pensato per chi vuole trattare il trading seriamente.",
    notMassMarket: "Non mass market",
    notMassMarketDescription:
      "Non è progettato per il pubblico di massa.",
  },

  en: {
    privateAccess: "Private Access",
    eyebrow: "VOLTIS",
    title: "Restricted access",
    description:
      "Sign in to your private trading operating system.",
    manifesto:
      "VOLTIS is created for selected traders who want to measure, protect and improve their operational behavior.",
    selectedAccess: "Selected access",
    selectedAccessDescription:
      "It is not open to everyone. Access is granted intentionally.",
    seriousTool: "Serious tool",
    seriousToolDescription:
      "Built for traders who want to treat trading seriously.",
    notMassMarket: "Not mass market",
    notMassMarketDescription:
      "It is not designed for the mass market.",
  },

  uk: {
    privateAccess: "Приватний доступ",
    eyebrow: "VOLTIS",
    title: "Обмежений доступ",
    description:
      "Увійдіть у свою приватну торгову операційну систему.",
    manifesto:
      "VOLTIS створений для відібраних трейдерів, які хочуть вимірювати, захищати та покращувати свою операційну поведінку.",
    selectedAccess: "Вибірковий доступ",
    selectedAccessDescription:
      "Він не відкритий для всіх. Доступ надається свідомо.",
    seriousTool: "Серйозний інструмент",
    seriousToolDescription:
      "Створений для тих, хто хоче ставитися до трейдингу серйозно.",
    notMassMarket: "Не для масового ринку",
    notMassMarketDescription:
      "Він не створений для масового користувача.",
  },

  ru: {
    privateAccess: "Приватный доступ",
    eyebrow: "VOLTIS",
    title: "Ограниченный доступ",
    description:
      "Войдите в свою приватную торговую операционную систему.",
    manifesto:
      "VOLTIS создан для отобранных трейдеров, которые хотят измерять, защищать и улучшать свое операционное поведение.",
    selectedAccess: "Избирательный доступ",
    selectedAccessDescription:
      "Он не открыт для всех. Доступ предоставляется осознанно.",
    seriousTool: "Серьезный инструмент",
    seriousToolDescription:
      "Создан для тех, кто хочет относиться к трейдингу серьезно.",
    notMassMarket: "Не для массового рынка",
    notMassMarketDescription:
      "Он не создан для массового пользователя.",
  },

  es: {
    privateAccess: "Acceso privado",
    eyebrow: "VOLTIS",
    title: "Acceso restringido",
    description:
      "Accede a tu sistema operativo privado de trading.",
    manifesto:
      "VOLTIS está creado para traders seleccionados que quieren medir, proteger y mejorar su comportamiento operativo.",
    selectedAccess: "Acceso seleccionado",
    selectedAccessDescription:
      "No está abierto a todos. El acceso se concede de forma intencional.",
    seriousTool: "Herramienta seria",
    seriousToolDescription:
      "Creado para quienes quieren tratar el trading con seriedad.",
    notMassMarket: "No mass market",
    notMassMarketDescription:
      "No está diseñado para el mercado masivo.",
  },

  fr: {
    privateAccess: "Accès privé",
    eyebrow: "VOLTIS",
    title: "Accès restreint",
    description:
      "Connectez-vous à votre système d’exploitation privé de trading.",
    manifesto:
      "VOLTIS est créé pour des traders sélectionnés qui veulent mesurer, protéger et améliorer leur comportement opérationnel.",
    selectedAccess: "Accès sélectionné",
    selectedAccessDescription:
      "Il n’est pas ouvert à tous. L’accès est accordé intentionnellement.",
    seriousTool: "Outil sérieux",
    seriousToolDescription:
      "Conçu pour ceux qui veulent traiter le trading sérieusement.",
    notMassMarket: "Pas mass market",
    notMassMarketDescription:
      "Il n’est pas conçu pour le marché de masse.",
  },

  de: {
    privateAccess: "Privater Zugang",
    eyebrow: "VOLTIS",
    title: "Eingeschränkter Zugang",
    description:
      "Melde dich bei deinem privaten Trading-Betriebssystem an.",
    manifesto:
      "VOLTIS wurde für ausgewählte Trader entwickelt, die ihr operatives Verhalten messen, schützen und verbessern wollen.",
    selectedAccess: "Ausgewählter Zugang",
    selectedAccessDescription:
      "Es ist nicht für alle geöffnet. Der Zugang wird bewusst gewährt.",
    seriousTool: "Seriöses Werkzeug",
    seriousToolDescription:
      "Entwickelt für Menschen, die Trading ernst nehmen wollen.",
    notMassMarket: "Nicht für den Massenmarkt",
    notMassMarketDescription:
      "Es ist nicht für den Massenmarkt konzipiert.",
  },
};

function getLanguageFromAcceptHeader(
  acceptLanguage: string | null
): AppLanguage {
  const firstLanguage =
    acceptLanguage
      ?.split(",")[0]
      ?.split("-")[0]
      ?.trim()
      ?.toLowerCase() ?? null;

  return normalizeAppLanguage(firstLanguage);
}

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/accounts");
  }

  const requestHeaders = await headers();

  const appLanguage = getLanguageFromAcceptHeader(
    requestHeaders.get("accept-language")
  );

  const t = loginCopy[appLanguage] ?? loginCopy.en;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-deep px-4 py-10 text-white">
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--color-accent)_10%,transparent)_34%,transparent),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-accent-bright)_8%,transparent)_32%,transparent)]" />

      <div className="relative grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <Zap
                size={22}
                strokeWidth={2.3}
                className="text-white"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-accent-bright">
                {t.eyebrow}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">
                {t.privateAccess}
              </p>
            </div>
          </div>

          <h1 className="max-w-xl text-5xl font-black tracking-tight text-white">
            {t.title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-400">
            {t.manifesto}
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-accent-bright/20 bg-accent-bright/10 p-5">
              <div className="mb-3 flex items-center gap-3">
                <LockKeyhole
                  size={20}
                  className="text-accent-bright"
                />

                <h2 className="font-black text-white">
                  {t.selectedAccess}
                </h2>
              </div>

              <p className="text-sm leading-6 text-white/70">
                {t.selectedAccessDescription}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <ShieldCheck
                    size={20}
                    className="text-accent"
                  />

                  <h2 className="font-black text-white">
                    {t.seriousTool}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-gray-400">
                  {t.seriousToolDescription}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <Sparkles
                    size={20}
                    className="text-yellow-300"
                  />

                  <h2 className="font-black text-white">
                    {t.notMassMarket}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-gray-400">
                  {t.notMassMarketDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
              <Zap
                size={26}
                strokeWidth={2.3}
                className="text-white"
              />
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.45em] text-gray-500">
              {t.eyebrow}
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight">
              {t.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              {t.description}
            </p>
          </div>

          <LoginForm appLanguage={appLanguage} />
        </section>
      </div>
    </div>
  );
}