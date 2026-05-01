import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { CategoryGridItem } from './CategoryGridItem';
import { QuickAccessBox } from './QuickAccessBox';
import { CATEGORIES } from '../../constants/toolsMockData';
import { Search } from 'lucide-react-native';

interface ToolsDashboardProps {
  onSearchPress: () => void;
}

export const ToolsDashboard: React.FC<ToolsDashboardProps> = ({ onSearchPress }) => {
  const renderQuickAccessItem = ({ index }: { index: number }) => (
    <QuickAccessBox index={index} onPress={() => {}} />
  );

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <CategoryGridItem category={item} onPress={() => {}} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Tools</Text>
        <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Search size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <FlatList
            data={[0, 1, 2, 3, 4]}
            renderItem={renderQuickAccessItem}
            keyExtractor={(item) => `quick-access-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAccessList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                {renderCategoryItem({ item: category })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -1,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  quickAccessList: {
    paddingRight: SPACING.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  categoryItem: {
    width: '50%',
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
});
