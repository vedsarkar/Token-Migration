/**
 * Dashboard content, transcribed from Figma `Hub Modernization` frame
 * `Profile Stats - Tweaked` (node 2402:89447).
 *
 * Line-series values are decoded from the plot SVG the design ships: the plot
 * spans y=8 (axis max) to y=244 (zero), so `value = (244 - y) / 236 * axisMax`.
 * Series the design leaves undrawn stay at zero rather than being invented.
 */

/** SAP Horizon chart palette; this theme extends the ordered set to twelve. */
export const chart = {
  ordered1: '#5291ff',
  ordered2: '#f2a93a',
  ordered3: '#99cf1d',
  ordered4: '#ee3f9a',
  ordered5: '#8e45e3',
  ordered6: '#009999',
  ordered7: '#0000cc',
  ordered8: '#b22fe6',
  ordered9: '#5d7c67',
  ordered10: '#e76f6f',
  ordered11: '#4b35ff',
  ordered12: '#d4a983',
} as const;

const ordered = Object.values(chart);

/** Walks the twelve ordered colours, repeating for longer series. */
const paletteAt = (i: number) => ordered[i % ordered.length];

export type LineSeries = {
  name: string;
  color: string;
  /** Total shown in the panel legend. */
  total: string;
  /** One value per day across the chart's `days`. */
  values: number[];
};

export type LineChart = {
  axisMax: number;
  /** Category per point; shown in the tooltip. */
  days: string[];
  /** Axis labels — the design only prints every other day. */
  ticks: string[];
  series: LineSeries[];
};

/**
 * The four categories the design reports a non-zero total for; the other four
 * were all `0`. Every entry is plotted in its own legend colour, so each
 * swatch maps to a visible line. `Updated` keeps the shape decoded from the
 * Figma plot — the rest are stand-in curves until real data is wired up.
 */
export const profileStats: LineChart = {
  axisMax: 490_000,
  days: ['Aug 29', 'Aug 30', 'Aug 31', 'Sep 1', 'Sep 2', 'Sep 3', 'Sep 4'],
  ticks: ['', 'Aug 30', '', 'Sep 1', '', 'Sep 3', ''],
  series: [
    {
      name: 'New',
      color: chart.ordered1,
      total: '1239',
      values: [88_000, 142_000, 96_000, 168_000, 121_000, 204_000, 156_000],
    },
    {
      name: 'Updated',
      color: chart.ordered2,
      total: '851259',
      values: [267_065, 7080, 7080, 62_076, 482_046, 62_076, 32_078],
    },
    {
      name: 'Matched',
      color: chart.ordered4,
      total: '949',
      values: [212_000, 198_000, 243_000, 187_000, 265_000, 231_000, 276_000],
    },
    {
      name: 'Auto-merged',
      color: chart.ordered5,
      total: '584',
      values: [34_000, 61_000, 48_000, 93_000, 77_000, 118_000, 145_000],
    },
  ],
};

/**
 * Figma node 3079:22838. `Matched` and `Not a match` are decoded from the
 * plot SVG (570x170 box, gridlines y=7 at 4.20K down to y=161 at zero, so
 * `value = (161 - y) / 154 * 4200`); the design leaves the other two series
 * undrawn, so those are stand-ins until real data is wired up.
 */
export const matchMerge: LineChart = {
  axisMax: 4200,
  days: ['Sep 5', 'Sep 6', 'Sep 7', 'Sep 8', 'Sep 9', 'Sep 10', 'Sep 11'],
  ticks: ['', 'Sep 6', '', 'Sep 8', '', 'Sep 10', ''],
  series: [
    {
      name: 'Matched',
      color: chart.ordered1,
      total: '1,284',
      values: [3055, 1200, 409, 2564, 3818, 1091, 327],
    },
    {
      name: 'Auto-merged',
      color: chart.ordered2,
      total: '962',
      values: [1420, 980, 1650, 1210, 2050, 1580, 1890],
    },
    {
      name: 'Manually merged',
      color: chart.ordered5,
      total: '143',
      values: [520, 780, 640, 910, 700, 1130, 860],
    },
    {
      name: 'Not a match',
      color: '#ee3333',
      total: '318',
      values: [245, 191, 109, 300, 355, 164, 82],
    },
  ],
};

export type ActivityEvent = { user: string; action: string; time: string };

export const activityEvents: ActivityEvent[] = [
  { user: 'venkatesh.pai@reltio.com', action: 'Logged in', time: '1:38 PM' },
  { user: 'alexander.panchenko@reltio.com', action: 'Logged in', time: '1:36 PM' },
  { user: 'piyush.srivastava@reltio.com', action: 'Logged in', time: '12:58 PM' },
];

export const activityTotal = '1-10 of 254,295';

export type BarRow = { label: string; value: number };

export const hipaaFinance: BarRow[] = [
  { label: 'No', value: 309 },
  { label: 'Yes - HIPAA', value: 35 },
  { label: 'Yes - Finance', value: 20 },
  { label: 'Yes - GDPR', value: 128 },
  { label: 'Yes - CCPA', value: 74 },
  { label: 'Yes - Marketing', value: 210 },
  { label: 'Yes - Sanctions', value: 46 },
  { label: 'Yes - PII', value: 187 },
  { label: 'Yes - PHI', value: 142 },
  { label: 'Yes - PCI', value: 95 },
  { label: 'Yes - SOX', value: 63 },
  { label: 'Yes - LGPD', value: 118 },
  { label: 'Yes - HITECH', value: 51 },
  { label: 'Yes - FERPA', value: 38 },
  { label: 'Yes - COPPA', value: 27 },
  { label: 'Yes - Do Not Call', value: 156 },
  { label: 'Yes - Do Not Email', value: 133 },
  { label: 'Yes - Consent Given', value: 244 },
  { label: 'Yes - Opt-Out', value: 88 },
  { label: 'Yes - Deceased', value: 12 },
  { label: 'Yes - VIP', value: 71 },
  { label: 'Yes - Watchlist', value: 29 },
  { label: 'Yes - Duplicate', value: 205 },
  { label: 'Yes - Verified', value: 168 },
];

export type Slice = { name: string; value: number; color: string; label: string };

const withPalette = (rows: [string, number, string][]): Slice[] =>
  rows.map(([name, value, label], i) => ({ name, value, label, color: paletteAt(i) }));

export const tenantCloud = withPalette([
  ['Office Electronics', 25.37, '25.37M'],
  ['Computers and Laptops', 10.15, '10.15M'],
  ['Networking Products', 5.07, '5.07M'],
  ['Office Equipment', 4.06, '4.06M'],
  ['Communication', 3.55, '3.55M'],
  ['Monitors', 2.54, '2.54M'],
  ['Printers & Scanners', 2.11, '2.11M'],
  ['Storage Devices', 1.98, '1.98M'],
  ['Servers', 1.72, '1.72M'],
  ['Peripherals', 1.45, '1.45M'],
  ['Software Licenses', 1.3, '1.30M'],
  ['Cables & Adapters', 1.12, '1.12M'],
  ['Mobile Devices', 0.98, '0.98M'],
  ['Audio Equipment', 0.86, '0.86M'],
  ['Power & UPS', 0.74, '0.74M'],
  ['Security Hardware', 0.63, '0.63M'],
  ['Accessories', 0.51, '0.51M'],
  ['Miscellaneous', 0.42, '0.42M'],
]);

/** Figma plots only the six largest categories; the legend still lists all. */
export const tenantCloudDonut = tenantCloud.slice(0, 6);

/** Figma node 3079:22837. */
export const entityTypes: Slice[] = [
  { name: 'Organization', value: 62.4, label: '62.4%', color: chart.ordered1 },
  { name: 'Individual', value: 28.1, label: '28.1%', color: chart.ordered5 },
  { name: 'Location', value: 6.7, label: '6.7%', color: chart.ordered3 },
  { name: 'Product', value: 2.8, label: '2.8%', color: chart.ordered4 },
];

/** Figma node 3079:22839. */
export const topDataSources: BarRow[] = [
  { label: 'Reltio', value: 309 },
  { label: 'Salesforce', value: 214 },
  { label: 'SAP', value: 176 },
  { label: 'Veeva', value: 98 },
  { label: 'Workday', value: 54 },
  { label: 'MDM (test)', value: 31 },
  { label: 'Manual entry', value: 12 },
  { label: 'Other', value: 8 },
];

export const industries = withPalette([
  ['Life Sciences', 31.3, '31.3%'],
  ['Finance & Insurance', 19.5, '19.5%'],
  ['Other', 17.9, '17.9%'],
  ['Technology', 12.4, '12.4%'],
  ['Healthcare', 10.2, '10.2%'],
  ['Retail', 8.7, '8.7%'],
  ['Manufacturing', 7.4, '7.4%'],
  ['Energy & Utilities', 6.1, '6.1%'],
  ['Telecommunications', 5.3, '5.3%'],
  ['Public Sector', 4.8, '4.8%'],
  ['Education', 4.2, '4.2%'],
  ['Transportation', 3.6, '3.6%'],
  ['Media & Entertainment', 3.1, '3.1%'],
  ['Real Estate', 2.7, '2.7%'],
  ['Hospitality', 2.2, '2.2%'],
  ['Agriculture', 1.8, '1.8%'],
  ['Automotive', 1.4, '1.4%'],
  ['Non-Profit', 0.9, '0.9%'],
]);
