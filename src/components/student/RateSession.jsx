import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const StarRating = ({ rating, onRatingChange, label, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '500',
        color: '#333'
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            onClick={() => !disabled && onRatingChange(star)}
            style={{
              background: 'none',
              border: 'none',
              cursor: disabled ? 'default' : 'pointer',
              fontSize: '24px',
              padding: '4px',
              color: (hoverRating || rating) >= star ? '#ffc107' : '#e9ecef',
              transition: 'color 0.2s ease'
            }}
          >
            ⭐
          </button>
        ))}
        <span style={{ 
          marginLeft: '12px', 
          fontSize: '14px', 
          color: '#666',
          minWidth: '60px'
        }}>
          {rating > 0 ? `${rating}/5` : 'Tanlang'}
        </span>
      </div>
    </div>
  );
};

const RateSession = ({ onSessionRated, selectedSessionId }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [ratings, setRatings] = useState({
    knowledge: 0,
    communication: 0,
    patience: 0,
    engagement: 0,
    problem_solving: 0
  });
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCompletedSessions = async () => {
    try {
      const response = await studentAPI.getSessions('past');
      const completedSessions = response.data.filter(session => 
        session.attendance === 'present' && !session.my_rating
      );
      setSessions(completedSessions);
      
      // Auto-select session if selectedSessionId is provided
      if (selectedSessionId) {
        const session = completedSessions.find(s => s.id === selectedSessionId);
        if (session) {
          setSelectedSession(session);
        }
      }
    } catch (err) {
      setError('Darslarni yuklashda xatolik');
    }
  };

  useEffect(() => {
    fetchCompletedSessions();
  }, [selectedSessionId]);

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSession) {
      setError('Darsni tanlang');
      return;
    }

    const allRatingsGiven = Object.values(ratings).every(rating => rating > 0);
    if (!allRatingsGiven) {
      setError('Barcha kategoriyalar uchun baho bering');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await studentAPI.rateSession({
        session_id: selectedSession.id,
        ...ratings,
        comments: comments.trim()
      });
      
      setSuccess('Baholash muvaffaqiyatli saqlandi');
      setSelectedSession(null);
      setRatings({
        knowledge: 0,
        communication: 0,
        patience: 0,
        engagement: 0,
        problem_solving: 0
      });
      setComments('');
      
      if (onSessionRated) {
        onSessionRated();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Baholashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = Object.values(ratings).length > 0 
    ? (Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).length).toFixed(1)
    : 0;

  return (
    <Card title="Darsni baholash">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {sessions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          Baholanishi kerak bo'lgan darslar yo'q
        </p>
      ) : (
        <>
          {!selectedSession && (
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '16px', color: '#333' }}>
                Baholanishi kerak darslar:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#fff'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#007bff';
                      e.target.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e9ecef';
                      e.target.style.backgroundColor = '#fff';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {session.assistant_photo && (
                        <img 
                          src={session.assistant_photo} 
                          alt="Assistant" 
                          style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                      )}
                      <div>
                        <h5 style={{ margin: '0 0 4px 0', color: '#333' }}>
                          {session.assistant_name}
                        </h5>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {session.datetime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSession && (
            <form onSubmit={handleSubmit}>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px',
                border: '1px solid #dee2e6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  {selectedSession.assistant_photo && (
                    <img 
                      src={selectedSession.assistant_photo} 
                      alt="Assistant" 
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  )}
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>
                      {selectedSession.assistant_name}
                    </h4>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {selectedSession.datetime}
                    </div>
                  </div>
                </div>
                
                {averageRating > 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '16px',
                    padding: '12px',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #dee2e6'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                      {averageRating} / 5.0
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Umumiy baho
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ marginBottom: '20px', color: '#333' }}>
                  Baho va tajriba:
                </h4>
                
                <StarRating
                  label="Bilim va tajriba"
                  rating={ratings.knowledge}
                  onRatingChange={(value) => handleRatingChange('knowledge', value)}
                />
                
                <StarRating
                  label="Muloqot qobiliyati"
                  rating={ratings.communication}
                  onRatingChange={(value) => handleRatingChange('communication', value)}
                />
                
                <StarRating
                  label="Sabr va yordam"
                  rating={ratings.patience}
                  onRatingChange={(value) => handleRatingChange('patience', value)}
                />
                
                <StarRating
                  label="Qiziqarli o'qitish"
                  rating={ratings.engagement}
                  onRatingChange={(value) => handleRatingChange('engagement', value)}
                />
                
                <StarRating
                  label="Muammolarni hal qilish"
                  rating={ratings.problem_solving}
                  onRatingChange={(value) => handleRatingChange('problem_solving', value)}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  Sharhingiz (ixtiyoriy):
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Dars haqida fikrlaringizni yozing..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || Object.values(ratings).some(rating => rating === 0)}
                  style={{ flex: 1 }}
                >
                  {loading ? 'Saqlanmoqda...' : 'Baholashni saqlash'}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedSession(null);
                    setRatings({
                      knowledge: 0,
                      communication: 0,
                      patience: 0,
                      engagement: 0,
                      problem_solving: 0
                    });
                    setComments('');
                  }}
                >
                  Bekor qilish
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </Card>
  );
};

export default RateSession;