export type PromptCategory = 'chatgpt' | 'json' | 'image' | 'video' | 'coding' | 'general';

export interface PromptOptions {
  tone: string;
  length: string;
  role: string;
  context: string;
  constraints: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  date: string;
  author: string;
  likes: number;
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: PromptCategory;
  rawPrompt: string;
  iconName: string;
}

export type LayoutStyle = 'wide' | 'boxed' | 'sidebar-left' | 'sidebar-right';
export type ThemeMode = 'light' | 'dark' | 'glass-retro' | 'midnight-neon' | 'warm-amber';

export interface CustomizerState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeMode: ThemeMode;
  fontHeading: string;
  fontBody: string;
  layout: LayoutStyle;
}
