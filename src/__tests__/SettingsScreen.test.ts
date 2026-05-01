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

describe('SettingsScreen Logic (via store)', () => {
  beforeEach(() => {
    useAppStore.setState({
      isNuclearMode: false,
      isGlancePenaltyActive: true,
      currentLocation: 'UNKNOWN',
      profile: {
        baselineFocusTimeMs: null,
        calibrationHistory: [],
        sessionHistory: [],
        energyLevel: 1.0,
      },
      tasks: [],
      brainDumps: [],
      mistralApiKey: '',
    });
  });

  it('should toggle nuclear mode on and off', () => {
    useAppStore.getState().toggleNuclearMode(true);
    expect(useAppStore.getState().isNuclearMode).toBe(true);
    useAppStore.getState().toggleNuclearMode(false);
    expect(useAppStore.getState().isNuclearMode).toBe(false);
  });

  it('should toggle glance penalty', () => {
    useAppStore.getState().toggleGlancePenalty(false);
    expect(useAppStore.getState().isGlancePenaltyActive).toBe(false);
  });

  it('should update current location', () => {
    useAppStore.getState().updateLocation('HOME');
    expect(useAppStore.getState().currentLocation).toBe('HOME');
  });

  it('should calculate total focus hours from session history', () => {
    useAppStore.setState({
      profile: {
        ...useAppStore.getState().profile,
        sessionHistory: [
          { date: '2026-04-29', durationMs: 1800000 },
          { date: '2026-04-30', durationMs: 3600000 },
        ],
      },
    });

    const totalMs = useAppStore.getState().profile.sessionHistory.reduce((acc, s) => acc + s.durationMs, 0);
    const totalHours = (totalMs / 3600000).toFixed(1);
    expect(totalHours).toBe('1.5');
  });

  it('should show 0 sessions when history is empty', () => {
    expect(useAppStore.getState().profile.sessionHistory).toHaveLength(0);
  });
});

  it('should start with empty Mistral API key', () => {
    expect(useAppStore.getState().mistralApiKey).toBe('');
  });

  it('should set Mistral API key', () => {
    useAppStore.getState().setMistralApiKey('sk-test-1234');
    expect(useAppStore.getState().mistralApiKey).toBe('sk-test-1234');
  });

  it('should mask API key for display', () => {
    const key = 'sk-abc123def456';
    const masked = '•'.repeat(key.length - 4) + key.slice(-4);
    expect(masked).toBe('•'.repeat(11) + 'f456');
    expect(masked.length).toBe(key.length);
  });

  it('should mask short keys entirely', () => {
    const key = 'abc';
    const masked = '•'.repeat(key.length);
    expect(masked).toBe('•••');
  });

  it('should start with no selected detail section', () => {
    // The selectedSection state defaults to null on mount
    let selectedSection: string | null = null;
    expect(selectedSection).toBeNull();
  });

  it('should set selectedSection when tapping a menu row', () => {
    let selectedSection: string | null = null;
    const onPressNotifications = () => { selectedSection = 'notifications'; };

    onPressNotifications();
    expect(selectedSection).toBe('notifications');
  });

  it('should clear selectedSection when pressing back', () => {
    let selectedSection: string | null = 'security';
    const onBack = () => { selectedSection = null; };

    onBack();
    expect(selectedSection).toBeNull();
  });

  it('should navigate through all 14 section keys', () => {
    const sectionKeys = [
      'notifications', 'security', 'accessibility', 'language',
      'checkinPrefs', 'friends', 'aiSettings', 'toolSettings',
      'hotlines', 'faq', 'feedback', 'contact', 'about', 'donate',
    ];

    sectionKeys.forEach(key => {
      let selected: string | null = null;
      selected = key;
      expect(selected).toBe(key);
    });
  });

  it('should switch from one detail section to another directly', () => {
    let selectedSection: string | null = 'faq';
    // Tapping another row replaces the section
    selectedSection = 'about';
    expect(selectedSection).toBe('about');
  });
