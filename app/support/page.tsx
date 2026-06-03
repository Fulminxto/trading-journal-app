import {
    LifeBuoy,
    Bug,
    MessageSquareWarning,
    Lightbulb,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { createSupportTicket } from "./actions";
import GlobalToast from "@/components/GlobalToast";
import {
    formatDateByLanguage,
    normalizeAppLanguage,
    type AppLanguage,
} from "@/lib/i18n";

type SupportLabels = {
    eyebrow: string;
    title: string;
    description: string;

    reportBugTitle: string;
    reportBugDescription: string;
    requestFeatureTitle: string;
    requestFeatureDescription: string;
    contactSupportTitle: string;
    contactSupportDescription: string;

    newTicketEyebrow: string;
    newTicketTitle: string;
    typeBug: string;
    typeFeature: string;
    typeSupport: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    submitTicket: string;

    ticketsEyebrow: string;
    ticketsTitle: string;
    newTicketButton: string;
    noTickets: string;
    adminResponse: string;
    resolvedAt: string;

    statusOpen: string;
    statusInProgress: string;
    statusResolved: string;
    statusClosed: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    priorityUrgent: string;
    unknown: string;
};

const supportLabels: Record<
    AppLanguage,
    SupportLabels
> = {
    it: {
        eyebrow: "Supporto & Help Center",
        title: "Centro Supporto",
        description:
            "Contatta il supporto VOLTIS per problemi, richieste o feedback operativi.",

        reportBugTitle: "Segnala bug",
        reportBugDescription:
            "Segnala problemi tecnici o comportamenti anomali dell'applicazione.",
        requestFeatureTitle: "Richiedi funzione",
        requestFeatureDescription:
            "Suggerisci nuove funzionalità o miglioramenti per VOLTIS.",
        contactSupportTitle: "Contatta supporto",
        contactSupportDescription:
            "Contatta direttamente il supporto operativo.",

        newTicketEyebrow: "Nuovo ticket supporto",
        newTicketTitle: "Invia una richiesta",
        typeBug: "Segnala bug",
        typeFeature: "Richiedi funzione",
        typeSupport: "Contatta supporto",
        subjectPlaceholder: "Oggetto",
        messagePlaceholder:
            "Descrivi il problema o la richiesta...",
        submitTicket: "Invia ticket",

        ticketsEyebrow: "Ticket supporto",
        ticketsTitle: "Cronologia ticket",
        newTicketButton: "Nuovo ticket",
        noTickets: "Nessun ticket presente.",
        adminResponse: "Risposta admin",
        resolvedAt: "Risolto il",

        statusOpen: "Aperto",
        statusInProgress: "In lavorazione",
        statusResolved: "Risolto",
        statusClosed: "Chiuso",
        priorityLow: "Bassa",
        priorityMedium: "Media",
        priorityHigh: "Alta",
        priorityUrgent: "Urgente",
        unknown: "N/D",
    },

    en: {
        eyebrow: "Support & Help Center",
        title: "Support Center",
        description:
            "Contact VOLTIS support for issues, requests or operational feedback.",

        reportBugTitle: "Report Bug",
        reportBugDescription:
            "Report technical problems or unusual application behavior.",
        requestFeatureTitle: "Request Feature",
        requestFeatureDescription:
            "Suggest new features or improvements for VOLTIS.",
        contactSupportTitle: "Contact Support",
        contactSupportDescription:
            "Contact the operational support directly.",

        newTicketEyebrow: "New Support Ticket",
        newTicketTitle: "Submit a Request",
        typeBug: "Report Bug",
        typeFeature: "Request Feature",
        typeSupport: "Contact Support",
        subjectPlaceholder: "Subject",
        messagePlaceholder:
            "Describe the issue or request...",
        submitTicket: "Submit Ticket",

        ticketsEyebrow: "Support Tickets",
        ticketsTitle: "Ticket History",
        newTicketButton: "New Ticket",
        noTickets: "No tickets found.",
        adminResponse: "Admin Response",
        resolvedAt: "Resolved at",

        statusOpen: "Open",
        statusInProgress: "In progress",
        statusResolved: "Resolved",
        statusClosed: "Closed",
        priorityLow: "Low",
        priorityMedium: "Medium",
        priorityHigh: "High",
        priorityUrgent: "Urgent",
        unknown: "N/A",
    },

    uk: {
        eyebrow: "Підтримка & Help Center",
        title: "Центр підтримки",
        description:
            "Зверніться до підтримки VOLTIS щодо проблем, запитів або операційного фідбеку.",

        reportBugTitle: "Повідомити про помилку",
        reportBugDescription:
            "Повідомте про технічні проблеми або нетипову поведінку застосунку.",
        requestFeatureTitle: "Запропонувати функцію",
        requestFeatureDescription:
            "Запропонуйте нові функції або покращення для VOLTIS.",
        contactSupportTitle: "Зв’язатися з підтримкою",
        contactSupportDescription:
            "Зв’яжіться безпосередньо з операційною підтримкою.",

        newTicketEyebrow: "Новий запит підтримки",
        newTicketTitle: "Надіслати запит",
        typeBug: "Повідомити про помилку",
        typeFeature: "Запропонувати функцію",
        typeSupport: "Зв’язатися з підтримкою",
        subjectPlaceholder: "Тема",
        messagePlaceholder:
            "Опишіть проблему або запит...",
        submitTicket: "Надіслати ticket",

        ticketsEyebrow: "Запити підтримки",
        ticketsTitle: "Історія запитів",
        newTicketButton: "Новий ticket",
        noTickets: "Запитів поки немає.",
        adminResponse: "Відповідь адміністратора",
        resolvedAt: "Вирішено",

        statusOpen: "Відкрито",
        statusInProgress: "В роботі",
        statusResolved: "Вирішено",
        statusClosed: "Закрито",
        priorityLow: "Низький",
        priorityMedium: "Середній",
        priorityHigh: "Високий",
        priorityUrgent: "Терміновий",
        unknown: "Н/Д",
    },

    ru: {
        eyebrow: "Поддержка & Help Center",
        title: "Центр поддержки",
        description:
            "Свяжитесь с поддержкой VOLTIS по вопросам, запросам или операционной обратной связи.",

        reportBugTitle: "Сообщить об ошибке",
        reportBugDescription:
            "Сообщите о технических проблемах или необычном поведении приложения.",
        requestFeatureTitle: "Предложить функцию",
        requestFeatureDescription:
            "Предложите новые функции или улучшения для VOLTIS.",
        contactSupportTitle: "Связаться с поддержкой",
        contactSupportDescription:
            "Свяжитесь напрямую с операционной поддержкой.",

        newTicketEyebrow: "Новый запрос поддержки",
        newTicketTitle: "Отправить запрос",
        typeBug: "Сообщить об ошибке",
        typeFeature: "Предложить функцию",
        typeSupport: "Связаться с поддержкой",
        subjectPlaceholder: "Тема",
        messagePlaceholder:
            "Опишите проблему или запрос...",
        submitTicket: "Отправить ticket",

        ticketsEyebrow: "Запросы поддержки",
        ticketsTitle: "История запросов",
        newTicketButton: "Новый ticket",
        noTickets: "Запросов пока нет.",
        adminResponse: "Ответ администратора",
        resolvedAt: "Решено",

        statusOpen: "Открыт",
        statusInProgress: "В работе",
        statusResolved: "Решен",
        statusClosed: "Закрыт",
        priorityLow: "Низкий",
        priorityMedium: "Средний",
        priorityHigh: "Высокий",
        priorityUrgent: "Срочный",
        unknown: "Н/Д",
    },

    es: {
        eyebrow: "Soporte & Help Center",
        title: "Centro de soporte",
        description:
            "Contacta con el soporte de VOLTIS para problemas, solicitudes o feedback operativo.",

        reportBugTitle: "Reportar bug",
        reportBugDescription:
            "Informa problemas técnicos o comportamientos anómalos de la aplicación.",
        requestFeatureTitle: "Solicitar función",
        requestFeatureDescription:
            "Sugiere nuevas funciones o mejoras para VOLTIS.",
        contactSupportTitle: "Contactar soporte",
        contactSupportDescription:
            "Contacta directamente con el soporte operativo.",

        newTicketEyebrow: "Nuevo ticket de soporte",
        newTicketTitle: "Enviar una solicitud",
        typeBug: "Reportar bug",
        typeFeature: "Solicitar función",
        typeSupport: "Contactar soporte",
        subjectPlaceholder: "Asunto",
        messagePlaceholder:
            "Describe el problema o la solicitud...",
        submitTicket: "Enviar ticket",

        ticketsEyebrow: "Tickets de soporte",
        ticketsTitle: "Historial de tickets",
        newTicketButton: "Nuevo ticket",
        noTickets: "No hay tickets.",
        adminResponse: "Respuesta admin",
        resolvedAt: "Resuelto el",

        statusOpen: "Abierto",
        statusInProgress: "En progreso",
        statusResolved: "Resuelto",
        statusClosed: "Cerrado",
        priorityLow: "Baja",
        priorityMedium: "Media",
        priorityHigh: "Alta",
        priorityUrgent: "Urgente",
        unknown: "N/D",
    },

    fr: {
        eyebrow: "Support & Help Center",
        title: "Centre de support",
        description:
            "Contactez le support VOLTIS pour des problèmes, demandes ou retours opérationnels.",

        reportBugTitle: "Signaler un bug",
        reportBugDescription:
            "Signalez des problèmes techniques ou des comportements anormaux de l’application.",
        requestFeatureTitle: "Demander une fonctionnalité",
        requestFeatureDescription:
            "Suggérez de nouvelles fonctionnalités ou améliorations pour VOLTIS.",
        contactSupportTitle: "Contacter le support",
        contactSupportDescription:
            "Contactez directement le support opérationnel.",

        newTicketEyebrow: "Nouveau ticket support",
        newTicketTitle: "Envoyer une demande",
        typeBug: "Signaler un bug",
        typeFeature: "Demander une fonctionnalité",
        typeSupport: "Contacter le support",
        subjectPlaceholder: "Objet",
        messagePlaceholder:
            "Décrivez le problème ou la demande...",
        submitTicket: "Envoyer le ticket",

        ticketsEyebrow: "Tickets support",
        ticketsTitle: "Historique des tickets",
        newTicketButton: "Nouveau ticket",
        noTickets: "Aucun ticket présent.",
        adminResponse: "Réponse admin",
        resolvedAt: "Résolu le",

        statusOpen: "Ouvert",
        statusInProgress: "En cours",
        statusResolved: "Résolu",
        statusClosed: "Fermé",
        priorityLow: "Basse",
        priorityMedium: "Moyenne",
        priorityHigh: "Haute",
        priorityUrgent: "Urgente",
        unknown: "N/D",
    },

    de: {
        eyebrow: "Support & Help Center",
        title: "Support-Center",
        description:
            "Kontaktiere den VOLTIS-Support bei Problemen, Anfragen oder operativem Feedback.",

        reportBugTitle: "Bug melden",
        reportBugDescription:
            "Melde technische Probleme oder ungewöhnliches Verhalten der Anwendung.",
        requestFeatureTitle: "Funktion anfragen",
        requestFeatureDescription:
            "Schlage neue Funktionen oder Verbesserungen für VOLTIS vor.",
        contactSupportTitle: "Support kontaktieren",
        contactSupportDescription:
            "Kontaktiere direkt den operativen Support.",

        newTicketEyebrow: "Neues Support-Ticket",
        newTicketTitle: "Anfrage senden",
        typeBug: "Bug melden",
        typeFeature: "Funktion anfragen",
        typeSupport: "Support kontaktieren",
        subjectPlaceholder: "Betreff",
        messagePlaceholder:
            "Beschreibe das Problem oder die Anfrage...",
        submitTicket: "Ticket senden",

        ticketsEyebrow: "Support-Tickets",
        ticketsTitle: "Ticketverlauf",
        newTicketButton: "Neues Ticket",
        noTickets: "Keine Tickets vorhanden.",
        adminResponse: "Admin-Antwort",
        resolvedAt: "Gelöst am",

        statusOpen: "Offen",
        statusInProgress: "In Bearbeitung",
        statusResolved: "Gelöst",
        statusClosed: "Geschlossen",
        priorityLow: "Niedrig",
        priorityMedium: "Mittel",
        priorityHigh: "Hoch",
        priorityUrgent: "Dringend",
        unknown: "N/A",
    },
};

function normalizeKey(value?: string | null) {
    return (value ?? "")
        .toLowerCase()
        .replace(/\s+/g, "_");
}

function getTypeLabel(
    value: string | null,
    t: SupportLabels
) {
    const key = normalizeKey(value);

    if (key === "bug") {
        return t.typeBug;
    }

    if (key === "feature") {
        return t.typeFeature;
    }

    if (key === "support") {
        return t.typeSupport;
    }

    return value || t.unknown;
}

function getStatusLabel(
    value: string | null,
    t: SupportLabels
) {
    const key = normalizeKey(value);

    if (key === "open") {
        return t.statusOpen;
    }

    if (
        key === "in_progress" ||
        key === "inprogress"
    ) {
        return t.statusInProgress;
    }

    if (key === "resolved") {
        return t.statusResolved;
    }

    if (key === "closed") {
        return t.statusClosed;
    }

    return value || t.unknown;
}

function getPriorityLabel(
    value: string | null,
    t: SupportLabels
) {
    const key = normalizeKey(value);

    if (key === "low") {
        return t.priorityLow;
    }

    if (key === "medium") {
        return t.priorityMedium;
    }

    if (key === "high") {
        return t.priorityHigh;
    }

    if (key === "urgent") {
        return t.priorityUrgent;
    }

    return value || t.unknown;
}

export default async function SupportPage({
    searchParams,
}: {
    searchParams: Promise<{
        toast?: string;
    }>;
}) {
    const query = await searchParams;
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

    if (!user) {
        redirect("/login");
    }

    const language = normalizeAppLanguage(
        user.appLanguage
    );

    const t = supportLabels[language];

    const tickets =
        await prisma.supportTicket.findMany({
            where: {
                userId: session.user.id,
            },

            orderBy: {
                createdAt: "desc",
            },
        });

    return (
        <>
            <GlobalToast status={query.toast} />

            <div className="space-y-8">
                <div>
                    <p className="text-sm text-gray-400">
                        {t.eyebrow}
                    </p>

                    <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
                        <LifeBuoy className="text-cyan-400" />
                        {t.title}
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
                        {t.description}
                    </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 p-6">
                        <div className="flex items-center gap-3">
                            <Bug className="text-red-300" />

                            <h2 className="text-xl font-black text-white">
                                {t.reportBugTitle}
                            </h2>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                            {t.reportBugDescription}
                        </p>
                    </div>

                    <div className="rounded-[32px] border border-yellow-500/20 bg-yellow-500/10 p-6">
                        <div className="flex items-center gap-3">
                            <Lightbulb className="text-yellow-300" />

                            <h2 className="text-xl font-black text-white">
                                {t.requestFeatureTitle}
                            </h2>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                            {t.requestFeatureDescription}
                        </p>
                    </div>

                    <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/10 p-6">
                        <div className="flex items-center gap-3">
                            <MessageSquareWarning className="text-cyan-300" />

                            <h2 className="text-xl font-black text-white">
                                {t.contactSupportTitle}
                            </h2>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-gray-300">
                            {t.contactSupportDescription}
                        </p>
                    </div>
                </div>

                <form
                    id="new-support-ticket"
                    action={createSupportTicket}
                    className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8"
                >
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                        {t.newTicketEyebrow}
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-white">
                        {t.newTicketTitle}
                    </h2>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <select
                            name="type"
                            className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
                        >
                            <option value="bug">
                                {t.typeBug}
                            </option>

                            <option value="feature">
                                {t.typeFeature}
                            </option>

                            <option value="support">
                                {t.typeSupport}
                            </option>
                        </select>

                        <input
                            name="subject"
                            placeholder={t.subjectPlaceholder}
                            required
                            className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
                        />
                    </div>

                    <textarea
                        name="message"
                        placeholder={t.messagePlaceholder}
                        required
                        rows={6}
                        className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
                    />

                    <button
                        type="submit"
                        className="mt-6 rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-cyan-400"
                    >
                        {t.submitTicket}
                    </button>
                </form>

                <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                                {t.ticketsEyebrow}
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">
                                {t.ticketsTitle}
                            </h2>
                        </div>

                        <a
                            href="#new-support-ticket"
                            className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                        >
                            {t.newTicketButton}
                        </a>
                    </div>

                    <div className="mt-8 space-y-4">
                        {tickets.length === 0 ? (
                            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                                <p className="text-sm text-gray-400">
                                    {t.noTickets}
                                </p>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="rounded-[28px] border border-white/10 bg-black/20 p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                                {getTypeLabel(ticket.type, t)}
                                            </p>

                                            <h3 className="mt-2 text-xl font-black text-white">
                                                {ticket.subject}
                                            </h3>

                                            <p className="mt-4 text-sm leading-relaxed text-gray-300">
                                                {ticket.message}
                                            </p>
                                        </div>

                                        <div className="space-y-2 text-right">
                                            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">
                                                {getStatusLabel(ticket.status, t)}
                                            </div>

                                            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                                                {getPriorityLabel(ticket.priority, t)}
                                            </div>
                                        </div>
                                    </div>

                                    {ticket.adminNote && (
                                        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
                                            <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                                {t.adminResponse}
                                            </p>

                                            <p className="mt-3 text-sm leading-relaxed text-gray-300">
                                                {ticket.adminNote}
                                            </p>

                                            {ticket.resolvedAt && (
                                                <p className="mt-4 text-xs text-gray-500">
                                                    {t.resolvedAt}:{" "}
                                                    {formatDateByLanguage(
                                                        ticket.resolvedAt,
                                                        language
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
