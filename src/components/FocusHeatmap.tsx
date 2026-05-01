import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { FocusSession } from '../types';

interface HeatmapProps {
  sessions: FocusSession[];
}

export const FocusHeatmap = ({ sessions }: HeatmapProps) => {
  const last7Days = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const stats = useMemo(() => {
    return last7Days.map(date => {
      const daySessions = sessions.filter(s => s.date === date);
      const totalMin = daySessions.reduce((acc, s) => acc + (s.durationMs / 60000), 0);
      return { date, totalMin };
    });
  }, [sessions, last7Days]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Focus Momentum</Text>
      <View style={styles.grid}>
        {stats.map((day, i) => {
          const intensity = Math.min(day.totalMin / 120, 1); // Goal: 2 hours/day
          const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <View key={day.date} style={styles.dayCol}>
              <View style={[
                styles.cell, 
                { backgroundColor: intensity > 0 ? COLORS.primary : 'rgba(255,255,255,0.05)' },
                { opacity: intensity > 0 ? 0.2 + (intensity * 0.8) : 1 }
              ]} />
              <Text style={styles.dayLabel}>{dayLabel}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  cell: {
    width: (Dimensions.get('window').width - 120) / 7,
    height: (Dimensions.get('window').width - 120) / 7,
    borderRadius: 8,
  },
  dayLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
});
