import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SectionList 
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react-native';
import { Priority, Task } from '../types';

export const TaskScreen = () => {
  const { tasks, toggleTask, deleteTask, updateTaskPriority } = useAppStore();

  const sections = useMemo(() => {
    const grouped = [
      { title: 'A - High Priority', data: tasks.filter(t => t.priority === 'A'), priority: 'A' as Priority },
      { title: 'B - Medium Priority', data: tasks.filter(t => t.priority === 'B'), priority: 'B' as Priority },
      { title: 'C - Low Priority', data: tasks.filter(t => t.priority === 'C'), priority: 'C' as Priority },
      { title: 'Unassigned / Distractions', data: tasks.filter(t => t.priority === 'UNASSIGNED'), priority: 'UNASSIGNED' as Priority },
    ];
    return grouped.filter(section => section.data.length > 0);
  }, [tasks]);

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity 
        style={styles.taskMain} 
        onPress={() => toggleTask(item.id)}
      >
        {item.isCompleted ? (
          <CheckCircle2 size={24} color={COLORS.success} />
        ) : (
          <Circle size={24} color={COLORS.border} />
        )}
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskTitle, item.isCompleted && styles.taskCompleted]}>
            {item.title}
          </Text>
          {item.isLoggedDistraction && (
            <View style={styles.distractionBadge}>
              <AlertCircle size={12} color={COLORS.warning} />
              <Text style={styles.distractionText}>Logged Distraction</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.prioritySelector}>
          {(['A', 'B', 'C'] as Priority[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton,
                item.priority === p && styles.priorityButtonActive,
                item.priority === p && p === 'A' && { backgroundColor: COLORS.danger },
                item.priority === p && p === 'B' && { backgroundColor: COLORS.warning },
                item.priority === p && p === 'C' && { backgroundColor: COLORS.primary },
              ]}
              onPress={() => updateTaskPriority(item.id, p)}
            >
              <Text style={[styles.priorityText, item.priority === p && styles.priorityTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
          <Trash2 size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ABC Backlog</Text>
      
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <AlertCircle size={48} color={COLORS.secondaryText} style={{ marginBottom: SPACING.md }} />
          <Text style={styles.emptyTitle}>Clear Mind, Clear List</Text>
          <Text style={styles.emptySub}>Distractions logged during work sessions will appear here for prioritization.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingBottom: SPACING.xl }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xl * 2,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.secondaryText,
  },
  distractionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  distractionText: {
    fontSize: 11,
    color: COLORS.warning,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.canvas,
    paddingTop: SPACING.sm,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  priorityButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.canvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityButtonActive: {
    // Dynamic background based on priority in the inline style
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
  },
  priorityTextActive: {
    color: '#fff',
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySub: {
    textAlign: 'center',
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
});
