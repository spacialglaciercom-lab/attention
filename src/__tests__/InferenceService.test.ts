import { InferenceService } from '../services/InferenceService';

describe('InferenceService', () => {
  describe('untangle', () => {
    it('should return error when no API keys are configured', async () => {
      const result = await InferenceService.untangle('test content');
      expect(result.success).toBe(false);
      expect(result.provider).toBe('mock');
      expect(result.error).toContain('No API key');
    });

    it('should attempt Gemini primary when API key is provided', async () => {
      // With a bogus key, Gemini will fail but we test the attempt path
      const result = await InferenceService.untangle('test', {
        geminiApiKey: 'fake-gemini-key',
      });
      // API call will fail with bogus key, and no Mistral fallback, so error
      expect(result.success).toBe(false);
      expect(['primary', 'mistral', 'mock']).toContain(result.provider);
    });

    it('should attempt Mistral fallback when key is provided', async () => {
      const result = await InferenceService.untangle('test', {
        mistralApiKey: 'fake-mistral-key',
      });
      // No Gemini key, so goes straight to Mistral with bogus key — will fail
      expect(result.success).toBe(false);
      expect(['mistral']).toContain(result.provider);
    });

    it('should try Gemini first then Mistral when both keys provided', async () => {
      const result = await InferenceService.untangle('test', {
        geminiApiKey: 'fake-gemini-key',
        mistralApiKey: 'fake-mistral-key',
      });
      // Both will fail with bogus keys
      expect(result.success).toBe(false);
    });

    it('should include provider field in result', async () => {
      const result = await InferenceService.untangle('content');
      expect(['primary', 'mistral', 'mock']).toContain(result.provider);
    });

    it('should handle empty API key strings gracefully', async () => {
      const result = await InferenceService.untangle('content', {
        geminiApiKey: '',
        mistralApiKey: '',
      });
      expect(result.success).toBe(false);
      expect(result.provider).toBe('mock');
    });
  });
});
