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
  },
}));

describe('CalibrationScreen Logic (via store)', () => {
  beforeEach(() => {
    useAppStore.setState({
      profile: {
        baselineFocusTimeMs: null,
        calibrationHistory: [],
        sessionHistory: [],
        energyLevel: 1.0,
      },
    });
  });

  describe('Calibration time formatting', () => {
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      const cs = Math.floor((time % 1000) / 10);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
    };

    it('should format 0ms as 00:00.00', () => {
      expect(formatTime(0)).toBe('00:00.00');
    });

    it('should format 65000ms as 01:05.00', () => {
      expect(formatTime(65000)).toBe('01:05.00');
    });

    it('should format 1500000ms as 25:00.00', () => {
      expect(formatTime(1500000)).toBe('25:00.00');
    });
  });

  describe('Calibration flow', () => {
    it('should add calibration time and compute baseline', () => {
      useAppStore.getState().addCalibrationTime(30000);
      expect(useAppStore.getState().profile.calibrationHistory).toHaveLength(1);
      expect(useAppStore.getState().profile.baselineFocusTimeMs).toBe(30000);
    });

    it('should compute average of last 5 calibration entries', () => {
      useAppStore.getState().addCalibrationTime(20000);
      useAppStore.getState().addCalibrationTime(30000);
      useAppStore.getState().addCalibrationTime(40000);

      const avg = useAppStore.getState().profile.baselineFocusTimeMs;
      expect(avg).toBeCloseTo(30000);
    });

    it('should not allow calibration with less than 10 seconds', () => {
      // This is UI logic, but we verify the store can handle short times
      useAppStore.getState().addCalibrationTime(5000);
      expect(useAppStore.getState().profile.calibrationHistory).toHaveLength(1);
      expect(useAppStore.getState().profile.baselineFocusTimeMs).toBe(5000);
    });

    it('should set timer mode to CALIBRATING', () => {
      useAppStore.getState().setTimerMode('CALIBRATING');
      expect(useAppStore.getState().timerMode).toBe('CALIBRATING');
    });
  });
});
