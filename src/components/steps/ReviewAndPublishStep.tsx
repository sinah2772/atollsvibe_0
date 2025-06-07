import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Globe, 
  Calendar,
  Users,
  MapPin,
  FileText,
  Send
} from 'lucide-react';
import { StepProps } from '../../types/editor';

// Local UI component implementations
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }> = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Alert: React.FC<React.HTMLAttributes<HTMLDivElement> & { variant?: string }> = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };
  
  return (
    <div className={`border rounded-md p-4 ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`} {...props}>
      {children}
    </div>
  );
};

const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-sm ${className}`} {...props}>
    {children}
  </p>
);

const Separator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`border-t border-gray-200 ${className}`} {...props} />
);

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

// Types
interface FormDataType {
  content?: string;
  title?: string;
  heading?: string;
  categories?: string[];
  coverImage?: string;
  atoll?: string;
  island?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  tags?: string[];
  collaborators?: string[];
  publishSchedule?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isDeveloping?: boolean;
  isExclusive?: boolean;
  isSponsored?: boolean;
  [key: string]: unknown;
}

export const ReviewAndPublishStep: React.FC<StepProps> = ({ 
  formData, 
  language = 'en',
  validationErrors = {}
}) => {
  const t = {
    en: {
      title: 'Review & Publish',
      description: 'Review your article before publishing',
      validationSummary: 'Validation Summary',
      allValid: 'All validations passed',
      hasErrors: 'Please fix the following issues before publishing',
      hasWarnings: 'Warning: Please review the following',
      articlePreview: 'Article Preview',
      basicInfo: 'Basic Information',
      locationAndFlags: 'Location & Flags',
      seoMetadata: 'SEO & Metadata',
      additionalInfo: 'Additional Information',
      collaboration: 'Collaboration',
      title_field: 'Title',
      heading: 'Heading',
      content: 'Content',
      categories: 'Categories',
      coverImage: 'Cover Image',
      location: 'Location',
      flags: 'Article Flags',
      metaTitle: 'Meta Title',
      metaDescription: 'Meta Description',
      keywords: 'Keywords',
      tags: 'Tags',
      collaborators: 'Collaborators',
      publishSchedule: 'Publish Schedule',
      readyToPublish: 'Ready to Publish',
      publishNow: 'Publish Now',
      saveDraft: 'Save as Draft',
      schedulePublish: 'Schedule Publication',
      publishActions: 'Publish Actions',
      confirmPublish: 'Are you sure you want to publish this article?',
      publishSuccess: 'Article published successfully!',
      draftSaved: 'Draft saved successfully!',
      scheduled: 'Article scheduled for publication',
      viewPreview: 'View Preview',
      editStep: 'Edit',
      noValue: 'Not set',
      wordCount: 'Word Count',
      estimatedReadTime: 'Estimated Read Time',
      minutes: 'minutes',
      publishingOptions: 'Publishing Options',
      immediate: 'Immediate',
      scheduled_for: 'Scheduled for'
    },
    dv: {
      title: 'ރިވިއު އަދި ޕަބްލިޝް',
      description: 'ޕަބްލިޝް ކުރުމުގެ ކުރިން ލިޔުން ރިވިއު ކުރުން',
      validationSummary: 'ވެލިޑޭޝަން ސަމަރީ',
      allValid: 'ހުރިހާ ވެލިޑޭޝަން ކާމިޔާބް',
      hasErrors: 'ޕަބްލިޝް ކުރުމުގެ ކުރިން މި މައްސަލަތައް ހައްލުކުރުން',
      hasWarnings: 'ހޮއްޓުވުން: މިއާ ބެހޭ ގޮތުން ރިވިއު ކުރުން',
      articlePreview: 'ލިޔުމުގެ ޕްރިވިއު',
      basicInfo: 'އާދައިގެ މައުލޫމާތު',
      locationAndFlags: 'ތަން އަދި ފްލެގްތައް',
      seoMetadata: 'ސީއީއޯ އަދި މެޓާޑޭޓާ',
      additionalInfo: 'އިތުރު މައުލޫމާތު',
      collaboration: 'ކޮލަބޮރޭޝަން',
      title_field: 'ނަން',
      heading: 'ހެޑިން',
      content: 'ކޮންޓެންޓް',
      categories: 'ކެޓަގަރީތައް',
      coverImage: 'ކަވަރ އިމޭޖް',
      location: 'ތަން',
      flags: 'ލިޔުމުގެ ފްލެގްތައް',
      metaTitle: 'މެޓާ ޓައިޓަލް',
      metaDescription: 'މެޓާ ޑިސްކްރިޕްޝަން',
      keywords: 'ކީވޯޑްތައް',
      tags: 'ޓެގްތައް',
      collaborators: 'ކޮލަބޮރޭޓަރުން',
      publishSchedule: 'ޕަބްލިޝް ޝެޑިއުލް',
      readyToPublish: 'ޕަބްލިޝް ކުރުމަށް ތައްޔާރު',
      publishNow: 'މިހާރު ޕަބްލިޝް ކުރުން',
      saveDraft: 'ޑްރާފްޓް ރައްކާކުރުން',
      schedulePublish: 'ޕަބްލިކޭޝަން ޝެޑިއުލް ކުރުން',
      publishActions: 'ޕަބްލިޝް އެކްޝަންތައް',
      confirmPublish: 'މި ލިޔުން ޕަބްލިޝް ކުރަން ޔަގީންތޯ؟',
      publishSuccess: 'ލިޔުން ކާމިޔާބުން ޕަބްލިޝް ކުރެވިއްޖެ!',
      draftSaved: 'ޑްރާފްޓް ކާމިޔާބުން ރައްކާކުރެވިއްޖެ!',
      scheduled: 'ލިޔުން ޕަބްލިކޭޝަނަށް ޝެޑިއުލް ކުރެވިއްޖެ',
      viewPreview: 'ޕްރިވިއު ބައްލަވާ',
      editStep: 'އެޑިޓް',
      noValue: 'ސެޓް ކުރެވިފައެއް ނެތް',
      wordCount: 'ބަސްތަކުގެ އަދަދު',
      estimatedReadTime: 'ކިޔުމަށް ލާގާވާ ވަގުތު',
      minutes: 'މިނިޓް',
      publishingOptions: 'ޕަބްލިޝް އޮޕްޝަންތައް',
      immediate: 'ހަމަ އެވަގުތު',
      scheduled_for: 'ޝެޑިއުލް ކުރެވުނު'
    }
  } as const;

  const text = t[language as keyof typeof t];

  // Calculate content statistics
  const calculateContentStats = () => {
    const content = (formData as FormDataType).content || '';
    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;
    const estimatedReadTime = Math.ceil(wordCount / 200); // Average reading speed
    return { wordCount, estimatedReadTime };
  };

  const stats = calculateContentStats();
  // Get all validation errors
  const getAllErrors = () => {
    const allErrors: string[] = [];
    Object.values(validationErrors).forEach((stepErrors: unknown) => {
      if (Array.isArray(stepErrors)) {
        allErrors.push(...stepErrors);
      }
    });
    return allErrors;
  };

  const allErrors = getAllErrors();
  const hasErrors = allErrors.length > 0;

  // Type cast formData for better type safety
  const typedFormData = formData as FormDataType;

  // Create preview sections
  const previewSections = [
    {
      icon: FileText,
      title: text.basicInfo,
      items: [
        { label: text.title_field, value: typedFormData.title },
        { label: text.heading, value: typedFormData.heading },
        { label: text.categories, value: typedFormData.categories?.join(', ') },
        { label: text.coverImage, value: typedFormData.coverImage ? 'Set' : text.noValue },
        { label: text.wordCount, value: stats.wordCount.toString() },
        { label: text.estimatedReadTime, value: `${stats.estimatedReadTime} ${text.minutes}` }
      ]
    },
    {
      icon: MapPin,
      title: text.locationAndFlags,
      items: [
        { label: text.location, value: [typedFormData.atoll, typedFormData.island].filter(Boolean).join(', ') || text.noValue },
        { label: text.flags, value: Object.entries(typedFormData)
          .filter(([key, value]) => ['isBreaking', 'isFeatured', 'isDeveloping', 'isExclusive', 'isSponsored'].includes(key) && value)
          .map(([key]) => key.replace('is', ''))
          .join(', ') || text.noValue }
      ]
    },
    {
      icon: Globe,
      title: text.seoMetadata,
      items: [
        { label: text.metaTitle, value: typedFormData.metaTitle },
        { label: text.metaDescription, value: typedFormData.metaDescription },
        { label: text.keywords, value: typedFormData.keywords?.join(', ') },
        { label: text.tags, value: typedFormData.tags?.join(', ') }
      ]
    },
    {
      icon: Users,
      title: text.collaboration,
      items: [
        { label: text.collaborators, value: typedFormData.collaborators?.length ? `${typedFormData.collaborators.length} assigned` : text.noValue },
        { label: text.publishSchedule, value: typedFormData.publishSchedule === 'now' ? text.immediate : 
          typedFormData.scheduledDate ? `${text.scheduled_for} ${typedFormData.scheduledDate} ${typedFormData.scheduledTime || ''}` : text.noValue }
      ]
    }
  ];

  const handlePublish = async () => {
    if (hasErrors) {
      return;
    }
    
    // Here you would implement the actual publish logic
    console.log('Publishing article...', formData);
    
    // Show success message or redirect
  };

  const handleSaveDraft = async () => {
    // Here you would implement the save draft logic
    console.log('Saving draft...', formData);
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

      {/* Validation Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {hasErrors ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {text.validationSummary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasErrors ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">{text.hasErrors}</div>
                <ul className="list-disc list-inside space-y-1">
                  {allErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {text.allValid}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Article Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5" />
            {text.articlePreview}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {previewSections.map((section, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-white truncate">
                      {item.value || text.noValue}
                    </p>
                  </div>
                ))}
              </div>
              
              {index < previewSections.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Content Preview */}
      {typedFormData.content && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{text.content}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: typedFormData.content.substring(0, 500) + (typedFormData.content.length > 500 ? '...' : '')
              }}
            />
            {typedFormData.content.length > 500 && (
              <Button variant="outline" className="mt-4">
                <Eye className="h-4 w-4 mr-2" />
                {text.viewPreview}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publishing Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-5 w-5" />
            {text.publishActions}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasErrors ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {text.hasErrors}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {text.readyToPublish}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handlePublish}
              disabled={hasErrors}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {typedFormData.publishSchedule === 'scheduled' ? text.schedulePublish : text.publishNow}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSaveDraft}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              {text.saveDraft}
            </Button>
          </div>

          {typedFormData.publishSchedule === 'scheduled' && typedFormData.scheduledDate && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                {text.scheduled_for}: {typedFormData.scheduledDate} {typedFormData.scheduledTime || ''}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewAndPublishStep;
