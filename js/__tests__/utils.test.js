// Test utilities - will use the actual functions from utils.js

describe('escapeHtml', () => {
  test('escapes HTML special characters', () => {
    const { escapeHtml } = require('../utils.js');
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
  });

  test('handles empty string', () => {
    const { escapeHtml } = require('../utils.js');
    expect(escapeHtml('')).toBe('');
  });

  test('handles non-string input', () => {
    const { escapeHtml } = require('../utils.js');
    expect(escapeHtml(123)).toBe('123');
    expect(escapeHtml(null)).toBe('null');
  });
});
