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
 * Validates progress data structure
 * @param {*} data - Data to validate
 * @returns {boolean} True if data structure is valid
 */
function validateProgressData(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) return false;
  
  // Check if all keys are strings (lesson IDs)
  for (const key in data) {
    if (typeof key !== "string") return false;
    const value = data[key];
    if (value && typeof value === "object") {
      // Validate progress entry structure
      if (value.completedAt && typeof value.completedAt !== "string") return false;
    }
  }
  return true;
}

/**
 * Validates bookmarks data structure
 * @param {*} data - Data to validate
 * @returns {boolean} True if data structure is valid
 */
function validateBookmarksData(data) {
  if (!Array.isArray(data)) return false;
  // Check if all items are strings (lesson IDs)
  return data.every(item => typeof item === "string");
}

/**
 * Validates quizzes passed data structure
 * @param {*} data - Data to validate
 * @returns {boolean} True if data structure is valid
 */
function validateQuizzesPassedData(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) return false;
  
  for (const key in data) {
    if (typeof key !== "string") return false;
    const value = data[key];
    if (value && typeof value === "object") {
      if (value.passedAt && typeof value.passedAt !== "string") return false;
      if (value.score && typeof value.score !== "number") return false;
    }
  }
  return true;
}

/**
 * Loads and parses JSON from localStorage with schema validation
 * @param {string} key - Storage key
 * @param {*} fallback - Fallback value if parsing fails
 * @param {Function} validator - Optional validation function
 * @returns {*} Parsed data or fallback
 */
function loadJson(key, fallback, validator) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (data === null) return fallback;
    if (validator && !validator(data)) return fallback;
    return data;
  } catch { return fallback; }
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
  module.exports = { 
    escapeHtml, 
    getCurrentLangKey, 
    loadJson, 
    saveJson,
    validateProgressData,
    validateBookmarksData,
    validateQuizzesPassedData
  };
}

// Export for browser environment
if (typeof window !== "undefined") {
  window.escapeHtml = escapeHtml;
  window.getCurrentLangKey = getCurrentLangKey;
  window.loadJson = loadJson;
  window.saveJson = saveJson;
  window.validateProgressData = validateProgressData;
  window.validateBookmarksData = validateBookmarksData;
  window.validateQuizzesPassedData = validateQuizzesPassedData;
}
