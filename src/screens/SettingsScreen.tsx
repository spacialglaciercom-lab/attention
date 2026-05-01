import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { FocusHeatmap } from '../components/FocusHeatmap';
import { SettingsDetailScreen } from './SettingsDetailScreen';
import { Shield, Smartphone, MapPin, Sparkles, KeyRound, Eye, EyeOff, Bell, Lock, Accessibility, Globe, MapPinned, Users, Bot, Wrench, ChevronRight, Heart, CircleHelp, ClipboardList, Mail, Info, HandCoins } from 'lucide-react-native';

export const SettingsScreen = () => {
  const { 
    profile, 
    isNuclearMode, 
    toggleNuclearMode, 
    isGlancePenaltyActive, 
    toggleGlancePenalty,
    currentLocation,
    geminiApiKey,
    setGeminiApiKey,
    mistralApiKey,
    setMistralApiKey,
  } = useAppStore();

  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showMistralKey, setShowMistralKey] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const totalFocusMs = profile.sessionHistory.reduce((acc, s) => acc + s.durationMs, 0);
  const totalHours = (totalFocusMs / 3600000).toFixed(1);

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 4) return '•'.repeat(key.length);
    return '•'.repeat(key.length - 4) + key.slice(-4);
  };

  if (selectedSection) {
    return (
      <SettingsDetailScreen section={selectedSection} onBack={() => setSelectedSection(null)} />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.title}>System Control</Text>
      
      <FocusHeatmap sessions={profile.sessionHistory} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hard Protection</Text>
        
        <View style={styles.controlRow}>
          <View style={styles.controlInfo}>
            <Shield size={20} color={COLORS.danger} />
            <View>
              <Text style={styles.controlLabel}>Nuclear Mode</Text>
              <Text style={styles.controlSub}>Blocks social apps during sessions</Text>
            </View>
          </View>
          <Switch 
            value={isNuclearMode} 
            onValueChange={toggleNuclearMode}
            trackColor={{ false: COLORS.border, true: COLORS.danger }}
          />
        </View>

        <View style={styles.controlRow}>
          <View style={styles.controlInfo}>
            <Smartphone size={20} color={COLORS.warning} />
            <View>
              <Text style={styles.controlLabel}>Glance Penalty</Text>
              <Text style={styles.controlSub}>Haptic warning on phone pickup</Text>
            </View>
          </View>
          <Switch 
            value={isGlancePenaltyActive} 
            onValueChange={toggleGlancePenalty}
            trackColor={{ false: COLORS.border, true: COLORS.warning }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Providers</Text>

        {/* Gemini (Primary) */}
        <View style={styles.apiKeyCard}>
          <View style={styles.apiKeyHeader}>
            <Sparkles size={20} color={COLORS.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.apiKeyLabel}>Gemini API Key (Primary)</Text>
              <Text style={styles.apiKeySub}>
                Used to untangle brain dumps and analyze content. Get a free key at aistudio.google.com. Stored locally.
              </Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.keyInput}
              value={showGeminiKey ? geminiApiKey : maskApiKey(geminiApiKey)}
              onChangeText={setGeminiApiKey}
              placeholder="Enter your Gemini API key..."
              placeholderTextColor={COLORS.secondaryText}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showGeminiKey}
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={() => setShowGeminiKey(!showGeminiKey)}
              style={styles.eyeBtn}
            >
              {showGeminiKey ? (
                <EyeOff size={18} color={COLORS.secondaryText} />
              ) : (
                <Eye size={18} color={COLORS.secondaryText} />
              )}
            </TouchableOpacity>
          </View>

          {geminiApiKey.length > 0 ? (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.statusText}>Key configured — primary ready</Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.warning }]} />
              <Text style={[styles.statusText, { color: COLORS.warning }]}>No API key — AI untangling won't work</Text>
            </View>
          )}
        </View>

        <View style={{ height: 16 }} />

        {/* Mistral (Fallback) */}
        <View style={styles.apiKeyCard}>
          <View style={styles.apiKeyHeader}>
            <KeyRound size={20} color={COLORS.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.apiKeyLabel}>Mistral API Key (Fallback)</Text>
              <Text style={styles.apiKeySub}>
                Used automatically if Gemini fails or times out. Stored locally.
              </Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.keyInput}
              value={showMistralKey ? mistralApiKey : maskApiKey(mistralApiKey)}
              onChangeText={setMistralApiKey}
              placeholder="Enter your Mistral API key..."
              placeholderTextColor={COLORS.secondaryText}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showMistralKey}
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={() => setShowMistralKey(!showMistralKey)}
              style={styles.eyeBtn}
            >
              {showMistralKey ? (
                <EyeOff size={18} color={COLORS.secondaryText} />
              ) : (
                <Eye size={18} color={COLORS.secondaryText} />
              )}
            </TouchableOpacity>
          </View>

          {mistralApiKey.length > 0 && (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.statusText}>Key configured — fallback ready</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contextual Baseline</Text>
        <View style={styles.locationCard}>
          <MapPin size={24} color={COLORS.primary} />
          <View>
            <Text style={styles.locationTitle}>Current Location: {currentLocation}</Text>
            <Text style={styles.locationSub}>Baseline adjusts automatically to environment.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("notifications")}>
          <View style={styles.controlInfo}>
            <Bell size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Push Notifications</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("security")}>
          <View style={styles.controlInfo}>
            <Lock size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Privacy & Encryption</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("accessibility")}>
          <View style={styles.controlInfo}>
            <Accessibility size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Display & Interaction</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("language")}>
          <View style={styles.controlInfo}>
            <Globe size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>App Language</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("checkinPrefs")}>
          <View style={styles.controlInfo}>
            <MapPinned size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Check-in Preferences</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social</Text>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("friends")}>
          <View style={styles.controlInfo}>
            <Users size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Friends & Sharing</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced</Text>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("aiSettings")}>
          <View style={styles.controlInfo}>
            <Bot size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>AI Settings</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("toolSettings")}>
          <View style={styles.controlInfo}>
            <Wrench size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Tool Settings</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("hotlines")}>
          <View style={styles.controlInfo}>
            <Heart size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Mental Health Hotlines</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("faq")}>
          <View style={styles.controlInfo}>
            <CircleHelp size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Frequently Asked Questions</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("feedback")}>
          <View style={styles.controlInfo}>
            <ClipboardList size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Feedback Survey</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("contact")}>
          <View style={styles.controlInfo}>
            <Mail size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Contact the Team</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("about")}>
          <View style={styles.controlInfo}>
            <Info size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>About</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => setSelectedSection("donate")}>
          <View style={styles.controlInfo}>
            <HandCoins size={20} color={COLORS.primary} />
            <Text style={styles.controlLabel}>Donate</Text>
          </View>
          <ChevronRight size={20} color={COLORS.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Focus</Text>
            <Text style={styles.statValue}>{totalHours}h</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Sessions</Text>
            <Text style={styles.statValue}>{profile.sessionHistory.length}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    padding: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 48,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  controlInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  controlSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  glassCard: {
    backgroundColor: 'rgba(0,242,255,0.05)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: COLORS.accent,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 16,
  },
  aiDesc: {
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  apiKeyCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  apiKeyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  apiKeyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  apiKeySub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    lineHeight: 18,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  keyInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  eyeBtn: {
    padding: 14,
    paddingLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  locationTitle: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
  },
  locationSub: {
    color: COLORS.secondaryText,
    fontSize: 12,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
