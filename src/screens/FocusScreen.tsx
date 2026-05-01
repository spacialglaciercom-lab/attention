import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, AppState } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, BORDER_RADIUS, GLASS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { DistractionModal } from '../components/DistractionModal';
import { WrapUpScreen } from './WrapUpScreen';
import { Brain, Play, AlertCircle, Zap } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const FocusScreen = ({ navigation }: any) => {
  const { 
    profile, 
    timerMode, 
    timeLeft, 
    isActive,
    updateTimeLeft,
    startSession,
    stopSession,
    syncBiometrics
  } = useAppStore();

  const [isDistractionModalVisible, setIsDistractionModalVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  // Background Resync Logic
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: any) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground! Resync immediately.
        updateTimeLeft();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [updateTimeLeft]);

  // High-Precision Timer Tick
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        updateTimeLeft();
      }, 100); // 10Hz tick for UI smoothness
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, updateTimeLeft]);

  // Biometric Sync Mock (Phase 1, Step 5)
  useEffect(() => {
    const mockBiometrics = () => {
      const levels = [0.8, 1.0, 1.2]; // Tired, Normal, Peak
      const level = levels[Math.floor(Math.random() * levels.length)];
      syncBiometrics(level);
    };
    mockBiometrics();
  }, []);

  const handleStartSession = async () => {
    if (!profile.baselineFocusTimeMs) return;
    
    // Adjust duration based on energyLevel
    const adjustedDuration = profile.baselineFocusTimeMs * profile.energyLevel;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    startSession(adjustedDuration);
    await activateKeepAwakeAsync();
    
    await Notifications.scheduleNotificationAsync({
      content: { title: "FocusFlow Complete", body: "Time to review your distractions.", sound: true },
      trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, repeats: false, seconds: adjustedDuration / 1000 },
    });
  };

  const handleStopSession = async () => {
    stopSession();
    await deactivateKeepAwake();
    await Notifications.cancelAllScheduledNotificationsAsync();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (timerMode === 'WRAP_UP') return <WrapUpScreen />;

  return (
    <View style={styles.container}>
      {timerMode === 'FOCUSING' ? (
        <View style={styles.sessionContent}>
          <View style={styles.orbContainer}>
            <BlurView 
              intensity={GLASS.ultraBlur} 
              tint="dark" 
              style={styles.orb}
              // Unrasterized for smooth dynamic updates
            >
              <Brain size={48} color={COLORS.accent} />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </BlurView>
            <View style={styles.specularHighlight} />
          </View>

          <TouchableOpacity 
            style={styles.glassFab} 
            onPress={() => setIsDistractionModalVisible(true)}
          >
            <BlurView intensity={GLASS.blur} tint="light" style={styles.fabInner}>
              <AlertCircle size={28} color="#fff" />
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.stopButton} onPress={handleStopSession}>
            <Text style={styles.stopButtonText}>End Session</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.idleContent}>
          <Text style={styles.title}>FocusFlow</Text>
          
          <BlurView 
            intensity={GLASS.blur} 
            tint="dark" 
            style={styles.glassCard}
            shouldRasterizeIOS={true} // Performance Optimization
          >
            <View style={styles.energyBadge}>
              <Zap size={14} color={COLORS.accent} />
              <Text style={styles.energyText}>
                Energy: {profile.energyLevel === 1.2 ? 'Peak' : profile.energyLevel === 0.8 ? 'Low' : 'Stable'}
              </Text>
            </View>

            <Text style={styles.label}>Baseline Capacity</Text>
            <Text style={styles.value}>
              {profile.baselineFocusTimeMs 
                ? `${Math.floor(profile.baselineFocusTimeMs / 60000)}m`
                : '--'}
            </Text>

            {profile.baselineFocusTimeMs && (
              <TouchableOpacity style={styles.startBtn} onPress={handleStartSession}>
                <Play size={24} color="#fff" fill="#fff" />
                <Text style={styles.startBtnText}>Start Flow</Text>
              </TouchableOpacity>
            )}
          </BlurView>

          <TouchableOpacity onPress={() => navigation.navigate('Calibration')}>
            <Text style={styles.recalibrateText}>
              {profile.baselineFocusTimeMs ? 'Recalibrate Engine' : 'Setup Baseline'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <DistractionModal 
        isVisible={isDistractionModalVisible} 
        onClose={() => setIsDistractionModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  sessionContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  idleContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -2,
    marginBottom: SPACING.xxl,
  },
  orbContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.specular,
  },
  orb: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specularHighlight: {
    position: 'absolute',
    top: 20,
    left: 40,
    width: 60,
    height: 30,
    backgroundColor: COLORS.specular,
    borderRadius: 30,
    transform: [{ rotate: '-45deg' }],
    opacity: 0.3,
  },
  timerText: {
    fontSize: 84,
    fontWeight: '900',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  glassCard: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
    alignItems: 'center',
  },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,242,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  energyText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: COLORS.secondaryText,
    letterSpacing: 2,
    marginBottom: 8,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
  },
  startBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    alignItems: 'center',
    gap: 8,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  recalibrateText: {
    marginTop: 24,
    color: COLORS.secondaryText,
    fontSize: 16,
  },
  glassFab: {
    position: 'absolute',
    bottom: 40,
    right: 0,
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    marginTop: 48,
  },
  stopButtonText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
});
