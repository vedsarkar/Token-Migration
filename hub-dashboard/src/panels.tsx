import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { BubbleChart, Chart, donutOption, lineOption, type ChartApi } from './charts';
import {
  activityEvents,
  activityTotal,
  entityTypes,
  hipaaFinance,
  industries,
  matchMerge,
  profileStats,
  tenantCloudDonut,
  topDataSources,
  type BarRow,
  type LineChart,
  type Slice,
} from './data';

type ApiRef = { current: ChartApi | null };

import avatar from './assets/avatar.png';
import arrowDown from './assets/t2-arrow-down.svg';
import exportIcon from './assets/t2-export.svg';
import filterIcon from './assets/t2-filter.svg';
import globe from './assets/t2-globe.svg';
import magnifier from './assets/t2-magnifier.svg';
import next from './assets/t2-next.svg';
import overflow from './assets/t2-overflow.svg';
import prev from './assets/t2-prev.svg';

// Options are built once: the dashboard renders fixed design data, so a stable
// reference keeps `setOption` from re-running on every render.
const profileStatsOption = lineOption(profileStats);
const matchMergeOption = lineOption(matchMerge);
const tenantCloudOption = donutOption(tenantCloudDonut);
const entityTypesOption = donutOption(entityTypes);

function Card({
  title,
  wide,
  hug,
  children,
}: {
  title: string;
  wide?: boolean;
  /** Sizes the card to its content instead of stretching across its full grid span. */
  hug?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`card${wide ? ' span-2' : ''}${hug ? ' card--hug' : ''}`}>
      <div className="card-header">
        <h2>{title}</h2>
        <button type="button" className="icon-button" aria-label={`${title} options`}>
          <img src={overflow} alt="" />
        </button>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

function MenuButton({ label }: { label: string }) {
  return (
    <button type="button" className="link-button">
      {label}
      <img src={arrowDown} alt="" />
    </button>
  );
}

/** Label and value share one line, with the bar tracking underneath. */
function BarList({ columns, rows }: { columns: [string, string]; rows: BarRow[] }) {
  const max = Math.max(...rows.map((row) => row.value));
  const [tip, setTip] = useState<{ row: BarRow; x: number; y: number } | null>(null);
  return (
    <div className={tip ? 'bar-list bar-list--focus' : 'bar-list'} onMouseLeave={() => setTip(null)}>
      <div className="bar-list-head">
        <span>{columns[0]}</span>
        <span>{columns[1]}</span>
      </div>
      {rows.map((row) => (
        <div
          className={tip?.row === row ? 'bar-row is-active' : 'bar-row'}
          key={row.label}
          // Re-measured on every move so the anchor stays right after the card scrolls.
          onMouseMove={(e) => {
            const fill = e.currentTarget.querySelector('.bar-fill')!.getBoundingClientRect();
            setTip({ row, x: fill.left + fill.width / 2, y: e.currentTarget.getBoundingClientRect().top });
          }}
        >
          <div className="bar-row-line">
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {/* Portalled for the same reason as the ECharts tooltips: cards clip. */}
      {tip &&
        createPortal(
          <div className="bar-tip" style={{ left: tip.x, top: tip.y }}>
            {tip.row.label}
            <br />
            {tip.row.value}
          </div>,
          document.body,
        )}
    </div>
  );
}

// Values are dropped here — the donut/bubble charts already surface them on
// hover, so the legend only needs to name each slice.
function LegendList({ slices, chart }: { slices: Slice[]; chart?: ApiRef }) {
  return (
    <div className="legend-list">
      {slices.map((slice, i) => (
        <div
          className="legend-item"
          key={slice.name}
          onMouseEnter={() => chart?.current?.highlight({ seriesIndex: 0, dataIndex: i })}
          onMouseLeave={() => chart?.current?.downplay()}
        >
          <span className="legend-swatch" style={{ background: slice.color }} />
          <span>{slice.name}</span>
        </div>
      ))}
    </div>
  );
}

/** Line-chart legend: hovering a row emphasises that whole series. */
function StatsLegend({ chartData, chart }: { chartData: LineChart; chart: ApiRef }) {
  return (
    <div className="stats-legend">
      {chartData.series.map((series, i) => (
        <div
          className="legend-item"
          key={series.name}
          onMouseEnter={() => chart.current?.highlight({ seriesIndex: i })}
          onMouseLeave={() => chart.current?.downplay()}
        >
          <span className="legend-swatch" style={{ background: series.color }} />
          <span>{series.name}</span>
          <span className="legend-value">{series.total}</span>
        </div>
      ))}
    </div>
  );
}

export function ProfileStatsCard() {
  const chart = useRef<ChartApi | null>(null);
  return (
    <Card title="Profile Stats" wide>
      <div className="chart-controls">
        <MenuButton label="Last 7 days" />
      </div>
      <Chart className="line-chart" option={profileStatsOption} apiRef={chart} />
      <StatsLegend chartData={profileStats} chart={chart} />
    </Card>
  );
}

export function ActivityLogCard() {
  return (
    <Card title="Activity log" wide>
      <div className="activity-filter">
        <p>Filter: Within 3 months</p>
        <button type="button" className="icon-button" aria-label="Export activity log">
          <img src={exportIcon} alt="" />
        </button>
        <button type="button" className="icon-button" aria-label="Filter activity log">
          <img src={filterIcon} alt="" />
        </button>
      </div>

      <div className="activity-group">Today</div>

      <div className="activity-feed">
        {activityEvents.map((event) => (
          <div className="activity-item" key={event.user}>
            <img className="activity-avatar" src={avatar} alt="" />
            <div className="activity-text">
              <p className="activity-user">{event.user}</p>
              <p className="activity-byline">{`${event.action}  ·  ${event.time}`}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <p>Events per page:</p>
        <MenuButton label="10" />
        <span className="spacer" />
        <p>{activityTotal}</p>
        <button type="button" className="icon-button" aria-label="Previous page">
          <img src={prev} alt="" />
        </button>
        <button type="button" className="icon-button" aria-label="Next page">
          <img src={next} alt="" />
        </button>
      </div>
    </Card>
  );
}

export function HipaaFinanceCard() {
  return (
    <Card title="HIPAA / Finance Data">
      <BarList columns={['Attributes', 'No of Profiles']} rows={hipaaFinance} />
    </Card>
  );
}

export function TenantDeploymentCloudCard() {
  const chart = useRef<ChartApi | null>(null);
  return (
    <Card title="Tenant Deployment Cloud" hug>
      <div className="donut-layout">
        <Chart className="donut-chart" option={tenantCloudOption} apiRef={chart} />
        {/* Same six slices the donut plots, so every swatch maps to an arc. */}
        <LegendList slices={tenantCloudDonut} chart={chart} />
      </div>
    </Card>
  );
}

export function CustomersByIndustryCard() {
  const chart = useRef<ChartApi | null>(null);
  return (
    <Card title="Customers by Industry">
      <BubbleChart className="bubble-chart" slices={industries} apiRef={chart} />
      <LegendList slices={industries} chart={chart} />
    </Card>
  );
}

export function ProfilesByEntityTypeCard() {
  const chart = useRef<ChartApi | null>(null);
  return (
    <Card title="Profiles by Entity Type" hug>
      <div className="donut-layout">
        <Chart className="donut-chart" option={entityTypesOption} apiRef={chart} />
        <LegendList slices={entityTypes} chart={chart} />
      </div>
    </Card>
  );
}

export function MatchMergeActivityCard() {
  const chart = useRef<ChartApi | null>(null);
  return (
    <Card title="Match &amp; Merge Activity" wide>
      <div className="chart-controls">
        <MenuButton label="Last 7 days" />
      </div>
      <Chart className="line-chart" option={matchMergeOption} apiRef={chart} />
      <StatsLegend chartData={matchMerge} chart={chart} />
    </Card>
  );
}

export function TopDataSourcesCard() {
  return (
    <Card title="Top Data Sources">
      <BarList columns={['Source', 'Profiles']} rows={topDataSources} />
    </Card>
  );
}

export function NotificationInboxCard() {
  return (
    <Card title="Notification inbox">
      <div className="empty-state">
        <div className="empty-illustration">
          <div className="backdrop" />
          <img className="globe" src={globe} alt="" width={57} height={57} />
          <img className="magnifier" src={magnifier} alt="" width={30} height={48} />
        </div>
        <p className="empty-title">No new notifications</p>
        <p className="empty-body">You are all caught up for now.</p>
      </div>
    </Card>
  );
}
