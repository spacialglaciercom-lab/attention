import { useAppStore } from '../store/useAppStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));


// Mock InferenceService
jest.mock('../services/InferenceService', () => ({
  InferenceService: {
    untangle: jest.fn(() => Promise.resolve({
      success: true,
      data: {
        mood: ['anxious', 'overwhelmed'],
        distortions: ['catastrophizing'],
        entities: ['Project Alpha', 'Manager Bob'],
        themes: ['workload', 'deadlines'],
        summary: 'Test summary.',
        actionItem: 'Do the thing.',
      },
      provider: 'mock',
    })),
  },
}));

// Mock VaultService
jest.mock('../services/VaultService', () => ({
  VaultService: {
    initialize: jest.fn(() => Promise.resolve()),
    saveDump: jest.fn(() => Promise.resolve('/mock/path')),
    saveEntity: jest.fn(() => Promise.resolve()),
  },
}));

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { getState } = useAppStore;
    getState().tasks = [];
    getState().brainDumps = [];
    getState().timerMode = 'IDLE';
    getState().isActive = false;
    getState().timeLeft = 0;
    getState().totalTime = 0;
    getState().isNuclearMode = false;
    getState().isGlancePenaltyActive = true;
    getState().currentLocation = 'UNKNOWN';
    getState().mistralApiKey = '';
    getState().profile = {
      baselineFocusTimeMs: null,
      calibrationHistory: [],
      sessionHistory: [],
      energyLevel: 1.0,
    };
  });

  describe('Timer State', () => {
    it('should start with IDLE timer mode', () => {
      expect(useAppStore.getState().timerMode).toBe('IDLE');
    });

    it('should set timer mode', () => {
      useAppStore.getState().setTimerMode('FOCUSING');
      expect(useAppStore.getState().timerMode).toBe('FOCUSING');
    });

    it('should start a session', () => {
      useAppStore.getState().startSession(25000);
      const state = useAppStore.getState();
      expect(state.isActive).toBe(true);
      expect(state.timerMode).toBe('FOCUSING');
      expect(state.totalTime).toBe(25000);
    });

    it('should stop a session and record history', () => {
      useAppStore.getState().startSession(25000);
      useAppStore.getState().stopSession();
      const state = useAppStore.getState();
      expect(state.isActive).toBe(false);
    });

    it('should finish wrap-up and return to IDLE', () => {
      useAppStore.getState().setTimerMode('WRAP_UP');
      useAppStore.getState().finishWrapUp();
      expect(useAppStore.getState().timerMode).toBe('IDLE');
    });
  });

  describe('Task Management', () => {
    it('should add a task', () => {
      useAppStore.getState().addTask('Test task');
      expect(useAppStore.getState().tasks).toHaveLength(1);
      expect(useAppStore.getState().tasks[0].title).toBe('Test task');
    });

    it('should add a task with priority', () => {
      useAppStore.getState().addTask('Urgent task', 'A');
      expect(useAppStore.getState().tasks[0].priority).toBe('A');
    });

    it('should toggle task completion', () => {
      useAppStore.getState().addTask('Toggle me');
      const id = useAppStore.getState().tasks[0].id;
      useAppStore.getState().toggleTask(id);
      expect(useAppStore.getState().tasks[0].isCompleted).toBe(true);
      useAppStore.getState().toggleTask(id);
      expect(useAppStore.getState().tasks[0].isCompleted).toBe(false);
    });

    it('should delete a task', () => {
      useAppStore.getState().addTask('Delete me');
      const id = useAppStore.getState().tasks[0].id;
      useAppStore.getState().deleteTask(id);
      expect(useAppStore.getState().tasks).toHaveLength(0);
    });

    it('should update task priority', () => {
      useAppStore.getState().addTask('Priority task', 'A');
      const id = useAppStore.getState().tasks[0].id;
      useAppStore.getState().updateTaskPriority(id, 'C');
      expect(useAppStore.getState().tasks[0].priority).toBe('C');
    });
  });

  describe('Feature Toggles', () => {
    it('should toggle nuclear mode', () => {
      useAppStore.getState().toggleNuclearMode(true);
      expect(useAppStore.getState().isNuclearMode).toBe(true);
      useAppStore.getState().toggleNuclearMode(false);
      expect(useAppStore.getState().isNuclearMode).toBe(false);
    });

    it('should toggle glance penalty', () => {
      useAppStore.getState().toggleGlancePenalty(false);
      expect(useAppStore.getState().isGlancePenaltyActive).toBe(false);
    });

    it('should update location', () => {
      useAppStore.getState().updateLocation('HOME');
      expect(useAppStore.getState().currentLocation).toBe('HOME');
    });
  });

  describe('Profile & Biometrics', () => {
    it('should sync biometrics and update energy level', () => {
      useAppStore.getState().syncBiometrics(1.2);
      expect(useAppStore.getState().profile.energyLevel).toBe(1.2);
    });

    it('should add calibration time and compute baseline', () => {
      useAppStore.getState().addCalibrationTime(30000);
      expect(useAppStore.getState().profile.calibrationHistory).toHaveLength(1);
      expect(useAppStore.getState().profile.baselineFocusTimeMs).toBe(30000);
    });

    it('should keep only last 5 calibration entries', () => {
      for (let i = 1; i <= 7; i++) {
        useAppStore.getState().addCalibrationTime(i * 10000);
      }
      expect(useAppStore.getState().profile.calibrationHistory).toHaveLength(5);
    });
  });

  describe('Distraction Processing', () => {
    it('should process distraction with Gemini (mock)', async () => {
      await useAppStore.getState().processDistractionWithGemini('I must finish this ASAP');
      const tasks = useAppStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toContain('[AI Analyzed]');
      expect(tasks[0].priority).toBe('A'); // "must" and "asap" trigger urgent
    });

    it('should assign priority B for non-urgent distractions', async () => {
      await useAppStore.getState().processDistractionWithGemini('Check social media');
      const tasks = useAppStore.getState().tasks;
      expect(tasks[0].priority).toBe('B');
    });
  });


  describe('Mistral API Key & Fallback', () => {
    it('should start with empty Mistral API key', () => {
      expect(useAppStore.getState().mistralApiKey).toBe('');
    });

    it('should set and persist Mistral API key', () => {
      useAppStore.getState().setMistralApiKey('test-key-12345');
      expect(useAppStore.getState().mistralApiKey).toBe('test-key-12345');
    });


    it('should not treat markdown ## headings as hashtags', () => {
      // The regex /(?:^|\s)#([\w-]+)/g should not match ## Heading
      const hashtagRegex = /(?:^|\s)#([\w-]+)/g;
      const content = '## Introduction\n\nThis is a #realTag in text.';
      const hashtags: string[] = [];
      let match;
      while ((match = hashtagRegex.exec(content)) !== null) {
        hashtags.push(match[1]);
      }
      expect(hashtags).toEqual(['realTag']);
      expect(hashtags).not.toContain('#');
      expect(hashtags).not.toContain('Introduction');
    });

    it('should clear Mistral API key', () => {
      useAppStore.getState().setMistralApiKey('test-key');
      useAppStore.getState().setMistralApiKey('');
      expect(useAppStore.getState().mistralApiKey).toBe('');
    });
  });

  describe('Brain Dump & CortexFlow', () => {
    it('should add a brain dump', async () => {
      await useAppStore.getState().addBrainDump('I feel overwhelmed by work');
      const dumps = useAppStore.getState().brainDumps;
      expect(dumps).toHaveLength(1);
      expect(dumps[0].rawContent).toBe('I feel overwhelmed by work');
      expect(dumps[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should untangle a brain dump via InferenceService', async () => {
      await useAppStore.getState().addBrainDump('Worried about project');

      // InferenceService.untangle is mocked, so the untangling completes synchronously
      await new Promise(r => setTimeout(r, 500));

      const dump = useAppStore.getState().brainDumps[0];
      expect(dump.untangledData).toBeDefined();
      expect(dump.untangledData!.mood).toContain('anxious');
      expect(dump.untangledData!.distortions).toContain('catastrophizing');
      expect(dump.untangledData!.entities).toEqual(['Project Alpha', 'Manager Bob']);
      expect(dump.untangledData!.summary).toBeTruthy();
      expect(dump.untangledData!.actionItem).toBeTruthy();
    });

    it('should generate processed markdown content', async () => {
      await useAppStore.getState().addBrainDump('Test dump content');
      await new Promise(r => setTimeout(r, 500));

      const dump = useAppStore.getState().brainDumps[0];
      expect(dump.processedContent).toBeDefined();
      expect(dump.processedContent).toContain('---'); // YAML frontmatter
      expect(dump.processedContent).toContain('mood:');
      expect(dump.processedContent).toContain('# Brain Dump');
      expect(dump.processedContent).toContain('[[Project Alpha]]');
    });
  });
});
