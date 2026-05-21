/**
 * ColorPicker — Figma-style HSV(A) color picker used inside the Enhanced
 * suggestion cell.
 *
 *  Layout
 *  ──────
 *    ┌──────────────────────────────────────┐
 *    │                                      │
 *    │              SV PAD                  │
 *    │                                      │
 *    └──────────────────────────────────────┘
 *         ┌──[ ===== hue ===== ]
 *    [🎨]─┤
 *         └──[ ==== opacity == ]
 *    [Hex ▾]  [hex / r g b / h s l]   [α%]
 *    ─────────────────────────────────────
 *    [Reset to suggested ↩]   [Remove blend]
 *
 *  Performance
 *  ───────────
 *    The host table re-renders one row per `onChange` call, which already
 *    skips the other 898 rows thanks to `React.memo`. To stay buttery
 *    during pad/slider drags (60 Hz pointer events) we coalesce calls
 *    into one per animation frame using `requestAnimationFrame`. The
 *    picker's own state updates immediately so the thumb tracks the
 *    pointer without perceptible delay.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Row, Stack, Text } from './ui';

type HSVA = { h: number; s: number; v: number; a: number };
type Format = 'hex' | 'rgb' | 'hsl';

const SV_W = 240;
const SV_H = 180;
const SLIDER_W = 192;
const SLIDER_H = 14;
const EYEDROP_BTN = 36;

/* ─── color math ──────────────────────────────────────────────────────── */

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const clamp01 = (n: number) => clamp(n, 0, 1);

function parseHex(hex: string): { r: number; g: number; b: number; a: number } {
  const v = (hex || '').replace('#', '').toUpperCase();
  if (v.length === 3) {
    return {
      r: parseInt(v[0] + v[0], 16),
      g: parseInt(v[1] + v[1], 16),
      b: parseInt(v[2] + v[2], 16),
      a: 1,
    };
  }
  if (v.length === 6) {
    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
      a: 1,
    };
  }
  if (v.length === 8) {
    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
      a: parseInt(v.slice(6, 8), 16) / 255,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const h = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  if (a >= 0.999) return `#${h(r)}${h(g)}${h(b)}`;
  return `#${h(r)}${h(g)}${h(b)}${h(a * 255)}`;
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hh < 1) { r = c; g = x; }
  else if (hh < 2) { r = x; g = c; }
  else if (hh < 3) { g = c; b = x; }
  else if (hh < 4) { g = x; b = c; }
  else if (hh < 5) { r = x; b = c; }
  else { r = c; b = x; }
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l < 0.5 ? d / (max + min) : d / (2 - max - min);
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const conv = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const hn = h / 360;
  return [conv(hn + 1 / 3) * 255, conv(hn) * 255, conv(hn - 1 / 3) * 255];
}

function hsvaToHex(hsva: HSVA): string {
  const [r, g, b] = hsvToRgb(hsva.h, hsva.s, hsva.v);
  return rgbaToHex(r, g, b, hsva.a);
}

function hexToHsva(hex: string): HSVA {
  const { r, g, b, a } = parseHex(hex);
  const { h, s, v } = rgbToHsv(r, g, b);
  return { h, s, v, a };
}

function sameHex(a: string, b: string): boolean {
  const norm = (h: string) => h.replace('#', '').toUpperCase();
  return norm(a) === norm(b);
}

/* ─── EyeDropper API ───────────────────────────────────────────────────── */

interface EyeDropperResult { sRGBHex: string }
interface EyeDropperLike { open(): Promise<EyeDropperResult> }
function getEyeDropper(): EyeDropperLike | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const W = window as any;
  if (typeof W.EyeDropper !== 'function') return null;
  return new W.EyeDropper();
}

/* ─── component ───────────────────────────────────────────────────────── */

export function ColorPicker({
  value,
  onChange,
  suggestedHex,
  onRemove,
  removeLabel = 'Remove',
  removeHelp,
}: {
  value: string;
  onChange: (hex: string) => void;
  suggestedHex?: string;
  onRemove?: () => void;
  removeLabel?: string;
  removeHelp?: string;
}) {
  const [hsva, setHsva] = useState<HSVA>(() => hexToHsva(value));
  const [format, setFormat] = useState<Format>('hex');

  /* Display strings — kept independent of `hsva` so the user can type
   * partial values without the field re-formatting under their cursor.
   * Drag/format-change/external-sync refresh them in lockstep. */
  const [inputs, setInputs] = useState(() => buildInputs(hexToHsva(value)));

  /* ── one place that recomputes every visible string field from HSVA ── */
  const refreshInputs = useCallback((h: HSVA) => {
    setInputs(buildInputs(h));
  }, []);

  /* Sync internal state when the host changes `value` externally. */
  useEffect(() => {
    if (!sameHex(value, hsvaToHex(hsva))) {
      const next = hexToHsva(value);
      setHsva(next);
      refreshInputs(next);
    }
    // hsva intentionally omitted — sync on `value` changes only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* ── rAF-batched commit to the parent (smooths drag) ────────────── */
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const rafIdRef = useRef<number | null>(null);
  const pendingHexRef = useRef<string | null>(null);
  const flushCommit = useCallback(() => {
    rafIdRef.current = null;
    const h = pendingHexRef.current;
    pendingHexRef.current = null;
    if (h != null) onChangeRef.current(h);
  }, []);
  const scheduleCommit = useCallback(
    (hex: string) => {
      pendingHexRef.current = hex;
      if (rafIdRef.current != null) return;
      rafIdRef.current = window.requestAnimationFrame(flushCommit);
    },
    [flushCommit],
  );
  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) {
        window.cancelAnimationFrame(rafIdRef.current);
        flushCommit();
      }
    };
  }, [flushCommit]);

  /* ── single source-of-truth commit helper ──────────────────────── */
  const commitHsva = useCallback(
    (next: HSVA, opts: { refresh?: boolean } = { refresh: true }) => {
      setHsva(next);
      if (opts.refresh !== false) refreshInputs(next);
      scheduleCommit(hsvaToHex(next));
    },
    [refreshInputs, scheduleCommit],
  );

  /* ── SV pad drag ───────────────────────────────────────────────── */
  const svRef = useRef<HTMLDivElement>(null);
  function onSvDown(e: React.PointerEvent<HTMLDivElement>): void {
    const el = svRef.current;
    if (!el) return;
    e.preventDefault();
    const moveTo = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      const x = clamp01((clientX - r.left) / r.width);
      const y = clamp01((clientY - r.top) / r.height);
      commitHsva({ ...hsva, s: x, v: 1 - y });
    };
    moveTo(e.clientX, e.clientY);
    const onMove = (ev: PointerEvent) => moveTo(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  /* ── Hue slider drag ───────────────────────────────────────────── */
  const hueRef = useRef<HTMLDivElement>(null);
  function onHueDown(e: React.PointerEvent<HTMLDivElement>): void {
    const el = hueRef.current;
    if (!el) return;
    e.preventDefault();
    const moveTo = (clientX: number) => {
      const r = el.getBoundingClientRect();
      const x = clamp01((clientX - r.left) / r.width);
      commitHsva({ ...hsva, h: x * 360 });
    };
    moveTo(e.clientX);
    const onMove = (ev: PointerEvent) => moveTo(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  /* ── Opacity slider drag ───────────────────────────────────────── */
  const alphaRef = useRef<HTMLDivElement>(null);
  function onAlphaDown(e: React.PointerEvent<HTMLDivElement>): void {
    const el = alphaRef.current;
    if (!el) return;
    e.preventDefault();
    const moveTo = (clientX: number) => {
      const r = el.getBoundingClientRect();
      const x = clamp01((clientX - r.left) / r.width);
      commitHsva({ ...hsva, a: x });
    };
    moveTo(e.clientX);
    const onMove = (ev: PointerEvent) => moveTo(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  /* ── text input handlers ───────────────────────────────────────── */
  function onHexChange(raw: string): void {
    const v = raw.replace(/[^a-fA-F0-9]/g, '').slice(0, 8).toUpperCase();
    setInputs((p) => ({ ...p, hex: v }));
    if (v.length === 6 || v.length === 8 || v.length === 3) {
      // Only commit on valid lengths so typing intermediate states (e.g.
      // "FF0" while reaching for "FF00FF") doesn't trash the color.
      commitHsva(hexToHsva('#' + v), { refresh: false });
    }
  }

  function onRgbChange(channel: 'r' | 'g' | 'b', raw: string): void {
    const v = raw.replace(/[^0-9]/g, '').slice(0, 3);
    setInputs((p) => ({ ...p, [channel]: v }));
    const n = parseInt(v, 10);
    if (Number.isFinite(n) && n >= 0 && n <= 255) {
      const r = channel === 'r' ? n : parseInt(inputs.r, 10) || 0;
      const g = channel === 'g' ? n : parseInt(inputs.g, 10) || 0;
      const b = channel === 'b' ? n : parseInt(inputs.b, 10) || 0;
      const hsv = rgbToHsv(r, g, b);
      commitHsva({ ...hsva, h: hsv.h, s: hsv.s, v: hsv.v }, { refresh: false });
    }
  }

  function onHslChange(channel: 'h' | 's' | 'l', raw: string): void {
    const v = raw.replace(/[^0-9]/g, '').slice(0, 3);
    setInputs((p) => ({ ...p, [channel]: v }));
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) return;
    const hMax = channel === 'h' ? 360 : 100;
    if (n < 0 || n > hMax) return;
    const hueV = channel === 'h' ? n : parseInt(inputs.h, 10) || 0;
    const satV = channel === 's' ? n : parseInt(inputs.s, 10) || 0;
    const litV = channel === 'l' ? n : parseInt(inputs.l, 10) || 0;
    const [r, g, b] = hslToRgb(hueV, satV / 100, litV / 100);
    const hsv = rgbToHsv(r, g, b);
    commitHsva({ ...hsva, h: hsv.h, s: hsv.s, v: hsv.v }, { refresh: false });
  }

  function onAlphaInput(raw: string): void {
    const v = raw.replace(/[^0-9]/g, '').slice(0, 3);
    setInputs((p) => ({ ...p, a: v }));
    const n = parseInt(v, 10);
    if (Number.isFinite(n) && n >= 0 && n <= 100) {
      commitHsva({ ...hsva, a: n / 100 }, { refresh: false });
    }
  }

  /* ── eyedropper ─────────────────────────────────────────────────── */
  const ed = getEyeDropper();
  async function onEyeDropper(): Promise<void> {
    if (!ed) return;
    try {
      const r = await ed.open();
      const next = hexToHsva(r.sRGBHex);
      commitHsva(next);
    } catch {
      /* user cancelled — no-op */
    }
  }

  /* ── derived styles ─────────────────────────────────────────────── */
  const huePure = `hsl(${hsva.h}, 100%, 50%)`;
  const [cR, cG, cB] = hsvToRgb(hsva.h, hsva.s, hsva.v);
  const currentHex = hsvaToHex(hsva);
  const opaqueHex = rgbaToHex(cR, cG, cB, 1);
  const rgbaCss = `rgba(${Math.round(cR)}, ${Math.round(cG)}, ${Math.round(cB)}, ${hsva.a.toFixed(2)})`;

  const svStyle: CSSProperties = {
    position: 'relative',
    width: SV_W,
    height: SV_H,
    borderRadius: 6,
    backgroundImage: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${huePure})`,
    cursor: 'crosshair',
    userSelect: 'none',
    touchAction: 'none',
    border: '1px solid var(--stroke-secondary)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };
  const svThumbStyle: CSSProperties = {
    position: 'absolute',
    left: `${hsva.s * 100}%`,
    top: `${(1 - hsva.v) * 100}%`,
    width: 14,
    height: 14,
    transform: 'translate(-50%, -50%)',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)',
    borderRadius: '50%',
    pointerEvents: 'none',
    background: opaqueHex,
    boxSizing: 'border-box',
  };
  const hueStyle: CSSProperties = {
    position: 'relative',
    width: SLIDER_W,
    height: SLIDER_H,
    borderRadius: 999,
    background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
    cursor: 'ew-resize',
    userSelect: 'none',
    touchAction: 'none',
    boxSizing: 'border-box',
  };
  // Two 45°-rotated linear-gradients staggered by half a tile give the
  // classic Photoshop-style transparency checker. We have to inline the
  // pattern in the `background:` shorthand so the `0 0/8px 8px` and
  // `4px 4px/8px 8px` parts survive — using the CSS variable through
  // `background-image` drops the position/size and the pattern collapses
  // into a solid wash.
  const checkerTile = '#c5c7cd';
  const checkerBase = '#ffffff';
  const checker =
    `linear-gradient(45deg, ${checkerTile} 25%, transparent 25%, transparent 75%, ${checkerTile} 75%) 0 0/8px 8px,` +
    `linear-gradient(45deg, ${checkerTile} 25%, transparent 25%, transparent 75%, ${checkerTile} 75%) 4px 4px/8px 8px`;
  const alphaStyle: CSSProperties = {
    position: 'relative',
    width: SLIDER_W,
    height: SLIDER_H,
    borderRadius: 999,
    background:
      `linear-gradient(to right, rgba(255,255,255,0), ${opaqueHex}),` +
      `${checker},` +
      `${checkerBase}`,
    cursor: 'ew-resize',
    userSelect: 'none',
    touchAction: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 0 1px var(--stroke-secondary)',
  };

  const thumbBase = (left: string, bg: string): CSSProperties => ({
    position: 'absolute',
    left,
    top: '50%',
    width: 14,
    height: 14,
    transform: 'translate(-50%, -50%)',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)',
    borderRadius: '50%',
    pointerEvents: 'none',
    background: bg,
    boxSizing: 'border-box',
  });

  const iconBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: EYEDROP_BTN,
    height: EYEDROP_BTN,
    padding: 0,
    background: 'var(--bg-primary)',
    border: '1px solid var(--stroke-secondary)',
    borderRadius: 6,
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    flexShrink: 0,
  };

  const showReset = suggestedHex && !sameHex(suggestedHex, currentHex);
  const showRemove = !!onRemove;

  return (
    <Stack gap={10}>
      {/* SV pad */}
      <div
        ref={svRef}
        onPointerDown={onSvDown}
        style={svStyle}
        aria-label="Saturation and brightness"
      >
        <div style={svThumbStyle} />
      </div>

      {/* Eyedropper + stacked hue/opacity sliders */}
      <Row gap={10} align="center">
        {ed ? (
          <button
            type="button"
            onClick={onEyeDropper}
            title="Pick a color from anywhere on the screen"
            aria-label="Pick a color from the screen"
            style={iconBtnStyle}
          >
            <EyedropperIcon />
          </button>
        ) : (
          <div style={{ width: EYEDROP_BTN, flexShrink: 0 }} aria-hidden />
        )}
        <Stack gap={8} style={{ flex: 1, minWidth: 0 }}>
          <div
            ref={hueRef}
            onPointerDown={onHueDown}
            style={hueStyle}
            aria-label="Hue"
          >
            <div style={thumbBase(`${(hsva.h / 360) * 100}%`, huePure)} />
          </div>
          <div
            ref={alphaRef}
            onPointerDown={onAlphaDown}
            style={alphaStyle}
            aria-label="Opacity"
          >
            <div style={thumbBase(`${hsva.a * 100}%`, currentHex)} />
          </div>
        </Stack>
      </Row>

      {/* Format dropdown + value inputs + opacity input */}
      <Row gap={6} align="center">
        <FormatSelect value={format} onChange={setFormat} />
        <div style={inputGroupStyle}>
          {format === 'hex' && (
            <>
              <span style={prefixStyle}>#</span>
              <input
                type="text"
                value={inputs.hex}
                onChange={(e) => onHexChange(e.target.value)}
                maxLength={8}
                spellCheck={false}
                aria-label="Hex value"
                style={textInputStyle}
              />
            </>
          )}
          {format === 'rgb' && (
            <>
              <NumberInput
                value={inputs.r}
                onChange={(v) => onRgbChange('r', v)}
                aria-label="Red"
                max={255}
              />
              <Divider />
              <NumberInput
                value={inputs.g}
                onChange={(v) => onRgbChange('g', v)}
                aria-label="Green"
                max={255}
              />
              <Divider />
              <NumberInput
                value={inputs.b}
                onChange={(v) => onRgbChange('b', v)}
                aria-label="Blue"
                max={255}
              />
            </>
          )}
          {format === 'hsl' && (
            <>
              <NumberInput
                value={inputs.h}
                onChange={(v) => onHslChange('h', v)}
                aria-label="Hue"
                max={360}
                suffix="°"
              />
              <Divider />
              <NumberInput
                value={inputs.s}
                onChange={(v) => onHslChange('s', v)}
                aria-label="Saturation"
                max={100}
                suffix="%"
              />
              <Divider />
              <NumberInput
                value={inputs.l}
                onChange={(v) => onHslChange('l', v)}
                aria-label="Lightness"
                max={100}
                suffix="%"
              />
            </>
          )}
        </div>
        <div style={alphaInputWrapStyle}>
          <input
            type="text"
            value={inputs.a}
            onChange={(e) => onAlphaInput(e.target.value)}
            maxLength={3}
            spellCheck={false}
            aria-label="Opacity"
            style={alphaTextInputStyle}
          />
          <span style={{ ...prefixStyle, paddingLeft: 0 }}>%</span>
        </div>
      </Row>

      {/* CSS preview row — useful when picking a non-opaque color */}
      {hsva.a < 0.999 && (
        <Text size="small" tone="quaternary" as="span" style={{ fontFamily: 'var(--font-mono)' }}>
          {rgbaCss}
        </Text>
      )}

      {(showReset || showRemove) && (
        <Row justify="space-between" align="center" gap={8} wrap>
          {showReset ? (
            <button
              type="button"
              onClick={() => commitHsva(hexToHsva(suggestedHex!))}
              title={`Reset to the suggested midpoint ${suggestedHex!.toUpperCase()}`}
              style={resetLinkStyle}
            >
              Reset to {suggestedHex!.toUpperCase()}
            </button>
          ) : (
            <span />
          )}
          {showRemove && (
            <button
              type="button"
              onClick={onRemove}
              title={removeHelp ?? 'Remove the applied color'}
              style={removeBtnStyle}
            >
              {removeLabel}
            </button>
          )}
        </Row>
      )}
    </Stack>
  );
}

/* ─── small helpers ───────────────────────────────────────────────────── */

type Inputs = {
  hex: string;
  r: string; g: string; b: string;
  h: string; s: string; l: string;
  a: string;
};

function buildInputs(hsva: HSVA): Inputs {
  const [r, g, b] = hsvToRgb(hsva.h, hsva.s, hsva.v);
  const hsl = rgbToHsl(r, g, b);
  return {
    hex: hsvaToHex(hsva).replace('#', ''),
    r: String(Math.round(r)),
    g: String(Math.round(g)),
    b: String(Math.round(b)),
    h: String(Math.round(hsva.h)),
    s: String(Math.round(hsl.s * 100)),
    l: String(Math.round(hsl.l * 100)),
    a: String(Math.round(hsva.a * 100)),
  };
}

function FormatSelect({
  value,
  onChange,
}: {
  value: Format;
  onChange: (next: Format) => void;
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        height: EYEDROP_BTN,
        alignItems: 'center',
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Format)}
        aria-label="Color format"
        style={{
          appearance: 'none',
          background: 'var(--bg-primary)',
          border: '1px solid var(--stroke-secondary)',
          borderRadius: 6,
          padding: '0 22px 0 10px',
          height: EYEDROP_BTN,
          color: 'var(--text-primary)',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="hex">Hex</option>
        <option value="rgb">RGB</option>
        <option value="hsl">HSL</option>
      </select>
      <svg
        aria-hidden
        width="10"
        height="10"
        viewBox="0 0 10 10"
        style={{
          position: 'absolute',
          right: 8,
          pointerEvents: 'none',
          color: 'var(--text-tertiary)',
        }}
      >
        <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  max,
  suffix,
  ...rest
}: {
  value: string;
  onChange: (next: string) => void;
  max: number;
  suffix?: string;
  'aria-label'?: string;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        paddingLeft: 8,
        paddingRight: suffix ? 6 : 8,
        gap: 1,
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={String(max).length}
        spellCheck={false}
        style={{
          flex: 1,
          minWidth: 0,
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: 0,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: 0.5,
          textAlign: 'center',
          outline: 'none',
        }}
        {...rest}
      />
      {suffix ? (
        <span
          style={{
            color: 'var(--text-quaternary)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
          }}
        >
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      style={{
        width: 1,
        height: 18,
        background: 'var(--stroke-secondary)',
        flexShrink: 0,
      }}
    />
  );
}

/* ─── inline styles ───────────────────────────────────────────────────── */

const inputGroupStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  background: 'var(--bg-primary)',
  border: '1px solid var(--stroke-secondary)',
  borderRadius: 6,
  height: EYEDROP_BTN,
  overflow: 'hidden',
};

const alphaInputWrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  width: 64,
  height: EYEDROP_BTN,
  background: 'var(--bg-primary)',
  border: '1px solid var(--stroke-secondary)',
  borderRadius: 6,
  paddingLeft: 8,
  paddingRight: 8,
  gap: 2,
  flexShrink: 0,
};

const textInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  background: 'transparent',
  border: 'none',
  padding: 0,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  outline: 'none',
};

const alphaTextInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  width: '100%',
  background: 'transparent',
  border: 'none',
  padding: 0,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  letterSpacing: 0.5,
  textAlign: 'center',
  outline: 'none',
};

const prefixStyle: CSSProperties = {
  paddingLeft: 8,
  paddingRight: 4,
  color: 'var(--text-quaternary)',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  pointerEvents: 'none',
};

const resetLinkStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--accent-primary)',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 500,
  padding: 0,
  textDecoration: 'underline',
  textUnderlineOffset: 2,
};

const removeBtnStyle: CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--tone-danger-border)',
  color: 'var(--tone-danger-text)',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 500,
  padding: '4px 10px',
  borderRadius: 6,
};

function EyedropperIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 3a3 3 0 0 1 2.121 5.121l-1.06 1.06 2.121 2.122-1.414 1.414-2.122-2.121-7.071 7.07A2.5 2.5 0 0 1 7.5 18H6l-1.5 1.5L3 18l1.5-1.5V15a2.5 2.5 0 0 1 .732-1.768l7.07-7.07-2.12-2.122 1.413-1.414 2.122 2.121L14.379 3.879A3 3 0 0 1 16.5 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
