export const ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE =
  "This account is archived and read-only.";

export class ArchivedAccountReadOnlyError extends Error {
  readonly httpStatus = 409;

  constructor() {
    super(ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE);
    this.name = "ArchivedAccountReadOnlyError";
  }
}

export type ArchivedCorrectionAccess = {
  intent: "ARCHIVED_CORRECTION";
  authorized: boolean;
};

export function isArchivedAccount(status: string): boolean {
  return status === "ARCHIVED";
}

export function assertAccountWritable(
  status: string,
  correctionAccess?: ArchivedCorrectionAccess
): void {
  if (!isArchivedAccount(status)) return;
  if (
    correctionAccess?.intent === "ARCHIVED_CORRECTION" &&
    correctionAccess.authorized
  ) return;
  throw new ArchivedAccountReadOnlyError();
}

export function getArchivedCorrectionAccess(
  correctionRequested: boolean,
  authorized: boolean
): ArchivedCorrectionAccess | undefined {
  return correctionRequested
    ? { intent: "ARCHIVED_CORRECTION", authorized }
    : undefined;
}

export function getArchivedAccountActionError(status: string) {
  return isArchivedAccount(status)
    ? { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE }
    : null;
}
