import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { LineChart, Slice } from './data';

const FONT = "'72', '72full', system-ui, -apple-system, 'Segoe UI', sans-serif";
const LABEL = '#566189';
const TEXT = '#111727';
/** `sapList_BorderColor` is plain white in this theme, so gridlines barely read. */
const GRIDLINE = '#ffffff';

/**
 * Shared motion config. Entry is slower so the chart reads as it draws; data
 * updates are quicker because the shapes are already on screen.
 * https://echarts.apache.org/handbook/en/how-to/animation/transition
 */
const motion = {
  animation: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  animationDuration: 600,
  animationEasing: 'cubicOut',
  animationDurationUpdate: 300,
  animationEasingUpdate: 'cubicInOut',
} as const;

/**
 * Lets the HTML legends outside a chart drive ECharts' own hover emphasis.
 * `dataIndex` targets one slice/point, `seriesIndex` alone targets a line.
 */
export type ChartApi = {
  highlight: (target: { seriesIndex?: number; dataIndex?: number }) => void;
  downplay: () => void;
};

type ApiRef = { current: ChartApi | null };

/**
 * Emphasis plus the tooltip, so a legend hover reads the same as hovering the
 * shape itself. The tooltip is only shown when a specific datum is named — an
 * axis-triggered line tooltip covers every series at one x, so there'd be no
 * meaningful place to anchor it from a series-level hover.
 */
function bindApi(instance: echarts.ECharts, apiRef: ApiRef | undefined, onToggle?: (on: boolean) => void) {
  if (!apiRef) return;
  apiRef.current = {
    highlight: (target) => {
      onToggle?.(true);
      instance.dispatchAction({ type: 'highlight', ...target });
      if (target.dataIndex !== undefined) {
        instance.dispatchAction({ type: 'showTip', seriesIndex: 0, ...target });
      }
    },
    downplay: () => {
      onToggle?.(false);
      instance.dispatchAction({ type: 'downplay' });
      instance.dispatchAction({ type: 'hideTip' });
    },
  };
}

export function Chart({
  option,
  className,
  apiRef,
  onInit,
}: {
  option: EChartsOption;
  className?: string;
  apiRef?: ApiRef;
  onInit?: (instance: echarts.ECharts) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const instance = echarts.init(el);
    chart.current = instance;
    bindApi(instance, apiRef);
    onInit?.(instance);
    const observer = new ResizeObserver(() => chart.current?.resize());
    observer.observe(el);
    return () => {
      observer.disconnect();
      instance.dispose();
      chart.current = null;
      if (apiRef) apiRef.current = null;
    };
  }, [apiRef, onInit]);

  // Merge rather than replace: ECharts diffs against the previous option by
  // data `name` to decide enter/update/leave animations, and `notMerge` throws
  // that history away, replaying the enter animation on every data change.
  useEffect(() => {
    chart.current?.setOption(option);
  }, [option]);

  return <div ref={host} className={className} />;
}

const tooltip = {
  trigger: 'axis' as const,
  // Cards clip their content (`overflow: hidden` for the rounded corners), so
  // a tooltip rendered inside the chart div gets cut off at the card edge.
  appendTo: 'body',
  backgroundColor: '#ffffff',
  borderColor: '#e6e7ea',
  borderWidth: 1,
  textStyle: { color: TEXT, fontFamily: FONT, fontSize: 12 },
  extraCssText: 'box-shadow: 0 2px 8px rgba(34,53,72,0.16); border-radius: 8px;',
};

/** Area fill for a highlighted line when no single point is under the cursor. */
const fadeDown = (color: string) =>
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: `${color}4d` },
    { offset: 1, color: `${color}00` },
  ]);

const GLOW_RADIUS = 170;

/**
 * Concentrates the highlighted area's fill on the hovered point. Only the line
 * under the cursor glows: hovering empty plot space highlights every series at
 * that x, and those keep the uniform fade. Pixel (`global`) coordinates keep the
 * glow the same size on every series — in bbox-relative mode a low, flat series
 * would get a much smaller radius.
 */
export function focusGradient({ series }: LineChart) {
  return (instance: echarts.ECharts) => {
    let index: number | null = null;
    let hovered: number | null = null;
    let current = '';
    const apply = () => {
      const key = `${hovered}:${index}`;
      if (key === current) return;
      current = key;
      instance.setOption({
        series: series.map((s, seriesIndex) => {
          if (index === null || seriesIndex !== hovered) {
            return { emphasis: { areaStyle: { color: fadeDown(s.color) } } };
          }
          const [x, y] = instance.convertToPixel({ seriesIndex }, [index, s.values[index]]);
          return {
            emphasis: {
              areaStyle: {
                color: new echarts.graphic.RadialGradient(
                  x,
                  y,
                  GLOW_RADIUS,
                  [
                    { offset: 0, color: `${s.color}99` },
                    { offset: 0.5, color: `${s.color}38` },
                    { offset: 1, color: `${s.color}00` },
                  ],
                  true,
                ),
              },
            },
          };
        }),
      });
    };
    instance.on('updateAxisPointer', (e) => {
      const info = (e as { axesInfo: { axisDim: string; value: number }[] }).axesInfo.find((a) => a.axisDim === 'x');
      index = info ? info.value : null;
      apply();
    });
    instance.on('mouseover', { componentType: 'series' }, (e) => {
      hovered = (e as { seriesIndex: number }).seriesIndex;
      apply();
    });
    instance.on('mouseout', { componentType: 'series' }, () => {
      hovered = null;
      apply();
    });
    instance.getZr().on('globalout', () => {
      index = hovered = null;
      apply();
    });
  };
}

/**
 * The design ships eight evenly spaced gridlines, so the axis is split into
 * seven intervals and ticks are formatted the way Figma labels them.
 */
export function lineOption({ series, axisMax, days, ticks }: LineChart): EChartsOption {
  return {
    ...motion,
    grid: { left: 52, right: 12, top: 8, bottom: 24 },
    tooltip,
    xAxis: {
      type: 'category',
      data: days,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: LABEL,
        fontFamily: FONT,
        fontSize: 10,
        interval: 0,
        formatter: (_: string, i: number) => ticks[i],
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: axisMax,
      interval: axisMax / 7,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: GRIDLINE } },
      axisLabel: {
        color: LABEL,
        fontFamily: FONT,
        fontSize: 10,
        formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)),
      },
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      data: s.values,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { color: s.color, width: 1.5 },
      itemStyle: { color: '#ffffff', borderColor: s.color, borderWidth: 1.5 },
      // The area polygon only exists if the base state has one; keep it
      // invisible until emphasis.
      areaStyle: { opacity: 0 },
      // `focus: 'series'` fades the other lines, which is what makes a legend
      // hover legible on an 8-line chart.
      emphasis: {
        scale: 1.3,
        focus: 'series',
        areaStyle: { opacity: 1, color: fadeDown(s.color) },
      },
      // Walk the markers in left to right behind the line's own draw-in.
      animationDelay: (idx: number) => idx * 55,
    })),
  };
}

/** Donut; per-slice values show on hover via tooltip rather than as labels. */
export function donutOption(slices: Slice[]): EChartsOption {
  return {
    ...motion,
    tooltip: { ...tooltip, trigger: 'item', formatter: '{b}<br/>{c}' },
    series: [
      {
        type: 'pie',
        radius: ['82.875%', '96%'],
        center: ['50%', '50%'],
        padAngle: 1.5,
        // The ring nearly fills the box, so the default 10px hover growth would clip.
        emphasis: { scaleSize: 4 },
        label: { show: false },
        labelLine: { show: false },
        data: slices.map((s) => ({
          name: s.name,
          value: s.value,
          itemStyle: { color: s.color, borderWidth: 0, borderRadius: 8 },
        })),
      },
    ],
  };
}

/** Headroom reserved at the frame edge so drifting never crops a bubble. */
const DRIFT = 3;
const FLOAT_MS = 2400;

/**
 * Packs the bubbles into one tight cluster. Each pass resolves overlaps and
 * then pulls everything back toward the middle, which settles into a blob;
 * the blob is scaled to fit the frame at the end. Fitting the whole group —
 * rather than clamping each bubble to the edge — is what keeps them grouped
 * and guarantees none is cropped.
 */
function packBubbles(values: number[], width: number, height: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  // Radii in arbitrary units; area stays proportional to value and the whole
  // cluster is scaled to the frame once it has settled.
  const circles = values.map((v, i) => ({
    r: Math.sqrt(v),
    x: Math.cos(i * golden) * Math.sqrt(i) * 2,
    y: Math.sin(i * golden) * Math.sqrt(i) * 2,
  }));

  for (let pass = 0; pass < 300; pass++) {
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const min = a.r + b.r + 0.35;
        if (dist < min) {
          const push = (min - dist) / 2;
          a.x -= (dx / dist) * push;
          a.y -= (dy / dist) * push;
          b.x += (dx / dist) * push;
          b.y += (dy / dist) * push;
        }
      }
    }
    for (const c of circles) {
      c.x *= 0.94;
      c.y *= 0.94;
    }
  }

  const pad = DRIFT + 2;
  const minX = Math.min(...circles.map((c) => c.x - c.r));
  const maxX = Math.max(...circles.map((c) => c.x + c.r));
  const minY = Math.min(...circles.map((c) => c.y - c.r));
  const maxY = Math.max(...circles.map((c) => c.y + c.r));
  const scale = Math.min((width - pad * 2) / (maxX - minX), (height - pad * 2) / (maxY - minY));
  const blobX = (minX + maxX) / 2;
  const blobY = (minY + maxY) / 2;

  return circles.map((c) => ({
    r: c.r * scale,
    x: width / 2 + (c.x - blobX) * scale,
    y: height / 2 + (c.y - blobY) * scale,
  }));
}

/**
 * Packed bubbles that drift slowly. Each tick nudges every bubble a little
 * further along its own slow ellipse and lets ECharts tween between the two
 * states, so the motion reads as floating rather than stepping.
 */
export function BubbleChart({
  slices,
  className,
  apiRef,
}: {
  slices: Slice[];
  className?: string;
  apiRef?: ApiRef;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const chart = echarts.init(el);
    let packed: ReturnType<typeof packBubbles> = [];
    // Drift is paused while a legend row is hovered, so the periodic
    // `setOption` can't drop the highlight mid-inspection.
    let paused = false;

    // A scatter on a pixel-valued cartesian grid, rather than a `graph`
    // series: `graph` auto-fits node extents and scales each axis separately,
    // which stretched the bubbles into ellipses and pushed them off-canvas.
    const render = (t: number, width: number, height: number) =>
      chart.setOption({
        ...motion,
        animationDurationUpdate: FLOAT_MS,
        // Linear so consecutive drifts run together instead of pulsing.
        animationEasingUpdate: 'linear',
        tooltip: {
          ...tooltip,
          trigger: 'item',
          formatter: (p: unknown) => {
            const { name, data } = p as { name: string; data: { display: string } };
            return `${name}<br/>${data.display}`;
          },
        },
        grid: { left: 0, top: 0, right: 0, bottom: 0 },
        xAxis: { type: 'value', min: 0, max: width, show: false },
        yAxis: { type: 'value', min: 0, max: height, show: false, inverse: true },
        series: [
          {
            type: 'scatter',
            clip: false,
            symbol: 'circle',
            symbolSize: (v: number[]) => v[2],
            // The tooltip already names the slice; no label on the bubble.
            label: { show: false },
            emphasis: { scale: 1.05, label: { show: false } },
            data: slices.map((s, i) => {
              const c = packed[i];
              const phase = i * 1.7;
              return {
                name: s.name,
                display: s.label,
                value: [
                  c.x + Math.cos(t * 0.00026 + phase) * DRIFT,
                  c.y + Math.sin(t * 0.00021 + phase) * DRIFT,
                  c.r * 2,
                ],
                itemStyle: { color: s.color },
              };
            }),
          },
        ],
      } as EChartsOption);

    let box = { width: 0, height: 0 };

    const relayout = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      box = { width, height };
      chart.resize();
      packed = packBubbles(
        slices.map((s) => s.value),
        width,
        height,
      );
      render(performance.now(), width, height);
    };

    relayout();
    const observer = new ResizeObserver(relayout);
    observer.observe(el);

    bindApi(chart, apiRef, (on) => {
      paused = on;
    });

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = still
      ? 0
      : window.setInterval(() => {
          if (!paused) render(performance.now(), box.width, box.height);
        }, FLOAT_MS);

    return () => {
      if (timer) clearInterval(timer);
      observer.disconnect();
      chart.dispose();
      if (apiRef) apiRef.current = null;
    };
  }, [slices, apiRef]);

  return <div ref={host} className={className} />;
}
