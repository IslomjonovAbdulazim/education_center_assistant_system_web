import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const BookSession = ({ onSessionBooked }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const bookSession = async (assistantId, slot) => {
    try {
      const [date, time] = slot.split(' ');
      const datetime = new Date(`${date}T${time}:00`);
      
      await studentAPI.bookSession({
        assistant_id: assistantId,
        datetime: datetime.toISOString()
      });
      
      setSuccess('Dars muvaffaqiyatli band qilindi');
      fetchAssistants(); // Refresh to update available slots
      
      if (onSessionBooked) {
        onSessionBooked();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Darsni band qilishda xatolik');
    }
  };

  const getAvailableSlotsForDate = (assistant) => {
    if (!selectedDate) return assistant.available_slots || [];
    
    return (assistant.available_slots || []).filter(slot => 
      slot.startsWith(selectedDate)
    );
  };

  return (
    <Card title="Dars band qilish">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <Input
        label="Sana tanlang (ixtiyoriy)"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />

      {loading ? (
        <div className="loading">Yuklanmoqda...</div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {assistants.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              Sizning yo'nalishingizda yordamchilar yo'q
            </p>
          ) : (
            assistants.map((assistant) => {
              const availableSlots = getAvailableSlotsForDate(assistant);
              
              return (
                <div key={assistant.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {assistant.photo_url && (
                      <img 
                        src={assistant.photo_url} 
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
                      <h4 style={{ margin: 0 }}>{assistant.fullname}</h4>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {assistant.subject} • ⭐ {assistant.avg_rating}
                      </div>
                    </div>
                  </div>
                  
                  {availableSlots.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                      {selectedDate ? 'Bu sanada mavjud vaqt yo\'q' : 'Mavjud vaqt yo\'q'}
                    </p>
                  ) : (
                    <div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        Mavjud vaqtlar:
                      </div>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                        gap: '8px' 
                      }}>
                        {availableSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            size="small"
                            onClick={() => bookSession(assistant.id, slot)}
                            style={{
                              padding: '8px 12px',
                              fontSize: '12px',
                              justifyContent: 'center'
                            }}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
};

export default BookSession;