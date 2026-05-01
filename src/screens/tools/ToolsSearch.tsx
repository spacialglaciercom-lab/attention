import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { FilterChip } from './FilterChip';
import { ToolListItem } from './ToolListItem';
import { TOOLS } from '../../constants/toolsMockData';
import { ToolFilter } from '../../types/tools';
import { ArrowLeft } from 'lucide-react-native';

interface ToolsSearchProps {
  onBackPress: () => void;
}

const FILTERS: { id: ToolFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sound_patterns', label: 'Sound Patterns' },
  { id: 'breathing', label: 'Breathing' },
  { id: 'quotes', label: 'Quotes' },
];

export const ToolsSearch: React.FC<ToolsSearchProps> = ({ onBackPress }) => {
  const [activeFilter, setActiveFilter] = useState<ToolFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    let filtered = TOOLS;

    if (activeFilter !== 'all') {
      filtered = filtered.filter((tool) => tool.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.author?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const renderToolItem = ({ item }: { item: typeof TOOLS[0] }) => (
    <ToolListItem tool={item} onPress={() => {}} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Tools</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tools..."
          placeholderTextColor={COLORS.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTERS.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            isSelected={activeFilter === filter.id}
            onPress={() => setActiveFilter(filter.id)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filteredTools}
        renderItem={renderToolItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tools found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filter
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  filtersContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  emptyState: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
});
