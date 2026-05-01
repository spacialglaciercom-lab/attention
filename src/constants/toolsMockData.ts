import { ToolCategory, ToolItem } from '../types/tools';

export const CATEGORIES: ToolCategory[] = [
  { id: 'sound_patterns', title: 'Sound Patterns', subtitle: '4 experiences' },
  { id: 'breathing', title: 'Breathing', subtitle: '5 practices' },
  { id: 'quotes', title: 'Quotes', subtitle: '128 affirmations' },
  { id: 'emotions_101', title: 'Emotions 101', subtitle: '10 videos' },
  { id: 'best_self', title: 'Best Self', subtitle: '3 tools' },
  { id: 'movement', title: 'Movement', subtitle: '6 videos' },
  { id: 'mindfulness', title: 'Mindfulness', subtitle: '9 videos' },
  { id: 'reframing', title: 'Reframing', subtitle: '6 strategies' },
  { id: 'connection', title: 'Connection', subtitle: '7 videos' },
  { id: 'creativity', title: 'Creativity', subtitle: '5 videos' },
];

export const TOOLS: ToolItem[] = [
  // Sound Patterns
  {
    id: 'sp-1',
    title: 'Play with sounds to relax, focus or manage your emotions',
    description: 'Explore binaural beats and ambient soundscapes for different states of mind.',
    category: 'sound_patterns',
    duration: '10-30 min',
  },
  {
    id: 'sp-2',
    title: 'Rain Meditation',
    description: 'Natural rain sounds to calm your nervous system.',
    category: 'sound_patterns',
    duration: '15 min',
  },
  {
    id: 'sp-3',
    title: 'Ocean Waves',
    description: 'Gentle ocean waves for relaxation and sleep preparation.',
    category: 'sound_patterns',
    duration: '20 min',
  },
  {
    id: 'sp-4',
    title: 'Focus Hum',
    description: 'Low-frequency humming sound for deep concentration.',
    category: 'sound_patterns',
    duration: '30 min',
  },
  // Breathing
  {
    id: 'br-1',
    title: 'Physiological Sigh',
    description: 'Co-opts stress response to quickly reset your nervous system.',
    category: 'breathing',
    duration: '2 min',
  },
  {
    id: 'br-2',
    title: 'Box Breathing',
    description: 'Focus your mind with this four-part breathing pattern.',
    category: 'breathing',
    duration: '5 min',
  },
  {
    id: 'br-3',
    title: '4-7-8 Breathing',
    description: 'Specially designed to help you fall asleep faster.',
    category: 'breathing',
    duration: '5 min',
  },
  {
    id: 'br-4',
    title: 'Coherent Breathing',
    description: 'Regulate your heart rate through rhythmic breathing.',
    category: 'breathing',
    duration: '10 min',
  },
  {
    id: 'br-5',
    title: 'Belly Breathing',
    description: 'Diaphragmatic breathing for grounding and calm.',
    category: 'breathing',
    duration: '5 min',
  },
  // Quotes
  {
    id: 'qt-1',
    title: 'Still I Rise',
    description: 'You may write me down in history with your bitter, twisted lies...',
    category: 'quotes',
    author: 'Maya Angelou',
  },
  {
    id: 'qt-2',
    title: 'Be Here Now',
    description: 'The quieter you become, the more you can hear.',
    category: 'quotes',
    author: 'Ram Dass',
  },
  {
    id: 'qt-3',
    title: 'Present Moment',
    description: 'There is no way to happiness. Happiness is the way.',
    category: 'quotes',
    author: 'Thich Nhat Hanh',
  },
  {
    id: 'qt-4',
    title: 'The Power of Now',
    description: 'Realize deeply that the present moment is all you ever have.',
    category: 'quotes',
    author: 'Eckhart Tolle',
  },
  {
    id: 'qt-5',
    title: 'Inner Peace',
    description: 'Peace comes from within. Do not seek it without.',
    category: 'quotes',
    author: 'Buddha',
  },
];
