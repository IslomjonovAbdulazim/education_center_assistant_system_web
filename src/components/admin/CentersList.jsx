import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Card from '../common/Card';
import { formatDate } from '../../utils/helpers';

const CentersList = ({ refresh }) => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCenters();
      setCenters(response.data);
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, [refresh]);

  if (loading) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <Card title="O'quv markazlari ro'yxati">
      {error && <div className="error">{error}</div>}
      
      {centers.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Hozircha o'quv markazlari yo'q
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nomi</th>
              <th>Foydalanuvchilar soni</th>
              <th>Yaratilgan sana</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center.id}>
                <td>{center.id}</td>
                <td>{center.name}</td>
                <td>{center.total_users}</td>
                <td>{center.created_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};

export default CentersList;