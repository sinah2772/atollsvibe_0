import React from 'react';

interface SaveAndContinueProps {
  onSaveAsDraft: () => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
  language: 'en' | 'dv';
}

const SaveAndContinue: React.FC<SaveAndContinueProps> = ({
  onSaveAsDraft,
  isSaving,
  lastSaved,
  language
}) => {
  const formatLastSavedTime = (date: Date): string => {
    // Get time difference in seconds
    const secondsDiff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (secondsDiff < 60) {
      return language === 'dv' 
        ? 'ދެންމެ ސޭވްވި' 
        : 'Just now';
    } else if (secondsDiff < 3600) {
      const minutes = Math.floor(secondsDiff / 60);
      return language === 'dv'
        ? `${minutes} މިނިޓް ކުރިން`
        : `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleTimeString(language === 'dv' ? 'dv-MV' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 border border-gray-200 z-50 flex items-center gap-3">
      {lastSaved && (
        <div className={`text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' 
            ? `އެންމެ ފަހުން ސޭވްކުރެވުނީ: ${formatLastSavedTime(lastSaved)}` 
            : `Last saved: ${formatLastSavedTime(lastSaved)}`}
        </div>
      )}
      
      <button
        onClick={onSaveAsDraft}
        disabled={isSaving}
        className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? 'ސޭވްވަނީ...' : 'Saving...'}
            </span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span className={language === 'dv' ? 'thaana-waheed' : ''}>
              {language === 'dv' ? 'ސޭވްކުރައްވާ' : 'Save Progress'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default SaveAndContinue;
