# VOLTIS Motion Patterns

## Buttons

Buttons must respond immediately.

### Hover

- subtle visual change
- no large translation
- no dramatic scale
- no floating effect

### Press

- short compression
- immediate response
- no bounce after release

### Disabled

- no interactive motion
- clearly inactive

## Cards

Cards must feel stable and weighted.

Allowed:

- subtle border response
- restrained shadow change
- small depth change when interactive

Avoid:

- repeated floating
- large vertical movement
- excessive scaling
- decorative tilt

## Dropdowns and menus

Menus must open from their trigger.

They should preserve spatial continuity between the trigger and the menu.

Opening should be slightly slower than closing.

Keyboard navigation and focus management are mandatory.

## Modals

Modals should emerge from the current context.

The background may soften slightly, but it must not disappear dramatically.

Focus must move inside the modal.

Closing must return focus to the original trigger.

## Sidebar

The sidebar is part of the application structure.

It expands and contracts rather than entering like an external panel.

Content should adapt smoothly without unnecessary page-wide movement.

## Tables

Tables should remain stable.

Sorting, filtering and row updates must not cause decorative movement.

Rows may use subtle transitions only when they help communicate insertion, deletion or status change.

## Charts

Chart animation must help the user understand data changes.

Avoid replaying full introductory animations on every filter change.

Prefer continuity between old and new values.

## Notifications

Notifications should appear clearly but quietly.

They must not cover important controls.

Success feedback should be restrained.

Errors must be more visible than success messages.

## Drag interactions

Dragged elements must remain connected to the pointer.

Use:

- direct tracking
- restrained scaling
- edge resistance
- clear drop targets

Avoid:

- uncontrolled momentum
- looping
- large bounce
- delayed pointer tracking

## Page transitions

Navigation must feel immediate.

Use subtle continuity rather than full-page cinematic transitions.

Do not animate every element independently.

## Loading

Loading motion must communicate activity without creating visual noise.

Prefer:

- stable skeletons
- subtle progress
- local loading states

Avoid blocking the entire interface when only one section is loading.