// Test i18n functions

describe('i18n functions', () => {
  describe('getCurrentLangKey', () => {
    beforeEach(() => {
      // Reset window.lang before each test
      if (typeof window !== 'undefined') {
        window.lang = 'pt';
      }
    });

    test('returns "pt" when lang is "pt"', () => {
      const { getCurrentLangKey } = require('../utils.js');
      expect(getCurrentLangKey()).toBe('pt');
    });

    test('returns "en" when lang is "en"', () => {
      if (typeof window !== 'undefined') {
        window.lang = 'en';
      }
      const { getCurrentLangKey } = require('../utils.js');
      expect(getCurrentLangKey()).toBe('en');
    });

    test('returns "pt" as fallback when lang is undefined', () => {
      if (typeof window !== 'undefined') {
        delete window.lang;
      }
      const { getCurrentLangKey } = require('../utils.js');
      expect(getCurrentLangKey()).toBe('pt');
    });
  });
});