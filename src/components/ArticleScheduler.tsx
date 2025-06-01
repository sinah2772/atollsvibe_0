import React from 'react';
import { Calendar, Bell, BellOff } from 'lucide-react';

interface ArticleSchedulerProps {
  language: 'en' | 'dv';
  isScheduled: boolean;
  setIsScheduled: (value: boolean) => void;
  scheduledDate: string;
  setScheduledDate: (value: string) => void;
  scheduledTime: string;
  setScheduledTime: (value: string) => void;
  sendPushNotification: boolean;
  setSendPushNotification: (value: boolean) => void;
  pushNotificationTitle: string;
  setPushNotificationTitle: (value: string) => void;
  pushNotificationBody: string;
  setPushNotificationBody: (value: string) => void;
}

const ArticleScheduler: React.FC<ArticleSchedulerProps> = ({
  language,
  isScheduled,
  setIsScheduled,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  sendPushNotification,
  setSendPushNotification,
  pushNotificationTitle,
  setPushNotificationTitle,
  pushNotificationBody,
  setPushNotificationBody,
}) => {  // Get current date for minimum values
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className={`text-lg font-medium mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
        {language === 'dv' ? 'ޕަބްލިޝް ކުރުމުގެ ތަރުތީބު' : 'Publishing Schedule'}
      </h3>
      
      {/* Schedule Toggle */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <Calendar size={18} className="text-gray-600" />
          <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
            {language === 'dv' ? 'ސާޟަލްޑް ޕަބްލިޝިން' : 'Schedule for later'}
          </span>
        </label>
      </div>

      {/* Schedule Date and Time */}
      {isScheduled && (        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="scheduled-date" className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ތާރީޚް' : 'Date'}
            </label>
            <input
              id="scheduled-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={currentDate}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="scheduled-time" className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ގަޑި' : 'Time'}
            </label>
            <input
              id="scheduled-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Push Notification Settings */}
      <div className="border-t border-gray-200 pt-4">
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendPushNotification}
              onChange={(e) => setSendPushNotification(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            {sendPushNotification ? (
              <Bell size={18} className="text-blue-600" />
            ) : (
              <BellOff size={18} className="text-gray-400" />
            )}
            <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
              {language === 'dv' ? 'ޕުޝް ނޯޓިފިކޭޝަން ފޮނުވާ' : 'Send push notification'}
            </span>
          </label>
        </div>        {sendPushNotification && (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="notification-title" className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ނޯޓިފިކޭޝަން ސުރުޚީ' : 'Notification Title'}
              </label>
              <input
                id="notification-title"
                type="text"
                value={pushNotificationTitle}
                onChange={(e) => setPushNotificationTitle(e.target.value)}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                placeholder={language === 'dv' ? 'ނޯޓިފިކޭޝަން ސުރުޚީ' : 'Notification title'}
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label htmlFor="notification-message" className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ނޯޓިފިކޭޝަން މެސެޖް' : 'Notification Message'}
              </label>
              <textarea
                id="notification-message"
                value={pushNotificationBody}
                onChange={(e) => setPushNotificationBody(e.target.value)}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}
                rows={2}
                placeholder={language === 'dv' ? 'ނޯޓިފިކޭޝަން މެސެޖް' : 'Notification message'}
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleScheduler;
