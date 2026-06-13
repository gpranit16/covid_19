import React, { useState, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Search,
  ArrowUpDown,
  Activity,
  Heart,
  Skull,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

const DashboardView = ({ data }) => {
  const { getBrutalBorderClass, getAccentTextClass, getShadowClass, getAccentBgClass } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('confirmed');
  const [sortAsc, setSortAsc] = useState(false);
  const [chartScope, setChartScope] = useState('all'); // '30', '90', 'all'

  // National metrics
  const national = data?.national || {
    confirmed: 0,
    active: 0,
    recovered: 0,
    deaths: 0,
    deltaConfirmed: 0,
    deltaRecovered: 0,
    deltaDeaths: 0,
  };

  const recoveryRate = national.confirmed > 0 ? (national.recovered / national.confirmed) * 100 : 0;
  const deathRate = national.confirmed > 0 ? (national.deaths / national.confirmed) * 100 : 0;

  // Filter and sort states
  const filteredStates = useMemo(() => {
    if (!data?.states) return [];
    let list = [...data.states];
    if (searchTerm) {
      list = list.filter((s) =>
        s.stateName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    list.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      if (sortAsc) {
        return fieldA > fieldB ? 1 : -1;
      }
      return fieldA < fieldB ? 1 : -1;
    });
    return list;
  }, [data?.states, searchTerm, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Timeline chart data filtering
  const timelineData = useMemo(() => {
    if (!data?.nationalTimeline) return [];
    const raw = data.nationalTimeline;
    if (chartScope === '30') return raw.slice(-30);
    if (chartScope === '90') return raw.slice(-90);
    return raw;
  }, [data?.nationalTimeline, chartScope]);

  // Format tick date strings
  const formatChartDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Confirmed */}
        <div
          className={`bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex flex-col justify-between transition-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:${getShadowClass()}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-brand-muted uppercase">CONFIRMED CASES</span>
            <div className="p-2 bg-brand-primary/10 rounded-lg border border-brand-primary">
              <Activity className="w-5 h-5 text-brand-primary" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-white mb-2">
              {national.confirmed?.toLocaleString()}
            </div>
            {national.deltaConfirmed > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-mono bg-red-950/30 border border-brand-danger text-brand-danger px-2 py-0.5 rounded-full font-bold">
                +{national.deltaConfirmed?.toLocaleString()} DAILY
              </span>
            )}
          </div>
        </div>

        {/* Active */}
        <div
          className={`bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex flex-col justify-between transition-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:${getShadowClass()}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-brand-muted uppercase">ACTIVE VIRUS LOCK</span>
            <div className="p-2 bg-brand-secondary/10 rounded-lg border border-brand-secondary">
              <TrendingUp className="w-5 h-5 text-brand-secondary" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-white mb-2">
              {national.active?.toLocaleString()}
            </div>
            <span className="text-xs font-mono text-brand-muted">
              {((national.active / national.confirmed) * 100 || 0).toFixed(2)}% OF TOTAL CASES
            </span>
          </div>
        </div>

        {/* Recoveries */}
        <div
          className={`bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex flex-col justify-between transition-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:${getShadowClass()}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-brand-muted uppercase">RECOVERED PATIENTS</span>
            <div className="p-2 bg-brand-success/10 rounded-lg border border-brand-success">
              <ShieldCheck className="w-5 h-5 text-brand-success" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-white mb-2">
              {national.recovered?.toLocaleString()}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono bg-green-950/30 border border-brand-success text-brand-success px-2 py-0.5 rounded-full font-bold">
              {recoveryRate.toFixed(2)}% RATE
            </span>
          </div>
        </div>

        {/* Deaths */}
        <div
          className={`bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex flex-col justify-between transition-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:${getShadowClass()}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-brand-muted uppercase">DEATH TOLL</span>
            <div className="p-2 bg-red-950/20 rounded-lg border border-brand-danger">
              <Skull className="w-5 h-5 text-brand-danger" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-brand-danger mb-2">
              {national.deaths?.toLocaleString()}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono bg-red-950/30 border border-brand-danger text-brand-danger px-2 py-0.5 rounded-full font-bold">
              {deathRate.toFixed(2)}% RATE
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Charts Card */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
            <div>
              <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
                National Epidemic Growth
              </h3>
              <p className="text-xs text-brand-muted">Cumulative confirmed cases and daily infection surges</p>
            </div>
            <div className="flex bg-brand-bg rounded-lg border border-brand-border p-1">
              {['30', '90', 'all'].map((scope) => (
                <button
                  key={scope}
                  onClick={() => setChartScope(scope)}
                  className={`px-3 py-1 text-xs font-mono rounded uppercase transition-brutal ${
                    chartScope === scope
                      ? 'bg-brand-primary text-black font-bold'
                      : 'text-brand-muted hover:text-white'
                  }`}
                >
                  {scope === 'all' ? 'FULL' : `${scope}D`}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#18181B" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                  stroke="#71717A"
                  fontSize={10}
                  fontFamily="Share Tech Mono"
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={10}
                  fontFamily="Share Tech Mono"
                  tickFormatter={(val) => (val >= 10000000 ? `${(val / 10000000).toFixed(1)}Cr` : val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val.toLocaleString())}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  name="Total Confirmed"
                  dataKey="cumulativeConfirmed"
                  stroke="#F97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConfirmed)"
                />
                <Line
                  type="monotone"
                  name="Daily Confirmed Cases (Avg)"
                  dataKey="dailyConfirmed"
                  stroke="#EAB308"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rankings Sidebar */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-brand-border pb-4 mb-4">
              <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
                Highest Case Loads
              </h3>
              <p className="text-xs text-brand-muted">Top 5 states representing the primary hotzones</p>
            </div>
            <div className="space-y-4">
              {data?.states?.slice(0, 5).map((st, idx) => {
                const maxConfirmed = data.states[0]?.confirmed || 1;
                const pct = (st.confirmed / maxConfirmed) * 100;
                return (
                  <div key={st.stateCode} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-white uppercase flex items-center gap-1.5">
                        <span className="text-[10px] text-brand-primary font-bold">0{idx + 1}.</span>
                        {st.stateName}
                      </span>
                      <span className="text-brand-muted">{st.confirmed?.toLocaleString()} cases</span>
                    </div>
                    <div className="w-full bg-brand-bg h-2.5 rounded-full overflow-hidden border border-brand-border">
                      <div
                        className="bg-brand-primary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-brand-bg p-4 rounded-lg border border-brand-border flex gap-3 text-xs text-brand-muted leading-relaxed font-mono">
            <Info className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase">EPIDEMIC HUB WARNING</span>
              <p className="mt-1">
                Maharashtra (MH), Kerala (KL), Karnataka (KA), and Tamil Nadu (TN) accounted for over 50% of cumulative cases nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* States Data Table Panel */}
      <div className="bg-brand-card rounded-brutalist border-2 border-brand-border overflow-hidden">
        <div className="p-6 border-b-2 border-brand-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-brand-card">
          <div>
            <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
              State-wise Epidemiology Index
            </h3>
            <p className="text-xs text-brand-muted">Interactive searchable register of regional metrics</p>
          </div>

          {/* Search box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="SEARCH REGION..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-bg text-white pl-10 pr-4 py-2 border-2 border-brand-border rounded-lg text-xs font-mono focus:outline-none focus:border-brand-primary placeholder:text-brand-muted transition-brutal"
            />
          </div>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-brand-bg border-b border-brand-border text-brand-muted">
                <th
                  onClick={() => handleSort('stateName')}
                  className="p-4 uppercase cursor-pointer hover:text-white select-none transition-brutal"
                >
                  <div className="flex items-center gap-1.5">
                    STATE / TERRITORY
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('confirmed')}
                  className="p-4 uppercase cursor-pointer hover:text-white select-none transition-brutal text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    CONFIRMED
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('active')}
                  className="p-4 uppercase cursor-pointer hover:text-white select-none transition-brutal text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    ACTIVE
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('recovered')}
                  className="p-4 uppercase cursor-pointer hover:text-white select-none transition-brutal text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    RECOVERED
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('deaths')}
                  className="p-4 uppercase cursor-pointer hover:text-white select-none transition-brutal text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    DEATHS
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('recoveryRate')}
                  className="p-4 uppercase cursor-pointer hover:text-white select-none transition-brutal text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    RECOVERY RATE
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-white">
              {filteredStates.length > 0 ? (
                filteredStates.map((st) => (
                  <tr key={st.stateCode} className="hover:bg-brand-bg/50 transition-brutal">
                    <td className="p-4 font-bold text-white uppercase">{st.stateName}</td>
                    <td className="p-4 text-right font-bold text-brand-primary">{st.confirmed?.toLocaleString()}</td>
                    <td className="p-4 text-right text-brand-secondary">{st.active?.toLocaleString()}</td>
                    <td className="p-4 text-right text-brand-success">{st.recovered?.toLocaleString()}</td>
                    <td className="p-4 text-right text-brand-danger font-bold">{st.deaths?.toLocaleString()}</td>
                    <td className="p-4 text-right text-brand-success font-bold">{st.recoveryRate?.toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-brand-muted uppercase font-bold">
                    No matching states detected in registers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
