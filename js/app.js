(function () {
  "use strict";

  const STORAGE_PROGRESS    = "testers-guild-progress";
  const STORAGE_LANG        = "testers-guild-lang";
  const STORAGE_LAST_LESSON = "testers-guild-last-lesson";
  const STORAGE_PERSONA     = "testers-guild-persona";
  const STORAGE_BOOKMARKS   = "testers-guild-bookmarks";
  const STORAGE_QUIZZES     = "testers-guild-quizzes";
  const STORAGE_CHECKLISTS  = "testers-guild-checklists";
  const STORAGE_THEME       = "testers-guild-theme";
  const STORAGE_SENIOR_MODE = "testers-guild-senior-mode";
  const STORAGE_DISCORD_BANNER = "testers-guild-discord-banner";

  const tracks         = window.TG_QAWAY_TRACKS    || [];
  const enOverlay      = window.TG_QAWAY_EN        || { tracks: {}, courses: {}, lessons: {} };
  const enrichment     = window.TG_LESSON_ENRICHMENT || {};
  const quizzes        = window.TG_QUIZZES          || {};
  const checklists     = window.TG_CHECKLISTS       || {};
  const labsData       = window.TG_LABS             || {};
  const achievementsList = window.TG_ACHIEVEMENTS   || [];

  let lang        = getStorage(STORAGE_LANG, "tg-qaway-lang") || "pt";
  // Expose lang globally for utils.js
  window.lang = lang;
  let persona     = getStorage(STORAGE_PERSONA) || "experienced";
  let progress    = loadProgress();
  let bookmarks   = loadJson(STORAGE_BOOKMARKS, [], window.validateBookmarksData);
  let quizzesPassed = loadJson(STORAGE_QUIZZES, {}, window.validateQuizzesPassedData);
  let checklistState = loadJson(STORAGE_CHECKLISTS, {});
  let theme       = getStorage(STORAGE_THEME) || "dark";
  let seniorMode  = getStorage(STORAGE_SENIOR_MODE) === "true";
  let currentView = "home";
  let viewParams  = {};
  let trackFilter     = "all";
  let homeFilter      = "all";
  let searchTimeout = null;
  let quizState   = {};


  const PERSONA_TRACKS = {
    beginner:   ["starter", "web", "api", "accessibility", "mobile"],
    experienced:["web", "api", "mobile", "devops", "accessibility", "security"],
    senior:     ["leadership", "performance", "security", "devops", "web", "api"],
  };

  const TRACK_AUDIENCE = {
    starter: "beginner", web: "intermediate", api: "intermediate", mobile: "intermediate",
    performance: "senior", security: "intermediate", devops: "intermediate",
    accessibility: "intermediate", leadership: "senior",
  };

  // ── Storage helpers ───────────────────────────────────────────────────────
  /**
   * Gets value from localStorage with legacy key fallback
   * @param {string} key - Primary storage key
   * @param {string} legacyKey - Fallback legacy key
   * @returns {string|null} Stored value or null
   */
  function getStorage(key, legacyKey) {
    let val = localStorage.getItem(key);
    if (!val && legacyKey) {
      val = localStorage.getItem(legacyKey);
      if (val) localStorage.setItem(key, val);
    }
    return val;
  }

  // loadJson and saveJson are now in utils.js and shared across the app

  /**
   * Loads user progress from localStorage
   * @returns {Object} Progress object
   */
  function loadProgress() {
    try {
      const raw = getStorage(STORAGE_PROGRESS, "tg-qaway-progress");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  /**
   * Saves current progress to localStorage
   */
  function saveProgress() { window.saveJson(STORAGE_PROGRESS, progress); }

  /**
   * Saves last viewed lesson ID
   * @param {string} id - Lesson identifier
   */
  function saveLastLesson(id) { localStorage.setItem(STORAGE_LAST_LESSON, id); }

  // ── i18n ──────────────────────────────────────────────────────────────────
  /**
   * Translates a key using current language
   * @param {string} key - Translation key (dot notation)
   * @returns {string} Translated string or key if not found
   */
  function t(key) {
    const parts = key.split(".");
    let node = window.TG_I18N?.[lang];
    for (const p of parts) {
      if (!node || node[p] === undefined) return key;
      node = node[p];
    }
    return node;
  }

  /**
   * Returns localized track data
   * @param {Object} track - Track data object
   * @returns {Object} Localized track data
   */
  function localizedTrack(track) {
    if (lang === "en" && enOverlay.tracks[track.id]) {
      const o = enOverlay.tracks[track.id];
      return { ...track, title: o.title, description: o.description, level: o.level, topics: o.topics || track.topics };
    }
    return track;
  }

  /**
   * Returns localized course data
   * @param {Object} course - Course data object
   * @returns {Object} Localized course data
   */
  function localizedCourse(course) {
    if (lang === "en" && enOverlay.courses[course.id])
      return { ...course, title: enOverlay.courses[course.id].title };
    return course;
  }

  /**
   * Returns localized lesson data
   * @param {Object} lesson - Lesson data object
   * @returns {Object} Localized lesson data
   */
  function localizedLesson(lesson) {
    if (lang === "en" && enOverlay.lessons[lesson.id]) {
      const o = enOverlay.lessons[lesson.id];
      return { ...lesson, title: o.title, content: o.content || lesson.content };
    }
    return lesson;
  }

  /**
   * Gets enrichment data for a lesson
   * @param {string} lessonId - Lesson identifier
   * @returns {Object} Enrichment data with tier, primer, and senior note
   */
  function getEnrichment(lessonId) {
    return enrichment[lessonId] || { tier: "intermediate", primer: null, seniorNote: null };
  }

  /**
   * Returns localized label for lesson tier
   * @param {string} tier - Tier level (beginner, intermediate, senior)
   * @returns {string} Localized tier label
   */
  function tierLabel(tier) {
    const map = { beginner: "lesson.tierBeginner", intermediate: "lesson.tierIntermediate", senior: "lesson.tierSenior" };
    return t(map[tier] || "lesson.tierIntermediate");
  }


  // ── Theme ─────────────────────────────────────────────────────────────────
  /**
   * Applies current theme to document
   */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "🌙" : "☀️";
    localStorage.setItem(STORAGE_THEME, theme);
  }

  /**
   * Toggles between dark and light theme
   */
  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme();
    showToast(theme === "dark" ? t("settings.darkTitle") : t("settings.lightTitle"));
  }

  // ── Senior Mode ───────────────────────────────────────────────────────────
  /**
   * Applies senior mode state to document
   */
  function applySeniorMode() {
    document.documentElement.classList.toggle("senior-mode", seniorMode);
    const btn = document.getElementById("senior-mode-toggle");
    if (btn) {
      btn.classList.toggle("active-toggle", seniorMode);
      btn.setAttribute("aria-pressed", String(seniorMode));
      btn.title = seniorMode ? t("settings.seniorModeOn") : t("settings.seniorModeOff");
    }
    localStorage.setItem(STORAGE_SENIOR_MODE, String(seniorMode));
  }

  /**
   * Toggles senior mode on/off
   */
  function toggleSeniorMode() {
    seniorMode = !seniorMode;
    applySeniorMode();
    showToast(seniorMode ? t("settings.seniorModeEnabled") : t("settings.seniorModeDisabled"));
    if (currentView === "lesson") renderLesson(viewParams.lessonId);
  }

  // ── Language ──────────────────────────────────────────────────────────────
  /**
   * Sets application language
   * @param {string} newLang - Language code ("en" or "pt")
   */
  function setLang(newLang) {
    lang = newLang === "en" ? "en" : "pt";
    window.lang = lang; // Keep global lang in sync
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]').content = t("meta.description");
    applyStaticI18n();
    updateLangToggle();
    refreshCurrentView();
    showToast(t("toast.langChanged"));
  }

  /**
   * Toggles between Portuguese and English
   */
  function toggleLang() { setLang(lang === "pt" ? "en" : "pt"); }

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    const priceEl = document.getElementById("stat-price");
    if (priceEl) priceEl.textContent = t("price");
  }

  function updateLangToggle() {
    const btn   = document.getElementById("lang-toggle");
    const label = document.getElementById("lang-label");
    const flag  = btn?.querySelector(".lang-flag");
    if (label) label.textContent = t("lang.toggle");
    if (flag) flag.textContent = getCurrentLangKey() === "pt" ? "🇧🇷" : "🇺🇸";
  }


  // ── Utilities ─────────────────────────────────────────────────────────────
  // getCurrentLangKey and escapeHtml are now in utils.js and shared across the app

  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function highlightCode(html) {
    // Wrap <pre> blocks with a copy button and language detection
    return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_, code) => {
      const safe = code.trim();
      return `<div class="code-block">
        <button class="code-copy-btn" aria-label="Copy code" title="Copy">📋</button>
        <pre>${safe}</pre>
      </div>`;
    });
  }

  function attachCopyButtons(container) {
    container.querySelectorAll(".code-copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pre = btn.nextElementSibling;
        navigator.clipboard.writeText(pre.textContent).then(() => {
          btn.textContent = "✅";
          setTimeout(() => { btn.textContent = "📋"; }, 1500);
        }).catch(() => {
          btn.textContent = "❌";
          setTimeout(() => { btn.textContent = "📋"; }, 1500);
        });
      });
    });
  }

  // ── Progress helpers ──────────────────────────────────────────────────────
  function countLessons(track) {
    return track.courses.reduce((s, c) => s + c.lessons.length, 0);
  }

  function getTrackProgress(track) {
    const total = countLessons(track);
    const done  = track.courses.reduce((s, c) => s + c.lessons.filter((l) => progress[l.id]).length, 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function getGlobalProgress() {
    const all  = tracks.flatMap((tr) => tr.courses.flatMap((c) => c.lessons));
    const done = all.filter((l) => progress[l.id]).length;
    return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  }

  function getAllLessons() {
    const lessons = [];
    tracks.forEach((track) => {
      const lt = localizedTrack(track);
      track.courses.forEach((course) => {
        const lc = localizedCourse(course);
        course.lessons.forEach((lesson) => {
          lessons.push({ ...localizedLesson(lesson), trackId: track.id, trackTitle: lt.title, courseTitle: lc.title });
        });
      });
    });
    return lessons;
  }

  /**
   * Hides Discord banner and saves user preference
   */
  function hideDiscordBanner() {
    const banner = document.getElementById("discord-banner");
    if (banner) {
      banner.classList.add("hidden");
      localStorage.setItem(STORAGE_DISCORD_BANNER, "hidden");
    }
  }

  /**
   * Shows Discord banner if not hidden by user
   */
  function initDiscordBanner() {
    const banner = document.getElementById("discord-banner");
    if (banner) {
      const isHidden = localStorage.getItem(STORAGE_DISCORD_BANNER) === "hidden";
      if (isHidden) {
        banner.classList.add("hidden");
      }
      banner.querySelector(".discord-close").addEventListener("click", hideDiscordBanner);
    }
  }

  function findTrack(id) { return tracks.find((tr) => tr.id === id); }

  function findLesson(lessonId) {
    for (const track of tracks) {
      for (const course of track.courses) {
        const lesson = course.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          return {
            track: localizedTrack(track), course: localizedCourse(course), lesson: localizedLesson(lesson),
            rawTrack: track, rawCourse: course, rawLesson: lesson,
          };
        }
      }
    }
    return null;
  }


  // ── Achievements ──────────────────────────────────────────────────────────
  function checkAchievements() {
    const global     = getGlobalProgress();
    const passedAll  = Object.keys(quizzesPassed).length;
    const bookmarkCount = bookmarks.length;
    const unlockedIds = [];

    const rules = [
      { id: "first_lesson",    test: () => global.done >= 1 },
      { id: "ten_lessons",     test: () => global.done >= 10 },
      { id: "fifty_lessons",   test: () => global.done >= 50 },
      { id: "track_complete",  test: () => tracks.some((tr) => getTrackProgress(tr).pct === 100) },
      { id: "quiz_pass",       test: () => passedAll >= 1 },
      { id: "all_quizzes",     test: () => passedAll >= 9 },
      { id: "recruit_route",   test: () => {
        const starterTrack = findTrack("starter");
        return starterTrack ? getTrackProgress(starterTrack).pct === 100 : false;
      }},
      { id: "master_route",    test: () => {
        const leadTrack = findTrack("leadership");
        return leadTrack ? getTrackProgress(leadTrack).pct === 100 : false;
      }},
      { id: "bookworm",        test: () => bookmarkCount >= 5 },
      { id: "checklist_done",  test: () => {
        return Object.values(checklistState).some((arr) => Array.isArray(arr) && arr.length > 0);
      }},
    ];

    const prev = loadJson("testers-guild-unlocked-achievements", []);
    rules.forEach((rule) => {
      if (rule.test() && !prev.includes(rule.id)) {
        unlockedIds.push(rule.id);
        prev.push(rule.id);
      }
    });
    if (unlockedIds.length) {
      saveJson("testers-guild-unlocked-achievements", prev);
      unlockedIds.forEach((id) => {
        const ach = achievementsList.find((a) => a.id === id);
        if (ach) showToast(`${ach.icon} ${t("toast.achievementUnlocked")}: ${ach[lang]?.title || ach.pt.title}`);
      });
    }
    return prev;
  }

  function renderAchievements() {
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;
    const unlocked = loadJson("testers-guild-unlocked-achievements", []);
    grid.innerHTML = achievementsList.map((ach) => {
      const isUnlocked = unlocked.includes(ach.id);
      const data = ach[lang] || ach.pt;
      return `<div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}" title="${isUnlocked ? data.desc : "?"}">
        <div class="ach-icon">${isUnlocked ? ach.icon : "🔒"}</div>
        <div class="ach-title">${isUnlocked ? escapeHtml(data.title) : "???"}</div>
        <div class="ach-desc">${isUnlocked ? escapeHtml(data.desc) : t("achievements.lockedMessage")}</div>
      </div>`;
    }).join("");
  }


  // ── Persona & filters ─────────────────────────────────────────────────────
  // Map persona → audience filter
  const PERSONA_FILTER = {
    beginner:   "beginner",
    experienced: "intermediate",
    senior:     "senior",
  };

  function setPersona(p) {
    persona = p;
    localStorage.setItem(STORAGE_PERSONA, p);
    document.querySelectorAll(".persona-card").forEach((el) => {
      el.classList.toggle("active", el.dataset.persona === p);
    });
    // sync home filter chip with persona
    homeFilter = PERSONA_FILTER[p] || "all";
    showToast(t("toast.personaSaved"));
    if (currentView === "home") renderHome();
  }

  function isRecommended(trackId) {
    return (PERSONA_TRACKS[persona] || []).includes(trackId);
  }

  function sortTracksForPersona(list) {
    const order = PERSONA_TRACKS[persona] || [];
    return [...list].sort((a, b) => {
      const ai = order.indexOf(a.id), bi = order.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function navigate(view, params = {}) {
    currentView = view;
    viewParams  = params;
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    const viewEl = document.getElementById("view-" + view);
    if (viewEl) viewEl.classList.add("active");
    document.querySelectorAll(".nav-links a[data-nav]").forEach((a) => {
      const nav = a.dataset.nav;
      a.classList.toggle("active", nav === view || ((view === "track" || view === "lesson" || view === "quiz") && nav === "tracks"));
    });

    if      (view === "home")       renderHome();
    else if (view === "tracks")     renderTracksPage();
    else if (view === "roadmap")    renderRoadmap();
    else if (view === "glossary")   renderGlossary();
    else if (view === "labs")       renderLabs();
    else if (view === "track"  && params.trackId)  renderTrackDetail(params.trackId);
    else if (view === "lesson" && params.lessonId) renderLesson(params.lessonId);
    else if (view === "quiz"   && params.trackId)  renderQuiz(params.trackId);
    else if (view === "dashboard")  renderDashboard();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function refreshCurrentView() { navigate(currentView, viewParams); }


  // ── Track card ────────────────────────────────────────────────────────────
  function renderTrackCard(track, containerId, opts = {}) {
    const lt   = localizedTrack(track);
    const prog = getTrackProgress(track);
    const container = document.getElementById(containerId);
    if (!container) return;
    const rec      = opts.showRecommend && isRecommended(track.id);
    const audience = TRACK_AUDIENCE[track.id] || "intermediate";
    const isComplete = prog.pct === 100;

    const card = document.createElement("article");
    card.className = "track-card" + (rec ? " track-recommended" : "") + (isComplete ? " track-complete" : "");
    card.style.setProperty("--track-color", track.color);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <div class="track-card-header">
        <span class="track-icon">${track.icon}</span>
        <div class="track-badges">
          ${isComplete ? `<span class="badge-complete">✅ ${t("dashboard.complete")}</span>` : ""}
          ${rec && !isComplete ? `<span class="badge-rec">${t("track.recommended")}</span>` : ""}
          <span class="tier-badge tier-${audience}">${tierLabel(audience)}</span>
        </div>
      </div>
      <h3>${escapeHtml(lt.title)}</h3>
      <p>${escapeHtml(lt.description)}</p>
      <div class="track-meta">
        <span>📦 ${track.modules} ${t("track.modules")}</span>
        <span>⏱ ~${track.hours}${t("track.hours")}</span>
      </div>
      <div class="track-tags">${lt.topics.slice(0, 3).map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`).join("")}</div>
      <div class="track-progress">
        <div class="progress-bar"><div class="progress-fill" style="width:${prog.pct}%"></div></div>
        <div class="progress-text">${prog.done}/${prog.total} ${t("track.lessonsProgress")} ${isComplete ? "🎉" : ""}</div>
      </div>`;

    const open = () => navigate("track", { trackId: track.id });
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    container.appendChild(card);
  }

  // ── Continue banner ───────────────────────────────────────────────────────
  function renderContinueBanner() {
    const banner = document.getElementById("continue-banner");
    const lastId = getStorage(STORAGE_LAST_LESSON, "tg-qaway-last-lesson");
    if (!lastId) { banner.classList.add("hidden"); return; }
    const found = findLesson(lastId);
    if (!found) { banner.classList.add("hidden"); return; }
    banner.classList.remove("hidden");
    banner.innerHTML = `
      <div class="continue-inner">
        <div>
          <div class="continue-label">${t("dashboard.continueTitle")}</div>
          <div class="continue-lesson">${escapeHtml(found.lesson.title)}</div>
          <div class="continue-track">${found.track.icon} ${escapeHtml(found.track.title)}</div>
        </div>
        <button class="btn btn-primary" id="btn-continue">${t("dashboard.continueBtn")}</button>
      </div>`;
    document.getElementById("btn-continue").addEventListener("click", () => navigate("lesson", { lessonId: lastId }));
  }


  // ── Home ──────────────────────────────────────────────────────────────────
  function renderHomeFilterBar() {
    const bar = document.getElementById("home-filter-bar");
    if (!bar) return;
    const filters = ["all", "beginner", "intermediate", "senior"];
    bar.innerHTML = filters.map((f) =>
      `<button type="button" class="filter-chip ${homeFilter === f ? "active" : ""}" data-filter="${f}">${t("filter." + f)}</button>`
    ).join("");
    bar.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        homeFilter = btn.dataset.filter;
        renderHome();
      });
    });
  }

  function renderHome() {
    const global = getGlobalProgress();
    document.getElementById("stat-lessons").textContent = global.total;
    document.getElementById("stat-tracks").textContent  = tracks.length;
    document.querySelectorAll(".persona-card").forEach((el) => el.classList.toggle("active", el.dataset.persona === persona));

    renderHomeFilterBar();

    const filtered = homeFilter === "all"
      ? sortTracksForPersona(tracks)
      : tracks.filter((tr) => TRACK_AUDIENCE[tr.id] === homeFilter);

    const grid = document.getElementById("home-tracks-grid");
    grid.innerHTML = "";
    filtered.forEach((tr) => renderTrackCard(tr, "home-tracks-grid", { showRecommend: true }));
    renderContinueBanner();
  }

  // ── Tracks page ───────────────────────────────────────────────────────────
  function renderFilterBar() {
    const bar = document.getElementById("track-filter-bar");
    if (!bar) return;
    const filters = ["all", "beginner", "intermediate", "senior"];
    bar.innerHTML = filters.map((f) =>
      `<button type="button" class="filter-chip ${trackFilter === f ? "active" : ""}" data-filter="${f}">${t("filter." + f)}</button>`
    ).join("");
    bar.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        trackFilter = btn.dataset.filter;
        renderTracksPage();
      });
    });
  }

  function renderTracksPage() {
    renderFilterBar();
    const grid = document.getElementById("tracks-grid");
    grid.innerHTML = "";
    const filtered = trackFilter === "all"
      ? sortTracksForPersona(tracks)
      : tracks.filter((tr) => TRACK_AUDIENCE[tr.id] === trackFilter);
    filtered.forEach((tr) => renderTrackCard(tr, "tracks-grid", { showRecommend: true }));
  }

  // ── Roadmap ───────────────────────────────────────────────────────────────
  function renderRoadmap() {
    const container = document.getElementById("roadmap-content");
    const roadmaps  = window.TG_ROADMAPS || {};
    const routes    = [{ key: "beginner", icon: "🌱" }, { key: "senior", icon: "👑" }];
    container.innerHTML = routes.map(({ key, icon }) => {
      const data = roadmaps[key]?.[getCurrentLangKey()] || roadmaps[key]?.pt;
      if (!data) return "";
      const steps = data.steps.map((step, i) => `
        <div class="roadmap-step">
          <div class="roadmap-step-num">${i + 1}</div>
          <div class="roadmap-step-body">
            <strong>${escapeHtml(step.label)}</strong>
            <p class="roadmap-why"><em>${t("roadmap.why")}:</em> ${escapeHtml(step.why)}</p>
            <button type="button" class="btn btn-secondary btn-sm roadmap-go" data-track="${step.trackId}" data-lesson="${step.lessonId || ""}">${t("roadmap.start")}</button>
          </div>
        </div>`).join("");
      return `<article class="roadmap-card">
        <h3>${icon} ${escapeHtml(data.title)}</h3>
        <p>${escapeHtml(data.desc)}</p>
        <div class="roadmap-steps">${steps}</div>
      </article>`;
    }).join("");

    container.querySelectorAll(".roadmap-go").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.lesson) navigate("lesson", { lessonId: btn.dataset.lesson });
        else navigate("track", { trackId: btn.dataset.track });
      });
    });
  }

  // ── Glossary ──────────────────────────────────────────────────────────────
  function renderGlossary() {
    const items = (window.TG_GLOSSARY?.[getCurrentLangKey()]) || [];
    document.getElementById("glossary-content").innerHTML = items.map((item) => `
      <article class="glossary-card">
        <h3>${escapeHtml(item.term)}</h3>
        <p>${escapeHtml(item.def)}</p>
      </article>`).join("");
  }


  // ── Labs ──────────────────────────────────────────────────────────────────
  function renderLabs() {
    const container = document.getElementById("labs-content");
    if (!container) return;
    const labs = labsData[getCurrentLangKey()] || labsData.pt || [];
    if (!labs.length) {
      container.innerHTML = `<p class="empty-state">${t("labs.noLabs")}</p>`;
      return;
    }

    // Group by track
    const grouped = {};
    labs.forEach((lab) => {
      (lab.tracks || ["other"]).forEach((trackId) => {
        if (!grouped[trackId]) grouped[trackId] = [];
        grouped[trackId].push(lab);
      });
    });

    const typeColors = {
      "Web E2E": "#3b82f6", "Web": "#3b82f6", "API": "#8b5cf6",
      "Security": "#6366f1", "Performance": "#ef4444",
      "A11y": "#a855f7", "Mobile": "#f59e0b", "Web + API": "#10b981",
    };

    container.innerHTML = `<div class="labs-grid">${labs.map((lab) => `
      <article class="lab-card">
        <div class="lab-header">
          <span class="lab-type-badge" style="background:${typeColors[lab.type] || "#10b981"}22;color:${typeColors[lab.type] || "#10b981"};border-color:${typeColors[lab.type] || "#10b981"}44">${escapeHtml(lab.type)}</span>
          <div class="lab-track-tags">${(lab.tracks || []).map((tid) => {
            const tr = findTrack(tid);
            return tr ? `<span class="tag">${tr.icon} ${escapeHtml(localizedTrack(tr).title)}</span>` : "";
          }).join("")}</div>
        </div>
        <h3><a href="${escapeHtml(lab.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(lab.name)}</a></h3>
        <p>${escapeHtml(lab.desc)}</p>
        <a href="${escapeHtml(lab.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm lab-open-btn">
          ${t("labs.openLab")}
        </a>
      </article>`).join("")}</div>`;
  }


  // ── Quiz ──────────────────────────────────────────────────────────────────
  
  /**
   * Renders quiz questions HTML
   * @param {Array} questions - Array of quiz questions
   * @returns {string} HTML string for quiz questions
   */
  function renderQuizQuestions(questions) {
    return questions.map((q, qi) => `
      <div class="quiz-question" data-qi="${qi}">
        <p class="quiz-q-text"><strong>${qi + 1}.</strong> ${escapeHtml(q.q)}</p>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => `
            <label class="quiz-option" data-qi="${qi}" data-oi="${oi}">
              <input type="radio" name="q${qi}" value="${oi}" class="quiz-radio">
              <span class="quiz-option-text">${escapeHtml(opt)}</span>
            </label>`).join("")}
        </div>
        <div class="quiz-explain hidden" id="explain-${qi}"></div>
      </div>`).join("");
  }

  /**
   * Handles quiz submission and result display
   * @param {Object} quizData - Quiz data object
   * @param {string} trackId - Track identifier
   * @param {HTMLElement} container - Quiz container element
   */
  function handleQuizSubmit(quizData, trackId, container) {
    let correct = 0;
    quizData.questions.forEach((q, qi) => {
      const selected = quizState.answers[qi];
      const explainEl = document.getElementById(`explain-${qi}`);
      const qBlock    = container.querySelector(`.quiz-question[data-qi="${qi}"]`);

      // Highlight options
      qBlock.querySelectorAll(".quiz-option").forEach((lbl) => {
        const oi = parseInt(lbl.dataset.oi);
        lbl.classList.add(oi === q.correct ? "correct" : "wrong-opt");
        if (oi === selected) lbl.classList.add("selected-opt");
      });
      qBlock.querySelectorAll("input[type=radio]").forEach((r) => r.disabled = true);

      if (selected === q.correct) correct++;
      if (explainEl && q.explain) {
        explainEl.textContent = q.explain;
        explainEl.classList.remove("hidden");
      }
    });

    const passed = correct >= quizData.passScore;
    if (passed && !quizzesPassed[trackId]) {
      quizzesPassed[trackId] = { passedAt: new Date().toISOString(), score: correct };
      saveJson(STORAGE_QUIZZES, quizzesPassed);
      checkAchievements();
      showToast(t("toast.quizPassed"));
    }

    const resultEl = document.getElementById("quiz-result");
    resultEl.className = `quiz-result ${passed ? "quiz-passed" : "quiz-failed"}`;
    resultEl.innerHTML = `
      <div class="quiz-result-icon">${passed ? "🎯" : "📚"}</div>
      <div class="quiz-result-title">${passed ? t("quiz.passed") : t("quiz.failed")}</div>
      <div class="quiz-result-score">${t("quiz.score")}: ${correct}/${quizData.questions.length}</div>
      ${!passed ? `<button class="btn btn-primary btn-sm" id="btn-quiz-retry">${t("quiz.tryAgain")}</button>` : ""}`;
    resultEl.classList.remove("hidden");

    if (!passed) {
      document.getElementById("btn-quiz-retry")?.addEventListener("click", () => renderQuiz(trackId));
    }
  }

  /**
   * Sets up quiz event listeners
   * @param {string} trackId - Track identifier
   * @param {Object} quizData - Quiz data object
   * @param {HTMLElement} container - Quiz container element
   */
  function setupQuizEventListeners(trackId, quizData, container) {
    document.getElementById("btn-quiz-back").addEventListener("click", () => navigate("track", { trackId }));

    document.getElementById("quiz-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (quizState.submitted) return;
      quizState.submitted = true;
      handleQuizSubmit(quizData, trackId, container);
    });

    // Capture radio changes
    container.querySelectorAll(".quiz-radio").forEach((radio) => {
      radio.addEventListener("change", () => {
        const qi = parseInt(radio.closest(".quiz-option").dataset.qi);
        quizState.answers[qi] = parseInt(radio.value);
      });
    });
  }

  /**
   * Renders quiz interface for a track
   * @param {string} trackId - Track identifier
   */
  function renderQuiz(trackId) {
    const container = document.getElementById("quiz-content");
    if (!container) return;

    const track = findTrack(trackId);
    if (!track) return;

    const langKey  = getCurrentLangKey();
    const quizData = quizzes[trackId]?.[langKey] || quizzes[trackId]?.pt;
    if (!quizData) {
      container.innerHTML = `<p class="empty-state">${t("quiz.noQuiz")}</p>`;
      return;
    }

    const lt        = localizedTrack(track);
    const alreadyPassed = !!quizzesPassed[trackId];

    // Set breadcrumb
    const bc = document.getElementById("quiz-breadcrumb");
    if (bc) bc.textContent = lt.title;

    // Reset quiz state for this track
    quizState = { trackId, answers: {}, submitted: false };

    const questionsHtml = renderQuizQuestions(quizData.questions);

    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-track-header" style="border-left-color:${track.color}">
          <span class="track-icon">${track.icon}</span>
          <div>
            <h2>${escapeHtml(quizData.title)}</h2>
            <p class="quiz-meta">${quizData.questions.length} ${t("quiz.questions")} · ${t("quiz.pass")}: ${quizData.passScore}/${quizData.questions.length}</p>
          </div>
        </div>
        ${alreadyPassed ? `<div class="quiz-passed-banner">🎯 ${t("quiz.alreadyPassed")}</div>` : ""}
        <form id="quiz-form" class="quiz-form">
          ${questionsHtml}
          <div class="quiz-actions">
            <button type="submit" class="btn btn-primary">${t("quiz.submit")}</button>
            <button type="button" class="btn btn-secondary" id="btn-quiz-back">${t("quiz.backTrack")}</button>
          </div>
        </form>
        <div id="quiz-result" class="quiz-result hidden"></div>
      </div>`;

    setupQuizEventListeners(trackId, quizData, container);
  }


  // ── Checklist ─────────────────────────────────────────────────────────────
  function renderChecklist(trackId, container) {
    const langKey = getCurrentLangKey();
    const data    = checklists[trackId]?.[langKey] || checklists[trackId]?.pt;
    if (!data) return "";

    const savedItems = checklistState[trackId] || [];
    const allDone    = savedItems.length >= data.items.length;

    const itemsHtml = data.items.map((item, i) => {
      const checked = savedItems.includes(i);
      return `<label class="checklist-item ${checked ? "checked" : ""}">
        <input type="checkbox" class="checklist-check" data-track="${trackId}" data-idx="${i}" ${checked ? "checked" : ""}>
        <span>${escapeHtml(item)}</span>
      </label>`;
    }).join("");

    const html = `<div class="checklist-box" id="checklist-${trackId}">
      <div class="checklist-header">
        <h3>📋 ${escapeHtml(data.title)}</h3>
        <span class="checklist-progress" id="ck-progress-${trackId}">${savedItems.length}/${data.items.length} ${t("checklist.progress")}</span>
      </div>
      <div class="checklist-items">${itemsHtml}</div>
      ${allDone ? `<div class="checklist-complete">🎉 ${t("checklist.complete")}</div>` : ""}
    </div>`;

    if (container) {
      container.insertAdjacentHTML("beforeend", html);
      container.querySelectorAll(`.checklist-check[data-track="${trackId}"]`).forEach((cb) => {
        cb.addEventListener("change", () => {
          const idx = parseInt(cb.dataset.idx);
          if (!checklistState[trackId]) checklistState[trackId] = [];
          if (cb.checked) { if (!checklistState[trackId].includes(idx)) checklistState[trackId].push(idx); }
          else            { checklistState[trackId] = checklistState[trackId].filter((x) => x !== idx); }
          saveJson(STORAGE_CHECKLISTS, checklistState);
          const progressEl = document.getElementById(`ck-progress-${trackId}`);
          if (progressEl) progressEl.textContent = `${checklistState[trackId].length}/${data.items.length} ${t("checklist.progress")}`;
          cb.closest(".checklist-item").classList.toggle("checked", cb.checked);
          if (checklistState[trackId].length >= data.items.length) {
            checkAchievements();
            showToast(t("checklist.toastComplete"));
          }
        });
      });
    }
    return html;
  }


  // ── Track Detail ──────────────────────────────────────────────────────────
  function renderTrackDetail(trackId) {
    const raw = findTrack(trackId);
    if (!raw) return;
    const track = localizedTrack(raw);
    document.getElementById("track-breadcrumb").textContent = track.title;
    const prog = getTrackProgress(raw);
    const hasQuiz = !!quizzes[trackId];

    let coursesHtml = "";
    raw.courses.forEach((rawCourse, idx) => {
      const course      = localizedCourse(rawCourse);
      const lessonsHtml  = rawCourse.lessons.map((rawLesson) => {
        const lesson = localizedLesson(rawLesson);
        const enr    = getEnrichment(rawLesson.id);
        const done   = progress[rawLesson.id];
        return `<li class="lesson-item ${done ? "completed" : ""}" data-lesson="${rawLesson.id}" tabindex="0" role="button" aria-label="${escapeHtml(lesson.title)}">
          <div class="lesson-check">${done ? "✓" : ""}</div>
          <div class="lesson-info">
            <div class="lesson-title">${escapeHtml(lesson.title)}</div>
            <div class="lesson-duration">${escapeHtml(lesson.duration)} · <span class="tier-badge tier-${enr.tier}">${tierLabel(enr.tier)}</span></div>
          </div>
          <span class="lesson-unlock">${t("track.free")}</span>
        </li>`;
      }).join("");
      coursesHtml += `<div class="course-block"><div class="course-header"><span class="course-num">${idx + 1}</span>${escapeHtml(course.title)}</div><ul class="lesson-list">${lessonsHtml}</ul></div>`;
    });

    const quizBtn = hasQuiz
      ? `<button class="btn btn-secondary" id="btn-take-quiz">🎯 ${t("quiz.takeQuiz")}</button>`
      : "";

    document.getElementById("track-detail").innerHTML = `
      <div class="track-hero" style="--track-color:${raw.color};border-left-color:${raw.color}">
        <h1>${raw.icon} ${escapeHtml(track.title)}</h1>
        <p class="track-hero-desc">${escapeHtml(track.description)}</p>
        <div class="track-meta">
          <span>📦 ${raw.modules} ${t("track.modules")}</span>
          <span>⏱ ~${raw.hours} ${t("track.hoursLong")}</span>
          <span class="tier-badge tier-${TRACK_AUDIENCE[raw.id]}">${tierLabel(TRACK_AUDIENCE[raw.id])}</span>
        </div>
        <div class="progress-bar" style="margin-top:1rem;max-width:400px">
          <div class="progress-fill" style="width:${prog.pct}%;background:${raw.color}"></div>
        </div>
        <div class="progress-text">${prog.done}/${prog.total} ${t("track.lessonsDone")} ${prog.pct === 100 ? "🎉" : ""}</div>
        <div class="track-hero-actions" style="margin-top:1rem;display:flex;gap:0.75rem;flex-wrap:wrap">
          ${quizBtn}
        </div>
      </div>
      <div class="course-list">${coursesHtml}</div>`;

    document.querySelectorAll(".lesson-item").forEach((el) => {
      const open = () => navigate("lesson", { lessonId: el.dataset.lesson });
      el.addEventListener("click", open);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });

    document.getElementById("btn-take-quiz")?.addEventListener("click", () => navigate("quiz", { trackId }));
  }


  // ── Bookmarks ─────────────────────────────────────────────────────────────
  function toggleBookmark(lessonId) {
    const idx = bookmarks.indexOf(lessonId);
    if (idx === -1) {
      bookmarks.push(lessonId);
      showToast(t("toast.bookmarkAdded"));
    } else {
      bookmarks.splice(idx, 1);
      showToast(t("toast.bookmarkRemoved"));
    }
    saveJson(STORAGE_BOOKMARKS, bookmarks);
    checkAchievements();
  }

  // ── Lesson ────────────────────────────────────────────────────────────────
  
  /**
   * Renders lesson sidebar HTML
   * @param {Object} track - Track data
   * @param {Object} course - Course data
   * @param {Object} rawCourse - Raw course data
   * @param {Object} rawLesson - Raw lesson data
   * @returns {string} HTML string for sidebar
   */
  function renderLessonSidebar(track, course, rawCourse, rawLesson) {
    const sidebarLessons = rawCourse.lessons.map((rl) => {
      const ll = localizedLesson(rl);
      return `<li class="sidebar-lesson ${rl.id === rawLesson.id ? "active" : ""} ${progress[rl.id] ? "done" : ""}" data-lesson="${rl.id}" tabindex="0" role="button">${escapeHtml(ll.title)}</li>`;
    }).join("");

    return `
      <aside class="lesson-sidebar">
        <div class="sidebar-track">${track.icon} ${escapeHtml(track.title)}</div>
        <div class="sidebar-course">${escapeHtml(course.title)}</div>
        <ul class="sidebar-lessons">${sidebarLessons}</ul>
      </aside>`;
  }

  /**
   * Renders lesson content HTML
   * @param {Object} lesson - Lesson data
   * @param {Object} enr - Enrichment data
   * @param {Object} rawLesson - Raw lesson data
   * @param {boolean} done - Lesson completion status
   * @param {boolean} isBookmarked - Bookmark status
   * @param {string} langKey - Language key
   * @param {Object} prev - Previous lesson
   * @param {Object} next - Next lesson
   * @returns {string} HTML string for lesson content
   */
  function renderLessonContent(lesson, enr, rawLesson, done, isBookmarked, langKey, prev, next) {
    const primerText = !seniorMode ? (enr.primer?.[langKey] || enr.primer?.pt) : null;
    const seniorText = enr.seniorNote?.[langKey] || enr.seniorNote?.pt;

    const primerHtml = primerText
      ? `<aside class="lesson-box lesson-box-beginner"><h3>${t("lesson.primerTitle")}</h3><p>${escapeHtml(primerText)}</p></aside>` : "";
    const seniorHtml = seniorText
      ? `<aside class="lesson-box lesson-box-senior"><h3>${t("lesson.seniorTitle")}</h3><p>${escapeHtml(seniorText)}</p></aside>` : "";

    const resourcesHtml = rawLesson.resources?.length
      ? `<div class="lesson-resources"><h3>📎 ${t("lesson.resources")}</h3>${rawLesson.resources.map((r) =>
          `<a class="resource-link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">↗ ${escapeHtml(r.label)}</a>`
        ).join("")}</div>` : "";

    const processedContent = highlightCode(lesson.content);

    return `
      <article class="lesson-content">
        <div class="lesson-header-row">
          <h1>${escapeHtml(lesson.title)}</h1>
          <div style="display:flex;gap:0.5rem;align-items:center;flex-shrink:0">
            <span class="tier-badge tier-${enr.tier}">${tierLabel(enr.tier)}</span>
            <button class="btn-bookmark ${isBookmarked ? "bookmarked" : ""}" id="btn-bookmark" title="${isBookmarked ? t("lesson.unbookmark") : t("lesson.bookmark")}" aria-label="${isBookmarked ? t("lesson.unbookmark") : t("lesson.bookmark")}">
              ${isBookmarked ? "⭐" : "☆"}
            </button>
          </div>
        </div>
        <div class="lesson-meta-row">
          <span class="lesson-meta-item">⏱ ${escapeHtml(lesson.duration)}</span>
          <span class="lesson-meta-item">${done ? "✅ " + t("lesson.completed") : "📖 " + t("lesson.inProgress")}</span>
        </div>
        ${primerHtml}
        <div class="lesson-body">${processedContent}</div>
        ${seniorHtml}
        ${resourcesHtml}
        <div id="lesson-checklist-zone"></div>
        <div class="lesson-actions">
          <button class="btn btn-primary" id="btn-complete">${done ? t("lesson.unmarkComplete") : t("lesson.markComplete")}</button>
          ${prev ? `<button class="btn btn-secondary" id="btn-prev">${t("lesson.prev")}</button>` : ""}
          ${next ? `<button class="btn btn-secondary" id="btn-next">${t("lesson.next")}</button>` : ""}
        </div>
      </article>`;
  }

  /**
   * Sets up lesson event listeners
   * @param {string} lessonId - Lesson identifier
   * @param {Object} rawLesson - Raw lesson data
   * @param {Object} prev - Previous lesson
   * @param {Object} next - Next lesson
   */
  function setupLessonEventListeners(lessonId, rawLesson, prev, next) {
    document.getElementById("btn-bookmark").addEventListener("click", () => {
      toggleBookmark(rawLesson.id);
      renderLesson(lessonId);
    });

    document.getElementById("btn-complete").addEventListener("click", () => {
      if (progress[rawLesson.id]) { delete progress[rawLesson.id]; showToast(t("toast.lessonUndone")); }
      else { progress[rawLesson.id] = { completedAt: new Date().toISOString() }; showToast(t("toast.lessonDone")); }
      saveProgress();
      checkAchievements();
      renderLesson(lessonId);
    });

    if (prev) document.getElementById("btn-prev").addEventListener("click", () => navigate("lesson", { lessonId: prev.id }));
    if (next) document.getElementById("btn-next").addEventListener("click", () => navigate("lesson", { lessonId: next.id }));

    document.querySelectorAll(".sidebar-lesson").forEach((el) => {
      const open = () => navigate("lesson", { lessonId: el.dataset.lesson });
      el.addEventListener("click", open);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  /**
   * Checks if lesson is a final project lesson
   * @param {string} lessonId - Lesson identifier
   * @param {string} courseId - Course identifier
   * @returns {boolean} True if final project lesson
   */
  function isFinalProjectLesson(lessonId, courseId) {
    return lessonId.endsWith("-l1") &&
      (courseId === "s12" || courseId === "w10" || courseId === "a9" ||
       courseId === "m8"  || courseId === "p8"  || courseId === "sec6" ||
       courseId === "dev5"|| courseId === "a11y5"|| courseId === "lead4");
  }

  /**
   * Renders lesson interface
   * @param {string} lessonId - Lesson identifier
   */
  function renderLesson(lessonId) {
    const found = findLesson(lessonId);
    if (!found) return;
    const { track, course, lesson, rawTrack, rawCourse, rawLesson } = found;
    const done     = !!progress[rawLesson.id];
    const enr      = getEnrichment(rawLesson.id);
    const isBookmarked = bookmarks.includes(rawLesson.id);
    const langKey  = getCurrentLangKey();
    saveLastLesson(lessonId);

    document.getElementById("lesson-track-link").textContent = track.title;
    document.getElementById("lesson-track-link").onclick = (e) => { e.preventDefault(); navigate("track", { trackId: rawTrack.id }); };
    document.getElementById("lesson-breadcrumb").textContent = lesson.title;

    const allLessons = rawTrack.courses.flatMap((c) => c.lessons);
    const idx   = allLessons.findIndex((l) => l.id === rawLesson.id);
    const prev  = allLessons[idx - 1];
    const next  = allLessons[idx + 1];

    const sidebarHtml = renderLessonSidebar(track, course, rawCourse, rawLesson);
    const contentHtml = renderLessonContent(lesson, enr, rawLesson, done, isBookmarked, langKey, prev, next);

    document.getElementById("lesson-detail").innerHTML = `
      <div class="lesson-layout">
        ${sidebarHtml}
        ${contentHtml}
      </div>`;

    // Attach copy buttons to code blocks
    attachCopyButtons(document.getElementById("lesson-detail"));

    // Render checklist if final project lesson
    if (isFinalProjectLesson(rawLesson.id, rawCourse.id)) {
      const zone = document.getElementById("lesson-checklist-zone");
      renderChecklist(rawTrack.id, zone);
    }

    setupLessonEventListeners(lessonId, rawLesson, prev, next);
  }


  // ── Dashboard ─────────────────────────────────────────────────────────────
  /**
   * Exports user progress as JSON file
   */
  function exportProgress() {
    const data = {
      progress: progress,
      bookmarks: bookmarks,
      quizzesPassed: quizzesPassed,
      checklistState: checklistState,
      persona: persona,
      theme: theme,
      seniorMode: seniorMode,
      lang: lang,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `testers-guild-progress-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t("dashboard.exportSuccess"));
  }

  /**
   * Imports user progress from JSON file
   * @param {File} file - JSON file to import
   */
  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate data structure
        if (typeof data !== "object" || data === null) {
          throw new Error("Invalid data format");
        }

        // Import data with validation
        if (data.progress && typeof data.progress === "object") {
          progress = data.progress;
          localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress));
        }
        if (Array.isArray(data.bookmarks)) {
          bookmarks = data.bookmarks;
          window.saveJson(STORAGE_BOOKMARKS, bookmarks);
        }
        if (data.quizzesPassed && typeof data.quizzesPassed === "object") {
          quizzesPassed = data.quizzesPassed;
          window.saveJson(STORAGE_QUIZZES, quizzesPassed);
        }
        if (data.checklistState && typeof data.checklistState === "object") {
          checklistState = data.checklistState;
          window.saveJson(STORAGE_CHECKLISTS, checklistState);
        }
        if (data.persona && ["beginner", "experienced", "senior"].includes(data.persona)) {
          persona = data.persona;
          localStorage.setItem(STORAGE_PERSONA, persona);
        }
        if (data.theme && ["light", "dark"].includes(data.theme)) {
          theme = data.theme;
          localStorage.setItem(STORAGE_THEME, theme);
          applyTheme();
        }
        if (typeof data.seniorMode === "boolean") {
          seniorMode = data.seniorMode;
          localStorage.setItem(STORAGE_SENIOR_MODE, String(seniorMode));
          applySeniorMode();
        }
        if (data.lang && ["pt", "en"].includes(data.lang)) {
          lang = data.lang;
          window.lang = lang;
          localStorage.setItem(STORAGE_LANG, lang);
        }

        showToast(t("dashboard.importSuccess"));
        renderDashboard();
      } catch (error) {
        console.error("Import error:", error);
        showToast(t("dashboard.importError"));
      }
    };
    reader.readAsText(file);
  }

  function renderDashboard() {
    const global = getGlobalProgress();
    const passedCount = Object.keys(quizzesPassed).length;

    document.getElementById("dashboard-stats").innerHTML = `
      <div class="dash-card"><h3>${t("dashboard.lessonsCompleted")}</h3><div class="value">${global.done}/${global.total}</div></div>
      <div class="dash-card"><h3>${t("dashboard.overallProgress")}</h3>
        <div class="value">${global.pct}%</div>
        <div class="progress-bar" style="margin-top:0.5rem"><div class="progress-fill" style="width:${global.pct}%"></div></div>
      </div>
      <div class="dash-card"><h3>${t("dashboard.quizzesPassedLabel")}</h3><div class="value">${passedCount}/9</div></div>
      <div class="dash-card"><h3>${t("dashboard.totalCost")}</h3><div class="value">${t("price")}</div></div>`;

    renderAchievements();

    // Setup export/import buttons
    document.getElementById("btn-export-progress").addEventListener("click", exportProgress);
    document.getElementById("btn-import-progress").addEventListener("click", () => {
      document.getElementById("import-file-input").click();
    });
    document.getElementById("import-file-input").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        importProgress(e.target.files[0]);
        e.target.value = ""; // Reset file input
      }
    });

    const grid = document.getElementById("dashboard-tracks");
    grid.innerHTML = "";
    tracks.forEach((tr) => renderTrackCard(tr, "dashboard-tracks"));

    // Bookmarks section
    const bmSection = document.getElementById("dashboard-bookmarks");
    if (bmSection) {
      if (!bookmarks.length) {
        bmSection.innerHTML = `<p class="empty-state" style="padding:1rem;color:var(--text-muted)">${t("dashboard.noBookmarks")}</p>`;
      } else {
        bmSection.innerHTML = bookmarks.map((lid) => {
          const found = findLesson(lid);
          if (!found) return "";
          return `<button class="search-result-item" data-lesson="${lid}">
            <span class="search-result-title">⭐ ${escapeHtml(found.lesson.title)}</span>
            <span class="search-result-meta">${found.track.icon} ${escapeHtml(found.track.title)}</span>
          </button>`;
        }).join("");
        bmSection.querySelectorAll("[data-lesson]").forEach((btn) =>
          btn.addEventListener("click", () => navigate("lesson", { lessonId: btn.dataset.lesson }))
        );
      }
    }
  }

  // ── Search ────────────────────────────────────────────────────────────────
  function handleSearch(query) {
    const resultsEl = document.getElementById("search-results");
    const q = query.trim().toLowerCase();
    if (!q) { resultsEl.classList.add("hidden"); resultsEl.innerHTML = ""; return; }

    const lessonMatches = getAllLessons().filter((l) =>
      l.title.toLowerCase().includes(q) ||
      l.trackTitle.toLowerCase().includes(q) ||
      l.courseTitle.toLowerCase().includes(q)
    );

    const glossaryItems = (window.TG_GLOSSARY?.[getCurrentLangKey()]) || [];
    const glossaryMatches = glossaryItems.filter((g) =>
      g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q)
    );

    if (!lessonMatches.length && !glossaryMatches.length) {
      resultsEl.innerHTML = `<div class="search-empty">${t("dashboard.noResults")}</div>`;
      resultsEl.classList.remove("hidden");
      return;
    }

    const lessonHtml = lessonMatches.slice(0, 8).map((l) => `
      <button type="button" class="search-result-item" data-lesson="${l.id}">
        <span class="search-result-title">${escapeHtml(l.title)}</span>
        <span class="search-result-meta">${escapeHtml(l.trackTitle)} · ${escapeHtml(l.courseTitle)}</span>
      </button>`).join("");

    const glossaryHtml = glossaryMatches.slice(0, 3).map((g) => `
      <button type="button" class="search-result-item search-glossary-item" data-glossary="1">
        <span class="search-result-title">📖 ${escapeHtml(g.term)}</span>
        <span class="search-result-meta">${escapeHtml(g.def.substring(0, 80))}…</span>
      </button>`).join("");

    resultsEl.innerHTML = lessonHtml + glossaryHtml;
    resultsEl.classList.remove("hidden");

    resultsEl.querySelectorAll(".search-result-item[data-lesson]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("global-search").value = "";
        resultsEl.classList.add("hidden");
        navigate("lesson", { lessonId: btn.dataset.lesson });
      });
    });

    resultsEl.querySelectorAll(".search-glossary-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("global-search").value = "";
        resultsEl.classList.add("hidden");
        navigate("glossary");
      });
    });
  }


  // ── Event Listeners ───────────────────────────────────────────────────────
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => { e.preventDefault(); navigate(el.dataset.nav); });
  });

  document.querySelectorAll(".persona-card").forEach((el) => {
    el.addEventListener("click", () => setPersona(el.dataset.persona));
  });

  document.getElementById("lang-toggle").addEventListener("click", toggleLang);
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("senior-mode-toggle").addEventListener("click", toggleSeniorMode);

  document.getElementById("global-search").addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => handleSearch(document.getElementById("global-search").value), 200);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar-wrap"))
      document.getElementById("search-results").classList.add("hidden");
  });

  document.getElementById("btn-reset-progress")?.addEventListener("click", () => {
    if (confirm(t("dashboard.resetConfirm"))) {
      progress = {};
      saveProgress();
      localStorage.removeItem(STORAGE_LAST_LESSON);
      showToast(t("toast.progressReset"));
      refreshCurrentView();
      renderContinueBanner();
    }
  });

  // Keyboard shortcuts: ArrowLeft / ArrowRight to navigate lessons
  document.addEventListener("keydown", (e) => {
    if (currentView !== "lesson") return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const found = findLesson(viewParams.lessonId);
    if (!found) return;
    const allLessons = found.rawTrack.courses.flatMap((c) => c.lessons);
    const idx = allLessons.findIndex((l) => l.id === viewParams.lessonId);
    if (e.key === "ArrowRight" && allLessons[idx + 1]) navigate("lesson", { lessonId: allLessons[idx + 1].id });
    if (e.key === "ArrowLeft"  && allLessons[idx - 1]) navigate("lesson", { lessonId: allLessons[idx - 1].id });
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  // sync homeFilter with saved persona on load
  homeFilter = PERSONA_FILTER[persona] || "all";
  applyTheme();
  applySeniorMode();
  applyStaticI18n();
  updateLangToggle();
  checkAchievements();
  initDiscordBanner();
  renderHome();

})();
