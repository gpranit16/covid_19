import React, { useState, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Search, MapPin, ArrowRightLeft, TrendingUp, Info } from 'lucide-react';

const StateAnalyticsView = ({ data }) => {
  const { getBrutalBorderClass, getAccentBgClass, getAccentTextClass, getShadowClass } = useSettings();
  const [selectedStateA, setSelectedStateA] = useState('Maharashtra');
  const [selectedStateB, setSelectedStateB] = useState('Delhi');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [chartMetric, setChartMetric] = useState('confirmed'); // 'confirmed' | 'positivity'

  // Available states sorted alphabetically
  const stateNames = useMemo(() => {
    if (!data?.states) return [];
    return data.states.map((s) => s.stateName).sort();
  }, [data?.states]);

  // Selected State Details
  const stateDetailsA = useMemo(() => {
    return data?.states?.find((s) => s.stateName === selectedStateA) || null;
  }, [data?.states, selectedStateA]);

  const stateDetailsB = useMemo(() => {
    return data?.states?.find((s) => s.stateName === selectedStateB) || null;
  }, [data?.states, selectedStateB]);

  // Combined timeline data for chart
  const combinedTimelineData = useMemo(() => {
    const timelineA = data?.stateTesting?.[selectedStateA] || [];
    const timelineB = data?.stateTesting?.[selectedStateB] || [];
    const vaxA = data?.stateVaccination?.[selectedStateA] || [];
    const vaxB = data?.stateVaccination?.[selectedStateB] || [];

    // Map by date
    const merged = [];
    const maxLen = Math.max(timelineA.length, 120); // sample down or slice
    
    // To make chart readable, sample dates (e.g. every 5th record or weekly)
    const step = 5;
    for (let i = 0; i < timelineA.length; i += step) {
      const recA = timelineA[i];
      if (!recA) continue;
      const recB = timelineB.find((x) => x.date === recA.date) || { positive: 0, totalTested: 0 };
      const vRecA = vaxA.find((x) => x.date === recA.date) || { totalDoses: 0 };
      const vRecB = vaxB.find((x) => x.date === recA.date) || { totalDoses: 0 };

      merged.push({
        date: recA.date,
        [selectedStateA + '_positives']: recA.positive || 0,
        [selectedStateB + '_positives']: recB.positive || 0,
        [selectedStateA + '_positivity']: recA.positivityRate || 0,
        [selectedStateB + '_positivity']: recB.positivityRate || 0,
        [selectedStateA + '_vax']: vRecA.totalDoses || 0,
        [selectedStateB + '_vax']: vRecB.totalDoses || 0,
      });
    }
    return merged;
  }, [data, selectedStateA, selectedStateB]);

  return (
    <div className="space-y-6">
      {/* State Selector Control Bar */}
      <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Selector A */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-brand-muted uppercase">PRIMARY STATE</label>
              <select
                value={selectedStateA}
                onChange={(e) => setSelectedStateA(e.target.value)}
                className="bg-brand-bg text-white px-4 py-2 border-2 border-brand-border rounded-lg text-xs font-mono focus:outline-none focus:border-brand-primary"
              >
                {stateNames.map((name) => (
                  <option key={name} value={name}>
                    {name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Compare Toggle */}
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`flex items-center gap-2 px-4 py-2 mt-5 border-2 rounded-lg text-xs font-mono uppercase font-bold transition-brutal shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                isCompareMode
                  ? `${getAccentBgClass()} text-black border-black`
                  : 'bg-brand-bg text-white border-brand-border hover:border-brand-primary'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 shrink-0" />
              <span>{isCompareMode ? 'COMPARING ON' : 'COMPARE REGIONS'}</span>
            </button>

            {/* Selector B */}
            {isCompareMode && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-[10px] font-mono text-brand-muted uppercase">COMPARISON STATE</label>
                <select
                  value={selectedStateB}
                  onChange={(e) => setSelectedStateB(e.target.value)}
                  className="bg-brand-bg text-white px-4 py-2 border-2 border-brand-border rounded-lg text-xs font-mono focus:outline-none focus:border-brand-primary"
                >
                  {stateNames.map((name) => (
                    <option key={name} value={name}>
                      {name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {isCompareMode && (
            <div className="flex bg-brand-bg rounded-lg border border-brand-border p-1 mt-4 md:mt-0">
              <button
                onClick={() => setChartMetric('confirmed')}
                className={`px-3 py-1 text-xs font-mono rounded uppercase transition-brutal ${
                  chartMetric === 'confirmed' ? 'bg-brand-primary text-black font-bold' : 'text-brand-muted hover:text-white'
                }`}
              >
                CASES
              </button>
              <button
                onClick={() => setChartMetric('positivity')}
                className={`px-3 py-1 text-xs font-mono rounded uppercase transition-brutal ${
                  chartMetric === 'positivity' ? 'bg-brand-primary text-black font-bold' : 'text-brand-muted hover:text-white'
                }`}
              >
                POSITIVITY RATE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid or Single State Grid */}
      {!isCompareMode ? (
        stateDetailsA && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Details Card */}
            <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-border pb-4">
                <MapPin className="w-6 h-6 text-brand-primary" />
                <div>
                  <h3 className="text-xl font-bold font-condensed tracking-tight uppercase text-white">
                    {stateDetailsA.stateName}
                  </h3>
                  <span className="text-[10px] font-mono text-brand-muted uppercase">CODE: {stateDetailsA.stateCode}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-brand-muted font-mono uppercase tracking-wider mb-1">CUMULATIVE CONFIRMED</div>
                  <div className="text-2xl font-bold font-mono text-white leading-none">
                    {stateDetailsA.confirmed?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-brand-muted font-mono uppercase tracking-wider mb-1">ACTIVE VIRAL CASES</div>
                  <div className="text-2xl font-bold font-mono text-brand-secondary leading-none">
                    {stateDetailsA.active?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-brand-muted font-mono uppercase tracking-wider mb-1">PATIENT RECOVERIES</div>
                  <div className="text-2xl font-bold font-mono text-brand-success leading-none">
                    {stateDetailsA.recovered?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-brand-muted font-mono uppercase tracking-wider mb-1">TOTAL MORTALITIES</div>
                  <div className="text-2xl font-bold font-mono text-brand-danger leading-none">
                    {stateDetailsA.deaths?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-brand-bg p-4 rounded-lg border border-brand-border space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-brand-muted">RECOVERY RATE</span>
                  <span className="text-brand-success font-bold">{stateDetailsA.recoveryRate?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">CASE FATALITY RATE</span>
                  <span className="text-brand-danger font-bold">{stateDetailsA.deathRate?.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Timelines and Details Charts */}
            <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border lg:col-span-2 space-y-4">
              <div className="border-b border-brand-border pb-4">
                <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
                  Testing Positivity Timeline
                </h3>
                <p className="text-xs text-brand-muted">Positivity rate progression computed daily for {selectedStateA}</p>
              </div>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.stateTesting?.[selectedStateA] || []}>
                    <CartesianGrid stroke="#18181B" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#71717A"
                      fontSize={10}
                      fontFamily="Share Tech Mono"
                      tickFormatter={(val) => (val ? new Date(val).toLocaleDateString('en-IN', { month: 'short' }) : '')}
                    />
                    <YAxis stroke="#71717A" fontSize={10} fontFamily="Share Tech Mono" tickFormatter={(v) => `${v.toFixed(1)}%`} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      name="Positivity Rate"
                      dataKey="positivityRate"
                      stroke="#F97316"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )
      ) : (
        /* Side by Side Compare View */
        stateDetailsA && stateDetailsB && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* State A Card */}
              <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
                <div className="flex justify-between items-center border-b border-brand-border pb-3">
                  <span className="text-lg font-bold text-white uppercase">{stateDetailsA.stateName}</span>
                  <span className="bg-brand-primary text-black px-2 py-0.5 rounded font-mono text-[10px] font-bold">PRIMARY</span>
                </div>
                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-brand-muted uppercase block">CONFIRMED</span>
                    <span className="text-lg font-bold text-white">{stateDetailsA.confirmed?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted uppercase block">RECOVERED</span>
                    <span className="text-lg font-bold text-brand-success">{stateDetailsA.recovered?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted uppercase block">RECOVERY RATE</span>
                    <span className="text-lg font-bold text-brand-success">{stateDetailsA.recoveryRate?.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-brand-muted uppercase block">DEATH RATE</span>
                    <span className="text-lg font-bold text-brand-danger">{stateDetailsA.deathRate?.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              {/* State B Card */}
              <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
                <div className="flex justify-between items-center border-b border-brand-border pb-3">
                  <span className="text-lg font-bold text-white uppercase">{stateDetailsB.stateName}</span>
                  <span className="bg-brand-secondary text-black px-2 py-0.5 rounded font-mono text-[10px] font-bold">COMPARE</span>
                </div>
                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-brand-muted uppercase block">CONFIRMED</span>
                    <span className="text-lg font-bold text-white">{stateDetailsB.confirmed?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted uppercase block">RECOVERED</span>
                    <span className="text-lg font-bold text-brand-success">{stateDetailsB.recovered?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted uppercase block">RECOVERY RATE</span>
                    <span className="text-lg font-bold text-brand-success">{stateDetailsB.recoveryRate?.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-brand-muted uppercase block">DEATH RATE</span>
                    <span className="text-lg font-bold text-brand-danger">{stateDetailsB.deathRate?.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Timeline Chart */}
            <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
              <div className="border-b border-brand-border pb-4">
                <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
                  Comparative Trend Projection
                </h3>
                <p className="text-xs text-brand-muted">
                  Tracing {chartMetric === 'confirmed' ? 'positives' : 'positivity rate'} curves of {selectedStateA} vs {selectedStateB}
                </p>
              </div>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedTimelineData}>
                    <CartesianGrid stroke="#18181B" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#71717A"
                      fontSize={10}
                      fontFamily="Share Tech Mono"
                      tickFormatter={(val) => (val ? new Date(val).toLocaleDateString('en-IN', { month: 'short' }) : '')}
                    />
                    <YAxis
                      stroke="#71717A"
                      fontSize={10}
                      fontFamily="Share Tech Mono"
                      tickFormatter={(v) => (chartMetric === 'confirmed' ? (v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v.toLocaleString()) : `${v.toFixed(1)}%`)}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      name={`${selectedStateA} (${chartMetric === 'confirmed' ? 'Cases' : 'Positivity'})`}
                      dataKey={chartMetric === 'confirmed' ? `${selectedStateA}_positives` : `${selectedStateA}_positivity`}
                      stroke="#F97316"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      name={`${selectedStateB} (${chartMetric === 'confirmed' ? 'Cases' : 'Positivity'})`}
                      dataKey={chartMetric === 'confirmed' ? `${selectedStateB}_positives` : `${selectedStateB}_positivity`}
                      stroke="#EAB308"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default StateAnalyticsView;
