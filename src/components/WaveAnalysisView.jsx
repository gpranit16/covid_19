import React, { useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ShieldAlert, RefreshCw, Zap, TrendingUp } from 'lucide-react';

const WaveAnalysisView = ({ data }) => {
  const { getBrutalBorderClass, getAccentBgClass, getShadowClass } = useSettings();

  // Construct overlay timeline data for Wave 1 vs Wave 2
  const overlayTimelineData = useMemo(() => {
    if (!data?.nationalTimeline || data.nationalTimeline.length === 0) return [];
    
    const timeline = data.nationalTimeline;

    // Wave 1 date range: 2020-07-01 to 2020-11-30 (152 days)
    // Wave 2 date range: 2021-02-15 to 2021-07-15 (150 days)
    const wave1Start = new Date('2020-07-01');
    const wave2Start = new Date('2021-02-15');

    const wave1Data = timeline.filter((t) => {
      const d = new Date(t.date);
      return d >= wave1Start && d <= new Date('2020-11-30');
    });

    const wave2Data = timeline.filter((t) => {
      const d = new Date(t.date);
      return d >= wave2Start && d <= new Date('2021-07-15');
    });

    const maxDays = Math.max(wave1Data.length, wave2Data.length);
    const merged = [];

    for (let day = 0; day < maxDays; day++) {
      const w1Rec = wave1Data[day] || { dailyConfirmed: 0 };
      const w2Rec = wave2Data[day] || { dailyConfirmed: 0 };

      merged.push({
        day: day + 1,
        wave1Cases: w1Rec.dailyConfirmed || 0,
        wave2Cases: w2Rec.dailyConfirmed || 0,
        wave1Date: w1Rec.date,
        wave2Date: w2Rec.date,
      });
    }

    return merged;
  }, [data?.nationalTimeline]);

  return (
    <div className="space-y-6">
      {/* Comparative Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wave 1 Summary */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <div>
              <span className="text-[10px] font-mono text-brand-muted uppercase">JULY 2020 - NOVEMBER 2020</span>
              <h3 className="text-xl font-bold font-condensed tracking-tight text-white uppercase">WAVE 1 (FIRST SURGE)</h3>
            </div>
            <span className="bg-brand-secondary text-black px-2 py-0.5 rounded font-mono text-[10px] font-bold">STEADY SURGE</span>
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <span className="text-brand-muted uppercase block">PEAK SURGE DATE</span>
              <span className="text-sm font-bold text-white uppercase">Sept 16, 2020</span>
            </div>
            <div>
              <span className="text-brand-muted uppercase block">PEAK DAILY CASES</span>
              <span className="text-sm font-bold text-brand-primary">~97,894 / day</span>
            </div>
            <div>
              <span className="text-brand-muted uppercase block">TOTAL CASES IN WAVE</span>
              <span className="text-sm font-bold text-white">~11,200,000</span>
            </div>
            <div>
              <span className="text-brand-muted uppercase block">PEAK DEATHS</span>
              <span className="text-sm font-bold text-brand-danger">~1,290 / day</span>
            </div>
          </div>
          <div className="bg-brand-bg p-4 rounded-lg border border-brand-border text-xs leading-relaxed text-brand-muted font-mono">
            <span className="font-bold text-white block uppercase mb-1">CHARACTERISTICS</span>
            The initial wave was marked by a steady, gradual rise and fall over a span of five months, allowing hospital infrastructures to adapt slowly.
          </div>
        </div>

        {/* Wave 2 Summary */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <div>
              <span className="text-[10px] font-mono text-brand-muted uppercase">FEBRUARY 2021 - JULY 2021</span>
              <h3 className="text-xl font-bold font-condensed tracking-tight text-white uppercase">WAVE 2 (DELTA SURGE)</h3>
            </div>
            <span className="bg-brand-primary text-black px-2 py-0.5 rounded font-mono text-[10px] font-bold">HYPER INFLATION</span>
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <span className="text-brand-muted uppercase block">PEAK SURGE DATE</span>
              <span className="text-sm font-bold text-white uppercase">May 06, 2021</span>
            </div>
            <div>
              <span className="text-brand-muted uppercase block">PEAK DAILY CASES</span>
              <span className="text-sm font-bold text-brand-primary">~414,188 / day</span>
            </div>
            <div>
              <span className="text-brand-muted uppercase block">TOTAL CASES IN WAVE</span>
              <span className="text-sm font-bold text-white">~20,400,000</span>
            </div>
            <div>
              <span className="text-brand-muted uppercase block">PEAK DEATHS</span>
              <span className="text-sm font-bold text-brand-danger">~4,180 / day</span>
            </div>
          </div>
          <div className="bg-brand-bg p-4 rounded-lg border border-brand-border text-xs leading-relaxed text-brand-muted font-mono">
            <span className="font-bold text-white block uppercase mb-1">CHARACTERISTICS</span>
            The Delta Variant (B.1.617.2) caused an extremely rapid exponential surge, exhausting medical supply reserves (oxygen, ICU beds) within weeks.
          </div>
        </div>
      </div>

      {/* Alignment Chart Overlay */}
      <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4">
        <div className="border-b border-brand-border pb-4">
          <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
            Overlaid Infection Surges
          </h3>
          <p className="text-xs text-brand-muted">Comparing cases growth curves aligned by Day of Wave start (Day 1 to 150)</p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overlayTimelineData}>
              <CartesianGrid stroke="#18181B" vertical={false} />
              <XAxis dataKey="day" stroke="#71717A" fontSize={10} fontFamily="Share Tech Mono" tickFormatter={(v) => `Day ${v}`} />
              <YAxis stroke="#71717A" fontSize={10} fontFamily="Share Tech Mono" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                labelFormatter={(value) => `Day ${value} of Wave`}
                formatter={(value, name) => [value?.toLocaleString() + " cases", name === 'wave1Cases' ? 'Wave 1 (2020)' : 'Wave 2 (2021)']}
              />
              <Legend formatter={(value) => (value === 'wave1Cases' ? 'Wave 1 (2020 Surge)' : 'Wave 2 (2021 Delta Surge)')} />
              <Line
                type="monotone"
                dataKey="wave1Cases"
                stroke="#EAB308"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="wave2Cases"
                stroke="#F97316"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WaveAnalysisView;
