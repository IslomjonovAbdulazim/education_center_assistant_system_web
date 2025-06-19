import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Dashboard from '../components/manager/Dashboard';
import CreateUser from '../components/manager/CreateUser';
import UsersList from '../components/manager/UsersList';

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [refresh, setRefresh] = useState(0);

  const handleUserCreated = () => {
    setRefresh(refresh + 1);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'assistants':
        return <UsersList role="assistant" refresh={refresh} />;
      case 'students':
        return <UsersList role="student" refresh={refresh} />;
      case 'create-user':
        return <CreateUser onUserCreated={handleUserCreated} />;
      default:
        return <Dashboard />;
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

export default ManagerDashboard;