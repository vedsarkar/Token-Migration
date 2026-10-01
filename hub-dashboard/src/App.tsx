import { useEffect, type ComponentType } from 'react';
import { Link, navigate, usePath } from './router';
import ProfileStats from './pages/ProfileStats';

import avatar from './assets/avatar.png';
import arrowDown from './assets/t2-arrow-down.svg';
import bell from './assets/t2-bell.svg';
import building from './assets/t2-building.svg';
import help from './assets/t2-help.svg';
import logo from './assets/t2-logo.svg';
import menu from './assets/t2-menu.svg';
import navBarChart from './assets/t2-nav-barchart.svg';
import navConversations from './assets/t2-nav-conversations.svg';
import navDevelop from './assets/t2-nav-develop.svg';
import navDiscover from './assets/t2-nav-discover.svg';
import navSpaces from './assets/t2-nav-spaces.svg';
import overflow from './assets/t2-overflow.svg';
import reltioLogo from './assets/t2-reltio-logo.svg';
import search from './assets/t2-search.svg';

type NavItem = {
  label: string;
  icon: string;
  /** Present once the entry has a page; entries without one are not yet routed. */
  path?: string;
  page?: ComponentType;
};

// Side navigation order comes from the design. Adding a page means filling in
// `path` and `page` here — the nav link, the route, and the title follow.
const navItems: NavItem[] = [
  { label: 'Conversations', icon: navConversations, path: '/Profile_stats', page: ProfileStats },
  { label: 'Discover', icon: navDiscover },
  { label: 'Spaces', icon: navSpaces },
  { label: 'Analytics', icon: navBarChart },
  { label: 'Develop', icon: navDevelop },
];

const routes = navItems.filter((item) => item.path && item.page);
const HOME = '/Profile_stats';

function ShellBar() {
  return (
    <header className="shell">
      <div className="shell-side">
        <button type="button" className="icon-button icon-button--shell" aria-label="Open menu">
          <img src={menu} alt="" />
        </button>
        <img src={reltioLogo} alt="Reltio" width={51} height={11} />
        <span className="shell-separator" />
        <button type="button" className="icon-button shell-tenant">
          <img src={building} alt="" />
          Tenant environment
          <img src={arrowDown} alt="" />
        </button>
      </div>

      <div className="shell-side">
        <div className="shell-search">
          <input type="search" placeholder="Search" aria-label="Search" />
          <button type="button" className="icon-button" aria-label="Submit search">
            <img src={search} alt="" />
          </button>
        </div>
        <button type="button" className="icon-button icon-button--shell" aria-label="Notifications">
          <img src={bell} alt="" />
        </button>
        <button type="button" className="icon-button icon-button--shell" aria-label="Help">
          <img src={help} alt="" />
        </button>
        <button type="button" className="icon-button icon-button--shell" aria-label="More actions">
          <img src={overflow} alt="" />
        </button>
        <img className="shell-avatar" src={avatar} alt="Your profile" />
      </div>
    </header>
  );
}

function SideNavigation({ path }: { path: string }) {
  return (
    <nav className="side-nav" aria-label="Main">
      <span className="nav-logo">
        <img src={logo} alt="" width={20} height={20} />
      </span>
      <div className="nav-items">
        {navItems.map((item) =>
          item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className="nav-item"
              title={item.label}
              aria-label={item.label}
              aria-current={item.path === path ? 'page' : undefined}
            >
              <img src={item.icon} alt="" width={20} height={20} />
            </Link>
          ) : (
            <span key={item.label} className="nav-item" title={item.label} aria-label={item.label}>
              <img src={item.icon} alt="" width={20} height={20} />
            </span>
          ),
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const path = usePath();
  const route = routes.find((item) => item.path === path);

  useEffect(() => {
    if (!route) navigate(HOME, { replace: true });
  }, [route]);

  useEffect(() => {
    if (route) document.title = 'Reltio Hub · Profile stats';
  }, [route]);

  const Page = route?.page;

  return (
    <div className="app">
      <ShellBar />
      <div className="app-body">
        <SideNavigation path={path} />
        <main className="content-pane">{Page && <Page />}</main>
      </div>
    </div>
  );
}
