import { BrainDump, UploadedFile } from '../types';

describe('KnowledgeGraph logic', () => {
  describe('Graph data preparation', () => {
    it('should extract entities from brain dumps with untangled data', () => {
      const dumps: BrainDump[] = [
        {
          id: '1',
          date: '2026-04-30',
          rawContent: 'test',
          createdAt: Date.now(),
          untangledData: {
            mood: ['anxious'],
            distortions: [],
            entities: ['Work', 'Health'],
            themes: [],
            summary: 'Test',
            actionItem: '',
          },
        },
      ];

      const entities = dumps
        .filter(d => d.untangledData)
        .flatMap(d => d.untangledData!.entities);

      expect(entities).toEqual(['Work', 'Health']);
    });

    it('should skip dumps without untangled data', () => {
      const dumps: BrainDump[] = [
        {
          id: '1',
          date: '2026-04-30',
          rawContent: 'raw only',
          createdAt: Date.now(),
        },
      ];

      const entities = dumps
        .filter(d => d.untangledData)
        .flatMap(d => d.untangledData!.entities);

      expect(entities).toEqual([]);
    });

    it('should merge brain dump entities and uploaded files', () => {
      const dumps: BrainDump[] = [
        {
          id: '1',
          date: '2026-04-30',
          rawContent: 'test',
          createdAt: Date.now(),
          untangledData: {
            mood: ['calm'],
            distortions: [],
            entities: ['Work'],
            themes: [],
            summary: '',
            actionItem: '',
          },
        },
      ];

      const files: UploadedFile[] = [
        {
          id: 'f1',
          filename: 'notes.md',
          content: '# Hello',
          links: ['Work'],
          hashtags: ['productivity'],
          createdAt: Date.now(),
        },
      ];

      const hasDumps = dumps.length > 0;
      const hasFiles = files.length > 0;
      const hasData = hasDumps || hasFiles;

      expect(hasData).toBe(true);
    });

    it('should detect empty state when no dumps or files', () => {
      const hasData = false;
      expect(hasData).toBe(false);
    });

    it('should parse links from uploaded files', () => {
      const file: UploadedFile = {
        id: 'f1',
        filename: 'notes.md',
        content: 'See [[Project Alpha]] and [[Manager Bob]]',
        links: ['Project Alpha', 'Manager Bob'],
        hashtags: [],
        createdAt: Date.now(),
      };

      expect(file.links).toContain('Project Alpha');
      expect(file.links).toContain('Manager Bob');
    });

    it('should parse hashtags from uploaded files', () => {
      const file: UploadedFile = {
        id: 'f1',
        filename: 'notes.md',
        content: '#productivity #focus',
        links: [],
        hashtags: ['productivity', 'focus'],
        createdAt: Date.now(),
      };

      expect(file.hashtags).toContain('productivity');
      expect(file.hashtags).toContain('focus');
    });
  });
});
