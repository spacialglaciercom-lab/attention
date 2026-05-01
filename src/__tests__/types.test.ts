import { BrainDump, AIUntangledData, Task, Priority, TimerMode, FocusSession, UserProfile, SpatialState } from '../types';

describe('Types', () => {
  describe('BrainDump', () => {
    it('should accept a valid BrainDump object', () => {
      const dump: BrainDump = {
        id: 'abc123',
        date: '2026-04-30',
        rawContent: 'I feel anxious about deadlines',
        createdAt: 1746000000000,
      };
      expect(dump.id).toBe('abc123');
      expect(dump.processedContent).toBeUndefined();
      expect(dump.untangledData).toBeUndefined();
    });

    it('should accept a BrainDump with processed data', () => {
      const untangled: AIUntangledData = {
        mood: ['anxious', 'overwhelmed'],
        distortions: ['catastrophizing'],
        entities: ['Project Alpha'],
        themes: ['workload'],
        summary: 'Test summary',
        actionItem: 'Take a break',
      };
      const dump: BrainDump = {
        id: 'abc123',
        date: '2026-04-30',
        rawContent: 'Test content',
        processedContent: '---\n---\n# Processed',
        untangledData: untangled,
        createdAt: 1746000000000,
      };
      expect(dump.untangledData!.mood).toHaveLength(2);
      expect(dump.untangledData!.entities).toContain('Project Alpha');
    });
  });

  describe('Task', () => {
    it('should accept valid priorities', () => {
      const priorities: Priority[] = ['A', 'B', 'C', 'UNASSIGNED'];
      expect(priorities).toHaveLength(4);
    });

    it('should create a valid Task', () => {
      const task: Task = {
        id: 'task1',
        title: 'Test task',
        priority: 'A',
        isCompleted: false,
        isLoggedDistraction: false,
        createdAt: Date.now(),
      };
      expect(task.priority).toBe('A');
    });
  });

  describe('TimerMode', () => {
    it('should cover all timer modes', () => {
      const modes: TimerMode[] = ['IDLE', 'CALIBRATING', 'FOCUSING', 'ON_BREAK', 'WRAP_UP'];
      expect(modes).toHaveLength(5);
    });
  });

  describe('FocusSession', () => {
    it('should create a valid FocusSession', () => {
      const session: FocusSession = {
        date: '2026-04-30',
        durationMs: 1500000,
      };
      expect(session.durationMs).toBe(1500000);
    });
  });

  describe('UserProfile', () => {
    it('should create a valid UserProfile', () => {
      const profile: UserProfile = {
        baselineFocusTimeMs: 1500000,
        calibrationHistory: [1500000, 1800000],
        sessionHistory: [{ date: '2026-04-30', durationMs: 1500000 }],
        energyLevel: 1.2,
      };
      expect(profile.baselineFocusTimeMs).toBe(1500000);
      expect(profile.energyLevel).toBe(1.2);
    });
  });

  describe('SpatialState', () => {
    it('should create a valid SpatialState', () => {
      const state: SpatialState = {
        isSyncEnabled: true,
        currentMode: 'FOCUSING',
        timeLeft: 1000,
        totalTime: 1500000,
      };
      expect(state.currentMode).toBe('FOCUSING');
    });
  });
});
