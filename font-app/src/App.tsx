/**
 * Hybrid Design System font-family migration tool.
 *
 *   - Lists every font token in the file (50 variables + 130 text styles)
 *     with its full property set.
 *   - A single global family dropdown drives the migration: pick a new
 *     family, and every text style + the `sapFontFamily` variable rebases
 *     to that family. Weights, sizes, line-heights and shadow geometry
 *     stay verbatim.
 *   - Live preview rendered in the chosen family in every row.
 *   - Export panel produces CSS, JSON, or a ready-to-paste Figma script.
 */
import { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Link,
  MultiSelect,
  Pill,
  Popover,
  Row,
  Select,
  Spacer,
  Stack,
  Stat,
  Text,
  Tooltip,
} from './ui';
import {
  FAMILY_OPTIONS,
  SYSTEM_FONT_GROUPS,
  SYSTEM_FONT_VALUES,
  TEXT_STYLES,
  buildExport,
  effectiveStyleFamily,
  formatLetterSpacing,
  formatLineHeight,
  migrationStats,
  styleKey,
} from './data';
import type { ExportFormat, FamilyOverrides, FontTextStyle } from './data';
import { GOOGLE_FONTS, GOOGLE_FONTS_SET, ensureGoogleFontLoaded } from './google-fonts';
import { useAppTheme, useLocalFonts, useLocalStorage } from './hooks';

/* ──────────────────────────────────────────────────────────────────────────
 * Small atoms
 * ────────────────────────────────────────────────────────────────────────── */

/** Convert a weight name to CSS `font-weight`. Same logic as the previous
 *  iteration — works for both SAP names ("Semibold") and Inter ("SemiBold"). */
function weightToCss(name: string): number {
  const n = name.toLowerCase().replace(/\s+/g, '');
  if (n.includes('thin')) return 100;
  if (n.includes('extralight')) return 200;
  if (n.includes('light')) return 300;
  if (n.includes('medium')) return 500;
  if (n.includes('semibold')) return 600;
  if (n.includes('extrabold')) return 800;
  if (n.includes('black')) return 900;
  if (n.includes('bold')) return 700;
  return 400;
}

function fontStyleToCss(name: string): 'italic' | 'normal' {
  return name.toLowerCase().includes('italic') ? 'italic' : 'normal';
}

/* ──────────────────────────────────────────────────────────────────────────
 * Per-row Family dropdown
 * ────────────────────────────────────────────────────────────────────────── */

const FAMILY_TRIGGER_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-primary)',
  background: 'var(--bg-input)',
  border: '1px solid var(--stroke-primary)',
  borderRadius: 6,
  padding: '6px 10px',
  cursor: 'pointer',
  outline: 'none',
  minWidth: 0,
  width: '100%',
};

const FAMILY_GROUP_LABEL_STYLE: CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-tertiary)',
  padding: '8px 8px 4px',
  fontWeight: 600,
};

const FAMILY_SEARCH_INPUT_STYLE: CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  fontFamily: 'inherit',
  fontSize: 12,
  color: 'var(--text-primary)',
  background: 'var(--bg-input)',
  border: '1px solid var(--stroke-primary)',
  borderRadius: 4,
  outline: 'none',
  boxSizing: 'border-box',
};

function FamilyChevron({ open }: { open: boolean }) {
  return (
    <svg
      width={10}
      height={6}
      viewBox="0 0 12 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        color: 'var(--text-tertiary)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 120ms',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <path d="M2 2l4 4 4-4" />
    </svg>
  );
}

/**
 * Single option row inside the family popover. Renders the family name in
 * its own typeface so designers see what they're picking. Falls back via the
 * font-stack if the family isn't actually installed.
 */
function FamilyOptionRow({
  value,
  label,
  active,
  onClick,
}: {
  value: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  // CSS-quote-safe: escape backslashes and single quotes so that font names
  // like `Brevia 'Light'` or `Foo\Bar` can't break the surrounding declaration.
  const safeFamily = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        fontFamily: `'${safeFamily}', system-ui, sans-serif`,
        fontSize: 13,
        color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
        background: active ? 'var(--fill-quaternary)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        borderRadius: 4,
        width: '100%',
        fontWeight: active ? 600 : 400,
        transition: 'background 60ms',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--fill-tertiary)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <span
        style={{
          width: 12,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {active ? (
          <svg
            width={10}
            height={10}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 6.5l2.5 2.5 4.5-5" />
          </svg>
        ) : null}
      </span>
      <span
        style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Inline dropdown for the table's Family column.
 *
 * Combines three sources in a single searchable list:
 *   1. "In this file" — surfaces the row's current/original family when it
 *      isn't already in any catalog group (e.g. SAP's proprietary "72").
 *   2. "Installed on this machine" — populated lazily from the browser's
 *      Local Font Access API. The API requires a one-time permission
 *      prompt; we surface a CTA button until that happens.
 *   3. The static catalog (`SYSTEM_FONT_GROUPS`) — generic CSS keywords,
 *      open-source web fonts, system fonts, classic foundry libraries.
 *
 * A search box at the top filters across all groups simultaneously.
 */
const FamilyDropdown = memo(function FamilyDropdown({
  value,
  originalFamily,
  onChange,
  isOverridden,
}: {
  /** Currently-displayed family (post-resolution). */
  value: string;
  /** What the file actually contains — used to inject a fallback option. */
  originalFamily: string;
  onChange: (next: string) => void;
  /** When true, render the "Reset" affordance. */
  isOverridden: boolean;
}) {
  const [query, setQuery] = useState('');
  const local = useLocalFonts();

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();

    // "In this file" — surface current/original family when missing from
    // the curated catalog. This keeps "72", "72 Mono", or any custom name
    // typed in the global picker selectable.
    const fileExtras: { value: string; label: string }[] = [];
    if (!SYSTEM_FONT_VALUES.has(value) && !GOOGLE_FONTS_SET.has(value)) {
      fileExtras.push({ value, label: `${value} (current)` });
    }
    if (
      originalFamily !== value &&
      !SYSTEM_FONT_VALUES.has(originalFamily) &&
      !GOOGLE_FONTS_SET.has(originalFamily) &&
      !fileExtras.find((e) => e.value === originalFamily)
    ) {
      fileExtras.push({ value: originalFamily, label: `${originalFamily} (original)` });
    }

    // "Installed on this machine" — only when the API resolved. Dedupe
    // against Google Fonts later so we don't list e.g. "Inter" twice.
    const localFontSet = new Set(local.fonts ?? []);
    const localGroup =
      local.fonts && local.fonts.length > 0
        ? {
            label: `Installed on this machine (${local.fonts.length})`,
            options: local.fonts.map((f) => ({ value: f, label: f })),
          }
        : null;

    // Google Fonts available via Figma's cloud catalog. Skip families that
    // are also installed locally — the local entry is functionally identical
    // and reads cleaner in the list.
    const googleFonts = GOOGLE_FONTS.filter((f) => !localFontSet.has(f));
    const googleGroup = {
      label: `Available in Figma · Google Fonts (${googleFonts.length})`,
      options: googleFonts.map((f) => ({ value: f, label: f })),
    };

    const allGroups = [
      ...(fileExtras.length ? [{ label: 'In this file', options: fileExtras }] : []),
      ...(localGroup ? [localGroup] : []),
      ...SYSTEM_FONT_GROUPS,
      googleGroup,
    ];

    if (!q) return allGroups;
    return allGroups
      .map((g) => ({
        label: g.label,
        options: g.options.filter(
          (o) => o.value.toLowerCase().includes(q) || o.label.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.options.length > 0);
  }, [query, local.fonts, value, originalFamily]);

  const totalVisible = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.options.length, 0),
    [filteredGroups],
  );

  const handleLoadFonts = useCallback(() => {
    local.load().catch(() => {
      /* error already stored in the hook state */
    });
  }, [local]);

  return (
    <Row gap={4} align="center" style={{ minWidth: 0 }}>
      <Popover
        width={300}
        maxHeight={420}
        trigger={(open, toggle) => (
          <button
            type="button"
            onClick={() => {
              if (open) {
                setQuery('');
              }
              toggle();
            }}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Font family"
            style={FAMILY_TRIGGER_STYLE}
          >
            <span
              style={{
                flex: 1,
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </span>
            <FamilyChevron open={open} />
          </button>
        )}
      >
        {(close) => (
          <Stack gap={0}>
            <div
              style={{
                padding: 8,
                borderBottom: '1px solid var(--stroke-tertiary)',
                background: 'var(--bg-elevated)',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              <input
                type="search"
                placeholder="Search fonts…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                style={FAMILY_SEARCH_INPUT_STYLE}
              />
            </div>

            {local.supported && !local.fonts ? (
              <div
                style={{
                  padding: 8,
                  borderBottom: '1px solid var(--stroke-tertiary)',
                }}
              >
                <button
                  type="button"
                  onClick={handleLoadFonts}
                  disabled={local.loading}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontFamily: 'inherit',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--accent-primary)',
                    background: 'transparent',
                    border: '1px dashed var(--accent-primary)',
                    borderRadius: 4,
                    cursor: local.loading ? 'wait' : 'pointer',
                    opacity: local.loading ? 0.6 : 1,
                  }}
                >
                  {local.loading ? 'Loading…' : 'Load all installed fonts'}
                </button>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--text-tertiary)',
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}
                >
                  One-time browser prompt; reads installed family names only.
                </div>
              </div>
            ) : null}
            {!local.supported ? (
              <div
                style={{
                  padding: 8,
                  borderBottom: '1px solid var(--stroke-tertiary)',
                  fontSize: 10,
                  color: 'var(--text-tertiary)',
                  lineHeight: 1.4,
                }}
              >
                Local Font Access API isn't supported in this browser. Try
                Chrome, Edge, or Opera to list every installed font.
              </div>
            ) : null}
            {local.error ? (
              <div
                style={{
                  padding: 8,
                  borderBottom: '1px solid var(--stroke-tertiary)',
                  fontSize: 10,
                  color: '#ff6b6b',
                  lineHeight: 1.4,
                }}
              >
                {local.error}
              </div>
            ) : null}

            <div style={{ overflowY: 'auto', maxHeight: 360, padding: 4 }}>
              {totalVisible === 0 ? (
                <div
                  style={{
                    padding: 16,
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'var(--text-tertiary)',
                  }}
                >
                  No fonts match &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <Fragment key={group.label}>
                    <div style={FAMILY_GROUP_LABEL_STYLE}>{group.label}</div>
                    {group.options.map((opt) => (
                      <FamilyOptionRow
                        key={`${group.label}-${opt.value}`}
                        value={opt.value}
                        label={opt.label}
                        active={opt.value === value}
                        onClick={() => {
                          // Lazy-load the Google Fonts stylesheet so the row's
                          // Sample preview can render the actual typeface
                          // instead of falling back to system-ui.
                          ensureGoogleFontLoaded(opt.value);
                          onChange(opt.value);
                          setQuery('');
                          close();
                        }}
                      />
                    ))}
                  </Fragment>
                ))
              )}
            </div>
          </Stack>
        )}
      </Popover>
      {isOverridden ? (
        <Tooltip content={`Reset to default (${originalFamily})`}>
          <button
            type="button"
            onClick={() => onChange(originalFamily)}
            style={{
              fontSize: 10,
              color: 'var(--text-tertiary)',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid var(--stroke-tertiary)',
              background: 'var(--fill-tertiary)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ↺
          </button>
        </Tooltip>
      ) : null}
    </Row>
  );
});

/** Render the sample text in the row's chosen family. */
function Sample({
  family,
  style,
  size,
  text = 'Aa Bb Cc 123',
}: {
  family: string;
  style: string;
  size: number;
  text?: string;
}) {
  // Cap the rendered size so a 72px display row doesn't blow up table layout.
  const renderedSize = Math.min(size, 28);
  return (
    <span
      style={{
        fontFamily: `'${family}', system-ui, sans-serif`,
        fontWeight: weightToCss(style),
        fontStyle: fontStyleToCss(style),
        fontSize: renderedSize,
        lineHeight: 1.1,
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        maxWidth: '100%',
      }}
    >
      {text}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Family picker
 * ────────────────────────────────────────────────────────────────────────── */

function FamilyPicker({
  oldFamily,
  newFamily,
  onChange,
  hasOverrides,
  onReset,
}: {
  oldFamily: string;
  newFamily: string;
  onChange: (next: string) => void;
  /** True when any per-row override exists OR the default family is changed. */
  hasOverrides: boolean;
  /**
   * Wipe both the default replacement family AND every per-row override.
   * Snaps the file back to its original "72 everywhere" state.
   */
  onReset: () => void;
}) {
  const knownValues = useMemo(() => FAMILY_OPTIONS.map((o) => o.value), []);
  const isCustom = !knownValues.includes(newFamily);
  const [customInput, setCustomInput] = useState(isCustom ? newFamily : '');
  const canReset = hasOverrides || newFamily !== oldFamily;

  return (
    <Stack gap={14}>
      <Stack gap={4}>
        <Row gap={6} align="center">
          <Text size="small" weight="medium" tone="secondary" as="span">
            Replace font family
          </Text>
          <Spacer />
          {/* Reset is always visible so the affordance is discoverable, but
              it greys itself out (and stays clickable for clarity) when
              there's nothing to revert. */}
          <Tooltip
            content={
              canReset
                ? `Snap everything back to "${oldFamily}" and discard per-row overrides.`
                : 'Already on the original — nothing to reset.'
            }
          >
            <button
              type="button"
              onClick={canReset ? onReset : undefined}
              aria-disabled={!canReset}
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                color: canReset ? 'var(--tone-danger-text)' : 'var(--text-quaternary)',
                padding: '3px 8px',
                borderRadius: 4,
                border: `1px solid ${canReset ? 'var(--tone-danger-border)' : 'var(--stroke-tertiary)'}`,
                background: canReset ? 'var(--tone-danger-bg)' : 'var(--fill-tertiary)',
                cursor: canReset ? 'pointer' : 'default',
                whiteSpace: 'nowrap',
              }}
            >
              ↺ Reset to original
            </button>
          </Tooltip>
        </Row>
        <Select
          value={isCustom ? '__custom' : newFamily}
          onChange={(v) => {
            if (v === '__custom') {
              // Switching to custom — seed the input with the current value
              setCustomInput(newFamily);
              return;
            }
            onChange(v);
          }}
          options={[
            ...FAMILY_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
              sublabel: o.tagline,
            })),
            { value: '__custom', label: 'Custom…', sublabel: 'Type any family name' },
          ]}
          panelWidth={360}
          ariaLabel="Replacement font family"
        />
      </Stack>

      {isCustom ? (
        <Stack gap={4}>
          <Text size="small" weight="medium" tone="secondary" as="span">
            Custom family name
          </Text>
          <Row gap={6} align="center">
            <input
              type="text"
              value={customInput}
              placeholder="e.g. Söhne, Untitled Sans, Recoleta"
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={() => {
                if (customInput.trim()) onChange(customInput.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
              style={{ width: 240, fontFamily: 'var(--font-mono)' }}
            />
            <Button
              variant="secondary"
              onClick={() => {
                if (customInput.trim()) onChange(customInput.trim());
              }}
            >
              Apply
            </Button>
          </Row>
          <Text size="small" tone="tertiary" as="span">
            The Figma migration script calls{' '}
            <code>figma.loadFontAsync()</code> before assigning — Figma will
            error at apply time if the family isn't installed in the file.
          </Text>
        </Stack>
      ) : null}

      <Callout tone={oldFamily === newFamily ? 'neutral' : 'info'}>
        <Stack gap={4}>
          <Text size="small">
            <Text as="span" weight="semibold">Migration:</Text>{' '}
            <code>{oldFamily}</code> → <code>{newFamily}</code>
          </Text>
          <Text size="small" tone="secondary">
            Only the family changes. Every weight, size, line-height, letter-
            spacing, and shadow offset in the table below stays exactly as
            Fiori currently defines it.
          </Text>
        </Stack>
      </Callout>
    </Stack>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Row renderers
 * ────────────────────────────────────────────────────────────────────────── */

const TextStyleRow = memo(function TextStyleRow({
  ts,
  resolvedFamily,
  isOverridden,
  onFamilyChange,
}: {
  ts: FontTextStyle;
  /** Family this row will use after all resolution rules apply. */
  resolvedFamily: string;
  /** True when the user explicitly picked this row's family (vs default). */
  isOverridden: boolean;
  onFamilyChange: (next: string) => void;
}) {
  const willChange = resolvedFamily !== ts.family;

  return (
    <tr style={{ borderTop: '1px solid var(--stroke-tertiary)' }}>
      <td style={cellStyle({ width: '22%', minWidth: 0 })}>
        <Tooltip content={ts.name}>
          <Text
            size="small"
            weight="medium"
            as="span"
            style={{
              fontFamily: 'var(--font-mono)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              maxWidth: '100%',
            }}
          >
            {ts.name}
          </Text>
        </Tooltip>
      </td>
      <td style={cellStyle({ width: '24%' })}>
        <Stack gap={4}>
          <FamilyDropdown
            value={resolvedFamily}
            originalFamily={ts.family}
            onChange={onFamilyChange}
            isOverridden={isOverridden}
          />
          {willChange ? (
            <Text size="small" tone="tertiary" as="span" style={{ fontFamily: 'var(--font-mono)' }}>
              was {ts.family}
            </Text>
          ) : null}
        </Stack>
      </td>
      <td style={cellStyle({ width: '11%' })}>
        <Text size="small" as="span" style={{ fontFamily: 'var(--font-mono)' }}>
          {ts.style}
        </Text>
      </td>
      <td style={cellStyle({ width: '8%' })}>
        <Text size="small" as="span" style={{ fontFamily: 'var(--font-mono)' }}>
          {ts.fontSize} px
        </Text>
      </td>
      <td style={cellStyle({ width: '10%' })}>
        <Text size="small" as="span" style={{ fontFamily: 'var(--font-mono)' }}>
          {formatLineHeight(ts.lineHeight)}
        </Text>
      </td>
      <td style={cellStyle({ width: '10%' })}>
        <Text size="small" tone={ts.letterSpacing.value === 0 ? 'tertiary' : 'primary'} as="span" style={{ fontFamily: 'var(--font-mono)' }}>
          {formatLetterSpacing(ts.letterSpacing)}
        </Text>
      </td>
      <td style={cellStyle({ width: '15%' })}>
        <Sample family={resolvedFamily} style={ts.style} size={ts.fontSize} />
      </td>
    </tr>
  );
});

function cellStyle(extra: CSSProperties = {}): CSSProperties {
  return {
    padding: '10px 10px',
    verticalAlign: 'top',
    fontSize: 13,
    ...extra,
  };
}

function headStyle(): CSSProperties {
  return {
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-tertiary)',
    padding: '10px 10px',
    borderBottom: '1px solid var(--stroke-secondary)',
    background: 'var(--fill-quaternary)',
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Main app
 * ────────────────────────────────────────────────────────────────────────── */

export default function App() {
  const [theme, setTheme] = useAppTheme();
  const [newFamily, setNewFamily] = useLocalStorage<string>(
    'reltio.font.family',
    'Inter',
  );
  /**
   * Per-row family overrides. Each row's dropdown writes to / reads from
   * this map. Setting a row's override to the same value as its original
   * family clears the entry (i.e. "back to default"); the helpers in
   * data.ts handle that resolution.
   */
  const [familyOverrides, setFamilyOverrides] = useLocalStorage<FamilyOverrides>(
    'reltio.font.familyOverrides',
    {},
  );
  const [query, setQuery] = useLocalStorage<string>('reltio.font.query', '');
  const [styleCategories, setStyleCategories] = useLocalStorage<string[]>(
    'reltio.font.styleCats',
    [],
  );
  const [exportFormat, setExportFormat] = useLocalStorage<ExportFormat>(
    'reltio.font.exportFormat',
    'figma-script',
  );

  const oldFamily = '72'; // Source-of-truth family in the Hybrid file today.

  /* ---------- Per-row override handlers ---------- */

  const setOverride = useCallback(
    (key: string, originalFamily: string, next: string) => {
      setFamilyOverrides((prev) => {
        // If the user picks the row's original family, clear the override so
        // the global default picker can take over again. Same for an empty
        // string — defensive but useful.
        if (next === originalFamily || next === '') {
          if (!(key in prev)) return prev;
          const { [key]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: next };
      });
    },
    [setFamilyOverrides],
  );

  const clearAllOverrides = useCallback(() => {
    setFamilyOverrides({});
  }, [setFamilyOverrides]);

  /**
   * Reset the entire migration state back to the file's original:
   *   - Default family snaps back to "72" (the Hybrid file's source-of-truth).
   *   - Every per-row override is discarded.
   *
   * Driven by the "↺ Reset to original" button in the hero card.
   */
  const resetAll = useCallback(() => {
    setNewFamily(oldFamily);
    setFamilyOverrides({});
  }, [setNewFamily, setFamilyOverrides]);

  /* ---------- Derived state ---------- */

  const stats = useMemo(
    () => migrationStats(oldFamily, newFamily, familyOverrides),
    [newFamily, familyOverrides],
  );

  /**
   * Lazy-load any Google Font family that the migration currently uses, so
   * the row Sample previews render in the actual typeface instead of falling
   * back to system-ui. Fires on first paint (state hydrates from
   * localStorage) and whenever the user picks a new family.
   */
  useEffect(() => {
    ensureGoogleFontLoaded(newFamily);
    for (const fam of Object.values(familyOverrides)) {
      if (typeof fam === 'string' && fam) ensureGoogleFontLoaded(fam);
    }
  }, [newFamily, familyOverrides]);

  const styleCategoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of TEXT_STYLES) counts.set(s.category, (counts.get(s.category) || 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([id, count]) => ({ id, label: id, count }));
  }, []);

  // Initialize "all categories selected" the first time (empty in localStorage)
  const activeStyleCats =
    styleCategories.length === 0
      ? styleCategoryOptions.map((c) => c.id)
      : styleCategories;

  const filteredStyles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEXT_STYLES.filter((s) => {
      if (!activeStyleCats.includes(s.category)) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.family.toLowerCase().includes(q) ||
        s.style.toLowerCase().includes(q)
      );
    });
  }, [query, activeStyleCats]);

  /* ---------- Export ---------- */

  const exportText = useMemo(
    () => buildExport(exportFormat, oldFamily, newFamily, familyOverrides),
    [exportFormat, newFamily, familyOverrides],
  );
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  }, [exportText]);

  const download = useCallback(() => {
    const ext =
      exportFormat === 'json' ? 'json'
        : exportFormat === 'figma-script' ? 'js'
          : 'css';
    const mime =
      ext === 'json' ? 'application/json'
        : ext === 'js' ? 'application/javascript'
          : 'text/css';
    const blob = new Blob([exportText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hybrid-font-family-${oldFamily}-to-${newFamily.replace(/\s+/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportText, exportFormat, newFamily]);

  /* ---------- Render ---------- */

  return (
    <>
      <header className="app-header">
        <H1>Hybrid · Font Family Migration</H1>
        <Spacer />
        <Pill size="sm" tone="info" active={theme === 'light'} onClick={() => setTheme('light')}>Light</Pill>
        <Pill size="sm" tone="info" active={theme === 'dark'} onClick={() => setTheme('dark')}>Dark</Pill>
      </header>

      <main className="app-shell">
        <Stack gap={28}>
          {/* ---------- Hero ---------- */}
          <Card>
            <CardBody>
              <Grid columns={2} gap={24}>
                <FamilyPicker
                  oldFamily={oldFamily}
                  newFamily={newFamily}
                  onChange={setNewFamily}
                  hasOverrides={stats.customOverrideCount > 0}
                  onReset={resetAll}
                />
                <Stack gap={12}>
                  <Text size="small" weight="medium" tone="secondary" as="span">
                    Side-by-side preview
                  </Text>
                  <Grid columns={2} gap={12}>
                    <Stack gap={6}>
                      <Pill size="sm" tone="neutral">Current — {oldFamily}</Pill>
                      <span
                        style={{
                          fontFamily: `'${oldFamily}', system-ui, sans-serif`,
                          fontSize: 44,
                          lineHeight: 1.1,
                          fontWeight: 700,
                        }}
                      >
                        Aa
                      </span>
                      <Text size="small" tone="secondary" as="span" style={{ fontFamily: `'${oldFamily}', sans-serif` }}>
                        The quick brown fox
                      </Text>
                    </Stack>
                    <Stack gap={6}>
                      <Pill size="sm" tone="info">New — {newFamily}</Pill>
                      <span
                        style={{
                          fontFamily: `'${newFamily}', system-ui, sans-serif`,
                          fontSize: 44,
                          lineHeight: 1.1,
                          fontWeight: 700,
                        }}
                      >
                        Aa
                      </span>
                      <Text size="small" tone="secondary" as="span" style={{ fontFamily: `'${newFamily}', sans-serif` }}>
                        The quick brown fox
                      </Text>
                    </Stack>
                  </Grid>
                </Stack>
              </Grid>
            </CardBody>
          </Card>

          {/* ---------- Stats ---------- */}
          <Grid columns={4} gap={12}>
            <Stat label="Text styles in file" value={`${TEXT_STYLES.length}`} />
            <Stat
              label="Will change"
              value={`${stats.textStylesChanged}`}
              tone="info"
            />
            <Stat
              label="Custom row overrides"
              value={`${stats.customOverrideCount}`}
              tone={stats.customOverrideCount > 0 ? 'warning' : 'success'}
            />
            <Stat
              label="Untouched"
              value={`${stats.textStylesUntouched}`}
              tone="success"
            />
          </Grid>

          {/* ---------- Filters ---------- */}
          <Card>
            <CardBody>
              <Stack gap={12}>
                <Row gap={6} align="center" wrap>
                  <Text size="small" weight="medium" tone="secondary" as="span">
                    {TEXT_STYLES.length} text styles in this file
                  </Text>
                  <Spacer />
                  {stats.customOverrideCount > 0 ? (
                    <Pill
                      size="sm"
                      tone="deleted"
                      onClick={clearAllOverrides}
                      title={`Clear ${stats.customOverrideCount} per-row override${stats.customOverrideCount === 1 ? '' : 's'} and fall back to the default replacement.`}
                    >
                      Clear {stats.customOverrideCount} override{stats.customOverrideCount === 1 ? '' : 's'}
                    </Pill>
                  ) : null}
                  <input
                    type="search"
                    placeholder="Search styles…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: 240 }}
                  />
                </Row>
                <Stack gap={4} style={{ minWidth: 240 }}>
                  <Text size="small" weight="medium" tone="secondary" as="span">
                    Categories ({styleCategoryOptions.length})
                  </Text>
                  <MultiSelect
                    selectedIds={activeStyleCats}
                    onChange={(next) => setStyleCategories(next)}
                    options={styleCategoryOptions}
                  />
                </Stack>
              </Stack>
            </CardBody>
          </Card>

          {/* ---------- Table ---------- */}
          <Card>
            <CardHeader>
              <Row gap={8} align="center">
                <H2>Text styles</H2>
                <Pill size="sm" tone="neutral">
                  {filteredStyles.length} of {TEXT_STYLES.length} shown
                </Pill>
              </Row>
            </CardHeader>
            <CardBody style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th style={headStyle()}>Token</th>
                      <th style={headStyle()}>Family</th>
                      <th style={headStyle()}>Weight / Style</th>
                      <th style={headStyle()}>Size</th>
                      <th style={headStyle()}>Line height</th>
                      <th style={headStyle()}>Letter spacing</th>
                      <th style={headStyle()}>Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStyles.map((s) => {
                      const key = styleKey(s);
                      const isOverridden = key in familyOverrides;
                      const resolvedFamily = effectiveStyleFamily(s, familyOverrides, oldFamily, newFamily);
                      return (
                        <TextStyleRow
                          key={s.name}
                          ts={s}
                          resolvedFamily={resolvedFamily}
                          isOverridden={isOverridden}
                          onFamilyChange={(next) => setOverride(key, s.family, next)}
                        />
                      );
                    })}
                    {filteredStyles.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ ...cellStyle(), textAlign: 'center', color: 'var(--text-tertiary)' }}>
                          No text styles match the current filter.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {/* ---------- Export ---------- */}
          <Stack gap={12}>
            <H2>Apply the migration</H2>
            <Text tone="secondary">
              Three output formats. The Figma-script export is the one that
              actually mutates the Hybrid file — paste it into a{' '}
              <code>use_figma</code> call. CSS and JSON are convenience views
              for theme overrides and audit logs.
            </Text>

            <Card>
              <CardHeader
                trailing={
                  <Row gap={4} align="center">
                    <Pill size="sm" tone="info" active={exportFormat === 'figma-script'} onClick={() => setExportFormat('figma-script')}>
                      Figma script
                    </Pill>
                    <Pill size="sm" tone="info" active={exportFormat === 'css'} onClick={() => setExportFormat('css')}>
                      CSS
                    </Pill>
                    <Pill size="sm" tone="info" active={exportFormat === 'json'} onClick={() => setExportFormat('json')}>
                      JSON
                    </Pill>
                  </Row>
                }
              >
                Output · {oldFamily} → {newFamily}
              </CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <Row gap={16} align="center" wrap>
                    <Text size="small" as="span">
                      <Text as="span" weight="semibold">{stats.textStylesChanged}</Text>{' '}
                      text style{stats.textStylesChanged === 1 ? '' : 's'} will change
                    </Text>
                    <Spacer />
                    <Row gap={6}>
                      <Button onClick={copy} variant="secondary">
                        {copyState === 'copied' ? 'Copied!' : copyState === 'error' ? 'Copy failed' : 'Copy'}
                      </Button>
                      <Button onClick={download} variant="primary">
                        Download{' '}
                        {exportFormat === 'figma-script' ? 'JS' : exportFormat === 'css' ? 'CSS' : 'JSON'}
                      </Button>
                    </Row>
                  </Row>
                  {newFamily === oldFamily ? (
                    <Callout tone="warning">
                      <Text size="small">
                        Pick a different family above to see the migration output.
                      </Text>
                    </Callout>
                  ) : null}
                  <pre>{exportText}</pre>
                </Stack>
              </CardBody>
            </Card>
          </Stack>

          <Divider />

          <Stack gap={8}>
            <H3>Source</H3>
            <Text size="small" tone="secondary" as="span">
              Target file:{' '}
              <Link href="https://www.figma.com/design/XywZ3yPdXzBL4MnKbzP7uI/Hybrid-Design-system?node-id=23018-4781">
                Hybrid Design System
              </Link>
            </Text>
            <Text size="small" tone="tertiary" as="span">
              The color migration tool runs on <code>localhost:3030</code>. This one is{' '}
              <code>localhost:3031</code>.
            </Text>
          </Stack>
        </Stack>
      </main>
    </>
  );
}
