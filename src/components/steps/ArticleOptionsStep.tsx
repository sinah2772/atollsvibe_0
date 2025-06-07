import React from 'react';
import { StepProps } from '../../types/editor';
import { CollaborativeInput } from '../CollaborativeInput';

const ArticleOptionsStep: React.FC<StepProps> = ({ 
  formData, 
  onFormDataChange, 
  language,
  collaborative 
}) => {
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isBreaking as boolean || false} 
            onChange={(e) => handleChange('isBreaking', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
            {language === 'dv' ? 'ބްރޭކިންގ ނިއުސް' : 'Breaking News'}
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isFeatured as boolean || false} 
            onChange={(e) => handleChange('isFeatured', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
            {language === 'dv' ? 'ފީޗަރޑް' : 'Featured'}
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isDeveloping as boolean || false} 
            onChange={(e) => handleChange('isDeveloping', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
            {language === 'dv' ? 'ޑިވެލޮޕިންގް ސްޓޯރީ' : 'Developing Story'}
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isExclusive as boolean || false} 
            onChange={(e) => handleChange('isExclusive', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
            {language === 'dv' ? 'އެކްސްކްލޫސިވް' : 'Exclusive'}
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isSponsored as boolean || false} 
            onChange={(e) => handleChange('isSponsored', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
          />
          <span className={`${language === 'dv' ? 'thaana-waheed mr-2' : 'ml-2'}`}>
            {language === 'dv' ? 'ސްޕޮންސަރޑް' : 'Sponsored'}
          </span>
        </label>
      </div>      {/* Developing Story Configuration */}
      {Boolean(formData.isDeveloping) && (
        <div className="form-group p-3 border border-amber-200 bg-amber-50 rounded-md">
          <label htmlFor="developingUntil" className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ޑިވެލޮޕިންގް އަންޓިލް' : 'Developing Until'}
          </label>
          <input 
            id="developingUntil"
            type="datetime-local"
            value={String(formData.developingUntil || '')}
            onChange={(e) => handleChange('developingUntil', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className={`mt-1 text-xs text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'މި ތާރީޚާ ހަމައަށް "ޑިވެލޮޕިންގް" ބެޖް ދައްކާނެއެވެ' : 'The developing badge will be shown until this date'}
          </p>
        </div>
      )}      {/* Sponsored Configuration */}
      {Boolean(formData.isSponsored) && (
        <div className="space-y-4 p-3 border border-green-200 bg-green-50 rounded-md">
          <div className="form-group">
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތް' : 'Sponsored By'}
            </label>
            <CollaborativeInput
              fieldId="sponsoredBy"
              value={String(formData.sponsoredBy || '')}
              onChange={(value) => handleChange('sponsoredBy', value)}
              placeholder={language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތް' : 'Name of the sponsor'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              collaborative={collaborative || {
                isFieldLocked: () => false,
                lockField: () => {},
                unlockField: () => {},
                broadcastFieldUpdate: () => {},
                getFieldLocker: () => null,
                pendingUpdates: {}
              }}
              currentUser={''}
            />
          </div>

          <div className="form-group">
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސްޕޮންސަރގެ ލިންކް' : 'Sponsor URL'}
            </label>
            <CollaborativeInput
              fieldId="sponsoredUrl"
              value={String(formData.sponsoredUrl || '')}
              onChange={(value) => handleChange('sponsoredUrl', value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              collaborative={collaborative || {
                isFieldLocked: () => false,
                lockField: () => {},
                unlockField: () => {},
                broadcastFieldUpdate: () => {},
                getFieldLocker: () => null,
                pendingUpdates: {}
              }}
              currentUser={''}
            />
          </div>
          
          <div className="form-group">
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސްޕޮންސަރ އިމޭޖް' : 'Sponsor Image URL'}
            </label>
            <CollaborativeInput
              fieldId="sponsoredImage"
              value={String(formData.sponsoredImage || '')}
              onChange={(value) => handleChange('sponsoredImage', value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              collaborative={collaborative || {
                isFieldLocked: () => false,
                lockField: () => {},
                unlockField: () => {},
                broadcastFieldUpdate: () => {},
                getFieldLocker: () => null,
                pendingUpdates: {}
              }}
              currentUser={''}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleOptionsStep;
