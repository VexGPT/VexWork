# VexBoard — Canvas Interaction & Visual Affordance Refinement

`[VXG RealForever]`

## Work identity

```text
workRef = work.vexboard.usability-refinement
state = READY
authority = NO_AUTHORITY
effects = NO_EFFECTS
```

This task preserves a bounded lived-usability refinement discovered while using the accepted VexBoard Pages surface.

It does **not** reopen BoardGraph, Canvas Projection, BoardJourney or Source Projectors as unfinished foundations. The accepted semantics are useful; the human interaction affordances need to become more predictable and legible before heavier patient-zero use.

## Human outcome

A person should be able to open a VexBoard and quickly understand:

- how to move around the canvas;
- whether they are moving the camera, one item, or a containing process frame;
- where labels safely fit inside semantic shapes;
- which visual boundary is a process/container versus the outer canvas extent;
- whether a local draft was actually saved and where it lives;
- which nodes are beginnings, choices, linear steps, endings, and parallel branches;
- the same meaning even when color perception differs.

The refinement should feel calm and discoverable rather than requiring the user to infer interaction rules from failed gestures.

## Why this task is earned

Current lived use exposed concrete mismatches between accepted behavior and perceived behavior.

### 1. Primary-drag navigation is not discoverable

Current browser source only pans when the explicit `PAN` tool is selected:

```text
pointer down on viewport
-> if tool != PAN
     return
```

A human reasonably expects primary-button dragging on empty canvas to move the view, especially on a read-only board.

### 2. Decision labels need shape-aware safe space

The current decision rendering uses a clipped diamond:

```css
.shape.DIAMOND
  clip-path: polygon(...)
  padding: 18px
```

The rectangular content box and the visual diamond do not have the same safe text area. Wrapped labels can therefore look uncomfortably close to the clipped edge even when ordinary CSS padding is present.

### 3. Frame/container meaning is not yet visually explicit enough

BoardGraph already has:

```text
node kind = CONTAINER
shape kind = FRAME
control act = SET_CONTAINMENT
```

The browser can draw a frame, but a newly-created frame is currently just an unparented container/projection item. The UI does not yet teach the distinction between:

```text
semantic containment
projection containment
visual overlap
canvas/world extent
```

That can make auto-adjusting connectors feel as though items are hitting an invisible barrier.

### 4. Save-draft behavior is real but nearly invisible

`Save draft` currently writes the draft to browser `localStorage`.

That means:

```text
SAVE DRAFT != SERVER SAVE
SAVE DRAFT != GITHUB WRITE
SAVE DRAFT != CLOUD SYNC
```

The current button gives little visible confirmation, so a successful browser-local save can feel like no operation happened.

### 5. Role/path coloring needs an accessibility-safe presentation contract

Color is useful for quick recognition, but it should not carry semantic identity by itself.

The desired visual language should make starts, decisions, linear steps, endings and parallel branches easy to scan while remaining understandable for people with common color-vision differences.

## Acceptance slices

### A. Predictable primary-drag navigation

In the default `SELECT` mode:

```text
primary drag on empty canvas
-> pan camera
```

In an editable draft:

```text
primary drag on movable item
-> move that item

primary drag on empty canvas
-> pan camera
```

The explicit `PAN` tool remains available for a deliberate always-pan mode.

Acceptance:

- ordinary click does not accidentally become a pan;
- ordinary empty-canvas drag does not silently deselect before the drag resolves;
- item drag and canvas drag remain distinct;
- camera animation cancels cleanly when the human begins direct manipulation;
- wheel/trackpad zoom remains anchored to the current pointer behavior.

### B. Shape-safe decision labels

Decision text must render inside a dedicated inner label region rather than relying only on the outer diamond box.

Acceptance:

- wrapped decision labels do not intersect or visually touch the clipped diamond edge;
- label centering remains stable when the item is resized;
- zoom does not change the semantic label layout;
- the decision remains a diamond; do not solve clipping by silently changing semantic shape.

A small minimum visible inset is desired. The exact CSS value should be chosen from lived rendering rather than treated as BoardGraph semantics.

### C. Explicit process frames and visible boundaries

Use the existing `CONTAINER` / `FRAME` / `SET_CONTAINMENT` contracts rather than inventing a second grouping model.

A process frame should visibly provide:

```text
top-left frame title
clear frame boundary
contained-child presentation
source/semantic identity through the inspector
```

Permanent:

```text
VISUAL_OVERLAP != SEMANTIC_CONTAINMENT
MOVE_OR_RESIZE != SEMANTIC_REPARENT
FRAME != SECOND_PROCESS_OWNER
```

Acceptance:

- a frame label is visible in a stable top-left header/legend position;
- contained children are visually recognizable as belonging to the frame;
- dropping or dragging across a frame boundary does not silently change semantic parentage;
- when containment changes, it uses the existing explicit containment control;
- the UI distinguishes a process/frame boundary from the outer canvas/world boundary;
- there is no unexplained invisible edge: if the canvas remains finite, its extent is visibly legible; if the implementation chooses dynamic extent growth, movement remains deterministic.

This slice does not require hard-clamping every child to its frame. The point is to make boundaries and containment meaning explicit before stronger layout constraints are earned.

### D. Trustworthy browser-local draft persistence

Keep the first save mechanism browser-local.

Acceptance:

- `Save draft` persists the current local draft in the existing VexBoard storage key;
- a successful save produces visible feedback such as `Saved locally` plus a useful time/state indicator;
- editing after a save makes unsaved state perceptible again;
- returning to Boards / refreshing the page can resume the saved draft;
- local storage failure or quota failure is surfaced to the user instead of silently succeeding;
- wording never implies server, GitHub, cloud or cross-device persistence.

A backend is **not** required for this refinement.

### E. Semantic role coding + parallel-path accents

Separate two presentation questions:

```text
SEMANTIC ROLE
  what kind of step is this?

PATH / BRANCH IDENTITY
  which parallel route does this step belong to?
```

Default standard presentation may use:

```text
BEGIN / entry
  blue accent + non-color start marker

DECISION
  amber/yellow accent + diamond shape

LINEAR PROCESS
  light blue / neutral process fill + rectangle shape

END / terminal
  green accent + non-color terminal marker
```

Parallel routes may rotate through four deterministic accent families, for example:

```text
blue
green/teal
orange
purple
-> repeat only after four groups
```

The repeated color is acceptable only because branch identity also remains visible through grouping, labels, edge treatment or another non-color cue.

Permanent:

```text
COLOR != SEMANTIC IDENTITY
PALETTE != BOARDGRAPH
BRANCH_COLOR != AUTHORITY
```

### F. Palette-mode control

Add one compact presentation control, preferably a small floating/action button using an overlapping-circles palette glyph when that fits the current browser surface.

Activating it cycles presentation modes such as:

```text
STANDARD
-> COLOR_SAFE
-> HIGH_CONTRAST
-> STANDARD
```

Acceptance:

- current mode has an accessible name/tooltip;
- keyboard activation works;
- presentation changes do not mutate BoardGraph or BoardJourney;
- a local preference may persist browser-locally;
- color-safe/high-contrast modes preserve start/decision/end/branch recognition using shape, marker, pattern, border or label cues in addition to color;
- the palette control itself does not become a new semantic owner.

## Proof expectation

Implementation proof should include deterministic regression for:

- empty-canvas primary-drag pan in Select mode;
- editable item drag remaining item movement rather than camera movement;
- decision-label safe-region rendering contract;
- frame title / explicit containment presentation;
- no overlap-driven semantic reparenting;
- saved/dirty/local-save feedback and storage-error behavior;
- palette cycling and non-color semantic cues;
- no source/provider write added by draft save or palette switching.

Because these are lived interaction/presentation claims, final acceptance should also include a Pages/browser walk with screenshots or direct observation at ordinary desktop width.

## Non-goals

This task does not require:

- cloud/server draft persistence;
- GitHub writes from the browser;
- collaborative editing;
- BoardPatch authoring;
- BusinessFactory-specific semantics;
- automatic semantic reparenting from visual overlap;
- a new BoardGraph color schema;
- a global VexWork theme system;
- replacing the current VexBoard rendering stack.

## Relationship to ongoing VexBoard work

This refinement is intentionally parallel to the active Source Projectors/lived-comparison outcome.

It may improve the same browser surface later, but it should not block BusinessFactory/Vex Universe source work and should not absorb Source Projectors, BoardEvidence or BoardPatch ownership.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][USABILITY-REFINEMENT] -->
