/**
 * @resolvescope/text
 *
 * Thin wrappers around @chenglou/pretext for measuring and laying out text
 * without triggering DOM layout reflow (no getBoundingClientRect, no offsetHeight).
 *
 * Pretext works in two phases:
 *   1. `prepare()` — one-time work: normalize whitespace, segment the text,
 *      measure segments via Canvas. Returns an opaque handle. ~19ms per 500 texts.
 *   2. `layout()` — pure arithmetic over cached widths. ~0.09ms per 500 texts.
 *
 * Rule: call `prepare()` once per unique (text, font) pair and cache the result.
 *       Only re-run `layout()` on resize or width changes.
 *
 * Font strings must match your CSS `font` shorthand exactly so Canvas uses the
 * same metrics the browser would. All fonts here mirror src/styles.css tokens:
 *   --font-body:    "Outfit", system-ui, sans-serif
 *   --font-display: "Instrument Serif", Georgia, serif
 *   --font-mono:    "JetBrains Mono", monospace
 *
 * Note: `system-ui` is unsafe for layout accuracy on macOS (pretext caveat).
 * We always fall back to a named font first.
 */

export {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  layoutNextLine,
  walkLineRanges,
  measureNaturalWidth,
  clearCache,
  setLocale,
} from "@chenglou/pretext";

export type {
  PreparedText,
  PreparedTextWithSegments,
  LayoutLine,
  LayoutLineRange,
  LayoutCursor,
} from "@chenglou/pretext";

// ---------------------------------------------------------------------------
// Design-token font strings
// Sync these with --font-* variables in styles.css and any inline `fontFamily`
// declarations in component files (e.g. SpatialPreview.tsx annotation labels).
// ---------------------------------------------------------------------------

/** Body text. Outfit 400, 17px, line-height 1.65 (28px). Default prose size. */
export const FONT_BODY = "17px Outfit" as const;

/** Smaller body variant used in tables, sidebars, and secondary UI. */
export const FONT_BODY_SM = "15px Outfit" as const;

/** Annotation label title — used in SpatialPreview 3D scene labels. */
export const FONT_LABEL = "500 11px Outfit" as const;

/** Annotation label status chip — small all-caps tag above the label title. */
export const FONT_LABEL_STATUS = "600 8px Outfit" as const;

/** Annotation label detail line — muted supporting text beneath the title. */
export const FONT_LABEL_DETAIL = "9px Outfit" as const;

/** Section labels and monospaced badges. */
export const FONT_MONO = "500 12px 'JetBrains Mono'" as const;

/** Display / heading text. Instrument Serif 400. */
export const FONT_DISPLAY = "22px 'Instrument Serif'" as const;

// ---------------------------------------------------------------------------
// Line-height constants (px) matching CSS declarations.
// Pass these as the `lineHeight` argument to `layout()` / `layoutWithLines()`.
// CSS `line-height: 1.65` at 17px → Math.round(17 * 1.65) = 28px.
// ---------------------------------------------------------------------------

export const LINE_HEIGHT_BODY = 28; // 17px × 1.65
export const LINE_HEIGHT_BODY_SM = 25; // 15px × 1.65
export const LINE_HEIGHT_LABEL = 16; // 11px × 1.45 (SpatialPreview lineHeight)
export const LINE_HEIGHT_MONO = 20; // 12px × 1.65

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

import { prepare, layout, prepareWithSegments, walkLineRanges } from "@chenglou/pretext";
import type { PreparedText } from "@chenglou/pretext";

/**
 * Measure the pixel height a block of body-copy text will occupy at a given
 * container width, without touching the DOM.
 *
 * @example
 * // On resize, only re-call this — no re-prepare needed.
 * const height = measureBodyHeight(caseDescription, containerWidth);
 *
 * @param text       The text content to measure.
 * @param maxWidth   The container's available pixel width.
 * @param prepared   Optional pre-computed handle. Pass this on resize to avoid
 *                   re-running the expensive prepare() pass.
 */
export function measureBodyHeight(
  text: string,
  maxWidth: number,
  prepared?: PreparedText
): { height: number; lineCount: number; prepared: PreparedText } {
  const p = prepared ?? prepare(text, FONT_BODY);
  const result = layout(p, maxWidth, LINE_HEIGHT_BODY);
  return { ...result, prepared: p };
}

/**
 * Measure the pixel height of a small-body text block (15px Outfit).
 * Used for table cells, sidebars, and secondary descriptive copy.
 *
 * @param text      The text content to measure.
 * @param maxWidth  The container's available pixel width.
 * @param prepared  Optional pre-computed handle for resize-only re-layout.
 */
export function measureBodySmHeight(
  text: string,
  maxWidth: number,
  prepared?: PreparedText
): { height: number; lineCount: number; prepared: PreparedText } {
  const p = prepared ?? prepare(text, FONT_BODY_SM);
  const result = layout(p, maxWidth, LINE_HEIGHT_BODY_SM);
  return { ...result, prepared: p };
}

/**
 * Prepare an annotation label for the SpatialPreview 3D scene.
 *
 * Annotation labels have three text rows:
 *   - `status`  — 8px 600 Outfit, all-caps chip
 *   - `label`   — 11px 500 Outfit, primary title
 *   - `detail`  — 9px Outfit, muted supporting text
 *
 * Returns prepared handles for all three rows. Pass these to
 * `layoutAnnotationLabel()` when the label container width is known or changes.
 *
 * @example
 * const handles = prepareAnnotationLabel(status, label, detail);
 * const { width } = layoutAnnotationLabel(handles, 200);
 *
 * @param status  The status chip text (e.g. "Active", "Resolved").
 * @param label   The primary label text (e.g. "Doe v. Smith").
 * @param detail  The supporting detail text (e.g. "Hearing · Apr 14").
 */
export function prepareAnnotationLabel(
  status: string,
  label: string,
  detail: string
) {
  return {
    status: prepareWithSegments(status.toUpperCase(), FONT_LABEL_STATUS),
    label: prepareWithSegments(label, FONT_LABEL),
    detail: prepareWithSegments(detail, FONT_LABEL_DETAIL),
  };
}

type AnnotationHandles = ReturnType<typeof prepareAnnotationLabel>;

/**
 * Compute the tightest container width that fits all three annotation label
 * rows without wrapping, using `walkLineRanges` shrink-wrap.
 *
 * Because annotation labels use `whiteSpace: nowrap` in the DOM, this gives
 * the exact pixel width to size the label container — no DOM measurement needed.
 *
 * @example
 * const handles = prepareAnnotationLabel(status, label, detail);
 * const { width } = layoutAnnotationLabel(handles);
 * // Use `width` to set the label container's min-width or for collision math.
 *
 * @param handles   Handles from `prepareAnnotationLabel()`.
 * @param maxWidth  Optional cap. Defaults to 320px (generous for 3D labels).
 */
export function layoutAnnotationLabel(
  handles: AnnotationHandles,
  maxWidth = 320
): { width: number } {
  let width = 0;
  for (const prepared of [handles.status, handles.label, handles.detail]) {
    walkLineRanges(prepared, maxWidth, (line) => {
      if (line.width > width) width = line.width;
    });
  }
  return { width };
}
