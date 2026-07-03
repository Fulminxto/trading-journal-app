# BRAND SYSTEM

## P0 Rebrand Lock Note

The Typography, Radius, and Motion values below were ratified during the
VOLTIS P0 rebrand pass and match what is implemented in `app/globals.css`
exactly (the `@theme` tokens and `@layer utilities` typographic scale).
These are now the **official VOLTIS lock** — not a draft, not a proposal.

VITALIS shares structural DNA with VOLTIS but has its own soul (warm,
organic, breathing vs. VOLTIS's cold, electric, sharp — see Voltis
Identity / Vitalis Identity below). When VITALIS defines its own tokens,
inherit the *system* (a locked, named type scale; a 3-tier radius system;
a 3-tier motion duration system) — do not copy these specific pixel/ms
values verbatim. Translate them through VITALIS's own identity the same
way VOLTIS translated the shared skeleton through its "cristallo e
fulmine" identity.

---

## Shared Core

All ecosystem products must share:

- same typography logic
- same spacing system
- same radius system
- same card logic
- same motion discipline
- same interaction philosophy

---

## Typography Lock

Primary font:
Inter

Monospace:
JetBrains Mono

Hierarchy (size / line-height / weight):

Hero → 36px / 1.1 / 800
Section → 24px / 1.2 / 700
Subsection → 18px / 1.3 / 600
Metric (large) → 32px / 1.1 / 800, tabular-nums
Metric → 24px / 1.2 / 700, tabular-nums
Body → 14px / 1.5 / 400
Caption → 12px / 1.4 / 500
Micro → 11px / 1.4 / 500

Tracking:

Label → 0.16em
Section → 0.20em
Hero → 0.25em
Brand (wordmark) → 0.42em

Rules:

Never flatten hierarchy.
Never use random font sizes — use one of the named sizes above.
Never overload weights.

---

## Radius Lock

Hard values:

16px (rounded-inner) → inner elements, sub-cards, inputs, icon tiles
24px (rounded-card) → cards, panels, containers
999px (rounded-pill) → pills

No random radius values. Small controls that need a tighter radius than
16px do not yet have a dedicated token — use rounded-inner until one is
introduced, don't invent a one-off value.

---

## Spacing Lock

System:

4
8
12
16
20
24
32
40
48
64

No random spacing.

Spacing must create rhythm.

---

## Surface Logic

Depth system:

background
surface
card
elevated

Maximum 4 depth levels.

No extra layers.

---

## Motion System

Interaction tier (tokenized: --duration-fast/-base/-wide):

Fast → 150ms (hover, small state changes)
Base → 220ms (transitions, halo/border reveals)
Wide → 350ms (modal, larger surface changes)

Structural tier (not tokenized — deliberate exceptions for
layout-level motion, distinct from the interaction tier above):

Sidebar collapse/expand → 500ms
Sidebar active-edge slide → 400ms, cubic-bezier

Rules:

Motion supports clarity.
Never decorative.
Never chaotic.
Use the interaction tier for anything hover/click-triggered. Only use a
structural-tier duration for a genuine layout-level transition, and only
by naming it explicitly (not by picking an arbitrary ms value).

---

## Voltis Identity

Core:

cold
electric
sharp
precise
rare

Visual language:

crystal
lightning
fracture
energy
night

Behavior:

fast
reactive
alive

---

## Vitalis Identity

Core:

warm
organic
breathing
growth
balance

Visual language:

leaf
veins
sunlight
roots
cycles

Behavior:

soft
slow
alive

---

## Shared Ecosystem Rule

Different soul.
Same skeleton.

Every new product must inherit:

structure first.
identity second.