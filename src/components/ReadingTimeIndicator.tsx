import React from 'react';
import { Clock } from 'lucide-react';

interface ReadingTimeIndicatorProps {
  content: string;
  language: 'en' | 'dv';
  className?: string;
}

const ReadingTimeIndicator: React.FC<ReadingTimeIndicatorProps> = ({
  content,
  language,
  className = '',
}) => {
  const calculateReadingTime = (text: string): number => {
    // Remove HTML tags and get plain text
    const plainText = text.replace(/<[^>]*>/g, '');
    
    // Different reading speeds for different languages
    const wordsPerMinute = language === 'dv' ? 150 : 200; // Thaana typically slower
    
    // Count words (split by whitespace and filter empty strings)
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Calculate reading time in minutes (minimum 1 minute)
    const readingTime = Math.max(1, Math.ceil(words / wordsPerMinute));
    
    return readingTime;
  };

  const getReadabilityScore = (text: string): { score: number; level: string; color: string } => {
    const plainText = text.replace(/<[^>]*>/g, '');
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = plainText.replace(/\s/g, '').length;
    
    if (words === 0 || sentences === 0) {
      return { score: 0, level: language === 'dv' ? 'ނާދަންނަ' : 'Unknown', color: 'text-gray-500' };
    }
    
    // Simple readability calculation (adapted for both languages)
    const avgWordsPerSentence = words / sentences;
    const avgCharsPerWord = characters / words;
    
    // Score based on sentence length and word complexity
    let score = 100 - (avgWordsPerSentence * 1.5) - (avgCharsPerWord * 2);
    score = Math.max(0, Math.min(100, score));
    
    let level: string;
    let color: string;
    
    if (score >= 80) {
      level = language === 'dv' ? 'ވަރަށް ފަސޭހަ' : 'Very Easy';
      color = 'text-green-600';
    } else if (score >= 60) {
      level = language === 'dv' ? 'ފަސޭހަ' : 'Easy';
      color = 'text-green-500';
    } else if (score >= 40) {
      level = language === 'dv' ? 'މެދުމިން' : 'Medium';
      color = 'text-yellow-600';
    } else if (score >= 20) {
      level = language === 'dv' ? 'ދަތި' : 'Hard';
      color = 'text-orange-600';
    } else {
      level = language === 'dv' ? 'ވަރަށް ދަތި' : 'Very Hard';
      color = 'text-red-600';
    }
    
    return { score: Math.round(score), level, color };
  };

  const readingTime = calculateReadingTime(content);
  const readability = getReadabilityScore(content);
  const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className={`flex items-center gap-4 text-sm text-gray-600 ${className}`}>
      {/* Reading Time */}
      <div className="flex items-center gap-1">
        <Clock size={16} className="text-gray-500" />
        <span className={language === 'dv' ? 'thaana-waheed' : ''}>
          {language === 'dv' 
            ? `${readingTime} މިނެޓު ކިޔާ ވަގުތު`
            : `${readingTime} min read`
          }
        </span>
      </div>

      {/* Word Count */}
      <div className={`${language === 'dv' ? 'thaana-waheed' : ''}`}>
        {language === 'dv' 
          ? `${wordCount} ލަފުޒު`
          : `${wordCount} words`
        }
      </div>

      {/* Readability Score */}
      <div className="flex items-center gap-1">
        <span className={language === 'dv' ? 'thaana-waheed' : ''}>
          {language === 'dv' ? 'ކިޔުން:' : 'Reading:'}
        </span>
        <span className={`font-medium ${readability.color} ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {readability.level}
        </span>
        <span className="text-gray-400">
          ({readability.score}%)
        </span>
      </div>
    </div>
  );
};

export default ReadingTimeIndicator;
