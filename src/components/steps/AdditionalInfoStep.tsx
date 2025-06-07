import React from 'react';
import { Trash2, Plus, ExternalLink, Info, FileText, Globe } from 'lucide-react';
import { StepProps } from '../../types/editor';

export const AdditionalInfoStep: React.FC<StepProps> = ({ 
  formData, 
  onFormDataChange,
  language = 'en'
}) => {
  const t = {
    en: {
      title: 'Additional Information',
      description: 'Add supplementary information for your article',
      authorNotes: 'Author Notes',
      authorNotesPlaceholder: 'Internal notes for the author...',
      editorNotes: 'Editor Notes',
      editorNotesPlaceholder: 'Notes for editors and reviewers...',
      sourceUrls: 'Source URLs',
      sourceUrlsDesc: 'Add reference URLs and sources',
      addSource: 'Add Source',
      sourceName: 'Source Name',
      sourceUrl: 'Source URL',
      sourceNamePlaceholder: 'e.g., Ministry of Environment',
      sourceUrlPlaceholder: 'https://example.com/article',
      translationInfo: 'Translation Information',
      originalLanguage: 'Original Language',
      translator: 'Translator',
      translatorPlaceholder: 'Translator name or ID',
      translationNotes: 'Translation Notes',
      translationNotesPlaceholder: 'Notes about the translation...',
      archiveSettings: 'Archive Settings',
      archiveDate: 'Archive Date',
      archiveReason: 'Archive Reason',
      legal: 'Legal & Compliance',
      copyrightInfo: 'Copyright Information',
      copyrightPlaceholder: 'Copyright details...',
      legalNotes: 'Legal Notes',
      legalNotesPlaceholder: 'Legal compliance notes...',
      remove: 'Remove',
      required: 'Required'
    },
    dv: {
      title: 'އިތުރު މައުލޫމާތު',
      description: 'ލިޔުމަށް އިތުރު މައުލޫމާތު އިތުރުކުރުން',
      authorNotes: 'ލިޔުންތެރިގެ ނޯޓްސް',
      authorNotesPlaceholder: 'ލިޔުންތެރިއަށް ދެއްވާ ނޯޓްސް...',
      editorNotes: 'އެޑިޓަރގެ ނޯޓްސް',
      editorNotesPlaceholder: 'އެޑިޓަރ އަދި ރިވިއުވަރުންނަށް ދެއްވާ ނޯޓްސް...',
      sourceUrls: 'ސޯސް ލިންކްތައް',
      sourceUrlsDesc: 'ރިފަރެންސް ލިންކްތަކާއި ސޯސްތައް އިތުރުކުރުން',
      addSource: 'ސޯސް އިތުރުކުރުން',
      sourceName: 'ސޯސްގެ ނަން',
      sourceUrl: 'ސޯސް ލިންކް',
      sourceNamePlaceholder: 'މިސާލު: މާޙައުލީ وزارت',
      sourceUrlPlaceholder: 'https://example.com/article',
      translationInfo: 'ތަރުޖަމާ މައުލޫމާތު',
      originalLanguage: 'އަސްލު ބަސް',
      translator: 'ތަރުޖަމާ ކުރާ ފަރާތް',
      translatorPlaceholder: 'ތަރުޖަމާ ކުރާ ފަރާތުގެ ނަން',
      translationNotes: 'ތަރުޖަމާ ނޯޓްސް',
      translationNotesPlaceholder: 'ތަރުޖަމާ ގުޅޭ ނޯޓްސް...',
      archiveSettings: 'އާކައިވް ސެޓިންގްސް',
      archiveDate: 'އާކައިވް ކުރާ ތާރީޚު',
      archiveReason: 'އާކައިވް ކުރާ ސަބަބު',
      legal: 'ޤާނޫނީ އަދި ކޮމްޕްލަޔަންސް',
      copyrightInfo: 'ކޮޕީރައިޓް މައުލޫމާތު',
      copyrightPlaceholder: 'ކޮޕީރައިޓް ތަފްސީލު...',
      legalNotes: 'ޤާނޫނީ ނޯޓްސް',
      legalNotesPlaceholder: 'ޤާނޫނީ ކޮމްޕްލަޔަންސް ނޯޓްސް...',
      remove: 'ނައްކާ',
      required: 'ބޭނުންވާ'
    }
  };
  const text = t[language as keyof typeof t];

  const handleFieldChange = (field: string, value: unknown) => {
    onFormDataChange({
      [field]: value
    });
  };
  const addSourceUrl = () => {
    const currentSources = (formData.sourceUrls as Array<{name: string, url: string}>) || [];
    handleFieldChange('sourceUrls', [
      ...currentSources,
      { name: '', url: '' }
    ]);
  };

  const updateSourceUrl = (index: number, field: 'name' | 'url', value: string) => {
    const currentSources = (formData.sourceUrls as Array<{name: string, url: string}>) || [];
    const updatedSources = currentSources.map((source: {name: string, url: string}, i: number) => 
      i === index ? { ...source, [field]: value } : source
    );
    handleFieldChange('sourceUrls', updatedSources);
  };

  const removeSourceUrl = (index: number) => {
    const currentSources = (formData.sourceUrls as Array<{name: string, url: string}>) || [];
    const updatedSources = currentSources.filter((_: unknown, i: number) => i !== index);
    handleFieldChange('sourceUrls', updatedSources);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {text.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {text.description}
        </p>
      </div>      {/* Author and Editor Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="pb-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <FileText className="h-5 w-5" />
              {text.authorNotes}
            </h3>
          </div>
          <div>
            <textarea
              placeholder={text.authorNotesPlaceholder}
              value={(formData.authorNotes as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('authorNotes', e.target.value)}
              className="min-h-[100px] w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="pb-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Info className="h-5 w-5" />
              {text.editorNotes}
            </h3>
          </div>
          <div>
            <textarea
              placeholder={text.editorNotesPlaceholder}
              value={(formData.editorNotes as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('editorNotes', e.target.value)}
              className="min-h-[100px] w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>      {/* Source URLs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="pb-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <ExternalLink className="h-5 w-5" />
            {text.sourceUrls}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {text.sourceUrlsDesc}
          </p>
        </div>
        <div className="space-y-4">
          {((formData.sourceUrls as Array<{name: string, url: string}>) || []).map((source: {name: string, url: string}, index: number) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor={`source-name-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.sourceName}</label>
                <input
                  id={`source-name-${index}`}
                  placeholder={text.sourceNamePlaceholder}
                  value={source.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSourceUrl(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`source-url-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.sourceUrl}</label>
                <input
                  id={`source-url-${index}`}
                  type="url"
                  placeholder={text.sourceUrlPlaceholder}
                  value={source.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSourceUrl(index, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>              <button
                type="button"
                onClick={() => removeSourceUrl(index)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                aria-label={`Remove source ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSourceUrl}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {text.addSource}
          </button>
        </div>
      </div>      {/* Translation Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="pb-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Globe className="h-5 w-5" />
            {text.translationInfo}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="originalLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.originalLanguage}</label>              <select
                id="originalLanguage"
                value={(formData.originalLanguage as string) || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('originalLanguage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select language</option>
                <option value="en">English</option>
                <option value="dv">Dhivehi</option>
                <option value="ar">Arabic</option>
                <option value="ur">Urdu</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div>
              <label htmlFor="translator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.translator}</label>
              <input
                id="translator"
                placeholder={text.translatorPlaceholder}
                value={(formData.translator as string) || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('translator', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="translationNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.translationNotes}</label>
            <textarea
              id="translationNotes"
              placeholder={text.translationNotesPlaceholder}
              value={(formData.translationNotes as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('translationNotes', e.target.value)}
              className="min-h-[80px] w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>      {/* Archive Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{text.archiveSettings}</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="archiveDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.archiveDate}</label>
              <input
                id="archiveDate"
                type="date"
                value={(formData.archiveDate as string) || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('archiveDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="archiveReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.archiveReason}</label>              <select
                id="archiveReason"
                value={(formData.archiveReason as string) || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('archiveReason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select reason</option>
                <option value="outdated">Outdated</option>
                <option value="duplicate">Duplicate</option>
                <option value="policy">Policy Violation</option>
                <option value="legal">Legal Issue</option>
                <option value="author_request">Author Request</option>
              </select>
            </div>
          </div>
        </div>
      </div>      {/* Legal & Compliance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{text.legal}</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="copyrightInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.copyrightInfo}</label>
            <textarea
              id="copyrightInfo"
              placeholder={text.copyrightPlaceholder}
              value={(formData.copyrightInfo as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('copyrightInfo', e.target.value)}
              className="min-h-[80px] w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="legalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{text.legalNotes}</label>
            <textarea
              id="legalNotes"
              placeholder={text.legalNotesPlaceholder}
              value={(formData.legalNotes as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('legalNotes', e.target.value)}
              className="min-h-[80px] w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
