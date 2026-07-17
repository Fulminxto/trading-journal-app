# VOLTIS — Project State

## Current Focus
Rebranding, UI coherence, premium layout refinement, sidebar/icon consistency, and long-term project governance.

## Current Status
- Production build passes.
- Nine Prisma migrations define the current database foundation.
- Next.js build succeeds.
- App routes are active.
- Persistent MT5 batch synchronization is implemented end to end in the repository.
- The protocol uses durable `SyncOperation`, `SyncOperationItem`, and `SyncOperationEffect` records.
- Batch start, item processing, and completion are idempotent and concurrency-safe.
- Completion counters derive from durable receipts and terminalize as `COMPLETED`, `PARTIAL`, or `FAILED`.
- Account state, equity, aggregate ActivityLog, Notifications, and push outbox rows are persisted transactionally at completion.
- Push delivery runs post-commit through a bounded durable-effect dispatcher.
- The MT5 EA uses three attempts with a 500 ms delay and never falls back to unbound imports after batch start.
- 143 unit tests pass, and MetaEditor compilation completed with 0 errors.
- The repository was clean at the completed implementation checkpoint.
- Rebranding changes are in progress.
- Several UI files were modified recently.
- AGENTS.md and CLAUDE.md were deleted and need to be reviewed/replaced if still useful.

## Active Priorities
1. Stabilize current rebranding work.
2. Preserve project memory through root documentation.
3. Improve Claude/Codex continuity.
4. Add design governance.
5. Add security checks before deploy.

## Open Attention Points
- Real MT5-to-VOLTIS end-to-end execution is deferred because no active MT5 account is available. This is verification of completed implementation, not unfinished development; live MT5 synchronization has not yet been tested.
- Viewer role exists but role assignment flow still needs review.
- Sidebar footer behavior should match VOLTIS desired layout.
- Icons need sharper/premium consistency.
- Notification panel should include "View all" behavior.
- Onboarding and role/member system need future refinement.

## Rule
Before major changes, AI assistants must read this file plus:
- UI_RULES.md
- BRAND_SYSTEM.md
- DECISIONS.md
- KNOWN_BUGS.md
