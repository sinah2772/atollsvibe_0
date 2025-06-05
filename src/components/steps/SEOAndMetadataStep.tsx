import React from 'react';
import { StepProps } from '../MultiStepForm';
import CollaborativeInput from '../CollaborativeInput';
import CollaborativeTextArea from '../CollaborativeTextArea';
import MultiSelect from '../MultiSelect';

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  relatedArticles: string[];
  customURL: string;
  canonicalURL: string;
  socialTitle: string;
  socialDescription: string;
  ogImageAlt: string;
}

export const validateSEOAndMetadata = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Meta title validation
  if (data.metaTitle && data.metaTitle.length > 60) {
    errors.push('Meta title should be 60 characters or less');
  }
  
  // Meta description validation
  if (data.metaDescription && data.metaDescription.length > 160) {
    errors.push('Meta description should be 160 characters or less');
  }
  
  // Custom URL validation
  if (data.customURL && !/^[a-z0-9-]+$/.test(data.customURL)) {
    errors.push('Custom URL should only contain lowercase letters, numbers, and hyphens');
  }
  
  // Canonical URL validation
  if (data.canonicalURL && !data.canonicalURL.startsWith('http')) {
    errors.push('Canonical URL must be a valid URL starting with http or https');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const SEOAndMetadataStep: React.FC<StepProps> = ({
  data,
  updateData,
  language,
  errors = []
}) => {
  const seoData = data as SEOData;

  // Sample data for dropdowns
  const availableTags = [
    'Breaking News', 'Politics', 'Economy', 'Tourism', 'Environment',
    'Health', 'Education', 'Sports', 'Culture', 'Technology'
  ];

  const availableArticles = [
    'Recent Article 1', 'Recent Article 2', 'Recent Article 3'
  ];

  const handleInputChange = (field: keyof SEOData, value: any) => {
    updateData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* SEO Meta Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {language === 'dv' ? 'SEO މައުލޫމާތު' : 'SEO Information'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'މެޓާ ޓައިޓަލް' : 'Meta Title'}
              <span className="text-xs text-gray-500 ml-2">
                ({seoData.metaTitle?.length || 0}/60)
              </span>
            </label>
            <CollaborativeInput
              value={seoData.metaTitle || ''}
              onChange={(value) => handleInputChange('metaTitle', value)}
              placeholder={language === 'dv' ? 'SEO ޓައިޓަލް...' : 'SEO title...'}
              maxLength={60}
              className={seoData.metaTitle?.length > 60 ? 'border-red-300' : ''}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'މެޓާ ތަފްސީލު' : 'Meta Description'}
              <span className="text-xs text-gray-500 ml-2">
                ({seoData.metaDescription?.length || 0}/160)
              </span>
            </label>
            <CollaborativeTextArea
              value={seoData.metaDescription || ''}
              onChange={(value) => handleInputChange('metaDescription', value)}
              placeholder={language === 'dv' ? 'SEO ތަފްސީލު...' : 'SEO description...'}
              rows={3}
              maxLength={160}
              className={seoData.metaDescription?.length > 160 ? 'border-red-300' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'ކަސްޓަމް URL' : 'Custom URL'}
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                /articles/
              </span>
              <CollaborativeInput
                value={seoData.customURL || ''}
                onChange={(value) => handleInputChange('customURL', value)}
                placeholder={language === 'dv' ? 'custom-url' : 'custom-url'}
                className="rounded-l-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'ކެނޮނިކަލް URL' : 'Canonical URL'}
            </label>
            <CollaborativeInput
              value={seoData.canonicalURL || ''}
              onChange={(value) => handleInputChange('canonicalURL', value)}
              placeholder="https://..."
              type="url"
            />
          </div>
        </div>
      </div>

      {/* Keywords and Tags */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {language === 'dv' ? 'ކީވޯޑް އަދި ޓެގް' : 'Keywords and Tags'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'ކީވޯޑް' : 'Keywords'}
            </label>
            <MultiSelect
              values={seoData.keywords || []}
              onChange={(values) => handleInputChange('keywords', values)}
              placeholder={language === 'dv' ? 'ކީވޯޑް އިދާރާކުރައްވާ...' : 'Add keywords...'}
              allowCustom={true}
            />
            <p className="text-xs text-gray-500 mt-1">
              {language === 'dv' ? 'Enter ފުށުއަރުވާ ކީވޯޑް' : 'Press Enter to add keywords'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'ޓެގް' : 'Tags'}
            </label>
            <MultiSelect
              values={seoData.tags || []}
              onChange={(values) => handleInputChange('tags', values)}
              options={availableTags}
              placeholder={language === 'dv' ? 'ޓެގް އިހްތިޔާރުކުރައްވާ...' : 'Select tags...'}
              allowCustom={true}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
          </svg>
          {language === 'dv' ? 'ސޯޝަލް މީޑިއާ' : 'Social Media'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'ސޯޝަލް ޓައިޓަލް' : 'Social Media Title'}
            </label>
            <CollaborativeInput
              value={seoData.socialTitle || ''}
              onChange={(value) => handleInputChange('socialTitle', value)}
              placeholder={language === 'dv' ? 'ފޭސްބުކް/ޓްވިޓަރ ޓައިޓަލް...' : 'Facebook/Twitter title...'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'OG އިމޭޖް Alt ޓެކްސްޓް' : 'OG Image Alt Text'}
            </label>
            <CollaborativeInput
              value={seoData.ogImageAlt || ''}
              onChange={(value) => handleInputChange('ogImageAlt', value)}
              placeholder={language === 'dv' ? 'އިމޭޖް ތަފްސީލު...' : 'Image description...'}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'dv' ? 'ސޯޝަލް ތަފްސީލު' : 'Social Media Description'}
            </label>
            <CollaborativeTextArea
              value={seoData.socialDescription || ''}
              onChange={(value) => handleInputChange('socialDescription', value)}
              placeholder={language === 'dv' ? 'ސޯޝަލް މީޑިއާ ތަފްސީލު...' : 'Social media description...'}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          {language === 'dv' ? 'ގުޅުންހުރި ލިޔުން' : 'Related Articles'}
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'dv' ? 'ގުޅުންހުރި ލިޔުން' : 'Related Articles'}
          </label>
          <MultiSelect
            values={seoData.relatedArticles || []}
            onChange={(values) => handleInputChange('relatedArticles', values)}
            options={availableArticles}
            placeholder={language === 'dv' ? 'ގުޅުންހުރި ލިޔުން އިހްތިޔާރުކުރައްވާ...' : 'Select related articles...'}
            maxSelections={5}
          />
          <p className="text-xs text-gray-500 mt-1">
            {language === 'dv' ? 'އެންމެ ގިނަވެގެން 5 ލިޔުން' : 'Maximum 5 articles'}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h4 className="text-sm font-medium text-red-800">
              {language === 'dv' ? 'ތިރީގައިވާ މައްސަލަތައް ހައްލުކުރައްވާ:' : 'Please fix the following issues:'}
            </h4>
          </div>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SEOAndMetadataStep;
