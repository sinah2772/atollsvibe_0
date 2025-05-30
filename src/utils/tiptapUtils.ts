import { JSONContent } from '@tiptap/core';

// Define types for nodes in the article JSON structure
interface MarkType {
  type: string;
  attrs?: Record<string, unknown>;
}

interface NodeType {
  type: string;
  content?: NodeType[];
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: MarkType[];
}

export interface TipTapDocument {
  type: string;
  content?: NodeType[];
}

/**
 * Converts JSONContent from TipTap editor to our TipTapDocument format
 * to ensure proper typing and compatibility with our components
 */
export const convertToTipTapDocument = (content: JSONContent | undefined): TipTapDocument => {
  if (!content) {
    return { type: 'doc', content: [] };
  }
  
  return {
    type: content.type || 'doc',
    content: content.content as NodeType[] || []
  };
};
