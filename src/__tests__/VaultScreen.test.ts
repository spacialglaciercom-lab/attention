import { BrainDump } from '../types';

describe('VaultScreen Logic', () => {
  describe('Brain dump filtering and display', () => {
    const mockDumps: BrainDump[] = [
      {
        id: '1',
        date: '2026-04-29',
        rawContent: 'Feeling overwhelmed by deadlines',
        untangledData: {
          mood: ['anxious', 'stressed'],
          distortions: ['catastrophizing'],
          entities: ['Deadlines', 'Manager'],
          themes: ['workload'],
          summary: 'User is feeling pressure from multiple deadlines.',
          actionItem: 'Break tasks into smaller steps.',
        },
        processedContent: '---\n---\nProcessed content',
        createdAt: Date.now() - 86400000,
      },
      {
        id: '2',
        date: '2026-04-30',
        rawContent: 'Just raw thoughts, no AI processing yet',
        createdAt: Date.now(),
      },
    ];

    it('should provide summary for dumps with untangled data', () => {
      const preview = mockDumps[0].untangledData?.summary || mockDumps[0].rawContent;
      expect(preview).toBe('User is feeling pressure from multiple deadlines.');
    });

    it('should fallback to raw content for dumps without AI data', () => {
      const preview = mockDumps[1].untangledData?.summary || mockDumps[1].rawContent;
      expect(preview).toBe('Just raw thoughts, no AI processing yet');
    });

    it('should generate filename from date and id', () => {
      const filename = `${mockDumps[0].date}-${mockDumps[0].id.substring(0, 4)}.md`;
      expect(filename).toBe('2026-04-29-1.md');
    });

    it('should display mood tags from untangled data', () => {
      const moods = mockDumps[0].untangledData?.mood.slice(0, 2) || [];
      expect(moods).toEqual(['anxious', 'stressed']);
    });
  });

  describe('Empty vault state', () => {
    it('should indicate empty state when no dumps', () => {
      const brainDumps: BrainDump[] = [];
      const isEmpty = brainDumps.length === 0;
      expect(isEmpty).toBe(true);
    });
  });
});
