import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/api';
import Card from '../common/Card';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Statistikani yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Yuklanmoqda...</div>;

  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats?.center_totals?.sessions_this_month || 0}</span>
          <span className="stat-label">Bu oy darslar</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats?.center_totals?.active_assistants || 0}</span>
          <span className="stat-label">Yordamchilar</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats?.center_totals?.active_students || 0}</span>
          <span className="stat-label">Talabalar</span>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Assistants Performance */}
        <Card title="Yordamchilar reytingi">
          {stats?.assistants?.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Ma'lumot yo'q</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Fan</th>
                  <th>Reyting</th>
                  <th>Darslar</th>
                </tr>
              </thead>
              <tbody>
                {stats?.assistants?.map((assistant, index) => (
                  <tr key={index}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {assistant.photo_url && (
                        <img 
                          src={assistant.photo_url} 
                          alt="Profile" 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                      )}
                      {assistant.fullname}
                    </td>
                    <td>{assistant.subject}</td>
                    <td>
                      <span style={{ color: assistant.avg_rating >= 4 ? 'green' : 'orange' }}>
                        ⭐ {assistant.avg_rating}
                      </span>
                    </td>
                    <td>{assistant.total_sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Popular Subjects */}
        <Card title="Ommabop fanlar">
          {stats?.popular_subjects?.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Ma'lumot yo'q</p>
          ) : (
            <div>
              {stats?.popular_subjects?.map((subject, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: index < stats.popular_subjects.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <span>{subject.subject}</span>
                  <span style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {subject.booking_count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Peak Hours */}
      <Card title="Eng band vaqtlar">
        {stats?.peak_hours?.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Ma'lumot yo'q</p>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {stats?.peak_hours?.map((hour, index) => (
              <div key={index} style={{
                background: '#f8f9fa',
                padding: '8px 12px',
                borderRadius: '6px',
                textAlign: 'center',
                minWidth: '80px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{hour.hour}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{hour.session_count} dars</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;