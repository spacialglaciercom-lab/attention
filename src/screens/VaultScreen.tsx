import React, { useRef, useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, BORDER_RADIUS, GLASS } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { KnowledgeGraph } from '../components/KnowledgeGraph';
import { FileText, ChevronRight, Calendar, Tag, Plus, Upload } from 'lucide-react-native';

export const VaultScreen = () => {
  const { brainDumps, uploadedFiles, uploadFile } = useAppStore();
  const graphRef = useRef<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleUpload = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'text/markdown', 'text/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const content = await FileSystem.readAsStringAsync(file.uri);
        const filename = file.name || `upload-${Date.now()}.md`;
        await uploadFile(filename, content);
      }
    } catch (err) {
      console.log('Upload cancelled or failed', err);
    }
  }, [uploadFile]);

  const handleExport = useCallback(async () => {
    if (!graphRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery access is required to save the graph image.');
        setIsExporting(false);
        return;
      }

      const uri = await captureRef(graphRef, {
        format: 'png',
        quality: 1,
        width: 1024,
        height: 680,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved', 'Knowledge graph exported to your gallery.');
    } catch (err) {
      console.log('Export failed', err);
      Alert.alert('Export failed', 'Could not save the graph image.');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const combinedItems = [
    ...brainDumps.map(d => ({ ...d, itemType: 'dump' as const })),
    ...uploadedFiles.map(f => ({ ...f, itemType: 'upload' as const, date: new Date(f.createdAt).toISOString().split('T')[0] })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Your Vault</Text>
              <Text style={styles.subtitle}>Secured, local, and interconnected.</Text>
            </View>
            <TouchableOpacity onPress={handleUpload} style={styles.uploadBtn}>
              <Plus size={22} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>

        <KnowledgeGraph
          ref={graphRef}
          dumps={brainDumps}
          uploads={uploadedFiles}
          onExport={handleExport}
        />

        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>Mental History</Text>
          
          {combinedItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No entries yet. Start by dumping your thoughts in the Inbox or uploading files.</Text>
            </View>
          ) : (
            combinedItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.dumpCard}>
                <BlurView intensity={GLASS.blur} tint="dark" style={styles.cardInner}>
                  <View style={styles.cardHeader}>
                    <View style={styles.dateRow}>
                      {item.itemType === 'upload' ? (
                        <Upload size={14} color={COLORS.accent} />
                      ) : (
                        <Calendar size={14} color={COLORS.secondaryText} />
                      )}
                      <Text style={styles.dateText}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <ChevronRight size={20} color={COLORS.secondaryText} />
                  </View>
                  
                  {item.itemType === 'dump' ? (
                    <>
                      <Text style={styles.dumpPreview} numberOfLines={2}>
                        {item.untangledData?.summary || item.rawContent}
                      </Text>
                      <View style={styles.footer}>
                        <View style={styles.tagGroup}>
                          {item.untangledData?.mood?.slice(0, 2).map(m => (
                            <View key={m} style={styles.tag}>
                              <Tag size={10} color={COLORS.accent} />
                              <Text style={styles.tagText}>{m}</Text>
                            </View>
                          ))}
                        </View>
                        <Text style={styles.fileLabel}>{item.date}-{item.id.substring(0,4)}.md</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.dumpPreview} numberOfLines={2}>
                        {item.filename}
                      </Text>
                      <View style={styles.footer}>
                        <View style={styles.tagGroup}>
                          {item.links.slice(0, 3).map(link => (
                            <View key={link} style={styles.tag}>
                              <Text style={styles.tagText}>[[{link}]]</Text>
                            </View>
                          ))}
                          {item.hashtags.slice(0, 2).map(ht => (
                            <View key={ht} style={[styles.tag, styles.hashtagTag]}>
                              <Text style={[styles.tagText, { color: COLORS.accent }]}>#{ht}</Text>
                            </View>
                          ))}
                        </View>
                        <Text style={styles.fileLabel}>{item.filename}</Text>
                      </View>
                    </>
                  )}
                </BlurView>
              </TouchableOpacity>
            ))
          )}
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
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  uploadBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 242, 255, 0.08)',
    borderWidth: 0.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  entriesSection: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  emptyCard: {
    padding: SPACING.xl,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontSize: 14,
  },
  dumpCard: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.specular,
  },
  cardInner: {
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  dumpPreview: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagGroup: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hashtagTag: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  tagText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: 'bold',
  },
  fileLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
