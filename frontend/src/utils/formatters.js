// utils/formatters.js
export const formatDate = (date, locale = 'en-US', options = {}) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

export const formatDateTime = (date, locale = 'en-US') => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount, currency = 'ETB', locale = 'en-US') => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

export const formatGrade = (marks, maxMarks = 100) => {
  if (marks === undefined || marks === null) return 'N/A';
  const percent = (marks / maxMarks) * 100;
  if (percent >= 90) return 'A+';
  if (percent >= 80) return 'A';
  if (percent >= 75) return 'B+';
  if (percent >= 70) return 'B';
  if (percent >= 60) return 'C';
  if (percent >= 50) return 'D';
  return 'F';
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};