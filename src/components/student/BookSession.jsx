import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const BookSession = ({ onSessionBooked }) => {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAssistants();
      setAssistants(response.data);
    } catch (err) {
      setError('Yordamchilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, []);

  const bookSession = async (assistantId, slotDateTime) => {
    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await studentAPI.bookSession({
        assistant_id: assistantId,
        datetime: slotDateTime
      });
      setSuccess(response.data.message);
      fetchAssistants(); // Refresh to update available slots
      if (onSessionBooked) {
        onSessionBooked();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Darsni band qilishda xatolik');
    } finally {
      setBookingLoading(false);
    }
  };

  const parseSlot = (slotString) => {
    // Format: "2024-01-15 10:30"
    const [date, time] = slotString.split(' ');
    return { date, time };
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <Card title="Dars band qilish">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {assistants.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Sizning yo'nalishingiz bo'yicha yordamchilar topilmadi
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {assistants.map((assistant) => (
            <div key={assistant.id} style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                {assistant.photo_url && (
                  <img 
                    src={assistant.photo_url} 
                    alt="Assistant" 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                )}
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{assistant.fullname}</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#666' }}>Fan: {assistant.subject}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⭐ {assistant.avg_rating}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>reyting</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>Mavjud vaqtlar:</h4>
                {assistant.available_slots.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '14px' }}>Mavjud vaqtlar yo'q</p>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '8px'
                  }}>
                    {assistant.available_slots.slice(0, 6).map((slot, index) => {
                      const { date, time } = parseSlot(slot);
                      return (
                        <Button
                          key={index}
                          size="small"
                          variant="secondary"
                          disabled={bookingLoading}
                          onClick={() => bookSession(assistant.id, slot)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            padding: '8px',
                            fontSize: '12px'
                          }}
                        >
                          <span>{date}</span>
                          <span>{time}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
                {assistant.available_slots.length > 6 && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    +{assistant.available_slots.length - 6} ko'proq vaqt mavjud
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default BookSession;