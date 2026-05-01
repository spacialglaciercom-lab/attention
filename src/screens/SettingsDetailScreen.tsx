import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeft,
  Bell,
  Lock,
  Accessibility,
  Globe,
  MapPinned,
  Users,
  Bot,
  Wrench,
  Heart,
  CircleHelp,
  ClipboardList,
  Mail,
  Info,
  HandCoins,
  ChevronRight,
  ExternalLink,
} from 'lucide-react-native';

interface Props {
  section: string;
  onBack: () => void;
}

const SECTION_TITLES: Record<string, string> = {
  notifications: 'Push Notifications',
  security: 'Privacy & Encryption',
  accessibility: 'Display & Interaction',
  language: 'App Language',
  checkinPrefs: 'Check-in Preferences',
  friends: 'Friends & Sharing',
  aiSettings: 'AI Settings',
  toolSettings: 'Tool Settings',
  hotlines: 'Mental Health Hotlines',
  faq: 'Frequently Asked Questions',
  feedback: 'Feedback Survey',
  contact: 'Contact the Team',
  about: 'About',
  donate: 'Donate',
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  notifications: <Bell size={22} color={COLORS.accent} />,
  security: <Lock size={22} color={COLORS.accent} />,
  accessibility: <Accessibility size={22} color={COLORS.accent} />,
  language: <Globe size={22} color={COLORS.accent} />,
  checkinPrefs: <MapPinned size={22} color={COLORS.accent} />,
  friends: <Users size={22} color={COLORS.accent} />,
  aiSettings: <Bot size={22} color={COLORS.accent} />,
  toolSettings: <Wrench size={22} color={COLORS.accent} />,
  hotlines: <Heart size={22} color={COLORS.accent} />,
  faq: <CircleHelp size={22} color={COLORS.accent} />,
  feedback: <ClipboardList size={22} color={COLORS.accent} />,
  contact: <Mail size={22} color={COLORS.accent} />,
  about: <Info size={22} color={COLORS.accent} />,
  donate: <HandCoins size={22} color={COLORS.accent} />,
};

const HOTLINES = [
  { name: 'Crisis Text Line', number: '741741', desc: 'Text HOME to connect with a crisis counselor' },
  { name: '988 Suicide & Crisis Lifeline', number: '988', desc: '24/7 free, confidential support' },
  { name: 'SAMHSA National Helpline', number: '1-800-662-4357', desc: 'Substance abuse and mental health' },
  { name: 'NAMI Helpline', number: '1-800-950-6264', desc: 'Mental health info and referrals' },
  { name: 'The Trevor Project', number: '1-866-488-7386', desc: 'Crisis support for LGBTQ youth' },
];

const FAQS = [
  { q: 'How does Focus Flow track my sessions?', a: 'Focus Flow uses timer data and optional glance detection to build your focus history. All data is stored locally on your device by default.' },
  { q: 'What is Nuclear Mode?', a: 'Nuclear Mode simulates blocking social media and distracting apps during active focus sessions, helping you stay committed.' },
  { q: 'Is my brain dump data private?', a: 'Yes — all brain dumps, task data, and session logs are stored locally. Nothing is sent to servers unless you explicitly enable cloud backup.' },
  { q: 'How does AI untangling work?', a: 'When you submit a brain dump, the AI identifies themes, entities, cognitive distortions, and generates a summary and action item.' },
  { q: 'Can I export my data?', a: 'Data export is available from the Vault tab. You can export your brain dumps as Markdown files.' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'pt', label: 'Português' },
];

export const SettingsDetailScreen: React.FC<Props> = ({ section, onBack }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [checkinReminders, setCheckinReminders] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const title = SECTION_TITLES[section] || section;
  const icon = SECTION_ICONS[section] || null;

  const renderNotifications = () => (
    <View style={styles.content}>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Push Notifications</Text>
          <Text style={styles.switchSub}>Receive alerts and updates</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
      {notificationsEnabled && (
        <>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Session Reminders</Text>
              <Text style={styles.switchSub}>Remind me to start focus sessions</Text>
            </View>
            <Switch
              value={sessionReminders}
              onValueChange={setSessionReminders}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Check-in Nudges</Text>
              <Text style={styles.switchSub}>Periodic wellness check-ins</Text>
            </View>
            <Switch
              value={checkinReminders}
              onValueChange={setCheckinReminders}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
            />
          </View>
        </>
      )}
    </View>
  );

  const renderSecurity = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Lock size={24} color={COLORS.success} />
        <Text style={styles.infoTitle}>Local-First Architecture</Text>
        <Text style={styles.infoBody}>
          All your data — brain dumps, session logs, tasks, and settings — is stored exclusively on your device using AsyncStorage and the local filesystem. Nothing leaves your phone unless you explicitly enable a sharing feature.
        </Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>What We Collect</Text>
        <Text style={styles.infoBody}>
          Focus Flow does not collect analytics, usage data, or personal information. Your AI processing happens on-device or via API keys you provide. We have no servers to store your data.
        </Text>
      </View>
      <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert('Privacy Policy', 'Full privacy policy would open here.')}>
        <Text style={styles.linkText}>View Full Privacy Policy</Text>
        <ExternalLink size={16} color={COLORS.accent} />
      </TouchableOpacity>
    </View>
  );

  const renderAccessibility = () => (
    <View style={styles.content}>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>High Contrast Mode</Text>
          <Text style={styles.switchSub}>Increase contrast for better visibility</Text>
        </View>
        <Switch
          value={highContrast}
          onValueChange={setHighContrast}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Reduce Motion</Text>
          <Text style={styles.switchSub}>Minimize animations and transitions</Text>
        </View>
        <Switch
          value={reduceMotion}
          onValueChange={setReduceMotion}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Dynamic Type</Text>
        <Text style={styles.infoBody}>
          Focus Flow respects your system font size settings. Adjust text size in your device's Display & Brightness settings.
        </Text>
      </View>
    </View>
  );

  const renderLanguage = () => (
    <View style={styles.content}>
      <Text style={styles.sectionIntro}>Select your preferred app language:</Text>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[styles.langRow, selectedLanguage === lang.code && styles.langRowSelected]}
          onPress={() => setSelectedLanguage(lang.code)}
        >
          <Text style={[styles.langLabel, selectedLanguage === lang.code && styles.langLabelSelected]}>
            {lang.label}
          </Text>
          {selectedLanguage === lang.code && (
            <View style={styles.checkDot} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCheckinPrefs = () => (
    <View style={styles.content}>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Daily Check-in</Text>
          <Text style={styles.switchSub}>Prompt for a morning brain dump</Text>
        </View>
        <Switch
          value={checkinReminders}
          onValueChange={setCheckinReminders}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Check-in Schedule</Text>
        <Text style={styles.infoBody}>
          Check-ins are lightweight prompts to capture what's on your mind. They help build self-awareness and feed the AI untangler with regular data points.
        </Text>
      </View>
    </View>
  );

  const renderFriends = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Users size={24} color={COLORS.accent} />
        <Text style={styles.infoTitle}>Accountability Partners</Text>
        <Text style={styles.infoBody}>
          Add friends as accountability partners. They'll see your focus session completions (not your brain dumps or tasks) and can send encouraging nudges.
        </Text>
      </View>
      <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Coming Soon', 'Friend invitations will be available in the next update.')}>
        <Text style={styles.actionBtnText}>Invite a Friend</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAISettings = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Bot size={24} color={COLORS.accent} />
        <Text style={styles.infoTitle}>AI Configuration</Text>
        <Text style={styles.infoBody}>
          Focus Flow uses Gemini AI (primary) with automatic fallback to Mistral if the primary provider fails. Configure your Mistral API key in the main Settings screen under Fallback AI Provider.
        </Text>
      </View>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Auto-Untangle Brain Dumps</Text>
          <Text style={styles.switchSub}>Process dumps immediately after writing</Text>
        </View>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Distraction Detection</Text>
          <Text style={styles.switchSub}>AI analyzes logged distractions for patterns</Text>
        </View>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
    </View>
  );

  const renderToolSettings = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Wrench size={24} color={COLORS.accent} />
        <Text style={styles.infoTitle}>Integrated Tools</Text>
        <Text style={styles.infoBody}>
          Focus Flow integrates several productivity tools: Pomodoro-style focus timer, task manager with AI prioritization, brain dump vault with wiki-linking, and glance penalty detection.
        </Text>
      </View>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Haptic Feedback</Text>
          <Text style={styles.switchSub}>Vibration on timer and glance alerts</Text>
        </View>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Sound Cues</Text>
          <Text style={styles.switchSub}>Audio alerts for session transitions</Text>
        </View>
        <Switch
          value={false}
          onValueChange={() => {}}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
        />
      </View>
    </View>
  );

  const renderHotlines = () => (
    <View style={styles.content}>
      <Text style={styles.sectionIntro}>If you or someone you know is in crisis, help is available:</Text>
      {HOTLINES.map((hotline, i) => (
        <TouchableOpacity
          key={i}
          style={styles.hotlineCard}
          onPress={() => Linking.openURL(`tel:${hotline.number.replace(/-/g, '')}`)}
        >
          <View style={styles.hotlineInfo}>
            <Text style={styles.hotlineName}>{hotline.name}</Text>
            <Text style={styles.hotlineDesc}>{hotline.desc}</Text>
          </View>
          <Text style={styles.hotlineNumber}>{hotline.number}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFAQ = () => (
    <View style={styles.content}>
      {FAQS.map((faq, i) => (
        <TouchableOpacity
          key={i}
          style={styles.faqCard}
          onPress={() => setFaqExpanded(faqExpanded === i ? null : i)}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{faq.q}</Text>
            <ChevronRight
              size={18}
              color={COLORS.secondaryText}
              style={{ transform: [{ rotate: faqExpanded === i ? '90deg' : '0deg' }] }}
            />
          </View>
          {faqExpanded === i && (
            <Text style={styles.faqAnswer}>{faq.a}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFeedback = () => (
    <View style={styles.content}>
      <Text style={styles.sectionIntro}>We'd love to hear from you. What's working? What could be better?</Text>
      <TextInput
        style={styles.feedbackInput}
        value={feedbackText}
        onChangeText={setFeedbackText}
        placeholder="Share your thoughts..."
        placeholderTextColor={COLORS.secondaryText}
        multiline
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={[styles.actionBtn, !feedbackText.trim() && styles.actionBtnDisabled]}
        disabled={!feedbackText.trim()}
        onPress={() => {
          Alert.alert('Thank you!', 'Your feedback has been submitted.');
          setFeedbackText('');
        }}
      >
        <Text style={styles.actionBtnText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContact = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Mail size={24} color={COLORS.accent} />
        <Text style={styles.infoTitle}>Get in Touch</Text>
        <Text style={styles.infoBody}>
          Have a question, bug report, or feature request? Reach out and we'll get back to you within 48 hours.
        </Text>
      </View>
      <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:hello@focusflow.app')}>
        <Mail size={18} color={COLORS.text} />
        <Text style={styles.contactText}>hello@focusflow.app</Text>
        <ExternalLink size={14} color={COLORS.secondaryText} />
      </TouchableOpacity>
    </View>
  );

  const renderAbout = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Focus Flow</Text>
        <Text style={styles.infoBody}>
          Version 1.0.0 (2026){'\n'}
          Built with React Native + Expo{'\n'}
          Designed for deep work and mental clarity.
        </Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Credits</Text>
        <Text style={styles.infoBody}>
          AI Untangler powered by Google Gemini and Mistral AI.{'\n'}
          Icons by Lucide.{'\n'}
          State management via Zustand.
        </Text>
      </View>
    </View>
  );

  const renderDonate = () => (
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <HandCoins size={24} color={COLORS.success} />
        <Text style={styles.infoTitle}>Support Focus Flow</Text>
        <Text style={styles.infoBody}>
          Focus Flow is an independent project. Your support helps keep it ad-free, private, and continuously improving. Every contribution makes a difference.
        </Text>
      </View>
      <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Thank You', 'Donation options would open here.')}>
        <Text style={styles.actionBtnText}>Make a Donation</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (section) {
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'accessibility': return renderAccessibility();
      case 'language': return renderLanguage();
      case 'checkinPrefs': return renderCheckinPrefs();
      case 'friends': return renderFriends();
      case 'aiSettings': return renderAISettings();
      case 'toolSettings': return renderToolSettings();
      case 'hotlines': return renderHotlines();
      case 'faq': return renderFAQ();
      case 'feedback': return renderFeedback();
      case 'contact': return renderContact();
      case 'about': return renderAbout();
      case 'donate': return renderDonate();
      default: return <Text style={styles.emptyText}>Select a section to view details.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {icon}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.backBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.specular,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  content: {
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  switchSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
    gap: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  infoBody: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(0,242,255,0.05)',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: COLORS.accent,
  },
  linkText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  langRowSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(0,242,255,0.08)',
  },
  langLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  langLabelSelected: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  actionBtn: {
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.4,
  },
  actionBtnText: {
    color: COLORS.canvas,
    fontSize: 16,
    fontWeight: '700',
  },
  hotlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  hotlineInfo: {
    flex: 1,
    marginRight: 12,
  },
  hotlineName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  hotlineDesc: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  hotlineNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
  },
  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  feedbackInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
    color: COLORS.text,
    fontSize: 15,
    minHeight: 120,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  sectionIntro: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 40,
  },
});
