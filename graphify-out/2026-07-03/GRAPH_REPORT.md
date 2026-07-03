# Graph Report - VOLTIS  (2026-07-03)

## Corpus Check
- 358 files · ~371,954 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 98 nodes · 130 edges · 14 communities (9 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1f805e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_permissions.ts|permissions.ts]]
- [[_COMMUNITY_Sidebar.tsx|Sidebar.tsx]]
- [[_COMMUNITY_actions.ts|actions.ts]]
- [[_COMMUNITY_ScopeBar.tsx|ScopeBar.tsx]]
- [[_COMMUNITY_Card.tsx|Card.tsx]]
- [[_COMMUNITY_IconTile.tsx|IconTile.tsx]]
- [[_COMMUNITY_SignatureEdge.tsx|SignatureEdge.tsx]]
- [[_COMMUNITY_actions.ts|actions.ts]]
- [[_COMMUNITY_NotificationBell.tsx|NotificationBell.tsx]]
- [[_COMMUNITY_ListRow.tsx|ListRow.tsx]]
- [[_COMMUNITY_Pill.tsx|Pill.tsx]]

## God Nodes (most connected - your core abstractions)
1. `getAccountMembershipWithAccount()` - 9 edges
2. `canManageRules()` - 6 edges
3. `canUseCopilot()` - 6 edges
4. `getCopilotAccess()` - 5 edges
5. `CopilotPage()` - 5 edges
6. `saveTradingGoals()` - 5 edges
7. `RulesPage()` - 5 edges
8. `getString()` - 4 edges
9. `sendCopilotMessage()` - 4 edges
10. `generateAnalysis()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `getCopilotAccess()` --calls--> `canUseCopilot()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/actions.ts → lib/permissions.ts
- `CopilotPage()` --calls--> `canUseCopilot()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/page.tsx → lib/permissions.ts
- `getRulesAccess()` --calls--> `canManageRules()`  [EXTRACTED]
  app/accounts/[accountId]/rules/actions.ts → lib/permissions.ts
- `getRulesAccess()` --calls--> `getAccountMembershipWithAccount()`  [EXTRACTED]
  app/accounts/[accountId]/rules/actions.ts → lib/permissions.ts
- `RulesPage()` --calls--> `canManageRules()`  [EXTRACTED]
  app/accounts/[accountId]/rules/page.tsx → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (14 total, 5 thin omitted)

### Community 1 - "page.tsx"
Cohesion: 0.25
Nodes (10): generateAnalysis(), getCopilotAccess(), getLimitedString(), getString(), sendCopilotMessage(), ANALYZE_LABELS, CopilotPage(), getRiskLabel() (+2 more)

### Community 2 - "page.tsx"
Cohesion: 0.28
Nodes (6): DisciplineRule, formatPercent(), getResultTone(), RulesLabels, RulesPage(), StatCardProps

### Community 3 - "permissions.ts"
Cohesion: 0.33
Nodes (7): GET(), AccountPermissionFlags, canManageRules(), canUseCopilot(), getAccountPermissions(), isManager(), PERMISSION_SELECT

### Community 4 - "Sidebar.tsx"
Cohesion: 0.22
Nodes (6): AccountLink, AccountPermissions, baseLinks, SidebarLabels, SidebarLink, SidebarProps

### Community 5 - "actions.ts"
Cohesion: 0.57
Nodes (6): getIntegerInRange(), getNumber(), getNumberInRange(), getRulesAccess(), getString(), saveTradingGoals()

### Community 6 - "ScopeBar.tsx"
Cohesion: 0.25
Nodes (6): ALL_TRADERS_LABEL, Member, PERIOD_LABEL, PRESETS, Props, TRADER_LABEL

### Community 7 - "Card.tsx"
Cohesion: 0.20
Nodes (6): AppShellUser, labels, Topbar(), TopbarLabels, TopbarUser, CardProps

### Community 10 - "actions.ts"
Cohesion: 0.33
Nodes (3): InviteFormLabels, Input(), InputProps

### Community 11 - "NotificationBell.tsx"
Cohesion: 0.25
Nodes (4): InviteCopy, NotificationItem, PanelCopy, RELATIVE_TIME_UNITS

## Knowledge Gaps
- **34 isolated node(s):** `NotificationItem`, `PanelCopy`, `InviteCopy`, `RELATIVE_TIME_UNITS`, `Member` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAccountMembershipWithAccount()` connect `page.tsx` to `page.tsx`, `permissions.ts`, `actions.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `canManageRules()` connect `permissions.ts` to `page.tsx`, `actions.ts`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `NotificationItem`, `PanelCopy`, `InviteCopy` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._