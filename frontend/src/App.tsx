import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoControlBar } from './components/demo/DemoControlBar';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';

const EquipmentIntelligence = lazy(() => import('./pages/EquipmentIntelligence').then(m => ({ default: m.EquipmentIntelligence })));
const EnergyIntelligence = lazy(() => import('./pages/EnergyIntelligence').then(m => ({ default: m.EnergyIntelligence })));
const HygieneCompliance = lazy(() => import('./pages/HygieneCompliance').then(m => ({ default: m.HygieneCompliance })));
const PackagingWaste = lazy(() => import('./pages/PackagingWaste').then(m => ({ default: m.PackagingWaste })));
const DigitalTwin = lazy(() => import('./pages/DigitalTwin').then(m => ({ default: m.DigitalTwin })));
const WhatIfSimulator = lazy(() => import('./pages/WhatIfSimulator').then(m => ({ default: m.WhatIfSimulator })));
const AIInsights = lazy(() => import('./pages/AIInsights').then(m => ({ default: m.AIInsights })));
const AlertsCenter = lazy(() => import('./pages/AlertsCenter').then(m => ({ default: m.AlertsCenter })));
const ConsumerPortal = lazy(() => import('./pages/ConsumerPortal').then(m => ({ default: m.ConsumerPortal })));
const AnalyticsReports = lazy(() => import('./pages/AnalyticsReports').then(m => ({ default: m.AnalyticsReports })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

import type { RoleType, DashboardOverview } from './types';
import { 
  fetchDashboardOverview, 
  fetchEnergyIntelligence, 
  fetchHygieneData, 
  fetchPackagingWaste,
  fetchAlerts,
  toggleDemoMode,
  triggerPlantIncident,
  resetPlantSimulation,
  triggerSimulatedTick
} from './services/api';

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-cyan-400">
    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
    <p className="text-sm font-medium tracking-wide text-slate-400 animate-pulse">Loading DairyGuard 360 Intelligence Module...</p>
  </div>
);

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentRole, setCurrentRole] = useState<RoleType>('Plant Manager');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [energyData, setEnergyData] = useState<any>(null);
  const [hygieneData, setHygieneData] = useState<any>(null);
  const [wasteData, setWasteData] = useState<any>(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

  const [isDemoMode, setIsDemoMode] = useState(false);

  const refreshAllData = async () => {
    try {
      const [dash, nrg, hyg, wst, alr] = await Promise.all([
        fetchDashboardOverview(),
        fetchEnergyIntelligence(),
        fetchHygieneData(),
        fetchPackagingWaste(),
        fetchAlerts('NEW')
      ]);

      setDashboardData(dash);
      setEnergyData(nrg);
      setHygieneData(hyg);
      setWasteData(wst);
      setUnreadAlertsCount(Array.isArray(alr) ? alr.length : 0);
      setIsDemoMode(dash.demo_mode);
    } catch (err) {
      console.error('Error refreshing telemetry:', err);
    }
  };

  useEffect(() => {
    refreshAllData();

    const interval = setInterval(() => {
      if (isDemoMode) {
        triggerSimulatedTick().then(refreshAllData).catch(console.error);
      } else {
        refreshAllData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  const handleToggleDemoMode = async (enabled: boolean) => {
    try {
      await toggleDemoMode(enabled);
      setIsDemoMode(enabled);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerIncident = async (scenario: string = 'general') => {
    try {
      await triggerPlantIncident(scenario);
      await refreshAllData();
      setActiveTab('alerts');
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPlant = async () => {
    try {
      await resetPlantSimulation();
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateTick = async () => {
    try {
      await triggerSimulatedTick();
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 flex flex-col font-sans">
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        lastUpdated={dashboardData?.last_updated || '22:57 UTC'}
        isLive={true}
      />

      <DemoControlBar
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onTriggerIncident={handleTriggerIncident}
        onResetPlant={handleResetPlant}
        onSimulateTick={handleSimulateTick}
      />

      <div className="flex-1 flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadAlertsCount={unreadAlertsCount}
          currentRole={currentRole}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto w-full">
          <Suspense fallback={<PageLoader />}>
            {activeTab === 'landing' && (
              <LandingPage onLaunchDashboard={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                data={dashboardData}
                onNavigate={setActiveTab}
                onOpenAIChat={() => setIsAIChatOpen(true)}
              />
            )}

            {activeTab === 'equipment' && (
              <EquipmentIntelligence />
            )}

            {activeTab === 'energy' && (
              <EnergyIntelligence data={energyData} />
            )}

            {activeTab === 'hygiene' && (
              <HygieneCompliance data={hygieneData} onRefresh={refreshAllData} />
            )}

            {activeTab === 'waste' && (
              <PackagingWaste data={wasteData} onNavigateConsumer={() => setActiveTab('consumer')} />
            )}

            {activeTab === 'digital-twin' && (
              <DigitalTwin />
            )}

            {activeTab === 'simulator' && (
              <WhatIfSimulator />
            )}

            {activeTab === 'insights' && (
              <AIInsights />
            )}

            {activeTab === 'alerts' && (
              <AlertsCenter onTriggerIncident={handleTriggerIncident} />
            )}

            {activeTab === 'consumer' && (
              <ConsumerPortal />
            )}

            {activeTab === 'reports' && (
              <AnalyticsReports />
            )}

            {activeTab === 'settings' && (
              <SettingsPage />
            )}
          </Suspense>
        </main>
      </div>

      <AIAssistantDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}

export default App;

