import { ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Labels = {
  eyebrow: string;
  title: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Account Frozen",
    title: "Accesso temporaneamente sospeso",
    description:
      "Il tuo accesso a VOLTIS è stato temporaneamente sospeso dall’amministratore. Contatta il supporto per maggiori informazioni.",
  },
  en: {
    eyebrow: "Account Frozen",
    title: "Access temporarily suspended",
    description:
      "Your access to VOLTIS has been temporarily suspended by the administrator. Contact support for more information.",
  },
  uk: {
    eyebrow: "Account Frozen",
    title: "Доступ тимчасово призупинено",
    description:
      "Ваш доступ до VOLTIS тимчасово призупинено адміністратором. Зверніться до support для отримання додаткової інформації.",
  },
  ru: {
    eyebrow: "Account Frozen",
    title: "Доступ временно приостановлен",
    description:
      "Ваш доступ к VOLTIS временно приостановлен администратором. Обратитесь в support для дополнительной информации.",
  },
  es: {
    eyebrow: "Account Frozen",
    title: "Acceso temporalmente suspendido",
    description:
      "Tu acceso a VOLTIS ha sido suspendido temporalmente por el administrador. Contacta soporte para más información.",
  },
  fr: {
    eyebrow: "Account Frozen",
    title: "Accès temporairement suspendu",
    description:
      "Votre accès à VOLTIS a été temporairement suspendu par l’administrateur. Contactez le support pour plus d’informations.",
  },
  de: {
    eyebrow: "Account Frozen",
    title: "Zugriff vorübergehend gesperrt",
    description:
      "Dein Zugriff auf VOLTIS wurde vorübergehend vom Administrator gesperrt. Kontaktiere den Support für weitere Informationen.",
  },
};

export default async function FrozenPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
    },
  });

  const language = normalizeAppLanguage(
    user?.appLanguage
  );

  const t = labels[language] ?? labels.en;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C1430] p-8 text-white">
      <div className="max-w-2xl rounded-[40px] border border-yellow-500/20 bg-yellow-500/10 p-10 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-500/20 bg-yellow-500/10">
          <ShieldAlert
            size={34}
            className="text-yellow-300"
          />
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.25em] text-yellow-300">
          {t.eyebrow}
        </p>

        <h1 className="mt-4 text-5xl font-black">
          {t.title}
        </h1>

        <p className="mt-6 text-sm leading-relaxed text-gray-300">
          {t.description}
        </p>
      </div>
    </div>
  );
}
