import React from 'react';
import { StepProps } from '../../types/editor';

const ReviewAndPublishStepNew: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ހާލަތު' : 'Status'}
        </label>        <select
          value={(formData.status as string) || 'draft'}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={language === 'dv' ? 'ހާލަތު ޚިޔާރުކޮށް' : 'Select status'}
        >
          <option value="draft">{language === 'dv' ? 'ޑްރާފްޓް' : 'Draft'}</option>
          <option value="review">{language === 'dv' ? 'ރިވިޔޫ' : 'Review'}</option>
          <option value="published">{language === 'dv' ? 'ޕަބްލިޝް' : 'Published'}</option>
        </select>
      </div>

      {/* Visibility */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ފެންނަން' : 'Visibility'}
        </label>        <select
          value={(formData.visibility as string) || 'public'}
          onChange={(e) => handleChange('visibility', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={language === 'dv' ? 'ފެންނަން ޚިޔާރުކޮށް' : 'Select visibility'}
        >
          <option value="public">{language === 'dv' ? 'ޢާންމު' : 'Public'}</option>
          <option value="private">{language === 'dv' ? 'ޕްރައިވެޓް' : 'Private'}</option>
          <option value="subscribers">{language === 'dv' ? 'ސަބްސްކްރައިބަރުން' : 'Subscribers Only'}</option>
        </select>
      </div>

      {/* Publish Date */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ޕަބްލިޝް ކުރާ ތާރީޚް' : 'Publish Date'}
        </label>        <input
          type="datetime-local"
          value={formData.publishDate ? new Date(formData.publishDate as string).toISOString().slice(0, 16) : ''}
          onChange={(e) => handleChange('publishDate', e.target.value ? new Date(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={language === 'dv' ? 'ޕަބްލިޝް ކުރާ ތާރީޚް' : 'Select publish date and time'}
        />
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className={`text-lg font-medium text-gray-900 mb-3 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ލިޔުމުގެ ސަރާސަރީ' : 'Article Summary'}
        </h3>
        <div className="space-y-2 text-sm">
          <p><strong>{language === 'dv' ? 'ސުރުޚީ:' : 'Title:'}</strong> {(formData.title as string) || 'Not specified'}</p>
          <p><strong>{language === 'dv' ? 'ބައި:' : 'Categories:'}</strong> {((formData.category as string[]) || []).join(', ') || 'None'}</p>
          <p><strong>{language === 'dv' ? 'ތަން:' : 'Location:'}</strong> {(formData.location as string) || 'Not specified'}</p>
          <p><strong>{language === 'dv' ? 'ހާލަތު:' : 'Status:'}</strong> {(formData.status as string) || 'draft'}</p>
        </div>
      </div>
    </div>  );
};

export { ReviewAndPublishStepNew };
export default ReviewAndPublishStepNew;
