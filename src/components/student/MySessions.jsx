import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const MySessions = ({ refresh, onRateSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getSessions(activeTab);
      // Sort sessions: latest to newest (most recent first)
      const sortedSessions = response.data.sort((a, b) => {
        const parseDateTime = (dateTimeStr) => {
          const [date, time] = dateTimeStr.split(' ');
          const [day, month, year] = date.split('.');
          return new Date(`${year}-${month}-${day}T${time}:00`);
        };
        
        return parseDateTime(b.datetime) - parseDateTime(a.datetime);
      });
      setSessions(sortedSessions);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                {session.assistant_photo && (
                  <img 
                    src={session.assistant_photo} 
                    alt="Assistant" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0' }}>{session.assistant_name}</h4>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {session.datetime}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '12px',
                    color: session.attendance === 'present' ? 'green' : 
                          session.attendance === 'absent' ? 'red' : '#666',
                    marginBottom: '4px'
                  }}>
                    {session.attendance === 'present' ? '✅ Kelgan' :
                     session.attendance === 'absent' ? '❌ Kelmagan' : '⏳ Kutilmoqda'}
                  </div>
                </div>
              </div>
              
              {session.my_rating && (
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '12px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Mening bahom:
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Bilim: {session.my_rating.knowledge}⭐ | 
                    Muloqot: {session.my_rating.communication}⭐ | 
                    Sabr: {session.my_rating.patience}⭐ | 
                    Jalb: {session.my_rating.engagement}⭐ | 
                    Yechish: {session.my_rating.problem_solving}⭐
                  </div>
                  {session.my_rating.comments && (
                    <div style={{ fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
                      "{session.my_rating.comments}"
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'past' && session.attendance === 'present' && !session.my_rating && (
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => onRateSession && onRateSession(session.id)}
                  >
                    Baholash
                  </Button>
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