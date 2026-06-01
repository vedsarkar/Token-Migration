/**
 * XLSX export — styled to mirror the in-app mapping table.
 *
 * Each Fiori Horizon mode (Morning, Evening, HC White, HC Black) gets its own
 * sheet with category-grouped sections, color-swatch cells, tone-coded
 * confidence pills, and an auto-filter header — designed to read like a
 * printed version of the React mapping table. A leading "Summary" sheet shows
 * every token side-by-side across all 4 modes, and a "Custom overrides" sheet
 * lists tokens where the user picked a non-default RDS color or applied a
 * blended midpoint.
 *
 * Built with `exceljs` (first-class browser support — no Node-builtin imports
 * trip up Vite's externalisation).
 */
import ExcelJS from 'exceljs';
import {
  MODES,
  allMappings,
  blendHex,
  computeConfidence,
  formatHex,
  getChoice,
  hexLuminance,
  parseHex,
  readableTextOn,
  resolveRds,
  resolvedHex,
} from './data';
import type { Choices, Conf, Mapping, RdsChoices } from './data';

/* ──────────────────────────────────────────────────────────────────────────
 * Style helpers
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Convert `#RRGGBB` or `#RRGGBBAA` to exceljs `argb` form `AARRGGBB`.
 * Alpha is preserved — Excel renders the resulting cell fill at the
 * corresponding opacity, which keeps shadow/scrim swatches readable on the
 * sheet instead of appearing as solid blocks.
 */
function argb(hex: string): string {
  const { r, g, b, a } = parseHex(hex);
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0').toUpperCase();
  return `${h(a * 255)}${h(r)}${h(g)}${h(b)}`;
}

/** Hex string for display in a cell — `#RRGGBB` opaque, `#RRGGBBAA` translucent. */
function hexLabel(hex: string): string {
  return formatHex(parseHex(hex));
}

const C = {
  ink:        '#0E0E25',
  inkMuted:   '#6B6981',
  border:     '#E3E2EC',
  borderHard: '#CBC8DB',
  surfaceAlt: '#F5F4FB',
  highBg:    '#1F7A3A', highText:   '#FFFFFF',
  medBg:     '#B07A1A', medText:    '#FFFFFF',
  lowBg:     '#A0263A', lowText:    '#FFFFFF',
  rdsBg:     '#4040E0', rdsText:    '#FFFFFF',
  fioriBg:   '#E3E2EC', fioriText:  '#2A2A3A',
  titleBg:   '#1F1F2A', titleText:  '#FFFFFF',
  subtitleBg:'#2A2A35', subtitleText:'#D8D6E8',
};

type AnyStyle = Partial<ExcelJS.Style>;

const thinSide: ExcelJS.Border = { style: 'thin', color: { argb: argb(C.border) } };
const thinBorder: Partial<ExcelJS.Borders> = {
  top: thinSide, bottom: thinSide, left: thinSide, right: thinSide,
};

const STYLE: Record<string, AnyStyle> = {
  title: {
    font: { name: 'Inter', size: 16, bold: true, color: { argb: argb(C.titleText) } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(C.titleBg) } },
    alignment: { vertical: 'middle', horizontal: 'left', indent: 1 },
  },
  subtitle: {
    font: { name: 'Inter', size: 10, color: { argb: argb(C.subtitleText) } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(C.subtitleBg) } },
    alignment: { vertical: 'middle', horizontal: 'left', indent: 1 },
  },
  colHeader: {
    font: { name: 'Inter', size: 9, bold: true, color: { argb: argb(C.inkMuted) } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(C.surfaceAlt) } },
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: false },
    border: {
      top:    { style: 'thin', color: { argb: argb(C.borderHard) } },
      bottom: { style: 'medium', color: { argb: argb(C.borderHard) } },
      left:   thinSide,
      right:  thinSide,
    },
  },
  category: {
    font: { name: 'Inter', size: 12, bold: true, color: { argb: argb(C.ink) } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(C.surfaceAlt) } },
    alignment: { vertical: 'middle', horizontal: 'left', indent: 1 },
    border: {
      top:    { style: 'medium', color: { argb: argb(C.borderHard) } },
      bottom: { style: 'thin', color: { argb: argb(C.borderHard) } },
    },
  },
  token: {
    font: { name: 'Menlo', size: 10, color: { argb: argb(C.ink) } },
    alignment: { vertical: 'middle', indent: 1 },
    border: thinBorder,
  },
  text: {
    font: { name: 'Inter', size: 10, color: { argb: argb(C.ink) } },
    alignment: { vertical: 'middle', wrapText: false },
    border: thinBorder,
  },
  textRight: {
    font: { name: 'Inter', size: 10, color: { argb: argb(C.ink) } },
    alignment: { vertical: 'middle', horizontal: 'right' },
    border: thinBorder,
  },
  mutedCenter: {
    font: { name: 'Inter', size: 10, color: { argb: argb(C.inkMuted) }, italic: true },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: thinBorder,
  },
  noteItalic: {
    font: { name: 'Inter', size: 9, color: { argb: argb(C.inkMuted) }, italic: true },
    alignment: { vertical: 'middle', wrapText: true },
    border: thinBorder,
  },
};

function swatchStyle(hex: string): AnyStyle {
  const isLight = hexLuminance(hex) > 0.85;
  const borderColor = isLight ? argb(C.borderHard) : argb(hex);
  return {
    font: { name: 'Menlo', size: 10, bold: true, color: { argb: argb(readableTextOn(hex)) } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(hex) } },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: {
      top:    { style: 'thin', color: { argb: borderColor } },
      bottom: { style: 'thin', color: { argb: borderColor } },
      left:   { style: 'thin', color: { argb: borderColor } },
      right:  { style: 'thin', color: { argb: borderColor } },
    },
  };
}

function confStyle(conf: Conf): AnyStyle {
  const pal =
    conf === 'high'   ? { bg: C.highBg, fg: C.highText } :
    conf === 'medium' ? { bg: C.medBg,  fg: C.medText  } :
                        { bg: C.lowBg,  fg: C.lowText  };
  return {
    font: { name: 'Inter', size: 10, bold: true, color: { argb: argb(pal.fg) } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(pal.bg) } },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: thinBorder,
  };
}

function choiceStyle(choice: 'fiori' | 'rds'): AnyStyle {
  const pal = choice === 'rds'
    ? { bg: C.rdsBg,   fg: C.rdsText   }
    : { bg: C.fioriBg, fg: C.fioriText };
  return {
    font: { name: 'Inter', size: 10, bold: true, color: { argb: argb(pal.fg) } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(pal.bg) } },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: thinBorder,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Worksheet construction helpers
 * ────────────────────────────────────────────────────────────────────────── */

function applyStyleToRow(row: ExcelJS.Row, style: AnyStyle, lastCol: number): void {
  for (let c = 1; c <= lastCol; c++) {
    const cell = row.getCell(c);
    Object.assign(cell, style);
  }
}

function applyHeaderRow(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  headers: string[],
): void {
  const row = ws.getRow(rowNum);
  headers.forEach((h, i) => {
    const cell = row.getCell(i + 1);
    cell.value = h.toUpperCase();
    Object.assign(cell, STYLE.colHeader);
  });
  row.height = 22;
  row.commit();
}

function applyTitleRow(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  text: string,
  lastCol: number,
): void {
  const row = ws.getRow(rowNum);
  row.getCell(1).value = text;
  applyStyleToRow(row, STYLE.title, lastCol);
  row.height = 28;
  ws.mergeCells(rowNum, 1, rowNum, lastCol);
}

function applySubtitleRow(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  text: string,
  lastCol: number,
): void {
  const row = ws.getRow(rowNum);
  row.getCell(1).value = text;
  applyStyleToRow(row, STYLE.subtitle, lastCol);
  row.height = 18;
  ws.mergeCells(rowNum, 1, rowNum, lastCol);
}

function applyCategoryRow(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  label: string,
  lastCol: number,
): void {
  const row = ws.getRow(rowNum);
  row.getCell(1).value = label;
  applyStyleToRow(row, STYLE.category, lastCol);
  row.height = 22;
  ws.mergeCells(rowNum, 1, rowNum, lastCol);
}

function groupByCategory(mappings: Mapping[]): Array<[string, Mapping[]]> {
  const buckets = new Map<string, Mapping[]>();
  for (const m of mappings) {
    const cat = m.fiori.split('/')[0];
    const list = buckets.get(cat) ?? [];
    list.push(m);
    buckets.set(cat, list);
  }
  return Array.from(buckets.entries());
}

function setCell(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  colNum: number,
  value: ExcelJS.CellValue,
  style: AnyStyle,
): void {
  const cell = ws.getCell(rowNum, colNum);
  cell.value = value;
  Object.assign(cell, style);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Per-mode sheet
 * ────────────────────────────────────────────────────────────────────────── */

const MODE_COLS: string[] = [
  'Fiori token',
  'Fiori value',
  'RDS palette',
  'RDS value',
  'Enhanced suggestion',
  'Choice',
  'Conf.',
  'ΔE',
  'Designer note',
];

const MODE_COL_WIDTHS = [42, 14, 32, 14, 22, 9, 9, 7, 38];

function fillModeSheet(
  ws: ExcelJS.Worksheet,
  modeIdx: number,
  choices: Choices,
  rdsChoices: RdsChoices,
  generatedAtIso: string,
): void {
  const mode = MODES[modeIdx];
  ws.columns = MODE_COL_WIDTHS.map((w) => ({ width: w }));
  const lastCol = MODE_COLS.length;
  let r = 1;

  applyTitleRow(ws, r, `Reltio × Fiori color mapping — ${mode.label}`, lastCol);
  r++;

  const mappings = allMappings();
  const counts = { high: 0, medium: 0, low: 0 };
  for (const m of mappings) {
    const fioriHex = resolvedHex(m, mode.id, 'fiori');
    const rdsHex = resolveRds(m, mode.id, rdsChoices).hex;
    counts[computeConfidence(fioriHex, rdsHex).conf]++;
  }
  applySubtitleRow(
    ws,
    r,
    `${mode.scheme === 'light' ? 'Light' : 'Dark'} scheme · ${mappings.length} tokens · high ${counts.high} / medium ${counts.medium} / low ${counts.low} · generated ${generatedAtIso}`,
    lastCol,
  );
  r++;

  ws.getRow(r).height = 6; // visual breathing room
  r++;

  applyHeaderRow(ws, r, MODE_COLS);
  const headerRowNum = r;
  r++;

  for (const [category, rows] of groupByCategory(mappings)) {
    applyCategoryRow(ws, r, `${category}  (${rows.length})`, lastCol);
    r++;

    for (const m of rows) {
      const fioriHex = resolvedHex(m, mode.id, 'fiori');
      const rds = resolveRds(m, mode.id, rdsChoices);
      const choice = getChoice(choices, m.fiori);
      const conf = computeConfidence(fioriHex, rds.hex);
      const blend = blendHex(fioriHex, rds.hex, 0.5).toUpperCase();
      const blendApplied = (rdsChoices[m.fiori] ?? '').startsWith('#');
      const enhancedShouldShow =
        !(conf.conf === 'high' && !blendApplied) &&
        blend !== fioriHex.toUpperCase() &&
        blend !== rds.hex.toUpperCase();

      setCell(ws, r, 1, m.fiori, STYLE.token);
      setCell(ws, r, 2, hexLabel(fioriHex), swatchStyle(fioriHex));
      setCell(ws, r, 3, rds.label, STYLE.text);
      setCell(ws, r, 4, hexLabel(rds.hex), swatchStyle(rds.hex));
      if (enhancedShouldShow) {
        const label = blendApplied ? `✓ ${hexLabel(blend)}` : hexLabel(blend);
        setCell(ws, r, 5, label, swatchStyle(blend));
      } else {
        setCell(ws, r, 5, '—', STYLE.mutedCenter);
      }
      setCell(ws, r, 6, choice === 'rds' ? 'RDS' : 'Fiori', choiceStyle(choice));
      setCell(ws, r, 7, conf.conf, confStyle(conf.conf));
      setCell(ws, r, 8, conf.deltaE, STYLE.textRight);
      setCell(ws, r, 9, m.note ?? '', STYLE.noteItalic);
      ws.getRow(r).height = 20;
      r++;
    }
  }

  // Freeze panes — exceljs supports proper freeze in browser builds.
  ws.views = [{
    state: 'frozen',
    xSplit: 1,
    ySplit: headerRowNum,
    activeCell: `A${headerRowNum + 1}`,
  }];

  ws.autoFilter = {
    from: { row: headerRowNum, column: 1 },
    to:   { row: r - 1,         column: lastCol },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Summary sheet — all 4 modes side by side
 * ────────────────────────────────────────────────────────────────────────── */

function fillSummarySheet(
  ws: ExcelJS.Worksheet,
  choices: Choices,
  rdsChoices: RdsChoices,
  generatedAtIso: string,
): void {
  const cols: string[] = ['Fiori token', 'Choice', 'RDS palette'];
  for (const m of MODES) {
    cols.push(`${m.shortLabel} · Fiori`);
    cols.push(`${m.shortLabel} · Resolved`);
  }
  cols.push('Designer note');

  const widths: number[] = [42, 9, 32];
  for (let i = 0; i < MODES.length; i++) widths.push(14, 14);
  widths.push(38);
  ws.columns = widths.map((w) => ({ width: w }));

  const lastCol = cols.length;
  let r = 1;

  applyTitleRow(ws, r, 'Reltio × Fiori color mapping — Summary', lastCol);
  r++;
  applySubtitleRow(
    ws,
    r,
    `${allMappings().length} tokens · all 4 Fiori Horizon modes · resolved value reflects your choice · generated ${generatedAtIso}`,
    lastCol,
  );
  r++;

  ws.getRow(r).height = 6;
  r++;

  applyHeaderRow(ws, r, cols);
  const headerRowNum = r;
  r++;

  for (const [category, rows] of groupByCategory(allMappings())) {
    applyCategoryRow(ws, r, `${category}  (${rows.length})`, lastCol);
    r++;

    for (const m of rows) {
      const choice = getChoice(choices, m.fiori);
      const rdsLabel = resolveRds(m, 'morning', rdsChoices).label;

      setCell(ws, r, 1, m.fiori, STYLE.token);
      setCell(ws, r, 2, choice === 'rds' ? 'RDS' : 'Fiori', choiceStyle(choice));
      setCell(ws, r, 3, rdsLabel, STYLE.text);

      let col = 4;
      for (const mode of MODES) {
        const fioriHex = resolvedHex(m, mode.id, 'fiori');
        const rdsHex = resolveRds(m, mode.id, rdsChoices).hex;
        const resolvedHexValue = choice === 'fiori' ? fioriHex : rdsHex;
        setCell(ws, r, col++, hexLabel(fioriHex), swatchStyle(fioriHex));
        setCell(ws, r, col++, hexLabel(resolvedHexValue), swatchStyle(resolvedHexValue));
      }
      setCell(ws, r, col, m.note ?? '', STYLE.noteItalic);
      ws.getRow(r).height = 20;
      r++;
    }
  }

  ws.views = [{
    state: 'frozen',
    xSplit: 1,
    ySplit: headerRowNum,
    activeCell: `A${headerRowNum + 1}`,
  }];
  ws.autoFilter = {
    from: { row: headerRowNum, column: 1 },
    to:   { row: r - 1,         column: lastCol },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Custom overrides sheet
 * ────────────────────────────────────────────────────────────────────────── */

function fillCustomOverridesSheet(
  ws: ExcelJS.Worksheet,
  rdsChoices: RdsChoices,
): boolean {
  const rows: Array<{
    category: string;
    token: string;
    kind: string;
    label: string;
    hex: string;
  }> = [];
  for (const m of allMappings()) {
    const r = resolveRds(m, 'morning', rdsChoices);
    if (!r.isExplicit) continue;
    rows.push({
      category: m.fiori.split('/')[0],
      token: m.fiori,
      kind: r.id.startsWith('#') ? 'Blended midpoint' : 'RDS palette override',
      label: r.label,
      hex: r.hex,
    });
  }
  if (rows.length === 0) return false;

  const cols = ['Category', 'Fiori token', 'Override type', 'RDS palette / blend', 'Hex'];
  const widths = [22, 42, 22, 32, 14];
  ws.columns = widths.map((w) => ({ width: w }));
  const lastCol = cols.length;
  let r = 1;

  applyTitleRow(ws, r, 'Custom overrides', lastCol);
  r++;
  applySubtitleRow(
    ws,
    r,
    `${rows.length} token${rows.length === 1 ? '' : 's'} with a non-default RDS pick or applied blend`,
    lastCol,
  );
  r++;

  ws.getRow(r).height = 6;
  r++;

  applyHeaderRow(ws, r, cols);
  const headerRowNum = r;
  r++;

  rows.sort((a, b) => a.category.localeCompare(b.category) || a.token.localeCompare(b.token));
  for (const row of rows) {
    setCell(ws, r, 1, row.category, STYLE.text);
    setCell(ws, r, 2, row.token, STYLE.token);
    setCell(ws, r, 3, row.kind, STYLE.text);
    setCell(ws, r, 4, row.label, STYLE.text);
    setCell(ws, r, 5, hexLabel(row.hex), swatchStyle(row.hex));
    ws.getRow(r).height = 20;
    r++;
  }

  ws.views = [{ state: 'frozen', ySplit: headerRowNum }];
  ws.autoFilter = {
    from: { row: headerRowNum, column: 1 },
    to:   { row: r - 1,         column: lastCol },
  };
  return true;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Entry point
 * ────────────────────────────────────────────────────────────────────────── */

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function isoNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export async function downloadSpreadsheet(
  choices: Choices,
  rdsChoices: RdsChoices,
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Reltio × Fiori Color Mapper';
  wb.created = new Date();
  const generated = isoNow();

  fillSummarySheet(wb.addWorksheet('Summary'), choices, rdsChoices, generated);

  for (let i = 0; i < MODES.length; i++) {
    const safeName = MODES[i].label.replace(/[\[\]:*?/\\]/g, '').slice(0, 31);
    fillModeSheet(wb.addWorksheet(safeName), i, choices, rdsChoices, generated);
  }

  // Custom overrides sheet only if any non-default picks exist.
  const overridesWs = wb.addWorksheet('Custom overrides');
  const hasOverrides = fillCustomOverridesSheet(overridesWs, rdsChoices);
  if (!hasOverrides) {
    wb.removeWorksheet(overridesWs.id);
  }

  // Browser-safe download
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reltio-fiori-mapping-${timestamp()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function spreadsheetTokenCount(): number {
  return allMappings().length;
}
