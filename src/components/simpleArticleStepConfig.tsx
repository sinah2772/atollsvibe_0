import { TitleStep } from './steps/TitleStep';
import { ContentStep } from './steps/ContentStep';
import { MetadataStep } from './steps/MetadataStep';
import { ValidationField, StepProps } from '../types/editor';

export interface SimpleStep {
  id: string;
  component: React.ComponentType<StepProps>;
  validation: (formData: Record<string, unknown>) => ValidationField[];
  title: {
    en: string;
    dv: string;
  };
  description: {
    en: string;
    dv: string;
  };
  fields: string[];
  optional?: boolean;
}

// Validation functions
const validateTitle = (formData: Record<string, unknown>): ValidationField[] => {
  const title = formData.title as string;
  const language = formData.language as string || 'en';
  
  return [
    {
      field: 'title',
      valid: !!title && title.trim().length >= 3,
      message: language === 'dv' 
        ? 'ނަމުގައި ވަންސާފައި 3 އަކުރު ހަމަޖެއްސަން ޖެއްސަ' 
        : 'Title must be at least 3 characters long'
    }
  ];
};

const validateContent = (formData: Record<string, unknown>): ValidationField[] => {
  const content = formData.content as string;
  const language = formData.language as string || 'en';
  
  return [
    {
      field: 'content',
      valid: !!content && content.trim().length >= 10,
      message: language === 'dv' 
        ? 'ކޮންޓެންޓް ވަންސާފައި 10 އަކުރު ހަމަޖެއްސަން ޖެއްސަ' 
        : 'Content must be at least 10 characters long'
    }
  ];
};

const validateMetadata = (formData: Record<string, unknown>): ValidationField[] => {
  const category = formData.category as string;
  const excerpt = formData.excerpt as string;
  const language = formData.language as string || 'en';
  
  return [
    {
      field: 'category',
      valid: !!category && category.trim().length > 0,
      message: language === 'dv' 
        ? 'ކެޓަގަރީއެއް ޙައްސަވާ' 
        : 'Please select a category'
    },
    {
      field: 'excerpt',
      valid: !excerpt || excerpt.trim().length <= 200,
      message: language === 'dv' 
        ? 'ރާދަޖެ 200 އަކުރުގެ ތިރީ ކުރަކީ ލާ ފާހަގަވާ' 
        : 'Excerpt should be less than 200 characters'
    }
  ];
};

export const simpleArticleSteps: SimpleStep[] = [
  {
    id: 'title',
    component: TitleStep,
    validation: validateTitle,
    title: {
      en: 'Article Title',
      dv: 'ލިޔުމުގެ ނަން'
    },
    description: {
      en: 'Start by giving your article a compelling title',
      dv: 'ތިޔަ ލިޔުމަށް ހޯއްނާ ނަމެއް ދިނުން ފަށާ'
    },
    fields: ['title']
  },
  {
    id: 'content',
    component: ContentStep,
    validation: validateContent,
    title: {
      en: 'Article Content',
      dv: 'ލިޔުމުގެ ކޮންޓެންޓް'
    },
    description: {
      en: 'Write the main content of your article',
      dv: 'ތިޔަ ލިޔުމުގެ އަސާސީ ކޮންޓެންޓް ލިޔެލާ'
    },
    fields: ['content']
  },
  {
    id: 'metadata',
    component: MetadataStep,
    validation: validateMetadata,
    title: {
      en: 'Article Details',
      dv: 'ލިޔުމުގެ ތަފްސީލް'
    },
    description: {
      en: 'Add category, tags, and excerpt to complete your article',
      dv: 'ތިޔަ ލިޔުން ކަމެއްލުމަށް ކެޓަގަރީ، ޓޭގް، އަދި ރާ ދާ ހިއްސާ ޞާފުކުރޭ'
    },
    fields: ['category', 'tags', 'excerpt'],
    optional: true
  }
];
