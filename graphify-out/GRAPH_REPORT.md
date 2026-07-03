# Graph Report - VOLTIS  (2026-07-03)

## Corpus Check
- 359 files · ~373,065 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 161 nodes · 202 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ab49fc5`
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
2. `canManageRules()` - 6 edges
3. `canUseCopilot()` - 6 edges
4. `getCopilotAccess()` - 5 edges
5. `CopilotPage()` - 5 edges
6. `saveTradingGoals()` - 5 edges
7. `RulesPage()` - 5 edges
8. `DashboardPage()` - 4 edges
9. `getString()` - 4 edges
10. `sendCopilotMessage()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `getRulesAccess()` --calls--> `canManageRules()`  [EXTRACTED]
  app/accounts/[accountId]/rules/actions.ts → lib/permissions.ts
- `getRulesAccess()` --calls--> `getAccountMembershipWithAccount()`  [EXTRACTED]
  app/accounts/[accountId]/rules/actions.ts → lib/permissions.ts
- `RulesPage()` --calls--> `canManageRules()`  [EXTRACTED]
  app/accounts/[accountId]/rules/page.tsx → lib/permissions.ts
- `RulesPage()` --calls--> `getAccountMembershipWithAccount()`  [EXTRACTED]
  app/accounts/[accountId]/rules/page.tsx → lib/permissions.ts
- `getCopilotAccess()` --calls--> `canUseCopilot()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/actions.ts → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 1 - "page.tsx"
Cohesion: 0.16
Nodes (17): generateAnalysis(), getCopilotAccess(), getLimitedString(), getString(), sendCopilotMessage(), ANALYZE_LABELS, CopilotPage(), getRiskLabel() (+9 more)

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
Cohesion: 0.28
Nodes (6): DisciplineRule, formatPercent(), getResultTone(), RulesLabels, RulesPage(), StatCardProps

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
Cohesion: 0.57
Nodes (6): getIntegerInRange(), getNumber(), getNumberInRange(), getRulesAccess(), getString(), saveTradingGoals()

## Knowledge Gaps
- **57 isolated node(s):** `DiaryLabels`, `StatCardProps`, `EquityLabels`, `EmptyStateProps`, `DrawdownPoint` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAccountMembershipWithAccount()` connect `page.tsx` to `actions.ts`, `page.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `canManageRules()` connect `page.tsx` to `actions.ts`, `page.tsx`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **What connects `DiaryLabels`, `StatCardProps`, `EquityLabels` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `Card.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._