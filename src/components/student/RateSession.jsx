import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const RateSession = ({ onSessionRated }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState({
    knowledge: 0,
    communication: 0,
    patience: 0,
    engagement: 0,
    problem_solving: 0,
    comments: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCompletedSessions = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getSessions('past');
      // Filter only completed sessions without ratings
      const unratedSessions = response.data.filter(
        session => session.attendance === 'present' && !session.my_rating
      );
      setSessions(unratedSessions);
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  const handleStarClick = (category, value) => {
    setRating({
      ...rating,
      [category]: value
    });
  };

  const handleSubmit = async () => {
    if (!selectedSession) {
      setError('Darsni tanlang');
      return;
    }

    if (Object.values(rating).slice(0, 5).some(val => val === 0)) {
      setError('Barcha mezzonlarni baholang');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await studentAPI.rateSession({
        session_id: selectedSession.id,
        ...rating
      });
      setSuccess(response.data.message);
      setSelectedSession(null);
      setRating({
        knowledge: 0,
        communication: 0,
        patience: 0,
        engagement: 0,
        problem_solving: 0,
        comments: ''
      });
      fetchCompletedSessions();
      if (onSessionRated) {
        onSessionRated();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Baholashda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (category, value) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(category, star)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: star <= value ? '#ffc107' : '#e9ecef'
            }}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <Card title="Darsni baholash">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {sessions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Baholanishi kerak bo'lgan darslar yo'q
        </p>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '12px' }}>Baholanishi kerak darslar:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  style={{
                    padding: '12px',
                    border: selectedSession?.id === session.id ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: '6px',
                    background: selectedSession?.id === session.id ? '#f0f8ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    <div>
                      <div style={{ fontWeight: '500' }}>{session.assistant_name}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>{session.datetime}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedSession && (
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px',
              background: '#f9f9f9'
            }}>
              <h4 style={{ marginBottom: '16px' }}>
                {selectedSession.assistant_name} - {selectedSession.datetime}
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Bilim va tajriba:
                  </label>
                  {renderStars('knowledge', rating.knowledge)}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Muloqot qobiliyati:
                  </label>
                  {renderStars('communication', rating.communication)}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Sabr va yordam:
                  </label>
                  {renderStars('patience', rating.patience)}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Qiziqarli o'qitish:
                  </label>
                  {renderStars('engagement', rating.engagement)}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Muammolarni hal qilish:
                  </label>
                  {renderStars('problem_solving', rating.problem_solving)}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Sharhingiz (ixtiyoriy):
                  </label>
                  <textarea
                    value={rating.comments}
                    onChange={(e) => setRating({ ...rating, comments: e.target.value })}
                    placeholder="Dars haqida fikrlaringizni yozing..."
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || Object.values(rating).slice(0, 5).some(val => val === 0)}
                  variant="primary"
                >
                  {submitting ? 'Saqlanmoqda...' : 'Baholashni saqlash'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default RateSession;