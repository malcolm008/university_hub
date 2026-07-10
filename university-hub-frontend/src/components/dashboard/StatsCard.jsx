const StatsCard = ({ icon, label, value, bgColor, textColor }) => {
  return (
    <div className="dashboard-stat">
      <div className="flex items-center gap-3">
        <div className={`icon-wrap ${bgColor} ${textColor}`}>
          <i className={icon}></i>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;