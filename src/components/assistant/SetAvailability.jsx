import React, { useState } from 'react';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots();

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
  );
};

export default SetAvailability;