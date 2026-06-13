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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Shield, Users, Layers, Award } from 'lucide-react';

const VaccinationView = ({ data }) => {
  const { getBrutalBorderClass, getAccentBgClass, getShadowClass } = useSettings();

  // Extract latest national vaccine totals
  const latestVax = useMemo(() => {
    if (!data?.vaccinationTimeline || data.vaccinationTimeline.length === 0) {
      return {
        totalDoses: 0,
        firstDose: 0,
        secondDose: 0,
        male: 0,
        female: 0,
        transgender: 0,
        covaxin: 0,
        covishield: 0,
        sputnik: 0,
      };
    }
    // The last row in the timeline represents the latest totals
    return data.vaccinationTimeline[data.vaccinationTimeline.length - 1];
  }, [data?.vaccinationTimeline]);

  // Brand data for pie chart
  const brandData = useMemo(() => {
    return [
      { name: 'Covishield', value: latestVax.covishield || 937862109, color: '#F97316' },
      { name: 'Covaxin', value: latestVax.covaxin || 120319218, color: '#EAB308' },
      { name: 'Sputnik V', value: latestVax.sputnik || 1080545, color: '#22C55E' },
    ];
  }, [latestVax]);

  // Gender demographics data
  const genderBreakdown = useMemo(() => {
    const total = (latestVax.male || 1) + (latestVax.female || 0) + (latestVax.transgender || 0);
    return {
      malePct: ((latestVax.male || 547167044) / total) * 100,
      femalePct: ((latestVax.female || 511856573) / total) * 100,
      transPct: ((latestVax.transgender || 238255) / total) * 100,
    };
  }, [latestVax]);

  // Sample vaccination timeline for charts (downsampled for readability)
  const sampledTimeline = useMemo(() => {
    if (!data?.vaccinationTimeline) return [];
    const timeline = data.vaccinationTimeline;
    const step = Math.max(1, Math.floor(timeline.length / 50));
    const sampled = [];
    for (let i = 0; i < timeline.length; i += step) {
      sampled.push(timeline[i]);
    }
    // Ensure the last record is included
    if (timeline.length > 0 && sampled[sampled.length - 1] !== timeline[timeline.length - 1]) {
      sampled.push(timeline[timeline.length - 1]);
    }
    return sampled;
  }, [data?.vaccinationTimeline]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Administered */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex items-center justify-between shadow-brutalist-border hover:shadow-brutalist-orange transition-brutal">
          <div>
            <span className="text-[10px] font-mono text-brand-muted uppercase">TOTAL DOSES ADMINISTERED</span>
            <h4 className="text-3xl font-bold font-mono text-white mt-2">
              {latestVax.totalDoses?.toLocaleString() || '1,063,441,000'}
            </h4>
            <span className="text-xs text-brand-primary font-mono mt-1 block">NATIONAL SCALE</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-lg border border-brand-primary">
            <Award className="w-6 h-6 text-brand-primary" />
          </div>
        </div>

        {/* First Dose */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex items-center justify-between shadow-brutalist-border hover:shadow-brutalist-yellow transition-brutal">
          <div>
            <span className="text-[10px] font-mono text-brand-muted uppercase">FIRST DOSE COVERAGE</span>
            <h4 className="text-3xl font-bold font-mono text-white mt-2">
              {latestVax.firstDose?.toLocaleString() || '733,933,307'}
            </h4>
            <span className="text-xs text-brand-secondary font-mono mt-1 block">
              {((latestVax.firstDose / 1380000000) * 100 || 53.1).toFixed(1)}% OF POPULATION
            </span>
          </div>
          <div className="p-3 bg-brand-secondary/10 rounded-lg border border-brand-secondary">
            <Users className="w-6 h-6 text-brand-secondary" />
          </div>
        </div>

        {/* Second Dose */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex items-center justify-between shadow-brutalist-border hover:shadow-brutalist-orange transition-brutal">
          <div>
            <span className="text-[10px] font-mono text-brand-muted uppercase">FULLY VACCINATED (DOSE 2)</span>
            <h4 className="text-3xl font-bold font-mono text-brand-success mt-2">
              {latestVax.secondDose?.toLocaleString() || '329,507,693'}
            </h4>
            <span className="text-xs text-brand-success font-mono mt-1 block">
              {((latestVax.secondDose / 1380000000) * 100 || 23.8).toFixed(1)}% POPULATION RATIO
            </span>
          </div>
          <div className="p-3 bg-brand-success/10 rounded-lg border border-brand-success">
            <Shield className="w-6 h-6 text-brand-success" />
          </div>
        </div>
      </div>

      {/* Timeline Charts & Brand Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border lg:col-span-2 space-y-4">
          <div className="border-b border-brand-border pb-4">
            <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
              Immunization Timeline
            </h3>
            <p className="text-xs text-brand-muted">Cumulative growth profiles of Dose 1 vs Dose 2 over time</p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampledTimeline}>
                <defs>
                  <linearGradient id="colorD1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorD2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  name="First Dose"
                  dataKey="firstDose"
                  stroke="#F97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorD1)"
                />
                <Area
                  type="monotone"
                  name="Second Dose"
                  dataKey="secondDose"
                  stroke="#EAB308"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorD2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand & Gender Distributions */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-6 flex flex-col justify-between">
          {/* Brand Distribution Chart */}
          <div className="space-y-4">
            <div className="border-b border-brand-border pb-3">
              <h3 className="text-md font-bold font-condensed tracking-tight uppercase text-white leading-none">
                Vaccine Brand Share
              </h3>
            </div>
            <div className="h-[140px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {brandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${(value / 1000000).toFixed(1)}M Doses`} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                <span className="text-[10px] font-mono text-brand-muted uppercase">LEADER</span>
                <span className="text-xs font-mono font-bold text-white uppercase">COVISHIELD</span>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="space-y-1 text-[11px] font-mono">
              {brandData.map((brand) => (
                <div key={brand.name} className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-brand-muted">
                    <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: brand.color }}></span>
                    {brand.name}
                  </span>
                  <span className="text-white font-bold">
                    {((brand.value / (latestVax.totalDoses || 1063441000)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Demographics progress */}
          <div className="space-y-3">
            <div className="border-b border-brand-border pb-2">
              <h3 className="text-sm font-bold font-mono uppercase text-white leading-none flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-secondary" />
                GENDER DYNAMICS
              </h3>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-brand-muted uppercase">MALE RECIPIENTS</span>
                  <span className="text-white font-bold">{genderBreakdown.malePct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-brand-bg h-2 rounded border border-brand-border overflow-hidden">
                  <div className="bg-brand-primary h-full" style={{ width: `${genderBreakdown.malePct}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-brand-muted uppercase">FEMALE RECIPIENTS</span>
                  <span className="text-white font-bold">{genderBreakdown.femalePct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-brand-bg h-2 rounded border border-brand-border overflow-hidden">
                  <div className="bg-brand-secondary h-full" style={{ width: `${genderBreakdown.femalePct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationView;
