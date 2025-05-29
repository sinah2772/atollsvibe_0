import React from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'en' | 'dv';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  language
}) => {
  // Common languages with their native names
  const languages: Language[] = [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      aria-label={language === 'dv' ? 'ތަރުޖަމާ ބަސް' : 'Translation Source Language'}
    >
      <option value="">
        {language === 'dv' ? 'ބަހެއް އިޚްތިޔާރު ކުރައްވާ' : 'Select a language'}
      </option>
      
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name} ({lang.nativeName})
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
