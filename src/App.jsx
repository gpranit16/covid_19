import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import StateAnalyticsView from './components/StateAnalyticsView';
import VaccinationView from './components/VaccinationView';
import TestingView from './components/TestingView';
import WaveAnalysisView from './components/WaveAnalysisView';
import PredictionsView from './components/PredictionsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import AiInsightsPanel from './components/AiInsightsPanel';
import LandingPage from './components/LandingPage';
import { loadCovidData } from './utils/dataLoader';
import { Loader2, AlertTriangle } from 'lucide-react';

function DashboardContent() {
  const { density } = useSettings();
  const [isLanding, setIsLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    
    // Load and parse all CSV data
    loadCovidData()
      .then((parsed) => {
        if (active) {
          setData(parsed);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          setError(err.message || 'Failed to resolve dataset streams.');
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView data={data} />;
      case 'states':
        return <StateAnalyticsView data={data} />;
      case 'vaccination':
        return <VaccinationView data={data} />;
      case 'testing':
        return <TestingView data={data} />;
      case 'waves':
        return <WaveAnalysisView data={data} />;
      case 'predictions':
        return <PredictionsView />;
      case 'reports':
        return <ReportsView data={data} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView data={data} />;
    }
  };

  if (isLanding) {
    return <LandingPage onEnter={() => setIsLanding(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center font-mono space-y-4 text-white">
        <Loader2 className="w-12 h-12 text-[#F97316] animate-spin shrink-0" />
        <div className="uppercase tracking-widest text-xs font-bold text-gray-400">
          LOADING INTELLIGENCE ARCHIVE...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center font-mono space-y-4 p-6 text-center text-white">
        <AlertTriangle className="w-16 h-16 text-[#EF4444] shrink-0" />
        <div className="uppercase tracking-widest text-lg font-bold text-white">
          FATAL: ARCHIVE DATABASE OFFLINE
        </div>
        <p className="text-gray-400 text-xs max-w-md">{error}</p>
      </div>
    );
  }

  const paddingClass =
    density === 'compact' ? 'p-4' : density === 'cozy' ? 'p-10' : 'p-6';

  return (
    <div className="flex bg-[#050505] text-white min-h-screen font-heading select-none">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} data={data} />
      
      {/* Primary content area */}
      <div className="flex-grow flex flex-col overflow-x-hidden min-h-screen">
        <Header
          activeTab={activeTab}
          data={data}
          toggleInsights={() => setIsInsightsOpen(!isInsightsOpen)}
          isInsightsOpen={isInsightsOpen}
        />
        <main className={`flex-grow overflow-y-auto ${paddingClass} bg-brand-bg`}>
          {renderActiveView()}
        </main>
      </div>

      {/* AI Drawer insights */}
      <AiInsightsPanel
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        data={data}
      />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <DashboardContent />
    </SettingsProvider>
  );
}

export default App;
