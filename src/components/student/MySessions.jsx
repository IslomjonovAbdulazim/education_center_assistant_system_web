import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const MySessions = ({ refresh }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getSessions(activeTab);
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

  if (loading) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <Card 
      title="Mening darslarim"
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {session.assistant_photo && (
                  <img 
                    src={session.assistant_photo} 
                    alt="Assistant" 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0' }}>{session.assistant_name}</h4>
                  <p style={{ margin: '0 0 4px 0', color: '#666' }}>{session.datetime}</p>
                  <div style={{ 
                    fontSize: '12px',
                    color: session.attendance === 'present' ? 'green' : 
                          session.attendance === 'absent' ? 'red' : '#666'
                  }}>
                    Davomat: {
                      session.attendance === 'present' ? '✅ Keldi' :
                      session.attendance === 'absent' ? '❌ Kelmadi' : '⏳ Kutilmoqda'
                    }
                  </div>
                </div>
                
                {activeTab === 'past' && session.attendance === 'present' && !session.my_rating && (
                  <Button size="small" variant="primary">
                    Baholash
                  </Button>
                )}
                
                {session.my_rating && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Sizning bahoyingiz</div>
                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ 
                          color: star <= Math.round((
                            session.my_rating.knowledge + 
                            session.my_rating.communication + 
                            session.my_rating.patience + 
                            session.my_rating.engagement + 
                            session.my_rating.problem_solving
                          ) / 5) ? '#ffc107' : '#e9ecef'
                        }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {session.my_rating?.comments && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  <strong>Sizning sharhingiz:</strong> {session.my_rating.comments}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MySessions;