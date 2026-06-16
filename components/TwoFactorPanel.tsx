"use client";

import { KeyRound, Pencil, X } from "lucide-react";
import { useState } from "react";

import { type AppLanguage } from "@/lib/i18n";

type Labels = {
  eyebrow: string;
  title: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailSaveBtn: string;
  emailHint: string;
  noEmailHint: string;
  twoFactorLabel: string;
  twoFactorHintOn: string;
  twoFactorHintOff: string;
  twoFactorNoEmail: string;
  devOnlyNotice: string;
  enableBtn: string;
  disableBtn: string;
  savedEmail: string;
  savedToggle: string;
  errorEmailInvalid: string;
  errorEmailTaken: string;
  errorGeneric: string;
  enabled: string;
  disabled: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Sicurezza avanzata",
    title: "Autenticazione a due fattori",
    emailLabel: "Email di verifica",
    emailPlaceholder: "La tua email",
    emailSaveBtn: "Salva",
    emailHint: "I codici 2FA vengono inviati su questa email.",
    noEmailHint: "Necessaria per attivare il 2FA.",
    twoFactorLabel: "2FA via email",
    twoFactorHintOn: "Attivo — codice richiesto ad ogni accesso.",
    twoFactorHintOff: "Non attivo.",
    twoFactorNoEmail: "Aggiungi prima un'email per attivare il 2FA.",
    devOnlyNotice: "Non disponibile in produzione — il servizio email non è ancora configurato.",
    enableBtn: "Attiva 2FA",
    disableBtn: "Disattiva 2FA",
    savedEmail: "Email salvata.",
    savedToggle: "Impostazione 2FA aggiornata.",
    errorEmailInvalid: "Indirizzo email non valido.",
    errorEmailTaken: "Email già associata a un altro account.",
    errorGeneric: "Si è verificato un errore. Riprova.",
    enabled: "Attivo",
    disabled: "Non attivo",
  },
  en: {
    eyebrow: "Advanced security",
    title: "Two-factor authentication",
    emailLabel: "Verification email",
    emailPlaceholder: "Your email",
    emailSaveBtn: "Save",
    emailHint: "2FA codes are sent to this email.",
    noEmailHint: "Required to enable 2FA.",
    twoFactorLabel: "2FA via email",
    twoFactorHintOn: "Enabled — a code is required on every login.",
    twoFactorHintOff: "Disabled.",
    twoFactorNoEmail: "Add an email first to enable 2FA.",
    devOnlyNotice: "Not available in production — email service not yet configured.",
    enableBtn: "Enable 2FA",
    disableBtn: "Disable 2FA",
    savedEmail: "Email saved.",
    savedToggle: "2FA setting updated.",
    errorEmailInvalid: "Invalid email address.",
    errorEmailTaken: "Email already linked to another account.",
    errorGeneric: "Something went wrong. Please try again.",
    enabled: "Enabled",
    disabled: "Disabled",
  },
  uk: {
    eyebrow: "Розширена безпека",
    title: "Двофакторна автентифікація",
    emailLabel: "Email для верифікації",
    emailPlaceholder: "Ваша email",
    emailSaveBtn: "Зберегти",
    emailHint: "Коди 2FA надсилаються на цю email.",
    noEmailHint: "Потрібна для активації 2FA.",
    twoFactorLabel: "2FA через email",
    twoFactorHintOn: "Увімкнено — код потрібен при кожному вході.",
    twoFactorHintOff: "Вимкнено.",
    twoFactorNoEmail: "Спочатку додайте email для активації 2FA.",
    devOnlyNotice: "Недоступно в продакшні — сервіс email ще не налаштовано.",
    enableBtn: "Увімкнути 2FA",
    disableBtn: "Вимкнути 2FA",
    savedEmail: "Email збережено.",
    savedToggle: "Налаштування 2FA оновлено.",
    errorEmailInvalid: "Невірна адреса email.",
    errorEmailTaken: "Email вже пов'язана з іншим акаунтом.",
    errorGeneric: "Виникла помилка. Спробуйте ще раз.",
    enabled: "Увімкнено",
    disabled: "Вимкнено",
  },
  ru: {
    eyebrow: "Расширенная безопасность",
    title: "Двухфакторная аутентификация",
    emailLabel: "Email для верификации",
    emailPlaceholder: "Ваш email",
    emailSaveBtn: "Сохранить",
    emailHint: "Коды 2FA отправляются на этот email.",
    noEmailHint: "Требуется для активации 2FA.",
    twoFactorLabel: "2FA через email",
    twoFactorHintOn: "Включено — код требуется при каждом входе.",
    twoFactorHintOff: "Выключено.",
    twoFactorNoEmail: "Сначала добавьте email для активации 2FA.",
    devOnlyNotice: "Недоступно в продакшне — сервис email ещё не настроен.",
    enableBtn: "Включить 2FA",
    disableBtn: "Выключить 2FA",
    savedEmail: "Email сохранён.",
    savedToggle: "Настройка 2FA обновлена.",
    errorEmailInvalid: "Неверный адрес email.",
    errorEmailTaken: "Email уже привязан к другому аккаунту.",
    errorGeneric: "Произошла ошибка. Попробуйте ещё раз.",
    enabled: "Включено",
    disabled: "Выключено",
  },
  es: {
    eyebrow: "Seguridad avanzada",
    title: "Autenticación de dos factores",
    emailLabel: "Email de verificación",
    emailPlaceholder: "Tu email",
    emailSaveBtn: "Guardar",
    emailHint: "Los códigos 2FA se envían a este email.",
    noEmailHint: "Necesario para activar el 2FA.",
    twoFactorLabel: "2FA por email",
    twoFactorHintOn: "Activo — se requiere código en cada acceso.",
    twoFactorHintOff: "No activo.",
    twoFactorNoEmail: "Añade primero un email para activar el 2FA.",
    devOnlyNotice: "No disponible en producción — el servicio de email aún no está configurado.",
    enableBtn: "Activar 2FA",
    disableBtn: "Desactivar 2FA",
    savedEmail: "Email guardado.",
    savedToggle: "Ajuste 2FA actualizado.",
    errorEmailInvalid: "Dirección email no válida.",
    errorEmailTaken: "Email ya vinculado a otra cuenta.",
    errorGeneric: "Ha ocurrido un error. Inténtalo de nuevo.",
    enabled: "Activo",
    disabled: "No activo",
  },
  fr: {
    eyebrow: "Sécurité avancée",
    title: "Authentification à deux facteurs",
    emailLabel: "Email de vérification",
    emailPlaceholder: "Votre email",
    emailSaveBtn: "Enregistrer",
    emailHint: "Les codes 2FA sont envoyés à cet email.",
    noEmailHint: "Requis pour activer le 2FA.",
    twoFactorLabel: "2FA par email",
    twoFactorHintOn: "Actif — un code est requis à chaque connexion.",
    twoFactorHintOff: "Inactif.",
    twoFactorNoEmail: "Ajoutez d'abord un email pour activer le 2FA.",
    devOnlyNotice: "Non disponible en production — le service email n'est pas encore configuré.",
    enableBtn: "Activer le 2FA",
    disableBtn: "Désactiver le 2FA",
    savedEmail: "Email enregistré.",
    savedToggle: "Paramètre 2FA mis à jour.",
    errorEmailInvalid: "Adresse email invalide.",
    errorEmailTaken: "Email déjà lié à un autre compte.",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
    enabled: "Actif",
    disabled: "Inactif",
  },
  de: {
    eyebrow: "Erweiterte Sicherheit",
    title: "Zwei-Faktor-Authentifizierung",
    emailLabel: "Verifizierungs-E-Mail",
    emailPlaceholder: "Deine E-Mail",
    emailSaveBtn: "Speichern",
    emailHint: "2FA-Codes werden an diese E-Mail gesendet.",
    noEmailHint: "Erforderlich, um 2FA zu aktivieren.",
    twoFactorLabel: "2FA per E-Mail",
    twoFactorHintOn: "Aktiv — bei jeder Anmeldung wird ein Code benötigt.",
    twoFactorHintOff: "Inaktiv.",
    twoFactorNoEmail: "Füge zuerst eine E-Mail hinzu, um 2FA zu aktivieren.",
    devOnlyNotice: "In der Produktion nicht verfügbar — E-Mail-Dienst noch nicht konfiguriert.",
    enableBtn: "2FA aktivieren",
    disableBtn: "2FA deaktivieren",
    savedEmail: "E-Mail gespeichert.",
    savedToggle: "2FA-Einstellung aktualisiert.",
    errorEmailInvalid: "Ungültige E-Mail-Adresse.",
    errorEmailTaken: "E-Mail bereits mit einem anderen Konto verknüpft.",
    errorGeneric: "Ein Fehler ist aufgetreten. Bitte erneut versuchen.",
    enabled: "Aktiv",
    disabled: "Inaktiv",
  },
};

const isDev = process.env.NODE_ENV === "development";

async function patchSecurity(body: Record<string, unknown>) {
  return fetch("/api/settings/security", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default function TwoFactorPanel({
  initialEmail,
  initialEnabled,
  language,
}: {
  initialEmail: string | null;
  initialEnabled: boolean;
  language: AppLanguage;
}) {
  const t = labels[language] ?? labels.en;

  const [email, setEmail] = useState(initialEmail ?? "");
  const [emailInput, setEmailInput] = useState(initialEmail ?? "");
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialEnabled);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function flash(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEmail(true);
    setMessage(null);

    const res = await patchSecurity({
      action: "update-email",
      email: emailInput,
    });

    setLoadingEmail(false);

    if (res.ok) {
      setEmail(emailInput);
      setIsEditingEmail(false);
      flash("success", t.savedEmail);
      return;
    }

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
    };

    if (data.error === "invalid-email") {
      flash("error", t.errorEmailInvalid);
    } else if (data.error === "email-taken") {
      flash("error", t.errorEmailTaken);
    } else {
      flash("error", t.errorGeneric);
    }
  }

  async function handleToggle2FA() {
    setLoadingToggle(true);
    setMessage(null);

    const action = twoFactorEnabled ? "disable-2fa" : "enable-2fa";
    const res = await patchSecurity({ action });

    setLoadingToggle(false);

    if (res.ok) {
      setTwoFactorEnabled(!twoFactorEnabled);
      flash("success", t.savedToggle);
      return;
    }

    flash("error", t.errorGeneric);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center gap-3">
        <KeyRound size={22} className="text-accent" />

        <div>
          <p className="text-sm text-gray-400">{t.eyebrow}</p>
          <h2 className="text-2xl font-bold">{t.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Email card */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">{t.emailLabel}</p>

          {isEditingEmail ? (
            <form onSubmit={handleSaveEmail} className="mt-3 space-y-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-accent/50"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loadingEmail}
                  className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-black transition hover:bg-accent-bright disabled:opacity-50"
                >
                  {t.emailSaveBtn}
                </button>

                {email && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput(email);
                      setIsEditingEmail(false);
                    }}
                    className="rounded-xl border border-white/10 p-2 text-gray-500 transition hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-base font-medium text-white break-all">
                {email}
              </p>

              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="shrink-0 text-gray-500 transition hover:text-white"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
            </div>
          )}

          <p className="mt-3 text-xs text-gray-500">
            {email ? t.emailHint : t.noEmailHint}
          </p>
        </div>

        {/* 2FA toggle card */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">{t.twoFactorLabel}</p>

          <h3
            className={`mt-2 text-lg font-bold ${twoFactorEnabled ? "text-accent" : "text-white"}`}
          >
            {twoFactorEnabled ? t.enabled : t.disabled}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {!email
              ? t.twoFactorNoEmail
              : twoFactorEnabled
                ? t.twoFactorHintOn
                : t.twoFactorHintOff}
          </p>

          {!isDev ? (
            <p className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.06] p-3 text-xs text-yellow-300/80">
              {t.devOnlyNotice}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleToggle2FA}
              disabled={loadingToggle || !email}
              className={`mt-4 rounded-xl px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                twoFactorEnabled
                  ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  : "bg-accent text-black hover:bg-accent-bright"
              }`}
            >
              {twoFactorEnabled ? t.disableBtn : t.enableBtn}
            </button>
          )}
        </div>
      </div>

      {message && (
        <p
          className={`mt-4 rounded-2xl border p-3 text-sm ${
            message.type === "success"
              ? "border-accent/10 bg-accent/10 text-accent"
              : "border-red-500/10 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
