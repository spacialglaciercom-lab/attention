import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, BORDER_RADIUS, GLASS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { Brain, Sparkles, Send, Mic, History } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export const BrainDumpScreen = () => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addBrainDump, brainDumps } = useAppStore();

  const handleSave = async () => {
    if (content.trim()) {
      setIsProcessing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      await addBrainDump(content.trim());
      
      setIsProcessing(false);
      setContent('');
    }
  };

  const latestDump = brainDumps[0];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Cortex Inbox</Text>
          <Text style={styles.subtitle}>Raw emotion. No judgment. Just flow.</Text>
        </View>

        <View style={styles.inputContainer}>
          <BlurView intensity={GLASS.blur} tint="dark" style={styles.glassInput}>
            <TextInput
              style={styles.input}
              placeholder="Dump your thoughts here..."
              placeholderTextColor={COLORS.secondaryText}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </BlurView>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconButton}>
              <Mic size={24} color={COLORS.secondaryText} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sendButton, !content.trim() && styles.disabled]} 
              onPress={handleSave}
              disabled={!content.trim() || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Send size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {latestDump && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <History size={16} color={COLORS.secondaryText} />
              <Text style={styles.sectionTitle}>Latest Untangling</Text>
            </View>
            
            <BlurView intensity={GLASS.blur} tint="dark" style={styles.recentCard}>
              <View style={styles.cardHeader}>
                <Brain size={20} color={COLORS.accent} />
                <Text style={styles.cardDate}>{new Date(latestDump.createdAt).toLocaleTimeString()}</Text>
                {latestDump.untangledData ? (
                   <View style={styles.statusBadge}>
                     <Sparkles size={12} color={COLORS.success} />
                     <Text style={styles.statusText}>Untangled</Text>
                   </View>
                ) : (
                  <ActivityIndicator size="small" color={COLORS.accent} />
                )}
              </View>
              
              <Text style={styles.previewText} numberOfLines={3}>
                {latestDump.untangledData?.summary || latestDump.rawContent}
              </Text>
              
              {latestDump.untangledData && (
                <View style={styles.tagRow}>
                  {latestDump.untangledData.mood.map(m => (
                    <View key={m} style={styles.tag}>
                      <Text style={styles.tagText}>#{m}</Text>
                    </View>
                  ))}
                </View>
              )}
            </BlurView>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 60,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: SPACING.xxl,
  },
  glassInput: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.specular,
    minHeight: 200,
  },
  input: {
    flex: 1,
    padding: SPACING.lg,
    fontSize: 18,
    color: COLORS.text,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  recentSection: {
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recentCard: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.secondaryText,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: 'bold',
  },
  previewText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
  },
});
