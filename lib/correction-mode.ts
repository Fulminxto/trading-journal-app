export const CORRECTION_MODE_PARAM = "correction";
export const CORRECTION_MODE_VALUE = "1";

export function isCorrectionMode(value: string | string[] | null | undefined) {
  return value === CORRECTION_MODE_VALUE;
}

export function withCorrectionMode(href: string, enabled: boolean) {
  if (!enabled) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}${CORRECTION_MODE_PARAM}=${CORRECTION_MODE_VALUE}`;
}
