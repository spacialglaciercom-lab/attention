import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { X, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface DistractionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const DistractionModal = ({ isVisible, onClose }: DistractionModalProps) => {
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { processDistractionWithGemini } = useAppStore();

  const handleSave = async () => {
    if (title.trim()) {
      setIsProcessing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Call Gemini AI Action
      await processDistractionWithGemini(title.trim());
      
      setIsProcessing(false);
      setTitle('');
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Sparkles size={20} color={COLORS.accent} />
              <Text style={styles.title}>AI Capture</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Gemini is listening. Offload your thought and I'll prioritize it for you.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="What just popped into your head?"
              placeholderTextColor={COLORS.secondaryText}
              value={title}
              onChangeText={setTitle}
              autoFocus
              onSubmitEditing={handleSave}
              editable={!isProcessing}
            />
            <TouchableOpacity 
              style={[styles.geminiButton, !title.trim() && styles.disabled]} 
              onPress={handleSave}
              disabled={!title.trim() || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Sparkles size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.canvas,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
    borderWidth: 1,
    borderColor: COLORS.specular,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: 18,
    color: COLORS.text,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  geminiButton: {
    backgroundColor: COLORS.primary,
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowRadius: 15,
    shadowOpacity: 0.4,
  },
  disabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
  },
});
