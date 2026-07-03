import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import LoginForm from "./LoginForm";
import Card from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";
import SignatureEdge from "@/components/ui/SignatureEdge";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_7%,transparent)_30%,transparent),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-accent-bright)_5%,transparent)_28%,transparent)]" />

      <div className="relative grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <Card
          variant="base"
          className="reveal-rise hidden p-8 lg:block"
          style={{ animationDelay: "0ms" }}
        >
          <div className="mb-8 flex items-center gap-3">
            <img
              src="/icons/variants/classic/icon.svg"
              alt="VOLTIS"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />

            <div>
              <p className="text-xs font-black uppercase tracking-[0.42em] text-accent-bright">
                {t.eyebrow}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-faint">
                {t.privateAccess}
              </p>
            </div>
          </div>

          <h1 className="text-hero max-w-xl text-white">
            {t.title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted">
            {t.manifesto}
          </p>

          <div className="mt-8 grid gap-4">
            <Card variant="inner" className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <IconTile size="sm" interactive={false}>
                  <LockKeyhole size={16} className="text-accent-bright" />
                </IconTile>

                <h2 className="font-black text-white">
                  {t.selectedAccess}
                </h2>
              </div>

              <p className="text-sm leading-6 text-white/70">
                {t.selectedAccessDescription}
              </p>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card variant="inner" className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <IconTile size="sm" interactive={false}>
                    <ShieldCheck size={16} />
                  </IconTile>

                  <h2 className="font-black text-white">
                    {t.seriousTool}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-muted">
                  {t.seriousToolDescription}
                </p>
              </Card>

              <Card variant="inner" className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <IconTile size="sm" interactive={false}>
                    <Sparkles size={16} />
                  </IconTile>

                  <h2 className="font-black text-white">
                    {t.notMassMarket}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-muted">
                  {t.notMassMarketDescription}
                </p>
              </Card>
            </div>
          </div>
        </Card>

        <Card
          variant="hero"
          className="shimmer-sweep reveal-rise relative mx-auto w-full max-w-md p-8"
          style={{ animationDelay: "80ms" }}
        >
          <SignatureEdge
            orientation="vertical"
            className="absolute bottom-8 left-0 top-8"
          />

          <div className="pl-4">
            <div className="mb-8 text-center">
              <img
                src="/icons/variants/classic/icon.svg"
                alt="VOLTIS"
                width={56}
                height={56}
                className="mx-auto h-14 w-14 object-contain"
              />

              <p className="mt-6 text-xs uppercase tracking-[0.42em] text-muted-faint">
                {t.eyebrow}
              </p>

              <h1 className="text-hero mt-4">
                {t.title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted">
                {t.description}
              </p>
            </div>

            <LoginForm appLanguage={appLanguage} />
          </div>
        </Card>
      </div>
    </div>
  );
}