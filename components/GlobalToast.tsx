"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type MessageEntry = {
  type: "success" | "error" | "info" | "warning";
  messages: Record<AppLanguage, string>;
};

type Props = {
  status?: string;
  language?: string;
};

const TOAST_MESSAGES: Record<string, MessageEntry> =
  {
    success: {
      type: "success",
      messages: {
        it: "Operazione completata con successo.",
        en: "Operation completed successfully.",
        uk: "Операцію виконано успішно.",
        ru: "Операция выполнена успешно.",
        es: "Operación completada con éxito.",
        fr: "Opération effectuée avec succès.",
        de: "Vorgang erfolgreich abgeschlossen.",
      },
    },
    created: {
      type: "success",
      messages: {
        it: "Elemento creato con successo.",
        en: "Item created successfully.",
        uk: "Елемент створено успішно.",
        ru: "Элемент создан успешно.",
        es: "Elemento creado con éxito.",
        fr: "Élément créé avec succès.",
        de: "Element erfolgreich erstellt.",
      },
    },
    updated: {
      type: "success",
      messages: {
        it: "Modifiche salvate con successo.",
        en: "Changes saved successfully.",
        uk: "Зміни збережено успішно.",
        ru: "Изменения сохранены успешно.",
        es: "Cambios guardados con éxito.",
        fr: "Modifications enregistrées avec succès.",
        de: "Änderungen erfolgreich gespeichert.",
      },
    },
    deleted: {
      type: "success",
      messages: {
        it: "Elemento eliminato con successo.",
        en: "Item deleted successfully.",
        uk: "Елемент видалено успішно.",
        ru: "Элемент удалён успешно.",
        es: "Elemento eliminado con éxito.",
        fr: "Élément supprimé avec succès.",
        de: "Element erfolgreich gelöscht.",
      },
    },
    archived: {
      type: "info",
      messages: {
        it: "Elemento archiviato con successo.",
        en: "Item archived successfully.",
        uk: "Елемент заархівовано успішно.",
        ru: "Элемент заархивирован успешно.",
        es: "Elemento archivado con éxito.",
        fr: "Élément archivé avec succès.",
        de: "Element erfolgreich archiviert.",
      },
    },
    error: {
      type: "error",
      messages: {
        it: "Qualcosa è andato storto. Riprova.",
        en: "Something went wrong. Try again.",
        uk: "Щось пішло не так. Спробуйте ще раз.",
        ru: "Что-то пошло не так. Попробуйте снова.",
        es: "Algo salió mal. Inténtalo de nuevo.",
        fr: "Une erreur s'est produite. Réessayez.",
        de: "Etwas ist schiefgelaufen. Versuche es erneut.",
      },
    },
    "username-taken": {
      type: "error",
      messages: {
        it: "Questo nome utente è già in uso.",
        en: "This username is already in use.",
        uk: "Це ім'я користувача вже використовується.",
        ru: "Это имя пользователя уже занято.",
        es: "Este nombre de usuario ya está en uso.",
        fr: "Ce nom d'utilisateur est déjà utilisé.",
        de: "Dieser Benutzername ist bereits vergeben.",
      },
    },
    frozen: {
      type: "warning",
      messages: {
        it: "Utente sospeso con successo.",
        en: "User suspended successfully.",
        uk: "Користувача призупинено успішно.",
        ru: "Пользователь приостановлен успешно.",
        es: "Usuario suspendido con éxito.",
        fr: "Utilisateur suspendu avec succès.",
        de: "Benutzer erfolgreich gesperrt.",
      },
    },
    unfrozen: {
      type: "success",
      messages: {
        it: "Utente riattivato con successo.",
        en: "User reactivated successfully.",
        uk: "Користувача повторно активовано успішно.",
        ru: "Пользователь повторно активирован успешно.",
        es: "Usuario reactivado con éxito.",
        fr: "Utilisateur réactivé avec succès.",
        de: "Benutzer erfolgreich reaktiviert.",
      },
    },
    "password-reset": {
      type: "success",
      messages: {
        it: "Password aggiornata con successo.",
        en: "Password updated successfully.",
        uk: "Пароль оновлено успішно.",
        ru: "Пароль обновлён успешно.",
        es: "Contraseña actualizada con éxito.",
        fr: "Mot de passe mis à jour avec succès.",
        de: "Passwort erfolgreich aktualisiert.",
      },
    },
    "user-created": {
      type: "success",
      messages: {
        it: "Utente creato con successo.",
        en: "User created successfully.",
        uk: "Користувача створено успішно.",
        ru: "Пользователь создан успешно.",
        es: "Usuario creado con éxito.",
        fr: "Utilisateur créé avec succès.",
        de: "Benutzer erfolgreich erstellt.",
      },
    },
    "user-deleted": {
      type: "success",
      messages: {
        it: "Utente eliminato con successo.",
        en: "User deleted successfully.",
        uk: "Користувача видалено успішно.",
        ru: "Пользователь удалён успешно.",
        es: "Usuario eliminado con éxito.",
        fr: "Utilisateur supprimé avec succès.",
        de: "Benutzer erfolgreich gelöscht.",
      },
    },
  };

export default function GlobalToast({
  status,
  language,
}: Props) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current || !status) {
      return;
    }

    const entry = TOAST_MESSAGES[status];

    if (!entry) {
      return;
    }

    const lang = normalizeAppLanguage(language);
    const message =
      entry.messages[lang] ?? entry.messages.en;

    if (entry.type === "success") {
      toast.success(message);
    } else if (entry.type === "error") {
      toast.error(message);
    } else if (entry.type === "info") {
      toast.info(message);
    } else if (entry.type === "warning") {
      toast.warning(message);
    }

    shown.current = true;
  }, [status, language]);

  return null;
}
