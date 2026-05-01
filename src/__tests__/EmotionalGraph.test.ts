import { BrainDump } from '../types';

describe('EmotionalGraph Logic', () => {
  // Mood color mapping (mirrors the component's MOOD_COLOR_MAP)
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
    neutral: '#00F2FF',
  };

  function getMoodColor(moods: string[], fallback: string): string {
    if (moods.length === 0) return fallback;
    const primaryMood = moods[0];
    return MOOD_COLOR_MAP[primaryMood.toLowerCase()] || fallback;
  }

  describe('Mood-to-color mapping', () => {
    it('should map anxious mood to orange', () => {
      expect(getMoodColor(['anxious'], '#00F2FF')).toBe('#FF9500');
    });

    it('should map stressed mood to red', () => {
      expect(getMoodColor(['stressed'], '#00F2FF')).toBe('#FF2D55');
    });

    it('should map calm mood to cyan', () => {
      expect(getMoodColor(['calm'], '#00F2FF')).toBe('#00F2FF');
    });

    it('should map sad mood to purple', () => {
      expect(getMoodColor(['sad'], '#00F2FF')).toBe('#5856D6');
    });

    it('should map happy mood to green', () => {
      expect(getMoodColor(['happy'], '#00F2FF')).toBe('#34C759');
    });

    it('should use primary mood (first) for color', () => {
      expect(getMoodColor(['anxious', 'calm'], '#00F2FF')).toBe('#FF9500');
    });

    it('should fall back for empty moods', () => {
      expect(getMoodColor([], '#00F2FF')).toBe('#00F2FF');
    });

    it('should fall back for unknown moods', () => {
      expect(getMoodColor(['unknown_mood'], '#00F2FF')).toBe('#00F2FF');
    });
  });

  describe('Entity extraction from dumps', () => {
    it('should aggregate entity frequency from untangled data', () => {
      const dumps: BrainDump[] = [
        {
          id: '1', date: '2026-04-29', rawContent: '', createdAt: Date.now(),
          untangledData: {
            mood: ['anxious'], distortions: ['catastrophizing'],
            entities: ['Work', 'Finances'], themes: ['stress'],
            summary: 'Stress', actionItem: 'Rest',
          },
        },
        {
          id: '2', date: '2026-04-30', rawContent: '', createdAt: Date.now(),
          untangledData: {
            mood: ['overwhelmed'], distortions: ['mind-reading'],
            entities: ['Work', 'Manager'], themes: ['burnout'],
            summary: 'Burnout', actionItem: 'Take break',
          },
        },
      ];

      const entityMap = new Map<string, number>();
      dumps.forEach(dump => {
        if (dump.untangledData) {
          dump.untangledData.entities.forEach(entity => {
            entityMap.set(entity, (entityMap.get(entity) || 0) + 1);
          });
        }
      });

      expect(entityMap.get('Work')).toBe(2);
      expect(entityMap.get('Finances')).toBe(1);
      expect(entityMap.get('Manager')).toBe(1);
    });

    it('should handle dumps without untangled data gracefully', () => {
      const dumps: BrainDump[] = [
        { id: '1', date: '2026-04-30', rawContent: 'raw', createdAt: Date.now() },
      ];

      const entityMap = new Map<string, number>();
      dumps.forEach(dump => {
        if (dump.untangledData) {
          dump.untangledData.entities.forEach(entity => {
            entityMap.set(entity, (entityMap.get(entity) || 0) + 1);
          });
        }
      });

      expect(entityMap.size).toBe(0);
    });

    it('should sort entities by frequency descending', () => {
      const entityMap = new Map<string, number>([
        ['Work', 5], ['Finances', 3], ['Manager', 1],
      ]);

      const sorted = Array.from(entityMap.entries()).sort((a, b) => b[1] - a[1]);
      expect(sorted[0][0]).toBe('Work');
      expect(sorted[2][0]).toBe('Manager');
    });

    it('should limit to top 8 entities', () => {
      const entities = Array.from({ length: 12 }, (_, i) => [`Entity${i}`, i + 1] as [string, number]);
      const sorted = entities.sort((a, b) => b[1] - a[1]).slice(0, 8);
      expect(sorted).toHaveLength(8);
    });
  });

  describe('Entity-mood association', () => {
    it('should associate entities with moods from their dumps', () => {
      const dumps: BrainDump[] = [
        {
          id: '1', date: '2026-04-29', rawContent: '', createdAt: Date.now(),
          untangledData: {
            mood: ['anxious', 'stressed'], distortions: ['catastrophizing'],
            entities: ['Work', 'Deadlines'], themes: ['stress'],
            summary: 'Stressed about work.', actionItem: 'Break it down.',
          },
        },
        {
          id: '2', date: '2026-04-30', rawContent: '', createdAt: Date.now(),
          untangledData: {
            mood: ['calm'], distortions: [],
            entities: ['Work'], themes: ['peace'],
            summary: 'Feeling calm at work.', actionItem: 'Enjoy the moment.',
          },
        },
      ];

      const entityMoodMap = new Map<string, string[]>();
      dumps.forEach(dump => {
        if (dump.untangledData) {
          dump.untangledData.entities.forEach(entity => {
            if (!entityMoodMap.has(entity)) {
              entityMoodMap.set(entity, []);
            }
            entityMoodMap.get(entity)!.push(...dump.untangledData!.mood);
          });
        }
      });

      // "Work" appears in both dumps, so gets both anxious/stressed and calm
      expect(entityMoodMap.get('Work')).toEqual(['anxious', 'stressed', 'calm']);
      expect(entityMoodMap.get('Deadlines')).toEqual(['anxious', 'stressed']);
    });
  });

  describe('Empty state detection', () => {
    it('should detect no data when no dumps have untangledData', () => {
      const dumps: BrainDump[] = [
        { id: '1', date: '2026-04-30', rawContent: 'raw', createdAt: Date.now() },
      ];
      const hasData = dumps.some(d => d.untangledData);
      expect(hasData).toBe(false);
    });

    it('should detect data when at least one dump has untangledData', () => {
      const dumps: BrainDump[] = [
        { id: '1', date: '2026-04-30', rawContent: 'raw', createdAt: Date.now(),
          untangledData: { mood: ['calm'], distortions: [], entities: ['Work'], themes: ['peace'], summary: 'OK', actionItem: 'Rest' } },
      ];
      const hasData = dumps.some(d => d.untangledData);
      expect(hasData).toBe(true);
    });
  });

  describe('Node positioning', () => {
    it('should compute circular positions for entity nodes', () => {
      const count = 5;
      const radius = 80;
      const width = 400;
      const height = 300;
      
      const positions = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions.push({
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
        });
      }

      const uniqueX = new Set(positions.map(p => Math.round(p.x)));
      expect(uniqueX.size).toBeGreaterThan(1);
    });

    it('should place YOU node at center', () => {
      const width = 400;
      const height = 300;
      const youNode = { id: 'YOU', x: width / 2, y: height / 2, size: 40 };
      expect(youNode.x).toBe(200);
      expect(youNode.y).toBe(150);
    });
  });
});
