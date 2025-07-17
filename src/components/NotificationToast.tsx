import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function NotificationToast() {
  const { notification, setNotification } = useApp();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  const getIcon = () => {
    if (notification.includes('✅') || notification.includes('sucesso')) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (notification.includes('❌') || notification.includes('erro')) {
      return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
    return <Info className="w-5 h-5 text-blue-400" />;
  };

  const getBackgroundColor = () => {
    if (notification.includes('✅') || notification.includes('sucesso')) {
      return 'bg-green-900/90 border-green-500/50';
    }
    if (notification.includes('❌') || notification.includes('erro')) {
      return 'bg-red-900/90 border-red-500/50';
    }
    return 'bg-blue-900/90 border-blue-500/50';
  };

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-sm ${getBackgroundColor()}`}>
        {getIcon()}
        <p className="text-white font-medium">{notification}</p>
        <button
          onClick={() => setNotification('')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}