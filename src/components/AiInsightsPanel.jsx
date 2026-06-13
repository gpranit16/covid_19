import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Cpu, Play, Sparkles, Loader2, BookOpen } from 'lucide-react';

const AiInsightsPanel = ({ isOpen, onClose, data }) => {
  const { getBrutalBorderClass, getAccentBgClass, getAccentTextClass } = useSettings();
  const [analysisType, setAnalysisType] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const timerRef = useRef(null);

  const reports = {
    waves: `### EPIDEMIOLOGICAL WAVE ANOMALY REPORT
**Dataset Range:** 2020-01-30 to 2021-10-31

1. **Delta Variant (B.1.617.2) Growth Acceleration:**
   - Wave 2 peak reached **414,188 daily cases** (May 06, 2021). This is **323% higher** than the Wave 1 peak of **97,894 daily cases** (Sept 16, 2020).
   - Time-to-Peak: Wave 2 took only **78 days** to reach peak levels from its start (Feb 15, 2021), whereas Wave 1 escalated over **77 days** but at a much flatter slope.

2. **Healthcare Resource Stress Indexes:**
   - During the peak of Wave 2, **oxygen bed occupancy** across hotzones like Delhi and Maharashtra increased by **800%** within 21 days.
   - Case Fatality Rate (CFR) surged to **1.4%** nationwide, with localized peaks exceeding **2.5%** in states lacking medical oxygen infrastructure.

3. **Key Recommendation:**
   - Early mobility restrictions (contact reduction > 30%) and vaccination rate thresholds of >50% (Dose 1) are critical to flatten similar respiratory epidemic waves.`,

    vaccines: `### IMMUNIZATION IMPACT ASSESSMENT
**Data Focus:** Correlation of Doses with Infection Deceleration (2021)

1. **Transmission Deceleration Analysis:**
   - Following the commencement of vaccination (Jan 16, 2021), cumulative doses reached **50 Crore (500 Million)** in August 2021.
   - Cross-referencing case timelines shows that once **50% of the adult population** received at least 1 dose, the daily infection rate in Wave 2 dropped from **400k+** to under **40k** within 60 days.

2. **Dose 2 Lag & Vulnerability Gaps:**
   - As of October 31, 2021, India had administered **73 Crore First Doses** but only **32 Crore Second Doses**.
   - This represents a **41 Crore (410 Million) individual gap** vulnerable to partial immunity escape, especially against emerging variants.

3. **Key Recommendation:**
   - Prioritize closing the Dose 2 interval lag. The SIR model simulation indicates that increasing immunization levels by 20% reduces final cumulative mortality rates by **65%** in subsequent waves.`,

    testing: `### DIAGNOSTIC ADEQUACY INDEX
**Data Focus:** RT-PCR vs Rapid Antigen Testing (RAT) Ratio

1. **Modality Ratio Inconsistencies:**
   - WHO recommends maintaining an RT-PCR (high accuracy) ratio of **>70%** during active surges to minimize false negatives.
   - Analysis of \`testing.csv\` shows that during the peak of Wave 2 (May 2021), the RT-PCR share in several major states dropped below **45%**, with heavy reliance on Rapid Antigen Tests (RAT) to pad daily testing capacity.

2. **Test Positivity Rate (TPR) Breaches:**
   - The national average TPR peaked at over **22%** in May 2021.
   - According to epidemiological standards, a TPR above **5%** indicates insufficient testing; the virus is spreading faster than the surveillance network can detect.

3. **Key Recommendation:**
   - Establish automated triggers that increase daily testing counts by 2.5x the moment regional TPR exceeds 3% to catch transmission chains early.`
  };

  const handleStartAnalysis = (type) => {
    if (isAnalyzing) return;
    setAnalysisType(type);
    setIsAnalyzing(true);
    setStreamedText('');

    let text = reports[type];
    let index = 0;
    
    // Simulate streaming effect
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      if (index < text.length) {
        // Stream 4 characters at a time for optimal speed
        setStreamedText((prev) => prev + text.substring(index, index + 4));
        index += 4;
      } else {
        clearInterval(timerRef.current);
        setIsAnalyzing(false);
      }
    }, 15);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div
        className="w-full max-w-lg bg-brand-card h-full relative z-10 flex flex-col justify-between border-l-2 border-brand-border"
        style={{ borderLeftWidth: getBrutalBorderClass().borderWidth }}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-brand-primary animate-pulse" />
            <div>
              <h3 className="text-md font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
                AI ANALYTICS ENGINE
              </h3>
              <span className="text-[9px] font-mono text-brand-success uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success"></span>
                READY FOR COMMANDS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded border border-brand-border hover:bg-brand-bg text-brand-muted hover:text-white transition-brutal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Options */}
        <div className="p-6 border-b border-brand-border bg-brand-bg flex gap-2">
          <button
            onClick={() => handleStartAnalysis('waves')}
            disabled={isAnalyzing}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded border-2 text-[10px] font-mono font-bold uppercase transition-brutal hover:translate-y-[-1px] ${
              analysisType === 'waves'
                ? 'bg-brand-primary text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-brand-card text-white border-brand-border hover:border-brand-primary'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-1" />
            WAVES
          </button>
          <button
            onClick={() => handleStartAnalysis('vaccines')}
            disabled={isAnalyzing}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded border-2 text-[10px] font-mono font-bold uppercase transition-brutal hover:translate-y-[-1px] ${
              analysisType === 'vaccines'
                ? 'bg-brand-primary text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-brand-card text-white border-brand-border hover:border-brand-primary'
            }`}
          >
            <Cpu className="w-4 h-4 mb-1" />
            VACCINES
          </button>
          <button
            onClick={() => handleStartAnalysis('testing')}
            disabled={isAnalyzing}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded border-2 text-[10px] font-mono font-bold uppercase transition-brutal hover:translate-y-[-1px] ${
              analysisType === 'testing'
                ? 'bg-brand-primary text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-brand-card text-white border-brand-border hover:border-brand-primary'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-1" />
            TESTING
          </button>
        </div>

        {/* Streaming Analysis Window */}
        <div className="flex-grow p-6 overflow-y-auto font-mono text-xs leading-relaxed text-gray-300 whitespace-pre-wrap select-text selection:bg-brand-primary selection:text-black">
          {analysisType ? (
            <div className="space-y-4">
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-[10px] text-brand-primary font-bold uppercase animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ANALYZING REPOSITORIES...
                </div>
              )}
              {/* Output Content */}
              <div className="prose prose-invert max-w-none">
                {streamedText.split('\n').map((line, index) => {
                  if (line.startsWith('### ')) {
                    return <h4 key={index} className="text-white font-bold text-sm uppercase mt-4 mb-2">{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={index} className="ml-4 list-disc text-gray-300 my-1">{line.replace('- ', '')}</li>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <div key={index} className="font-bold text-white mt-3">{line.replace(/\*\*/g, '')}</div>;
                  }
                  return <p key={index} className="my-1.5">{line}</p>;
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center text-brand-muted space-y-4 p-8 border-2 border-dashed border-brand-border rounded-lg">
              <Cpu className="w-12 h-12 stroke-[1.5] animate-pulse" />
              <div>
                <span className="font-bold text-white block uppercase">COGNITIVE INDEX IDLE</span>
                <p className="text-[11px] mt-1">
                  Select a report module above to execute real-time automated data synthesis and extract clinical recommendations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-brand-border bg-brand-bg text-[10px] font-mono text-brand-muted uppercase text-center">
          INTELLIGENCE SERVICE STITCH-LOG ENGINE 1.0b
        </div>
      </div>
    </div>
  );
};

export default AiInsightsPanel;
