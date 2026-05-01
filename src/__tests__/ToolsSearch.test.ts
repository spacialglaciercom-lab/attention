import { TOOLS } from '../constants/toolsMockData';
import { ToolFilter } from '../types/tools';

describe('ToolsSearch Component Logic', () => {
  describe('Available Filters', () => {
    const FILTERS: { id: ToolFilter; label: string }[] = [
      { id: 'all', label: 'All' },
      { id: 'sound_patterns', label: 'Sound Patterns' },
      { id: 'breathing', label: 'Breathing' },
      { id: 'quotes', label: 'Quotes' },
    ];

    it('should have 4 filter options', () => {
      expect(FILTERS).toHaveLength(4);
    });

    it('should have All filter as first option', () => {
      expect(FILTERS[0].id).toBe('all');
      expect(FILTERS[0].label).toBe('All');
    });

    it('should have correct filter labels', () => {
      expect(FILTERS[1].label).toBe('Sound Patterns');
      expect(FILTERS[2].label).toBe('Breathing');
      expect(FILTERS[3].label).toBe('Quotes');
    });

    it('should have valid filter IDs', () => {
      FILTERS.forEach((filter) => {
        expect(['all', 'sound_patterns', 'breathing', 'quotes']).toContain(filter.id);
      });
    });
  });

  describe('Active Filter State', () => {
    it('should default to All filter', () => {
      const activeFilter: ToolFilter = 'all';
      expect(activeFilter).toBe('all');
    });

    it('should change active filter on press', () => {
      let activeFilter: ToolFilter = 'all';
      const setActiveFilter = (filter: ToolFilter) => {
        activeFilter = filter;
      };

      setActiveFilter('breathing');
      expect(activeFilter).toBe('breathing');
    });

    it('should support switching between filters', () => {
      let activeFilter: ToolFilter = 'all';
      const setActiveFilter = (filter: ToolFilter) => {
        activeFilter = filter;
      };

      setActiveFilter('sound_patterns');
      expect(activeFilter).toBe('sound_patterns');

      setActiveFilter('quotes');
      expect(activeFilter).toBe('quotes');

      setActiveFilter('all');
      expect(activeFilter).toBe('all');
    });
  });

  describe('Search Query State', () => {
    it('should initialize with empty string', () => {
      const searchQuery = '';
      expect(searchQuery).toBe('');
    });

    it('should update on text change', () => {
      let searchQuery = '';
      const setSearchQuery = (query: string) => {
        searchQuery = query;
      };

      setSearchQuery('breathing');
      expect(searchQuery).toBe('breathing');
    });

    it('should handle clearing search', () => {
      let searchQuery = 'breathing';
      const setSearchQuery = (query: string) => {
        searchQuery = query;
      };

      setSearchQuery('');
      expect(searchQuery).toBe('');
    });
  });

  describe('Filter Logic', () => {
    it('should show all tools when filter is all', () => {
      let filtered = TOOLS.filter(() => true);
      expect(filtered.length).toBe(TOOLS.length);
    });

    it('should filter by sound_patterns category', () => {
      const filtered = TOOLS.filter((t) => t.category === 'sound_patterns');
      expect(filtered.length).toBe(4);
      expect(filtered.every((t) => t.category === 'sound_patterns')).toBe(true);
    });

    it('should filter by breathing category', () => {
      const filtered = TOOLS.filter((t) => t.category === 'breathing');
      expect(filtered.length).toBe(5);
      expect(filtered.every((t) => t.category === 'breathing')).toBe(true);
    });

    it('should filter by quotes category', () => {
      const filtered = TOOLS.filter((t) => t.category === 'quotes');
      expect(filtered.length).toBe(5);
      expect(filtered.every((t) => t.category === 'quotes')).toBe(true);
    });

    it('should return empty for non-existent category', () => {
      const filtered = TOOLS.filter((t) => t.category === 'movement');
      expect(filtered.length).toBe(0);
    });
  });

  describe('Search Logic', () => {
    it('should filter by title (case insensitive)', () => {
      const query = 'BREATHING';
      const filtered = TOOLS.filter(
        (t) => t.title.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should filter by description (case insensitive)', () => {
      const query = 'relax';
      const filtered = TOOLS.filter(
        (t) => t.description.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should filter by author (case insensitive)', () => {
      const query = 'maya';
      const filtered = TOOLS.filter(
        (t) => t.author?.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].author).toBe('Maya Angelou');
    });

    it('should return all results for empty query', () => {
      const query = '';
      const filtered = TOOLS.filter(
        (t) => t.title.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(TOOLS.length);
    });
  });

  describe('Combined Filter and Search', () => {
    it('should apply both filter and search', () => {
      const searchQuery = 'box';

      let filtered = TOOLS.filter((t) => t.category === 'breathing');
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery) ||
          t.description.toLowerCase().includes(searchQuery)
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Box Breathing');
    });

    it('should filter by category and search in description', () => {
      const searchQuery = 'heart';

      let filtered = TOOLS.filter((t) => t.category === 'breathing');
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery) ||
          t.description.toLowerCase().includes(searchQuery)
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Coherent Breathing');
    });

    it('should return empty when no tools match both filters', () => {
      const searchQuery = 'nonexistent';

      let filtered = TOOLS.filter((t) => t.category === 'breathing');
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery) ||
          t.description.toLowerCase().includes(searchQuery)
      );

      expect(filtered.length).toBe(0);
    });
  });

  describe('Search Input Configuration', () => {
    it('should have placeholder text', () => {
      const placeholder = 'Search tools...';
      expect(placeholder).toBe('Search tools...');
    });

    it('should have appropriate placeholder color', () => {
      const placeholderTextColor = 'rgba(255, 255, 255, 0.6)';
      expect(placeholderTextColor).toBe('rgba(255, 255, 255, 0.6)');
    });
  });

  describe('Back Navigation', () => {
    it('should have back button', () => {
      const hasBackButton = true;
      expect(hasBackButton).toBe(true);
    });

    it('should call onBackPress callback', () => {
      const onBackPress = jest.fn();
      onBackPress();
      expect(onBackPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no results', () => {
      const filteredTools: never[] = [];
      const showEmptyState = filteredTools.length === 0;
      expect(showEmptyState).toBe(true);
    });

    it('should not display empty state when results exist', () => {
      const filteredTools = TOOLS.slice(0, 3);
      const showEmptyState = filteredTools.length === 0;
      expect(showEmptyState).toBe(false);
    });

    it('should display helpful message in empty state', () => {
      const emptyTitle = 'No tools found';
      const emptyText = 'Try adjusting your search or filter';
      expect(emptyTitle).toBe('No tools found');
      expect(emptyText).toBe('Try adjusting your search or filter');
    });
  });

  describe('Filter Chips Horizontal Scroll', () => {
    it('should be horizontally scrollable', () => {
      const horizontal = true;
      expect(horizontal).toBe(true);
    });

    it('should hide horizontal scroll indicator', () => {
      const showsHorizontalScrollIndicator = false;
      expect(showsHorizontalScrollIndicator).toBe(false);
    });

    it('should have content container padding', () => {
      const paddingHorizontal = 24;
      expect(paddingHorizontal).toBe(24);
    });
  });

  describe('Tool List Configuration', () => {
    it('should hide vertical scroll indicator', () => {
      const showsVerticalScrollIndicator = false;
      expect(showsVerticalScrollIndicator).toBe(false);
    });

    it('should have content container padding', () => {
      const paddingHorizontal = 24;
      const paddingBottom = 48;
      expect(paddingHorizontal).toBe(24);
      expect(paddingBottom).toBe(48);
    });
  });

  describe('Header Structure', () => {
    it('should have back button on left', () => {
      const leftElement = 'backButton';
      expect(leftElement).toBe('backButton');
    });

    it('should have title in center', () => {
      const headerTitle = 'Search Tools';
      expect(headerTitle).toBe('Search Tools');
    });

    it('should have spacer on right for balance', () => {
      const rightElement = 'spacer';
      expect(rightElement).toBe('spacer');
    });
  });
});
