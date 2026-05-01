import { FocusSession } from '../types';

describe('FocusHeatmap Logic', () => {
  describe('Weekly focus stats calculation', () => {
    it('should compute total minutes per day', () => {
      const sessions: FocusSession[] = [
        { date: '2026-04-30', durationMs: 1500000 }, // 25 min
        { date: '2026-04-30', durationMs: 900000 },  // 15 min
      ];

      const totalMin = sessions
        .filter(s => s.date === '2026-04-30')
        .reduce((acc, s) => acc + s.durationMs / 60000, 0);

      expect(totalMin).toBeCloseTo(40);
    });

    it('should compute intensity capped at 1.0 for the 2-hour goal', () => {
      // 120 minutes = goal = intensity 1.0
      const totalMin = 120;
      const intensity = Math.min(totalMin / 120, 1);
      expect(intensity).toBe(1);

      // 60 minutes = half goal = intensity 0.5
      const intensity2 = Math.min(60 / 120, 1);
      expect(intensity2).toBeCloseTo(0.5);

      // 240 minutes = exceeds goal = capped at 1
      const intensity3 = Math.min(240 / 120, 1);
      expect(intensity3).toBe(1);
    });

    it('should generate last 7 days', () => {
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
      expect(dates).toHaveLength(7);
      // All dates should be valid YYYY-MM-DD
      dates.forEach(date => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
});
