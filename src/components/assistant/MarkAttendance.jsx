import React, { useState, useEffect } from 'react';
import { assistantAPI } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const MarkAttendance = ({ refresh }) => {
  const [uncheckedSessions, setUncheckedSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUncheckedSessions = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all past sessions that haven't been marked yet
      const response = await assistantAPI.getSessions('past');
      const sessions = response.data;
      
      // Filter sessions that need attendance marking
      const unchecked = [];
      
      for (const session of sessions) {
        if (session.students) {
          session.students.forEach(student => {
            if (!student.attendance || student.attendance === 'kutilmoqda') {
              const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
              const now = new Date();
              
              // Only show sessions that are in the past or today
              if (sessionDateTime <= now) {
                unchecked.push({
                  session_id: session.id,
                  date: session.date,
                  time: session.time,
                  student_id: student.id || student.student_id,
                  student_name: student.name || student.student_name,
                  student_phone: student.phone || student.student_phone,
                  student_photo: student.photo || student.student_photo,
                  attendance_status: student.attendance || 'kutilmoqda'
                });
              }
            }
          });
        }
      }
      
      // Sort by date/time (oldest first)
      unchecked.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}:00`);
        const dateTimeB = new Date(`${b.date}T${b.time}:00`);
        return dateTimeA - dateTimeB;
      });
      
      setUncheckedSessions(unchecked);
      
      if (unchecked.length === 0) {
        setError('Belgilanmagan davomatlar yo\'q');
      }
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUncheckedSessions();
  }, [refresh]);

  const markAttendance = async (sessionId, attendance) => {
    try {
      await assistantAPI.markAttendance(sessionId, { attendance });
      setSuccess('Davomat belgilandi');
      fetchUncheckedSessions(); // Refresh the list
    } catch (err) {
      setError('Davomatni belgilashda xatolik');
    }
  };

  return (
    <Card title="Davomatni belgilash">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <Button
        onClick={fetchUncheckedSessions}
        disabled={loading}
        style={{ marginBottom: '20px' }}
      >
        {loading ? 'Yuklanmoqda...' : 'Yangilash'}
      </Button>

      {uncheckedSessions.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '16px' }}>
            Belgilanmagan davomatlar ({uncheckedSessions.length})
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {uncheckedSessions.map((session, index) => (
              <div key={`${session.session_id}-${session.student_id}-${index}`} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid #eee',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {session.student_photo && (
                    <img 
                      src={session.student_photo} 
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
                    <div style={{ fontWeight: '500' }}>{session.student_name}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {session.date} {session.time} • {session.student_phone}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '12px',
                    color: '#666',
                    marginRight: '12px'
                  }}>
                    {session.attendance_status === 'kutilmoqda' ? 'Kutilmoqda' : session.attendance_status}
                  </span>
                  
                  <Button
                    size="small"
                    variant="success"
                    onClick={() => markAttendance(session.session_id, 'present')}
                  >
                    Keldi
                  </Button>
                  
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => markAttendance(session.session_id, 'absent')}
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