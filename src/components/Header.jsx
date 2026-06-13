import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Cpu, Calendar, AlertTriangle, Menu } from 'lucide-react';

const Header = ({ activeTab, data, toggleInsights, isInsightsOpen, onMenuClick }) => {
  const { getBrutalBorderClass, getAccentBgClass, getAccentTextClass } = useSettings();

  const getPageMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'PANDEMIC COMMAND CENTER', subtitle: 'Real-time overview of key COVID-19 indicators in India' };
      case 'states':
        return { title: 'STATE PROFILE ANALYTICS', subtitle: 'Granular monitoring and comparative study of individual states' };
      case 'vaccination':
        return { title: 'IMMUNIZATION TRACKER', subtitle: 'Progress of Dose 1, Dose 2, gender, and manufacturer distributions' };
      case 'testing':
        return { title: 'TESTING & DIAGNOSTICS', subtitle: 'RT-PCR to RAT testing ratios, daily capacities, and test positivity rates' };
      case 'waves':
        return { title: 'EPIDEMIOLOGICAL WAVE DYNAMICS', subtitle: 'Comparative timeline and peaks analysis of Wave 1 vs Wave 2' };
      case 'predictions':
        return { title: 'AI FORECASTING SIMULATOR', subtitle: 'Mathematical SIR model modeling future wave trajectories based on inputs' };
      case 'reports':
        return { title: 'DATA ARCHIVE & REPORTS', subtitle: 'Raw data tables and file exports in standard CSV formats' };
      case 'settings':
        return { title: 'SYSTEM PREFERENCES', subtitle: 'Customize Neo-Brutalist themes, border sizes, and visual spacing density' };
      default:
        return { title: 'COVID-19 INDIA INTELLIGENCE', subtitle: 'Historical database dashboard' };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <header
      className="bg-brand-card p-4 sm:p-6 border-b-2 border-brand-border flex items-center justify-between sticky top-0 z-30"
      style={{ borderBottomWidth: getBrutalBorderClass().borderWidth }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded border-2 border-brand-border hover:border-brand-primary text-white transition-brutal bg-brand-bg shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1.5">
            {title}
          </h2>
          <p className="text-[10px] sm:text-xs text-brand-muted">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Date / Archive info */}
        <div className="hidden lg:flex items-center gap-3 bg-brand-bg px-4 py-2 rounded-lg border border-brand-border text-[10px] font-mono">
          <Calendar className="w-4 h-4 text-brand-primary" />
          <div>
            <div className="text-brand-muted uppercase text-[8px] leading-none mb-0.5">ARCHIVE RANGE</div>
            <div className="text-white leading-none font-bold">2020-01-30 to 2021-10-31</div>
          </div>
        </div>

        {/* Warning Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-yellow-950/20 border border-brand-secondary text-brand-secondary px-3 py-2 rounded-lg text-[10px] font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="uppercase text-[9px] font-bold">HISTORICAL RECORDS</span>
        </div>

        {/* AI Insight Trigger */}
        <button
          onClick={toggleInsights}
          className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 border-black transition-brutal shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
            isInsightsOpen ? 'bg-black text-brand-primary' : `${getAccentBgClass()} text-black`
          }`}
        >
          <Cpu className="w-4 h-4 shrink-0 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold uppercase font-heading">AI Insights</span>
          <span className="hidden xs:inline bg-black text-white px-1.5 py-0.5 text-[8px] rounded-full font-mono font-bold ml-1.5">
            NEW
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
