import React, { useState } from 'react';
import { assistantAPI } from '../../services/api';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const MarkAttendance = ({ refresh }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: ''
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const fetchStudents = async () => {
    if (!formData.date || !formData.time) {
      setError('Sana va vaqtni tanlang');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await assistantAPI.getSessionsByTime(formData.date, formData.time);
      setStudents(response.data);
      if (response.data.length === 0) {
        setError('Bu vaqtda talabalar yo\'q');
      }
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, attendance) => {
    try {
      await assistantAPI.markAttendance(studentId, { attendance });
      setSuccess('Davomat belgilandi');
      fetchStudents(); // Refresh the list
    } catch (err) {
      setError('Davomatni belgilashda xatolik');
    }
  };

  return (
    <Card title="Davomatni belgilash">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
        <Input
          label="Sana"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
        />
        
        <Input
          label="Vaqt"
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
        
        <Button
          onClick={fetchStudents}
          disabled={loading || !formData.date || !formData.time}
          style={{ height: '44px' }}
        >
          {loading ? 'Qidirilmoqda...' : 'Qidirish'}
        </Button>
      </div>

      {students.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '16px' }}>
            {formData.date} - {formData.time} dagi talabalar
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {students.map((student) => (
              <div key={student.student_id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid #eee',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {student.student_photo && (
                    <img 
                      src={student.student_photo} 
                      alt="Student" 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: '500' }}>{student.student_name}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{student.student_phone}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '12px',
                    color: student.attendance_status === 'present' ? 'green' : 
                          student.attendance_status === 'absent' ? 'red' : '#666',
                    marginRight: '12px'
                  }}>
                    {student.attendance_status === 'present' ? 'Keldi' :
                     student.attendance_status === 'absent' ? 'Kelmadi' : 'Kutilmoqda'}
                  </span>
                  
                  <Button
                    size="small"
                    variant="success"
                    onClick={() => markAttendance(student.student_id, 'present')}
                    disabled={student.attendance_status === 'present'}
                  >
                    Keldi
                  </Button>
                  
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => markAttendance(student.student_id, 'absent')}
                    disabled={student.attendance_status === 'absent'}
                  >
                    Kelmadi
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default MarkAttendance;