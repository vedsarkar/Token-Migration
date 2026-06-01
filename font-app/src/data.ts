/**
 * Font-token inventory for the Hybrid Design System file
 * (`XywZ3yPdXzBL4MnKbzP7uI`). Pulled directly from Figma via the Plugin API
 * on 2026-05-26 — see the discovery scripts in the chat transcript.
 *
 * Two surfaces:
 *
 *   1. **Variables** (50 entries) — design tokens in the Horizon collection.
 *      Each has a per-mode value: Morning Horizon / Evening Horizon / HC
 *      White / HC Black. Aliased tokens (e.g. `sapObjectHeader_Title_FontSize`
 *      → `sapFontHeader3Size`) are stored with their resolved value plus the
 *      source variable name.
 *
 *   2. **Text styles** (130 entries) — reusable typography presets. Each
 *      carries the full property set (family, weight/style, size, line-
 *      height, letter-spacing, decoration). No modes — text styles are flat.
 *
 * The app's single user-facing edit is the **font family**: pick a new
 * family from the dropdown and the migration output rewrites every text
 * style's `fontName.family` plus the `sapFontFamily` variable to that
 * value. All other properties (weights, sizes, line-heights, shadow
 * geometry) stay exactly as Fiori defines them.
 */

/* ──────────────────────────────────────────────────────────────────────────
 * Modes
 * ────────────────────────────────────────────────────────────────────────── */

export type Mode = 'morning' | 'evening' | 'hcWhite' | 'hcBlack';

export const MODES: { id: Mode; label: string; shortLabel: string; figmaModeId: string }[] = [
  { id: 'morning', label: 'Morning Horizon',     shortLabel: 'Morning', figmaModeId: '153848:1' },
  { id: 'evening', label: 'Evening Horizon',     shortLabel: 'Evening', figmaModeId: '172837:0' },
  { id: 'hcWhite', label: 'High Contrast White', shortLabel: 'HC W',    figmaModeId: '172837:1' },
  { id: 'hcBlack', label: 'High Contrast Black', shortLabel: 'HC B',    figmaModeId: '172837:2' },
];

export function modeLabel(mode: Mode): string {
  return MODES.find((m) => m.id === mode)?.label ?? mode;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Variable inventory (50)
 * ────────────────────────────────────────────────────────────────────────── */

export type VarKind = 'family' | 'weight' | 'size' | 'lineHeight' | 'shadow' | 'border';

export type FontVariable = {
  /** Full path including category. */
  name: string;
  /** Last segment of name — same as the CSS variable name. */
  leaf: string;
  /** Top-level segment of name — used for grouping. */
  category: string;
  kind: VarKind;
  figmaType: 'STRING' | 'FLOAT';
  /**
   * Per-mode resolved value (aliases already followed). Always a string for
   * uniform rendering — coerce with `Number()` on FLOAT before writing back
   * to Figma.
   */
  values: Record<Mode, string>;
  /**
   * If this variable is an alias, the source variable's name. The UI shows
   * "Aliases → X" and the migration code skips re-writing the value.
   */
  aliasOf?: string;
};

export const VARIABLES: FontVariable[] = [
  // ---- Font / family (1) ----
  { name: 'Font/Family/sapFontFamily', leaf: 'sapFontFamily', category: 'Font · Family', kind: 'family', figmaType: 'STRING',
    values: { morning: '72', evening: '72', hcWhite: '72', hcBlack: '72' } },

  // ---- Font / weights (7) — confusingly named "Family" in Fiori but hold weight names ----
  { name: 'Font/Weight/sapFontLightFamily',          leaf: 'sapFontLightFamily',          category: 'Font · Weight', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Light',           evening: 'Light',           hcWhite: 'Light',   hcBlack: 'Light' } },
  { name: 'Font/Weight/sapFontFamily',               leaf: 'sapFontFamily',               category: 'Font · Weight', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Regular',         evening: 'Regular',         hcWhite: 'Regular', hcBlack: 'Regular' } },
  { name: 'Font/Weight/sapFontSemiboldFamily',       leaf: 'sapFontSemiboldFamily',       category: 'Font · Weight', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Semibold',        evening: 'Semibold',        hcWhite: 'Semibold', hcBlack: 'Semibold' } },
  { name: 'Font/Weight/sapFontSemiboldDuplexFamily', leaf: 'sapFontSemiboldDuplexFamily', category: 'Font · Weight', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Semibold Duplex', evening: 'Semibold Duplex', hcWhite: 'Semibold Duplex', hcBlack: 'Semibold Duplex' } },
  { name: 'Font/Weight/sapFontBoldFamily',           leaf: 'sapFontBoldFamily',           category: 'Font · Weight', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Bold',            evening: 'Bold',            hcWhite: 'Bold',    hcBlack: 'Bold' } },
  { name: 'Font/Weight/sapFontBlackFamily',          leaf: 'sapFontBlackFamily',          category: 'Font · Weight', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Black',           evening: 'Black',           hcWhite: 'Black',   hcBlack: 'Black' } },
  { name: 'Font/Weight/sapFontHeaderFamily',         leaf: 'sapFontHeaderFamily',         category: 'Font · Weight', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Bold',            evening: 'Bold',            hcWhite: 'Regular', hcBlack: 'Regular' } },

  // ---- Font / sizes (9) ----
  { name: 'Font/Size/sapFontSmallSize',   leaf: 'sapFontSmallSize',   category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '12', evening: '12', hcWhite: '12', hcBlack: '12' } },
  { name: 'Font/Size/sapFontSize',        leaf: 'sapFontSize',        category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '14', evening: '14', hcWhite: '14', hcBlack: '14' } },
  { name: 'Font/Size/sapFontLargeSize',   leaf: 'sapFontLargeSize',   category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '16', evening: '16', hcWhite: '16', hcBlack: '16' } },
  { name: 'Font/Size/sapFontHeader1Size', leaf: 'sapFontHeader1Size', category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '48', evening: '48', hcWhite: '48', hcBlack: '48' } },
  { name: 'Font/Size/sapFontHeader2Size', leaf: 'sapFontHeader2Size', category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '32', evening: '32', hcWhite: '32', hcBlack: '32' } },
  { name: 'Font/Size/sapFontHeader3Size', leaf: 'sapFontHeader3Size', category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '24', evening: '24', hcWhite: '24', hcBlack: '24' } },
  { name: 'Font/Size/sapFontHeader4Size', leaf: 'sapFontHeader4Size', category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '20', evening: '20', hcWhite: '20', hcBlack: '20' } },
  { name: 'Font/Size/sapFontHeader5Size', leaf: 'sapFontHeader5Size', category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '16', evening: '16', hcWhite: '16', hcBlack: '16' } },
  { name: 'Font/Size/sapFontHeader6Size', leaf: 'sapFontHeader6Size', category: 'Font · Size', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '14', evening: '14', hcWhite: '14', hcBlack: '14' } },

  // ---- Line heights (6) ----
  { name: 'Additional Variables/LineHeight/sapContent_LineHeight_SmallText',  leaf: 'sapContent_LineHeight_SmallText',  category: 'Line height', kind: 'lineHeight', figmaType: 'FLOAT',
    values: { morning: '18', evening: '18', hcWhite: '18', hcBlack: '18' } },
  { name: 'Additional Variables/LineHeight/sapContent_LineHeight_MediumText', leaf: 'sapContent_LineHeight_MediumText', category: 'Line height', kind: 'lineHeight', figmaType: 'FLOAT',
    values: { morning: '21', evening: '21', hcWhite: '21', hcBlack: '21' } },
  { name: 'Additional Variables/LineHeight/sapContent_LineHeight_LargeText',  leaf: 'sapContent_LineHeight_LargeText',  category: 'Line height', kind: 'lineHeight', figmaType: 'FLOAT',
    values: { morning: '24', evening: '24', hcWhite: '24', hcBlack: '24' } },
  { name: 'Container/sapElement_LineHeight',           leaf: 'sapElement_LineHeight',           category: 'Line height', kind: 'lineHeight', figmaType: 'FLOAT',
    values: { morning: '44', evening: '44', hcWhite: '44', hcBlack: '44' } },
  { name: 'Container/sapElement_Compact_LineHeight',   leaf: 'sapElement_Compact_LineHeight',   category: 'Line height', kind: 'lineHeight', figmaType: 'FLOAT',
    values: { morning: '32', evening: '32', hcWhite: '32', hcBlack: '32' } },
  { name: 'Container/sapElement_Condensed_LineHeight', leaf: 'sapElement_Condensed_LineHeight', category: 'Line height', kind: 'lineHeight', figmaType: 'FLOAT',
    values: { morning: '24', evening: '24', hcWhite: '24', hcBlack: '24' } },

  // ---- Text shadow geometry (16) ----
  { name: 'Text/TextShadow_X_1',          leaf: 'TextShadow_X_1',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '-1', hcBlack: '-1' } },
  { name: 'Text/TextShadow_Y_1',          leaf: 'TextShadow_Y_1',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/TextShadow_Blur_1',       leaf: 'TextShadow_Blur_1',       category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '2', evening: '2', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/TextShadow_Spread_1',     leaf: 'TextShadow_Spread_1',     category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/TextShadow_X_2',          leaf: 'TextShadow_X_2',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/TextShadow_Y_2',          leaf: 'TextShadow_Y_2',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '1', hcBlack: '1' } },
  { name: 'Text/TextShadow_X_3',          leaf: 'TextShadow_X_3',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '1', hcBlack: '1' } },
  { name: 'Text/TextShadow_Y_3',          leaf: 'TextShadow_Y_3',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/TextShadow_X_4',          leaf: 'TextShadow_X_4',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/TextShadow_Y_4',          leaf: 'TextShadow_Y_4',          category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '-1', hcBlack: '-1' } },
  { name: 'Text/TextShadow_Blur_2-4',     leaf: 'TextShadow_Blur_2-4',     category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/TextShadow_Spread_2-4',   leaf: 'TextShadow_Spread_2-4',   category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/ContrastTextShadow_X',    leaf: 'ContrastTextShadow_X',    category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/ContrastTextShadow_Y',    leaf: 'ContrastTextShadow_Y',    category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/ContrastTextShadow_Blur', leaf: 'ContrastTextShadow_Blur', category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '1', evening: '0', hcWhite: '0', hcBlack: '0' } },
  { name: 'Text/ContrastTextShadow_Spread', leaf: 'ContrastTextShadow_Spread', category: 'Text shadow', kind: 'shadow', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '0', hcBlack: '0' } },

  // ---- Aliased component tokens (8) ----
  { name: 'ObjectHeader/sapObjectHeader_Title_FontSize',          leaf: 'sapObjectHeader_Title_FontSize',          category: 'Component · ObjectHeader', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '24', evening: '24', hcWhite: '24', hcBlack: '24' }, aliasOf: 'Font/Size/sapFontHeader3Size' },
  { name: 'ObjectHeader/sapObjectHeader_Title_SnappedFontSize',   leaf: 'sapObjectHeader_Title_SnappedFontSize',   category: 'Component · ObjectHeader', kind: 'size', figmaType: 'FLOAT',
    values: { morning: '20', evening: '20', hcWhite: '20', hcBlack: '20' }, aliasOf: 'Font/Size/sapFontHeader4Size' },
  { name: 'Container/sapGroup_Title_FontSize',                    leaf: 'sapGroup_Title_FontSize',                 category: 'Component · Container',    kind: 'size', figmaType: 'FLOAT',
    values: { morning: '16', evening: '16', hcWhite: '16', hcBlack: '16' }, aliasOf: 'Font/Size/sapFontHeader5Size' },
  { name: 'Progress/Standard/sapProgress_FontSize',               leaf: 'sapProgress_FontSize',                    category: 'Component · Progress',     kind: 'size', figmaType: 'FLOAT',
    values: { morning: '14', evening: '14', hcWhite: '14', hcBlack: '14' }, aliasOf: 'Font/Size/sapFontSize' },
  { name: 'ObjectHeader/sapObjectHeader_Title_FontFamily',        leaf: 'sapObjectHeader_Title_FontFamily',        category: 'Component · ObjectHeader', kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Black', evening: 'Black', hcWhite: 'Bold', hcBlack: 'Bold' }, aliasOf: 'Font/Weight/sapFontBlackFamily' },
  { name: 'Button/Emphasized/sapButton_Emphasized_FontWeight',    leaf: 'sapButton_Emphasized_FontWeight',         category: 'Component · Button',       kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Bold', evening: 'Bold', hcWhite: 'Bold', hcBlack: 'Bold' }, aliasOf: 'Font/Weight/sapFontBoldFamily' },
  { name: 'Button/Standard/sapButton_FontFamily',                 leaf: 'sapButton_FontFamily',                    category: 'Component · Button',       kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Semibold Duplex', evening: 'Semibold Duplex', hcWhite: 'Regular', hcBlack: 'Regular' }, aliasOf: 'Font/Weight/sapFontSemiboldDuplexFamily' },
  { name: 'Button/Emphasized/sapButton_Emphasized_FontFamily',    leaf: 'sapButton_Emphasized_FontFamily',         category: 'Component · Button',       kind: 'weight', figmaType: 'STRING',
    values: { morning: 'Bold', evening: 'Bold', hcWhite: 'Bold', hcBlack: 'Bold' }, aliasOf: 'Font/Weight/sapFontBoldFamily' },

  // ---- Misc numeric (3) ----
  { name: 'Button/Emphasized/sapButton_Emphasized_BorderWidth',    leaf: 'sapButton_Emphasized_BorderWidth',    category: 'Misc · Border', kind: 'border', figmaType: 'FLOAT',
    values: { morning: '1', evening: '1', hcWhite: '2', hcBlack: '2' } },
  { name: 'Additional Variables/Color Palette/colorPalette_StrokeWeight_Swatch', leaf: 'colorPalette_StrokeWeight_Swatch', category: 'Misc · Border', kind: 'border', figmaType: 'FLOAT',
    values: { morning: '1', evening: '1', hcWhite: '2', hcBlack: '2' } },
  { name: 'Additional Variables/Tooltip/Tooltip_Stroke_Weight',    leaf: 'Tooltip_Stroke_Weight',               category: 'Misc · Border', kind: 'border', figmaType: 'FLOAT',
    values: { morning: '0', evening: '0', hcWhite: '2', hcBlack: '2' } },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Text style inventory (130)
 * ────────────────────────────────────────────────────────────────────────── */

export type LineHeight =
  | { unit: 'AUTO' }
  | { unit: 'PIXELS'; value: number }
  | { unit: 'PERCENT'; value: number };

export type LetterSpacing =
  | { unit: 'PIXELS'; value: number }
  | { unit: 'PERCENT'; value: number };

export type TextDecoration = 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';

export type FontTextStyle = {
  name: string;
  /** Top-level segment (SmallText / H1 / Display / Button / ...). */
  category: string;
  family: string;
  /** Weight / style name (Regular, Bold, Italic, Semibold Duplex, …). */
  style: string;
  fontSize: number;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  textDecoration: TextDecoration;
};

function s(
  name: string,
  family: string,
  style: string,
  fontSize: number,
  lh: LineHeight = { unit: 'AUTO' },
  ls: LetterSpacing = { unit: 'PIXELS', value: 0 },
  decoration: TextDecoration = 'NONE',
): FontTextStyle {
  return {
    name,
    category: name.includes('/') ? name.split('/')[0] : name,
    family,
    style,
    fontSize,
    lineHeight: lh,
    letterSpacing: ls,
    textDecoration: decoration,
  };
}

const LH_AUTO: LineHeight = { unit: 'AUTO' };
const LH_18: LineHeight = { unit: 'PIXELS', value: 18 };
const LH_21: LineHeight = { unit: 'PIXELS', value: 21 };

export const TEXT_STYLES: FontTextStyle[] = [
  // SmallText — 12 px, 14 styles
  s('SmallText/LHAuto/Light',           '72',      'Light',           12),
  s('SmallText/LHAuto/Regular',         '72',      'Regular',         12),
  s('SmallText/LHAuto/Bold',            '72',      'Bold',            12),
  s('SmallText/LHAuto/Black',           '72',      'Black',           12),
  s('SmallText/LHAuto/Condensed',       '72',      'Condensed',       12),
  s('SmallText/LHAuto/CondensedBold',   '72',      'Condensed Bold',  12),
  s('SmallText/LHAuto/MonoRegular',     '72 Mono', 'Regular',         12),
  s('SmallText/LHAuto/MonoBold',        '72 Mono', 'Bold',            12),
  s('SmallText/LHAuto/Italic',          '72',      'Italic',          12),
  s('SmallText/LHAuto/BoldItalic',      '72',      'Bold Italic',     12),
  s('SmallText/LHAuto/Semibold',        '72',      'Semibold',        12),
  s('SmallText/LHAuto/SemiboldDuplex',  '72',      'Semibold Duplex', 12),
  s('SmallText/LH1.5/Regular',          '72',      'Regular',         12, LH_18),
  s('SmallText/LH1.5/Bold',             '72',      'Bold',            12, LH_18),

  // MediumText — 14 px, 17 styles
  s('MediumText/LHAuto/Light',                  '72',      'Light',           14),
  s('MediumText/LHAuto/Regular',                '72',      'Regular',         14),
  s('MediumText/LHAuto/Bold',                   '72',      'Bold',            14),
  s('MediumText/LHAuto/Black',                  '72',      'Black',           14),
  s('MediumText/LHAuto/Condensed',              '72',      'Condensed',       14),
  s('MediumText/LHAuto/CondensedBold',          '72',      'Condensed Bold',  14),
  s('MediumText/LHAuto/MonoRegular',            '72 Mono', 'Regular',         14),
  s('MediumText/LHAuto/MonoBold',               '72 Mono', 'Bold',            14),
  s('MediumText/LHAuto/Italic',                 '72',      'Italic',          14),
  s('MediumText/LHAuto/BoldItalic',             '72',      'Bold Italic',     14),
  s('MediumText/LHAuto/Semibold',               '72',      'Semibold',        14),
  s('MediumText/LHAuto/SemiboldDuplex',         '72',      'Semibold Duplex', 14),
  s('MediumText/LHAuto/RegularUnderline',       '72',      'Regular',         14, LH_AUTO, { unit: 'PERCENT', value: 0 }, 'UNDERLINE'),
  s('MediumText/LHAuto/BoldUnderline',          '72',      'Bold',            14, LH_AUTO, { unit: 'PERCENT', value: 0 }, 'UNDERLINE'),
  s('MediumText/LH1.5Wrap/Regular',             '72',      'Regular',         14, LH_21),
  s('MediumText/LH1.5Wrap/Bold',                '72',      'Bold',            14, LH_21),
  s('MediumText/LH1.5Wrap/Italic',              '72',      'Italic',          14, LH_21),

  // LargeText — 16 px, 14 styles
  s('LargeText/LHAuto/Light',           '72',      'Light',           16),
  s('LargeText/LHAuto/Regular',         '72',      'Regular',         16),
  s('LargeText/LHAuto/Bold',            '72',      'Bold',            16),
  s('LargeText/LHAuto/Black',           '72',      'Black',           16),
  s('LargeText/LHAuto/Condensed',       '72',      'Condensed',       16),
  s('LargeText/LHAuto/CondensedBold',   '72',      'Condensed Bold',  16),
  s('LargeText/LHAuto/MonoRegular',     '72 Mono', 'Regular',         16),
  s('LargeText/LHAuto/MonoBold',        '72 Mono', 'Bold',            16),
  s('LargeText/LHAuto/Italic',          '72',      'Italic',          16),
  s('LargeText/LHAuto/BoldItalic',      '72',      'Bold Italic',     16),
  s('LargeText/LHAuto/Semibold',        '72',      'Semibold',        16),
  s('LargeText/LHAuto/SemiboldDuplex',  '72',      'Semibold Duplex', 16),
  s('LargeText/LH1.5/Regular',          '72',      'Regular',         16),
  s('LargeText/LH1.5/Bold',             '72',      'Bold',            16),

  // H1–H6 — 6/6/6/7/6/6 styles, sizes 48/32/24/20/16/14
  ...buildHeadingStyles('H1', 48, true),
  ...buildHeadingStyles('H2', 32, false),
  ...buildHeadingStyles('H3', 24, false),
  ...buildHeadingStyles('H4', 20, false, true), // H4 also has SemiboldDuplex
  ...buildHeadingStyles('H5', 16, false),
  ...buildHeadingStyles('H6', 14, false),

  // Display — 36 styles, 9 sizes × 4 weights
  ...buildDisplayStyles([18, 24, 32, 36, 40, 44, 48, 64, 72]),

  // Main Header — 2 styles (used by ObjectHeader)
  s('Main Header/sapObjectHeader_Title_FontSize',         '72', 'Black', 24),
  s('Main Header/sapObjectHeader_Title_SnappedFontSize',  '72', 'Black', 20),

  // Title of Components — 1 style
  s('Title of Components/sapGroup_TitleFontSize',         '72', 'Bold', 16),

  // Button — 3 styles
  s('Button/Standard/sapButton_FontFamily',                '72', 'Semibold Duplex', 14),
  s('Button/Emphasized/sapButton_Emphasized_FontFamily',   '72', 'Bold',            14),
  s('Button/Emphasized/sapButton_Emphasized_FontWeight',   '72', 'Bold',            14),

  // Tab — 2 styles
  s('Tab/SmallTabText',  '72', 'Bold', 12),
  s('Tab/MediumTabText', '72', 'Bold', 14),

  // Tag — 2 styles
  s('Tag/Large Tag Design', '72', 'Semibold Duplex', 22),
  s('Tag/Small Tag Design', '72', 'Bold',            12),

  // Calendar — 1 style
  s('Calendar/AM and PM', '72', 'Regular', 10),

  // Progress Indicator — 1 style
  s('Progress Indicator/sapProgress_FontSize', '72', 'Regular', 14),
];

function buildHeadingStyles(
  category: string,
  size: number,
  /** H1 doesn't have SemiboldDuplex; H4 does. Others don't. */
  _isH1: boolean,
  includeSemiboldDuplex = false,
): FontTextStyle[] {
  const weights: string[] = ['Light', 'Regular', 'Bold', 'Black', 'Condensed', 'Condensed Bold'];
  const items = weights.map((w) => s(`${category}/${weightKey(w)}`, '72', w, size));
  if (includeSemiboldDuplex) {
    items.push(s(`${category}/SemiboldDuplex`, '72', 'Semibold Duplex', size));
  }
  return items;
}

function weightKey(w: string): string {
  // "Condensed Bold" → "CondensedBold" in the style name; everything else is unchanged.
  return w.replace(/\s+/g, '');
}

function buildDisplayStyles(sizes: number[]): FontTextStyle[] {
  const weights = ['Light', 'Regular', 'Bold', 'Black'];
  const out: FontTextStyle[] = [];
  for (const size of sizes) {
    for (const w of weights) {
      out.push(s(`Display/${size}/${w}`, '72', w, size));
    }
  }
  return out;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────────────────── */

/** Format `LineHeight` for compact display in the table. */
export function formatLineHeight(lh: LineHeight): string {
  if (lh.unit === 'AUTO') return 'Auto';
  if (lh.unit === 'PIXELS') return `${lh.value} px`;
  return `${lh.value}%`;
}

/** Format `LetterSpacing` for compact display. `0` → `Default`. */
export function formatLetterSpacing(ls: LetterSpacing): string {
  if (ls.value === 0) return 'Default';
  if (ls.unit === 'PIXELS') return `${ls.value} px`;
  return `${ls.value}%`;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Family dropdown options
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Compact list for the "default replacement" picker at the top of the page.
 * Acts as a curated short-list of the most likely targets — designers can
 * still pick anything from the full system-font catalog via the per-row
 * dropdowns below.
 */
export const FAMILY_OPTIONS: { value: string; label: string; tagline: string }[] = [
  { value: '72',                 label: '72',                 tagline: 'SAP\'s proprietary face — the current Fiori default.' },
  { value: 'Inter',              label: 'Inter',              tagline: 'Open-source. Reltio house typeface. Recommended default.' },
  { value: 'Inter Display',      label: 'Inter Display',      tagline: 'Tighter spacing for large display copy (>= 32 px).' },
  { value: 'Inter Tight',        label: 'Inter Tight',        tagline: 'Even tighter spacing variant of Inter.' },
  { value: 'Roboto',             label: 'Roboto',             tagline: 'Google\'s neo-grotesque. Ships in Chrome by default.' },
  { value: 'Source Sans Pro',    label: 'Source Sans Pro',    tagline: 'Adobe\'s humanist sans. Generous line-height defaults.' },
  { value: 'Open Sans',          label: 'Open Sans',          tagline: 'Friendly, wide, popular. Strong fallback options.' },
  { value: 'IBM Plex Sans',      label: 'IBM Plex Sans',      tagline: 'IBM\'s open-source sans. Engineering-feel.' },
  { value: 'system-ui',          label: 'system-ui',          tagline: 'Resolves to the OS UI font (San Francisco / Segoe / Roboto).' },
];

/**
 * Comprehensive grouped catalog of system fonts available across platforms.
 * Used by the per-row family dropdown in the table. Groups are ordered by
 * the most common picks (Web / cross-platform) first, then OS-specific
 * fonts, then specialty families.
 *
 *   - **Generic CSS keywords** always resolve, so we put them first.
 *   - **macOS / Windows / Linux** sections list each platform's bundled
 *     fonts. Designers picking a single-OS target are covered.
 *   - **Open-source web fonts** are the actual recommended migration
 *     targets — Inter / Roboto / etc.
 *   - **Monospace** has its own group so designers can swap mono variants
 *     independently of the headline family.
 *   - **SAP** stays available so a designer can revert a row to the
 *     original Fiori face if needed.
 */
export const SYSTEM_FONT_GROUPS: { label: string; options: { value: string; label: string }[] }[] = [
  {
    label: 'Generic (CSS keywords)',
    options: [
      { value: 'system-ui',     label: 'system-ui' },
      { value: 'ui-sans-serif', label: 'ui-sans-serif' },
      { value: 'ui-serif',      label: 'ui-serif' },
      { value: 'ui-monospace',  label: 'ui-monospace' },
      { value: 'ui-rounded',    label: 'ui-rounded' },
      { value: 'sans-serif',    label: 'sans-serif' },
      { value: 'serif',         label: 'serif' },
      { value: 'monospace',     label: 'monospace' },
      { value: 'cursive',       label: 'cursive' },
      { value: 'fantasy',       label: 'fantasy' },
    ],
  },
  {
    label: 'Open-source web (recommended targets)',
    options: [
      { value: 'Inter',            label: 'Inter' },
      { value: 'Inter Display',    label: 'Inter Display' },
      { value: 'Inter Tight',      label: 'Inter Tight' },
      { value: 'Roboto',           label: 'Roboto' },
      { value: 'Roboto Condensed', label: 'Roboto Condensed' },
      { value: 'Roboto Slab',      label: 'Roboto Slab' },
      { value: 'Open Sans',        label: 'Open Sans' },
      { value: 'Lato',             label: 'Lato' },
      { value: 'Montserrat',       label: 'Montserrat' },
      { value: 'Poppins',          label: 'Poppins' },
      { value: 'Source Sans Pro',  label: 'Source Sans Pro' },
      { value: 'Source Sans 3',    label: 'Source Sans 3' },
      { value: 'Source Serif Pro', label: 'Source Serif Pro' },
      { value: 'IBM Plex Sans',    label: 'IBM Plex Sans' },
      { value: 'IBM Plex Serif',   label: 'IBM Plex Serif' },
      { value: 'Work Sans',        label: 'Work Sans' },
      { value: 'Nunito',           label: 'Nunito' },
      { value: 'Nunito Sans',      label: 'Nunito Sans' },
      { value: 'Raleway',          label: 'Raleway' },
      { value: 'Merriweather',     label: 'Merriweather' },
      { value: 'Playfair Display', label: 'Playfair Display' },
      { value: 'Fira Sans',        label: 'Fira Sans' },
      { value: 'DM Sans',          label: 'DM Sans' },
      { value: 'DM Serif Display', label: 'DM Serif Display' },
      { value: 'Manrope',          label: 'Manrope' },
      { value: 'Karla',            label: 'Karla' },
      { value: 'Mulish',           label: 'Mulish' },
      { value: 'Quicksand',        label: 'Quicksand' },
      { value: 'PT Sans',          label: 'PT Sans' },
      { value: 'PT Serif',         label: 'PT Serif' },
    ],
  },
  {
    label: 'macOS system',
    options: [
      { value: '-apple-system',     label: '-apple-system' },
      { value: 'BlinkMacSystemFont', label: 'BlinkMacSystemFont' },
      { value: 'SF Pro',            label: 'SF Pro' },
      { value: 'SF Pro Display',    label: 'SF Pro Display' },
      { value: 'SF Pro Text',       label: 'SF Pro Text' },
      { value: 'SF Compact',        label: 'SF Compact' },
      { value: 'New York',          label: 'New York' },
      { value: 'Helvetica',         label: 'Helvetica' },
      { value: 'Helvetica Neue',    label: 'Helvetica Neue' },
      { value: 'Lucida Grande',     label: 'Lucida Grande' },
      { value: 'Avenir',            label: 'Avenir' },
      { value: 'Avenir Next',       label: 'Avenir Next' },
      { value: 'Optima',            label: 'Optima' },
      { value: 'Futura',            label: 'Futura' },
      { value: 'Palatino',          label: 'Palatino' },
      { value: 'Geneva',            label: 'Geneva' },
      { value: 'Charter',           label: 'Charter' },
      { value: 'Hoefler Text',      label: 'Hoefler Text' },
    ],
  },
  {
    label: 'Windows system',
    options: [
      { value: 'Segoe UI',              label: 'Segoe UI' },
      { value: 'Segoe UI Variable',     label: 'Segoe UI Variable' },
      { value: 'Segoe UI Symbol',       label: 'Segoe UI Symbol' },
      { value: 'Calibri',               label: 'Calibri' },
      { value: 'Cambria',               label: 'Cambria' },
      { value: 'Tahoma',                label: 'Tahoma' },
      { value: 'Verdana',               label: 'Verdana' },
      { value: 'Microsoft Sans Serif',  label: 'Microsoft Sans Serif' },
      { value: 'Lucida Sans Unicode',   label: 'Lucida Sans Unicode' },
      { value: 'Trebuchet MS',          label: 'Trebuchet MS' },
      { value: 'Comic Sans MS',         label: 'Comic Sans MS' },
      { value: 'Impact',                label: 'Impact' },
      { value: 'Sitka',                 label: 'Sitka' },
      { value: 'Constantia',            label: 'Constantia' },
      { value: 'Corbel',                label: 'Corbel' },
      { value: 'Candara',               label: 'Candara' },
    ],
  },
  {
    label: 'Linux system',
    options: [
      { value: 'DejaVu Sans',     label: 'DejaVu Sans' },
      { value: 'DejaVu Serif',    label: 'DejaVu Serif' },
      { value: 'DejaVu Sans Mono', label: 'DejaVu Sans Mono' },
      { value: 'Liberation Sans',  label: 'Liberation Sans' },
      { value: 'Liberation Serif', label: 'Liberation Serif' },
      { value: 'Liberation Mono',  label: 'Liberation Mono' },
      { value: 'Ubuntu',           label: 'Ubuntu' },
      { value: 'Ubuntu Mono',      label: 'Ubuntu Mono' },
      { value: 'Cantarell',        label: 'Cantarell' },
      { value: 'Noto Sans',        label: 'Noto Sans' },
      { value: 'Noto Serif',       label: 'Noto Serif' },
      { value: 'Noto Mono',        label: 'Noto Mono' },
    ],
  },
  {
    label: 'Cross-platform classics',
    options: [
      { value: 'Arial',           label: 'Arial' },
      { value: 'Arial Black',     label: 'Arial Black' },
      { value: 'Arial Narrow',    label: 'Arial Narrow' },
      { value: 'Times New Roman', label: 'Times New Roman' },
      { value: 'Times',           label: 'Times' },
      { value: 'Courier New',     label: 'Courier New' },
      { value: 'Courier',         label: 'Courier' },
      { value: 'Georgia',         label: 'Georgia' },
      { value: 'Garamond',        label: 'Garamond' },
      { value: 'Bookman',         label: 'Bookman' },
      { value: 'Book Antiqua',    label: 'Book Antiqua' },
      { value: 'Century Gothic',  label: 'Century Gothic' },
    ],
  },
  {
    label: 'Monospace',
    options: [
      { value: 'SF Mono',         label: 'SF Mono' },
      { value: 'Menlo',           label: 'Menlo' },
      { value: 'Monaco',          label: 'Monaco' },
      { value: 'Consolas',        label: 'Consolas' },
      { value: 'Cascadia Code',   label: 'Cascadia Code' },
      { value: 'Cascadia Mono',   label: 'Cascadia Mono' },
      { value: 'Fira Code',       label: 'Fira Code' },
      { value: 'Fira Mono',       label: 'Fira Mono' },
      { value: 'JetBrains Mono',  label: 'JetBrains Mono' },
      { value: 'Source Code Pro', label: 'Source Code Pro' },
      { value: 'IBM Plex Mono',   label: 'IBM Plex Mono' },
      { value: 'Roboto Mono',     label: 'Roboto Mono' },
      { value: 'Inconsolata',     label: 'Inconsolata' },
      { value: 'Hack',            label: 'Hack' },
      { value: 'Lucida Console',  label: 'Lucida Console' },
    ],
  },
  {
    label: 'SAP / current Fiori',
    options: [
      { value: '72',       label: '72' },
      { value: '72 Mono',  label: '72 Mono' },
      { value: '72 Light', label: '72 Light' },
      { value: '72 Bold',  label: '72 Bold' },
    ],
  },
];

/** Flat list of all values in `SYSTEM_FONT_GROUPS` — handy for membership tests. */
export const SYSTEM_FONT_VALUES: Set<string> = new Set(
  SYSTEM_FONT_GROUPS.flatMap((g) => g.options.map((o) => o.value)),
);

/* ──────────────────────────────────────────────────────────────────────────
 * Per-row family resolution
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Per-row family override map, keyed by token identifier:
 *
 *   - Text styles: `style:${ts.name}` (e.g. `style:H1/Bold`)
 *   - Variables:   `var:${v.name}`    (e.g. `var:Font/Family/sapFontFamily`)
 *
 * Stored in localStorage so picks survive a reload.
 */
export type FamilyOverrides = Record<string, string>;

export function styleKey(ts: FontTextStyle): string {
  return `style:${ts.name}`;
}

export function varKey(v: FontVariable): string {
  return `var:${v.name}`;
}

/**
 * Resolve the effective family for a text style given the user's choices.
 *
 *   1. Explicit per-row override (the row's own dropdown).
 *   2. Otherwise, if the style's original family matches `defaultFromFamily`,
 *      use the global `defaultToFamily` (bulk rename behavior).
 *   3. Otherwise, keep the style's original family.
 *
 * The `defaultFromFamily` / `defaultToFamily` pair powers the hero picker:
 * "replace all rows currently using X with Y, unless the row was overridden
 * individually."
 */
export function effectiveStyleFamily(
  ts: FontTextStyle,
  overrides: FamilyOverrides,
  defaultFromFamily: string,
  defaultToFamily: string,
): string {
  const explicit = overrides[styleKey(ts)];
  if (explicit !== undefined && explicit !== '') return explicit;
  if (ts.family === defaultFromFamily && defaultFromFamily !== defaultToFamily) {
    return defaultToFamily;
  }
  return ts.family;
}

/**
 * Resolve the effective value for a variable. Only the `family`-kind variable
 * is interactive; everything else echoes its Morning Horizon value.
 */
export function effectiveVarFamily(
  v: FontVariable,
  overrides: FamilyOverrides,
  defaultFromFamily: string,
  defaultToFamily: string,
): string {
  if (v.kind !== 'family') return v.values.morning;
  const explicit = overrides[varKey(v)];
  if (explicit !== undefined && explicit !== '') return explicit;
  if (v.values.morning === defaultFromFamily && defaultFromFamily !== defaultToFamily) {
    return defaultToFamily;
  }
  return v.values.morning;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Migration export
 * ────────────────────────────────────────────────────────────────────────── */

export type ExportFormat = 'json' | 'css' | 'figma-script';

/**
 * Build the migration output. Iterates every text style, computes the
 * effective family per row, and emits only the rows whose family actually
 * differs from their original.
 *
 *   - **CSS**: One `.text-style--…` rule per migrated style.
 *   - **JSON**: An audit-log shape with per-row diffs.
 *   - **figma-script**: A `use_figma` body that calls `loadFontAsync` then
 *     assigns `fontName = …` on each text style.
 *
 * Note: This tool only migrates text styles. Font-related Figma variables
 * (e.g. `sapFontFamily`) are intentionally NOT touched — see the simplified
 * UI which hides them.
 */
export function buildExport(
  format: ExportFormat,
  defaultFromFamily: string,
  defaultToFamily: string,
  overrides: FamilyOverrides = {},
): string {
  type StyleChange = { name: string; oldFamily: string; newFamily: string; style: string };
  const styleChanges: StyleChange[] = [];
  for (const ts of TEXT_STYLES) {
    const next = effectiveStyleFamily(ts, overrides, defaultFromFamily, defaultToFamily);
    if (next !== ts.family) {
      styleChanges.push({ name: ts.name, oldFamily: ts.family, newFamily: next, style: ts.style });
    }
  }

  if (styleChanges.length === 0) {
    return [
      '// No changes — every text style still resolves to its original family.',
      `// Default replacement is "${defaultToFamily}" but no row matches "${defaultFromFamily}".`,
    ].join('\n');
  }

  if (format === 'css') {
    const lines: string[] = [
      '/* Hybrid font-family migration · text styles only */',
      `/* Default: ${defaultFromFamily} → ${defaultToFamily} */`,
      `/* ${styleChanges.length} text style override(s) */`,
      '',
      "/* One rule per Figma style — names mirror Figma's slash paths. */",
    ];
    // Group changes by destination family for compact CSS
    const byFamily = new Map<string, StyleChange[]>();
    for (const c of styleChanges) {
      const arr = byFamily.get(c.newFamily) ?? [];
      arr.push(c);
      byFamily.set(c.newFamily, arr);
    }
    for (const [family, changes] of byFamily) {
      lines.push(`/* → ${family} (${changes.length} style${changes.length === 1 ? '' : 's'}) */`);
      for (const c of changes) {
        const cssName = c.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        lines.push(`.text-style--${cssName} { font-family: '${family}', system-ui, sans-serif; /* was ${c.oldFamily} */ }`);
      }
      lines.push('');
    }
    return lines.join('\n');
  }

  if (format === 'json') {
    return JSON.stringify(
      {
        migration: {
          defaultFrom: defaultFromFamily,
          defaultTo: defaultToFamily,
          customOverrideCount: Object.keys(overrides).length,
          scope: 'text-styles-only',
        },
        textStyleUpdates: styleChanges.map((c) => ({
          name: c.name,
          newFamily: c.newFamily,
          oldFamily: c.oldFamily,
          style: c.style,
        })),
        unchanged: {
          textStyles: TEXT_STYLES.length - styleChanges.length,
        },
      },
      null,
      2,
    );
  }

  // figma-script
  const styleMap: Record<string, string> = {};
  for (const c of styleChanges) styleMap[c.name] = c.newFamily;

  return [
    `// Hybrid font-family migration — ${styleChanges.length} text style update(s)`,
    `// Default replacement: ${defaultFromFamily} → ${defaultToFamily}`,
    `// Custom per-row overrides: ${Object.keys(overrides).length}`,
    '// Scope: text styles only. Font-related variables are not touched.',
    '',
    `const STYLE_TARGETS = ${JSON.stringify(styleMap, null, 2)};`,
    '',
    '// Figma requires loadFontAsync({family, style}) before any fontName',
    '// assignment so it knows the (family, style) pair is installed.',
    'const textStyles = await figma.getLocalTextStylesAsync();',
    'const byName = new Map(textStyles.map(t => [t.name, t]));',
    'let stylesUpdated = 0;',
    'const styleErrors = [];',
    'for (const [styleName, newFamily] of Object.entries(STYLE_TARGETS)) {',
    '  const t = byName.get(styleName);',
    "  if (!t) { styleErrors.push(`${styleName}: not found`); continue; }",
    '  try {',
    '    const next = { family: newFamily, style: t.fontName.style };',
    '    await figma.loadFontAsync(next);',
    '    t.fontName = next;',
    '    stylesUpdated++;',
    '  } catch (e) {',
    "    styleErrors.push(`${styleName}: ${e.message}`);",
    '  }',
    '}',
    '',
    'return {',
    '  stylesUpdated,',
    '  totalTargets: Object.keys(STYLE_TARGETS).length,',
    '  errorCount: styleErrors.length,',
    '  errors: styleErrors.slice(0, 5),',
    '};',
  ].join('\n');
}

/** Quick stat — how many text styles will change. */
export function migrationStats(
  defaultFromFamily: string,
  defaultToFamily: string,
  overrides: FamilyOverrides = {},
): {
  textStylesChanged: number;
  textStylesUntouched: number;
  customOverrideCount: number;
} {
  let stylesChanged = 0;
  for (const ts of TEXT_STYLES) {
    const next = effectiveStyleFamily(ts, overrides, defaultFromFamily, defaultToFamily);
    if (next !== ts.family) stylesChanged++;
  }
  return {
    textStylesChanged: stylesChanged,
    textStylesUntouched: TEXT_STYLES.length - stylesChanged,
    customOverrideCount: Object.keys(overrides).length,
  };
}
