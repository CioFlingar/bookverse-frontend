export default function StatusBadge({ type = 'status', label, className = '' }) {
  const statusColors = {
    'Processing': 'bg-blue-100 text-blue-800',
    'In Transit': 'bg-yellow-100 text-yellow-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Reading': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
    'Owned': 'bg-gray-100 text-gray-800',
  };

  const genreColors = {
    'Fiction': 'bg-indigo-100 text-indigo-800',
    'Philosophy': 'bg-amber-100 text-amber-800',
    'Science': 'bg-cyan-100 text-cyan-800',
    'History': 'bg-orange-100 text-orange-800',
    'Biography': 'bg-pink-100 text-pink-800',
  };

  const colors = type === 'status' ? statusColors : genreColors;
  const color = colors[label] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color} ${className}`}>
      {label}
    </span>
  );
}
