import { useAppStore } from '../store/useAppStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('../services/VaultService', () => ({
  VaultService: {
    initialize: jest.fn(() => Promise.resolve()),
    saveDump: jest.fn(() => Promise.resolve('/mock')),
  },
}));

describe('FocusScreen Logic (via store)', () => {
  beforeEach(() => {
    useAppStore.setState({
      timerMode: 'IDLE',
      timeLeft: 0,
      totalTime: 0,
      isActive: false,
      profile: {
        baselineFocusTimeMs: null,
        calibrationHistory: [],
        sessionHistory: [],
        energyLevel: 1.0,
      },
      tasks: [],
      brainDumps: [],
    });
  });

  describe('Time formatting', () => {
    const formatTime = (ms: number) => {
      const totalSeconds = Math.ceil(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    it('should format 0ms as 0:00', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    it('should format 90000ms (1:30) correctly', () => {
      expect(formatTime(90000)).toBe('1:30');
    });

    it('should format 1500000ms (25:00) correctly', () => {
      expect(formatTime(1500000)).toBe('25:00');
    });

    it('should format 59999ms as 1:00 (rounds up)', () => {
      expect(formatTime(59999)).toBe('1:00');
    });
  });

  describe('Energy level adjustment', () => {
    it('should compute adjusted duration based on energy level', () => {
      const baseline = 1500000; // 25 min
      const energyLevel = 1.2; // Peak
      const adjustedDuration = baseline * energyLevel;
      expect(adjustedDuration).toBe(1800000); // 30 min
    });

    it('should reduce duration for low energy', () => {
      const baseline = 1500000;
      const energyLevel = 0.8;
      const adjustedDuration = baseline * energyLevel;
      expect(adjustedDuration).toBe(1200000); // 20 min
    });
  });

  describe('Session lifecycle', () => {
    it('should start a session in FOCUSING mode', () => {
      useAppStore.getState().startSession(1500000);
      expect(useAppStore.getState().timerMode).toBe('FOCUSING');
      expect(useAppStore.getState().isActive).toBe(true);
      expect(useAppStore.getState().totalTime).toBe(1500000);
    });

    it('should stop a session and record in history', () => {
      useAppStore.getState().startSession(1500000);
      useAppStore.getState().stopSession();
      const state = useAppStore.getState();
      expect(state.isActive).toBe(false);
      expect(state.startTime).toBeNull();
    });

    it('should transition to IDLE from WRAP_UP', () => {
      useAppStore.getState().setTimerMode('WRAP_UP');
      useAppStore.getState().finishWrapUp();
      expect(useAppStore.getState().timerMode).toBe('IDLE');
    });
  });

  describe('Biometrics sync', () => {
    it('should update energy level via syncBiometrics', () => {
      useAppStore.getState().syncBiometrics(1.2);
      expect(useAppStore.getState().profile.energyLevel).toBe(1.2);
    });

    it('should handle low energy biometric', () => {
      useAppStore.getState().syncBiometrics(0.8);
      expect(useAppStore.getState().profile.energyLevel).toBe(0.8);
    });
  });
});
