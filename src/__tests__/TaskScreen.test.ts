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

describe('TaskScreen Logic (via store)', () => {
  beforeEach(() => {
    useAppStore.setState({ tasks: [] });
  });

  it('should group tasks by priority', () => {
    useAppStore.getState().addTask('Urgent task', 'A');
    useAppStore.getState().addTask('Medium task', 'B');
    useAppStore.getState().addTask('Low task', 'C');
    useAppStore.getState().addTask('Unassigned task', 'UNASSIGNED');

    const tasks = useAppStore.getState().tasks;
    const priorityA = tasks.filter(t => t.priority === 'A');
    const priorityB = tasks.filter(t => t.priority === 'B');
    const priorityC = tasks.filter(t => t.priority === 'C');
    const unassigned = tasks.filter(t => t.priority === 'UNASSIGNED');

    expect(priorityA).toHaveLength(1);
    expect(priorityB).toHaveLength(1);
    expect(priorityC).toHaveLength(1);
    expect(unassigned).toHaveLength(1);
  });

  it('should mark a task as completed and uncompleted', () => {
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
    useAppStore.getState().addTask('Task', 'C');
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().updateTaskPriority(id, 'A');
    expect(useAppStore.getState().tasks[0].priority).toBe('A');
  });

  it('should track logged distractions', () => {
    useAppStore.getState().addTask('Distraction', 'UNASSIGNED', true);
    const task = useAppStore.getState().tasks[0];
    expect(task.isLoggedDistraction).toBe(true);
  });

  it('should determine empty state when no tasks', () => {
    expect(useAppStore.getState().tasks).toHaveLength(0);
  });
});
