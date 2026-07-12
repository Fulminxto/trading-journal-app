# VOLTIS Rebranding Audit

Date: 2026-07-12  
Branch inspected: `feature/workspace-redesign`

## Audit scope and method

This audit is based on the current application routes, shared components, account-specific pages, global areas, loading/error infrastructure, accessibility handlers, responsive classes, and the six documents in `references/motion-system/`.

No application code was modified. Findings about runtime appearance and interaction are inferred from source and should be confirmed with a browser review using realistic account volumes, empty states, errors, keyboard navigation, touch input, and reduced motion.

The graph query was used as an architectural entry point, then verified against the source because the graph also contains internal development tooling and a broad query can surface irrelevant communities.

## 1. Executive Summary

The rebranding is **partially incomplete and still inconsistent in important areas**.

The account operating environment is the most mature part of the product. Dashboard, Diary, Calendar, Equity, Analytics, Sessions, Reports, Rules, Members, Copilot, Playbook, and Integrations use real data, permission checks, localized content, account-aware navigation, and many route-specific skeletons. The shared palette, surfaces, radius tokens, typography classes, and account shell already provide a recognizable VOLTIS foundation.

The main blockers are architectural and cross-cutting:

1. The previous Account Hub still exists as `/accounts/[accountId]/workspace`, is presented as an “Account command hub,” remains linked from the Sidebar, and is described by Onboarding in every supported language.
2. The Account Library is not yet sufficient as the sole account center. It supports discovery, filtering, opening, and archived navigation, but priority signals, contextual actions, account administration, and setup state remain distributed across Library, Manage, Workspace, Members, and Integrations.
3. Settings, Profile, Support, Notifications, Create Account, and some account forms belong to different generations of the rebrand.
4. Shared interactive Cards and ListRows commonly rise on hover and add glow. That clearly conflicts with the new physical language, which describes cards as anchored and explicitly says hover should not lift them.
5. Local error boundaries are effectively absent. The global fallback is still the generic Next.js error component and does not preserve VOLTIS context or provide an appropriate recovery path.
6. Reduced motion is implemented locally in a small number of components rather than enforced as a product-wide policy.
7. Several planned features are exposed in Settings copy even though they are not complete, especially CSV export and the private community area.

The rebrand should not trigger a broad rewrite. Most account pages need targeted consistency work, while the structural effort should be concentrated on Account Hub cleanup, Account Library responsibilities, local error architecture, and the unfinished global areas.

### Documentation assessment

The motion documentation is strong enough to identify clear violations:

- decorative loops;
- bounce and overshoot;
- cards lifting on hover;
- excessive or repeated entrance motion;
- motion that delays work;
- lack of reduced-motion handling;
- loss of object identity or orientation.

It is too generic to approve individual implementation details such as an exact duration, easing curve, scale amount, drawer distance, or breakpoint. Terms such as “premium,” “mechanical,” and “physically believable” communicate direction but are not measurable component tokens. A later documentation pass should define approved timings and interaction patterns.

## 2. What Must Stay

### 2.1 Design foundations

`app/globals.css` already defines a coherent foundation:

- VOLTIS dark surfaces;
- accent, flash, positive, negative, warning, and muted color roles;
- `rounded-card`, `rounded-inner`, and `rounded-pill` radius families;
- shared fast and base durations;
- visible global focus treatment;
- responsive density and typography utilities.

This system should be refined and applied more consistently, not replaced.

### 2.2 Global and account shell structure

`components/AppShell.tsx`, `components/Sidebar.tsx`, `components/Topbar.tsx`, and `components/AccountPageShell.tsx` establish a valid product structure:

- persistent global context;
- account-specific navigation when an account is active;
- responsive sidebar behavior;
- account identity and scope preservation;
- separation between account operations and global tools.

The shell hierarchy should stay. Its labels, motion, focus management, and legacy Workspace link need refinement.

### 2.3 Direct account entry

`app/accounts/[accountId]/page.tsx` redirects directly to `/accounts/[accountId]/dashboard`. This already matches the decision to eliminate Account Hub as an intermediate landing screen and must remain unchanged.

### 2.4 Account data, permissions, and routes

The following foundations are valid and must not be redesigned without a demonstrated functional problem:

- Prisma queries and data calculations;
- account membership and role checks;
- creator and last-manager protections;
- account-specific routes;
- account dashboard redirect;
- server actions;
- archive status logic;
- integration and push APIs;
- notification read and invitation actions.

### 2.5 Operational account pages

These areas are functionally mature and should receive only contextual refinement:

- **Dashboard:** clear operational overview and account context.
- **Diary:** complete create, edit, filter, and replay workflows.
- **Calendar:** accessible month controls, selectable days, and a dedicated day-detail surface.
- **Equity:** responsive chart and desktop/mobile data presentations.
- **Analytics:** modular breakdowns for performance, risk, psychology, symbols, sessions, and weekdays.
- **Sessions:** creation and review flow connected to account data.
- **Reports:** editorial summaries and PDF support.
- **Rules and Playbook:** real constraints, goals, standards, and strategies.
- **Members:** invitations, roles, permissions, and protection rules.
- **Copilot:** contextual analysis components tied to operational data rather than a generic chat-first experience.
- **Integrations:** real setup forms and account linkage state.

### 2.6 Shared components worth preserving

- `components/EmptyState.tsx`: clear title, explanation, optional action, and reusable icon treatment.
- `components/ui/IconTile.tsx`: consistent icon framing.
- `components/ui/SignatureEdge.tsx`: restrained brand signal.
- `components/ToggleSwitch.tsx`: shared boolean preference control.
- `components/ScopeBar.tsx`: preserves analytical context while filters change.
- route-specific skeletons that resemble their final content.
- Recharts with `ResponsiveContainer` for chart responsiveness.
- Sonner as the single toast infrastructure.

### 2.7 Archived account strip

The lightweight Archived accounts strip on `/accounts` is correctly subordinate to the Account Library. Its compact height, restrained surface, persistent visibility at zero, count, and direct route should remain.

### 2.8 Admin separation

Admin is correctly implemented as a separate operational tool with its own density and navigation. It should be evaluated for correctness, legibility, keyboard use, and reliability, but must not define the visual density or interaction model of the standard user application.

## 3. Refinement Needed

| Area / main files | Problem type | Problem and impact | Suggested refinement | Priority |
|---|---|---|---|---|
| Account Library Focus — `components/accounts/AccountLibrary.tsx` | UX / motion | The coverflow uses deep scaling and attenuation and changes selection after hovering a side card. It can feel demonstrative rather than stable, and incidental pointer travel may change state. | Validate the interaction with realistic account counts. Preserve identity and continuity but reduce attenuation if recognition suffers; ensure hover preview does not undermine deliberate selection. | P1 |
| Account Library data model — `app/accounts/page.tsx` | UX / information | The Library shows account metrics but not a consistent operational priority model. | Add only real signals such as pending invitations, integration state, archive state, recent update, or action required. Do not invent health scores. | P1 |
| Account Library actions | Functional / UX | Opening is clear, but contextual management is still delegated to Manage or internal pages. | Define a permission-aware contextual action menu with a small, explicit action set. | P1 |
| Shared Card — `components/ui/Card.tsx` | Motion / visual | Interactive cards use vertical lift, stronger glow, and shadow. The motion specification explicitly says cards should not lift. | Replace lift with border, controlled shadow, and internal-content refinement. Preserve the component API. | P1 |
| Shared ListRow — `components/ui/ListRow.tsx` | Motion | Rows lift on hover, which creates instability in notifications and dense lists. | Use background, border, icon, or text response without translation. | P2 |
| Sidebar — `components/Sidebar.tsx` | Motion / UX | A 500 ms transition is slow for a structural control used repeatedly. | Retain compress/extend continuity but reduce perceived duration after browser testing. | P2 |
| Topbar profile popup — `components/Topbar.tsx` | Accessibility / consistency | Popup behavior differs from the Account type listbox; focus return and Escape behavior need confirmation. | Standardize trigger relationship, Escape, outside click, focus return, and visible focus. | P1 |
| Notification bell — `components/NotificationBell.tsx` | Functional | Fetch failures return `null` and are not shown to the user. Empty, stale, and failed states can become indistinguishable. | Add a local error state with Retry while preserving previous successful content. | P1 |
| Notification popup | Accessibility | Trigger naming exists, but complete `aria-expanded`, `aria-controls`, Escape, and focus management are not evident. | Implement a connected popup pattern and return focus to the trigger on close. | P1 |
| Notification page and bell | Consistency / maintenance | Item, state, and action presentation is duplicated. | Share notification view models and state primitives without forcing the same layout. | P2 |
| Settings — `app/settings/page.tsx` | UX / visual | Very long page, several native selects, mixed preference types, future features, status panels, and support links in one hierarchy. | Refine section hierarchy and shared controls; separate available settings from future capabilities. | P1 |
| Settings planned features | Functional / UX | CSV export and community are explicitly described as planned while appearing inside a production settings center. | Hide, clearly disable with honest status, or complete in a separate functional phase. | P1 |
| Profile — `app/profile/page.tsx` | Visual / consistency | Functionality is broad, but headers, forms, selects, and metric surfaces are locally constructed. | Align with shared headers, inputs, selects, empty states, and feedback without changing profile features. | P2 |
| Support — `app/support/page.tsx` | Visual / accessibility | Real ticketing exists, but typography, native select, and surface treatment are from an older visual generation. | Apply current tokens and accessible form patterns without changing ticket actions. | P1 |
| Create Account — `app/accounts/create/page.tsx` | Visual / form | Uses legacy `rounded-2xl`, `bg-black/30`, and locally styled native controls. | Migrate to existing VOLTIS input and surface primitives. Preserve fields and action behavior. | P1 |
| Diary forms and filters | Consistency / responsive | Many native selects and duplicated control classes create a mixed control language. | Migrate progressively to shared, readable controls; preserve the dense professional workflow. | P2 |
| Sessions, Rules, Playbook | Motion | Repeated CTA and control lift on hover conflicts with the physical language. | Replace generic lift with mechanical press/readiness feedback. | P2 |
| Equity and Drawdown charts | Motion / accessibility | Chart animation is set to 900 ms and no explicit reduced-motion handling is evident. | Shorten initial animation, disable replay on routine filters, and disable or minimize with reduced motion. | P1 |
| Page reveal system | Motion | `reveal-rise` and staggered delays are widespread, including frequently visited data pages. | Keep only where it materially establishes hierarchy; remove decorative repeated staggering. | P2 |
| Global Toast — `components/GlobalToast.tsx` | Feedback | Generic success/error messages are reused for materially different operations. | Keep Sonner but make operational errors contextual and recoverable. | P2 |
| Loading coverage | UX | Many major routes have skeletons, but nested create/edit/detail and Notifications routes have no local loading state. | Add local loading only where real waits occur. Avoid full-page blockers. | P2 |
| Local error coverage | Functional / UX | No route-level `error.tsx` boundaries were found for the primary areas. | Add boundaries that preserve shell and provide Retry. | P0 |
| Global error — `app/global-error.tsx` | Structural / brand | Uses generic `NextError`, losing VOLTIS context and recovery guidance. | Provide a calm branded fallback with retry/support guidance while preserving Sentry. | P0 |

## 4. Redesign or Structural Change Needed

Only four findings require structural work.

### 4.1 Remove the previous Account Hub architecture

`app/accounts/[accountId]/workspace/page.tsx` is not a harmless residual file. It builds `HubModule` entries, labels itself “Account command hub,” summarizes setup and next actions, and presents links to account modules. It remains reachable from the Sidebar.

Required structural decision:

- remove “Workspace Intelligence” from standard navigation;
- redirect or retire `/accounts/[accountId]/workspace`;
- transfer only genuinely useful account-level signals to their correct destinations;
- do not copy the entire Hub into the Account Library.

Roster belongs in Members, audit preview belongs in Activities, module navigation already belongs in the Sidebar, and integrations belong in Integrations. Only a concise real “next action” signal may be appropriate in the Library.

### 4.2 Define the Account Library as the account center

The Library currently acts as an advanced account selector. To replace the Hub, it needs an explicit information contract:

- account identity and type;
- active or archived status;
- real priority or action-required signal;
- open account action;
- permission-aware contextual actions;
- path to full management;
- path to archived history and restoration.

This is an information architecture change, not a visual carousel refinement.

### 4.3 Establish local error architecture

Account pages and global settings should be able to fail without destroying the whole application context. Error boundaries are needed at account-workspace and major global-area levels.

### 4.4 Restructure global preferences

Settings currently mixes saved preferences, browser/device capability, push subscription state, planned exports, future community, support links, and product status. These need separate semantic sections. The settings logic does not need a rewrite, but the information model does.

## 5. Account Hub Cleanup

### 5.1 Residual routes and components

Confirmed remnants include:

- `app/accounts/[accountId]/workspace/page.tsx`;
- `app/accounts/[accountId]/workspace/loading.tsx`;
- `components/skeletons/WorkspaceSkeleton.tsx`;
- `path: "workspace"` / “Workspace Intelligence” in `components/Sidebar.tsx`;
- `HubModule` and `ModuleRow` types/components inside the Workspace page;
- “Account command hub” copy in the Workspace hero;
- “Account Hub & Dashboard” and “start from the Account Hub” in every Onboarding translation;
- “Back to Account Hub” labels in Calendar, Equity, and Sessions localization;
- comments in Diary that still treat Account Hub as a peer destination.

### 5.2 Current usage

The old route is still used because the Sidebar links to it. It is not dead code.

At the same time, `app/accounts/[accountId]/page.tsx` redirects to Dashboard. The product therefore expresses two contradictory entry models:

- direct entry is Dashboard;
- Sidebar and Onboarding still present Workspace/Hub as the account command center.

### 5.3 Cleanup recommendation

1. Remove the Sidebar entry.
2. Replace the Workspace route with a redirect after verifying bookmarks, notifications, and internal links.
3. Remove or repurpose its loading and skeleton files only after the route decision.
4. Update Onboarding in every language.
5. Rename “Back to Account Hub” actions to the real destination, normally Dashboard or Accounts.
6. Map each useful Hub datum to Library, Members, Activities, Integrations, or Dashboard.

### 5.4 Is the Account Library sufficient today?

No.

It is sufficient for:

- listing active accounts;
- searching and filtering;
- switching Focus/Grid;
- opening Dashboard;
- reaching archived accounts.

It is not yet sufficient for:

- understanding real operational priority;
- seeing pending setup or account actions;
- contextual management;
- understanding which actions are permitted;
- deciding whether to open, manage, archive, restore, or resolve an account issue.

## 6. Missing Global Areas

### 6.1 Settings

Exists and includes language, currency, accent, privacy/performance blur, in-app notification preferences, push notifications, update/support categories, and system/support sections.

Incomplete or unclear:

- CSV export is described as planned;
- private community is described as planned;
- device push state and saved preference are conceptually close but not clearly separated;
- several native selects require dark-theme browser verification;
- the page is too long to scan easily.

### 6.2 Profile

Exists and is functionally substantial:

- personal identity;
- profile image;
- workspace name;
- profile completion;
- account access;
- recent trade activity;
- password change;
- security status.

No structural gap was found. It mainly needs consistency refinement and validation feedback review.

### 6.3 Support

Exists with real user and Admin flows:

- support/help content;
- ticket creation;
- ticket categorization;
- user ticket history and status;
- Admin ticket list and detail actions.

It is functionally valid but visually older and relies on native controls. Error and confirmation behavior should be made more contextual.

### 6.4 Notifications

Exists across the full stack:

- topbar bell;
- compact popup;
- full Notification Center page;
- unread count;
- mark one/all read;
- account invitation accept/decline;
- API routes;
- push subscription;
- settings preferences.

Missing or incomplete:

- explicit popup fetch-error state;
- complete popup keyboard/focus contract;
- route-level loading/error state;
- shared presentation model between popup and page;
- rollback or visible recovery after failed optimistic updates.

### 6.5 Authentication and access states

Login, NextAuth routes, pre-login checks, maintenance, and frozen access states exist. The access model is valid.

Items to verify:

- contextual login errors;
- login loading and disabled submission state;
- password recovery if it belongs to product scope;
- accessible announcement of login failures;
- visual consistency of maintenance and frozen screens.

### 6.6 Onboarding

Onboarding exists and is extensively localized. It is incomplete relative to the current product model because it still teaches Account Hub.

Accessibility concerns requiring direct browser verification:

- dialog semantics;
- initial focus;
- focus trap;
- Escape;
- focus return;
- background scroll lock;
- usability of the very long content on small screens.

## 7. Motion Audit

| Pattern | Status | Audit conclusion |
|---|---|---|
| Account Library coverflow continuity | Refine | Stable wrappers preserve identity, which matches the specification. Deep scale/opacity and hover-driven state changes may reduce control and recognizability. |
| Account type listbox | Correct | Chevron motion communicates open state; popup remains connected to its trigger; keyboard behavior exists. |
| Shared Card hover lift | Remove/refine | Explicit contradiction: the documentation says cards do not lift. Keep border/shadow/internal response only. |
| Shared ListRow lift | Remove/refine | Unnecessary movement in lists and notification feeds. |
| Button readiness and press | Missing but useful | Use immediate border/color/pressed feedback. Avoid bounce, delayed response, and generic upward translation. |
| Sidebar compression | Correct principle, refine timing | Layout continuity is appropriate; 500 ms may delay a frequent action. |
| Dropdown emergence | Missing but useful | A short origin-connected reveal supports continuity. It must not become a decorative scale effect. |
| Notification popup | Missing but useful | Short connected opening/closing is appropriate if paired with focus management. |
| Repeated `reveal-rise` | Refine/remove selectively | Useful for initial hierarchy, decorative when replayed on frequently visited data pages or heavily staggered sections. |
| Signature pulse | Remove unless status-driven | Continuous pulse violates the no-loop rule if it is only a brand decoration. |
| Local loading spinner | Correct | Communicates an active request. |
| Skeleton pulse | Correct with reduced motion | Skeleton structure is useful; repetitive animation must be reduced or removed when requested. |
| Chart animation at 900 ms | Refine | Too long for repeated filtering and not visibly governed by reduced motion. |
| Calendar selection feedback | Correct | Color, border, and focus communicate selection without destabilizing layout. |
| Toast entrance/exit | Correct principle | Necessary communication; content quality and error recovery matter more than additional motion. |
| Global page transitions | Not necessary now | Do not add before local loading and error continuity are solved. |
| Table sorting/update motion | Not necessary by default | Stability is more valuable. Animate only a meaningful data transition. |
| Copilot decorative motion | Not necessary | AI should remain subordinate. Animate only loading, streaming, or concrete state change. |
| Reduced-motion policy | Missing | Must cover shared reveals, pulses, chart animations, drawers, and custom motion rather than individual pages only. |

## 8. Consistency Audit

### Layout and hierarchy

- Account pages are generally more coherent than global pages.
- Page headings are implemented through `AccountPageShell`, hero cards, local headers, and `PageHeader` with different hierarchies.
- Settings and Support use large `font-black` headings, while account pages use semantic typography tokens.
- Create Account and Account Review retain older layout decisions.

### Spacing

- Shared spacing is broadly coherent, but local pages freely combine `p-4`, `p-5`, `p-6`, `p-8`, and `sm:p-10`.
- Sessions, Rules, Diary Replay, Settings, and Copilot are particularly dense.
- Density is not inherently wrong in professional tools, but nested cards often make hierarchy less clear.

### Radii

- The current vocabulary is `rounded-card`, `rounded-inner`, and `rounded-pill`.
- `rounded-2xl` and `rounded-3xl` remain in legacy forms, skeletons, and review pages.
- This is a token migration issue, not a reason to redesign functioning layouts.

### Typography

- Semantic classes such as `text-hero`, `text-section`, `text-subsection`, `text-body`, and `text-caption` are a good foundation.
- Locally specified `text-4xl`, `sm:text-6xl`, and repeated `font-black` weaken cross-screen hierarchy.

### Iconography

- Lucide is used consistently.
- `IconTile` gives account pages a recognizable family treatment.
- Icon meaning should be reviewed where the same generic icon is reused for unrelated statuses.

### Cards

- Surface family is coherent.
- Interactive motion is not coherent with the new documentation.
- Several pages implement local card-like empty states instead of the shared component.

### Dropdowns and forms

- Account type has a custom accessible listbox.
- Settings, Support, Diary, Sessions, Members, Create Account, Integrations, and Admin use native selects.
- Native controls are not inherently wrong, but their popup contrast must be verified on target browsers.
- Shared `Input` exists, yet many pages duplicate input classes and focus styles.

### Tables

- Equity provides a stable desktop table and a different mobile presentation.
- Other dense data areas often use cards rather than tables.
- Table captions, header associations, and keyboard access require direct verification.

### Charts

- Equity and Drawdown have a consistent visual family.
- Analytics is modular, but animation settings and accessible text alternatives are not standardized.

### Empty states

- The shared EmptyState is strong.
- Workspace, Playbook, Notifications, and Profile implement local variants.
- Quality varies: the best explain why data is absent and provide a next step; weaker states only state absence.

### Feedback

- Sonner is shared, but some operations use URL query toasts, others client toasts, others redirects with no visible feedback.
- Notification fetch errors are silent.
- Generic errors do not always explain recovery.

### Navigation

- Global/account separation is good.
- Workspace Intelligence duplicates the obsolete Hub.
- “Back to Account Hub” contradicts the actual Dashboard redirect.
- Library, Manage, Archived, and Workspace responsibilities overlap.

## 9. Accessibility and Responsive Audit

### Concrete accessibility issues

1. **Onboarding dialog:** complete `role="dialog"`, `aria-modal`, focus trap, Escape, initial focus, and focus return are not clearly established.
2. **Notification popup:** trigger naming exists, but expanded/controls relationship, Escape, and focus return need implementation or verification.
3. **Calendar day drawer:** dialog semantics exist, but focus trap, initial focus, and return to the selected date need browser verification.
4. **Charts:** visual charts do not consistently expose an equivalent screen-reader summary or data table.
5. **Native selects:** dark-theme option rendering must be tested across supported browsers; the previous Account type bug proves this risk is real.
6. **Focus coverflow:** hidden cards should be excluded from keyboard order; side-card selection and hover selection must result in equivalent, understandable state.
7. **Account rail semantics:** `role="tab"` without explicit associated tabpanels is questionable. Either implement the full tabs pattern or use buttons/listbox semantics.
8. **Filter changes:** result count and selection changes should be announced without excessive live-region noise.
9. **Reduced motion:** Account Library checks the media query locally, but shared reveal, signature pulse, skeletons, and charts do not show an equivalent global policy.
10. **Global error:** generic NextError loses landmarks, navigation, language, and meaningful recovery.
11. **Mobile Sidebar:** focus containment, background inertness, Escape, scroll lock, and return focus must be verified.
12. **Optimistic notification actions:** failed requests can leave UI and server state inconsistent without informing the user.

### Responsive strengths

- broad `sm`, `lg`, and `xl` breakpoint coverage;
- major grids collapse to one column;
- tables commonly switch to mobile cards;
- CTAs often become full-width;
- Account Library rail and filter groups use local horizontal overflow;
- safe-area handling is present in the Sidebar;
- Recharts uses responsive containers;
- Calendar retains named controls and scroll containment.

### Responsive risks

- Settings and Support are long and dense on small screens;
- Onboarding content is unusually large for a modal;
- nested card layouts can create excessive vertical length;
- horizontal filter groups need visible affordance that more content exists;
- the Focus coverflow must be tested with long names, localized labels, one account, two accounts, and more than ten accounts;
- native select popups may behave differently on mobile and desktop.

## 10. Prioritized Roadmap

### 1. P0 — Account Hub removal contract

**Objective:** define and implement the final responsibility boundary between Account Library, Dashboard, Manage, Archived, Members, Integrations, and Activities.

**Pages/components:** Accounts page, Account Library, old Workspace route, Sidebar, Onboarding, Calendar/Equity/Sessions copy.

**Main files:**

- `components/accounts/AccountLibrary.tsx`
- `app/accounts/page.tsx`
- `app/accounts/[accountId]/workspace/page.tsx`
- `app/accounts/[accountId]/page.tsx`
- `components/Sidebar.tsx`
- `components/OnboardingModal.tsx`
- Calendar, Equity, and Sessions localization files

**Completion criteria:**

- no standard navigation to Account Hub;
- direct account entry remains Dashboard;
- no Account Hub onboarding or back labels;
- every useful Workspace datum has an explicit destination;
- Library responsibility is documented and based on real data;
- no permission or route regression.

**Do not touch:** Prisma schema, permission model, dashboard redirect, account page queries unless a demonstrated bug requires it.

### 2. P0 — Local and global error architecture

**Objective:** preserve orientation and recovery when a route or data operation fails.

**Pages/components:** account workspace, Accounts, Settings, Profile, Support, Notifications, global fallback.

**Main files:** `app/global-error.tsx` and new route-level boundaries at the appropriate layout segments.

**Completion criteria:**

- branded calm error language;
- Retry action;
- Sentry preserved;
- shell retained for local failures;
- no generic NextError in primary recovery paths;
- keyboard and screen-reader-accessible focus on the error message.

**Do not touch:** logging configuration or authentication flow.

### 3. P1 — Account Library operational completion

**Objective:** make the Library the real account center after Hub cleanup.

**Pages/components:** Account Library, Accounts page, Archived, Manage links, contextual actions.

**Main files:** `components/accounts/AccountLibrary.tsx`, `app/accounts/page.tsx`, and only narrowly scoped shared controls if required.

**Completion criteria:**

- identity, status, and real priority understandable at a glance;
- contextual actions are permission-aware;
- opening and management are clearly distinct;
- active/archive relationship is clear;
- Focus/Grid share the same data semantics;
- keyboard, touch, reduced motion, and realistic account counts pass review;
- no invented health score or autoplay.

**Do not touch:** Gallery, routes, data model, query semantics, or internal account pages.

### 4. P1 — Global motion baseline

**Objective:** remove shared violations before refining individual screens.

**Pages/components:** global CSS, Card, ListRow, Sidebar, shared loading, charts.

**Main files:** `app/globals.css`, `components/ui/Card.tsx`, `components/ui/ListRow.tsx`, `components/Sidebar.tsx`, chart components.

**Completion criteria:**

- cards and rows do not lift by default;
- buttons provide immediate controlled feedback;
- no decorative continuous pulse;
- reduced motion covers shared animations;
- chart transitions do not replay dramatically on every filter;
- sidebar remains continuous but immediate.

**Do not touch:** functional spinners, progress feedback, or meaningful state transitions.

### 5. P1 — Settings and preference architecture

**Objective:** distinguish available settings, device/browser state, notifications, future capabilities, and support.

**Pages/components:** Settings, PushNotificationsPanel, ToggleSwitch, AccentColorPicker.

**Main files:** `app/settings/page.tsx`, `app/settings/actions.ts`, `components/PushNotificationsPanel.tsx`.

**Completion criteria:**

- only real capabilities appear as enabled actions;
- planned CSV/community functions are honestly separated;
- native controls are readable;
- save and error feedback is contextual;
- mobile scanning is manageable;
- push permission and saved preference are clearly distinct.

**Do not touch:** stored preference fields or push API without a functional defect.

### 6. P1 — Notifications and Support completion

**Objective:** make communication surfaces reliable, accessible, and consistent.

**Pages/components:** NotificationBell, Notification Center, Support page, ticket actions.

**Completion criteria:**

- explicit loading, empty, error, and retry states;
- complete keyboard popup behavior;
- optimistic failures are communicated;
- notification models are shared where useful;
- support form uses current controls without changing ticket logic.

**Do not touch:** notification schema or support workflow unless a confirmed bug requires it.

### 7. P1 — Create Account visual and form completion

**Objective:** remove the most visible legacy form treatment in the account lifecycle.

**Pages/components:** Create Account and shared form controls.

**Completion criteria:** current tokens, readable selects, visible focus, contextual validation, unchanged fields/routes/actions.

### 8. P2 — Profile refinement

**Objective:** align the already complete Profile feature with the global page and form language.

**Completion criteria:** shared hierarchy, controls, empty state, and feedback; no feature removal.

### 9. P2 — Account workspace consistency pass

**Objective:** targeted refinement of Dashboard, Diary, Calendar, Equity, Analytics, Sessions, Reports, Rules, Members, Copilot, Playbook, and Integrations.

**Completion criteria:** readable controls, appropriate empty states, no generic lift, chart reduced motion, no duplicated Account Hub copy, unchanged data and permissions.

### 10. P2 — Loading and local feedback coverage

**Objective:** add local skeletons or pending feedback only where real waits occur.

**Pages/components:** Notifications, Archived, member details, trade create/edit, and other uncovered query-heavy routes.

**Completion criteria:** loading, empty, and error are distinguishable; final layout is represented; no unnecessary full-page blocking.

### 11. P3 — Admin-only audit pass

**Objective:** correct functional, legibility, and accessibility issues without using Admin as the standard-user design benchmark.

**Do not touch:** Admin density or workflow merely to match Account Library.

### 12. P3 — Operationalize the design documentation

**Objective:** remove ambiguity from future motion reviews.

**Deliverables:** approved timing tokens, easing curves, maximum translation/scale, reduced-motion policy, component/radius matrix, and reference keyboard patterns for dropdowns, dialogs, drawers, and notifications.

## 11. Recommended Starting Point

Start with **Account Hub Cleanup and the responsibility contract for the Account Library**.

This is the correct starting point because every subsequent Account Library decision depends on it. Refining the Library before deciding where Workspace information belongs risks building another overloaded Hub under a new visual form. Removing Workspace without mapping its useful signals risks losing real operational value.

### Dependencies resolved

- final Sidebar information architecture;
- actual account entry model;
- Onboarding accuracy;
- distinction between Library, Dashboard, Manage, Archived, Members, Integrations, and Activities;
- definition of contextual account actions;
- definition of which priority signals the Library may show;
- removal of obsolete loading/skeleton/copy only after their route is retired.

### Files that must be read before implementation

- `components/accounts/AccountLibrary.tsx`
- `app/accounts/page.tsx`
- `app/accounts/[accountId]/workspace/page.tsx`
- `app/accounts/[accountId]/workspace/loading.tsx`
- `app/accounts/[accountId]/page.tsx`
- `app/accounts/manage/page.tsx`
- `app/accounts/archived/page.tsx`
- `components/Sidebar.tsx`
- `components/OnboardingModal.tsx`
- `components/skeletons/WorkspaceSkeleton.tsx`
- Calendar, Equity, and Sessions localization/copy
- account permission helpers used by Workspace and Manage

### Concrete result required before moving on

Produce and implement a single, verified product contract:

- **Account Library:** account discovery, real status and priority, opening, contextual actions, and archive access.
- **Dashboard:** operational entry for a selected account.
- **Manage:** configuration and administration.
- **Archived:** history, restoration, and archived-account management.
- **Members / Integrations / Activities:** retain their specialized data and actions.
- **Workspace / Account Hub:** removed from standard navigation and redirected or retired.
- **Sidebar and Onboarding:** fully aligned with this model.

No other redesign should begin until this contract is approved.
