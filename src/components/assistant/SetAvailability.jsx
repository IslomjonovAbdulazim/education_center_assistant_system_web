import React, { useState, useEffect } from 'react';
import { assistantAPI } from '../../services/api';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { generateTimeSlots } from '../../utils/helpers';

const SetAvailability = ({ onAvailabilitySet }) => {
  const [formData, setFormData] = useState({
    date: '',
    selectedSlots: []
  });
  const [currentAvailability, setCurrentAvailability] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots();

  const fetchCurrentAvailability = async () => {
    try {
      const response = await assistantAPI.getAvailability();
      setCurrentAvailability(response.data);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  useEffect(() => {
    fetchCurrentAvailability();
  }, []);

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      date: e.target.value,
      selectedSlots: []
    });
    setError('');
    setSuccess('');
  };

  const handleSlotToggle = (slot) => {
    const isSelected = formData.selectedSlots.includes(slot);
    const newSlots = isSelected
      ? formData.selectedSlots.filter(s => s !== slot)
      : [...formData.selectedSlots, slot];
    
    setFormData({
      ...formData,
      selectedSlots: newSlots
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date) {
      setError('Sanani tanlang');
      return;
    }
    
    if (formData.selectedSlots.length === 0) {
      setError('Kamida bitta vaqt oralig\'ini tanlang');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await assistantAPI.setAvailability({
        date: formData.date,
        time_slots: formData.selectedSlots
      });
      setSuccess(response.data.message);
      setFormData({ date: '', selectedSlots: [] });
      fetchCurrentAvailability(); // Refresh availability list
      if (onAvailabilitySet) {
        onAvailabilitySet();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title="Ish vaqtini belgilash">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Sana"
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          
          {formData.date && (
            <div className="form-group">
              <label className="form-label">Mavjud vaqt oralig'lari</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                gap: '8px',
                marginTop: '8px'
              }}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotToggle(slot)}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: formData.selectedSlots.includes(slot) ? '#007bff' : 'white',
                      color: formData.selectedSlots.includes(slot) ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Tanlangan: {formData.selectedSlots.length} ta vaqt
              </p>
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.date || formData.selectedSlots.length === 0}
            style={{ marginTop: '16px' }}
          >
            {loading ? 'Saqlanmoqda...' : 'Jadvalni saqlash'}
          </Button>
        </form>
      </Card>

      {/* Current Availability Display */}
      <Card title="Joriy jadvalim" style={{ marginTop: '20px' }}>
        {currentAvailability.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Hozircha jadval yo'q
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentAvailability
              .filter(item => new Date(item.date) >= new Date().setHours(0,0,0,0))
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((item, index) => (
                <div key={index} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px 0' }}>{item.date}</h4>
                  
                  {item.available_slots.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', color: 'green', marginBottom: '8px' }}>
                        ✅ Mavjud vaqtlar:
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '4px' 
                      }}>
                        {item.available_slots.map((slot, slotIndex) => (
                          <span key={slotIndex} style={{
                            background: '#d4edda',
                            color: '#155724',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.booked_slots.length > 0 && (
                    <div>
                      <div style={{ fontSize: '14px', color: 'red', marginBottom: '8px' }}>
                        ❌ Band vaqtlar:
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '4px' 
                      }}>
                        {item.booked_slots.map((slot, slotIndex) => (
                          <span key={slotIndex} style={{
                            background: '#f8d7da',
                            color: '#721c24',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SetAvailability;