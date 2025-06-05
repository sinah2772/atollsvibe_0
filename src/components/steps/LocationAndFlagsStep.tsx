import React from 'react';
import { CollaborativeInput } from '../CollaborativeInput';
import { MultiSelect } from '../MultiSelect';
import { IslandsSelect } from '../IslandsSelect';
import { ColoredMultiSelect } from '../ColoredMultiSelect';
import { ValidationField } from '../../types/editor';

interface LocationAndFlagsStepProps {
  // Location fields
  selectedAtolls: number[];
  setSelectedAtolls: (value: number[]) => void;
  selectedIslands: number[];
  setSelectedIslands: (value: number[]) => void;
  selectedGovernmentIds: string[];
  setSelectedGovernmentIds: (value: string[]) => void;
  selectedIslandCategory: string[];
  setSelectedIslandCategory: (value: string[]) => void;
  
  // Article flags
  isBreaking: boolean;
  setIsBreaking: (value: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;
  isDeveloping: boolean;
  setIsDeveloping: (value: boolean) => void;
  isExclusive: boolean;
  setIsExclusive: (value: boolean) => void;
  isSponsored: boolean;
  setIsSponsored: (value: boolean) => void;
  sponsoredBy: string;
  setSponsoredBy: (value: string) => void;
  sponsoredUrl: string;
  setSponsoredUrl: (value: string) => void;
  developingUntil: string;
  setDevelopingUntil: (value: string) => void;
  
  // Priority and type
  newsPriority: number;
  setNewsPriority: (value: number) => void;
  newsType: string;
  setNewsType: (value: string) => void;
  
  // Data sources
  atolls: any[];
  government: any[];
  
  // Collaborative editing
  collaborative: any;
  currentUser: string;
  language: 'en' | 'dv';
}

export const LocationAndFlagsStep: React.FC<LocationAndFlagsStepProps> = ({
  selectedAtolls,
  setSelectedAtolls,
  selectedIslands,
  setSelectedIslands,
  selectedGovernmentIds,
  setSelectedGovernmentIds,
  selectedIslandCategory,
  setSelectedIslandCategory,
  isBreaking,
  setIsBreaking,
  isFeatured,
  setIsFeatured,
  isDeveloping,
  setIsDeveloping,
  isExclusive,
  setIsExclusive,
  isSponsored,
  setIsSponsored,
  sponsoredBy,
  setSponsoredBy,
  sponsoredUrl,
  setSponsoredUrl,
  developingUntil,
  setDevelopingUntil,
  newsPriority,
  setNewsPriority,
  newsType,
  setNewsType,
  atolls,
  government,
  collaborative,
  currentUser,
  language
}) => {
  const atollOptions = atolls.map(atoll => ({
    value: atoll.id.toString(),
    label: language === 'dv' ? atoll.name : atoll.name_en || atoll.name
  }));

  const governmentOptions = government.map(gov => ({
    value: gov.id.toString(),
    label: language === 'dv' ? gov.name : gov.name_en || gov.name,
    color: `hsl(${parseInt(gov.id) * 137.508}, 60%, 50%)`
  }));

  const islandCategoryOptions = [
    { value: 'residential', label: language === 'dv' ? 'އާބާދީގެ' : 'Residential' },
    { value: 'resort', label: language === 'dv' ? 'ރީސޯޓް' : 'Resort' },
    { value: 'industrial', label: language === 'dv' ? 'ސިނާއީ' : 'Industrial' },
    { value: 'uninhabited', label: language === 'dv' ? 'އާބާދިކުރެވިފައިނުވާ' : 'Uninhabited' },
    { value: 'picnic', label: language === 'dv' ? 'ގޮއްވާ' : 'Picnic Island' }
  ];

  const newsTypeOptions = [
    { value: 'breaking', label: language === 'dv' ? 'ބްރޭކިން' : 'Breaking News' },
    { value: 'update', label: language === 'dv' ? 'އަޕްޑޭޓް' : 'News Update' },
    { value: 'feature', label: language === 'dv' ? 'ފީޗަރ' : 'Feature Story' },
    { value: 'opinion', label: language === 'dv' ? 'ޚިޔާލު' : 'Opinion' },
    { value: 'interview', label: language === 'dv' ? 'އިންޓަވިއު' : 'Interview' },
    { value: 'analysis', label: language === 'dv' ? 'ތަހުލީލު' : 'Analysis' }
  ];

  const priorityLevels = [
    { value: 1, label: language === 'dv' ? 'އޮތް އެހެން މުހިއްމު' : 'Very High Priority' },
    { value: 2, label: language === 'dv' ? 'އޮތް މުހިއްމު' : 'High Priority' },
    { value: 3, label: language === 'dv' ? 'ސާދާ' : 'Normal Priority' },
    { value: 4, label: language === 'dv' ? 'ދަށް' : 'Low Priority' },
    { value: 5, label: language === 'dv' ? 'އޮތް ދަށް' : 'Very Low Priority' }
  ];

  return (
    <div className="space-y-6">
      {/* Location Section */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ޤައުމީ މަޢުލޫމާތު' : 'Location Information'}
        </h3>
        
        <div className="space-y-4">
          {/* Atolls */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އަތޮޅުތައް' : 'Atolls'}
            </label>
            <MultiSelect
              options={atollOptions}
              value={selectedAtolls.map(id => id.toString())}
              onChange={(values) => setSelectedAtolls(values.map(v => parseInt(v)))}
              placeholder={language === 'dv' ? 'އަތޮޅު ހޮއްވަވާ' : 'Select atolls'}
              language={language}
            />
          </div>

          {/* Islands */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ރަށްރަށް' : 'Islands'}
            </label>
            <IslandsSelect
              selectedAtolls={selectedAtolls}
              selectedIslands={selectedIslands}
              setSelectedIslands={setSelectedIslands}
              language={language}
            />
          </div>

          {/* Island Categories */}
          {selectedIslands.length > 0 && (
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ރަށުގެ ބާވަތް' : 'Island Category'}
              </label>
              <MultiSelect
                options={islandCategoryOptions}
                value={selectedIslandCategory}
                onChange={setSelectedIslandCategory}
                placeholder={language === 'dv' ? 'ރަށުގެ ބާވަތް ހޮއްވަވާ' : 'Select island categories'}
                language={language}
              />
            </div>
          )}

          {/* Government Organizations */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސަރުކާރީ އޮފީސްތައް' : 'Government Organizations'}
            </label>
            <ColoredMultiSelect
              options={governmentOptions}
              value={selectedGovernmentIds}
              onChange={setSelectedGovernmentIds}
              placeholder={language === 'dv' ? 'ސަރުކާރީ އޮފީސް ހޮއްވަވާ' : 'Select government organizations'}
              language={language}
            />
          </div>
        </div>
      </div>

      {/* News Type and Priority */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ޚަބަރުގެ ބާވަތާއި މުހިއްމުކަން' : 'News Type & Priority'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* News Type */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ޚަބަރުގެ ބާވަތް' : 'News Type'}
            </label>
            <select
              value={newsType}
              onChange={(e) => setNewsType(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed text-right' : ''
              }`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            >
              <option value="">{language === 'dv' ? 'ހޮއްވަވާ...' : 'Select...'}</option>
              {newsTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* News Priority */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'މުހިއްމުކަން' : 'Priority'}
            </label>
            <select
              value={newsPriority}
              onChange={(e) => setNewsPriority(parseInt(e.target.value))}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed text-right' : ''
              }`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            >
              {priorityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Article Flags */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'މަޝްހޫރުގެ ޚާއްސަ އަލާމާތްތައް' : 'Article Flags'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Breaking News */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
            />
            <span className={`ml-2 text-sm text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ބްރޭކިން ނިއުޒް' : 'Breaking News'}
            </span>
          </label>

          {/* Featured */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className={`ml-2 text-sm text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ފީޗަރ ޚަބަރު' : 'Featured'}
            </span>
          </label>

          {/* Developing */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isDeveloping}
              onChange={(e) => setIsDeveloping(e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
            <span className={`ml-2 text-sm text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ޑިވެލޮޕިން ޚަބަރު' : 'Developing Story'}
            </span>
          </label>

          {/* Exclusive */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isExclusive}
              onChange={(e) => setIsExclusive(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            />
            <span className={`ml-2 text-sm text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އެކްސްކްލޫސިވް' : 'Exclusive'}
            </span>
          </label>

          {/* Sponsored */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isSponsored}
              onChange={(e) => setIsSponsored(e.target.checked)}
              className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
            <span className={`ml-2 text-sm text-gray-700 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސްޕޮންސަރ ކުރެވިފައި' : 'Sponsored'}
            </span>
          </label>
        </div>

        {/* Developing Until Date */}
        {isDeveloping && (
          <div className="mt-4">
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ޑިވެލޮޕިން ސްޓޯރީ ކަން މަނާ ތާރީޚު' : 'Developing Until Date'}
            </label>
            <input
              type="datetime-local"
              value={developingUntil}
              onChange={(e) => setDevelopingUntil(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Sponsored Details */}
        {isSponsored && (
          <div className="mt-4 space-y-3">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތް' : 'Sponsored By'}
              </label>
              <CollaborativeInput
                fieldId="sponsoredBy"
                value={sponsoredBy}
                onChange={setSponsoredBy}
                collaborative={collaborative}
                currentUser={currentUser}
                placeholder={language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތުގެ ނަން' : 'Sponsor name'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir={language === 'dv' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ސްޕޮންސަރ ޔޫ.އާރ.އެލް' : 'Sponsor URL'}
              </label>
              <CollaborativeInput
                fieldId="sponsoredUrl"
                value={sponsoredUrl}
                onChange={setSponsoredUrl}
                collaborative={collaborative}
                currentUser={currentUser}
                placeholder={language === 'dv' ? 'ސްޕޮންސަރ ވެބްސައިޓް' : 'Sponsor website URL'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="url"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Validation function for location and flags step
export const validateLocationAndFlags = (data: any): ValidationField[] => {
  const validationFields: ValidationField[] = [];

  // If islands are selected, island category should be selected
  if (data.selectedIslands && data.selectedIslands.length > 0) {
    validationFields.push({
      name: 'Island Category',
      valid: data.selectedIslandCategory && data.selectedIslandCategory.length > 0,
      errorMessage: data.language === 'dv' ? 'ރަށް ހޮއްވާފައި ވާނަމަ ރަށުގެ ބާވަތް ހޮއްވަވާ' : 'Island category is required when islands are selected'
    });
  }

  // If sponsored, sponsor details are required
  if (data.isSponsored) {
    validationFields.push({
      name: 'Sponsor Name',
      valid: data.sponsoredBy && data.sponsoredBy.trim() !== '',
      errorMessage: data.language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތުގެ ނަން ލާޒިމް' : 'Sponsor name is required for sponsored content'
    });
  }

  // If developing, end date should be in the future
  if (data.isDeveloping && data.developingUntil) {
    const developingDate = new Date(data.developingUntil);
    const now = new Date();
    validationFields.push({
      name: 'Developing Until Date',
      valid: developingDate > now,
      errorMessage: data.language === 'dv' ? 'ޑިވެލޮޕިން ޚަބަރުގެ މުއްދަތު ކުރިއަށް ވާން ޖެހޭ' : 'Developing story end date must be in the future'
    });
  }

  return validationFields;
};

export default LocationAndFlagsStep;
