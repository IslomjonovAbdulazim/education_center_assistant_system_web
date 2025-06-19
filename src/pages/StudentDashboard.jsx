import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import BookSession from '../components/student/BookSession';
import MySessions from '../components/student/MySessions';
import RateSession from '../components/student/RateSession';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('book-session');
  const [refresh, setRefresh] = useState(0);

  const handleSessionBooked = () => {
    setRefresh(refresh + 1);
    setActiveSection('my-sessions');
  };

  const handleSessionRated = () => {
    setRefresh(refresh + 1);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'book-session':
        return <BookSession onSessionBooked={handleSessionBooked} />;
      case 'my-sessions':
        return <MySessions refresh={refresh} />;
      case 'rate':
        return <RateSession onSessionRated={handleSessionRated} />;
      default:
        return <BookSession onSessionBooked={handleSessionBooked} />;
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

export default StudentDashboard;