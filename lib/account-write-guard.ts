export const ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE =
  "This account is archived and read-only.";

export class ArchivedAccountReadOnlyError extends Error {
  readonly httpStatus = 409;

  constructor() {
    super(ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE);
    this.name = "ArchivedAccountReadOnlyError";
  }
}

export function isArchivedAccount(status: string): boolean {
  return status === "ARCHIVED";
}

export function assertAccountWritable(status: string): void {
  if (isArchivedAccount(status)) {
    throw new ArchivedAccountReadOnlyError();
  }
}

export function getArchivedAccountActionError(status: string) {
  return isArchivedAccount(status)
    ? { error: ARCHIVED_ACCOUNT_READ_ONLY_MESSAGE }
    : null;
}
