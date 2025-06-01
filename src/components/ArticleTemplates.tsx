import React from 'react';
import { FileText, X } from 'lucide-react';

interface ArticleTemplate {
  id: string;
  name: string;
  name_dv: string;
  description: string;
  description_dv: string;
  icon: string;
  title: string;
  socialHeading: string;
  content: string;
  newsType: string;
  newsPriority: number;
  isBreaking?: boolean;
}

interface ArticleTemplatesProps {
  language: 'en' | 'dv';
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (templateId: string) => void;
}

const articleTemplates: ArticleTemplate[] = [
  {
    id: 'breaking',
    name: 'Breaking News',
    name_dv: 'ކުއްލި ޚަބަރު',
    description: 'Urgent news that requires immediate attention',
    description_dv: 'ދިގުން އަންގަންޖެހޭ މުހިންމު ޚަބަރު',
    icon: '🚨',
    title: 'BREAKING: ',
    socialHeading: '🚨 ކުއްލި ޚަބަރު: ',
    content: '<h2>މުހިންމު ޚަބަރު</h2><p>[ޚަބަރުގެ ވަކި ތަފްޞީލު ލިޔުއްވާ]</p><h3>ތަފްޞީލު</h3><p>[އިތުރު މަޢުލޫމާތު]</p>',
    newsType: 'breaking',
    newsPriority: 1,
    isBreaking: true
  },
  {
    id: 'interview',
    name: 'Interview',
    name_dv: 'އިންޓަރވިއު',
    description: 'Structured interview format with questions and answers',
    description_dv: 'ސުވާލާއި ޖަވާބުގެ ބާވަތުގެ އިންޓަރވިއު',
    icon: '🎤',
    title: 'އިންޓަރވިއު: ',
    socialHeading: '🎤 އިންޓަރވިއު: ',
    content: '<h2>އިންޓަރވިއު</h2><p><strong>ސުވާލު:</strong> </p><p><strong>ޖަވާބު:</strong> </p><h3>އިތުރު ސުވާލުތައް</h3><p><strong>ސުވާލު:</strong> </p><p><strong>ޖަވާބު:</strong> </p>',
    newsType: 'interview',
    newsPriority: 3
  },
  {
    id: 'feature',
    name: 'Feature Article',
    name_dv: 'ފީޗަރ އާޓިކަލް',
    description: 'In-depth feature story with detailed analysis',
    description_dv: 'ތަފްޞީލް މަޢުލޫމާތާއެކު ފީޗަރ ލިޔުން',
    icon: '📰',
    title: '',
    socialHeading: '📰 ',
    content: '<h2>ތަޢާރަފު</h2><p>[މަވުޟޫޢުގެ ތަޢާރަފު]</p><h3>ތަފްޞީލު</h3><p>[މައި މަޢުލޫމާތު]</p><h3>ނިޔަލަ</h3><p>[ނިޔަލަ އަދި ހުޅުވާލުން]</p>',
    newsType: 'feature',
    newsPriority: 3
  },
  {
    id: 'announcement',
    name: 'Official Announcement',
    name_dv: 'ރަސްމީ އިޢުލާން',
    description: 'Official announcements and press releases',
    description_dv: 'ރަސްމީ އިޢުލާންތަކާއި ނޫސް ބަޔާން',
    icon: '📢',
    title: 'އިޢުލާން: ',
    socialHeading: '📢 އިޢުލާން: ',
    content: '<h2>އިޢުލާން</h2><p>[އިޢުލާނުގެ މައި ނަޒަރު]</p><h3>ތަފްޞީލު</h3><p>[އިތުރު މަޢުލޫމާތު]</p><h3>މުހިންމު ނޯޓް</h3><p>[މުހިންމު ބަޔާން]</p>',
    newsType: 'update',
    newsPriority: 2
  },
  {
    id: 'opinion',
    name: 'Opinion Piece',
    name_dv: 'ޚިޔާލު ލިޔުން',
    description: 'Editorial or opinion article format',
    description_dv: 'އެޑިޓޯރިއަލް ނުވަތަ ޚިޔާލު ފާޅުކުރާ ލިޔުން',
    icon: '💭',
    title: 'ޚިޔާލު: ',
    socialHeading: '💭 ޚިޔާލު: ',
    content: '<h2>މަވުޟޫޢު</h2><p>[ވިސްނުންތެރި ހުށަހެޅުން]</p><h3>އަޅުގަނޑުގެ ޚިޔާލު</h3><p>[ޚިޔާލުގެ މައި ބާރު]</p><h3>ނިންމުން</h3><p>[ނިންމުންތަކާއި ހުށަހެޅުންތައް]</p>',
    newsType: 'opinion',
    newsPriority: 4
  },
  {
    id: 'event',
    name: 'Event Coverage',
    name_dv: 'ހަފްލާ ރިޕޯޓް',
    description: 'Coverage of events, ceremonies, and gatherings',
    description_dv: 'ހަފްލާތަކާއި ހަމަވުމުތަކުގެ ރިޕޯޓް',
    icon: '🎉',
    title: '',
    socialHeading: '🎉 ',
    content: '<h2>ހަފްލާގެ ތަފްޞީލު</h2><p>[ހަފްލާގެ ތަޢާރަފު]</p><h3>ހަފްލާގައި ހިމެނި ކަންތައްތައް</h3><p>[ހަފްލާގެ މައި ބައިތައް]</p><h3>ބައިވެރިން</h3><p>[މުހިންމު ބައިވެރިންގެ މަޢުލޫމާތު]</p>',
    newsType: 'update',
    newsPriority: 3
  }
];

const ArticleTemplates: React.FC<ArticleTemplatesProps> = ({
  language,
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-blue-600" />
            <h2 className={`text-xl font-semibold ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' ? 'އާޓިކަލް ޓެމްޕްލެޓްސް' : 'Article Templates'}
            </h2>
          </div>          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close templates"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className={`text-gray-600 mb-6 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' 
              ? 'ތިރީގައިވާ ޓެމްޕްލެޓްތަކުގެ ތެރެއިން އިޚްތިޔާރުކޮށް ނަންގަވާ' 
              : 'Choose a template to get started with your article'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articleTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onApplyTemplate(template.id)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                      {language === 'dv' ? template.name_dv : template.name}
                    </h3>
                    <p className={`text-sm text-gray-600 mt-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                      {language === 'dv' ? template.description_dv : template.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded-full bg-gray-100 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' 
                      ? template.newsType === 'breaking' ? 'ކުއްލި' 
                        : template.newsType === 'interview' ? 'އިންޓަރވިއު'
                        : template.newsType === 'feature' ? 'ފީޗަރ'
                        : template.newsType === 'opinion' ? 'ޚިޔާލު'
                        : 'އަޕްޑޭޓް'
                      : template.newsType
                    }
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    template.newsPriority <= 2 ? 'bg-red-100 text-red-700' :
                    template.newsPriority === 3 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  } ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' 
                      ? `${template.newsPriority} - ${
                          template.newsPriority === 1 ? 'އާދެ މުހިންމު' :
                          template.newsPriority === 2 ? 'ވަރަށް މުހިންމު' :
                          template.newsPriority === 3 ? 'މުހިންމު' :
                          template.newsPriority === 4 ? 'މެދުމިން' : 'މުހިންމުނޫން'
                        }`
                      : `Priority ${template.newsPriority}`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className={`text-sm text-blue-800 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
              {language === 'dv' 
                ? '💡 ޓެމްޕްލެޓް އިޚްތިޔާރުކުރުމުން އާޓިކަލްގެ ބައިލަވަނީ ޑިފޯލްޓް ސެޓިންގްސްއޮށް ނަންގަވަނީ. ތިޔަކަށް ބޭނުންވާ ގޮތަށް ބަދަލުކުރެއްވި ހެއްޔެވެ.' 
                : '💡 Selecting a template will populate your article with default content and settings that you can customize.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleTemplates;
