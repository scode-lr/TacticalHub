import React, { useState } from 'react';
import './App.css';
import DiveLogManager from './components/DiveLogManager';
import DivePlanner from './components/DivePlanner';
import EquipmentTracker from './components/EquipmentTracker';
import DiveSiteInfo from './components/DiveSiteInfo';

type ActiveTab = 'logs' | 'planner' | 'equipment' | 'sites';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('logs');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'logs':
        return <DiveLogManager />;
      case 'planner':
        return <DivePlanner />;
      case 'equipment':
        return <EquipmentTracker />;
      case 'sites':
        return <DiveSiteInfo />;
      default:
        return <DiveLogManager />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TacticalHub - Multidive Manager</h1>
        <nav className="navigation">
          <button 
            className={activeTab === 'logs' ? 'active' : ''}
            onClick={() => setActiveTab('logs')}
          >
            Dive Logs
          </button>
          <button 
            className={activeTab === 'planner' ? 'active' : ''}
            onClick={() => setActiveTab('planner')}
          >
            Dive Planner
          </button>
          <button 
            className={activeTab === 'equipment' ? 'active' : ''}
            onClick={() => setActiveTab('equipment')}
          >
            Equipment
          </button>
          <button 
            className={activeTab === 'sites' ? 'active' : ''}
            onClick={() => setActiveTab('sites')}
          >
            Dive Sites
          </button>
        </nav>
      </header>
      <main className="App-main">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;
