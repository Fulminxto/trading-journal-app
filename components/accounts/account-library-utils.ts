export type AccountLibraryItem = {
  id: string;
  name: string;
  type: string;
  status: string;
  membershipRole: string;
  membersCount: number;
  formattedMembersCount: string;
  hasMultipleMembers: boolean;
  isSharedType: boolean;
  initialBalance: number;
  formattedInitialBalance: string;
  pnl: number;
  formattedPnl: string;
  pnlValue: number;
  tradeCount: number;
  formattedTradeCount: string;
  winRate: string | null;
  winRateValue: number | null;
  currency: string;
  brokerProvider: string | null;
  updatedAt: string;
  integrationMode: string;
  autoSyncEnabled: boolean;
  syncStatus: string;
  canViewMembers: boolean;
  canManageIntegrations: boolean;
  canOpenManage: boolean;
  canArchiveAccount: boolean;
  canDeleteAccount: boolean;
};

export function sortAccountLibraryItems<
  T extends Pick<AccountLibraryItem, "id" | "name">,
>(accounts: T[]) {
  return [...accounts].sort((left, right) => {
    const nameOrder = left.name.localeCompare(right.name, undefined, {
      sensitivity: "base",
    });
    return nameOrder !== 0 ? nameOrder : left.id.localeCompare(right.id);
  });
}

export function getAccountLibraryPnlAggregate(
  accounts: Array<Pick<AccountLibraryItem, "currency" | "pnl">>,
) {
  if (accounts.length === 0) {
    return { kind: "empty" as const, pnl: 0, currency: null };
  }

  const currencies = new Set(accounts.map((account) => account.currency));
  if (currencies.size !== 1) {
    return { kind: "mixed" as const, pnl: null, currency: null };
  }

  return {
    kind: "single" as const,
    pnl: accounts.reduce((sum, account) => sum + account.pnl, 0),
    currency: accounts[0].currency,
  };
}
