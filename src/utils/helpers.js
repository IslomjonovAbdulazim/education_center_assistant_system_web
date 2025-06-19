export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ');
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.slice(0, 5); // HH:MM format
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('uz-UZ');
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Xayrli tong';
  if (hour < 18) return 'Xayrli kun';
  return 'Xayrli kech';
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+998\d{9}$/;
  return phoneRegex.test(phone);
};

export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};