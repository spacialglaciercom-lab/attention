import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { Play, Square, Timer } from 'lucide-react-native';

export const CalibrationScreen = ({ navigation }: any) => {
  const [ms, setMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { addCalibrationTime, setTimerMode } = useAppStore();

  const startStopwatch = () => {
    setIsRunning(true);
    setTimerMode('CALIBRATING');
    startTimeRef.current = Date.now() - ms;
    
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setMs(Date.now() - startTimeRef.current);
      }
    }, 16); // ~60fps for smooth calibration UI
  };

  const stopStopwatch = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    startTimeRef.current = null;
  };

  const handleLostFocus = () => {
    stopStopwatch();
    if (ms < 10000) {
      Alert.alert("Too short", "Focus calibration requires at least 10 seconds.");
      setMs(0);
      setTimerMode('IDLE');
      return;
    }

    addCalibrationTime(ms);
    setTimerMode('IDLE');
    Alert.alert(
      "Baseline Logged", 
      `Recorded ${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s.`,
      [
        { text: "Try Again", onPress: () => setMs(0) },
        { text: "Finish", onPress: () => navigation.goBack() }
      ]
    );
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const cs = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Timer size={64} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.instruction}>
        Focus on your task. Hit "Lost Focus" the moment your mind wanders.
      </Text>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(ms)}</Text>
      </View>

      {!isRunning ? (
        <TouchableOpacity style={styles.primaryButton} onPress={startStopwatch}>
          <Play size={24} color="#fff" fill="#fff" />
          <Text style={styles.buttonText}>Start Calibration</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: COLORS.danger }]} onPress={handleLostFocus}>
          <Square size={24} color="#fff" fill="#fff" />
          <Text style={styles.buttonText}>I Lost Focus</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginBottom: 24 },
  instruction: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  timerContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
