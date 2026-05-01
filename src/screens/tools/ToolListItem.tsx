import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { ToolItem } from '../../types/tools';
import { Play, Clock, User } from 'lucide-react-native';

interface ToolListItemProps {
  tool: ToolItem;
  onPress: () => void;
}

export const ToolListItem: React.FC<ToolListItemProps> = ({ tool, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {tool.title}
        </Text>
        <View style={styles.playButton}>
          <Play size={16} color={COLORS.primary} fill={COLORS.primary} />
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {tool.description}
      </Text>

      <View style={styles.metadata}>
        {tool.duration && (
          <View style={styles.metadataItem}>
            <Clock size={12} color={COLORS.secondaryText} />
            <Text style={styles.metadataText}>{tool.duration}</Text>
          </View>
        )}
        {tool.author && (
          <View style={styles.metadataItem}>
            <User size={12} color={COLORS.secondaryText} />
            <Text style={styles.metadataText}>{tool.author}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  metadata: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
});
