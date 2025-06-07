// Core types from TipTap
import { Editor } from '@tiptap/react';

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
  field: string;
  valid: boolean;
  message?: string;
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

// Additional types for multi-step form
export interface FormData {
  // Basic Info
  title: string;
  heading: string;
  socialHeading: string;
  content: string;
  category: string[];
  subcategory: string[];
  coverImage: string;
  imageCaption: string;
  
  // Location & Flags
  location: string;
  atoll: string;
  island: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  flags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // SEO & Metadata
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  socialImage: string;
  
  // Additional Info
  tags: string[];
  author: string;
  coAuthors: string[];
  sources: string[];
  relatedArticles: string[];
  
  // Collaboration
  allowComments: boolean;
  enableCollaboration: boolean;
  notifySubscribers: boolean;
  
  // Publishing
  publishDate?: Date;
  status: 'draft' | 'review' | 'published';
  visibility: 'public' | 'private' | 'subscribers';
}

export interface StepProps {
  formData: Record<string, unknown>;
  onFormDataChange: (data: Partial<Record<string, unknown>>) => void;
  language: 'en' | 'dv';
  validationErrors?: ValidationField[];
  errors?: Record<string, string>;
  collaborative?: CollaborativeInterface;
  editor?: Editor | null;
  categories?: Array<Record<string, unknown>>;
  atolls?: Array<Record<string, unknown>>;
  government?: Array<Record<string, unknown>>;
  updateFormData?: (section: string, data: Record<string, unknown>) => void;
  onEdit?: (stepIndex: number) => void;
}

export interface StepData {
  id: string;
  title: {
    en: string;
    dv: string;
  };
  description: {
    en: string;
    dv: string;
  };
  component: React.ComponentType<StepProps>;
  validation?: (formData: Record<string, unknown>) => ValidationField[];
  fields: string[];
  optional?: boolean;
  icon?: string;
}

export interface Category {
  id: string;
  name: {
    en: string;
    dv: string;
  };
  slug: string;
  color?: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: {
    en: string;
    dv: string;
  };
  slug: string;
}

export interface EditorInstance {
  commands: {
    setContent: (content: string) => void;
    getHTML: () => string;
    focus: () => void;
  };
  isActive: (name: string) => boolean;
  chain: () => EditorInstance;
}

export interface CollaborativeData {
  isConnected: boolean;
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
    cursor?: {
      x: number;
      y: number;
    };
  }>;
}

/**
 * Field lock information for collaborative editing
 */
export interface FieldLock {
  field_name: string;
  user_id: string;
  user_email: string;
  locked_at: string;
  expires_at: string;
}

/**
 * Collaborative user information
 */
export interface CollaborativeUser {
  user_id: string;
  user_email: string;
  last_seen: string;
  current_field?: string;
}

/**
 * Article field update information
 */
export interface ArticleFieldUpdate {
  field_name: string;
  field_value: string;
  user_id: string;
  updated_at: string;
}

/**
 * Collaborative editing interface - matches useCollaborativeArticle return type
 */
export interface CollaborativeInterface {
  isConnected: boolean;
  activeUsers: CollaborativeUser[];
  fieldLocks: Record<string, FieldLock>;
  fieldUpdates: Record<string, ArticleFieldUpdate>;
  lockField: (fieldName: string) => Promise<boolean>;
  unlockField: (fieldName: string) => Promise<void>;
  isFieldLocked: (fieldName: string) => boolean;
  getFieldLock: (fieldName: string) => FieldLock | null;
  getFieldLocker: (fieldId: string) => string | null;
  getFieldUpdate: (fieldName: string) => ArticleFieldUpdate | null;
  clearFieldUpdate: (fieldName: string) => void;  broadcastFieldUpdate: (fieldName: string, fieldValue: string | number | boolean | object) => Promise<void>;
  pendingUpdates: Record<string, string>;
  debouncedBroadcastUpdate: (fieldName: string, fieldValue: string) => void;
  updatePresence: (currentField?: string) => void;
}
