import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import SessionsList from '../components/assistant/SessionsList';
import SetAvailability from '../components/assistant/SetAvailability';
import MarkAttendance from '../components/assistant/MarkAttendance';

const AssistantDashboard = () => {
  const [activeSection, setActiveSection] = useState('sessions');
  const [refresh, setRefresh] = useState(0);

  const handleAvailabilitySet = () => {
    setRefresh(refresh + 1);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'sessions':
        return <SessionsList refresh={refresh} />;
      case 'availability':
        return <SetAvailability onAvailabilitySet={handleAvailabilitySet} />;
      case 'attendance':
        return <MarkAttendance refresh={refresh} />;
      default:
        return <SessionsList refresh={refresh} />;
    }
  };

  return (
    <div className="page">
      <Header />
      <div className="dashboard">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AssistantDashboard;