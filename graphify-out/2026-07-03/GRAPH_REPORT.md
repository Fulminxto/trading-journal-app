# Graph Report - VOLTIS  (2026-07-03)

## Corpus Check
- 354 files · ~371,288 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 61 nodes · 95 edges · 10 communities (6 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5ec6bfb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_permissions.ts|permissions.ts]]
- [[_COMMUNITY_Sidebar.tsx|Sidebar.tsx]]
- [[_COMMUNITY_actions.ts|actions.ts]]
- [[_COMMUNITY_actions.ts|actions.ts]]
- [[_COMMUNITY_Card.tsx|Card.tsx]]
- [[_COMMUNITY_IconTile.tsx|IconTile.tsx]]
- [[_COMMUNITY_SignatureEdge.tsx|SignatureEdge.tsx]]

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
- `getCopilotAccess()` --calls--> `getAccountMembershipWithAccount()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/actions.ts → lib/permissions.ts
- `CopilotPage()` --calls--> `canUseCopilot()`  [EXTRACTED]
  app/accounts/[accountId]/copilot/page.tsx → lib/permissions.ts
- `getRulesAccess()` --calls--> `canManageRules()`  [EXTRACTED]
  app/accounts/[accountId]/rules/actions.ts → lib/permissions.ts
- `getRulesAccess()` --calls--> `getAccountMembershipWithAccount()`  [EXTRACTED]
  app/accounts/[accountId]/rules/actions.ts → lib/permissions.ts

## Import Cycles
- None detected.

## Communities (10 total, 4 thin omitted)

### Community 1 - "page.tsx"
Cohesion: 0.31
Nodes (5): ANALYZE_LABELS, CopilotPage(), getRiskLabel(), getRiskTone(), getAccountMembershipWithAccount()

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

### Community 6 - "actions.ts"
Cohesion: 0.73
Nodes (5): generateAnalysis(), getCopilotAccess(), getLimitedString(), getString(), sendCopilotMessage()

## Knowledge Gaps
- **16 isolated node(s):** `AccountPermissions`, `AccountLink`, `SidebarLink`, `SidebarProps`, `SidebarLabels` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAccountMembershipWithAccount()` connect `page.tsx` to `page.tsx`, `permissions.ts`, `actions.ts`, `actions.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `canManageRules()` connect `permissions.ts` to `page.tsx`, `actions.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `AccountPermissions`, `AccountLink`, `SidebarLink` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._