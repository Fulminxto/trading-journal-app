import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import AccountLifecycleManager, { type LifecycleAccount, type LifecycleLabels } from "@/components/accounts/AccountLifecycleManager";
import { auth } from "@/lib/auth";
import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type PageLabels = LifecycleLabels & {
  eyebrow: string;
  title: string;
  description: string;
  create: string;
  back: string;
  activeTitle: string;
  activeDescription: string;
  activeEmpty: string;
  archivedTitle: string;
  archivedDescription: string;
  archivedEmpty: string;
  emptyTitle: string;
  emptyDescription: string;
};

const labels: Record<AppLanguage, PageLabels> = {
  en: { eyebrow: "Account lifecycle", title: "Manage accounts", description: "Create, open, archive, restore, or remove the accounts you are authorized to manage.", create: "Create account", back: "Back to account library", activeTitle: "Active accounts", activeDescription: "Accounts currently available as active workspaces.", activeEmpty: "No manageable active accounts.", archivedTitle: "Archived accounts", archivedDescription: "Historical accounts available in read-only mode.", archivedEmpty: "No manageable archived accounts.", emptyTitle: "No manageable accounts", emptyDescription: "You do not currently have permission to manage any trading accounts.", open: "Open workspace", viewArchived: "View archived account", archive: "Archive account", restore: "Restore account", delete: "Delete account", cancel: "Cancel", archiveTitle: "Archive account?", archiveDescription: "The account will move to the archive. Historical access will remain available in read-only mode.", restoreTitle: "Restore account?", restoreDescription: "The account will become active and available as a normal workspace again.", deleteTitle: "Delete account permanently?", deleteDescription: "This permanently deletes the account and its associated data. Archiving is the reversible alternative.", pending: "Updating account…", actionFailed: "The account could not be updated. Try again." },
  it: { eyebrow: "Ciclo di vita account", title: "Gestisci account", description: "Crea, apri, archivia, ripristina o rimuovi gli account che sei autorizzato a gestire.", create: "Crea account", back: "Torna alla libreria account", activeTitle: "Account attivi", activeDescription: "Account attualmente disponibili come workspace attivi.", activeEmpty: "Nessun account attivo gestibile.", archivedTitle: "Account archiviati", archivedDescription: "Account storici disponibili in sola lettura.", archivedEmpty: "Nessun account archiviato gestibile.", emptyTitle: "Nessun account gestibile", emptyDescription: "Al momento non hai il permesso di gestire account di trading.", open: "Apri workspace", viewArchived: "Visualizza account archiviato", archive: "Archivia account", restore: "Ripristina account", delete: "Elimina account", cancel: "Annulla", archiveTitle: "Archiviare l’account?", archiveDescription: "L’account verrà spostato nell’archivio. L’accesso storico resterà disponibile in sola lettura.", restoreTitle: "Ripristinare l’account?", restoreDescription: "L’account tornerà attivo e disponibile come normale workspace.", deleteTitle: "Eliminare definitivamente l’account?", deleteDescription: "Questa azione elimina definitivamente l’account e i dati associati. L’archiviazione è l’alternativa reversibile.", pending: "Aggiornamento account…", actionFailed: "Impossibile aggiornare l’account. Riprova." },
  uk: { eyebrow: "Життєвий цикл акаунтів", title: "Керування акаунтами", description: "Створюйте, відкривайте, архівуйте, відновлюйте або видаляйте акаунти, якими вам дозволено керувати.", create: "Створити акаунт", back: "Назад до бібліотеки акаунтів", activeTitle: "Активні акаунти", activeDescription: "Акаунти, доступні як активні робочі простори.", activeEmpty: "Немає активних акаунтів для керування.", archivedTitle: "Архівні акаунти", archivedDescription: "Історичні акаунти доступні лише для читання.", archivedEmpty: "Немає архівних акаунтів для керування.", emptyTitle: "Немає акаунтів для керування", emptyDescription: "Наразі у вас немає дозволу керувати торговими акаунтами.", open: "Відкрити робочий простір", viewArchived: "Переглянути архівний акаунт", archive: "Архівувати акаунт", restore: "Відновити акаунт", delete: "Видалити акаунт", cancel: "Скасувати", archiveTitle: "Архівувати акаунт?", archiveDescription: "Акаунт буде переміщено до архіву. Історичний доступ залишиться в режимі лише для читання.", restoreTitle: "Відновити акаунт?", restoreDescription: "Акаунт знову стане активним робочим простором.", deleteTitle: "Видалити акаунт назавжди?", deleteDescription: "Акаунт і пов’язані дані буде видалено назавжди. Архівування є зворотною альтернативою.", pending: "Оновлення акаунта…", actionFailed: "Не вдалося оновити акаунт. Спробуйте ще раз." },
  ru: { eyebrow: "Жизненный цикл аккаунтов", title: "Управление аккаунтами", description: "Создавайте, открывайте, архивируйте, восстанавливайте или удаляйте аккаунты, которыми вам разрешено управлять.", create: "Создать аккаунт", back: "Назад к библиотеке аккаунтов", activeTitle: "Активные аккаунты", activeDescription: "Аккаунты, доступные как активные рабочие пространства.", activeEmpty: "Нет активных аккаунтов для управления.", archivedTitle: "Архивные аккаунты", archivedDescription: "Исторические аккаунты доступны только для чтения.", archivedEmpty: "Нет архивных аккаунтов для управления.", emptyTitle: "Нет аккаунтов для управления", emptyDescription: "Сейчас у вас нет разрешения управлять торговыми аккаунтами.", open: "Открыть рабочее пространство", viewArchived: "Просмотреть архивный аккаунт", archive: "Архивировать аккаунт", restore: "Восстановить аккаунт", delete: "Удалить аккаунт", cancel: "Отмена", archiveTitle: "Архивировать аккаунт?", archiveDescription: "Аккаунт будет перемещён в архив. Исторический доступ останется доступен только для чтения.", restoreTitle: "Восстановить аккаунт?", restoreDescription: "Аккаунт снова станет активным рабочим пространством.", deleteTitle: "Удалить аккаунт навсегда?", deleteDescription: "Аккаунт и связанные данные будут удалены навсегда. Архивирование — обратимая альтернатива.", pending: "Обновление аккаунта…", actionFailed: "Не удалось обновить аккаунт. Попробуйте ещё раз." },
  es: { eyebrow: "Ciclo de vida de cuentas", title: "Gestionar cuentas", description: "Crea, abre, archiva, restaura o elimina las cuentas que estás autorizado a gestionar.", create: "Crear cuenta", back: "Volver a la biblioteca de cuentas", activeTitle: "Cuentas activas", activeDescription: "Cuentas disponibles actualmente como espacios de trabajo activos.", activeEmpty: "No hay cuentas activas gestionables.", archivedTitle: "Cuentas archivadas", archivedDescription: "Cuentas históricas disponibles en modo de solo lectura.", archivedEmpty: "No hay cuentas archivadas gestionables.", emptyTitle: "No hay cuentas gestionables", emptyDescription: "Actualmente no tienes permiso para gestionar cuentas de trading.", open: "Abrir espacio de trabajo", viewArchived: "Ver cuenta archivada", archive: "Archivar cuenta", restore: "Restaurar cuenta", delete: "Eliminar cuenta", cancel: "Cancelar", archiveTitle: "¿Archivar cuenta?", archiveDescription: "La cuenta se moverá al archivo. El acceso histórico seguirá disponible en modo de solo lectura.", restoreTitle: "¿Restaurar cuenta?", restoreDescription: "La cuenta volverá a estar activa y disponible como espacio de trabajo normal.", deleteTitle: "¿Eliminar cuenta permanentemente?", deleteDescription: "Esto elimina permanentemente la cuenta y sus datos. Archivar es la alternativa reversible.", pending: "Actualizando cuenta…", actionFailed: "No se pudo actualizar la cuenta. Inténtalo de nuevo." },
  fr: { eyebrow: "Cycle de vie des comptes", title: "Gérer les comptes", description: "Créez, ouvrez, archivez, restaurez ou supprimez les comptes que vous êtes autorisé à gérer.", create: "Créer un compte", back: "Retour à la bibliothèque de comptes", activeTitle: "Comptes actifs", activeDescription: "Comptes actuellement disponibles comme espaces de travail actifs.", activeEmpty: "Aucun compte actif à gérer.", archivedTitle: "Comptes archivés", archivedDescription: "Comptes historiques disponibles en lecture seule.", archivedEmpty: "Aucun compte archivé à gérer.", emptyTitle: "Aucun compte à gérer", emptyDescription: "Vous n’êtes actuellement autorisé à gérer aucun compte de trading.", open: "Ouvrir l’espace de travail", viewArchived: "Voir le compte archivé", archive: "Archiver le compte", restore: "Restaurer le compte", delete: "Supprimer le compte", cancel: "Annuler", archiveTitle: "Archiver le compte ?", archiveDescription: "Le compte sera archivé. L’accès historique restera disponible en lecture seule.", restoreTitle: "Restaurer le compte ?", restoreDescription: "Le compte redeviendra actif et disponible comme espace de travail normal.", deleteTitle: "Supprimer définitivement le compte ?", deleteDescription: "Cette action supprime définitivement le compte et ses données. L’archivage est l’alternative réversible.", pending: "Mise à jour du compte…", actionFailed: "Impossible de mettre à jour le compte. Réessayez." },
  de: { eyebrow: "Kontolebenszyklus", title: "Konten verwalten", description: "Erstelle, öffne, archiviere, stelle wieder her oder entferne Konten, die du verwalten darfst.", create: "Konto erstellen", back: "Zurück zur Kontobibliothek", activeTitle: "Aktive Konten", activeDescription: "Konten, die derzeit als aktive Arbeitsbereiche verfügbar sind.", activeEmpty: "Keine verwaltbaren aktiven Konten.", archivedTitle: "Archivierte Konten", archivedDescription: "Historische Konten sind schreibgeschützt verfügbar.", archivedEmpty: "Keine verwaltbaren archivierten Konten.", emptyTitle: "Keine verwaltbaren Konten", emptyDescription: "Du bist derzeit nicht berechtigt, Trading-Konten zu verwalten.", open: "Arbeitsbereich öffnen", viewArchived: "Archiviertes Konto anzeigen", archive: "Konto archivieren", restore: "Konto wiederherstellen", delete: "Konto löschen", cancel: "Abbrechen", archiveTitle: "Konto archivieren?", archiveDescription: "Das Konto wird archiviert. Historischer Zugriff bleibt schreibgeschützt verfügbar.", restoreTitle: "Konto wiederherstellen?", restoreDescription: "Das Konto wird wieder aktiv und als normaler Arbeitsbereich verfügbar.", deleteTitle: "Konto dauerhaft löschen?", deleteDescription: "Dadurch werden das Konto und seine Daten dauerhaft gelöscht. Archivieren ist die umkehrbare Alternative.", pending: "Konto wird aktualisiert…", actionFailed: "Das Konto konnte nicht aktualisiert werden. Versuche es erneut." },
};

export default async function ManageAccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, appLanguage: true, canCreatePersonalAccounts: true, canCreateSharedAccounts: true, canArchiveOwnAccounts: true, canDeleteOwnAccounts: true },
  });
  if (!currentUser) redirect("/login");

  const isGlobalAdmin = currentUser.role === "FOUNDER" || currentUser.role === "ADMIN";
  const canCreateAccount = isGlobalAdmin || currentUser.canCreatePersonalAccounts || currentUser.canCreateSharedAccounts;
  const accounts = await prisma.tradingAccount.findMany({
    where: { OR: [{ createdById: currentUser.id }, { members: { some: { userId: currentUser.id, role: "MANAGER" } } }] },
    select: { id: true, name: true, status: true, type: true, currency: true, broker: true, createdById: true, members: { where: { userId: currentUser.id }, select: { role: true }, take: 1 } },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  const lifecycleAccounts: LifecycleAccount[] = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    status: account.status,
    type: account.type,
    currency: account.currency,
    broker: account.broker,
    role: account.members[0]?.role ?? null,
    canArchiveOrRestore: isGlobalAdmin || (account.createdById === currentUser.id && currentUser.canArchiveOwnAccounts),
    canDelete: account.status === "ACTIVE" && (isGlobalAdmin || (account.createdById === currentUser.id && currentUser.canDeleteOwnAccounts)),
  }));
  const activeAccounts = lifecycleAccounts.filter((account) => account.status === "ACTIVE");
  const archivedAccounts = lifecycleAccounts.filter((account) => account.status === "ARCHIVED");
  const t = labels[normalizeAppLanguage(currentUser.appLanguage)];
  // Visual prototype only — real soft-delete persistence and 14-day lifecycle are deferred.
  const recentlyDeletedPreview = process.env.NODE_ENV === "development"
    ? { name: "Test 5", type: "DEMO", currency: "USD", daysRemaining: 12 }
    : null;

  return <div className="space-y-8"><header><p className="text-micro uppercase tracking-label text-accent-bright">{t.eyebrow}</p><div className="mb-2 mt-2 flex items-center gap-4"><h1 className="text-section text-flash">{t.title}</h1><Link href="/accounts" aria-label="Back to account library" className="group/back inline-flex h-8 w-fit shrink-0 translate-y-[1px] items-center gap-2 rounded-full border border-white/[0.05] bg-[#070d19]/80 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/25 hover:text-slate-200 hover:shadow-[0_0_15px_rgba(0,242,254,0.05)] focus-visible:border-cyan-400/30 focus-visible:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"><ArrowLeft size={14} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover/back:-translate-x-[3px] group-focus-visible/back:-translate-x-[3px] motion-reduce:transform-none motion-reduce:transition-none" /><span>BACK TO LIBRARY</span></Link></div><p className="max-w-2xl text-sm leading-6 text-muted">{t.description}</p></header><AccountLifecycleManager activeAccounts={activeAccounts} archivedAccounts={archivedAccounts} recentlyDeletedPreview={recentlyDeletedPreview} labels={t} /></div>;
}
