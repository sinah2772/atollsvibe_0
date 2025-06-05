import React from 'react';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, ExternalLink, Info, FileText, Globe } from 'lucide-react';
import { StepProps } from '../MultiStepForm';

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

  const text = t[language];

  const handleFieldChange = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const addSourceUrl = () => {
    const currentSources = formData.sourceUrls || [];
    handleFieldChange('sourceUrls', [
      ...currentSources,
      { name: '', url: '' }
    ]);
  };

  const updateSourceUrl = (index: number, field: 'name' | 'url', value: string) => {
    const currentSources = formData.sourceUrls || [];
    const updatedSources = currentSources.map((source, i) => 
      i === index ? { ...source, [field]: value } : source
    );
    handleFieldChange('sourceUrls', updatedSources);
  };

  const removeSourceUrl = (index: number) => {
    const currentSources = formData.sourceUrls || [];
    const updatedSources = currentSources.filter((_, i) => i !== index);
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
      </div>

      {/* Author and Editor Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              {text.authorNotes}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={text.authorNotesPlaceholder}
              value={formData.authorNotes || ''}
              onChange={(e) => handleFieldChange('authorNotes', e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5" />
              {text.editorNotes}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={text.editorNotesPlaceholder}
              value={formData.editorNotes || ''}
              onChange={(e) => handleFieldChange('editorNotes', e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Source URLs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ExternalLink className="h-5 w-5" />
            {text.sourceUrls}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {text.sourceUrlsDesc}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.sourceUrls || []).map((source, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor={`source-name-${index}`}>{text.sourceName}</Label>
                <Input
                  id={`source-name-${index}`}
                  placeholder={text.sourceNamePlaceholder}
                  value={source.name}
                  onChange={(e) => updateSourceUrl(index, 'name', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`source-url-${index}`}>{text.sourceUrl}</Label>
                <Input
                  id={`source-url-${index}`}
                  type="url"
                  placeholder={text.sourceUrlPlaceholder}
                  value={source.url}
                  onChange={(e) => updateSourceUrl(index, 'url', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeSourceUrl(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addSourceUrl}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {text.addSource}
          </Button>
        </CardContent>
      </Card>

      {/* Translation Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5" />
            {text.translationInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="originalLanguage">{text.originalLanguage}</Label>
              <Select
                value={formData.originalLanguage || ''}
                onValueChange={(value) => handleFieldChange('originalLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="dv">Dhivehi</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="ur">Urdu</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="translator">{text.translator}</Label>
              <Input
                id="translator"
                placeholder={text.translatorPlaceholder}
                value={formData.translator || ''}
                onChange={(e) => handleFieldChange('translator', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="translationNotes">{text.translationNotes}</Label>
            <Textarea
              id="translationNotes"
              placeholder={text.translationNotesPlaceholder}
              value={formData.translationNotes || ''}
              onChange={(e) => handleFieldChange('translationNotes', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Archive Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{text.archiveSettings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="archiveDate">{text.archiveDate}</Label>
              <Input
                id="archiveDate"
                type="date"
                value={formData.archiveDate || ''}
                onChange={(e) => handleFieldChange('archiveDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="archiveReason">{text.archiveReason}</Label>
              <Select
                value={formData.archiveReason || ''}
                onValueChange={(value) => handleFieldChange('archiveReason', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outdated">Outdated</SelectItem>
                  <SelectItem value="duplicate">Duplicate</SelectItem>
                  <SelectItem value="policy">Policy Violation</SelectItem>
                  <SelectItem value="legal">Legal Issue</SelectItem>
                  <SelectItem value="author_request">Author Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal & Compliance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{text.legal}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="copyrightInfo">{text.copyrightInfo}</Label>
            <Textarea
              id="copyrightInfo"
              placeholder={text.copyrightPlaceholder}
              value={formData.copyrightInfo || ''}
              onChange={(e) => handleFieldChange('copyrightInfo', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="legalNotes">{text.legalNotes}</Label>
            <Textarea
              id="legalNotes"
              placeholder={text.legalNotesPlaceholder}
              value={formData.legalNotes || ''}
              onChange={(e) => handleFieldChange('legalNotes', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Validation function for this step
export const validateAdditionalInfo = (formData: any): string[] => {
  const errors: string[] = [];

  // Validate source URLs if provided
  if (formData.sourceUrls && formData.sourceUrls.length > 0) {
    formData.sourceUrls.forEach((source: any, index: number) => {
      if (source.name && !source.url) {
        errors.push(`Source ${index + 1}: URL is required when name is provided`);
      }
      if (source.url && !source.name) {
        errors.push(`Source ${index + 1}: Name is required when URL is provided`);
      }
      if (source.url && !isValidUrl(source.url)) {
        errors.push(`Source ${index + 1}: Invalid URL format`);
      }
    });
  }

  // Validate translation info consistency
  if (formData.translator && !formData.originalLanguage) {
    errors.push('Original language is required when translator is specified');
  }

  return errors;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
