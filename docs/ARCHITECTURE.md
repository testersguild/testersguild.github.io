# Testers Guild QA Course - Architecture Documentation

## Overview

The Testers Guild QA Course is a single-page application (SPA) built with vanilla JavaScript, designed to provide comprehensive software quality assurance training. The application uses a component-based architecture with clear separation of concerns.

## Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tools:** None (direct browser execution)
- **Testing:** Jest with jsdom environment
- **Code Quality:** ESLint, Stylelint, HTMLHint
- **Storage:** localStorage for user progress and preferences
- **Internationalization:** Custom i18n system supporting Portuguese (PT) and English (EN)

## Project Structure

```
testersguild.github.io/
├── index.html              # Main HTML entry point
├── css/
│   └── styles.css          # Main stylesheet with CSS variables
├── js/
│   ├── app.js              # Main application logic and controllers
│   ├── i18n.js             # Internationalization system
│   ├── utils.js            # Shared utility functions
│   └── __tests__/          # Test files
│       └── utils.test.js   # Utility function tests
├── data/
│   ├── tracks.js           # Track and lesson content data
│   ├── translations-en.js  # English translations
│   ├── lesson-enrichment.js # Lesson metadata (tiers, tips, notes)
│   ├── glossary.js         # QA glossary terms
│   ├── quizzes.js          # Quiz questions and answers
│   ├── checklists.js       # Project checklists
│   ├── labs.js             # Lab environment information
│   └── achievements.js     # Achievement definitions
├── docs/
│   └── ARCHITECTURE.md     # This file
└── .github/
    └── workflows/
        └── ci.yml          # CI/CD pipeline configuration
```

## Core Architecture

### Data Flow

The application follows a unidirectional data flow pattern:

1. **Data Loading:** Content data is loaded from `/data/*.js` files as global variables
2. **State Management:** Application state is maintained in global variables
3. **User Interaction:** User actions trigger state updates
4. **Re-rendering:** State changes trigger view re-renders
5. **Persistence:** State is persisted to localStorage

### Global State Variables

```javascript
// User Preferences
let lang = "pt";                    // Current language
let persona = "experienced";        // User persona (beginner/experienced/senior)
let theme = "dark";                 // Current theme
let seniorMode = false;             // Senior mode toggle

// User Progress
let progress = {};                  // Completed lessons
let bookmarks = [];                 // Bookmarked lessons
let quizzesPassed = {};             // Completed quizzes
let checklistState = {};           // Checklist completion state

// Navigation State
let currentView = "home";           // Current active view
let viewParams = {};                // Parameters for current view
let trackFilter = "all";            // Track filter state
let homeFilter = "all";             // Home filter state
```

### Storage System

The application uses localStorage with a migration system for legacy keys:

- **Storage Keys:** Defined as constants with `STORAGE_` prefix
- **Migration:** Supports legacy key names for backward compatibility
- **Functions:**
  - `getStorage(key, legacyKey)` - Retrieve with fallback
  - `loadJson(key, fallback)` - Parse JSON safely
  - `saveJson(key, data)` - Save as JSON
  - `loadProgress()` - Load user progress
  - `saveProgress()` - Save user progress

## Internationalization (i18n)

### Translation System

The i18n system uses a hierarchical key-based approach:

```javascript
// Translation structure
window.TG_I18N = {
  pt: {
    nav: { home: "Início", tracks: "Trilhas" },
    quiz: { title: "Quiz", submit: "Verificar" }
  },
  en: {
    nav: { home: "Home", tracks: "Tracks" },
    quiz: { title: "Quiz", submit: "Check" }
  }
}
```

### Usage

```javascript
// In JavaScript
t("nav.home") // Returns "Início" or "Home" based on current language

// In HTML
<span data-i18n="nav.home">Início</span>
```

### Language Switching

- **Toggle Function:** `toggleLang()` switches between PT and EN
- **Global Update:** `setLang()` updates language and re-renders current view
- **DOM Updates:** `applyStaticI18n()` updates all `data-i18n` elements

## Component Architecture

### View System

The application uses a view-based navigation system:

```javascript
// Available views
- home        # Landing page with tracks overview
- tracks      # All tracks listing
- roadmap     # Learning routes
- glossary    # QA glossary
- labs        # Lab environments
- quiz        # Quiz interface
- track       # Single track detail
- lesson      # Single lesson content
- dashboard   # User progress and achievements
```

### Navigation

```javascript
// Navigation function
navigate(viewName, params);

// Example usage
navigate("lesson", { lessonId: "w1-1" });
navigate("track", { trackId: "web" });
```

### Rendering Functions

Each view has a corresponding render function:

- `renderHome()` - Home page with persona selection
- `renderTracks()` - All tracks with filtering
- `renderRoadmap()` - Learning routes
- `renderGlossary()` - QA glossary
- `renderLabs()` - Lab environments
- `renderQuiz(trackId)` - Quiz interface
- `renderTrack(trackId)` - Single track detail
- `renderLesson(lessonId)` - Single lesson content
- `renderDashboard()` - User progress

## Data Structures

### Track Structure

```javascript
{
  id: "web",
  icon: "🌐",
  color: "#00e5ff",
  title: "Forja Frontend",
  description: "Cypress, Playwright, Selenium",
  level: "intermediate",
  topics: ["Automation", "Web Testing", "Tools"],
  courses: [
    {
      id: "w1",
      title: "Web Testing Fundamentals",
      lessons: [
        {
          id: "w1-1",
          title: "Introduction to Web Testing",
          duration: "15 min",
          content: "<p>Lesson content...</p>",
          resources: [
            { label: "Documentation", url: "https://..." }
          ]
        }
      ]
    }
  ]
}
```

### Lesson Enrichment

```javascript
{
  "w1-1": {
    tier: "beginner",
    primer: {
      pt: "Dica para iniciantes...",
      en: "Beginner tip..."
    },
    seniorNote: {
      pt: "Nota para sênior...",
      en: "Senior note..."
    }
  }
}
```

### Quiz Structure

```javascript
{
  "web": {
    pt: {
      title: "Quiz de Web Testing",
      passScore: 3,
      questions: [
        {
          q: "What is the purpose of E2E testing?",
          options: ["A", "B", "C", "D"],
          correct: 1,
          explain: "E2E testing validates..."
        }
      ]
    }
  }
}
```

## Key Functions

### Utility Functions

**`escapeHtml(str)`**
- Escapes HTML special characters to prevent XSS
- Used for all user-generated content rendering

**`getCurrentLangKey()`**
- Returns current language key ("en" or "pt")
- Centralized language check function

### Storage Functions

**`getStorage(key, legacyKey)`**
- Retrieves value from localStorage with legacy key fallback
- Handles data migration between key versions

**`loadJson(key, fallback)`**
- Safely parses JSON from localStorage
- Returns fallback on parse errors

### i18n Functions

**`t(key)`**
- Translates a key using current language
- Supports dot notation for nested keys
- Returns key if translation not found

**`localizedTrack(track)`**
- Returns track data with localized title/description
- Merges English overlay when applicable

### Rendering Functions

**`renderQuizQuestions(questions)`**
- Generates HTML for quiz questions
- Separated from main renderQuiz for modularity

**`handleQuizSubmit(quizData, trackId, container)`**
- Handles quiz submission logic
- Calculates score and shows results

**`renderLessonSidebar(track, course, rawCourse, rawLesson)`**
- Generates lesson sidebar HTML
- Shows lesson list with completion status

**`renderLessonContent(lesson, enr, rawLesson, done, isBookmarked, langKey, prev, next)`**
- Generates main lesson content HTML
- Includes primer, senior notes, and resources

## Event Handling

### Event Delegation

The application uses event delegation for dynamic content:

```javascript
// Example: Sidebar lesson navigation
document.querySelectorAll(".sidebar-lesson").forEach((el) => {
  const open = () => navigate("lesson", { lessonId: el.dataset.lesson });
  el.addEventListener("click", open);
  el.addEventListener("keydown", (e) => { 
    if (e.key === "Enter" || e.key === " ") { 
      e.preventDefault(); 
      open(); 
    } 
  });
});
```

### Keyboard Navigation

- **ArrowLeft/ArrowRight:** Navigate between lessons
- **Enter/Space:** Activate focused elements
- **Escape:** Close modals (when implemented)

## Accessibility

### ARIA Implementation

- **Landmarks:** Header, main, footer regions
- **Labels:** ARIA labels on interactive elements
- **Live Regions:** Toast notifications with `aria-live="polite"`
- **Skip Links:** Keyboard navigation bypass
- **Focus Management:** Visible focus outlines

### Screen Reader Support

- Semantic HTML structure
- ARIA attributes for dynamic content
- Role attributes for interactive elements
- Alt text for images (when added)

## Performance Considerations

### Script Loading

All scripts use `defer` attribute for non-blocking loading:

```html
<script src="data/tracks.js" defer></script>
<script src="js/app.js" defer></script>
```

### DOM Manipulation

- **innerHTML vs createElement:** Uses innerHTML for template strings
- **Batch Updates:** Multiple updates done in single operations
- **Event Delegation:** Reduces event listener count

### Data Loading

- **Global Variables:** Content loaded as window globals
- **Lazy Loading:** Could be implemented for large data files
- **Caching:** localStorage caches user progress

## Security Considerations

### XSS Prevention

**`escapeHtml()` function** sanitizes user content:

```javascript
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

### External Links

All external links include `rel="noopener noreferrer"`:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
```

### localStorage Validation

Data loaded from localStorage should be validated (currently basic try-catch).

## Testing Strategy

### Current Tests

- **Unit Tests:** Utility functions (escapeHtml, getCurrentLangKey)
- **Test Framework:** Jest with jsdom environment
- **Coverage:** Currently limited to utils.js

### Recommended Tests

- **Navigation Functions:** Test view switching
- **Progress Functions:** Test localStorage operations
- **i18n Functions:** Test translation logic
- **Filter Functions:** Test track filtering
- **Integration Tests:** Test user flows

## Deployment

### Static Hosting

The application is designed for static hosting:

- **GitHub Pages:** Current deployment target
- **Netlify/Vercel:** Alternative static hosts
- **CDN:** Can be served via CDN for global distribution

### Build Process

No build process required - direct file deployment.

### Environment Configuration

No environment variables needed - all configuration in JavaScript files.

## Contributing Guidelines

### Adding New Content

1. **Add Track:** Update `data/tracks.js`
2. **Add Translations:** Update `data/translations-en.js`
3. **Add Enrichment:** Update `data/lesson-enrichment.js`
4. **Add Quiz:** Update `data/quizzes.js`

### Code Style

- **JavaScript:** ESLint configuration in `.eslintrc.json`
- **CSS:** Stylelint configuration in `.stylelintrc.json`
- **HTML:** HTMLHint for validation
- **Naming:** camelCase for functions, PascalCase for components

### Testing Requirements

- Add tests for new utility functions
- Ensure existing tests pass
- Maintain test coverage above 70%

## Future Improvements

### Architecture

- **Module System:** Consider ES modules for better code organization
- **Virtual DOM:** Consider lightweight VDOM for complex re-renders
- **State Management:** Consider centralized state management for complex features

### Performance

- **Lazy Loading:** Implement lazy loading for large data files
- **Code Splitting:** Split JavaScript into smaller bundles
- **Service Worker:** Add offline support with service worker

### Features

- **Export/Import:** Allow users to export/import progress
- **Real-time Sync:** Consider backend for progress synchronization
- **Collaboration:** Add features for collaborative learning

## Troubleshooting

### Common Issues

**localStorage Quota Exceeded**
- Clear old progress data
- Implement data compression
- Use IndexedDB for larger storage

**Translation Keys Missing**
- Check both PT and EN translation files
- Ensure key path is correct
- Check for typos in key names

**Navigation Not Working**
- Check if view function exists
- Verify parameters are correct
- Check console for JavaScript errors

### Debug Mode

Enable debug logging by modifying the `t()` function:

```javascript
function t(key) {
  // ... existing code
  const result = node || key;
  console.debug(`i18n: ${key} -> ${result}`);
  return result;
}
```

## Related Documentation

- [Contributing Guide](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Security Policy](../SECURITY.md)
- [Analysis Report](../analysis-report.md)

## Contact

- **Discord:** https://discord.gg/evVQqq4rf
- **GitHub Issues:** https://github.com/testersguild/testersguild.github.io/issues