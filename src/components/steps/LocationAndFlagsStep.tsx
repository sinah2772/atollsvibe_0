import React from 'react';
import { CollaborativeInput } from '../CollaborativeInput';
import { MultiSelect } from '../MultiSelect';
import { IslandsSelect } from '../IslandsSelect';
import { ColoredMultiSelect } from '../ColoredMultiSelect';

// Define proper data types for atolls and government
interface AtollData {
  id: number;
  name: string;
  name_en: string;
  slug: string;
}

interface GovernmentData {
  id: string;
  name: string;
  name_en: string;
}

// Define option types that match the component requirements
interface AtollOption {
  id: number | string;
  name: string;
  name_en: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

interface IslandCategoryOption {
  id: number | string;
  name: string;
  name_en: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

interface GovernmentOption {
  id: number | string;
  name: string;
  name_en: string;
  type: 'category' | 'subcategory';
  parentCategoryName?: string;
  parentCategoryNameEn?: string;
  categoryId?: number;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

// Define collaborative interface
interface CollaborativeData {
  isFieldLocked: (fieldId: string) => boolean;
  lockField: (fieldId: string) => void;
  unlockField: (fieldId: string) => void;
  broadcastFieldUpdate: (fieldId: string, value: string) => void;
  getFieldLocker: (fieldId: string) => string | null;
  pendingUpdates: Record<string, string>;
}

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
  atolls: AtollData[];
  government: GovernmentData[];
  
  // Collaborative editing
  collaborative: CollaborativeData;
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
}) => {  const atollOptions: AtollOption[] = atolls.map(atoll => ({
    id: atoll.id,
    name: atoll.name,
    name_en: atoll.name_en || atoll.name
  }));

  const governmentOptions: GovernmentOption[] = government.map(gov => ({
    id: gov.id,
    name: gov.name,
    name_en: gov.name_en || gov.name,
    type: 'category' as const,
    categoryId: parseInt(gov.id)
  }));

  const islandCategoryOptions: IslandCategoryOption[] = [
    { id: 'residential', name: 'އާބާދީގެ', name_en: 'Residential' },
    { id: 'resort', name: 'ރީސޯޓް', name_en: 'Resort' },
    { id: 'industrial', name: 'ސިނާއީ', name_en: 'Industrial' },
    { id: 'uninhabited', name: 'އާބާދިކުރެވިފައިނުވާ', name_en: 'Uninhabited' },
    { id: 'picnic', name: 'ގޮއްވާ', name_en: 'Picnic Island' }
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
            </label>            <MultiSelect
              options={atollOptions}
              value={selectedAtolls.map(id => id.toString())}
              onChange={(values) => setSelectedAtolls(values.map(v => typeof v === 'string' ? parseInt(v) : v))}
              placeholder={language === 'dv' ? 'އަތޮޅު ހޮއްވަވާ' : 'Select atolls'}
              language={language}
            />
          </div>

          {/* Islands */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ރަށްރަށް' : 'Islands'}
            </label>            <IslandsSelect
              atollIds={selectedAtolls}
              value={selectedIslands}
              onChange={setSelectedIslands}
              language={language}
            />
          </div>

          {/* Island Categories */}
          {selectedIslands.length > 0 && (
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                {language === 'dv' ? 'ރަށުގެ ބާވަތް' : 'Island Category'}
              </label>              <MultiSelect
                options={islandCategoryOptions}
                value={selectedIslandCategory.map(id => id.toString())}
                onChange={(values) => setSelectedIslandCategory(values.map(v => v.toString()))}
                placeholder={language === 'dv' ? 'ރަށުގެ ބާވަތް ހޮއްވަވާ' : 'Select island categories'}
                language={language}
              />
            </div>
          )}

          {/* Government Organizations */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'ސަރުކާރީ އޮފީސްތައް' : 'Government Organizations'}
            </label>            <ColoredMultiSelect
              options={governmentOptions}
              value={selectedGovernmentIds}
              onChange={(values) => setSelectedGovernmentIds(values.map(v => v.toString()))}
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
            </label>            <select
              value={newsType}
              onChange={(e) => setNewsType(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed text-right' : ''
              }`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
              aria-label={language === 'dv' ? 'ޚަބަރުގެ ބާވަތް ހޮއްވަވާ' : 'Select news type'}
              title={language === 'dv' ? 'ޚަބަރުގެ ބާވަތް ހޮއްވަވާ' : 'Select news type'}
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
            </label>            <select
              value={newsPriority}
              onChange={(e) => setNewsPriority(parseInt(e.target.value))}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                language === 'dv' ? 'thaana-waheed text-right' : ''
              }`}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
              aria-label={language === 'dv' ? 'މުހިއްމުކަން ހޮއްވަވާ' : 'Select priority level'}
              title={language === 'dv' ? 'މުހިއްމުކަން ހޮއްވަވާ' : 'Select priority level'}
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
            </label>            <input
              type="datetime-local"
              value={developingUntil}
              onChange={(e) => setDevelopingUntil(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={language === 'dv' ? 'ޑިވެލޮޕިން ސްޓޯރީ ކަން މަނާ ތާރީޚު ހޮއްވަވާ' : 'Select developing story end date'}
              placeholder={language === 'dv' ? 'ތާރީޚް ހޮއްވަވާ' : 'Select date and time'}
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

export default LocationAndFlagsStep;
