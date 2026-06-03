import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    formatDateTimeByLanguage,
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";
import Link from "next/link";
import { redirect } from "next/navigation";

type ActivityLabels = {
    eyebrow: string;
    title: string;
    description: string;
    changes: string;
    openAccount: string;
    emptyState: string;
    enabled: string;
    disabled: string;
    emptyValue: string;
};

const activityLabels: Record<AppLanguage, ActivityLabels> = {
    it: {
        eyebrow: "Activity Feed",
        title: "Attività recenti",
        description:
            "Cronologia intelligente delle attività legate ai tuoi account, trade e permessi.",
        changes: "Modifiche",
        openAccount: "Apri account",
        emptyState: "Nessuna attività registrata per ora.",
        enabled: "Attivo",
        disabled: "Disattivo",
        emptyValue: "-",
    },

    en: {
        eyebrow: "Activity Feed",
        title: "Recent Activity",
        description:
            "Intelligent timeline of activities related to your accounts, trades and permissions.",
        changes: "Changes",
        openAccount: "Open Account",
        emptyState: "No activity recorded yet.",
        enabled: "Enabled",
        disabled: "Disabled",
        emptyValue: "-",
    },

    uk: {
        eyebrow: "Стрічка активності",
        title: "Остання активність",
        description:
            "Інтелектуальна хронологія дій, пов’язаних із вашими акаунтами, угодами та дозволами.",
        changes: "Зміни",
        openAccount: "Відкрити акаунт",
        emptyState: "Поки що немає зареєстрованої активності.",
        enabled: "Увімкнено",
        disabled: "Вимкнено",
        emptyValue: "-",
    },

    ru: {
        eyebrow: "Лента активности",
        title: "Последняя активность",
        description:
            "Интеллектуальная хронология действий, связанных с вашими аккаунтами, сделками и разрешениями.",
        changes: "Изменения",
        openAccount: "Открыть аккаунт",
        emptyState: "Пока нет зарегистрированной активности.",
        enabled: "Включено",
        disabled: "Отключено",
        emptyValue: "-",
    },

    es: {
        eyebrow: "Feed de actividad",
        title: "Actividad reciente",
        description:
            "Cronología inteligente de actividades relacionadas con tus cuentas, trades y permisos.",
        changes: "Cambios",
        openAccount: "Abrir cuenta",
        emptyState: "Aún no hay actividad registrada.",
        enabled: "Activado",
        disabled: "Desactivado",
        emptyValue: "-",
    },

    fr: {
        eyebrow: "Flux d’activité",
        title: "Activité récente",
        description:
            "Chronologie intelligente des activités liées à vos comptes, trades et permissions.",
        changes: "Modifications",
        openAccount: "Ouvrir le compte",
        emptyState: "Aucune activité enregistrée pour le moment.",
        enabled: "Activé",
        disabled: "Désactivé",
        emptyValue: "-",
    },

    de: {
        eyebrow: "Aktivitätsfeed",
        title: "Letzte Aktivität",
        description:
            "Intelligente Chronologie der Aktivitäten rund um deine Konten, Trades und Berechtigungen.",
        changes: "Änderungen",
        openAccount: "Konto öffnen",
        emptyState: "Noch keine Aktivität aufgezeichnet.",
        enabled: "Aktiviert",
        disabled: "Deaktiviert",
        emptyValue: "-",
    },
};

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function formatValue(
    value: unknown,
    labels: ActivityLabels
) {
    if (typeof value === "boolean") {
        return value ? labels.enabled : labels.disabled;
    }

    if (value === null || value === undefined) {
        return labels.emptyValue;
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return String(value);
}

function getChanges(metadata: unknown) {
    if (!isRecord(metadata)) {
        return [];
    }

    const before = metadata.before;
    const after = metadata.after;

    if (!isRecord(before) || !isRecord(after)) {
        if (
            "field" in metadata &&
            "before" in metadata &&
            "after" in metadata
        ) {
            return [
                {
                    field: String(metadata.field),
                    before: metadata.before,
                    after: metadata.after,
                },
            ];
        }

        return [];
    }

    return Object.keys(after)
        .filter((key) => before[key] !== after[key])
        .map((key) => ({
            field: key,
            before: before[key],
            after: after[key],
        }));
}

export default async function ActivitiesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            appLanguage: true,
        },
    });

    if (!currentUser) {
        redirect("/login");
    }

    const appLanguage = normalizeAppLanguage(
        currentUser.appLanguage
    );

    const t = activityLabels[appLanguage];

    const memberships =
        await prisma.accountMember.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                tradingAccountId: true,
            },
        });

    const accountIds = memberships.map(
        (membership) => membership.tradingAccountId
    );

    const activities =
        await prisma.activityLog.findMany({
            where: {
                OR: [
                    {
                        userId: session.user.id,
                    },
                    {
                        accountId: {
                            in: accountIds,
                        },
                    },
                ],
            },
            include: {
                user: true,
                account: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        });

    return (
        <div>
            <div className="mb-10">
                <p className="text-sm text-green-400">
                    {t.eyebrow}
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                    {t.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                    {t.description}
                </p>
            </div>

            <div className="space-y-4">
                {activities.length > 0 ? (
                    activities.map((activity) => {
                        const changes = getChanges(
                            activity.metadata
                        );

                        return (
                            <div
                                key={activity.id}
                                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                                                {activity.type}
                                            </span>

                                            {activity.account && (
                                                <span className="rounded-xl bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                                                    {activity.account.name}
                                                </span>
                                            )}

                                            {activity.user && (
                                                <span className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                                                    {activity.user.username}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-lg font-bold">
                                            {activity.title}
                                        </h2>

                                        {activity.description && (
                                            <p className="mt-2 text-sm text-gray-400">
                                                {activity.description}
                                            </p>
                                        )}

                                        {changes.length > 0 && (
                                            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                                                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                                    {t.changes}
                                                </p>

                                                <div className="space-y-2">
                                                    {changes.map((change) => (
                                                        <div
                                                            key={change.field}
                                                            className="grid grid-cols-1 gap-2 rounded-xl bg-white/[0.03] p-3 text-sm md:grid-cols-[1fr_auto_auto]"
                                                        >
                                                            <span className="font-semibold text-white">
                                                                {change.field}
                                                            </span>

                                                            <span className="rounded-lg bg-red-500/10 px-2 py-1 text-xs font-bold text-red-300">
                                                                {formatValue(
                                                                    change.before,
                                                                    t
                                                                )}
                                                            </span>

                                                            <span className="rounded-lg bg-green-500/10 px-2 py-1 text-xs font-bold text-green-300">
                                                                {formatValue(
                                                                    change.after,
                                                                    t
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <p className="mt-3 text-xs text-gray-600">
                                            {formatDateTimeByLanguage(
                                                activity.createdAt,
                                                appLanguage
                                            )}
                                        </p>
                                    </div>

                                    {activity.accountId && (
                                        <Link
                                            href={`/accounts/${activity.accountId}`}
                                            className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                                        >
                                            {t.openAccount}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
                        {t.emptyState}
                    </div>
                )}
            </div>
        </div>
    );
}
