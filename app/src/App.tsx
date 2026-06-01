import { memo, useCallback, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
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
  mergeStyle,
} from './ui';
import { ColorPicker } from './ColorPicker';
import {
  CATEGORIES,
  MODES,
  RDS_RAMPS,
  SWAPS,
  allMappings,
  blendHex,
  buildExport,
  buildFioriHexIndex,
  buildRdsInternalHexIndex,
  computeConfidence,
  deltaE76,
  getChoice,
  hexAlpha,
  isTranslucentHex,
  modeLabel,
  modeScheme,
  rdsColorsByRamp,
  readableTextOn,
  resolveRds,
  resolvedHex,
} from './data';
import type {
  Choices,
  Conf,
  ConfDescriptor,
  ExportFormat,
  Mapping,
  Mode,
  RdsChoices,
  RdsTokenRef,
  Source,
} from './data';
import { useAppTheme, useLocalStorage } from './hooks';

/* ---------- Small atoms ---------- */

function Chip({ hex, size = 16 }: { hex: string; size?: number }) {
  // 8-digit (#RRGGBBAA) hexes reveal a tiny checker behind them so the user
  // can tell at a glance that the color is translucent. Tile is 4px so a
  // 14-16px chip shows a clear 2x2-ish checkerboard. The full `background:`
  // shorthand is required — `backgroundImage: var(--checker-bg)` would drop
  // the position/size and turn the pattern into a solid wash.
  const isTranslucent = hex.replace('#', '').length === 8;
  const checkerTile = '#c5c7cd';
  const checker =
    `linear-gradient(45deg, ${checkerTile} 25%, transparent 25%, transparent 75%, ${checkerTile} 75%) 0 0/4px 4px,` +
    `linear-gradient(45deg, ${checkerTile} 25%, transparent 25%, transparent 75%, ${checkerTile} 75%) 2px 2px/4px 4px`;
  return (
    <span
      title={hex}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: 4,
        background: isTranslucent
          ? `linear-gradient(${hex}, ${hex}), ${checker}, #fff`
          : hex,
        border: '1px solid var(--stroke-tertiary)',
        flexShrink: 0,
      }}
    />
  );
}

function HexLabel({ hex }: { hex: string }) {
  // Translucent colors (#RRGGBBAA) get an "· N%" alpha suffix in a muted tone
  // so the value reads as "color + opacity" instead of just an opaque 8-char
  // hex that designers might mistake for an extra-saturated color.
  const translucent = isTranslucentHex(hex);
  const alphaPct = translucent ? `${Math.round(hexAlpha(hex) * 100)}%` : '';
  return (
    <Text
      size="small"
      tone="secondary"
      as="span"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {hex}
      {translucent ? (
        <span style={{ opacity: 0.7, marginLeft: 4 }}>· {alphaPct}</span>
      ) : null}
    </Text>
  );
}

function ColorCell({ hex, name }: { hex: string; name?: string }) {
  return (
    <Row gap={8} align="center">
      <Chip hex={hex} size={18} />
      <Stack gap={1} style={{ minWidth: 0 }}>
        {name ? (
          <Text size="small" weight="medium" as="span" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </Text>
        ) : null}
        <HexLabel hex={hex} />
      </Stack>
    </Row>
  );
}

function BigSwatch({
  hex,
  label,
  sublabel,
}: {
  hex: string;
  label: string;
  sublabel?: string;
}) {
  return (
    <div
      style={{
        background: hex,
        borderRadius: 8,
        border: '1px solid var(--stroke-tertiary)',
        padding: 18,
        minHeight: 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          color: readableTextOn(hex),
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {hex.toUpperCase()}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: readableTextOn(hex), fontWeight: 600, fontSize: 14 }}>{label}</span>
        {sublabel ? (
          <span style={{ color: readableTextOn(hex), opacity: 0.85, fontSize: 12 }}>
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const CONF_LABELS: Record<Conf, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

function ConfPill({
  descriptor,
  note,
}: {
  descriptor: ConfDescriptor;
  note?: string;
}) {
  const { conf, deltaE, description } = descriptor;
  const tone = conf === 'high' ? 'success' : conf === 'medium' ? 'warning' : 'deleted';
  return (
    <Tooltip
      maxWidth={320}
      content={
        <Stack gap={6}>
          <Row gap={6} align="center">
            <Text size="small" weight="semibold" as="span">
              {CONF_LABELS[conf]}
            </Text>
            <Text
              size="small"
              tone="tertiary"
              as="span"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
            >
              ΔE {deltaE.toFixed(1)}
            </Text>
          </Row>
          <Text size="small" tone="secondary">
            {description}
          </Text>
          <div
            style={{
              height: 1,
              background: 'var(--stroke-tertiary)',
              margin: '2px 0',
            }}
          />
          <Text
            size="small"
            tone="tertiary"
            as="span"
            style={{ fontSize: 11 }}
          >
            ΔE (CIE76) measures perceptual color distance in CIELAB. Computed
            live from the Fiori and RDS hex values in the current mode — flip
            modes or pick a different RDS color and this score updates.
          </Text>
          {note ? (
            <>
              <div
                style={{
                  height: 1,
                  background: 'var(--stroke-tertiary)',
                  margin: '2px 0',
                }}
              />
              <Text
                size="small"
                weight="semibold"
                as="span"
                style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
              >
                Designer note
              </Text>
              <Text size="small" tone="secondary">{note}</Text>
            </>
          ) : null}
        </Stack>
      }
    >
      <Pill size="sm" tone={tone} active>
        {conf}
      </Pill>
    </Tooltip>
  );
}

function FioriCategoryPalette({
  name,
  items,
  mode,
  getSiblings,
}: {
  name: string;
  items: Mapping[];
  mode: Mode;
  getSiblings: (hex: string) => Mapping[];
}) {
  return (
    <Stack gap={6}>
      <Row gap={6} align="center">
        <Text size="small" weight="semibold" as="span">{name}</Text>
        <Text size="small" tone="tertiary" as="span">· {items.length}</Text>
      </Row>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: 6,
          borderRadius: 6,
          border: '1px solid var(--stroke-tertiary)',
          background: 'var(--bg-elevated)',
        }}
      >
        {items.map((m) => {
          const hex = resolvedHex(m, mode, 'fiori');
          const leaf = m.fiori.split('/').pop() ?? m.fiori;
          const siblings = getSiblings(hex).filter((s) => s.fiori !== m.fiori);
          return (
            <Tooltip
              key={m.fiori}
              maxWidth={320}
              content={
                <Stack gap={6}>
                  <Row gap={6} align="center">
                    <Chip hex={hex} size={14} />
                    <Text
                      weight="semibold"
                      as="span"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                    >
                      {m.fiori}
                    </Text>
                  </Row>
                  <Text
                    size="small"
                    tone="secondary"
                    as="span"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {hex}
                  </Text>
                  <div
                    style={{
                      height: 1,
                      background: 'var(--stroke-tertiary)',
                      margin: '2px 0',
                    }}
                  />
                  {siblings.length === 0 ? (
                    <Text size="small" tone="tertiary">
                      No other mapped Fiori tokens share this color in this mode.
                    </Text>
                  ) : (
                    <Stack gap={4}>
                      <Text
                        size="small"
                        weight="semibold"
                        as="span"
                        style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
                      >
                        Also used by {siblings.length} Fiori token
                        {siblings.length === 1 ? '' : 's'}
                      </Text>
                      <Stack gap={2}>
                        {siblings.slice(0, 8).map((s) => (
                          <Text
                            key={s.fiori}
                            size="small"
                            tone="secondary"
                            as="span"
                            style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
                          >
                            {s.fiori}
                          </Text>
                        ))}
                        {siblings.length > 8 ? (
                          <Text size="small" tone="tertiary" as="span">
                            + {siblings.length - 8} more
                          </Text>
                        ) : null}
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              }
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: hex,
                  borderRadius: 4,
                  border: '1px solid var(--stroke-tertiary)',
                  position: 'relative',
                  cursor: 'help',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 3,
                    fontSize: 8,
                    fontFamily: 'var(--font-mono)',
                    color: readableTextOn(hex),
                    opacity: 0.85,
                    pointerEvents: 'none',
                  }}
                >
                  {leaf.replace(/^sap/, '').slice(0, 4)}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </Stack>
  );
}

function Ramp({
  name,
  stops,
  getRdsTokens,
}: {
  name: string;
  stops: [string, string][];
  getRdsTokens: (hex: string) => RdsTokenRef[];
}) {
  return (
    <Stack gap={6}>
      <Text size="small" weight="semibold">{name}</Text>
      <div
        style={{
          display: 'flex',
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid var(--stroke-tertiary)',
        }}
      >
        {stops.map(([stop, hex]) => {
          const refs = getRdsTokens(hex);
          // Exclude the swatch's own primitive entry from the "also used by" list.
          const selfLabel = `${name} · ${stop}`;
          const others = refs.filter(
            (r) => !(r.kind === 'primitive' && r.name === selfLabel),
          );
          const semantics = others.filter((r) => r.kind === 'semantic');
          const primitives = others.filter((r) => r.kind === 'primitive');
          return (
            <Tooltip
              key={stop}
              maxWidth={320}
              triggerStyle={{ flex: 1, display: 'flex' }}
              content={
                <Stack gap={6}>
                  <Row gap={6} align="center">
                    <Chip hex={hex} size={14} />
                    <Text weight="semibold" as="span">{selfLabel}</Text>
                  </Row>
                  <Text
                    size="small"
                    tone="secondary"
                    as="span"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {hex}
                  </Text>
                  <div
                    style={{
                      height: 1,
                      background: 'var(--stroke-tertiary)',
                      margin: '2px 0',
                    }}
                  />
                  {others.length === 0 ? (
                    <Text size="small" tone="tertiary">
                      No other RDS tokens resolve to this hex in this mode.
                    </Text>
                  ) : (
                    <Stack gap={6}>
                      {semantics.length > 0 ? (
                        <Stack gap={2}>
                          <Text
                            size="small"
                            weight="semibold"
                            as="span"
                            style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
                          >
                            Semantic token{semantics.length === 1 ? '' : 's'} ({semantics.length})
                          </Text>
                          {semantics.slice(0, 8).map((s) => (
                            <Text
                              key={s.name}
                              size="small"
                              tone="secondary"
                              as="span"
                              style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
                            >
                              {s.name}
                            </Text>
                          ))}
                          {semantics.length > 8 ? (
                            <Text size="small" tone="tertiary" as="span">
                              + {semantics.length - 8} more
                            </Text>
                          ) : null}
                        </Stack>
                      ) : null}
                      {primitives.length > 0 ? (
                        <Stack gap={2}>
                          <Text
                            size="small"
                            weight="semibold"
                            as="span"
                            style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
                          >
                            Aliased primitive{primitives.length === 1 ? '' : 's'} ({primitives.length})
                          </Text>
                          {primitives.map((p) => (
                            <Text
                              key={p.name}
                              size="small"
                              tone="secondary"
                              as="span"
                              style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
                            >
                              {p.name}
                            </Text>
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  )}
                </Stack>
              }
            >
              <div
                style={{
                  background: hex,
                  height: 36,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '4px 0',
                  width: '100%',
                  cursor: 'help',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: readableTextOn(hex),
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {stop}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </Stack>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const cardStyle: CSSProperties = {
    border: '1px solid var(--stroke-tertiary)',
    borderRadius: 8,
    padding: 16,
    background: 'var(--bg-elevated)',
  };
  return (
    <Grid columns="2fr 1fr 2fr" gap={16} align="center">
      <Stack gap={10} style={cardStyle}>
        <Row gap={6} align="center">
          <Pill size="sm" tone="info" active>Fiori</Pill>
          <Text size="small" tone="secondary" as="span">Main / sapBrandColor</Text>
        </Row>
        <BigSwatch hex="#0070F2" label="Belize Blue" sublabel="Default Horizon brand blue" />
      </Stack>

      <div style={{ textAlign: 'center', padding: 4 }}>
        <Text size="small" tone="tertiary">replace with</Text>
        <div style={{ fontSize: 26, lineHeight: '32px', color: 'var(--text-primary)', fontWeight: 700 }}>→</div>
        <Text size="small" tone="tertiary">brand-aligned</Text>
      </div>

      <Stack gap={10} style={cardStyle}>
        <Row gap={6} align="center">
          <Pill size="sm" tone="success" active>RDS 3.1</Pill>
          <Text size="small" tone="secondary" as="span">Brand/Blue/600 (Reltio Cobalt)</Text>
        </Row>
        <BigSwatch
          hex="#0000CC"
          label="Reltio Cobalt"
          sublabel="Brand primary across CTAs, links, info"
        />
      </Stack>
    </Grid>
  );
}

/* ---------- Mapping table ---------- */

function ThCell({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '6px 8px',
        borderBottom: '1px solid var(--stroke-tertiary)',
        fontWeight: 500,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
      }}
    >
      {children}
    </th>
  );
}

/**
 * Memoised row component. Receives only the *single* `rdsChoice` for its
 * token rather than the full `rdsChoices` map — that lets sibling rows
 * skip re-render entirely while one row is being color-picked, which is
 * the difference between a buttery picker and one that judders through
 * 899 row updates per frame.
 */
const MappingRowEl = memo(function MappingRowEl({
  m,
  mode,
  choice,
  rdsChoice,
  onChoose,
  onChooseRds,
  rdsGroups,
}: {
  m: Mapping;
  mode: Mode;
  choice: Source;
  /** This row's entry in the rdsChoices map (`''` if no override). */
  rdsChoice: string;
  onChoose: (token: string, src: Source) => void;
  onChooseRds: (token: string, id: string) => void;
  rdsGroups: { label: string; options: { value: string; label: string }[] }[];
}) {
  const td: CSSProperties = {
    borderTop: '1px solid var(--stroke-tertiary)',
    padding: '10px 8px',
    verticalAlign: 'middle',
  };
  const fioriHex = resolvedHex(m, mode, 'fiori');
  // Build the smallest possible RdsChoices argument — resolveRds only reads
  // `rdsChoices[m.fiori]`, so a single-entry object is equivalent to the
  // full map for this row's purposes.
  const rds = resolveRds(m, mode, rdsChoice ? { [m.fiori]: rdsChoice } : {});
  const rdsHex = rds.hex;
  const conf = computeConfidence(fioriHex, rdsHex);
  const isFiori = choice === 'fiori';
  const isRds = choice === 'rds';

  const suggestedHex = modeScheme(mode) === 'light' ? m.rdsLight : m.rdsDark;
  const suggestedLabel = `★ ${suggestedHex}`;
  const isBlended = rds.id.startsWith('#');
  const groups = [
    {
      label: 'Default',
      options: [{ value: '', label: suggestedLabel, hex: suggestedHex }],
    },
    ...(isBlended
      ? [
          {
            label: 'Custom',
            options: [
              {
                value: rds.id,
                label: `Blended midpoint · ${rds.id}`,
                hex: rds.id,
              },
            ],
          },
        ]
      : []),
    ...rdsGroups,
  ];

  return (
    <tr>
      <td style={mergeStyle(td, { paddingLeft: 0 })}>
        <Text
          size="small"
          weight="medium"
          as="span"
          style={{
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
          truncate
        >
          {m.fiori}
        </Text>
      </td>
      <td style={td}>
        <ColorCell hex={fioriHex} />
      </td>
      <td style={td}>
        <Row gap={8} align="center">
          <Chip hex={rdsHex} size={18} />
          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
              <Select<string>
                ariaLabel={`RDS color for ${m.fiori}`}
                value={rds.id}
                onChange={(id) => onChooseRds(m.fiori, id)}
                groups={groups}
                style={{ width: '100%', minWidth: 0, fontSize: 12, padding: '4px 8px' }}
                panelWidth={280}
              />
          </Stack>
        </Row>
      </td>
      <td style={td}>
        <EnhancedCell
          fioriHex={fioriHex}
          currentRdsHex={rdsHex}
          defaultRdsHex={suggestedHex}
          conf={conf.conf}
          isBlended={isBlended}
          onApply={(id) => onChooseRds(m.fiori, id)}
          onRemove={() => onChooseRds(m.fiori, '')}
        />
      </td>
      <td style={td}>
        <Row gap={4} align="center">
          <Pill
            size="sm"
            active={isFiori}
            tone={isFiori ? 'info' : 'neutral'}
            onClick={() => onChoose(m.fiori, 'fiori')}
            title="Keep the Fiori value"
          >
            Fiori
          </Pill>
          <Pill
            size="sm"
            active={isRds}
            tone={isRds ? 'success' : 'neutral'}
            onClick={() => onChoose(m.fiori, 'rds')}
            title="Use the RDS replacement"
          >
            RDS
          </Pill>
        </Row>
      </td>
      <td style={mergeStyle(td, { paddingRight: 0 })}>
        <ConfPill descriptor={conf} note={m.note} />
      </td>
    </tr>
  );
});

function EnhancedCell({
  fioriHex,
  currentRdsHex,
  defaultRdsHex,
  conf,
  isBlended,
  onApply,
  onRemove,
}: {
  fioriHex: string;
  currentRdsHex: string;
  /** The row's *default* RDS suggestion (m.rdsLight / m.rdsDark for the
   * current mode). Used as the reset target inside the color picker so
   * "Reset to suggested midpoint" stays stable regardless of dropdown picks
   * or applied blends. */
  defaultRdsHex: string;
  conf: Conf;
  isBlended: boolean;
  onApply: (blendedHex: string) => void;
  onRemove: () => void;
}) {
  // High-confidence rows with no blend applied have nothing to enhance.
  // (Users who really want a custom color can pick an alternate RDS or apply
  // one elsewhere; we keep the cell clean.)
  if (conf === 'high' && !isBlended) {
    return <Text size="small" tone="quaternary" as="span">—</Text>;
  }

  // Hex shown in the chip — either the applied blend (state 2) or the
  // proposed midpoint between Fiori and the currently-picked RDS (state 3).
  const proposedMidpoint = blendHex(fioriHex, currentRdsHex, 0.5).toUpperCase();
  const isProposalCollapsed =
    !isBlended &&
    (proposedMidpoint === currentRdsHex.toUpperCase() ||
      proposedMidpoint === fioriHex.toUpperCase());
  if (isProposalCollapsed) {
    return (
      <Text size="small" tone="tertiary" as="span">
        Already at the blend midpoint
      </Text>
    );
  }
  const chipHex = isBlended ? currentRdsHex.toUpperCase() : proposedMidpoint;
  // Reset-to-suggested target — the *original* midpoint between Fiori and
  // the default RDS suggestion. Independent of what the user has picked or
  // applied since.
  const originalMidpoint = blendHex(fioriHex, defaultRdsHex, 0.5).toUpperCase();
  const newDeltaE = Math.round(deltaE76(fioriHex, chipHex) * 10) / 10;
  const chipTooltip = isBlended
    ? `Edit applied color ${chipHex} (ΔE ${newDeltaE.toFixed(1)})`
    : `Edit suggested midpoint ${chipHex} — applies and drops ΔE to ${newDeltaE.toFixed(1)}`;

  return (
    <Row gap={8} align="center" style={{ minWidth: 0 }}>
      <Popover
        width={296}
        maxHeight={480}
        trigger={(_, toggle) => (
          <button
            type="button"
            onClick={toggle}
            title={chipTooltip}
            aria-label={isBlended ? 'Edit applied color' : 'Edit suggested color'}
            style={chipButtonStyle}
          >
            <Chip hex={chipHex} size={14} />
          </button>
        )}
      >
        {(close) => (
          <ColorPicker
            value={chipHex}
            onChange={onApply}
            suggestedHex={originalMidpoint}
            onRemove={
              isBlended
                ? () => {
                    onRemove();
                    close();
                  }
                : undefined
            }
            removeLabel="Remove blend"
            removeHelp="Revert to the suggested RDS color (no blend)"
          />
        )}
      </Popover>
      <Text
        size="small"
        weight="medium"
        as="span"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {chipHex}
      </Text>
      {isBlended ? (
        <button
          type="button"
          onClick={onRemove}
          title={`Remove blend ${chipHex} — revert to the suggested RDS color`}
          aria-label="Remove blend"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            padding: 0,
            background: 'var(--tone-danger-bg)',
            color: 'var(--tone-danger-text)',
            border: '1px solid var(--tone-danger-border)',
            borderRadius: 999,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg width={11} height={11} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M3 6h6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onApply(chipHex)}
          title={`Apply blended midpoint ${chipHex} — drops ΔE to ${newDeltaE.toFixed(1)}`}
          aria-label={`Add blended midpoint ${chipHex}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            padding: 0,
            background: 'var(--tone-success-bg)',
            color: 'var(--tone-success-text)',
            border: '1px solid var(--tone-success-border)',
            borderRadius: 999,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg width={11} height={11} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M6 3v6M3 6h6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </Row>
  );
}

/** Wraps the Enhanced chip as a clickable trigger that opens the color
 *  picker popover. Kept ghost-button-flat so it looks identical to the
 *  read-only chip the cell used to render. */
const chipButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  padding: 2,
  margin: -2,
  borderRadius: 4,
  cursor: 'pointer',
  flexShrink: 0,
};

function MappingTable({
  rows,
  mode,
  choices,
  rdsChoices,
  onChoose,
  onChooseRds,
  rdsGroups,
}: {
  rows: { category: string; items: Mapping[] }[];
  mode: Mode;
  choices: Choices;
  rdsChoices: RdsChoices;
  onChoose: (token: string, src: Source) => void;
  onChooseRds: (token: string, id: string) => void;
  rdsGroups: { label: string; options: { value: string; label: string }[] }[];
}) {
  return (
    <Stack gap={20}>
      {rows.map(({ category, items }) =>
        items.length === 0 ? null : (
          <Stack key={category} gap={8}>
            <Row gap={8} align="center">
              <H3>{category}</H3>
              <Pill size="sm">{items.length}</Pill>
            </Row>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ tableLayout: 'fixed', minWidth: 1180 }}>
                <colgroup>
                  <col />
                  <col style={{ width: '140px' }} />
                  <col style={{ width: '300px' }} />
                  <col style={{ width: '210px' }} />
                  <col style={{ width: '130px' }} />
                  <col style={{ width: '80px' }} />
                </colgroup>
                <thead>
                  <tr>
                    <ThCell>Fiori token</ThCell>
                    <ThCell>Fiori value</ThCell>
                    <ThCell>RDS suggestion</ThCell>
                    <ThCell>Enhanced suggestion</ThCell>
                    <ThCell>Choice</ThCell>
                    <ThCell>Conf.</ThCell>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m, i) => (
                    <MappingRowEl
                      key={i}
                      m={m}
                      mode={mode}
                      choice={getChoice(choices, m.fiori)}
                      rdsChoice={rdsChoices[m.fiori] ?? ''}
                      onChoose={onChoose}
                      onChooseRds={onChooseRds}
                      rdsGroups={rdsGroups}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Stack>
        ),
      )}
    </Stack>
  );
}

/* ---------- App ---------- */

export default function App() {
  const [appTheme, setAppTheme] = useAppTheme();
  const [mode, setMode] = useLocalStorage<Mode>('reltio.mode', 'morning');
  const [query, setQuery] = useLocalStorage<string>('reltio.query', '');
  const [activeCats, setActiveCats] = useLocalStorage<string[]>('reltio.cats', CATEGORIES);
  const [choices, setChoices] = useLocalStorage<Choices>('reltio.choices', {});
  const [rdsChoices, setRdsChoices] = useLocalStorage<RdsChoices>(
    'reltio.rdsChoices',
    {},
  );
  const [exportFormat, setExportFormat] = useLocalStorage<ExportFormat>(
    'reltio.exportFormat',
    'css',
  );
  const [paletteSource, setPaletteSource] = useLocalStorage<'rds' | 'fiori'>(
    'reltio.paletteSource',
    'rds',
  );
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const all = useMemo(() => allMappings(), []);
  const total = all.length;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      CATEGORIES.filter((c) => activeCats.includes(c)).map((cat) => {
        const items = SWAPS[cat].filter(
          (m) =>
            q === '' ||
            m.fiori.toLowerCase().includes(q) ||
            m.rds.toLowerCase().includes(q) ||
            m.fioriLight.toLowerCase().includes(q) ||
            m.rdsLight.toLowerCase().includes(q),
        );
        return { category: cat, items };
      }),
    [activeCats, q],
  );

  const visibleCount = filtered.reduce((s, x) => s + x.items.length, 0);
  const visibleTokens = useMemo(
    () => filtered.flatMap((c) => c.items.map((m) => m.fiori)),
    [filtered],
  );
  const fioriKept = all.filter((m) => getChoice(choices, m.fiori) === 'fiori').length;
  const rdsSwapped = total - fioriKept;

  const visibleAllRds =
    visibleTokens.length > 0 &&
    visibleTokens.every((t) => getChoice(choices, t) === 'rds');
  const visibleAllFiori =
    visibleTokens.length > 0 &&
    visibleTokens.every((t) => getChoice(choices, t) === 'fiori');

  const exportText = useMemo(
    () => buildExport(exportFormat, mode, choices, rdsChoices),
    [exportFormat, mode, choices, rdsChoices],
  );

  const rdsInternalIndex = useMemo(
    () => buildRdsInternalHexIndex(modeScheme(mode)),
    [mode],
  );
  const getRdsTokensForHex = useCallback(
    (hex: string) => rdsInternalIndex.get(hex.toUpperCase()) ?? [],
    [rdsInternalIndex],
  );
  const fioriHexIndex = useMemo(() => buildFioriHexIndex(mode), [mode]);
  const getFioriSiblingsForHex = useCallback(
    (hex: string) => fioriHexIndex.get(hex.toUpperCase()) ?? [],
    [fioriHexIndex],
  );

  const rdsGroups = useMemo(
    () =>
      rdsColorsByRamp().map(({ ramp, colors }) => ({
        label: ramp,
        options: colors.map((c) => ({
          value: c.id,
          label: `${c.stop} — ${c.hex}`,
          hex: c.hex,
        })),
      })),
    [],
  );

  const customRdsCount = useMemo(
    () => Object.values(rdsChoices).filter((v) => v).length,
    [rdsChoices],
  );

  const choose = useCallback(
    (token: string, src: Source) => {
      setChoices((prev) => ({ ...prev, [token]: src }));
    },
    [setChoices],
  );

  const chooseRds = useCallback(
    (token: string, id: string) => {
      setRdsChoices((prev) => {
        const next: RdsChoices = { ...prev };
        if (id) next[token] = id;
        else delete next[token];
        return next;
      });
      // If the user picked a concrete primitive, they almost certainly want
      // this row to use RDS — flip the source choice for them.
      if (id) setChoices((prev) => ({ ...prev, [token]: 'rds' }));
    },
    [setChoices, setRdsChoices],
  );

  const applyBulk = useCallback(
    (scope: 'visible' | 'all', src: Source) => {
      const tokens = scope === 'visible' ? visibleTokens : all.map((m) => m.fiori);
      setChoices((prev) => {
        const next: Choices = { ...prev };
        for (const t of tokens) next[t] = src;
        return next;
      });
    },
    [all, setChoices, visibleTokens],
  );

  const resetChoices = useCallback(() => {
    setChoices({});
    setRdsChoices({});
  }, [setChoices, setRdsChoices]);

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
    // Figma-script and JSON each get their own extension so users can tell the
    // download apart from a CSS theme sheet at a glance.
    const ext =
      exportFormat === 'json'
        ? 'json'
        : exportFormat === 'figma-script'
          ? 'js'
          : 'css';
    const stem =
      exportFormat === 'overrides'
        ? 'reltio-fiori-overrides'
        : exportFormat === 'figma-script'
          ? 'reltio-fiori-figma-apply'
          : 'reltio-fiori-tokens';
    const modeSuffix: Record<Mode, string> = {
      morning: 'morning',
      evening: 'evening',
      hcWhite: 'hc-white',
      hcBlack: 'hc-black',
    };
    const mime =
      ext === 'json'
        ? 'application/json'
        : ext === 'js'
          ? 'application/javascript'
          : 'text/css';
    const blob = new Blob([exportText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stem}.${modeSuffix[mode]}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportText, exportFormat, mode]);

  const [xlsxBusy, setXlsxBusy] = useState(false);
  const downloadXlsx = useCallback(async () => {
    setXlsxBusy(true);
    try {
      // Lazy-load the spreadsheet module (and its heavy XLSX dep) only when
      // the user actually requests an export. `downloadSpreadsheet` is async
      // because exceljs writes the workbook via a Promise — await it so the
      // busy flag stays on until the file actually downloads, and any thrown
      // errors surface in the console instead of becoming silent rejections.
      const mod = await import('./spreadsheet');
      await mod.downloadSpreadsheet(choices, rdsChoices);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Spreadsheet export failed:', err);
    } finally {
      setXlsxBusy(false);
    }
  }, [choices, rdsChoices]);

  return (
    <>
      <header className="app-header">
        <Text weight="semibold" as="span">Fiori → RDS 3.1 Color Mapper</Text>
        <Spacer />
        <Row gap={6} align="center">
          <Text size="small" tone="tertiary" as="span">App theme</Text>
          <Pill size="sm" active={appTheme === 'light'} onClick={() => setAppTheme('light')}>Light</Pill>
          <Pill size="sm" active={appTheme === 'dark'} onClick={() => setAppTheme('dark')}>Dark</Pill>
        </Row>
      </header>

      <main className="app-shell">
        <Stack gap={28}>
          <Stack gap={6}>
            <H1>Fiori → RDS 3.1 Color Migration Map</H1>
            <Text tone="secondary">
              Mapping SAP Fiori Horizon design tokens to Reltio Design System 3.1 colors. Use this to swap
              the Fiori library's color values (in code via CSS variables or in Figma via variable re-aliasing)
              so existing Fiori components inherit Reltio's brand. Your choices are saved to this browser.
            </Text>
            <Row gap={12} align="center" wrap>
              <Text size="small" tone="tertiary" as="span">Source files:</Text>
              <Link href="https://www.figma.com/design/tu2YE7Y6bmgkmcdIqCJpLk/Reltio-Design-System-3.1--LTS-?node-id=11396-44160">
                RDS 3.1 (LTS)
              </Link>
              <Link href="https://www.figma.com/design/XywZ3yPdXzBL4MnKbzP7uI/SAP-Fiori-for-Web-UI-Kit--Community-?node-id=23018-4781">
                SAP Fiori Web UI Kit
              </Link>
            </Row>
          </Stack>

          <Grid columns={4} gap={16}>
            <Stat value={total} label="Tokens mapped" />
            <Stat value={rdsSwapped} label="Using Reltio (RDS)" tone="success" />
            <Stat value={fioriKept} label="Keeping Fiori" tone="info" />
            <Stat value={visibleCount} label="Visible (filtered)" />
          </Grid>

          <Divider />

          <Stack gap={12}>
            <H2>Headline brand swap</H2>
            <Text tone="secondary">
              The signature change: Fiori's Belize Blue gives way to Reltio Cobalt. This single swap propagates
              to every Emphasized button, link, focus ring, selected state, and informational badge in the system.
            </Text>
            <Hero />
            <Callout tone="info" title="What you'll notice">
              <Text size="small">
                Reltio Cobalt (#0000CC) is deeper and more saturated than Fiori Belize (#0070F2). In the wild it
                will read cooler and darker on white backgrounds. Plan an accessibility/contrast pass on dense
                data screens.
              </Text>
            </Callout>
          </Stack>

          <Divider />

          <Stack gap={12}>
            <Row gap={10} align="center" wrap>
              <Select<'rds' | 'fiori'>
                ariaLabel="Design system palette"
                value={paletteSource}
                onChange={setPaletteSource}
                options={[
                  { value: 'rds', label: 'Reltio Design System 3.1 — palette' },
                  { value: 'fiori', label: 'SAP Fiori Horizon — palette' },
                ]}
                style={{ fontSize: 18, fontWeight: 600, padding: '8px 12px' }}
                panelWidth={320}
              />
            </Row>
            <Text tone="secondary">
              {paletteSource === 'rds'
                ? 'The full RDS primitive ramps. Every semantic token below resolves down to one of these.'
                : `Fiori Horizon design tokens grouped by category. Hover any swatch for the token name and hex. Values shown in ${modeLabel(mode)}.`}
            </Text>
            {paletteSource === 'rds' ? (
              <Grid columns={2} gap={16}>
                {Object.entries(RDS_RAMPS).map(([name, stops]) => (
                  <Ramp
                    key={name}
                    name={name}
                    stops={stops}
                    getRdsTokens={getRdsTokensForHex}
                  />
                ))}
              </Grid>
            ) : (
              <Grid columns={2} gap={16}>
                {Object.entries(SWAPS).map(([category, items]) => (
                  <FioriCategoryPalette
                    key={category}
                    name={category}
                    items={items}
                    mode={mode}
                    getSiblings={getFioriSiblingsForHex}
                  />
                ))}
              </Grid>
            )}
          </Stack>

          <Divider />

          <Stack gap={12}>
            <H2>Hot-swap mapping · choose your colors</H2>
            <Text tone="secondary">
              Each row pairs a Fiori token with its RDS replacement. Pick a specific RDS color from the dropdown
              in the `RDS suggestion` column to override the default suggestion — picking one auto-flips the row
              to use RDS, and a small `custom` tag appears under the hex. Use the `Fiori | RDS` toggle on the
              right to choose which side wins for that token. Bulk actions sit in the filter card; the live
              export updates below the table.
            </Text>
            {customRdsCount > 0 ? (
              <Text size="small" tone="tertiary">
                {customRdsCount} row{customRdsCount === 1 ? '' : 's'} using a custom RDS color.
                Click <code>Reset</code> in the bulk row to restore all suggested mappings.
              </Text>
            ) : null}

            <Card>
              <CardHeader>Filters & bulk actions</CardHeader>
              <CardBody>
                <Stack gap={12}>
                  <Row gap={12} align="center" wrap>
                    <Row gap={8} align="center">
                      <Text size="small" weight="medium" as="span">Mode</Text>
                      <Select<Mode>
                        ariaLabel="Fiori theme mode"
                        value={mode}
                        onChange={setMode}
                        options={MODES.map((m) => ({ value: m.id, label: m.label }))}
                        panelWidth={220}
                      />
                    </Row>
                    <Row gap={8} align="center">
                      <Text size="small" weight="medium" as="span">Category</Text>
                      <MultiSelect
                        selectedIds={activeCats}
                        onChange={setActiveCats}
                        options={CATEGORIES.map((c) => ({
                          id: c,
                          label: c,
                          count: SWAPS[c].length,
                        }))}
                      />
                    </Row>
                    <Spacer />
                    <div style={{ minWidth: 240, flex: '0 0 auto' }}>
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search token name or hex…"
                      />
                    </div>
                  </Row>
                  <Divider />
                  <Row gap={8} align="center" wrap>
                    <Text size="small" weight="medium" as="span" style={{ marginRight: 4 }}>Bulk</Text>
                    <Pill
                      size="sm"
                      tone="success"
                      active={visibleAllRds}
                      onClick={() => applyBulk('visible', 'rds')}
                      title={
                        visibleAllRds
                          ? 'All visible tokens are already using RDS'
                          : 'Set all currently visible tokens to use the RDS replacement'
                      }
                    >
                      Use RDS for visible ({visibleCount})
                    </Pill>
                    <Pill
                      size="sm"
                      tone="info"
                      active={visibleAllFiori}
                      onClick={() => applyBulk('visible', 'fiori')}
                      title={
                        visibleAllFiori
                          ? 'All visible tokens are already keeping Fiori'
                          : 'Keep Fiori for currently visible tokens'
                      }
                    >
                      Keep Fiori for visible ({visibleCount})
                    </Pill>
                    <Spacer />
                    <Pill
                      size="sm"
                      tone="deleted"
                      onClick={resetChoices}
                      title="Discard all per-row choices and return to the recommended default (RDS)"
                    >
                      Reset
                    </Pill>
                  </Row>
                </Stack>
              </CardBody>
            </Card>

            <MappingTable
              rows={filtered}
              mode={mode}
              choices={choices}
              rdsChoices={rdsChoices}
              onChoose={choose}
              onChooseRds={chooseRds}
              rdsGroups={rdsGroups}
            />
          </Stack>

          <Divider />

          <Stack gap={12}>
            <H2>Your final mapping</H2>
            <Text tone="secondary">
              Resolved values for every Fiori token using the choices you've made above. Token names stay as the
              Fiori names (`sapBrandColor`, `sapNegativeColor`, …) so existing UI5 bindings keep working — only
              the value behind each name changes.
            </Text>

            <Card>
              <CardHeader
                trailing={
                  <Row gap={4} align="center">
                    <Pill
                      size="sm"
                      tone="info"
                      active={exportFormat === 'css'}
                      onClick={() => setExportFormat('css')}
                    >
                      CSS (all)
                    </Pill>
                    <Pill
                      size="sm"
                      tone="info"
                      active={exportFormat === 'overrides'}
                      onClick={() => setExportFormat('overrides')}
                    >
                      CSS (overrides only)
                    </Pill>
                    <Pill
                      size="sm"
                      tone="info"
                      active={exportFormat === 'json'}
                      onClick={() => setExportFormat('json')}
                    >
                      JSON
                    </Pill>
                    <Pill
                      size="sm"
                      tone="info"
                      active={exportFormat === 'figma-script'}
                      onClick={() => setExportFormat('figma-script')}
                      title="Ready-to-paste JS for use_figma — preserves alpha/opacity end-to-end"
                    >
                      Figma script
                    </Pill>
                  </Row>
                }
              >
                Output · {modeLabel(mode)}
              </CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <Row gap={16} align="center" wrap>
                    <Row gap={6} align="center">
                      <Chip hex="var(--accent-primary)" size={10} />
                      <Text size="small" as="span">
                        <Text as="span" weight="semibold">{rdsSwapped}</Text> swapped to RDS
                      </Text>
                    </Row>
                    <Row gap={6} align="center">
                      <Chip hex="var(--text-tertiary)" size={10} />
                      <Text size="small" as="span">
                        <Text as="span" weight="semibold">{fioriKept}</Text> kept from Fiori
                      </Text>
                    </Row>
                    <Spacer />
                    <Row gap={6} align="center">
                      <Button onClick={copy} variant="secondary" title="Copy to clipboard">
                        {copyState === 'copied' ? 'Copied!' : copyState === 'error' ? 'Copy failed' : 'Copy'}
                      </Button>
                      <Button onClick={download} variant="secondary" title="Download as a single text file">
                        Download{' '}
                        {exportFormat === 'json'
                          ? 'JSON'
                          : exportFormat === 'figma-script'
                            ? 'JS'
                            : 'CSS'}
                      </Button>
                      <Button
                        onClick={downloadXlsx}
                        variant="primary"
                        disabled={xlsxBusy}
                        title={`Download an Excel workbook with one sheet per Fiori theme (${total} tokens × 4 modes) plus a summary and a custom-overrides sheet`}
                      >
                        {xlsxBusy ? 'Preparing…' : 'Download spreadsheet'}
                      </Button>
                    </Row>
                  </Row>
                  {exportFormat === 'overrides' && rdsSwapped === 0 ? (
                    <Callout tone="warning">
                      <Text size="small">
                        The override view is empty — you haven't swapped anything to RDS yet. Click `Use RDS for visible`
                        or flip individual rows above to populate it.
                      </Text>
                    </Callout>
                  ) : null}
                  <pre>{exportText}</pre>
                  <Text size="small" tone="tertiary">
                    `Copy` puts the block on your clipboard; `Download` saves it as a file named after the
                    current format and mode (e.g. `reltio-fiori-overrides.light.css`).
                  </Text>
                </Stack>
              </CardBody>
            </Card>

            <Callout tone="info" title="How to read each line">
              <Text size="small">
                CSS comments next to each token name show the provenance. `→ RDS Brand/Blue/600 (Reltio Cobalt)`
                means the value came from the RDS replacement. `kept from Fiori` means the original Horizon value
                is preserved. JSON output includes the same provenance under each token's `source` and
                `rdsReference` keys.
              </Text>
            </Callout>
          </Stack>

          <Divider />

          <Stack gap={12}>
            <H2>Open decisions for design review</H2>
            <Grid columns={3} gap={16}>
              <Card>
                <CardHeader>Warning hue</CardHeader>
                <CardBody>
                  <Stack gap={10}>
                    <Text size="small">
                      Fiori warning is amber-orange. Reltio's Warning token is gold. Two valid swaps with
                      different trade-offs.
                    </Text>
                    <Row gap={6} align="center">
                      <Chip hex="#E76500" />
                      <HexLabel hex="#E76500" />
                      <Text size="small" tone="tertiary" as="span">Fiori</Text>
                    </Row>
                    <Row gap={6} align="center">
                      <Chip hex="#EE6611" />
                      <HexLabel hex="#EE6611" />
                      <Text size="small" as="span">Orange/500 — perception-preserving</Text>
                    </Row>
                    <Row gap={6} align="center">
                      <Chip hex="#FFCC00" />
                      <HexLabel hex="#FFCC00" />
                      <Text size="small" as="span">Gold/500 — Reltio brand-aligned</Text>
                    </Row>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>Success green</CardHeader>
                <CardBody>
                  <Stack gap={10}>
                    <Text size="small">
                      Fiori uses forest green; RDS Emerald is teal-leaning. Mapping is unambiguous but the feel
                      will shift slightly cooler.
                    </Text>
                    <Row gap={6} align="center">
                      <Chip hex="#256F3A" />
                      <HexLabel hex="#256F3A" />
                      <Text size="small" tone="tertiary" as="span">Fiori sapSuccessColor</Text>
                    </Row>
                    <Row gap={6} align="center">
                      <Chip hex="#2F6A52" />
                      <HexLabel hex="#2F6A52" />
                      <Text size="small" as="span">Green-Emerald/700 (Success/Border)</Text>
                    </Row>
                    <Row gap={6} align="center">
                      <Chip hex="#449977" />
                      <HexLabel hex="#449977" />
                      <Text size="small" as="span">Green-Emerald/600 (Success/Default)</Text>
                    </Row>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>Link vs CTA blue</CardHeader>
                <CardBody>
                  <Stack gap={10}>
                    <Text size="small">
                      RDS distinguishes links (Blue/400) from CTA buttons (Blue/600). Fiori uses the same blue
                      for both. Decide whether to keep the differentiation.
                    </Text>
                    <Row gap={6} align="center">
                      <Chip hex="#3333FF" />
                      <HexLabel hex="#3333FF" />
                      <Text size="small" as="span">Blue/400 — RDS link blue</Text>
                    </Row>
                    <Row gap={6} align="center">
                      <Chip hex="#0000CC" />
                      <HexLabel hex="#0000CC" />
                      <Text size="small" as="span">Blue/600 — Cobalt (matches buttons)</Text>
                    </Row>
                  </Stack>
                </CardBody>
              </Card>
            </Grid>
          </Stack>

          <Divider />

          <Stack gap={8}>
            <H2>Delivery checklist</H2>
            <Text tone="secondary">
              A pragmatic rollout path. Items are independent — pick the order that matches your team's risk
              appetite.
            </Text>
            <Stack gap={4}>
              <Text>1. Grep the Reltio codebase for `--sap*` usages to size the actual override sheet.</Text>
              <Text>2. Author `reltio-fiori-theme.css` setting each Horizon CSS variable to the RDS hex from this map.</Text>
              <Text>3. In Figma, re-alias the Horizon collection's variables to the RDS primitives — at least for Morning + Evening modes.</Text>
              <Text>4. QA sweep: charts, status messaging, focus rings, top shell, and any inline UI5 SVGs with baked-in hex.</Text>
              <Text>5. Run an accessibility/contrast audit — Cobalt-on-white is fine, but dense dashboards deserve a closer look.</Text>
            </Stack>
            <Text size="small" tone="tertiary">
              Source: extracted from RDS 3.1 LTS and SAP Fiori for Web UI Kit (Community) via the Figma MCP on 2026-05-19.
            </Text>
          </Stack>
        </Stack>
      </main>
    </>
  );
}
