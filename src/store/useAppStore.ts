import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TimerMode, UserProfile, Priority, FocusSession, BrainDump, AIUntangledData, UploadedFile } from '../types';
import { VaultService } from '../services/VaultService';
import { InferenceService } from '../services/InferenceService';

interface AppState {
  // Timer State
  timerMode: TimerMode;
  timeLeft: number;
  totalTime: number;
  startTime: number | null;
  isActive: boolean;
  
  // Pro Features State
  isNuclearMode: boolean; // Hard app blocking simulation
  isGlancePenaltyActive: boolean;
  currentLocation: 'HOME' | 'OFFICE' | 'UNKNOWN';
  geminiApiKey: string;
  mistralApiKey: string;
  
  // User Profile
  profile: UserProfile;
  tasks: Task[];
  brainDumps: BrainDump[];
  uploadedFiles: UploadedFile[];
  
  // Actions
  setTimerMode: (mode: TimerMode) => void;
  updateTimeLeft: () => void;
  startSession: (durationMs: number) => void;
  stopSession: () => void;
  setIsActive: (active: boolean) => void;
  
  // AI & Advanced Features
  processDistractionWithGemini: (text: string) => Promise<void>;
  untangleBrainDump: (id: string) => Promise<void>;
  addBrainDump: (content: string) => Promise<void>;
  uploadFile: (filename: string, content: string) => Promise<void>;
  toggleNuclearMode: (enabled: boolean) => void;
  toggleGlancePenalty: (enabled: boolean) => void;
  updateLocation: (loc: 'HOME' | 'OFFICE' | 'UNKNOWN') => void;
  setGeminiApiKey: (key: string) => void;
  setMistralApiKey: (key: string) => void;
  
  // Existing Actions
  addCalibrationTime: (timeMs: number) => void;
  addTask: (title: string, priority?: Priority, isLoggedDistraction?: boolean) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskPriority: (id: string, priority: Priority) => void;
  finishWrapUp: () => void;
  syncBiometrics: (level: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      timerMode: 'IDLE',
      timeLeft: 0,
      totalTime: 0,
      startTime: null,
      isActive: false,
      isNuclearMode: false,
      isGlancePenaltyActive: true,
      currentLocation: 'UNKNOWN',
      geminiApiKey: '',
      mistralApiKey: '',
      
      profile: {
        baselineFocusTimeMs: null,
        calibrationHistory: [],
        sessionHistory: [],
        energyLevel: 1.0,
      },
      
      tasks: [],
      brainDumps: [],
      uploadedFiles: [],
      
      setTimerMode: (mode) => set({ timerMode: mode }),
      setIsActive: (active) => set({ isActive: active }),

      toggleNuclearMode: (enabled) => set({ isNuclearMode: enabled }),
      toggleGlancePenalty: (enabled) => set({ isGlancePenaltyActive: enabled }),
      updateLocation: (loc) => set({ currentLocation: loc }),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setMistralApiKey: (key) => set({ mistralApiKey: key }),

      syncBiometrics: (level) => set((state) => ({ 
        profile: { ...state.profile, energyLevel: level } 
      })),

      // Gemini AI Integration Logic (Mocked for Prototype)
      processDistractionWithGemini: async (text) => {
        console.log(`[Gemini AI] Analyzing: "${text}"`);
        await new Promise(r => setTimeout(r, 1000));
        const isUrgent = text.toLowerCase().includes('must') || text.toLowerCase().includes('asap');
        const priority: Priority = isUrgent ? 'A' : 'B';
        get().addTask(`[AI Analyzed] ${text}`, priority, true);
      },


      uploadFile: async (filename, content) => {
        const id = Math.random().toString(36).substring(7);

        // Parse wiki-links and hashtags
        const linkRegex = /\[\[([^\]]+)\]\]/g;
        const hashtagRegex = /(?:^|\s)#([\w-]+)/g;
        const links: string[] = [];
        const hashtags: string[] = [];
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
          links.push(match[1]);
        }
        while ((match = hashtagRegex.exec(content)) !== null) {
          hashtags.push(match[1]);
        }

        const newFile: UploadedFile = {
          id,
          filename,
          content,
          links,
          hashtags,
          createdAt: Date.now(),
        };

        await VaultService.initialize();
        await VaultService.saveUpload(filename, content);

        set((state) => ({
          uploadedFiles: [newFile, ...state.uploadedFiles]
        }));
      },

      addBrainDump: async (content) => {
        const id = Math.random().toString(36).substring(7);
        const date = new Date().toISOString().split('T')[0];
        const newDump: BrainDump = {
          id,
          date,
          rawContent: content,
          createdAt: Date.now(),
        };

        // Initialize Vault and save raw dump
        await VaultService.initialize();
        await VaultService.saveDump(date, content, `${date}-${id}-Raw.md`);

        set((state) => ({
          brainDumps: [newDump, ...state.brainDumps]
        }));

        // Trigger untangling
        get().untangleBrainDump(id);
      },

      untangleBrainDump: async (id) => {
        const dump = get().brainDumps.find(d => d.id === id);
        if (!dump) return;

        console.log(`[Cortex AI] Untangling Dump: ${id}`);

        // Use InferenceService with Gemini primary + Mistral fallback
        const geminiKey = get().geminiApiKey;
        const mistralKey = get().mistralApiKey;
        const result = await InferenceService.untangle(dump.rawContent, {
          geminiApiKey: geminiKey || undefined,
          mistralApiKey: mistralKey || undefined,
        });

        if (!result.success || !result.data) {
          console.warn(`[Cortex AI] All inference providers failed for dump ${id}: ${result.error}`);
          return;
        }

        const untangledData = result.data;
        const providerLabel = result.provider === 'primary' ? 'Gemini' : result.provider === 'mistral' ? 'Mistral (fallback)' : 'Mock (fallback)';
        console.log(`[Cortex AI] Untangling complete via ${providerLabel}`);

        // Generate Markdown with YAML frontmatter and bidirectional links
        const mdContent = `---
date: ${dump.date}
mood: ${untangledData.mood.join(', ')}
distortions: ${untangledData.distortions.join(', ')}
---

# Brain Dump - ${new Date(dump.createdAt).toLocaleString()}

${dump.rawContent}

---
## AI Untangler Insights
**Themes:** ${untangledData.themes.map(t => `#${t.replace(/\s+/g, '-')}`).join(' ')}
**Entities:** ${untangledData.entities.map(e => `[[${e}]]`).join(', ')}

> **Summary:** ${untangledData.summary}

**💡 Suggested Action:** ${untangledData.actionItem}
`;

        // Save processed markdown to vault
        await VaultService.saveDump(dump.date, mdContent, `${dump.date}-${id}.md`);
        
        // Update entities in vault
        for (const entity of untangledData.entities) {
          await VaultService.saveEntity(entity, `# ${entity}\n\nLinked from [[${dump.date}-${id}]]`);
        }

        // Update state
        set((state) => ({
          brainDumps: state.brainDumps.map(d => 
            d.id === id ? { ...d, untangledData, processedContent: mdContent } : d
          )
        }));
      },

      updateTimeLeft: () => {
        const { startTime, totalTime, isActive } = get();
        if (!isActive || !startTime) return;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, totalTime - elapsed);
        set({ timeLeft: remaining });
        if (remaining === 0) {
          get().stopSession();
          set({ timerMode: 'WRAP_UP' });
        }
      },

      startSession: (durationMs) => {
        set({ 
          isActive: true, 
          startTime: Date.now(), 
          totalTime: durationMs,
          timeLeft: durationMs,
          timerMode: 'FOCUSING'
        });
        if (get().isNuclearMode) {
          console.log('[Nuclear Mode] App Shield Active: Blocking Social Media Apps');
        }
      },

      stopSession: () => {
        const { timerMode, startTime, totalTime } = get();
        if (timerMode === 'FOCUSING' && startTime) {
          const session: FocusSession = {
            date: new Date().toISOString().split('T')[0],
            durationMs: Math.min(Date.now() - startTime, totalTime),
          };
          set((state) => ({
            profile: { ...state.profile, sessionHistory: [...state.profile.sessionHistory, session] }
          }));
        }
        set({ isActive: false, startTime: null, timeLeft: 0 });
      },
      
      addCalibrationTime: (timeMs) => set((state) => {
        const newHistory = [...state.profile.calibrationHistory, timeMs].slice(-5);
        const avg = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
        return {
          profile: { ...state.profile, calibrationHistory: newHistory, baselineFocusTimeMs: avg }
        };
      }),
      
      addTask: (title, priority = 'UNASSIGNED', isLoggedDistraction = false) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: Math.random().toString(36).substring(7),
            title,
            priority,
            isCompleted: false,
            isLoggedDistraction,
            createdAt: Date.now(),
          }
        ]
      })),
      
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      
      updateTaskPriority: (id, priority) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, priority } : t)
      })),

      finishWrapUp: () => set({ timerMode: 'IDLE' }),
    }),
    {
      name: 'focusflow-v3-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        tasks: state.tasks,
        brainDumps: state.brainDumps,
        uploadedFiles: state.uploadedFiles,
        isNuclearMode: state.isNuclearMode,
        isGlancePenaltyActive: state.isGlancePenaltyActive,
        geminiApiKey: state.geminiApiKey,
        mistralApiKey: state.mistralApiKey,
      }),
    }
  )
);
