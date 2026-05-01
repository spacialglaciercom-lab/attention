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

describe('WrapUpScreen Logic (via store)', () => {
  beforeEach(() => {
    useAppStore.setState({
      tasks: [],
      timerMode: 'WRAP_UP',
    });
  });

  it('should filter unassigned logged distractions', () => {
    useAppStore.getState().addTask('Check phone', 'UNASSIGNED', true);
    useAppStore.getState().addTask('Important task', 'A', false);

    const distractions = useAppStore.getState().tasks.filter(
      t => t.isLoggedDistraction && t.priority === 'UNASSIGNED'
    );
    expect(distractions).toHaveLength(1);
    expect(distractions[0].title).toBe('Check phone');
  });

  it('should not include non-distraction tasks in distractions list', () => {
    useAppStore.getState().addTask('Regular task', 'B', false);
    useAppStore.getState().addTask('Urgent distraction', 'A', true);

    const distractions = useAppStore.getState().tasks.filter(
      t => t.isLoggedDistraction && t.priority === 'UNASSIGNED'
    );
    expect(distractions).toHaveLength(0); // 'Urgent distraction' is priority A, not UNASSIGNED
  });

  it('should return to IDLE mode after finishing wrap-up', () => {
    useAppStore.getState().finishWrapUp();
    expect(useAppStore.getState().timerMode).toBe('IDLE');
  });
});
