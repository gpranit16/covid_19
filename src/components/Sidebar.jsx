import React from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  LayoutDashboard,
  Map,
  Syringe,
  TestTube,
  Activity,
  Sparkles,
  Download,
  Settings,
  Shield,
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, data }) => {
  const { getBrutalBorderClass, getAccentBgClass, getAccentTextClass } = useSettings();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'states', name: 'State Analytics', icon: Map },
    { id: 'vaccination', name: 'Vaccination', icon: Syringe },
    { id: 'testing', name: 'Testing Analytics', icon: TestTube },
    { id: 'waves', name: 'Wave Analysis', icon: Activity },
    { id: 'predictions', name: 'AI Forecast', icon: Sparkles },
    { id: 'reports', name: 'Reports & Export', icon: Download },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const nationalConfirmed = data?.national?.confirmed?.toLocaleString() || '---';
  const nationalDeaths = data?.national?.deaths?.toLocaleString() || '---';

  return (
    <aside
      className="w-72 bg-brand-card flex flex-col justify-between shrink-0 h-screen sticky top-0"
      style={getBrutalBorderClass()}
    >
      {/* Brand Header */}
      <div className="p-6 border-b-2 border-brand-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand-primary/10 rounded-lg border border-brand-primary">
            <Shield className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none font-heading uppercase">
              COVID-19
            </h1>
            <span className="text-xs text-brand-primary font-mono tracking-widest uppercase">
              India Intelligence
            </span>
          </div>
        </div>
        <div className="bg-brand-bg px-3 py-1.5 rounded border border-brand-border mt-4 flex items-center justify-between">
          <span className="text-[10px] font-mono text-brand-muted uppercase">SYSTEM STATUS</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-pulse"></span>
            <span className="text-[10px] font-mono text-brand-success uppercase">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-grow overflow-y-auto px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium font-heading transition-brutal uppercase text-left border-2 ${
                isActive
                  ? `${getAccentBgClass()} text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`
                  : 'bg-transparent text-gray-400 border-transparent hover:bg-brand-bg hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Metrics */}
      <div className="p-6 border-t-2 border-brand-border space-y-4">
        <div>
          <div className="text-[10px] text-brand-muted font-mono uppercase tracking-wider mb-1">
            NATIONAL CONFIRMED
          </div>
          <div className="text-xl font-bold font-mono text-white tracking-tight leading-none">
            {nationalConfirmed}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-brand-muted font-mono uppercase tracking-wider mb-1">
            NATIONAL DEATHS
          </div>
          <div className="text-xl font-bold font-mono text-brand-danger tracking-tight leading-none">
            {nationalDeaths}
          </div>
        </div>
        <div className="text-[10px] text-brand-muted font-mono uppercase text-center pt-2">
          © 2021 ARCHIVE DATA
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
