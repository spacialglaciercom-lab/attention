import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { ToolCategory } from '../../types/tools';

interface CategoryGridItemProps {
  category: ToolCategory;
  onPress: () => void;
}

export const CategoryGridItem: React.FC<CategoryGridItemProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.title} numberOfLines={1}>
        {category.title}
      </Text>
      <Text style={styles.subtitle}>{category.subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
});
