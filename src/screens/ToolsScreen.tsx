import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { ToolsDashboard } from './tools/ToolsDashboard';
import { ToolsSearch } from './tools/ToolsSearch';
import { Search } from 'lucide-react-native';

type ViewMode = 'dashboard' | 'search';

export const ToolsScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {viewMode === 'dashboard' ? (
          <ToolsDashboard onSearchPress={() => setViewMode('search')} />
        ) : (
          <ToolsSearch onBackPress={() => setViewMode('dashboard')} />
        )}
      </ScrollView>

      <View style={styles.bottomNavSpacer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomNavSpacer: {
    height: 90,
  },
});
