/**
 * Utility functions for Testers Guild QA Course
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Gets the current language key for i18n
 * @returns {string} "en" or "pt"
 */
function getCurrentLangKey() {
  // Check if lang is defined globally (from app.js) or use fallback
  if (typeof window !== "undefined" && window.lang) {
    return window.lang === "en" ? "en" : "pt";
  }
  // Fallback for testing or if lang is not defined
  return "pt";
}

/**
 * Loads and parses JSON from localStorage
 * @param {string} key - Storage key
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed data or fallback
 */
function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

/**
 * Saves data as JSON to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 */
function saveJson(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Export for Node.js/test environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = { escapeHtml, getCurrentLangKey, loadJson, saveJson };
}

// Export for browser environment
if (typeof window !== "undefined") {
  window.escapeHtml = escapeHtml;
  window.getCurrentLangKey = getCurrentLangKey;
  window.loadJson = loadJson;
  window.saveJson = saveJson;
}
