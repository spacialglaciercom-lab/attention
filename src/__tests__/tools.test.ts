import { CATEGORIES, TOOLS } from '../constants/toolsMockData';
import {
  ToolCategory,
  ToolItem,
  ToolCategoryType,
  ToolFilter,
} from '../types/tools';

describe('Tools Mock Data', () => {
  describe('CATEGORIES', () => {
    it('should have exactly 10 categories', () => {
      expect(CATEGORIES).toHaveLength(10);
    });

    it('should have valid category structure', () => {
      CATEGORIES.forEach((category: ToolCategory) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('title');
        expect(category).toHaveProperty('subtitle');
        expect(typeof category.id).toBe('string');
        expect(typeof category.title).toBe('string');
        expect(typeof category.subtitle).toBe('string');
      });
    });

    it('should have unique category IDs', () => {
      const ids = CATEGORIES.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should include all required categories', () => {
      const categoryIds = CATEGORIES.map((c) => c.id);
      const requiredIds: ToolCategoryType[] = [
        'sound_patterns',
        'breathing',
        'quotes',
        'emotions_101',
        'best_self',
        'movement',
        'mindfulness',
        'reframing',
        'connection',
        'creativity',
      ];

      requiredIds.forEach((id) => {
        expect(categoryIds).toContain(id);
      });
    });

    it('should have correct count in subtitles', () => {
      const categoryTests = [
        { id: 'sound_patterns', expected: '4 experiences' },
        { id: 'breathing', expected: '5 practices' },
        { id: 'quotes', expected: '128 affirmations' },
        { id: 'emotions_101', expected: '10 videos' },
        { id: 'best_self', expected: '3 tools' },
      ];

      categoryTests.forEach(({ id, expected }) => {
        const category = CATEGORIES.find((c) => c.id === id);
        expect(category).toBeDefined();
        expect(category?.subtitle).toBe(expected);
      });
    });
  });

  describe('TOOLS', () => {
    it('should have valid tool structure', () => {
      TOOLS.forEach((tool: ToolItem) => {
        expect(tool).toHaveProperty('id');
        expect(tool).toHaveProperty('title');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('category');
        expect(typeof tool.id).toBe('string');
        expect(typeof tool.title).toBe('string');
        expect(typeof tool.description).toBe('string');
        expect(typeof tool.category).toBe('string');
      });
    });

    it('should have unique tool IDs', () => {
      const ids = TOOLS.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have sound patterns tools', () => {
      const soundPatterns = TOOLS.filter((t) => t.category === 'sound_patterns');
      expect(soundPatterns.length).toBeGreaterThan(0);
      expect(soundPatterns[0].title).toContain('sounds');
    });

    it('should have breathing tools', () => {
      const breathing = TOOLS.filter((t) => t.category === 'breathing');
      expect(breathing.length).toBeGreaterThan(0);
      expect(breathing.length).toBe(5);
      breathing.forEach((tool) => {
        expect(tool.title).toBeTruthy();
        expect(tool.description).toBeTruthy();
      });
    });

    it('should have breathing tools with correct descriptions', () => {
      const breathing = TOOLS.filter((t) => t.category === 'breathing');
      const titles = breathing.map((t) => t.title);
      expect(titles).toContain('Physiological Sigh');
      expect(titles).toContain('Box Breathing');
      expect(titles).toContain('4-7-8 Breathing');
      expect(titles).toContain('Coherent Breathing');
      expect(titles).toContain('Belly Breathing');
    });

    it('should have breathing tools with correct durations', () => {
      const breathing = TOOLS.filter((t) => t.category === 'breathing');
      const physiologicalSigh = breathing.find((t) => t.title === 'Physiological Sigh');
      expect(physiologicalSigh?.duration).toBe('2 min');

      const boxBreathing = breathing.find((t) => t.title === 'Box Breathing');
      expect(boxBreathing?.duration).toBe('5 min');
    });

    it('should have quotes with authors', () => {
      const quotes = TOOLS.filter((t) => t.category === 'quotes');
      expect(quotes.length).toBeGreaterThan(0);
      quotes.forEach((quote) => {
        expect(quote.author).toBeDefined();
        expect(typeof quote.author).toBe('string');
      });
    });

    it('should include Maya Angelou and Ram Dass quotes', () => {
      const quotes = TOOLS.filter((t) => t.category === 'quotes');
      const authors = quotes.map((t) => t.author);
      expect(authors).toContain('Maya Angelou');
      expect(authors).toContain('Ram Dass');
    });
  });

  describe('Tool Category Type', () => {
    const validCategories: ToolCategoryType[] = [
      'sound_patterns',
      'breathing',
      'quotes',
      'emotions_101',
      'best_self',
      'movement',
      'mindfulness',
      'reframing',
      'connection',
      'creativity',
    ];

    it('should accept all valid category types', () => {
      validCategories.forEach((category) => {
        const testCategory: ToolCategoryType = category;
        expect(testCategory).toBe(category);
      });
    });
  });

  describe('Tool Filter Type', () => {
    it('should include "all" and all category types', () => {
      const filters: ToolFilter[] = ['all', 'sound_patterns', 'breathing', 'quotes'];
      filters.forEach((filter) => {
        expect(['all', 'sound_patterns', 'breathing', 'quotes']).toContain(filter);
      });
    });
  });
});

describe('Tools Filter Logic', () => {
  it('should filter tools by category', () => {
    const allTools = [...TOOLS];
    const breathingTools = allTools.filter((t) => t.category === 'breathing');
    expect(breathingTools).toHaveLength(5);
    expect(breathingTools.every((t) => t.category === 'breathing')).toBe(true);
  });

  it('should filter tools by search query', () => {
    const allTools = [...TOOLS];
    const searchResults = allTools.filter(
      (t) => t.title.toLowerCase().includes('breathing')
    );
    expect(searchResults.length).toBeGreaterThan(0);
    searchResults.forEach((tool) => {
      expect(tool.title.toLowerCase()).toContain('breathing');
    });
  });

  it('should filter tools by description', () => {
    const allTools = [...TOOLS];
    const searchResults = allTools.filter(
      (t) => t.description.toLowerCase().includes('relax')
    );
    expect(searchResults.length).toBeGreaterThan(0);
  });

  it('should filter tools by author', () => {
    const allTools = [...TOOLS];
    const searchResults = allTools.filter(
      (t) => t.author?.toLowerCase().includes('maya')
    );
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].author).toBe('Maya Angelou');
  });

  it('should combine category filter with search query', () => {
    let filtered = TOOLS.filter((t) => t.category === 'breathing');
    filtered = filtered.filter((t) => t.title.toLowerCase().includes('box'));
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Box Breathing');
  });

  it('should return empty array for non-matching search', () => {
    const searchResults = TOOLS.filter(
      (t) => t.title.toLowerCase().includes('nonexistent-tool-name')
    );
    expect(searchResults).toHaveLength(0);
  });

  it('should handle empty search query', () => {
    const searchResults = TOOLS.filter((t) => t.title.toLowerCase().includes(''));
    expect(searchResults).toHaveLength(TOOLS.length);
  });
});

describe('Tools Categories Organization', () => {
  it('should organize tools by category', () => {
    const toolsByCategory: Record<string, ToolItem[]> = {};

    TOOLS.forEach((tool) => {
      if (!toolsByCategory[tool.category]) {
        toolsByCategory[tool.category] = [];
      }
      toolsByCategory[tool.category].push(tool);
    });

    expect(Object.keys(toolsByCategory)).toContain('sound_patterns');
    expect(Object.keys(toolsByCategory)).toContain('breathing');
    expect(Object.keys(toolsByCategory)).toContain('quotes');
  });

  it('should have correct number of tools per category', () => {
    const toolsByCategory: Record<string, ToolItem[]> = {};

    TOOLS.forEach((tool) => {
      if (!toolsByCategory[tool.category]) {
        toolsByCategory[tool.category] = [];
      }
      toolsByCategory[tool.category].push(tool);
    });

    expect(toolsByCategory['sound_patterns']?.length).toBe(4);
    expect(toolsByCategory['breathing']?.length).toBe(5);
    expect(toolsByCategory['quotes']?.length).toBe(5);
  });

  it('should have tools with optional duration field', () => {
    const toolsWithDuration = TOOLS.filter((t) => t.duration);
    expect(toolsWithDuration.length).toBeGreaterThan(0);

    toolsWithDuration.forEach((tool) => {
      expect(tool.duration).toBeDefined();
      expect(typeof tool.duration).toBe('string');
      expect(tool.duration).toMatch(/\d+\s*(min|sec)/);
    });
  });

  it('should have tools with optional author field', () => {
    const toolsWithAuthor = TOOLS.filter((t) => t.author);
    expect(toolsWithAuthor.length).toBeGreaterThan(0);

    toolsWithAuthor.forEach((tool) => {
      expect(tool.author).toBeDefined();
      expect(typeof tool.author).toBe('string');
      expect(tool.author!.length).toBeGreaterThan(0);
    });
  });
});
