import {
  ActivityLogCard,
  CustomersByIndustryCard,
  HipaaFinanceCard,
  MatchMergeActivityCard,
  NotificationInboxCard,
  ProfileStatsCard,
  ProfilesByEntityTypeCard,
  TenantDeploymentCloudCard,
  TopDataSourcesCard,
} from '../panels';

import add from '../assets/t2-add.svg';
import overflowVertical from '../assets/t2-overflow-v.svg';

export default function ProfileStats() {
  return (
    <>
      <div className="toolbar">
        <h1>Profile stats</h1>
        <span className="spacer" />
        <button type="button" className="link-button">
          <img src={add} alt="" />
          ADD / REMOVE CHARTS
        </button>
        <button type="button" className="icon-button" aria-label="More actions">
          <img src={overflowVertical} alt="" />
        </button>
      </div>

      <div className="card-grid">
        <ProfileStatsCard />
        <ActivityLogCard />

        {/* A flex row, not more grid cells: Tenant Deployment Cloud hugs its
            content width, and grid's equal-fr columns can't let a neighbour
            slide in to close the gap that leaves — flex naturally can. */}
        <div className="card-row">
          <HipaaFinanceCard />
          <TenantDeploymentCloudCard />
          <CustomersByIndustryCard />
          <NotificationInboxCard />
        </div>

        <div className="card-row">
          <ProfilesByEntityTypeCard />
          <MatchMergeActivityCard />
          <TopDataSourcesCard />
        </div>
      </div>
    </>
  );
}
