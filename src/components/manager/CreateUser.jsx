import React, { useState } from 'react';
import { managerAPI } from '../../services/api';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const CreateUser = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    password: '',
    role: 'student',
    subject_field: ''
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
      const response = await managerAPI.createUser(formData);
      setSuccess(response.data.message);
      setFormData({
        fullname: '',
        phone: '',
        password: '',
        role: 'student',
        subject_field: ''
      });
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Yangi foydalanuvchi yaratish">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="To'liq ism"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Ism familiyani kiriting"
          required
        />
        
        <Input
          label="Telefon raqam"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+998901234567"
          required
        />
        
        <Input
          label="Parol"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Parol kiriting"
          required
        />
        
        <div className="form-group">
          <label className="form-label">Rol *</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Talaba</option>
            <option value="assistant">Yordamchi</option>
          </select>
        </div>
        
        <Input
          label="Fan yoki yo'nalish"
          name="subject_field"
          value={formData.subject_field}
          onChange={handleChange}
          placeholder="Masalan: Python, Matematika, Ingliz tili"
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {loading ? 'Yaratilmoqda...' : 'Foydalanuvchi yaratish'}
        </Button>
      </form>
    </Card>
  );
};

export default CreateUser;