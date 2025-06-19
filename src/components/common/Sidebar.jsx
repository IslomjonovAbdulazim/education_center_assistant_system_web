import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case ROLES.ADMIN:
        return [
          { id: 'centers', label: 'O\'quv markazlari', icon: '🏢' },
          { id: 'create-center', label: 'Markaz yaratish', icon: '➕' }
        ];
      case ROLES.MANAGER:
        return [
          { id: 'dashboard', label: 'Bosh sahifa', icon: '📊' },
          { id: 'assistants', label: 'Yordamchilar', icon: '👨‍🏫' },
          { id: 'students', label: 'Talabalar', icon: '👨‍🎓' },
          { id: 'create-user', label: 'Foydalanuvchi yaratish', icon: '➕' }
        ];
      case ROLES.ASSISTANT:
        return [
          { id: 'sessions', label: 'Darslar', icon: '📚' },
          { id: 'availability', label: 'Jadval', icon: '📅' },
          { id: 'attendance', label: 'Davomat', icon: '✅' }
        ];
      case ROLES.STUDENT:
        return [
          { id: 'book-session', label: 'Dars band qilish', icon: '📝' },
          { id: 'my-sessions', label: 'Mening darslarim', icon: '📚' },
          { id: 'rate', label: 'Baholash', icon: '⭐' }
        ];
      default:
        return [];
    }
  };

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
          O'quv Markazi
        </h2>
        <p style={{ fontSize: '12px', color: '#adb5bd' }}>
          Boshqaruv tizimi
        </p>
      </div>
      
      <nav>
        <ul className="sidebar-nav">
          {getMenuItems().map((item) => (
            <li key={item.id}>
              <a
                href="#"
                className={activeSection === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;