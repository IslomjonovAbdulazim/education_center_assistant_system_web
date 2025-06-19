import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    learning_center_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData = {
        phone: formData.phone,
        password: formData.password
      };

      // Only add learning_center_id if it's provided (not for admin)
      if (formData.learning_center_id) {
        loginData.learning_center_id = parseInt(formData.learning_center_id);
      }

      const response = await authAPI.login(loginData);
      login(response.data.user_info, response.data.token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Kirish xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Tizimga kirish
      </h2>

      {error && <div className="error">{error}</div>}

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
        placeholder="Parolingizni kiriting"
        required
      />

      <Input
        label="O'quv markaz ID (Admin uchun bo'sh qoldiring)"
        type="number"
        name="learning_center_id"
        value={formData.learning_center_id}
        onChange={handleChange}
        placeholder="1, 2, 3..."
      />

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        style={{ width: '100%', marginTop: '20px' }}
      >
        {loading ? 'Kirish...' : 'Kirish'}
      </Button>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <p>Test hisobi:</p>
        <p>Tel: +998990330919</p>
        <p>Parol: aisha</p>
        <p>Admin uchun ID kerak emas</p>
      </div>
    </form>
  );
};

export default LoginForm;