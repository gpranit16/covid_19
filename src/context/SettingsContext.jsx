import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [accent, setAccent] = useState('orange'); // 'orange' | 'yellow' | 'success'
  const [borderWidth, setBorderWidth] = useState('2px'); // '1px' | '2px' | '3px'
  const [density, setDensity] = useState('normal'); // 'compact' | 'normal' | 'cozy'
  const [glowEffect, setGlowEffect] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAccent = localStorage.getItem('covid_theme_accent');
    const savedBorder = localStorage.getItem('covid_theme_border');
    const savedDensity = localStorage.getItem('covid_theme_density');
    const savedGlow = localStorage.getItem('covid_theme_glow');

    if (savedAccent) setAccent(savedAccent);
    if (savedBorder) setBorderWidth(savedBorder);
    if (savedDensity) setDensity(savedDensity);
    if (savedGlow) setGlowEffect(savedGlow === 'true');
  }, []);

  const updateAccent = (newAccent) => {
    setAccent(newAccent);
    localStorage.setItem('covid_theme_accent', newAccent);
  };

  const updateBorderWidth = (newBorder) => {
    setBorderWidth(newBorder);
    localStorage.setItem('covid_theme_border', newBorder);
  };

  const updateDensity = (newDensity) => {
    setDensity(newDensity);
    localStorage.setItem('covid_theme_density', newDensity);
  };

  const updateGlowEffect = (newGlow) => {
    setGlowEffect(newGlow);
    localStorage.setItem('covid_theme_glow', newGlow ? 'true' : 'false');
  };

  // Utility classes helper based on settings
  const getBrutalBorderClass = () => {
    const borderStyle = `solid #2A2A2A`;
    return {
      borderWidth,
      borderStyle,
    };
  };

  const getAccentColorHex = () => {
    if (accent === 'orange') return '#F97316';
    if (accent === 'yellow') return '#EAB308';
    if (accent === 'success') return '#22C55E';
    return '#F97316';
  };

  const getAccentBgClass = () => {
    if (accent === 'orange') return 'bg-brand-primary';
    if (accent === 'yellow') return 'bg-brand-secondary';
    if (accent === 'success') return 'bg-brand-success';
    return 'bg-brand-primary';
  };

  const getAccentTextClass = () => {
    if (accent === 'orange') return 'text-brand-primary';
    if (accent === 'yellow') return 'text-brand-secondary';
    if (accent === 'success') return 'text-brand-success';
    return 'text-brand-primary';
  };

  const getAccentBorderClass = () => {
    if (accent === 'orange') return 'border-brand-primary';
    if (accent === 'yellow') return 'border-brand-secondary';
    if (accent === 'success') return 'border-brand-success';
    return 'border-brand-primary';
  };

  const getShadowClass = () => {
    if (accent === 'orange') return 'shadow-brutalist-orange';
    if (accent === 'yellow') return 'shadow-brutalist-yellow';
    if (accent === 'success') return 'shadow-brutalist-border';
    return 'shadow-brutalist-orange';
  };

  return (
    <SettingsContext.Provider
      value={{
        accent,
        borderWidth,
        density,
        glowEffect,
        updateAccent,
        updateBorderWidth,
        updateDensity,
        updateGlowEffect,
        getBrutalBorderClass,
        getAccentColorHex,
        getAccentBgClass,
        getAccentTextClass,
        getAccentBorderClass,
        getShadowClass,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
