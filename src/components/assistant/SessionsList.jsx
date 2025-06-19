import React, { useState, useEffect } from 'react';
import { assistantAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const SessionsList = ({ refresh }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await assistantAPI.getSessions(activeTab);
      setSessions(response.data);
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [activeTab, refresh]);

  const markAttendance = async (sessionId, attendance) => {
    try {
      await assistantAPI.markAttendance(sessionId, { attendance });
      fetchSessions();
    } catch (err) {
      setError('Davomatni belgilashda xatolik');
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <Card 
      title="Darslar ro'yxati"
      headerAction={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant={activeTab === 'upcoming' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setActiveTab('upcoming')}
          >
            Kelgusi
          </Button>
          <Button
            variant={activeTab === 'past' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setActiveTab('past')}
          >
            O'tgan
          </Button>
        </div>
      }
    >
      {error && <div className="error">{error}</div>}
      
      {sessions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          {activeTab === 'upcoming' ? 'Kelgusi darslar yo\'q' : 'O\'tgan darslar yo\'q'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sessions.map((session) => (
            <div key={session.id} style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>
                    {session.date} - {session.time}
                  </h4>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    Talabalar: {session.students?.length || 0} kishi
                  </div>
                </div>
                
                {activeTab === 'upcoming' && session.students?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      size="small"
                      variant="success"
                      onClick={() => markAttendance(session.id, 'present')}
                    >
                      Keldi
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => markAttendance(session.id, 'absent')}
                    >
                      Kelmadi
                    </Button>
                  </div>
                )}
              </div>
              
              {session.students?.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  {session.students.map((student, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      background: '#f8f9fa',
                      borderRadius: '4px',
                      marginBottom: '4px'
                    }}>
                      {student.photo && (
                        <img 
                          src={student.photo} 
                          alt="Student" 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500' }}>{student.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{student.phone}</div>
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: student.attendance === 'present' ? 'green' : 
                              student.attendance === 'absent' ? 'red' : '#666'
                      }}>
                        {student.attendance === 'present' ? '✅ Keldi' :
                         student.attendance === 'absent' ? '❌ Kelmadi' : '⏳ Kutilmoqda'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SessionsList;