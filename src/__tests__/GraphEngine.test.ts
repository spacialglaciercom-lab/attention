import { runForceSimulation, buildGraphData } from '../services/GraphEngine';
import { GraphNode, GraphLink } from '../types';

const moodColorFn = (moods: string[]) => (moods[0] === 'anxious' ? '#FF9500' : '#00F2FF');

describe('GraphEngine', () => {
  describe('runForceSimulation', () => {
    it('should position all nodes within bounds', () => {
      const nodes: GraphNode[] = [
        { id: 'a', label: 'A', type: 'core', x: 0, y: 0, vx: 0, vy: 0, size: 20, color: '#4F46E5' },
        { id: 'b', label: 'B', type: 'entity', x: 0, y: 0, vx: 0, vy: 0, size: 16, color: '#FF9500' },
        { id: 'c', label: 'C', type: 'entity', x: 0, y: 0, vx: 0, vy: 0, size: 16, color: '#00F2FF' },
      ];
      const links: GraphLink[] = [
        { source: 'a', target: 'b' },
        { source: 'a', target: 'c' },
      ];

      const result = runForceSimulation(nodes, links, 400, 400);

      expect(result.length).toBe(3);
      result.forEach((node) => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.x).toBeLessThanOrEqual(400);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeLessThanOrEqual(400);
      });
    });

    it('should converge even with many nodes', () => {
      const nodes: GraphNode[] = Array.from({ length: 20 }, (_, i) => ({
        id: `n${i}`,
        label: `Node ${i}`,
        type: 'entity' as const,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 16,
        color: '#00F2FF',
      }));
      const links: GraphLink[] = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        links.push({ source: `n${i}`, target: `n${i + 1}` });
      }

      const result = runForceSimulation(nodes, links, 800, 800);
      expect(result.length).toBe(20);
    });

    it('should handle empty input gracefully', () => {
      const result = runForceSimulation([], [], 400, 400);
      expect(result).toEqual([]);
    });
  });

  describe('buildGraphData', () => {
    it('should include core node', () => {
      const entities = [{ name: 'Work', moods: ['anxious'] }];
      const uploads = [{ id: 'f1', filename: 'notes.md', links: [], hashtags: [] }];

      const { nodes, links } = buildGraphData(entities, uploads, moodColorFn, '#00F2FF');

      const coreNode = nodes.find(n => n.type === 'core');
      expect(coreNode).toBeDefined();
      expect(coreNode!.label).toBe('You');
    });

    it('should link core to all entities', () => {
      const entities = [
        { name: 'Work', moods: ['anxious'] },
        { name: 'Health', moods: ['calm'] },
      ];
      const uploads: any[] = [];

      const { links } = buildGraphData(entities, uploads, moodColorFn, '#00F2FF');

      const coreLinks = links.filter(l => l.source === 'core-you');
      expect(coreLinks.length).toBe(2);
      expect(coreLinks.every(l => l.target.startsWith('entity-'))).toBe(true);
    });

    it('should link uploads to referenced entities', () => {
      const entities = [{ name: 'Work', moods: ['anxious'] }];
      const uploads = [{ id: 'f1', filename: 'notes.md', links: ['Work'], hashtags: [] }];

      const { links } = buildGraphData(entities, uploads, moodColorFn, '#00F2FF');

      const uploadLink = links.find(l => l.source === 'upload-f1' && l.target === 'entity-Work');
      expect(uploadLink).toBeDefined();
    });

    it('should link uploads that share hashtags', () => {
      const entities: { name: string; moods: string[] }[] = [];
      const uploads = [
        { id: 'f1', filename: 'a.md', links: [], hashtags: ['productivity'] },
        { id: 'f2', filename: 'b.md', links: [], hashtags: ['productivity'] },
      ];

      const { links } = buildGraphData(entities, uploads, moodColorFn, '#00F2FF');

      const sharedLink = links.find(
        l => (l.source === 'upload-f1' && l.target === 'upload-f2') ||
             (l.source === 'upload-f2' && l.target === 'upload-f1')
      );
      expect(sharedLink).toBeDefined();
    });


    it('should create entity nodes from upload [[links]]', () => {
      const entities: { name: string; moods: string[] }[] = [];
      const uploads = [
        { id: 'f1', filename: 'notes.md', links: ['Work', 'Health'], hashtags: [] },
      ];

      const { nodes } = buildGraphData(entities, uploads, moodColorFn, '#00F2FF');

      const workNode = nodes.find(n => n.id === 'entity-Work');
      const healthNode = nodes.find(n => n.id === 'entity-Health');
      expect(workNode).toBeDefined();
      expect(healthNode).toBeDefined();
      expect(workNode!.type).toBe('entity');
      expect(healthNode!.type).toBe('entity');
    });

    it('should link upload nodes to entities from their [[links]]', () => {
      const entities: { name: string; moods: string[] }[] = [];
      const uploads = [
        { id: 'f1', filename: 'notes.md', links: ['Work'], hashtags: [] },
      ];

      const { links } = buildGraphData(entities, uploads, moodColorFn, '#00F2FF');

      const uploadLink = links.find(l => l.source === 'upload-f1' && l.target === 'entity-Work');
      expect(uploadLink).toBeDefined();
    });

    it('should not duplicate links', () => {
      const entities: { name: string; moods: string[] }[] = [];
      const uploads = [
        { id: 'f1', filename: 'a.md', links: [], hashtags: ['dev', 'js'] },
        { id: 'f2', filename: 'b.md', links: [], hashtags: ['dev', 'js'] },
      ];

      const { links } = buildGraphData(entities, uploads, moodColorFn, '#00F2FF');

      const sharedLinks = links.filter(
        l => (l.source === 'upload-f1' && l.target === 'upload-f2') ||
             (l.source === 'upload-f2' && l.target === 'upload-f1')
      );
      expect(sharedLinks.length).toBe(1);
    });
  });
});
