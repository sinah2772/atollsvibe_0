// Core types from TipTap

/**
 * Base type for marks in TipTap content
 */
export interface MarkType {
  type: string;
  attrs?: Record<string, unknown>;
}

/**
 * Base type for nodes in TipTap content
 */
export interface NodeType {
  type: string;
  content?: NodeType[];
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: MarkType[];
}

/**
 * Represents a complete TipTap document structure
 */
export interface TipTapDocument {
  type: 'doc';
  content: NodeType[];
  marks?: MarkType[];
}

/**
 * Represents article publishing options
 */
export interface ArticleOptions {
  isBreaking: boolean;
  isFeatured: boolean;
  isDeveloping: boolean;
  isExclusive: boolean;
  isSponsored: boolean;
  sponsoredBy?: string;
  sponsoredUrl?: string;
}

/**
 * Advanced article metadata
 */
export interface ValidationField {
  name: string;
  valid: boolean;
  errorMessage?: string;
}

export interface EditorState {
  language: 'en' | 'dv';
  showImageBrowser: boolean;
  showPreview: boolean;
  showAdvancedOptions: boolean;
  hasUnsavedChanges: boolean;
  formTouched: boolean;
  error: string | null;
  saving: boolean;
  publishing: boolean;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  validationFields: ValidationField[];
}

export interface ArticleMetadata {
  newsType: 'update' | 'breaking' | 'feature' | 'opinion' | 'interview';
  newsPriority: 1 | 2 | 3 | 4 | 5;
  newsSource: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;  
  metaKeywords: string[];
  authorNotes: string;
  originalSourceUrl: string;
  translationSourceUrl: string;
  translationSourceLang: string;
  translationNotes: string;
}
