import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import CreateCenter from '../components/admin/CreateCenter';
import CentersList from '../components/admin/CentersList';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('centers');
  const [refresh, setRefresh] = useState(0);

  const handleCenterCreated = () => {
    setRefresh(refresh + 1);
    setActiveSection('centers');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'centers':
        return <CentersList refresh={refresh} />;
      case 'create-center':
        return <CreateCenter onCenterCreated={handleCenterCreated} />;
      default:
        return <CentersList refresh={refresh} />;
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

export default AdminDashboard;