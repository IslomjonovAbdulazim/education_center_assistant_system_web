import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const CreateCenter = ({ onCenterCreated }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminAPI.createCenter(formData);
      setSuccess(response.data.message);
      setFormData({ name: '' });
      if (onCenterCreated) {
        onCenterCreated();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Yangi o'quv markaz yaratish">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Markaz nomi"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="O'quv markaz nomini kiriting"
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {loading ? 'Yaratilmoqda...' : 'Markaz yaratish'}
        </Button>
      </form>
    </Card>
  );
};

export default CreateCenter;