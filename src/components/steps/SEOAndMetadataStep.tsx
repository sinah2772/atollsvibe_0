import React from 'react';
import { StepProps } from '../../types/editor';

const SEOAndMetadataStep: React.FC<StepProps> = ({
  formData,
  onFormDataChange,
  language
}) => {
  const handleChange = (field: string, value: unknown) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Meta Title */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މެޓާ ސުރުޚީ' : 'Meta Title'}
          <span className="text-xs text-gray-500 ml-2">
            ({((formData.metaTitle as string) || '').length}/60)
          </span>
        </label>
        <input
          type="text"
          value={(formData.metaTitle as string) || ''}
          onChange={(e) => handleChange('metaTitle', e.target.value)}
          placeholder={language === 'dv' ? 'މެޓާ ސުރުޚީ ލިޔެފާ' : 'Enter meta title'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          maxLength={60}
        />
      </div>

      {/* Meta Description */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މެޓާ ތަފްސީލު' : 'Meta Description'}
          <span className="text-xs text-gray-500 ml-2">
            ({((formData.metaDescription as string) || '').length}/160)
          </span>
        </label>
        <textarea
          value={(formData.metaDescription as string) || ''}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
          placeholder={language === 'dv' ? 'މެޓާ ތަފްސީލު ލިޔެފާ' : 'Enter meta description'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          maxLength={160}
        />
      </div>

      {/* Keywords */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ކީވޯޑްތައް' : 'Keywords'}
        </label>
        <input
          type="text"
          value={((formData.keywords as string[]) || []).join(', ')}
          onChange={(e) => handleChange('keywords', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'ކީވޯޑްތައް އެއްލަވާ' : 'Enter keywords (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
        <p className="text-xs text-gray-500 mt-1">
          {language === 'dv' ? 'ކަމާ ވަކިކުރުމަށް ބޭނުން' : 'Separate with commas'}
        </p>
      </div>

      {/* URL Slug */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސްލަގް' : 'URL Slug'}
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            /articles/
          </span>
          <input
            type="text"
            value={(formData.slug as string) || ''}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder={language === 'dv' ? 'ސްލަގް ލިޔެފާ' : 'Enter URL slug'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Canonical URL */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ކެނޮނިކަލް URL' : 'Canonical URL'}
        </label>
        <input
          type="url"
          value={(formData.canonicalURL as string) || ''}
          onChange={(e) => handleChange('canonicalURL', e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Social Media Title */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސޯޝަލް ސުރުޚީ' : 'Social Media Title'}
        </label>
        <input
          type="text"
          value={(formData.socialTitle as string) || ''}
          onChange={(e) => handleChange('socialTitle', e.target.value)}
          placeholder={language === 'dv' ? 'ސޯޝަލް މީޑިއާ ސުރުޚީ' : 'Social media title'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Social Media Description */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސޯޝަލް ތަފްސީލު' : 'Social Media Description'}
        </label>
        <textarea
          value={(formData.socialDescription as string) || ''}
          onChange={(e) => handleChange('socialDescription', e.target.value)}
          placeholder={language === 'dv' ? 'ސޯޝަލް މީޑިއާ ތަފްސީލު' : 'Social media description'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Social Image */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ސޯޝަލް ފޮޓޯ' : 'Social Image URL'}
        </label>
        <input
          type="url"
          value={(formData.socialImage as string) || ''}
          onChange={(e) => handleChange('socialImage', e.target.value)}
          placeholder={language === 'dv' ? 'ސޯޝަލް ފޮޓޯގެ ލިންކް' : 'Social image URL'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* OG Image Alt Text */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'OG އިމޭޖް Alt ޓެކްސްޓް' : 'OG Image Alt Text'}
        </label>
        <input
          type="text"
          value={(formData.ogImageAlt as string) || ''}
          onChange={(e) => handleChange('ogImageAlt', e.target.value)}
          placeholder={language === 'dv' ? 'އިމޭޖް ތަފްސީލު' : 'Image description'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Tags */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ޓެގްތައް' : 'Tags'}
        </label>
        <input
          type="text"
          value={((formData.tags as string[]) || []).join(', ')}
          onChange={(e) => handleChange('tags', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'ޓެގްތައް އެއްލަވާ' : 'Enter tags (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
        <p className="text-xs text-gray-500 mt-1">
          {language === 'dv' ? 'ކަމާ ވަކިކުރުމަށް ބޭނުން' : 'Separate with commas'}
        </p>
      </div>

      {/* Related Articles */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ގުޅުންހުރި ލިޔުންތައް' : 'Related Articles'}
        </label>
        <input
          type="text"
          value={((formData.relatedArticles as string[]) || []).join(', ')}
          onChange={(e) => handleChange('relatedArticles', e.target.value.split(', ').filter(Boolean))}
          placeholder={language === 'dv' ? 'ގުޅުންހުރި ލިޔުން ID' : 'Related article IDs (comma separated)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={language === 'dv' ? 'rtl' : 'ltr'}
        />
        <p className="text-xs text-gray-500 mt-1">
          {language === 'dv' ? 'އެންމެ ގިނަވެގެން 5 ލިޔުން' : 'Maximum 5 articles, separate with commas'}
        </p>
      </div>
    </div>
  );
};

export default SEOAndMetadataStep;
