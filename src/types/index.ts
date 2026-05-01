export type Priority = 'A' | 'B' | 'C' | 'UNASSIGNED';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  isCompleted: boolean;
  isLoggedDistraction: boolean;
  createdAt: number;
}

export type TimerMode = 'IDLE' | 'CALIBRATING' | 'FOCUSING' | 'ON_BREAK' | 'WRAP_UP';

export interface FocusSession {
  date: string; // YYYY-MM-DD
  durationMs: number;
}

export interface UserProfile {
  baselineFocusTimeMs: number | null;
  calibrationHistory: number[];
  sessionHistory: FocusSession[];
  energyLevel: number; // 0.5 to 1.5 multiplier based on biometrics
}

export interface SpatialState {
  isSyncEnabled: boolean;
  currentMode: TimerMode;
  timeLeft: number;
  totalTime: number;
}

export interface BrainDump {
  id: string;
  date: string; // YYYY-MM-DD
  rawContent: string;
  processedContent?: string;
  untangledData?: AIUntangledData;
  createdAt: number;
}

export interface AIUntangledData {
  mood: string[];
  distortions: string[];
  entities: string[];
  themes: string[];
  summary: string;
  actionItem: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  content: string;
  links: string[];
  hashtags: string[];
  createdAt: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'entity' | 'upload' | 'core';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export * from './tools';
