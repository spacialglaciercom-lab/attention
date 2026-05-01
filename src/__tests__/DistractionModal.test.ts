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

describe('DistractionModal Logic (via store)', () => {
  beforeEach(() => {
    useAppStore.setState({
      tasks: [],
      brainDumps: [],
    });
  });

  it('should create a task from distraction text via Gemini', async () => {
    await useAppStore.getState().processDistractionWithGemini('I must finish this ASAP');
    const tasks = useAppStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toContain('[AI Analyzed]');
    expect(tasks[0].isLoggedDistraction).toBe(true);
    expect(tasks[0].priority).toBe('A'); // urgent keywords
  });

  it('should assign priority B for non-urgent text', async () => {
    await useAppStore.getState().processDistractionWithGemini('Check social media');
    const tasks = useAppStore.getState().tasks;
    expect(tasks[0].priority).toBe('B');
  });
});
