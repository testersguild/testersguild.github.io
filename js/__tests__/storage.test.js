// Test storage helper functions

describe('Storage helpers', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('loadJson', () => {
    test('returns parsed JSON for valid JSON string', () => {
      localStorage.setItem('test-key', '{"foo":"bar"}');
      const { loadJson } = require('../utils.js');
      const result = loadJson('test-key', null);
      expect(result).toEqual({ foo: 'bar' });
    });

    test('returns fallback for invalid JSON', () => {
      localStorage.setItem('test-key', 'invalid json');
      const { loadJson } = require('../utils.js');
      const result = loadJson('test-key', { default: true });
      expect(result).toEqual({ default: true });
    });

    test('returns fallback for null value', () => {
      const { loadJson } = require('../utils.js');
      const result = loadJson('nonexistent', { default: true });
      expect(result).toEqual({ default: true });
    });
  });

  describe('saveJson', () => {
    test('saves data as JSON string', () => {
      const { saveJson } = require('../utils.js');
      const testData = { lessonId: 'test-1', completed: true };
      saveJson('test-key', testData);
      const retrieved = JSON.parse(localStorage.getItem('test-key'));
      expect(retrieved).toEqual(testData);
    });

    test('overwrites existing data', () => {
      const { saveJson } = require('../utils.js');
      saveJson('test-key', { version: 1 });
      saveJson('test-key', { version: 2 });
      const retrieved = JSON.parse(localStorage.getItem('test-key'));
      expect(retrieved).toEqual({ version: 2 });
    });
  });
});