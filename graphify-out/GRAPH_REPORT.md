# Graph Report - VOLTIS  (2026-07-03)

## Corpus Check
- 359 files · ~373,201 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 170 nodes · 215 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `30e5c149`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_permissions.ts|permissions.ts]]
- [[_COMMUNITY_Sidebar.tsx|Sidebar.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_ScopeBar.tsx|ScopeBar.tsx]]
- [[_COMMUNITY_Card.tsx|Card.tsx]]
- [[_COMMUNITY_IconTile.tsx|IconTile.tsx]]
- [[_COMMUNITY_SignatureEdge.tsx|SignatureEdge.tsx]]
- [[_COMMUNITY_actions.ts|actions.ts]]
- [[_COMMUNITY_NotificationBell.tsx|NotificationBell.tsx]]
- [[_COMMUNITY_ListRow.tsx|ListRow.tsx]]
- [[_COMMUNITY_Pill.tsx|Pill.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_DrawdownChart.tsx|DrawdownChart.tsx]]
- [[_COMMUNITY_actions.ts|actions.ts]]

## God Nodes (most connected - your core abstractions)
1. `getAccountMembershipWithAccount()` - 9 edges
2. `CalendarPage()` - 6 edges
3. `canManageRules()` - 6 edges
4. `canUseCopilot()` - 6 edges
5. `getCopilotAccess()` - 5 edges
6. `CopilotPage()` - 5 edges
7. `saveTradingGoals()` - 5 edges
8. `RulesPage()` - 5 edges
9. `DashboardPage()` - 4 edges
10. `getString()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `getCopilotAccess()` --calls--> `getAccountMembershipWithAccount()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/actions.ts → lib/permissions.ts
- `CopilotPage()` --calls--> `getAccountMembershipWithAccount()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/page.tsx → lib/permissions.ts
- `getCopilotAccess()` --calls--> `canUseCopilot()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/actions.ts → lib/permissions.ts
- `CopilotPage()` --calls--> `canUseCopilot()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/page.tsx → lib/permissions.ts
- `getRulesAccess()` --calls--> `canManageRules()`  [EXTRACTED]
  app/accounts/[accountId]/rules/actions.ts → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 1 - "page.tsx"
Cohesion: 0.25
Nodes (10): generateAnalysis(), getCopilotAccess(), getLimitedString(), getString(), sendCopilotMessage(), ANALYZE_LABELS, CopilotPage(), getRiskLabel() (+2 more)

### Community 2 - "page.tsx"
Cohesion: 0.13
Nodes (11): EquityLabels, EquityPage(), formatPercent(), getResultTone(), StatCardProps, EmptyState(), EmptyStateProps, DrawdownPoint (+3 more)

### Community 3 - "permissions.ts"
Cohesion: 0.24
Nodes (7): AccountHubLabels, AccountPage(), formatOptionalPercent(), getResultTone(), HubCard, HubCardText, StatCardProps

### Community 4 - "Sidebar.tsx"
Cohesion: 0.22
Nodes (6): AccountLink, AccountPermissions, baseLinks, SidebarLabels, SidebarLink, SidebarProps

### Community 5 - "page.tsx"
Cohesion: 0.15
Nodes (19): getIntegerInRange(), getNumber(), getNumberInRange(), getRulesAccess(), getString(), saveTradingGoals(), DisciplineRule, formatPercent() (+11 more)

### Community 6 - "ScopeBar.tsx"
Cohesion: 0.25
Nodes (6): ALL_TRADERS_LABEL, Member, PERIOD_LABEL, PRESETS, Props, TRADER_LABEL

### Community 7 - "Card.tsx"
Cohesion: 0.13
Nodes (9): AppShellUser, InviteCopy, NotificationItem, PanelCopy, RELATIVE_TIME_UNITS, labels, Topbar(), TopbarLabels (+1 more)

### Community 8 - "IconTile.tsx"
Cohesion: 0.16
Nodes (13): buildCopy(), getCopy(), OnboardingCard, OnboardingCardText, OnboardingCopy, OnboardingCopyText, OnboardingModal(), OnboardingStep (+5 more)

### Community 10 - "actions.ts"
Cohesion: 0.33
Nodes (3): InviteFormLabels, Input(), InputProps

### Community 11 - "NotificationBell.tsx"
Cohesion: 0.43
Nodes (5): DashboardLabels, DashboardPage(), formatCurrency(), formatPercent(), getResultTone()

### Community 14 - "page.tsx"
Cohesion: 0.24
Nodes (6): LoginFormLabels, getLanguageFromAcceptHeader(), LoginCopy, LoginPage(), Card(), CardProps

### Community 16 - "actions.ts"
Cohesion: 0.36
Nodes (7): CalendarLabels, CalendarPage(), formatNumber(), getDaysInMonth(), getMonthIndex(), getResultTone(), getYearValue()

## Knowledge Gaps
- **58 isolated node(s):** `CalendarLabels`, `DiaryLabels`, `StatCardProps`, `EquityLabels`, `EmptyStateProps` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAccountMembershipWithAccount()` connect `page.tsx` to `page.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `CalendarLabels`, `DiaryLabels`, `StatCardProps` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `Card.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._