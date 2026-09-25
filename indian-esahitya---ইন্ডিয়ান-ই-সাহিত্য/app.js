// app.js - Bharat e-Library Master Controller
// Enterprise Multi-Language, Cloud Firestore, Series & Chapter Architecture,
// Interactive Likes & 1-5 Star Ratings, Author Showcase, and Settings

const App = (() => {
  // Master State
  let currentView = 'view-library';
  let allSeries = [];
  let currentSeries = null;
  let currentChapters = [];
  let currentChapter = null;
  let activeCategory = 'all';
  let activeSort = 'latest';
  let currentFontSize = 'md';
  let currentFontStyle = 'sans';
  let currentTheme = 'dark';
  let authModalMode = 'login';
  let currentUser = null;
  let currentUserProfile = null;
  let activeWriterMode = 'new_series'; // 'new_series' | 'add_chapter'
  let userAuthoredSeries = [];

  // DOM Elements Cache
  const el = {
    toastContainer: document.getElementById('toast-container'),
    storiesContainer: document.getElementById('stories-container'),
    searchInput: document.getElementById('search-input'),
    authBtnLabel: document.getElementById('auth-btn-label'),
    headerLangCode: document.getElementById('header-lang-code'),
    authModal: document.getElementById('auth-modal'),
    authForm: document.getElementById('auth-form'),
    authErrorBanner: document.getElementById('auth-error-banner'),
    nameFieldGroup: document.getElementById('name-field-group'),
    authSubmitBtn: document.getElementById('auth-submit-btn'),
    modalTabLogin: document.getElementById('modal-tab-login'),
    modalTabSignup: document.getElementById('modal-tab-signup'),
    profileContainer: document.getElementById('profile-container'),
    profileEditModal: document.getElementById('profile-edit-modal'),
    editProfileName: document.getElementById('edit-profile-name'),
    editProfileAvatar: document.getElementById('edit-profile-avatar'),
    editProfileBio: document.getElementById('edit-profile-bio'),
    // Writer Elements
    btnModeNewSeries: document.getElementById('btn-mode-new-series'),
    btnModeAddChapter: document.getElementById('btn-mode-add-chapter'),
    groupExistingBook: document.getElementById('group-existing-book'),
    existingBookSelect: document.getElementById('existing-book-select'),
    groupNewBookFields: document.getElementById('group-new-book-fields'),
    storyTitle: document.getElementById('story-title'),
    storyDesc: document.getElementById('story-desc'),
    storyCategory: document.getElementById('story-category'),
    storyCoverImage: document.getElementById('story-cover-image'),
    storyAuthor: document.getElementById('story-author'),
    chapterNumberInput: document.getElementById('chapter-number-input'),
    chapterTitleInput: document.getElementById('chapter-title-input'),
    storyBody: document.getElementById('story-body'),
    writerWordCount: document.getElementById('writer-word-count'),
    writerReadTimeEst: document.getElementById('writer-read-time-est'),
    publishBtn: document.getElementById('publish-btn'),
    publishBtnText: document.getElementById('publish-btn-text'),
    // Reader Elements
    readerContainer: document.getElementById('reader-container'),
    readerCategory: document.getElementById('reader-category'),
    readerChapterSeq: document.getElementById('reader-chapter-seq'),
    readerSeriesParentTitle: document.getElementById('reader-series-parent-title'),
    readerTitle: document.getElementById('reader-title'),
    readerAuthorAvatarCol: document.getElementById('reader-author-avatar-col'),
    readerAuthor: document.getElementById('reader-author'),
    readerReadingTime: document.getElementById('reader-reading-time'),
    readerViews: document.getElementById('reader-views'),
    readerRatingSummary: document.getElementById('reader-rating-summary'),
    readerDate: document.getElementById('reader-date'),
    readerBody: document.getElementById('reader-body'),
    likeBtn: document.getElementById('like-btn'),
    likeBtnText: document.getElementById('like-btn-text'),
    ratingAverageDisplay: document.getElementById('rating-average-display'),
    userRatingStatus: document.getElementById('user-rating-status'),
    prevChapterBtn: document.getElementById('prev-chapter-btn'),
    nextChapterBtn: document.getElementById('next-chapter-btn'),
    readerChapterDropdown: document.getElementById('reader-chapter-dropdown'),
    // Table of Contents Modal
    seriesTocModal: document.getElementById('series-toc-modal'),
    tocSeriesCategory: document.getElementById('toc-series-category'),
    tocSeriesTitle: document.getElementById('toc-series-title'),
    tocSeriesDesc: document.getElementById('toc-series-desc'),
    tocAuthorRow: document.getElementById('toc-author-row'),
    tocChaptersCountBadge: document.getElementById('toc-chapters-count-badge'),
    tocChaptersList: document.getElementById('toc-chapters-list'),
    languagesGrid: document.getElementById('languages-grid')
  };

  // Helper escape
  const escapeHtml = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Toast Notification System (Strictly Zero Emojis)
  const showToast = (message, duration = 3200) => {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <span>${escapeHtml(message)}</span>
      <i class="fa-solid fa-xmark" style="cursor: pointer; margin-left: 10px; opacity: 0.7;" onclick="this.parentElement.remove()"></i>
    `;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // Date Formatter respecting active localization
  const formatDate = (isoOrTimestamp) => {
    try {
      const d = new Date(isoOrTimestamp);
      const lang = I18n.getLanguage();
      if (lang === 'bn') {
        const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
        return `${Storage.toLocalNumber(d.getDate(), 'bn')} ${months[d.getMonth()]}, ${Storage.toLocalNumber(d.getFullYear(), 'bn')}`;
      } else if (lang === 'hi' || lang === 'mr') {
        const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
        return `${Storage.toLocalNumber(d.getDate(), 'hi')} ${months[d.getMonth()]}, ${Storage.toLocalNumber(d.getFullYear(), 'hi')}`;
      }
      return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Average Rating Calculator
  const getAverageRating = (series) => {
    if (!series || !series.ratingCount || series.ratingCount === 0) return 0;
    return parseFloat((series.ratingTotal / series.ratingCount).toFixed(1));
  };

  // Apply Translations to DOM
  const applyTranslations = () => {
    const lang = I18n.getLanguage();
    if (el.headerLangCode) {
      el.headerLangCode.textContent = lang.toUpperCase();
    }

    const textMap = {
      'app-title-text': I18n.t('appName'),
      'app-tagline-text': I18n.t('appTagline'),
      'nav-label-home': I18n.t('navHome'),
      'nav-label-write': I18n.t('navWrite'),
      'nav-label-profile': I18n.t('navProfile'),
      'nav-label-settings': I18n.t('navSettings'),
      'hero-title': I18n.t('heroTitle'),
      'hero-sub': I18n.t('heroSub'),
      'writer-heading': I18n.t('writerHeading'),
      'writer-sub': I18n.t('writerSub'),
      'label-mode-new-series': I18n.t('writerTabNewSeries'),
      'label-mode-add-chapter': I18n.t('writerTabAddChapter'),
      'label-existing-book': I18n.t('fieldSeriesSelect'),
      'label-story-title': I18n.t('fieldTitle'),
      'label-story-desc': I18n.t('fieldSeriesDesc'),
      'label-story-category': I18n.t('fieldCategory'),
      'label-story-cover': I18n.t('fieldCoverImage'),
      'label-story-author': I18n.t('fieldAuthor'),
      'label-chapter-number': I18n.t('fieldChapterNumber'),
      'label-chapter-title': I18n.t('fieldChapterTitle'),
      'label-chapter-content': I18n.t('fieldChapterContent'),
      'publish-btn-text': I18n.t('publishBtn'),
      'back-to-lib-text': I18n.t('backToLib'),
      'reader-toc-label': I18n.t('tableOfContents'),
      'prev-chapter-label': I18n.t('prevChapter'),
      'next-chapter-label': I18n.t('nextChapter'),
      'reader-rate-label': I18n.t('ratingPrompt'),
      'settings-title': I18n.t('settingsTitle'),
      'settings-lang-heading': I18n.t('settingsLanguageTitle'),
      'settings-lang-sub': I18n.t('settingsLanguageSub'),
      'settings-reading-heading': I18n.t('settingsReadingTitle'),
      'font-size-label': I18n.t('fontSizeLabel'),
      'font-style-label': I18n.t('fontStyleLabel'),
      'theme-label': I18n.t('readingThemeLabel'),
      'settings-account-heading': I18n.t('settingsAccountTitle'),
      'clear-cache-text': I18n.t('clearCacheBtn'),
      'settings-notif-heading': I18n.t('settingsNotificationsTitle'),
      'notif-chapters-label': I18n.t('notifNewChapters'),
      'notif-author-label': I18n.t('notifAuthorUpdates'),
      'settings-about-heading': I18n.t('settingsAboutTitle'),
      'version-text': I18n.t('versionText'),
      'privacy-btn-text': I18n.t('privacyBtn'),
      'terms-btn-text': I18n.t('termsBtn'),
      'licenses-btn-text': I18n.t('licensesBtn')
    };

    for (const [id, val] of Object.entries(textMap)) {
      const node = document.getElementById(id);
      if (node) node.textContent = val;
    }

    // Placeholders
    if (el.searchInput) el.searchInput.placeholder = I18n.t('searchPlaceholder');
    if (el.storyTitle) el.storyTitle.placeholder = I18n.t('fieldTitlePh');
    if (el.storyDesc) el.storyDesc.placeholder = I18n.t('fieldSeriesDescPh');
    if (el.storyAuthor) el.storyAuthor.placeholder = I18n.t('fieldAuthorPh');
    if (el.chapterTitleInput) el.chapterTitleInput.placeholder = I18n.t('fieldChapterTitlePh');
    if (el.storyBody) el.storyBody.placeholder = I18n.t('fieldBodyPh');

    // Auth button label
    if (el.authBtnLabel) {
      if (currentUser) {
        el.authBtnLabel.textContent = currentUser.displayName ? currentUser.displayName.split(' ')[0] : I18n.t('navProfile');
      } else {
        el.authBtnLabel.textContent = I18n.t('authLoginTab');
      }
    }

    renderLanguagesGrid();
  };

  // Switch Screen View
  const switchTab = (viewId) => {
    currentView = viewId;

    document.querySelectorAll('.view').forEach((view) => {
      view.classList.remove('active');
    });
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach((item) => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (viewId === 'view-library') {
      renderLibrarySeries();
    } else if (viewId === 'view-profile') {
      renderProfileView();
    } else if (viewId === 'view-writer') {
      setupWriterScreen();
    } else if (viewId === 'view-settings') {
      renderLanguagesGrid();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Language Selection Grid
  const renderLanguagesGrid = () => {
    if (!el.languagesGrid) return;
    const current = I18n.getLanguage();

    let html = '';
    I18n.LANGUAGES.forEach((lang) => {
      const isActive = lang.code === current;
      html += `
        <button class="lang-card-btn ${isActive ? 'active' : ''}" onclick="App.handleLanguageChange('${lang.code}')">
          <span class="lang-native-text">${escapeHtml(lang.native)}</span>
          <span class="lang-name-text">${escapeHtml(lang.name)} · ${escapeHtml(lang.region)}</span>
        </button>
      `;
    });

    el.languagesGrid.innerHTML = html;
  };

  // Instant Language Switch
  const handleLanguageChange = (langCode) => {
    I18n.setLanguage(langCode);
    applyTranslations();
    renderLibrarySeries();
    if (currentView === 'view-profile') {
      renderProfileView();
    }
    if (currentView === 'view-reader' && currentSeries && currentChapter) {
      populateReaderUI();
    }
    showToast(`Language switched to ${I18n.LANGUAGES.find((l) => l.code === langCode)?.name || langCode}`);
  };

  // Reading Theme & Typography Settings
  const setTheme = (theme) => {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('bharat_elibrary_theme', theme);

    document.querySelectorAll('[data-theme]').forEach((btn) => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const setReadingFontSize = (size) => {
    currentFontSize = size;
    document.body.setAttribute('data-font-size', size);
    localStorage.setItem('bharat_elibrary_font_size', size);

    if (el.readerBody) {
      if (size === 'sm') el.readerBody.style.fontSize = '15px';
      else if (size === 'md') el.readerBody.style.fontSize = '17px';
      else if (size === 'lg') el.readerBody.style.fontSize = '20px';
      else if (size === 'xl') el.readerBody.style.fontSize = '23px';
    }

    document.querySelectorAll('[data-size]').forEach((btn) => {
      if (btn.getAttribute('data-size') === size) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const setReadingFontStyle = (font) => {
    currentFontStyle = font;
    document.body.setAttribute('data-font-style', font);
    localStorage.setItem('bharat_elibrary_font_style', font);

    document.querySelectorAll('[data-font]').forEach((btn) => {
      if (btn.getAttribute('data-font') === font) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const changeFontSize = (delta) => {
    const sizes = ['sm', 'md', 'lg', 'xl'];
    let idx = sizes.indexOf(currentFontSize);
    idx = Math.min(sizes.length - 1, Math.max(0, idx + delta));
    setReadingFontSize(sizes[idx]);
  };

  // ==========================================
  // LIBRARY VIEW & SERIES LISTING
  // ==========================================
  const loadSeries = async () => {
    if (el.storiesContainer) {
      el.storiesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>${escapeHtml(I18n.t('loadingStories'))}</p>
        </div>
      `;
    }

    allSeries = await Storage.fetchSeries();
    renderLibrarySeries();
  };

  const renderLibrarySeries = () => {
    if (!el.storiesContainer) return;
    const query = el.searchInput ? el.searchInput.value.trim().toLowerCase() : '';
    const lang = I18n.getLanguage();

    let filtered = allSeries.filter((series) => {
      const matchCat = activeCategory === 'all' || series.category === activeCategory;
      const matchQuery =
        !query ||
        (series.title && series.title.toLowerCase().includes(query)) ||
        (series.description && series.description.toLowerCase().includes(query)) ||
        (series.authorName && series.authorName.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (activeSort === 'rating') {
        return getAverageRating(b) - getAverageRating(a);
      } else if (activeSort === 'likes') {
        return (b.likes || 0) - (a.likes || 0);
      } else if (activeSort === 'views') {
        return (b.views || 0) - (a.views || 0);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    if (filtered.length === 0) {
      el.storiesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-folder-open"></i>
          <p>${escapeHtml(I18n.t('emptyLibrary'))}</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach((series, idx) => {
      const avgRating = getAverageRating(series);
      const totalChaps = series.totalChapters || 1;
      const initials = Storage.getAuthorInitials(series.authorName || 'Author');
      const snippet = series.description ? series.description.substring(0, 140) + '...' : '';

      // Author Avatar HTML (image with fallback initials)
      const avatarHtml = series.authorPhotoUrl
        ? `<img src="${escapeHtml(series.authorPhotoUrl)}" alt="${escapeHtml(series.authorName)}" class="card-author-avatar-img" onerror="this.outerHTML='<div class=\\'card-author-initials\\'>${initials}</div>'">`
        : `<div class="card-author-initials">${initials}</div>`;

      html += `
        <article class="glass-card story-card" onclick="App.openSeries('${series.id}')">
          <div class="story-card-top-row">
            <span class="category-tag">${escapeHtml(series.category || 'Literature')}</span>
            <span class="series-badge">
              <i class="fa-solid fa-layer-group"></i>
              ${Storage.toLocalNumber(totalChaps, lang)} ${I18n.t('chaptersCount')}
            </span>
          </div>

          <h3 class="story-title">${escapeHtml(series.title)}</h3>
          <p class="story-snippet">${escapeHtml(snippet)}</p>

          <!-- Author and Reading Time Row -->
          <div class="story-card-author-row">
            ${avatarHtml}
            <div style="flex: 1; min-width: 0;">
              <span class="author-name" style="font-size: 0.85rem; font-weight: 600;">
                ${escapeHtml(series.authorName || 'Author')}
              </span>
            </div>
            <span class="card-reading-time">
              <i class="fa-regular fa-calendar"></i>
              ${formatDate(series.createdAt)}
            </span>
          </div>

          <div class="story-meta-row">
            <span style="font-size: 0.78rem; color: var(--text-dim);">
              <i class="fa-regular fa-clock"></i> ~${Storage.toLocalNumber(totalChaps * 4, lang)} ${I18n.t('readingTime')}
            </span>

            <div class="metrics-group">
              <span class="metric-item star-metric" title="Average Rating">
                <i class="fa-solid fa-star"></i>
                <span>${Storage.toLocalNumber(avgRating > 0 ? avgRating : '0.0', lang)}</span>
              </span>

              <span class="metric-item like-metric" title="Likes">
                <i class="fa-solid fa-heart"></i>
                <span>${Storage.toLocalNumber(series.likes || 0, lang)}</span>
              </span>

              <span class="metric-item" title="Reads">
                <i class="fa-regular fa-eye"></i>
                <span>${Storage.toLocalNumber(series.views || 0, lang)}</span>
              </span>
            </div>
          </div>
        </article>
      `;

      // Insert clean Native Ad Banner every 3 stories in library list
      if (idx === 1 || idx === 4) {
        html += `
          <div class="ad-placeholder-box" style="margin: 6px 0 16px;">
            <div class="ad-header-row">
              <span class="ad-label"><i class="fa-solid fa-rectangle-ad"></i> ${I18n.t('sponsoredAd')}</span>
              <span class="ad-sublabel">Sponsored Placement</span>
            </div>
            <div class="ad-banner-slot">
              <div class="ad-banner-inner">
                <div class="ad-banner-graphic" style="background: linear-gradient(135deg, #0284c7, #2563eb);">
                  <i class="fa-solid fa-feather"></i>
                </div>
                <div class="ad-banner-copy">
                  <strong>Indian Literary Fellowship & Young Writers Residency</strong>
                  <p>Submit your multi-chapter novellas and research literature for publishing grants.</p>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    });

    el.storiesContainer.innerHTML = html;
  };

  // ==========================================
  // READER VIEW & CHAPTERS NAVIGATION
  // ==========================================
  const openSeries = async (seriesId, targetChapterNumber = 1) => {
    const series = allSeries.find((s) => s.id === seriesId);
    if (!series) return;

    currentSeries = series;

    // Fetch all chapters chronologically
    currentChapters = await Storage.fetchChaptersForSeries(seriesId);

    // If no chapters found in DB yet, create a default chapter from series
    if (currentChapters.length === 0) {
      currentChapters = [{
        id: 'chap_' + series.id + '_1',
        seriesId: series.id,
        chapterNumber: 1,
        chapterTitle: series.title,
        content: series.description || 'Welcome to this story. Stay tuned for chapters.',
        readingTimeMin: 3,
        authorUid: series.authorId,
        authorName: series.authorName,
        views: series.views || 0,
        createdAt: series.createdAt
      }];
    }

    // Select target chapter
    let target = currentChapters.find((c) => c.chapterNumber === targetChapterNumber);
    if (!target) target = currentChapters[0];
    currentChapter = target;

    // Switch to Reader View
    switchTab('view-reader');

    // Populate Reader Interface
    populateReaderUI();

    // Increment series view in Cloud Firestore & cache
    Storage.incrementView(series.id);
    series.views = (series.views || 0) + 1;
    if (currentChapter && currentChapter.id) {
      Storage.incrementChapterView(currentChapter.id);
    }
  };

  const populateReaderUI = () => {
    if (!currentSeries || !currentChapter) return;
    const lang = I18n.getLanguage();

    // Category and chapter badge
    el.readerCategory.textContent = currentSeries.category || 'Literature';
    const totalCount = currentChapters.length;
    el.readerChapterSeq.textContent = `Chapter ${Storage.toLocalNumber(currentChapter.chapterNumber, lang)} of ${Storage.toLocalNumber(totalCount, lang)}`;
    el.readerSeriesParentTitle.textContent = currentSeries.title;
    el.readerTitle.textContent = currentChapter.chapterTitle || `Chapter ${currentChapter.chapterNumber}`;

    // Author Details & Avatar Display
    el.readerAuthor.textContent = currentSeries.authorName || currentChapter.authorName || 'Author';
    const initials = Storage.getAuthorInitials(currentSeries.authorName || 'Author');

    if (currentSeries.authorPhotoUrl) {
      el.readerAuthorAvatarCol.innerHTML = `
        <img src="${escapeHtml(currentSeries.authorPhotoUrl)}" alt="${escapeHtml(currentSeries.authorName)}" class="author-avatar-img" onerror="this.outerHTML='<div class=\\'profile-initials-box sm-avatar\\'>${initials}</div>'">
      `;
    } else {
      el.readerAuthorAvatarCol.innerHTML = `<div class="profile-initials-box sm-avatar">${initials}</div>`;
    }

    // Estimated Reading Time for this Chapter
    const readMin = currentChapter.readingTimeMin || Storage.calculateReadingTime(currentChapter.content);
    el.readerReadingTime.textContent = `${Storage.toLocalNumber(readMin, lang)} ${I18n.t('readingTime')}`;
    el.readerViews.textContent = `${Storage.toLocalNumber(currentSeries.views || 0, lang)} ${I18n.t('viewsText')}`;
    el.readerDate.textContent = formatDate(currentChapter.createdAt || currentSeries.createdAt);

    const avgRating = getAverageRating(currentSeries);
    el.readerRatingSummary.textContent = `${Storage.toLocalNumber(avgRating > 0 ? avgRating : '0.0', lang)} (${Storage.toLocalNumber(currentSeries.ratingCount || 0, lang)})`;

    // Chapter body text (with anti-copy protection)
    el.readerBody.textContent = currentChapter.content;
    setReadingFontSize(currentFontSize);

    // Anti-Copy Restrictions
    el.readerContainer.oncontextmenu = (e) => {
      e.preventDefault();
      showToast(I18n.t('antiCopyNotice'));
      return false;
    };
    el.readerContainer.oncopy = (e) => {
      e.preventDefault();
      showToast(I18n.t('antiCopyNotice'));
      return false;
    };

    // Update Chapter Navigation Controls
    updateChapterNavigationUI();

    // Update Interactive Like Button
    updateLikeButtonUI();

    // Update Interactive Rating Section
    updateRatingSectionUI();
  };

  const updateChapterNavigationUI = () => {
    if (!currentChapter || !currentChapters.length) return;
    const currentNum = currentChapter.chapterNumber;
    const total = currentChapters.length;
    const lang = I18n.getLanguage();

    // Prev Button
    if (el.prevChapterBtn) {
      el.prevChapterBtn.disabled = currentNum <= 1;
      el.prevChapterBtn.style.opacity = currentNum <= 1 ? '0.4' : '1';
    }

    // Next Button
    if (el.nextChapterBtn) {
      el.nextChapterBtn.disabled = currentNum >= total;
      el.nextChapterBtn.style.opacity = currentNum >= total ? '0.4' : '1';
    }

    // Chapter Dropdown Selector
    if (el.readerChapterDropdown) {
      let optionsHtml = '';
      currentChapters.forEach((ch) => {
        const isSelected = ch.chapterNumber === currentNum;
        optionsHtml += `
          <option value="${ch.chapterNumber}" ${isSelected ? 'selected' : ''}>
            Ch. ${Storage.toLocalNumber(ch.chapterNumber, lang)}: ${escapeHtml(ch.chapterTitle)}
          </option>
        `;
      });
      el.readerChapterDropdown.innerHTML = optionsHtml;
    }
  };

  // Jump to Adjacent Chapter (Previous or Next)
  const goToAdjacentChapter = (delta) => {
    if (!currentChapter || !currentChapters.length) return;
    const targetNum = currentChapter.chapterNumber + delta;
    const target = currentChapters.find((c) => c.chapterNumber === targetNum);
    if (target) {
      currentChapter = target;
      populateReaderUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      Storage.incrementChapterView(target.id);
    }
  };

  // Chapter Dropdown Change handler
  const handleChapterDropdownChange = (val) => {
    const num = parseInt(val, 10);
    const target = currentChapters.find((c) => c.chapterNumber === num);
    if (target) {
      currentChapter = target;
      populateReaderUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      Storage.incrementChapterView(target.id);
    }
  };

  const handleBackFromReader = () => {
    switchTab('view-library');
  };

  // ==========================================
  // TABLE OF CONTENTS (TOC) MODAL
  // ==========================================
  const openTableOfContentsModal = () => {
    if (!currentSeries || !el.seriesTocModal) return;
    const lang = I18n.getLanguage();

    el.tocSeriesCategory.textContent = currentSeries.category || 'Literature';
    el.tocSeriesTitle.textContent = currentSeries.title;
    el.tocSeriesDesc.textContent = currentSeries.description || '';
    el.tocChaptersCountBadge.textContent = `${Storage.toLocalNumber(currentChapters.length, lang)} ${I18n.t('chaptersCount')}`;

    const initials = Storage.getAuthorInitials(currentSeries.authorName || 'Author');
    el.tocAuthorRow.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        ${
          currentSeries.authorPhotoUrl
            ? `<img src="${escapeHtml(currentSeries.authorPhotoUrl)}" alt="${escapeHtml(currentSeries.authorName)}" class="card-author-avatar-img">`
            : `<div class="card-author-initials">${initials}</div>`
        }
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${escapeHtml(currentSeries.authorName || 'Author')}</span>
      </div>
    `;

    let chaptersHtml = '';
    currentChapters.forEach((ch) => {
      const isCurrent = currentChapter && currentChapter.chapterNumber === ch.chapterNumber;
      const readMin = ch.readingTimeMin || Storage.calculateReadingTime(ch.content);
      chaptersHtml += `
        <div class="toc-chapter-item ${isCurrent ? 'active' : ''}" onclick="App.selectChapterFromToc(${ch.chapterNumber})">
          <div style="display: flex; align-items: center;">
            <span class="toc-chapter-num">Ch. ${Storage.toLocalNumber(ch.chapterNumber, lang)}</span>
            <span class="toc-chapter-name">${escapeHtml(ch.chapterTitle)}</span>
          </div>
          <span style="font-size: 0.74rem; color: var(--text-dim);">
            <i class="fa-regular fa-clock"></i> ${Storage.toLocalNumber(readMin, lang)} ${I18n.t('readingTime')}
          </span>
        </div>
      `;
    });

    el.tocChaptersList.innerHTML = chaptersHtml;
    el.seriesTocModal.classList.add('show');
  };

  const closeTableOfContentsModal = () => {
    if (el.seriesTocModal) {
      el.seriesTocModal.classList.remove('show');
    }
  };

  const selectChapterFromToc = (chapterNum) => {
    closeTableOfContentsModal();
    const target = currentChapters.find((c) => c.chapterNumber === chapterNum);
    if (target) {
      currentChapter = target;
      populateReaderUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ==========================================
  // INTERACTIVE LIKE SYSTEM (TOGGLE LIKE / UNLIKE)
  // ==========================================
  const updateLikeButtonUI = () => {
    if (!currentSeries || !el.likeBtn) return;
    const isLiked = Storage.isItemLiked(currentSeries.id);
    const lang = I18n.getLanguage();

    el.likeBtnText.textContent = `${I18n.t('likesText')} ${Storage.toLocalNumber(currentSeries.likes || 0, lang)}`;

    if (isLiked) {
      el.likeBtn.classList.add('liked');
    } else {
      el.likeBtn.classList.remove('liked');
    }
  };

  const handleLikeToggle = async () => {
    if (!currentSeries) return;

    const res = await Storage.toggleLike(currentSeries.id);
    currentSeries.likes = Math.max(0, (currentSeries.likes || 0) + res.countDelta);

    updateLikeButtonUI();
    showToast(I18n.t(res.liked ? 'likeAdded' : 'likeRemoved'));

    // Re-render library in background so cards match
    renderLibrarySeries();
  };

  // ==========================================
  // INTERACTIVE STAR RATING SYSTEM (1 to 5)
  // ==========================================
  const updateRatingSectionUI = () => {
    if (!currentSeries) return;
    const lang = I18n.getLanguage();
    const avg = getAverageRating(currentSeries);
    const count = currentSeries.ratingCount || 0;
    el.ratingAverageDisplay.textContent = `Avg: ${Storage.toLocalNumber(avg > 0 ? avg : '0.0', lang)} / 5 (${Storage.toLocalNumber(count, lang)} ${I18n.t('ratedBy')})`;

    const userRating = Storage.getUserRating(currentSeries.id);

    document.querySelectorAll('.star-btn').forEach((btn) => {
      const val = parseInt(btn.getAttribute('data-star'), 10);
      if (userRating && val <= userRating) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (userRating > 0) {
      el.userRatingStatus.textContent = `${I18n.t('userRatedBadge')}: ${Storage.toLocalNumber(userRating, lang)} Stars (Click any star to update)`;
    } else {
      el.userRatingStatus.textContent = I18n.t('ratingPrompt');
    }
  };

  const handleRatingClick = async (stars) => {
    if (!currentSeries) return;

    const res = await Storage.submitRating(currentSeries.id, stars);

    updateRatingSectionUI();
    const newAvg = getAverageRating(currentSeries);
    const lang = I18n.getLanguage();
    el.readerRatingSummary.textContent = `${Storage.toLocalNumber(newAvg, lang)} (${Storage.toLocalNumber(currentSeries.ratingCount, lang)})`;

    showToast(I18n.t(res.isNew ? 'ratingSubmitted' : 'ratingUpdated'));

    // Sync library cards
    renderLibrarySeries();
  };

  // ==========================================
  // WRITER VIEW (NEW BOOK OR ADD CHAPTER)
  // ==========================================
  const setupWriterScreen = async () => {
    if (currentUser) {
      if (el.storyAuthor && !el.storyAuthor.value) {
        el.storyAuthor.value = currentUser.displayName || 'Author';
      }
      userAuthoredSeries = await Storage.fetchUserSeries(currentUser.uid);
      populateExistingBookSelect();
    }
    updateWriterWordCount();
  };

  const setWriterMode = (mode) => {
    activeWriterMode = mode;

    if (mode === 'new_series') {
      el.btnModeNewSeries.classList.add('active');
      el.btnModeAddChapter.classList.remove('active');
      el.groupExistingBook.style.display = 'none';
      el.groupNewBookFields.style.display = 'block';
      el.chapterNumberInput.value = 1;
      el.chapterTitleInput.placeholder = 'e.g. Chapter 1: The Beginning';
    } else {
      el.btnModeNewSeries.classList.remove('active');
      el.btnModeAddChapter.classList.add('active');
      el.groupExistingBook.style.display = 'block';
      el.groupNewBookFields.style.display = 'none';

      populateExistingBookSelect();
      handleExistingBookChange();
    }
  };

  const populateExistingBookSelect = () => {
    if (!el.existingBookSelect) return;
    const lang = I18n.getLanguage();

    if (!userAuthoredSeries.length) {
      el.existingBookSelect.innerHTML = `<option value="">-- No books created yet --</option>`;
      return;
    }

    let optionsHtml = `<option value="">-- Select your book to add a chapter --</option>`;
    userAuthoredSeries.forEach((b) => {
      const chCount = b.totalChapters || 1;
      optionsHtml += `
        <option value="${b.id}">
          ${escapeHtml(b.title)} (${Storage.toLocalNumber(chCount, lang)} Chapters published)
        </option>
      `;
    });
    el.existingBookSelect.innerHTML = optionsHtml;
  };

  const handleExistingBookChange = () => {
    const selectedId = el.existingBookSelect.value;
    if (!selectedId) {
      el.chapterNumberInput.value = 2;
      return;
    }

    const b = userAuthoredSeries.find((item) => item.id === selectedId);
    if (b) {
      const nextNum = (b.totalChapters || 1) + 1;
      el.chapterNumberInput.value = nextNum;
      el.chapterTitleInput.placeholder = `e.g. Chapter ${nextNum}: The Next Phase`;
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast(I18n.t('loginRequired'));
      openAuthModal('login');
      return;
    }

    const authorName = el.storyAuthor.value.trim() || currentUser.displayName || 'Author';
    const content = el.storyBody.value.trim();
    const chapterTitle = el.chapterTitleInput.value.trim();
    const chapterNumber = parseInt(el.chapterNumberInput.value, 10) || 1;

    if (!content) {
      showToast(I18n.t('fillRequired'));
      return;
    }

    el.publishBtn.disabled = true;
    el.publishBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${escapeHtml(I18n.t('publishing'))}</span>`;

    try {
      if (activeWriterMode === 'new_series') {
        // Option A: Start a New Story / Book
        const title = el.storyTitle.value.trim();
        const description = el.storyDesc.value.trim();
        const category = el.storyCategory.value;
        const coverImage = el.storyCoverImage.value.trim();

        if (!title) {
          showToast('Please enter a book or story title.');
          el.publishBtn.disabled = false;
          el.publishBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> <span>${escapeHtml(I18n.t('publishBtn'))}</span>`;
          return;
        }

        const result = await Storage.createSeriesWithChapter({
          title,
          description,
          category,
          coverImage,
          language: I18n.getLanguage(),
          chapterTitle: chapterTitle || 'Chapter 1',
          content,
          authorName,
          authorPhotoUrl: (currentUserProfile && currentUserProfile.avatar) || ''
        });

        // Reset form
        el.storyTitle.value = '';
        el.storyDesc.value = '';
        el.storyBody.value = '';
        el.chapterTitleInput.value = '';

        allSeries = await Storage.fetchSeries();
        showToast(I18n.t('publishSuccess'));

        // Open newly created book in Reader view!
        openSeries(result.series.id, 1);
      } else {
        // Option B: Add Chapter to Existing Story
        const seriesId = el.existingBookSelect.value;
        if (!seriesId) {
          showToast('Please select a book to add this chapter to.');
          el.publishBtn.disabled = false;
          el.publishBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> <span>${escapeHtml(I18n.t('publishBtn'))}</span>`;
          return;
        }

        const newChapter = await Storage.addChapterToSeries({
          seriesId,
          chapterTitle: chapterTitle || `Chapter ${chapterNumber}`,
          content,
          chapterNumber
        });

        // Reset form
        el.storyBody.value = '';
        el.chapterTitleInput.value = '';

        allSeries = await Storage.fetchSeries();
        showToast(`Chapter ${chapterNumber} published successfully!`);

        // Open that series and jump to the newly created chapter!
        openSeries(seriesId, chapterNumber);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error publishing content.');
    } finally {
      el.publishBtn.disabled = false;
      el.publishBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> <span>${escapeHtml(I18n.t('publishBtn'))}</span>`;
    }
  };

  const updateWriterWordCount = () => {
    const text = el.storyBody ? el.storyBody.value.trim() : '';
    const words = text ? text.split(/\s+/).length : 0;
    const lang = I18n.getLanguage();
    const readMin = Storage.calculateReadingTime(text);

    if (el.writerWordCount) {
      el.writerWordCount.textContent = `${I18n.t('wordCount')}: ${Storage.toLocalNumber(words, lang)}`;
    }
    if (el.writerReadTimeEst) {
      el.writerReadTimeEst.textContent = `${I18n.t('readingTimeEst')}: ${Storage.toLocalNumber(readMin, lang)} ${I18n.t('readingTime')}`;
    }
  };

  // ==========================================
  // PROFILE VIEW (AUTHOR DASHBOARD)
  // ==========================================
  const renderProfileView = async () => {
    if (!el.profileContainer) return;
    const lang = I18n.getLanguage();

    if (!currentUser) {
      el.profileContainer.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 36px 18px;">
          <div class="profile-initials-box" style="margin: 0 auto 16px;">
            <i class="fa-regular fa-user"></i>
          </div>
          <h3 style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 8px;">${escapeHtml(I18n.t('profileGuestTitle'))}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 22px;">
            ${escapeHtml(I18n.t('profileGuestSub'))}
          </p>
          <button class="primary-btn" style="margin: 0 auto; min-width: 200px;" onclick="App.openAuthModal('login')">
            <span>${escapeHtml(I18n.t('loginBtn'))}</span>
          </button>
        </div>
      `;
      return;
    }

    currentUserProfile = await Storage.getUserProfile(currentUser.uid);
    const authoredSeries = allSeries.filter((s) => s.authorId === currentUser.uid);

    const totalReads = authoredSeries.reduce((acc, s) => acc + (s.views || 0), 0);
    const totalLikes = authoredSeries.reduce((acc, s) => acc + (s.likes || 0), 0);
    const totalChapters = authoredSeries.reduce((acc, s) => acc + (s.totalChapters || 1), 0);

    const initials = Storage.getAuthorInitials(currentUser.displayName || currentUserProfile.name || 'Author');

    let authoredListHtml = '';
    if (authoredSeries.length === 0) {
      authoredListHtml = `
        <div class="empty-state">
          <i class="fa-regular fa-pen-to-square"></i>
          <p>${escapeHtml(I18n.t('noAuthoredStories'))}</p>
          <button class="primary-btn" style="margin: 14px auto 0;" onclick="App.switchTab('view-writer')">
            <span>${escapeHtml(I18n.t('writeFirstStory'))}</span>
          </button>
        </div>
      `;
    } else {
      authoredListHtml = '<div style="display: flex; flex-direction: column; gap: 10px;">';
      authoredSeries.forEach((series) => {
        authoredListHtml += `
          <div class="glass-card" style="margin-bottom: 0; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div style="flex: 1; cursor: pointer;" onclick="App.openSeries('${series.id}')">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <span class="category-tag" style="font-size: 0.7rem;">${escapeHtml(series.category)}</span>
                  <span class="series-badge" style="font-size: 0.68rem; padding: 1px 6px;">
                    ${Storage.toLocalNumber(series.totalChapters || 1, lang)} Chapters
                  </span>
                </div>
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 4px 0;">${escapeHtml(series.title)}</h4>
                <div style="font-size: 0.75rem; color: var(--text-dim);">
                  <span>${Storage.toLocalNumber(series.views || 0, lang)} ${I18n.t('viewsText')}</span> · 
                  <span>${Storage.toLocalNumber(series.likes || 0, lang)} ${I18n.t('likesText')}</span> · 
                  <span>${formatDate(series.createdAt)}</span>
                </div>
              </div>

              <div style="display: flex; gap: 6px;">
                <button class="secondary-btn" style="min-height: 36px; padding: 0 10px;" onclick="App.openSeries('${series.id}')">
                  <span>${escapeHtml(I18n.t('readBtn'))}</span>
                </button>
                <button class="danger-btn" style="min-height: 36px; padding: 0 10px;" onclick="App.handleDeleteSeries('${series.id}', '${escapeHtml(series.title)}')">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      });
      authoredListHtml += '</div>';
    }

    el.profileContainer.innerHTML = `
      <div class="glass-card profile-card">
        <div class="profile-avatar-row">
          ${
            currentUserProfile && currentUserProfile.avatar
              ? `<img src="${escapeHtml(currentUserProfile.avatar)}" alt="Avatar" class="profile-avatar-img" onerror="this.outerHTML='<div class=\\'profile-initials-box\\'>${initials}</div>'">`
              : `<div class="profile-initials-box">${initials}</div>`
          }
          <div class="profile-info">
            <h3>${escapeHtml(currentUser.displayName || currentUserProfile.name || 'Author')}</h3>
            <p>${escapeHtml(currentUser.email)}</p>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 14px;">
          ${escapeHtml(currentUserProfile.bio || 'Literature enthusiast and author on Bharat e-Library.')}
        </p>

        <!-- Stats Grid -->
        <div class="profile-stats-grid">
          <div class="profile-stat-box">
            <div class="stat-num">${Storage.toLocalNumber(authoredSeries.length, lang)}</div>
            <div class="stat-title">Books / Series</div>
          </div>
          <div class="profile-stat-box">
            <div class="stat-num">${Storage.toLocalNumber(totalChapters, lang)}</div>
            <div class="stat-title">Chapters</div>
          </div>
          <div class="profile-stat-box">
            <div class="stat-num">${Storage.toLocalNumber(totalReads, lang)}</div>
            <div class="stat-title">${escapeHtml(I18n.t('statReads'))}</div>
          </div>
        </div>

        <div class="profile-actions">
          <button class="secondary-btn" style="flex: 1;" onclick="App.openProfileEditModal()">
            <i class="fa-solid fa-user-pen"></i>
            <span>${escapeHtml(I18n.t('editProfileBtn'))}</span>
          </button>
          <button class="danger-btn" style="flex: 1;" onclick="App.handleLogout()">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>${escapeHtml(I18n.t('logoutBtn'))}</span>
          </button>
        </div>
      </div>

      <!-- Authored Books Section -->
      <div class="authored-stories-header" style="margin-top: 20px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <span class="authored-title" style="font-weight: 700; color: var(--text-main); font-size: 1rem;">
          ${escapeHtml(I18n.t('myStoriesTitle'))}
        </span>
        <button class="secondary-btn" style="min-height: 32px; padding: 0 10px; font-size: 0.78rem;" onclick="App.switchTab('view-writer')">
          <i class="fa-solid fa-plus"></i> New Book
        </button>
      </div>

      ${authoredListHtml}
    `;
  };

  const handleDeleteSeries = async (seriesId, title) => {
    if (!confirm(`${I18n.t('deleteConfirm')}\n\n"${title}"`)) {
      return;
    }

    try {
      await Storage.deleteSeries(seriesId);
      allSeries = allSeries.filter((s) => s.id !== seriesId);
      showToast(I18n.t('deleteSuccess'));
      renderProfileView();
    } catch (err) {
      console.error(err);
      showToast('Error deleting story series.');
    }
  };

  // Edit Profile Modal
  const openProfileEditModal = () => {
    if (!currentUser) return;
    el.editProfileName.value = currentUser.displayName || (currentUserProfile && currentUserProfile.name) || '';
    el.editProfileAvatar.value = (currentUserProfile && currentUserProfile.avatar) || '';
    el.editProfileBio.value = (currentUserProfile && currentUserProfile.bio) || '';
    el.profileEditModal.classList.add('show');
  };

  const closeProfileEditModal = () => {
    el.profileEditModal.classList.remove('show');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const name = el.editProfileName.value.trim();
    const avatar = el.editProfileAvatar.value.trim();
    const bio = el.editProfileBio.value.trim();

    try {
      await Storage.updateUserProfile({ name, avatar, bio });
      showToast('Profile updated successfully!');
      closeProfileEditModal();
      renderProfileView();
      applyTranslations();
    } catch (err) {
      console.error(err);
      showToast('Error updating profile.');
    }
  };

  // Clear Offline Storage Cache
  const handleClearCache = () => {
    Storage.clearLocalCache();
    showToast(I18n.t('cacheCleared'));
    loadSeries();
  };

  // Info Modal
  const showInfoModal = (title, body) => {
    const modal = document.getElementById('info-modal');
    document.getElementById('info-modal-title').textContent = title;
    document.getElementById('info-modal-body').textContent = body;
    modal.classList.add('show');
  };

  // Auth Modal Controls
  const openAuthModal = (mode = 'login') => {
    authModalMode = mode;
    switchAuthModalMode(mode);
    if (el.authErrorBanner) {
      el.authErrorBanner.style.display = 'none';
      el.authErrorBanner.textContent = '';
    }
    if (el.authModal) {
      el.authModal.classList.add('show');
    }
  };

  const closeAuthModal = () => {
    if (el.authModal) {
      el.authModal.classList.remove('show');
    }
  };

  const switchAuthModalMode = (mode) => {
    authModalMode = mode;
    if (mode === 'login') {
      el.modalTabLogin.classList.add('active');
      el.modalTabSignup.classList.remove('active');
      el.nameFieldGroup.style.display = 'none';
      el.authSubmitBtn.querySelector('span').textContent = I18n.t('authSubmitLogin');
    } else {
      el.modalTabLogin.classList.remove('active');
      el.modalTabSignup.classList.add('active');
      el.nameFieldGroup.style.display = 'block';
      el.authSubmitBtn.querySelector('span').textContent = I18n.t('authSubmitSignup');
    }
    if (el.authErrorBanner) {
      el.authErrorBanner.style.display = 'none';
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value.trim();

    el.authErrorBanner.style.display = 'none';
    el.authSubmitBtn.disabled = true;
    el.authSubmitBtn.querySelector('span').textContent = I18n.t('authValidating');

    try {
      if (authModalMode === 'signup') {
        if (!name) throw new Error('Please enter your full name.');
        await Storage.signup(email, password, name);
        showToast('Account registered successfully!');
      } else {
        await Storage.login(email, password);
        showToast('Signed in successfully!');
      }
      closeAuthModal();
      document.getElementById('auth-email').value = '';
      document.getElementById('auth-password').value = '';
      document.getElementById('auth-name').value = '';
    } catch (err) {
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Email is already registered. Please login.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      el.authErrorBanner.textContent = msg;
      el.authErrorBanner.style.display = 'block';
    } finally {
      el.authSubmitBtn.disabled = false;
      el.authSubmitBtn.querySelector('span').textContent =
        authModalMode === 'login' ? I18n.t('authSubmitLogin') : I18n.t('authSubmitSignup');
    }
  };

  const handleLogout = async () => {
    if (confirm(I18n.t('logoutConfirm'))) {
      await Storage.logout();
      showToast('Signed out successfully.');
      switchTab('view-library');
    }
  };

  const handleAuthBtnClick = () => {
    if (currentUser) {
      switchTab('view-profile');
    } else {
      openAuthModal('login');
    }
  };

  // Filter & Sort Setters
  const setCategory = (cat) => {
    activeCategory = cat;
    document.querySelectorAll('.cat-chip').forEach((chip) => {
      if (chip.getAttribute('data-cat') === cat) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
    renderLibrarySeries();
  };

  const setSort = (sortType) => {
    activeSort = sortType;
    document.querySelectorAll('.sort-tab-btn').forEach((tab) => {
      if (tab.getAttribute('data-sort') === sortType) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    renderLibrarySeries();
  };

  // App Initialization
  const init = () => {
    // Restore Saved Theme & Typography
    const savedTheme = localStorage.getItem('bharat_elibrary_theme') || 'dark';
    setTheme(savedTheme);

    const savedFontSize = localStorage.getItem('bharat_elibrary_font_size') || 'md';
    setReadingFontSize(savedFontSize);

    const savedFontStyle = localStorage.getItem('bharat_elibrary_font_style') || 'sans';
    setReadingFontStyle(savedFontStyle);

    // Apply active localization
    applyTranslations();

    // Listen to Firebase Auth state
    Storage.onAuthStateChanged(async (user) => {
      currentUser = user;
      applyTranslations();

      if (user) {
        currentUserProfile = await Storage.getUserProfile(user.uid);
        if (el.storyAuthor && !el.storyAuthor.value && user.displayName) {
          el.storyAuthor.value = user.displayName;
        }
        userAuthoredSeries = await Storage.fetchUserSeries(user.uid);
        populateExistingBookSelect();
      }

      if (currentView === 'view-profile') {
        renderProfileView();
      }
      if (currentView === 'view-reader') {
        updateLikeButtonUI();
        updateRatingSectionUI();
      }
    });

    // Real-time search
    if (el.searchInput) {
      el.searchInput.addEventListener('input', () => {
        renderLibrarySeries();
      });
    }

    // Real-time writer word & character count
    if (el.storyBody) {
      el.storyBody.addEventListener('input', updateWriterWordCount);
    }

    // Close modals on outside backdrop click
    window.addEventListener('click', (e) => {
      if (e.target === el.authModal) closeAuthModal();
      if (e.target === el.profileEditModal) closeProfileEditModal();
      if (e.target === el.seriesTocModal) closeTableOfContentsModal();
      const infoModal = document.getElementById('info-modal');
      if (e.target === infoModal) infoModal.classList.remove('show');
    });

    // Fetch and display initial books/series
    loadSeries();
  };

  // Public API
  return {
    init,
    switchTab,
    setCategory,
    setSort,
    openSeries,
    handleBackFromReader,
    goToAdjacentChapter,
    handleChapterDropdownChange,
    openTableOfContentsModal,
    closeTableOfContentsModal,
    selectChapterFromToc,
    changeFontSize,
    setReadingFontSize,
    setReadingFontStyle,
    setTheme,
    handleLikeToggle,
    handleRatingClick,
    setWriterMode,
    handleExistingBookChange,
    handleStorySubmit,
    handleDeleteSeries,
    handleAuthBtnClick,
    openAuthModal,
    closeAuthModal,
    switchAuthModalMode,
    handleAuthSubmit,
    handleLogout,
    handleLanguageChange,
    openProfileEditModal,
    closeProfileEditModal,
    handleSaveProfile,
    handleClearCache,
    showInfoModal
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
