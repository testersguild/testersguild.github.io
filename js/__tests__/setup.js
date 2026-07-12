// Test setup - mock browser APIs
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; },
};

global.lang = 'pt'; // Mock the lang variable for getCurrentLangKey

global.navigator = {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
};

global.HTMLElement = class {
  constructor() {
    this.classList = {
      _classes: new Set(),
      add(className) { this._classes.add(className); },
      remove(className) { this._classes.delete(className); },
      toggle(className, force) {
        if (force === undefined) {
          if (this._classes.has(className)) {
            this._classes.delete(className);
            return false;
          } else {
            this._classes.add(className);
            return true;
          }
        }
        if (force) this._classes.add(className);
        else this._classes.delete(className);
        return force;
      },
      contains(className) { return this._classes.has(className); },
    };
  }
};

global.document = {
  documentElement: { lang: 'pt-BR', setAttribute: jest.fn() },
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  getElementById: jest.fn(() => ({ classList: new global.HTMLElement().classList, innerHTML: '', textContent: '', addEventListener: jest.fn() })),
  createElement: jest.fn(() => ({ classList: new global.HTMLElement().classList, innerHTML: '', textContent: '', setAttribute: jest.fn(), addEventListener: jest.fn(), querySelector: jest.fn(), querySelectorAll: jest.fn(() => []) })),
  addEventListener: jest.fn(),
};