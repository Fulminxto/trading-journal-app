# VOLTIS Codex Motion Rules

These rules are mandatory whenever Codex creates or modifies interface motion.

## Before implementation

Codex must first inspect:

- the existing component
- nearby components
- existing motion utilities
- accessibility behaviour
- responsive behaviour
- reduced-motion support

Do not introduce a new motion pattern when an equivalent pattern already exists.

## Implementation rules

1. Motion must have a functional purpose.
2. Prefer transform and opacity for animated properties.
3. Avoid animating layout-heavy properties unless necessary.
4. Do not add animation to every visible element.
5. Do not introduce bounce by default.
6. Do not introduce continuous looping animations unless they communicate active processing.
7. Keep interactions responsive during animation.
8. Never block clicking until a decorative animation finishes.
9. Preserve keyboard navigation.
10. Preserve visible focus states.
11. Respect prefers-reduced-motion.
12. Avoid regressions on mobile.
13. Avoid unnecessary dependencies.
14. Reuse shared motion tokens and utilities.
15. Do not redesign unrelated parts of the component.

## Default character

When exact motion values are not specified, choose motion that is:

- short
- controlled
- low-amplitude
- non-elastic
- physically plausible
- subordinate to content

## Prohibited defaults

Do not add these without explicit approval:

- autoplay carousels
- looping card rotation
- aggressive parallax
- cursor-following decoration
- large blur animation
- large scale animation
- decorative rotation
- elastic bounce
- page-wide staggered entrances
- animated backgrounds
- constant floating effects

## Required verification

After implementation, verify:

- build passes
- no TypeScript errors
- no console errors
- keyboard interaction works
- Escape closes dismissible layers
- focus returns correctly
- mobile interaction works
- reduced motion works
- animation does not cause layout shift
- animation remains smooth under realistic data