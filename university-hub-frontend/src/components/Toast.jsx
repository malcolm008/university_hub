import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const Toast = () => {
  const { toast } = useApp();
  
  if (!toast.show) return null;
  
  return (
    <div className={`toast show ${toast.type}`}>
      <div className="flex items-center gap-3">
        <i className={`fas ${
          toast.type === 'success' 
            ? 'fa-check-circle' 
            : toast.type === 'error' 
            ? 'fa-exclamation-circle' 
            : 'fa-info-circle'
        }`}></i>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;