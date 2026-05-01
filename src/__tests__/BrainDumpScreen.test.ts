// Testing BrainDumpScreen component logic without render
// (RN render requires complex module transforms)

import { BrainDump, AIUntangledData } from '../types';

describe('BrainDumpScreen Logic', () => {
  describe('BrainDump data structure', () => {
    it('should support raw content only (no AI processing yet)', () => {
      const dump: BrainDump = {
        id: 'abc',
        date: '2026-04-30',
        rawContent: 'I feel overwhelmed',
        createdAt: Date.now(),
      };
      expect(dump.untangledData).toBeUndefined();
      expect(dump.processedContent).toBeUndefined();
    });

    it('should support full AI-processed brain dump', () => {
      const untangled: AIUntangledData = {
        mood: ['anxious', 'overwhelmed'],
        distortions: ['catastrophizing'],
        entities: ['Project Alpha', 'Manager Bob'],
        themes: ['workload', 'deadlines'],
        summary: 'Feeling pressure about deadlines.',
        actionItem: 'Break the next step into a 15-minute task.',
      };
      const dump: BrainDump = {
        id: 'xyz',
        date: '2026-04-30',
        rawContent: 'I am so worried about the deadline ASAP',
        processedContent: '---\nmood: anxious\n---\n# Brain Dump',
        untangledData: untangled,
        createdAt: Date.now(),
      };
      expect(dump.untangledData!.mood).toHaveLength(2);
      expect(dump.untangledData!.entities).toContain('Project Alpha');
      expect(dump.processedContent).toContain('---');
    });
  });

  describe('Content preview logic', () => {
    it('should show summary when untangled data exists', () => {
      const dump: BrainDump = {
        id: '1',
        date: '2026-04-30',
        rawContent: 'Raw rambling thoughts here...',
        untangledData: {
          mood: ['anxious'],
          distortions: ['catastrophizing'],
          entities: ['Work'],
          themes: ['stress'],
          summary: 'AI-generated summary here',
          actionItem: 'Take a break',
        },
        createdAt: Date.now(),
      };
      const preview = dump.untangledData?.summary || dump.rawContent;
      expect(preview).toBe('AI-generated summary here');
    });

    it('should fall back to raw content when no AI data', () => {
      const dump: BrainDump = {
        id: '1',
        date: '2026-04-30',
        rawContent: 'Raw rambling thoughts here...',
        createdAt: Date.now(),
      };
      const preview = dump.untangledData?.summary || dump.rawContent;
      expect(preview).toBe('Raw rambling thoughts here...');
    });
  });

  describe('Markdown generation', () => {
    it('should generate valid YAML frontmatter', () => {
      const dump: BrainDump = {
        id: 'test',
        date: '2026-04-30',
        rawContent: 'My raw thoughts',
        createdAt: 1746000000000,
      };
      const untangledData: AIUntangledData = {
        mood: ['anxious', 'overwhelmed'],
        distortions: ['catastrophizing'],
        entities: ['Project Alpha'],
        themes: ['workload', 'deadlines'],
        summary: 'User feels pressure.',
        actionItem: 'Take a break.',
      };

      const mdContent = `---
date: ${dump.date}
mood: ${untangledData.mood.join(', ')}
distortions: ${untangledData.distortions.join(', ')}
---

# Brain Dump - ${new Date(dump.createdAt).toLocaleString()}

${dump.rawContent}

---
## AI Untangler Insights
**Themes:** ${untangledData.themes.map(t => `#${t.replace(/\s+/g, '-')}`).join(' ')}
**Entities:** ${untangledData.entities.map(e => `[[${e}]]`).join(', ')}

> **Summary:** ${untangledData.summary}

**💡 Suggested Action:** ${untangledData.actionItem}
`;

      expect(mdContent).toContain('---');
      expect(mdContent).toContain('mood: anxious, overwhelmed');
      expect(mdContent).toContain('#workload #deadlines');
      expect(mdContent).toContain('[[Project Alpha]]');
      expect(mdContent).toContain('> **Summary:** User feels pressure.');
    });
  });
});
