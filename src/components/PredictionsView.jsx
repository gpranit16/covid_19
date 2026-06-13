import React, { useState, useMemo } from 'react';
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
import { Sliders, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const PredictionsView = () => {
  const { getBrutalBorderClass, getAccentBgClass, getShadowClass } = useSettings();

  // Model parameters state
  const [transmissionRate, setTransmissionRate] = useState(0.25); // beta
  const [recoveryPeriod, setRecoveryPeriod] = useState(10); // 1 / gamma
  const [vaxPercentage, setVaxPercentage] = useState(30); // Reduces S_0
  const [socialDistancing, setSocialDistancing] = useState(15); // Reduces beta
  const [mutantFactor, setMutantFactor] = useState(1.0); // Multiplies beta

  // Run simulation whenever parameters change
  const simulationData = useMemo(() => {
    const population = 100000000; // Simulated reference population: 100 Million
    const days = 180;
    const initialInfected = 5000;
    const recoveryRate = 1 / recoveryPeriod; // gamma

    // Calculate initial values
    const immunized = (vaxPercentage / 100) * population;
    let S = population - immunized - initialInfected;
    let I = initialInfected;
    let R = immunized;
    let D = 0;

    // Effective transmission rate (beta) adjusted for social distancing and mutants
    const effectiveBeta = transmissionRate * (1 - socialDistancing / 100) * mutantFactor;

    const results = [];

    for (let day = 1; day <= days; day++) {
      // SIR equations
      const newInfections = (effectiveBeta * S * I) / population;
      const newRecoveries = recoveryRate * I;
      
      // Assume a Case Fatality Rate of 1.4%
      const newDeaths = newRecoveries * 0.014;

      S = Math.max(0, S - newInfections);
      I = Math.max(0, I + newInfections - newRecoveries - newDeaths);
      R = Math.max(0, R + newRecoveries);
      D = Math.max(0, D + newDeaths);

      results.push({
        day,
        Susceptible: Math.round(S),
        Infected: Math.round(I),
        Recovered: Math.round(R),
        Deaths: Math.round(D),
      });
    }

    return results;
  }, [transmissionRate, recoveryPeriod, vaxPercentage, socialDistancing, mutantFactor]);

  // Extract peak info from simulation
  const peakDetails = useMemo(() => {
    let peakDay = 0;
    let maxInfected = 0;
    
    simulationData.forEach((dayData) => {
      if (dayData.Infected > maxInfected) {
        maxInfected = dayData.Infected;
        peakDay = dayData.day;
      }
    });

    const finalDeaths = simulationData[simulationData.length - 1]?.Deaths || 0;

    return {
      peakDay,
      maxInfected,
      finalDeaths,
    };
  }, [simulationData]);

  // Reset to default settings
  const handleReset = () => {
    setTransmissionRate(0.25);
    setRecoveryPeriod(10);
    setVaxPercentage(30);
    setSocialDistancing(15);
    setMutantFactor(1.0);
  };

  return (
    <div className="space-y-6">
      {/* Parameters Sliders Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Card */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <h3 className="text-lg font-bold font-condensed tracking-tight text-white uppercase flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-primary" />
              SIMULATION CONTROLS
            </h3>
            <button
              onClick={handleReset}
              className="text-brand-muted hover:text-white transition-brutal"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Transmission Rate (Beta) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-brand-muted uppercase">BASE TRANSMISSION RATE (β)</span>
                <span className="text-brand-primary font-bold">{transmissionRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.01"
                value={transmissionRate}
                onChange={(e) => setTransmissionRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Social Distancing factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-brand-muted uppercase">SOCIAL DISTANCING / LOCKDOWN</span>
                <span className="text-brand-primary font-bold">{socialDistancing}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={socialDistancing}
                onChange={(e) => setSocialDistancing(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Vaccination percentage */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-brand-muted uppercase">IMMUNITY COVERAGE (VACCINATED)</span>
                <span className="text-brand-primary font-bold">{vaxPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={vaxPercentage}
                onChange={(e) => setVaxPercentage(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Mutant Variant Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-brand-muted uppercase">MUTANT SPIKE RATE (INFECTIVITY)</span>
                <span className="text-brand-primary font-bold">{mutantFactor.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={mutantFactor}
                onChange={(e) => setMutantFactor(parseFloat(e.target.value))}
                className="w-full h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Recovery duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-brand-muted uppercase">RECOVERY RESOLUTION TIME</span>
                <span className="text-brand-primary font-bold">{recoveryPeriod} Days</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={recoveryPeriod}
                onChange={(e) => setRecoveryPeriod(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Simulation Output Charts */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
            <div>
              <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
                SIR Mathematical Prediction Curve
              </h3>
              <p className="text-xs text-brand-muted">Projections for a simulated sample population of 100M</p>
            </div>
            <div className="flex bg-brand-bg rounded-lg border border-brand-border px-3 py-1 text-[10px] font-mono text-brand-secondary">
              <Sparkles className="w-3.5 h-3.5 shrink-0 mr-1 animate-pulse" />
              DYNAMIC MODEL ENGINE RUNNING
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationData}>
                <CartesianGrid stroke="#18181B" vertical={false} />
                <XAxis dataKey="day" stroke="#71717A" fontSize={10} fontFamily="Share Tech Mono" tickFormatter={(v) => `D${v}`} />
                <YAxis stroke="#71717A" fontSize={10} fontFamily="Share Tech Mono" tickFormatter={(v) => (v >= 1000000 ? `${(v/1000000).toFixed(0)}M` : v.toLocaleString())} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Infected" stroke="#F97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Susceptible" stroke="#71717A" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="Recovered" stroke="#22C55E" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Deaths" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border font-mono text-xs space-y-1">
          <span className="text-brand-muted uppercase">PREDICTED PEAK SURGE DAY</span>
          <div className="text-2xl font-bold text-white uppercase">DAY {peakDetails.peakDay}</div>
          <span className="text-[10px] text-brand-secondary">MAX CONCURRENT INFECTIONS</span>
        </div>
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border font-mono text-xs space-y-1">
          <span className="text-brand-muted uppercase">PEAK INFECTION LOAD</span>
          <div className="text-2xl font-bold text-brand-primary">{peakDetails.maxInfected?.toLocaleString()}</div>
          <span className="text-[10px] text-brand-primary">CONCURRENT ACTIVE LOAD ON SYSTEM</span>
        </div>
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border font-mono text-xs space-y-1">
          <span className="text-brand-muted uppercase">PROJECTED DEATH TOLL</span>
          <div className="text-2xl font-bold text-brand-danger">{peakDetails.finalDeaths?.toLocaleString()}</div>
          <span className="text-[10px] text-brand-danger">ESTIMATED FATALITIES IN REFERENCE POOL</span>
        </div>
      </div>

      {/* Model explanation panel */}
      <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border flex gap-4 text-xs font-mono text-brand-muted leading-relaxed">
        <AlertCircle className="w-6 h-6 text-brand-secondary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase block mb-1">EPIDEMIOLOGICAL DISCLAIMER</span>
          This simulator operates on the classic compartmental Susceptible-Infectious-Recovered (SIR) model equations. It simulates virus transmission within a closed group of 100 Million individuals to demonstrate the impact of vaccination, contact mitigation (social distancing), and mutant strain infectivity on the "flattening of the curve".
        </div>
      </div>
    </div>
  );
};

export default PredictionsView;
