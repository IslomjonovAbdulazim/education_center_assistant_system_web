import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const UsersList = ({ role, refresh }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getUsers(role);
      setUsers(response.data);
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, refresh]);

  if (loading) return <div className="loading">Yuklanmoqda...</div>;

  const title = role === 'assistant' ? 'Yordamchilar' : 'Talabalar';

  return (
    <Card 
      title={title}
      headerAction={
        <Button onClick={fetchUsers} variant="secondary" size="small">
          Yangilash
        </Button>
      }
    >
      {error && <div className="error">{error}</div>}
      
      {users.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Hozircha {role === 'assistant' ? 'yordamchilar' : 'talabalar'} yo'q
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>To'liq ism</th>
              <th>Telefon</th>
              <th>Fan/Yo'nalish</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.photo_url ? (
                    <img 
                      src={user.photo_url} 
                      alt="Profile" 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  ) : (
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: '#ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      {user.fullname.charAt(0)}
                    </div>
                  )}
                </td>
                <td>{user.fullname}</td>
                <td>{user.phone}</td>
                <td>{user.subject_field}</td>
                <td>
                  <span style={{ 
                    color: user.active_status === 'faol' ? 'green' : 'gray',
                    fontSize: '12px'
                  }}>
                    {user.active_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};

export default UsersList;