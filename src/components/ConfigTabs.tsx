import { NavLink } from 'react-router-dom';

const tabs = [
  { label: 'Settings', to: '/settings' },
  { label: 'Billing', to: '/billing' },
];

export function ConfigTabs() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">Config</p>
        <h1 className="text-2xl font-bold text-foreground">Config</h1>
      </div>

      <div className="flex items-center gap-5 border-b border-border">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/settings'}
            className={({ isActive }) =>
              `-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
