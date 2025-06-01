import React from 'react';
import { Save, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AutoSaveStatusProps {
  lastSaveTime?: Date | null;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  language?: 'en' | 'dv';
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({
  lastSaveTime,
  isSaving = false,
  hasUnsavedChanges = false,
  language = 'en',
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'dv' ? 'dv-MV' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusInfo = () => {
    if (isSaving) {
      return {
        icon: <Save className="animate-pulse" size={14} />,
        text: language === 'dv' ? 'ސޭވް ކުރަނީ...' : 'Saving...',
        className: 'text-blue-600',
      };
    }

    if (hasUnsavedChanges) {
      return {
        icon: <AlertCircle size={14} />,
        text: language === 'dv' ? 'ސޭވް ނުކުރި ބަދަލުތައް' : 'Unsaved changes',
        className: 'text-amber-600',
      };
    }

    if (lastSaveTime) {
      return {
        icon: <CheckCircle size={14} />,
        text: language === 'dv' 
          ? `ސޭވް ކުރި - ${formatTime(lastSaveTime)}`
          : `Saved at ${formatTime(lastSaveTime)}`,
        className: 'text-green-600',
      };
    }

    return {
      icon: <Clock size={14} />,
      text: language === 'dv' ? 'ސޭވް ނުކުރާ' : 'Not saved',
      className: 'text-gray-500',
    };
  };

  const { icon, text, className } = getStatusInfo();

  return (
    <div className={`flex items-center gap-1 text-xs ${className} ${language === 'dv' ? 'thaana-waheed' : ''}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};
