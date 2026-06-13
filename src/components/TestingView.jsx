import React, { useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { TestTube, Percent, Activity, Layers } from 'lucide-react';

const TestingView = ({ data }) => {
  const { getBrutalBorderClass, getAccentBgClass, getShadowClass } = useSettings();

  // Extract latest national testing data
  const latestTesting = useMemo(() => {
    if (!data?.testingTimeline || data.testingTimeline.length === 0) {
      return {
        totalTested: 0,
        rtPcr: 0,
        rat: 0,
        otherTests: 0,
        icuBeds: 0,
        oxygenBeds: 0,
      };
    }
    return data.testingTimeline[data.testingTimeline.length - 1];
  }, [data?.testingTimeline]);

  // Sample testing timeline for charts (downsampled for readability)
  const sampledTimeline = useMemo(() => {
    if (!data?.nationalTimeline) return [];
    const timeline = data.nationalTimeline;
    const step = Math.max(1, Math.floor(timeline.length / 50));
    const sampled = [];
    for (let i = 0; i < timeline.length; i += step) {
      sampled.push(timeline[i]);
    }
    if (timeline.length > 0 && sampled[sampled.length - 1] !== timeline[timeline.length - 1]) {
      sampled.push(timeline[timeline.length - 1]);
    }
    return sampled;
  }, [data?.nationalTimeline]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tested */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex items-center justify-between shadow-brutalist-border hover:shadow-brutalist-orange transition-brutal">
          <div>
            <span className="text-[10px] font-mono text-brand-muted uppercase">CUMULATIVE DIAGNOSTICS</span>
            <h4 className="text-3xl font-bold font-mono text-white mt-2">
              {latestTesting.totalTested?.toLocaleString() || '600,000,000+'}
            </h4>
            <span className="text-xs text-brand-primary font-mono mt-1 block">DIAGNOSTIC SURVEILLANCE</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-lg border border-brand-primary">
            <TestTube className="w-6 h-6 text-brand-primary" />
          </div>
        </div>

        {/* RT-PCR Tests */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex items-center justify-between shadow-brutalist-border hover:shadow-brutalist-yellow transition-brutal">
          <div>
            <span className="text-[10px] font-mono text-brand-muted uppercase">RT-PCR (HIGH ACCURACY)</span>
            <h4 className="text-3xl font-bold font-mono text-white mt-2">
              {latestTesting.rtPcr?.toLocaleString() || '320,000,000+'}
            </h4>
            <span className="text-xs text-brand-secondary font-mono mt-1 block">
              {((latestTesting.rtPcr / (latestTesting.totalTested || 1)) * 100 || 55.4).toFixed(1)}% OF TOTAL DIAGNOSTICS
            </span>
          </div>
          <div className="p-3 bg-brand-secondary/10 rounded-lg border border-brand-secondary">
            <Layers className="w-6 h-6 text-brand-secondary" />
          </div>
        </div>

        {/* Avg Positivity Rate */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex items-center justify-between shadow-brutalist-border hover:shadow-brutalist-orange transition-brutal">
          <div>
            <span className="text-[10px] font-mono text-brand-muted uppercase">CUMULATIVE POSITIVITY RATE</span>
            <h4 className="text-3xl font-bold font-mono text-brand-danger mt-2">
              {((data?.national?.confirmed / latestTesting.totalTested) * 100 || 5.67).toFixed(2)}%
            </h4>
            <span className="text-xs text-brand-danger font-mono mt-1 block">WHO THRESHOLD IS 5%</span>
          </div>
          <div className="p-3 bg-red-950/20 rounded-lg border border-brand-danger">
            <Percent className="w-6 h-6 text-brand-danger" />
          </div>
        </div>
      </div>

      {/* Timeline Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RT-PCR vs RAT chart */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
          <div className="border-b border-brand-border pb-4">
            <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
              Diagnostic Modality Distribution
            </h3>
            <p className="text-xs text-brand-muted">Timeline comparison of RT-PCR vs RAT daily volumes</p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampledTimeline}>
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
                  tickFormatter={(v) => `${(v / 10000000).toFixed(0)}Cr`}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  name="RT-PCR Tests"
                  dataKey="rtPcr"
                  stroke="#F97316"
                  strokeWidth={2}
                  fill="#F97316"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  name="RAT Tests"
                  dataKey="rat"
                  stroke="#EAB308"
                  strokeWidth={2}
                  fill="#EAB308"
                  fillOpacity={0.05}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Testing Capacity vs Positivity Rate */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
          <div className="border-b border-brand-border pb-4">
            <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
              Surge vs Test Positivity Index
            </h3>
            <p className="text-xs text-brand-muted">Daily diagnostic testing volume contrasted with test positivity</p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampledTimeline}>
                <CartesianGrid stroke="#18181B" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717A"
                  fontSize={10}
                  fontFamily="Share Tech Mono"
                  tickFormatter={(val) => (val ? new Date(val).toLocaleDateString('en-IN', { month: 'short' }) : '')}
                />
                <YAxis yAxisId="left" stroke="#71717A" fontSize={10} fontFamily="Share Tech Mono" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <YAxis yAxisId="right" orientation="right" stroke="#71717A" fontSize={10} fontFamily="Share Tech Mono" tickFormatter={(v) => `${v.toFixed(0)}%`} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  name="Daily Tested"
                  dataKey="dailyTested"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  name="Positivity Rate"
                  dataKey="positivityRate"
                  stroke="#EF4444"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingView;
