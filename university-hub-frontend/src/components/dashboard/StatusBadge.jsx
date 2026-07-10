const StatusBadge = ({ status, validated }) => {
    let label = 'Pending';
    let icon = 'fa-clock';
    let color = 'bg-yellow-100 text-yellow-700';

    if (validated) {
        label = 'Validated';
        icon = 'fa-badge-check';
        color = 'bg-purple-100 text-purple-700';
    } else if (status === 'submitted') {
        label = 'Submitted';
        icon = 'fa-check-circle';
        color = 'bg-green-100 text-green-700';
    }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <i className={`fas ${icon}`}></i>
      {label}
    </span>
  );
};

export default StatusBadge;