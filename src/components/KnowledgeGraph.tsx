import React, { useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G, Defs, Filter, FeGaussianBlur } from 'react-native-svg';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { BrainDump, UploadedFile } from '../types';
import { buildGraphData, runForceSimulation } from '../services/GraphEngine';

interface KnowledgeGraphProps {
  dumps: BrainDump[];
  uploads: UploadedFile[];
  onExport?: () => void;
}

const MOOD_COLOR_MAP: Record<string, string> = {
  anxious: '#FF9500',
  overwhelmed: '#FF2D55',
  stressed: '#FF2D55',
  angry: '#FF2D55',
  sad: '#5856D6',
  calm: '#00F2FF',
  happy: '#34C759',
  grateful: '#34C759',
  confused: '#FF9500',
  reflective: '#5856D6',
  neutral: COLORS.accent,
};

function getMoodColor(moods: string[]): string {
  if (moods.length === 0) return COLORS.accent;
  const primaryMood = moods[0];
  return MOOD_COLOR_MAP[primaryMood.toLowerCase()] || COLORS.accent;
}

export const KnowledgeGraph = forwardRef<any, KnowledgeGraphProps>(({ dumps, uploads, onExport }, ref) => {
  const { width } = Dimensions.get('window');
  const height = 340;
  const graphWidth = width * 2;
  const graphHeight = height * 2;

  const { nodes, links } = useMemo(() => {
    const entities: { name: string; moods: string[] }[] = [];
    const entityMoodMap = new Map<string, string[]>();
    const entityCountMap = new Map<string, number>();

    dumps.forEach((dump) => {
      if (dump.untangledData) {
        dump.untangledData.entities.forEach((entity) => {
          entityCountMap.set(entity, (entityCountMap.get(entity) || 0) + 1);
          if (!entityMoodMap.has(entity)) {
            entityMoodMap.set(entity, []);
          }
          entityMoodMap.get(entity)!.push(...dump.untangledData!.mood);
        });
      }
    });

    const sortedEntities = Array.from(entityCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    sortedEntities.forEach(([name]) => {
      entities.push({
        name,
        moods: entityMoodMap.get(name) || [],
      });
    });

    const uploadItems = uploads.map(u => ({
      id: u.id,
      filename: u.filename,
      links: u.links,
      hashtags: u.hashtags,
    }));

    return buildGraphData(entities, uploadItems, getMoodColor, COLORS.accent);
  }, [dumps, uploads]);

  const simulatedNodes = useMemo(() => {
    return runForceSimulation(nodes, links, graphWidth, graphHeight);
  }, [nodes, links, graphWidth, graphHeight]);

  const hasData = dumps.length > 0 || uploads.length > 0;

  return (
    <View ref={ref} style={styles.container} collapsable={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Graph</Text>
        {onExport && hasData && (
          <TouchableOpacity onPress={onExport} style={styles.exportBtn}>
            <Text style={styles.exportBtnText}>Export PNG</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasData ? (
        <View style={styles.svgContainer}>
          <Svg width={graphWidth} height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
            <Defs>
              <Filter id="glow">
                <FeGaussianBlur stdDeviation="3" result="blur" />
              </Filter>
            </Defs>
            {links.map((link, i) => {
              const srcNode = simulatedNodes.find(n => n.id === link.source);
              const tgtNode = simulatedNodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;
              return (
                <Line
                  key={`link-${i}`}
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke={srcNode.color}
                  strokeWidth={1}
                  opacity={0.15}
                />
              );
            })}
            {simulatedNodes.map((node) => (
              <G key={node.id}>
                {node.type === 'core' && (
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size + 6}
                    fill={node.color}
                    opacity={0.08}
                    filter="url(#glow)"
                  />
                )}
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={node.color}
                  opacity={node.type === 'upload' ? 0.3 : 0.2}
                />
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size / 2}
                  fill={node.color}
                  opacity={0.9}
                />
                <SvgText
                  x={node.x}
                  y={node.y + node.size + 14}
                  fill={COLORS.secondaryText}
                  fontSize={10}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {node.label.length > 14 ? node.label.substring(0, 13) + '…' : node.label}
                </SvgText>
              </G>
            ))}
          </Svg>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Start dumping thoughts or uploading files to see your knowledge graph emerge.
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.specular,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exportBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 242, 255, 0.1)',
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 0.5,
    borderColor: COLORS.accent,
  },
  exportBtnText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 340,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
