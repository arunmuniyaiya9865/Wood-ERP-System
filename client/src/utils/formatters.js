export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatVolume = (value, unit = 'm³') => {
  if (typeof value !== 'number') return '0.00 ' + unit;
  return `${value.toFixed(2)} ${unit}`;
};
