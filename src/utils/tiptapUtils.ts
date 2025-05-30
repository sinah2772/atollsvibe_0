import { JSONContent } from '@tiptap/core';
import { TipTapDocument, NodeType } from '../types/editor';

/**
 * Converts JSONContent from TipTap editor to our TipTapDocument format
 * to ensure proper typing and compatibility with our components
 */
export const convertToTipTapDocument = (content: JSONContent | undefined): TipTapDocument => {
  if (!content) {
    return { type: 'doc', content: [] };
  }
  
  return {
    type: 'doc',
    content: content.content as NodeType[] || []
  };
};
