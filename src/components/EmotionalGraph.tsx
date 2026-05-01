import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { BrainDump } from '../types';

interface EmotionalGraphProps {
  dumps: BrainDump[];
}

// Map moods to sentiment colors (spec: red=stress, blue=calm, purple=reflection, orange=anxiety)
const MOOD_COLOR_MAP: Record<string, string> = {
  anxious: '#FF9500',    // orange - anxiety
  overwhelmed: '#FF2D55', // red - stress/overwhelm
  stressed: '#FF2D55',    // red - stress
  angry: '#FF2D55',       // red - anger
  sad: '#5856D6',         // purple - deep reflection
  calm: '#00F2FF',        // cyan/blue - calm
  happy: '#34C759',       // green - positive
  grateful: '#34C759',   // green - positive
  confused: '#FF9500',    // orange - uncertainty
  reflective: '#5856D6',  // purple - reflection
  neutral: COLORS.accent,  // cyan - neutral
};

function getMoodColor(moods: string[]): string {
  if (moods.length === 0) return COLORS.accent;
  const primaryMood = moods[0];
  return MOOD_COLOR_MAP[primaryMood.toLowerCase()] || COLORS.accent;
}

export const EmotionalGraph = ({ dumps }: EmotionalGraphProps) => {
  const { width } = Dimensions.get('window');
  const height = 300;

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Map each entity to its dominant mood color
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
      .slice(0, 8);

    sortedEntities.forEach(([name, count], i) => {
      const angle = (i / sortedEntities.length) * Math.PI * 2;
      const radius = 80;
      const moods = entityMoodMap.get(name) || [];
      nodes.push({
        id: name,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        size: 20 + count * 5,
        color: getMoodColor(moods),
      });
    });

    // Central node representing the User
    nodes.push({
      id: 'YOU',
      x: width / 2,
      y: height / 2,
      size: 40,
      color: COLORS.primary,
    });

    // Links from YOU to Entities
    nodes.forEach(node => {
      if (node.id !== 'YOU') {
        links.push({
          x1: width / 2,
          y1: height / 2,
          x2: node.x,
          y2: node.y,
          color: node.color,
        });
      }
    });

    return { nodes, links };
  }, [dumps, width]);

  const hasData = dumps.some(d => d.untangledData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emotional Knowledge Graph</Text>
      {hasData ? (
        <View style={styles.svgContainer}>
          <Svg width={width} height={height}>
            {graphData.links.map((link, i) => (
              <Line
                key={`link-${i}`}
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                stroke={link.color}
                strokeWidth="1.5"
                opacity="0.25"
              />
            ))}
            {graphData.nodes.map((node) => (
              <G key={node.id}>
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={node.color}
                  opacity="0.15"
                />
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size / 2}
                  fill={node.color}
                />
                <SvgText
                  x={node.x}
                  y={node.y + node.size + 15}
                  fill={COLORS.text}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.id}
                </SvgText>
              </G>
            ))}
          </Svg>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Start dumping thoughts to see your emotional graph emerge.</Text>
        </View>
      )}
    </View>
  );
};

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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
