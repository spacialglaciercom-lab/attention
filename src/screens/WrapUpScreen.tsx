import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle, AlertCircle } from 'lucide-react-native';

export const WrapUpScreen = () => {
  const { tasks, finishWrapUp } = useAppStore();

  const sessionDistractions = useMemo(() => {
    // In a real app, we'd filter by distractions created in the LAST session.
    // For the prototype, we show all UNASSIGNED distractions.
    return tasks.filter(t => t.isLoggedDistraction && t.priority === 'UNASSIGNED');
  }, [tasks]);

  return (
    <View style={styles.container}>
      <CheckCircle size={64} color={COLORS.success} style={styles.icon} />
      <Text style={styles.title}>Session Complete</Text>
      <Text style={styles.subtitle}>
        You successfully completed your focus block. Now, review the thoughts you captured.
      </Text>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Distractions to Process:</Text>
        {sessionDistractions.length > 0 ? (
          <FlatList
            data={sessionDistractions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.distractionItem}>
                <AlertCircle size={16} color={COLORS.warning} />
                <Text style={styles.distractionText}>{item.title}</Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyDistractions}>
            <Text style={styles.emptyText}>No distractions logged! Total focus.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={finishWrapUp}>
        <Text style={styles.doneButtonText}>Finish & Start Break</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  distractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.canvas,
  },
  distractionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  emptyDistractions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.secondaryText,
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.round,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
