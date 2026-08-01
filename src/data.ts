import { BlogPost, PresetTemplate } from './types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Art of Role Prompting: How to Turn LLMs Into Experts',
    content: `Role prompting is one of the most powerful techniques in prompt engineering. By assigning a specific persona or professional role to an AI model, you condition its latent space to prioritize contextually relevant terminology, structured logic, and specialized expertise.\n\n### Why it works\nWhen you tell an LLM to 'Act as a world-class Senior Software Architect with 15 years of experience in distributed systems,' you are narrowing the focus of the generator to expert-grade code, high security, and clean architecture.\n\n### Practical Example:\n**Raw:** 'Help me design a database for an e-commerce site.'\n**Role Prompted:** 'You are a staff SQL developer. Provide a highly optimized Postgres database schema for a multi-tenant e-commerce platform. Include indexing strategies, foreign keys, and cascading deletes. Output raw valid SQL.'`,
    category: 'ChatGPT',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    date: '2026-07-15',
    author: 'Elena Rostova',
    likes: 42
  },
  {
    id: 'post-2',
    title: 'Midjourney v6 Mastery: Sensory Keywords and Camera Angles',
    content: `Generating stunning images with Midjourney or DALL-E 3 requires moving beyond basic adjectives like "beautiful" or "detailed." Instead, you must describe the medium, lighting, camera settings, and specific textures.\n\n### Lighting\n- **Volumetric Lighting**: Creates dusty, golden shafts of light.\n- **Chiaroscuro**: Intense contrast between light and dark, perfect for dramatic portraits.\n\n### Camera Directives\n- **85mm lens, f/1.4 aperture**: Creates gorgeous depth-of-field (blurred background).\n- **High-angle drone shot**: Perfect for capturing sprawling landscapes and urban patterns.`,
    category: 'Image Generation',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    date: '2026-07-12',
    author: 'Marcus Vance',
    likes: 89
  },
  {
    id: 'post-3',
    title: 'Writing Safe and Parseable JSON Prompts for API Integrations',
    content: `When building applications powered by AI, obtaining consistent JSON structure is vital. Basic prompts often return markdown formatting or extra text like "Sure, here is your JSON."\n\n### How to guarantee perfect JSON:\n1. **Use responseSchema**: If using the Gemini SDK, leverage the native Type.OBJECT and Type.ARRAY response configuration.\n2. **Specify strict constraints**: Explicitly demand: 'Output ONLY raw, minified, valid JSON. DO NOT wrap in markdown block backticks. No trailing commas.'\n3. **One-shot schema definition**: Provide a visual template of the empty JSON object.`,
    category: 'JSON Generation',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    date: '2026-07-08',
    author: 'David Chen',
    likes: 56
  }
];

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'preset-1',
    name: 'Child-friendly Explainer',
    category: 'chatgpt',
    rawPrompt: 'Explain Quantum Physics to a 10 year old using a fun analogy of a playground.',
    iconName: 'Smile'
  },
  {
    id: 'preset-2',
    name: 'DALL-E Steampunk Portrait',
    category: 'image',
    rawPrompt: 'A close-up portrait of a mechanical owl with glowing brass gear eyes, sitting on a pile of leather-bound books.',
    iconName: 'Image'
  },
  {
    id: 'preset-3',
    name: 'Secure Node.js API Handler',
    category: 'coding',
    rawPrompt: 'Write an Express middleware to validate JWT tokens and protect a dashboard route, with comprehensive error handling.',
    iconName: 'Code'
  },
  {
    id: 'preset-4',
    name: 'Weekly Sales Report Schema',
    category: 'json',
    rawPrompt: 'Create a structure for weekly sales performance including branch id, total revenue, salesperson rankings, and product category breakdowns.',
    iconName: 'Braces'
  },
  {
    id: 'preset-5',
    name: 'Cinematic Drone Video',
    category: 'video',
    rawPrompt: 'A slow-moving drone shot of a high-tech organic forest filled with giant glowing purple mushrooms and waterfalls at night.',
    iconName: 'Video'
  },
  {
    id: 'preset-6',
    name: 'Eco-Friendly Product Pitch',
    category: 'general',
    rawPrompt: 'Write an persuasive email copy introducing a new bio-degradable yoga mat to conscious consumers, with a clear call-to-action.',
    iconName: 'FileText'
  }
];

export const GOOGLE_FONTS = {
  headings: ['Outfit', 'Space Grotesk', 'Playfair Display', 'Inter', 'Fira Code'],
  bodies: ['Inter', 'Space Grotesk', 'Fira Code', 'Outfit']
};

export const COLOR_PRESETS = [
  { name: 'Amethyst Spark', primary: '#8b5cf6', secondary: '#3b82f6', accent: '#f43f5e' },
  { name: 'Emerald Cyber', primary: '#059669', secondary: '#0d9488', accent: '#f59e0b' },
  { name: 'Sunset Bloom', primary: '#ea580c', secondary: '#db2777', accent: '#10b981' },
  { name: 'Neon Electric', primary: '#ec4899', secondary: '#8b5cf6', accent: '#06b6d4' },
  { name: 'Nordic Calm', primary: '#4b5563', secondary: '#4f46e5', accent: '#e11d48' }
];
