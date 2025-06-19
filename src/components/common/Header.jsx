import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../utils/helpers';
import Button from './Button';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Chiqishni xohlaysizmi?')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div>
        <h1 style={{ fontSize: '20px', margin: 0 }}>
          {getGreeting()}, {user?.fullname}
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          {user?.role === 'admin' && 'Administrator'}
          {user?.role === 'manager' && 'Menejer'}
          {user?.role === 'assistant' && 'Yordamchi'}
          {user?.role === 'student' && 'Talaba'}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user?.photo_url && (
          <img 
            src={user.photo_url} 
            alt="Profile" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover' 
            }} 
          />
        )}
        <Button variant="secondary" onClick={handleLogout}>
          Chiqish
        </Button>
      </div>
    </header>
  );
};

export default Header;