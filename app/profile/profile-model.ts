import type { AppLanguage } from "@/lib/i18n";
import {
  formatDateByLanguage,
  getLocaleFromLanguage,
} from "@/lib/i18n";

export type ProfileReadinessInput = {
  image?: string | null;
  name?: string | null;
  username?: string | null;
  workspaceName?: string | null;
  timezone?: string | null;
  tradingStyle?: string | null;
  favoriteMarket?: string | null;
  preferredSession?: string | null;
  riskPerTrade?: number | null;
  preferredBroker?: string | null;
  setupStyle?: string | null;
};

export function buildProfileReadiness(profile: ProfileReadinessInput) {
  const hasText = (value?: string | null) => Boolean(value?.trim());
  const fields = [
    { label: "Avatar", complete: Boolean(profile.image) },
    { label: "Display Name", complete: hasText(profile.name) },
    { label: "Username", complete: hasText(profile.username) },
    { label: "Workspace Name", complete: hasText(profile.workspaceName) },
    { label: "TimeZone", complete: hasText(profile.timezone) },
    { label: "Trading Style", complete: hasText(profile.tradingStyle) },
    { label: "Favorite Market", complete: hasText(profile.favoriteMarket) },
    { label: "Preferred Session", complete: hasText(profile.preferredSession) },
    {
      label: "Risk Per Trade",
      complete:
        profile.riskPerTrade !== null &&
        profile.riskPerTrade !== undefined &&
        Number.isFinite(profile.riskPerTrade),
    },
    { label: "Broker", complete: hasText(profile.preferredBroker) },
    { label: "Setup Style", complete: hasText(profile.setupStyle) },
  ];
  const completedCount = fields.filter((field) => field.complete).length;

  return {
    fields,
    completedCount,
    missingFields: fields.filter((field) => !field.complete),
    percentage: Math.round((completedCount / fields.length) * 100),
  };
}

export function formatProfileHeaderDateTime(
  date: Date | null | undefined,
  language: AppLanguage
) {
  if (!date) return "Never";

  return `${formatDateByLanguage(date, language)} • ${new Date(
    date
  ).toLocaleTimeString(getLocaleFromLanguage(language), {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
