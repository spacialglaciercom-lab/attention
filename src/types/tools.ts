export interface ToolCategory {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
}

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  category: ToolCategoryType;
  author?: string;
  duration?: string;
}

export type ToolCategoryType =
  | 'sound_patterns'
  | 'breathing'
  | 'quotes'
  | 'emotions_101'
  | 'best_self'
  | 'movement'
  | 'mindfulness'
  | 'reframing'
  | 'connection'
  | 'creativity';

export type ToolFilter = 'all' | ToolCategoryType;
