import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Paintbrush, Sliders, RefreshCcw, Layout } from 'lucide-react';

const SettingsView = () => {
  const {
    accent,
    borderWidth,
    density,
    glowEffect,
    updateAccent,
    updateBorderWidth,
    updateDensity,
    updateGlowEffect,
    getBrutalBorderClass,
    getAccentBgClass,
  } = useSettings();

  const handleResetTheme = () => {
    updateAccent('orange');
    updateBorderWidth('2px');
    updateDensity('normal');
    updateGlowEffect(true);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Visual Customize Panel */}
      <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-8 shadow-brutalist-border">
        <div className="flex justify-between items-center border-b border-brand-border pb-4">
          <div>
            <h3 className="text-lg font-bold font-condensed tracking-tight text-white uppercase flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-brand-primary" />
              THEME ACCENTS & INTERFACE STYLE
            </h3>
            <p className="text-xs text-brand-muted">Configure the visual parameters of the Command Center</p>
          </div>
          <button
            onClick={handleResetTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-bg hover:bg-brand-border text-xs font-mono font-bold uppercase transition-brutal border border-brand-border"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            RESET
          </button>
        </div>

        <div className="space-y-6">
          {/* Accent Color Selection */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-brand-muted uppercase block">PRIMARY COLOR SYSTEM</span>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'orange', name: 'NUCLEAR ORANGE', color: 'bg-orange-500', hex: '#F97316' },
                { id: 'yellow', name: 'CYANIDE YELLOW', color: 'bg-yellow-500', hex: '#EAB308' },
                { id: 'success', name: 'EMERALD BIO-HAZARD', color: 'bg-emerald-500', hex: '#22C55E' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateAccent(theme.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 border-2 rounded-lg text-xs font-mono font-bold uppercase transition-brutal shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                    accent === theme.id ? 'bg-white text-black border-black font-extrabold' : 'bg-brand-bg text-white border-brand-border'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${theme.color}`}></span>
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Border Width Selection */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-brand-muted uppercase block">NEO-BRUTALIST BORDER WIDTH</span>
            <div className="flex gap-4">
              {[
                { id: '1px', name: 'THIN (1PX)' },
                { id: '2px', name: 'MEDIUM (2PX)' },
                { id: '3px', name: 'HEAVY (3PX)' },
              ].map((border) => (
                <button
                  key={border.id}
                  onClick={() => updateBorderWidth(border.id)}
                  className={`px-4 py-2 border-2 rounded-lg text-xs font-mono font-bold uppercase transition-brutal ${
                    borderWidth === border.id ? 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-brand-bg text-white border-brand-border'
                  }`}
                >
                  {border.name}
                </button>
              ))}
            </div>
          </div>

          {/* Glow Shadow effect */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-brand-muted uppercase block">GLOWING CARD HIGHLIGHTS</span>
            <div className="flex gap-4">
              <button
                onClick={() => updateGlowEffect(true)}
                className={`px-4 py-2 border-2 rounded-lg text-xs font-mono font-bold uppercase transition-brutal ${
                  glowEffect ? 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-brand-bg text-white border-brand-border'
                }`}
              >
                ENABLED
              </button>
              <button
                onClick={() => updateGlowEffect(false)}
                className={`px-4 py-2 border-2 rounded-lg text-xs font-mono font-bold uppercase transition-brutal ${
                  !glowEffect ? 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-brand-bg text-white border-brand-border'
                }`}
              >
                DISABLED
              </button>
            </div>
          </div>

          {/* Spacing & Density */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-brand-muted uppercase block">SYSTEM DISPLAY DENSITY</span>
            <div className="flex gap-4">
              {[
                { id: 'compact', name: 'COMPACT' },
                { id: 'normal', name: 'DEFAULT' },
                { id: 'cozy', name: 'COZY' },
              ].map((dens) => (
                <button
                  key={dens.id}
                  onClick={() => updateDensity(dens.id)}
                  className={`px-4 py-2 border-2 rounded-lg text-xs font-mono font-bold uppercase transition-brutal ${
                    density === dens.id ? 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-brand-bg text-white border-brand-border'
                  }`}
                >
                  {dens.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
