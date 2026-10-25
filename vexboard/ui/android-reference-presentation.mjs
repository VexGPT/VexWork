export const VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA = 'vexboard.android-reference-presentation/v1';
export const ANDROID_REFERENCE_STYLE_ID = 'vexboard-android-reference-presentation-v1';

const SAFE = /[^A-Za-z0-9_-]+/g;

const CSS = `
.shape.android-reference {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.shape.android-reference .role-marker,
.shape.android-reference .kind-marker,
.shape.android-reference .contained-marker,
.shape.android-reference .branch-marker { display:none; }
.shape.android-role-product-frame {
  background:transparent;border:1px solid #a8a29e;border-radius:18px;box-shadow:none;
}
.shape.android-role-product-frame>.shape-label {
  position:absolute;left:14px;top:10px;padding:4px 8px;border-radius:999px;
  background:#fafaf9;color:#57534e;font:700 9px ui-monospace,monospace;letter-spacing:.04em;text-transform:uppercase;
}
.shape.android-role-screen-frame {
  background:var(--vex-android-background,#0f1012);border:2px solid var(--vex-android-outline-variant,#383a42);border-radius:var(--vex-android-radius-extra-large,20px);box-shadow:0 16px 40px #0004;color:var(--vex-android-on-surface,#f5f5f4);padding:0;
}
.shape.android-role-screen-frame>.shape-label {
  position:absolute;right:10px;bottom:9px;width:auto;padding:3px 7px;border:1px solid var(--vex-android-outline,#5a5d68);border-radius:999px;
  background:var(--vex-android-surface,#17181c);color:var(--vex-android-on-surface-variant,#b7b8bf);font:700 8px ui-monospace,monospace;text-transform:uppercase;letter-spacing:.05em;
}
.shape.android-role-screen-anchor {
  background:#f5f3ff;border:2px solid #7c3aed;border-radius:14px;color:#4c1d95;font-weight:800;
}
.shape.android-role-state-chip {
  background:#fff7ed;border:1px solid #fdba74;border-radius:999px;box-shadow:none;color:#9a3412;
  font:800 9px ui-monospace,monospace;letter-spacing:.03em;text-transform:uppercase;padding:2px 9px;
}
.shape.android-role-toolbar {
  background:var(--vex-android-surface,#17181c);border:0;border-bottom:1px solid var(--vex-android-outline-variant,#383a42);border-radius:var(--vex-android-radius-extra-large,20px) var(--vex-android-radius-extra-large,20px) 0 0;box-shadow:none;color:var(--vex-android-on-surface,#f5f5f4);
  justify-content:flex-start;text-align:left;padding:0 18px;
  font-family:var(--vex-android-title-large-family,system-ui);font-size:var(--vex-android-title-large-size,16px);line-height:var(--vex-android-title-large-line,20px);font-weight:var(--vex-android-title-large-weight,400);
}
.shape.android-role-surface {
  background:var(--vex-android-surface-container-high,#272930);border:1px solid var(--vex-android-outline-variant,#383a42);border-radius:var(--vex-android-radius-large,12px);box-shadow:none;color:var(--vex-android-on-surface,#f5f5f4);
}
.shape.android-role-surface>.shape-label {
  font-family:var(--vex-android-headline-small-family,system-ui);font-size:var(--vex-android-headline-small-size,17px);line-height:var(--vex-android-headline-small-line,22px);font-weight:var(--vex-android-headline-small-weight,400);
}
.shape.android-role-text { border:0;background:transparent;box-shadow:none;color:var(--vex-android-on-surface,#f5f5f4);justify-content:flex-start;text-align:left;white-space:pre-line; }
.shape.android-role-text.android-variant-title {
  font-family:var(--vex-android-title-medium-family,system-ui);font-size:var(--vex-android-title-medium-size,12px);line-height:var(--vex-android-title-medium-line,17px);font-weight:var(--vex-android-title-medium-weight,500);
}
.shape.android-role-text.android-variant-supporting {
  color:var(--vex-android-on-surface-variant,#b7b8bf);font-family:var(--vex-android-body-large-family,system-ui);font-size:var(--vex-android-body-large-size,12px);line-height:var(--vex-android-body-large-line,17px);font-weight:var(--vex-android-body-large-weight,400);
}
.shape.android-role-text.android-variant-empty {
  color:var(--vex-android-on-surface-variant,#b7b8bf);font-family:var(--vex-android-body-large-family,system-ui);font-size:var(--vex-android-body-large-size,12px);line-height:var(--vex-android-body-large-line,17px);font-weight:var(--vex-android-body-large-weight,400);
}
.shape.android-role-button {
  border-radius:var(--vex-android-radius-full,999px);box-shadow:none;padding:6px 12px;
  font-family:var(--vex-android-label-large-family,system-ui);font-size:var(--vex-android-label-large-size,10px);line-height:var(--vex-android-label-large-line,14px);font-weight:var(--vex-android-label-large-weight,500);
}
.shape.android-role-button.android-variant-primary { background:var(--vex-android-primary,#f2f2ef);border-color:var(--vex-android-primary,#f2f2ef);color:var(--vex-android-on-primary,#111216); }
.shape.android-role-button.android-variant-secondary { background:var(--vex-android-secondary-container,#4a4458);border-color:var(--vex-android-secondary-container,#4a4458);color:var(--vex-android-on-secondary-container,#e8def8); }
.shape.android-role-button.android-variant-danger { background:var(--vex-android-error-container,#8c1d18);border-color:var(--vex-android-error-container,#8c1d18);color:var(--vex-android-on-error-container,#f9dedc); }
.shape.android-role-icon-button {
  border:0;border-radius:var(--vex-android-radius-full,999px);background:transparent;box-shadow:none;color:var(--vex-android-on-surface,#f5f5f4);padding:0;font-size:0;
}
.shape.android-role-icon-button::after { font-size:20px;line-height:1; }
.shape.android-role-icon-button.android-variant-search::after { content:"⌕"; }
.shape.android-role-icon-button.android-variant-menu::after { content:"☰"; }
.shape.android-role-icon-button.android-variant-settings::after { content:"⚙"; }
.shape.android-role-icon-button>.shape-label { display:none; }
.shape.android-role-scroll-viewport {
  background:transparent;border:0;border-radius:0;box-shadow:none;padding:0;overflow:hidden;
}
.shape.android-role-scroll-viewport>.shape-label { display:none; }
.shape.android-role-tab {
  border-radius:var(--vex-android-radius-full,999px);box-shadow:none;
  font-family:var(--vex-android-label-large-family,system-ui);font-size:var(--vex-android-label-large-size,10px);line-height:var(--vex-android-label-large-line,14px);font-weight:var(--vex-android-label-large-weight,500);
}
.shape.android-role-tab.android-variant-selected { background:var(--vex-android-primary,#f2f2ef);border-color:var(--vex-android-primary,#f2f2ef);color:var(--vex-android-on-primary,#111216); }
.shape.android-role-tab.android-variant-default { background:transparent;border:1px solid var(--vex-android-outline,#5a5d68);color:var(--vex-android-primary,#f2f2ef); }
.shape.android-role-status-row {
  background:transparent;border:0;border-radius:var(--vex-android-radius-medium,9px);box-shadow:none;color:var(--vex-android-on-surface-variant,#b7b8bf);justify-content:flex-start;text-align:left;padding-left:18px;
  font-family:var(--vex-android-body-medium-family,system-ui);font-size:var(--vex-android-body-medium-size,10px);line-height:var(--vex-android-body-medium-line,14px);font-weight:var(--vex-android-body-medium-weight,400);
}
.shape.android-role-status-row.android-variant-loading::before { content:"◌";font-size:18px;margin-right:10px;color:var(--vex-android-primary,#f2f2ef); }
.shape.android-role-list-row {
  background:#17181c;border:0;border-radius:14px;box-shadow:none;color:var(--vex-android-on-surface,#f5f5f4);justify-content:flex-start;text-align:left;
  white-space:pre-line;padding:12px 14px 12px 48px;font-size:11px;line-height:1.35;
}
.shape.android-role-list-row::before { content:"♪";position:absolute;left:16px;font-size:22px;color:var(--vex-android-primary,#f2f2ef); }
.shape.android-role-list-row.android-variant-hub-and-local { outline:1px solid var(--vex-android-secondary-container,#4a4458); }
.shape.android-role-fab {
  background:var(--vex-android-primary-container,#4f378b);border:0;border-radius:var(--vex-android-radius-large,12px);box-shadow:0 7px 18px #0005;color:var(--vex-android-on-primary-container,#eaddff);font-size:0;padding:0;
}
.shape.android-role-fab::after { font-size:18px; }
.shape.android-role-fab.android-variant-play::after { content:"▶"; }
.shape.android-role-fab.android-variant-shuffle::after { content:"↝"; }
.shape.android-role-fab>.shape-label { display:none; }
.shape.android-role-modal-sheet {
  background:var(--vex-android-surface-container-low,#1d1b20);border:1px solid var(--vex-android-outline,#5a5d68);border-radius:var(--vex-android-radius-extra-large,20px) var(--vex-android-radius-extra-large,20px) 0 0;box-shadow:0 -12px 32px #0008;color:var(--vex-android-on-surface,#f5f5f4);padding:16px 12px;
}
.shape.android-role-modal-sheet>.shape-label {
  position:absolute;left:18px;top:12px;width:auto;color:var(--vex-android-on-surface,#f5f5f4);
  font-family:var(--vex-android-headline-small-family,system-ui);font-size:var(--vex-android-headline-small-size,17px);line-height:var(--vex-android-headline-small-line,22px);font-weight:var(--vex-android-headline-small-weight,400);
}
.shape.android-role-depth-portal {
  background:#eef2ff;border:2px solid #6366f1;border-radius:14px;color:#3730a3;font-weight:800;
}
.shape.android-role-arch-node { background:#fff;border:1px solid #cbd5e1;border-radius:12px;color:#1c1917;box-shadow:0 4px 14px #0001; }
.shape.android-role-arch-node.android-variant-non-owner { border-style:dashed;color:#78716c;background:#fafaf9; }
.shape.android-role-arch-group { background:#f8fafc;border:2px dashed #94a3b8;border-radius:16px;color:#334155;align-items:flex-start;justify-content:flex-start; }
.shape.android-role-api-endpoint { background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;color:#1e3a8a;justify-content:flex-start;text-align:left;padding-left:12px;font:700 10px ui-monospace,monospace; }
`;

function safe(value) {
  return String(value ?? '').trim().replaceAll('_', '-').replace(SAFE, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

export function normalizeAndroidReferencePresentation(input) {
  if (!input || input.schemaVersion !== VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA) return null;
  if (typeof input.profileRef !== 'string' || !input.profileRef) throw new TypeError('Android presentation profileRef required');
  if (!Array.isArray(input.items)) throw new TypeError('Android presentation items must be an array');
  const seen = new Set();
  for (const entry of input.items) {
    if (typeof entry?.projectionItemRef !== 'string' || !entry.projectionItemRef) throw new TypeError('Android presentation projectionItemRef required');
    if (seen.has(entry.projectionItemRef)) throw new TypeError(`duplicate Android presentation projectionItemRef ${entry.projectionItemRef}`);
    seen.add(entry.projectionItemRef);
    if (typeof entry.role !== 'string' || !entry.role) throw new TypeError(`Android presentation role required for ${entry.projectionItemRef}`);
  }
  if (input.relationships !== undefined) {
    if (!Array.isArray(input.relationships)) throw new TypeError('Android presentation relationships must be an array');
    const relationshipRefs = new Set();
    for (const route of input.relationships) {
      if (typeof route?.relationshipRef !== 'string' || !route.relationshipRef) throw new TypeError('Android presentation relationshipRef required');
      if (relationshipRefs.has(route.relationshipRef)) throw new TypeError(`duplicate Android presentation relationshipRef ${route.relationshipRef}`);
      relationshipRefs.add(route.relationshipRef);
      if (!seen.has(route.fromProjectionItemRef) || !seen.has(route.toProjectionItemRef)) {
        throw new TypeError(`Android presentation relationship ${route.relationshipRef} must reference known projection items`);
      }
    }
  }
  return input;
}

export function androidReferenceHint(presentationInput, projectionItemRef) {
  const presentation = normalizeAndroidReferencePresentation(presentationInput);
  if (!presentation) return null;
  return presentation.items.find((entry) => entry.projectionItemRef === projectionItemRef) ?? null;
}

export function androidReferenceClassNames(presentationInput, projectionItemRef) {
  const hint = androidReferenceHint(presentationInput, projectionItemRef);
  if (!hint) return Object.freeze([]);
  const classes = ['android-reference', `android-role-${safe(hint.role)}`];
  if (hint.variant) classes.push(`android-variant-${safe(hint.variant)}`);
  if (hint.styleRef) classes.push(`android-style-${safe(String(hint.styleRef).replace(/^style\./, ''))}`);
  return Object.freeze(classes);
}

export function androidReferenceRelationshipRoute(presentationInput, relationshipRef) {
  const presentation = normalizeAndroidReferencePresentation(presentationInput);
  if (!presentation || !Array.isArray(presentation.relationships)) return null;
  return presentation.relationships.find((route) => route.relationshipRef === relationshipRef) ?? null;
}

export function androidReferenceScrollAxis(presentationInput, projectionItemRef) {
  const hint = androidReferenceHint(presentationInput, projectionItemRef);
  if (hint?.role !== 'SCROLL_VIEWPORT') return null;
  return hint.variant === 'VERTICAL' ? 'VERTICAL' : 'HORIZONTAL';
}

export function androidReferenceScrolledOccurrence(
  presentationInput,
  itemBounds,
  parentProjectionItemRef,
  parentBounds,
  scrollOffset = 0,
) {
  const axis = parentProjectionItemRef
    ? androidReferenceScrollAxis(presentationInput, parentProjectionItemRef)
    : null;
  if (!axis) return null;
  if (!itemBounds || !parentBounds) throw new TypeError('scroll occurrence bounds required');
  if (typeof scrollOffset !== 'number' || !Number.isFinite(scrollOffset) || scrollOffset < 0) {
    throw new TypeError('scrollOffset must be a non-negative finite number');
  }

  const bounds = {
    ...itemBounds,
    x: itemBounds.x - (axis === 'HORIZONTAL' ? scrollOffset : 0),
    y: itemBounds.y - (axis === 'VERTICAL' ? scrollOffset : 0),
  };
  const leftCut = Math.max(0, parentBounds.x - bounds.x);
  const topCut = Math.max(0, parentBounds.y - bounds.y);
  const rightCut = Math.max(0, (bounds.x + bounds.width) - (parentBounds.x + parentBounds.width));
  const bottomCut = Math.max(0, (bounds.y + bounds.height) - (parentBounds.y + parentBounds.height));
  const hidden =
    leftCut >= bounds.width ||
    rightCut >= bounds.width ||
    topCut >= bounds.height ||
    bottomCut >= bounds.height;

  return Object.freeze({
    axis,
    bounds: Object.freeze(bounds),
    hidden,
    clipPath: hidden
      ? null
      : `inset(${topCut}px ${rightCut}px ${bottomCut}px ${leftCut}px)`,
  });
}

function requiredVisualToken(designInput, group, tokenRef) {
  const value = designInput?.visualTokens?.[group]?.[tokenRef];
  if (value === undefined || value === null) {
    throw new TypeError(`Android reference visual token missing: ${group}.${tokenRef}`);
  }
  return value;
}

export function androidReferenceCssVariables(designInput, presentationInput) {
  const presentation = normalizeAndroidReferencePresentation(presentationInput);
  if (!presentation) return Object.freeze({});
  const scale = Number(presentation.referenceViewport?.boardScalePerDp ?? 1);
  if (!Number.isFinite(scale) || scale <= 0) throw new TypeError('Android presentation boardScalePerDp invalid');
  const color = (ref) => requiredVisualToken(designInput, 'colors', ref);
  const shape = (ref) => requiredVisualToken(designInput, 'shapes', ref);
  const typography = (ref) => requiredVisualToken(designInput, 'typography', ref);
  const fontScale = Number(presentation.referenceViewport?.fontScale ?? 1);
  if (!Number.isFinite(fontScale) || fontScale <= 0) throw new TypeError('Android presentation fontScale invalid');
  const fontFamily = (token) =>
    token.fontFamily === 'SERIF'
      ? 'Georgia, serif'
      : token.fontFamily === 'MONOSPACE'
        ? 'ui-monospace, SFMono-Regular, Menlo, monospace'
        : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const textVars = {};
  for (const ref of [
    'headlineSmall', 'titleLarge', 'titleMedium', 'bodyLarge',
    'bodyMedium', 'labelLarge', 'labelSmall',
  ]) {
    const token = typography(ref);
    const prefix = `--vex-android-${ref.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;
    textVars[`${prefix}-family`] = fontFamily(token);
    textVars[`${prefix}-size`] = `${Number(token.fontSizeSp) * fontScale * scale}px`;
    if (token.lineHeightSp !== undefined) {
      textVars[`${prefix}-line`] = `${Number(token.lineHeightSp) * fontScale * scale}px`;
    }
    textVars[`${prefix}-weight`] = String(token.fontWeight);
  }
  return Object.freeze({
    ...textVars,
    '--vex-android-background': color('background'),
    '--vex-android-on-surface': color('onSurface'),
    '--vex-android-on-surface-variant': color('onSurfaceVariant'),
    '--vex-android-surface': color('surface'),
    '--vex-android-surface-container': color('surfaceContainer'),
    '--vex-android-surface-container-low': color('surfaceContainerLow'),
    '--vex-android-surface-container-high': color('surfaceContainerHigh'),
    '--vex-android-outline': color('outline'),
    '--vex-android-outline-variant': color('outlineVariant'),
    '--vex-android-primary': color('primary'),
    '--vex-android-on-primary': color('onPrimary'),
    '--vex-android-primary-container': color('primaryContainer'),
    '--vex-android-on-primary-container': color('onPrimaryContainer'),
    '--vex-android-secondary-container': color('secondaryContainer'),
    '--vex-android-on-secondary-container': color('onSecondaryContainer'),
    '--vex-android-error-container': color('errorContainer'),
    '--vex-android-on-error-container': color('onErrorContainer'),
    '--vex-android-radius-medium': `${Number(shape('mediumRadiusDp')) * scale}px`,
    '--vex-android-radius-large': `${Number(shape('largeRadiusDp')) * scale}px`,
    '--vex-android-radius-extra-large': `${Number(shape('extraLargeRadiusDp')) * scale}px`,
    '--vex-android-radius-full': '999px',
  });
}

export function androidReferenceProfileSummary(presentationInput) {
  const presentation = normalizeAndroidReferencePresentation(presentationInput);
  if (!presentation) return null;
  const viewport = presentation.referenceViewport ?? {};
  return Object.freeze({
    profileRef: presentation.profileRef,
    widthDp: Number(viewport.widthDp),
    heightDp: Number(viewport.heightDp),
    boardScalePerDp: Number(viewport.boardScalePerDp),
  });
}

export function installAndroidReferencePresentation(documentRef = globalThis.document) {
  if (!documentRef?.documentElement || typeof documentRef.createElement !== 'function') return false;
  if (documentRef.getElementById?.(ANDROID_REFERENCE_STYLE_ID)) return false;
  const style = documentRef.createElement('style');
  style.id = ANDROID_REFERENCE_STYLE_ID;
  style.textContent = CSS;
  (documentRef.head ?? documentRef.documentElement).append(style);
  return true;
}

installAndroidReferencePresentation();

// [VXG RealForever][VEXWORK][VEXBOARD][ANDROID-REFERENCE-PRESENTATION]
