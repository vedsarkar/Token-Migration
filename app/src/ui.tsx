/**
 * Minimal UI primitives — recreates the shape of the cursor/canvas API used by
 * the original .canvas.tsx so App logic ports cleanly. Plain inline styles
 * backed by CSS custom properties from styles.css.
 */
import type { CSSProperties, ReactNode } from 'react';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* ---------- Utilities ---------- */

export function mergeStyle(
  base: CSSProperties,
  override?: CSSProperties,
): CSSProperties {
  return { ...base, ...(override ?? {}) };
}

/* ---------- Layout ---------- */

export function Stack({
  children,
  gap = 8,
  style,
}: {
  children?: ReactNode;
  gap?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={mergeStyle(
        { display: 'flex', flexDirection: 'column', gap, minWidth: 0 },
        style,
      )}
    >
      {children}
    </div>
  );
}

export function Row({
  children,
  gap = 8,
  align = 'start',
  justify = 'start',
  wrap = false,
  style,
}: {
  children?: ReactNode;
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  wrap?: boolean;
  style?: CSSProperties;
}) {
  const alignMap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' } as const;
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    'space-between': 'space-between',
  } as const;
  return (
    <div
      style={mergeStyle(
        {
          display: 'flex',
          flexDirection: 'row',
          gap,
          alignItems: alignMap[align],
          justifyContent: justifyMap[justify],
          flexWrap: wrap ? 'wrap' : 'nowrap',
          minWidth: 0,
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export function Grid({
  children,
  columns,
  gap = 12,
  align = 'stretch',
  style,
}: {
  children?: ReactNode;
  columns: number | string;
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  style?: CSSProperties;
}) {
  const alignMap = { start: 'start', center: 'center', end: 'end', stretch: 'stretch' } as const;
  const gridTemplate =
    typeof columns === 'number'
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;
  return (
    <div
      style={mergeStyle(
        {
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          gap,
          alignItems: alignMap[align],
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export function Spacer() {
  return <div style={{ flex: '1 1 auto' }} />;
}

export function Divider({ style }: { style?: CSSProperties } = {}) {
  return (
    <div
      style={mergeStyle(
        {
          height: 1,
          background: 'var(--stroke-tertiary)',
          width: '100%',
        },
        style,
      )}
    />
  );
}

/* ---------- Typography ---------- */

export function H1({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <h1
      style={mergeStyle(
        {
          fontSize: 24,
          lineHeight: '30px',
          fontWeight: 600,
          margin: 0,
          color: 'var(--text-primary)',
        },
        style,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <h2
      style={mergeStyle(
        {
          fontSize: 18,
          lineHeight: '24px',
          fontWeight: 600,
          margin: 0,
          color: 'var(--text-primary)',
        },
        style,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <h3
      style={mergeStyle(
        {
          fontSize: 15,
          lineHeight: '20px',
          fontWeight: 600,
          margin: 0,
          color: 'var(--text-primary)',
        },
        style,
      )}
    >
      {children}
    </h3>
  );
}

type TextTone = 'primary' | 'secondary' | 'tertiary' | 'quaternary';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Body text. Renders `<p>` at the top level and switches to `<span>` when nested
 * inside another `<Text>`. Parses inline backticks into `<code>` spans.
 */
export function Text({
  children,
  tone = 'primary',
  size = 'body',
  as,
  weight = 'normal',
  italic,
  style,
}: {
  children?: ReactNode;
  tone?: TextTone;
  size?: 'body' | 'small';
  as?: 'p' | 'span';
  weight?: TextWeight;
  italic?: boolean;
  truncate?: boolean | 'start' | 'end';
  style?: CSSProperties;
}) {
  const toneVar: Record<TextTone, string> = {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    quaternary: 'var(--text-quaternary)',
  };
  const weightMap: Record<TextWeight, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  const Tag = (as ?? 'p') as 'p' | 'span';
  const styles: CSSProperties = {
    margin: 0,
    color: toneVar[tone],
    fontSize: size === 'small' ? 12 : 14,
    lineHeight: size === 'small' ? '16px' : '20px',
    fontWeight: weightMap[weight],
    fontStyle: italic ? 'italic' : 'normal',
    ...style,
  };

  return <Tag style={styles}>{parseInlineMarkdown(children)}</Tag>;
}

/**
 * Lightweight inline parser that converts `…` backticks into <code> spans. We
 * intentionally do not parse links / bold / italics — keep the surface tiny.
 */
function parseInlineMarkdown(children: ReactNode): ReactNode {
  if (typeof children !== 'string') return children;
  const parts = children.split('`');
  if (parts.length === 1) return children;
  return parts.map((p, i) =>
    i % 2 === 0 ? (
      <Fragment key={i}>{p}</Fragment>
    ) : (
      <code key={i}>{p}</code>
    ),
  );
}

export function Link({
  children,
  href,
  style,
}: {
  children?: ReactNode;
  href: string;
  style?: CSSProperties;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" style={style}>
      {children}
    </a>
  );
}

/* ---------- Surfaces ---------- */

export function Card({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={mergeStyle(
        {
          background: 'var(--bg-elevated)',
          border: '1px solid var(--stroke-tertiary)',
          borderRadius: 8,
          overflow: 'hidden',
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  trailing,
  style,
}: {
  children?: ReactNode;
  trailing?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={mergeStyle(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '8px 14px',
          borderBottom: '1px solid var(--stroke-tertiary)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          background: 'var(--fill-quaternary)',
          minHeight: 32,
        },
        style,
      )}
    >
      <span>{children}</span>
      {trailing != null && <span style={{ display: 'flex', alignItems: 'center' }}>{trailing}</span>}
    </div>
  );
}

export function CardBody({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={mergeStyle({ padding: 14 }, style)}>{children}</div>
  );
}

/* ---------- Pills, Stats, Buttons ---------- */

export type PillTone = 'neutral' | 'success' | 'warning' | 'info' | 'deleted';

export function Pill({
  children,
  active,
  tone = 'neutral',
  size = 'sm',
  onClick,
  disabled,
  title,
  leadingContent,
  style,
}: {
  children?: ReactNode;
  active?: boolean;
  tone?: PillTone;
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  leadingContent?: ReactNode;
  style?: CSSProperties;
}) {
  const toneMap: Record<PillTone, { fg: string; bg: string; border: string }> = {
    neutral: {
      fg: 'var(--text-secondary)',
      bg: 'transparent',
      border: 'var(--stroke-primary)',
    },
    success: {
      fg: 'var(--tone-success-text)',
      bg: 'var(--tone-success-bg)',
      border: 'var(--tone-success-border)',
    },
    warning: {
      fg: 'var(--tone-warning-text)',
      bg: 'var(--tone-warning-bg)',
      border: 'var(--tone-warning-border)',
    },
    info: {
      fg: 'var(--tone-info-text)',
      bg: 'var(--tone-info-bg)',
      border: 'var(--tone-info-border)',
    },
    deleted: {
      fg: 'var(--tone-danger-text)',
      bg: 'var(--tone-danger-bg)',
      border: 'var(--tone-danger-border)',
    },
  };
  const t = toneMap[tone];
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? 11 : 13;

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding,
    fontSize,
    fontWeight: 500,
    lineHeight: 1.4,
    borderRadius: 999,
    border: `1px solid ${active ? t.border : 'var(--stroke-secondary)'}`,
    background: active ? t.bg : 'transparent',
    color: active ? t.fg : 'var(--text-secondary)',
    cursor: onClick && !disabled ? 'pointer' : 'default',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 90ms, border-color 90ms, color 90ms',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const content = (
    <>
      {leadingContent}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        title={title}
        style={mergeStyle(baseStyle, style)}
      >
        {content}
      </button>
    );
  }

  return (
    <span title={title} style={mergeStyle(baseStyle, style)}>
      {content}
    </span>
  );
}

export type StatTone = 'success' | 'danger' | 'warning' | 'info';

export function Stat({
  value,
  label,
  tone,
  style,
}: {
  value: ReactNode;
  label: string;
  tone?: StatTone;
  style?: CSSProperties;
}) {
  const toneMap: Record<StatTone, string> = {
    success: 'var(--tone-success-text)',
    danger: 'var(--tone-danger-text)',
    warning: 'var(--tone-warning-text)',
    info: 'var(--tone-info-text)',
  };
  return (
    <div
      style={mergeStyle(
        {
          background: 'var(--bg-elevated)',
          border: '1px solid var(--stroke-tertiary)',
          borderRadius: 8,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        },
        style,
      )}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 600,
          lineHeight: '28px',
          color: tone ? toneMap[tone] : 'var(--text-primary)',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 12,
          color: 'var(--text-tertiary)',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function Button({
  children,
  variant = 'secondary',
  disabled,
  onClick,
  style,
  title,
}: {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  title?: string;
}) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 6,
    border: '1px solid var(--stroke-primary)',
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 90ms, border-color 90ms',
    whiteSpace: 'nowrap',
  };
  const variants: Record<string, CSSProperties> = {
    primary: {
      background: 'var(--accent-primary)',
      color: 'var(--accent-text-on)',
      borderColor: 'var(--accent-primary)',
    },
    secondary: {},
    ghost: {
      background: 'transparent',
      borderColor: 'transparent',
    },
  };
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={mergeStyle(mergeStyle(base, variants[variant]), style)}
    >
      {children}
    </button>
  );
}

/* ---------- Select ---------- */

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  /**
   * Optional hex color. When provided, the option renders a small color
   * swatch to the left of its label — useful for color-picker dropdowns.
   */
  hex?: string;
};

export type SelectGroup<T extends string = string> = {
  label: string;
  options: SelectOption<T>[];
};

const SELECT_TRIGGER_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-primary)',
  background: 'var(--bg-input)',
  border: '1px solid var(--stroke-primary)',
  borderRadius: 6,
  padding: '6px 10px',
  cursor: 'pointer',
  outline: 'none',
  minWidth: 160,
};

function ChevronDown({ open }: { open: boolean }) {
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

function OptionRow({
  label,
  active,
  onClick,
  hex,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  hex?: string;
}) {
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
        fontFamily: 'inherit',
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
      {hex ? (
        <span
          aria-hidden="true"
          title={hex}
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: 3,
            background: hex,
            border: '1px solid var(--stroke-tertiary)',
            flexShrink: 0,
          }}
        />
      ) : null}
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

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--text-tertiary)',
        padding: '8px 8px 4px',
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  groups,
  ariaLabel,
  style,
  panelWidth = 240,
}: {
  value: T;
  onChange: (next: T) => void;
  options?: SelectOption<T>[];
  groups?: SelectGroup<T>[];
  ariaLabel?: string;
  style?: CSSProperties;
  /** Width of the dropdown panel in px. Defaults to 240. */
  panelWidth?: number;
}) {
  // Find the label for the currently selected value.
  let currentLabel: string = value;
  if (options) {
    const opt = options.find((o) => o.value === value);
    if (opt) currentLabel = opt.label;
  }
  if (groups) {
    for (const g of groups) {
      const opt = g.options.find((o) => o.value === value);
      if (opt) {
        currentLabel = opt.label;
        break;
      }
    }
  }

  return (
    <Popover
      width={panelWidth}
      trigger={(open, toggle) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          style={mergeStyle(SELECT_TRIGGER_STYLE, style)}
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
            {currentLabel}
          </span>
          <ChevronDown open={open} />
        </button>
      )}
    >
      {(close) => (
        <div role="listbox" aria-label={ariaLabel}>
          {options?.map((opt) => (
            <OptionRow
              key={opt.value}
              label={opt.label}
              hex={opt.hex}
              active={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                close();
              }}
            />
          ))}
          {groups?.map((g) => (
            <Fragment key={g.label}>
              <GroupLabel>{g.label}</GroupLabel>
              {g.options.map((opt) => (
                <OptionRow
                  key={opt.value}
                  label={opt.label}
                  hex={opt.hex}
                  active={opt.value === value}
                  onClick={() => {
                    onChange(opt.value);
                    close();
                  }}
                />
              ))}
            </Fragment>
          ))}
        </div>
      )}
    </Popover>
  );
}

/* ---------- Popover ---------- */

/**
 * Lightweight click-outside-to-close popover. The `trigger` render-prop receives
 * the current open state and a toggle function. Clicking outside the popover
 * (or pressing Escape) closes it.
 *
 * The panel renders via a portal into `document.body` so it can never be
 * clipped by an ancestor's `overflow: hidden` (Card, scrollable container,
 * etc.). Positioning follows the trigger on scroll and resize.
 */
export function Popover({
  trigger,
  children,
  align = 'start',
  panelStyle,
  width = 280,
  maxHeight = 360,
}: {
  trigger: (open: boolean, toggle: () => void) => ReactNode;
  /**
   * Panel content. Use a `(close) => ReactNode` function when the content
   * needs to close the popover (e.g. on option click).
   */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** Horizontal alignment of the panel relative to the trigger. */
  align?: 'start' | 'end';
  panelStyle?: CSSProperties;
  /** Width of the panel in px. Defaults to 280. */
  width?: number;
  /** Maximum height of the panel before it scrolls internally. */
  maxHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Capture the trigger's screen position whenever the popover opens, and keep
  // it fresh as the user scrolls or resizes.
  useLayoutEffect(() => {
    if (!open) {
      setRect(null);
      return;
    }
    const sync = () => {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    sync();
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const inTrigger = triggerRef.current?.contains(target) ?? false;
      const inPanel = panelRef.current?.contains(target) ?? false;
      if (!inTrigger && !inPanel) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Compute the panel's viewport position, flipping/sliding if it would
  // overflow the visible area.
  let panelLeft = 0;
  let panelTop = 0;
  if (rect && typeof window !== 'undefined') {
    const margin = 8;
    panelLeft = align === 'end' ? rect.right - width : rect.left;
    if (panelLeft + width > window.innerWidth - margin) {
      panelLeft = window.innerWidth - width - margin;
    }
    if (panelLeft < margin) panelLeft = margin;

    panelTop = rect.bottom + 4;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    if (spaceBelow < maxHeight && spaceAbove > spaceBelow) {
      panelTop = rect.top - Math.min(maxHeight, spaceAbove) - 4;
    }
  }

  return (
    <>
      <div ref={triggerRef} style={{ display: 'inline-block' }}>
        {trigger(open, () => setOpen((o) => !o))}
      </div>
      {open && rect && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              style={mergeStyle(
                {
                  position: 'fixed',
                  top: panelTop,
                  left: panelLeft,
                  zIndex: 1000,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--stroke-primary)',
                  borderRadius: 8,
                  padding: 8,
                  width,
                  maxHeight,
                  overflowY: 'auto',
                },
                panelStyle,
              )}
            >
              {typeof children === 'function' ? children(() => setOpen(false)) : children}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/* ---------- Tooltip ---------- */

/**
 * Hover/focus-triggered tooltip rendered via a portal so it can't be clipped
 * by an ancestor's `overflow: hidden`. Smart placement: prefers below the
 * trigger, flips above if there isn't enough space.
 */
export function Tooltip({
  children,
  content,
  maxWidth = 280,
  delay = 120,
  triggerStyle,
}: {
  children: ReactNode;
  content: ReactNode;
  /** Max width of the tooltip in px (defaults to 280). */
  maxWidth?: number;
  /** Hover delay in ms before showing (defaults to 120). */
  delay?: number;
  /** Style overrides for the trigger wrapper (e.g. `flex: 1`). */
  triggerStyle?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const showTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const sync = () => {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (showTimerRef.current != null) window.clearTimeout(showTimerRef.current);
    };
  }, []);

  const show = () => {
    if (showTimerRef.current != null) window.clearTimeout(showTimerRef.current);
    if (delay <= 0) {
      setOpen(true);
      return;
    }
    showTimerRef.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (showTimerRef.current != null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    setOpen(false);
  };

  let panelLeft = 0;
  let panelTop = 0;
  let placeAbove = false;
  if (rect && typeof window !== 'undefined') {
    const margin = 8;
    panelLeft = rect.left + rect.width / 2 - maxWidth / 2;
    if (panelLeft < margin) panelLeft = margin;
    if (panelLeft + maxWidth > window.innerWidth - margin) {
      panelLeft = window.innerWidth - maxWidth - margin;
    }
    const estimatedHeight = 160;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    if (spaceBelow >= estimatedHeight || rect.top < estimatedHeight) {
      panelTop = rect.bottom + 6;
      placeAbove = false;
    } else {
      panelTop = rect.top - 6;
      placeAbove = true;
    }
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={mergeStyle({ display: 'inline-flex' }, triggerStyle)}
      >
        {children}
      </span>
      {open && rect && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="tooltip"
              style={{
                position: 'fixed',
                top: panelTop,
                left: panelLeft,
                maxWidth,
                zIndex: 1100,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--stroke-primary)',
                borderRadius: 6,
                padding: '8px 10px',
                pointerEvents: 'none',
                transform: placeAbove ? 'translateY(-100%)' : 'none',
                boxSizing: 'border-box',
              }}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/* ---------- Checkbox ---------- */

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  style,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <label
      style={mergeStyle(
        {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          padding: '4px 6px',
          borderRadius: 4,
          userSelect: 'none',
        },
        style,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 14,
          height: 14,
          accentColor: 'var(--accent-primary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          margin: 0,
        }}
      />
      {label != null && (
        <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{label}</span>
      )}
    </label>
  );
}

/* ---------- MultiSelect ---------- */

export type MultiSelectOption = {
  id: string;
  label: string;
  /** Optional secondary number shown after the label (e.g. token count). */
  count?: number;
};

/**
 * Trigger button + popover panel of checkboxes. Preserves multi-select while
 * collapsing a long list of toggles to a single control.
 */
export function MultiSelect({
  label,
  options,
  selectedIds,
  onChange,
  emptyAllowed = true,
  width = 280,
}: {
  /**
   * Static prefix shown inside the trigger, e.g. "Category".
   * Omit when the caller renders an external label next to the control
   * (matches the styling of plain `Select` usage).
   */
  label?: string;
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (next: string[]) => void;
  /** When false, deselecting the last item snaps back to "All". */
  emptyAllowed?: boolean;
  /** Width of the popover panel in px. */
  width?: number;
}) {
  const total = options.length;
  const allIds = options.map((o) => o.id);
  const allSelected = total > 0 && selectedIds.length === total;
  const noneSelected = selectedIds.length === 0;

  let summary: string;
  if (allSelected) summary = `All (${total})`;
  else if (noneSelected) summary = 'None';
  else summary = `${selectedIds.length} of ${total}`;

  const triggerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-primary)',
    background: 'var(--bg-input)',
    border: '1px solid var(--stroke-primary)',
    borderRadius: 6,
    padding: '6px 10px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: 160,
  };

  return (
    <Popover
      width={width}
      trigger={(open, toggle) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={label ? `${label}: ${summary}` : summary}
          style={triggerStyle}
        >
          {label ? (
            <span style={{ color: 'var(--text-tertiary)' }}>{label}:</span>
          ) : null}
          <span style={{ flex: 1, textAlign: 'left' }}>{summary}</span>
          <span
            style={{
              fontSize: 10,
              transition: 'transform 120ms',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--text-tertiary)',
            }}
          >
            ▾
          </span>
        </button>
      )}
    >
      <Stack gap={4}>
        <Row gap={4} align="center" style={{ padding: '0 2px 6px' }}>
          <button
            type="button"
            onClick={() => onChange(allIds)}
            disabled={allSelected}
            style={miniButton(allSelected)}
          >
            Select all
          </button>
          <button
            type="button"
            onClick={() => onChange(emptyAllowed ? [] : allIds)}
            disabled={noneSelected}
            style={miniButton(noneSelected)}
          >
            Clear
          </button>
        </Row>
        <div style={{ height: 1, background: 'var(--stroke-tertiary)' }} />
        <Stack gap={0} style={{ maxHeight: 280, overflowY: 'auto' }}>
          {options.map((opt) => {
            const checked = selectedIds.includes(opt.id);
            return (
              <Checkbox
                key={opt.id}
                checked={checked}
                onChange={(next) => {
                  let nextIds: string[];
                  if (next) nextIds = [...selectedIds, opt.id];
                  else nextIds = selectedIds.filter((id) => id !== opt.id);
                  if (!emptyAllowed && nextIds.length === 0) return;
                  onChange(nextIds);
                }}
                label={
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'baseline' }}>
                    <span>{opt.label}</span>
                    {opt.count != null ? (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>
                        · {opt.count}
                      </span>
                    ) : null}
                  </span>
                }
              />
            );
          })}
        </Stack>
      </Stack>
    </Popover>
  );
}

function miniButton(disabled: boolean): CSSProperties {
  return {
    fontFamily: 'inherit',
    fontSize: 11,
    fontWeight: 500,
    color: disabled ? 'var(--text-tertiary)' : 'var(--accent-primary)',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: 4,
    padding: '2px 6px',
    cursor: disabled ? 'default' : 'pointer',
  };
}

/* ---------- Callout ---------- */

export function Callout({
  children,
  tone = 'info',
  title,
  style,
}: {
  children?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  title?: ReactNode;
  style?: CSSProperties;
}) {
  const toneMap = {
    info:    { bg: 'var(--tone-info-bg)',    border: 'var(--tone-info-border)',    title: 'var(--tone-info-text)' },
    success: { bg: 'var(--tone-success-bg)', border: 'var(--tone-success-border)', title: 'var(--tone-success-text)' },
    warning: { bg: 'var(--tone-warning-bg)', border: 'var(--tone-warning-border)', title: 'var(--tone-warning-text)' },
    danger:  { bg: 'var(--tone-danger-bg)',  border: 'var(--tone-danger-border)',  title: 'var(--tone-danger-text)' },
    neutral: { bg: 'var(--tone-neutral-bg)', border: 'var(--tone-neutral-border)', title: 'var(--text-secondary)' },
  } as const;
  const t = toneMap[tone];
  return (
    <div
      style={mergeStyle(
        {
          background: t.bg,
          border: `1px solid ${t.border}`,
          borderRadius: 6,
          padding: '10px 12px',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        },
        style,
      )}
    >
      {title != null && (
        <div style={{ color: t.title, fontWeight: 600, fontSize: 13 }}>{title}</div>
      )}
      <div style={{ color: 'var(--text-primary)', fontSize: 13, lineHeight: '18px' }}>{children}</div>
    </div>
  );
}
