import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { Plus } from 'lucide-react-native';

interface QuickAccessBoxProps {
  index: number;
  onPress: () => void;
}

export const QuickAccessBox: React.FC<QuickAccessBoxProps> = ({ index, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Add favorite ${index + 1}`}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <Plus size={20} color={COLORS.secondaryText} strokeWidth={2} />
      </View>
      <Text style={styles.label}>Favorite</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    minHeight: 90,
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginRight: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
});
