<!doctype html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ইন্ডিয়ান ই সাহিত্য | Indian eSahitya</title>

  <!-- Firebase Compat SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

  <style>
    :root {
      --bg: #080810;
      --panel: rgba(20, 20, 35, 0.72);
      --panel2: rgba(255, 255, 255, 0.06);
      --text: #edf2f7;
      --muted: #94a3b8;
      --cyan: #00f2fe;
      --purple: #8b5cf6;
      --pink: #ff4d8d;
      --border: rgba(255, 255, 255, 0.1);
      --shadow: 0 14px 45px rgba(0, 0, 0, 0.35);
      --font: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --bn: 'Nirmala UI', 'Kalpurush', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      min-height: 100vh;
      background: radial-gradient(circle at 12% 0%, #15213b 0, transparent 30%),
                  radial-gradient(circle at 100% 30%, #241038 0, transparent 30%),
                  var(--bg);
      color: var(--text);
      font-family: var(--font);
      line-height: 1.6;
      padding: 76px 0 88px;
    }

    button, input, textarea, select { font: inherit; }
    button { cursor: pointer; }
    a { color: inherit; }
    .bn { font-family: var(--bn); }
    .container { width: min(1160px, 92%); margin: auto; }
    .glass {
      background: var(--panel);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .muted { color: var(--muted); }
    .hidden { display: none !important; }

    .btn {
      border: 0;
      border-radius: 999px;
      padding: 10px 20px;
      font-weight: 700;
      transition: .2s;
      color: var(--text);
    }
    .btn:hover { transform: translateY(-2px); }
    .primary { background: linear-gradient(135deg, var(--purple), var(--cyan)); box-shadow: 0 8px 25px rgba(0, 200, 223, 0.2); }
    .secondary { background: var(--panel2); border: 1px solid var(--border); }

    /* Topbar */
    .topbar {
      height: 64px;
      position: fixed;
      z-index: 20;
      inset: 0 0 auto;
      background: rgba(8, 8, 16, 0.85);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(16px);
    }
    .topbar .container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      text-decoration: none;
      font-size: 1.25rem;
      font-weight: 900;
      font-family: var(--bn);
      background: linear-gradient(90deg, var(--cyan), #b18cff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .status { font-size: .8rem; color: var(--muted); display: flex; gap: 7px; align-items: center; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; }
    .dot.online { background: #22c55e; }

    /* Views */
    main { min-height: calc(100vh - 150px); padding: 20px 0; }
    .view { display: none; }
    .view.active { display: block; animation: rise .25s ease; }
    @keyframes rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

    /* Hero */
    .hero {
      padding: 40px 20px;
      text-align: center;
      border-radius: 24px;
      position: relative;
      margin-bottom: 24px;
      overflow: hidden;
    }
    .hero:before {
      content: "";
      position: absolute;
      width: 300px;
      height: 300px;
      background: rgba(0, 229, 255, 0.15);
      filter: blur(70px);
      left: 50%;
      top: -150px;
      transform: translateX(-50%);
    }
    .eyebrow { color: var(--cyan); letter-spacing: .15em; font-size: .75rem; font-weight: 800; }
    .hero h1 { font: 900 clamp(1.8rem, 6vw, 3.2rem)/1.2 var(--bn); margin: 12px 0; }
    .hero p { max-width: 600px; margin: 0 auto 20px; color: var(--muted); font-size: .95rem; }

    /* Controls */
    .controls {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      padding: 12px;
      border-radius: 16px;
      margin-bottom: 20px;
    }
    .search, .select, .field {
      width: 100%;
      background: #0b0b16;
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px 14px;
      outline: none;
    }
    .search:focus, .select:focus, .field:focus {
      border-color: var(--cyan);
      box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.15);
    }
    .search { max-width: 320px; }
    .select { width: auto; min-width: 180px; }

    /* Story Grid */
    .story-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
    .card {
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 290px;
      transition: .2s ease;
      cursor: pointer;
    }
    .card:hover { transform: translateY(-5px); border-color: rgba(0, 242, 254, 0.4); }
    .cover {
      height: 140px;
      background: linear-gradient(135deg, #182d48, #30183e);
      background-size: cover;
      background-position: center;
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.6);
      font-size: 2rem;
    }
    .card-body { padding: 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .card h3 { font: 800 1.2rem/1.35 var(--bn); }
    .author { color: var(--cyan); font-size: .84rem; }
    .meta {
      margin-top: auto;
      border-top: 1px solid var(--border);
      padding-top: 10px;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
      font-size: .78rem;
    }
    .stars { color: #ffc857; }

    /* Writing Studio */
    .form-shell { max-width: 800px; margin: auto; padding: 24px; border-radius: 20px; }
    .form-shell h1 { font: 800 1.8rem var(--bn); margin-bottom: 6px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .group { display: flex; flex-direction: column; gap: 6px; }
    .group.full { grid-column: 1 / -1; }
    .area { min-height: 240px; resize: vertical; }
    .metrics { display: flex; gap: 14px; color: var(--muted); font-size: .84rem; margin-top: 4px; }
    .preview { width: 100%; max-height: 180px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border); margin-top: 8px; }

    /* Profile / Auth */
    .profile { max-width: 850px; margin: auto; }
    .profile-head { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-radius: 18px; margin: 18px 0; }
    .avatar { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, var(--purple), var(--cyan)); font-weight: 800; font-size: 1.4rem; }
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .panel { padding: 18px; border-radius: 16px; }
    .panel h2 { font: 700 1.2rem var(--bn); margin-bottom: 12px; }

    /* Reader View */
    #reader {
      position: fixed;
      inset: 0;
      background: rgba(8, 8, 16, 0.98);
      z-index: 50;
      overflow-y: auto;
      padding: 20px 0 100px;
      display: none;
    }
    .reader-inner { width: min(780px, 92%); margin: auto; }
    .reader-head {
      position: sticky;
      top: 0;
      padding: 12px 0;
      background: rgba(8, 8, 16, 0.95);
      border-bottom: 1px solid var(--border);
      z-index: 2;
    }
    .reader-head-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .reader-content {
      font: 1.15rem/2 var(--bn);
      padding: 28px 0;
      user-select: none;
      -webkit-user-select: none;
    }
    .reader-content p { margin-bottom: 1.4em; text-align: justify; }
    .rating-row { display: flex; flex-direction: row-reverse; justify-content: center; gap: 4px; margin-bottom: 12px; }
    .rating-row button { font-size: 1.8rem; background: none; border: 0; color: #475569; }
    .rating-row button:hover, .rating-row button:hover ~ button { color: #ffc857; }

    /* Support Modal */
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      place-items: center;
      z-index: 70;
      padding: 16px;
    }
    .modal.open { display: grid; }
    .modal-box { width: min(380px, 100%); padding: 24px; border-radius: 20px; text-align: center; }
    .upi { padding: 12px; border-radius: 10px; background: rgba(0, 0, 0, 0.5); color: var(--cyan); font-family: monospace; font-size: 1.1rem; margin: 12px 0; }

    /* Bottom Navigation */
    .bottom-nav {
      height: 64px;
      position: fixed;
      z-index: 20;
      bottom: 0;
      inset-inline: 0;
      background: rgba(11, 11, 21, 0.95);
      border-top: 1px solid var(--border);
      backdrop-filter: blur(16px);
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .nav-btn {
      background: none;
      border: 0;
      color: var(--muted);
      font-size: .75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .nav-btn.active { color: var(--cyan); font-weight: 700; }

    .toast {
      position: fixed;
      z-index: 100;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      opacity: 0;
      padding: 10px 18px;
      border-radius: 999px;
      background: #172033;
      color: #fff;
      border: 1px solid var(--border);
      transition: .25s ease;
      pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    @media(max-width: 650px) {
      .form-grid, .profile-grid { grid-template-columns: 1fr; }
      .search { max-width: none; }
    }
  </style>
</head>
<body>

  <!-- Top Navigation Header -->
  <header class="topbar">
    <div class="container">
      <a href="#home" class="brand" onclick="route('home')">ইন্ডিয়ান ই সাহিত্য</a>
      <div class="status">
        <span class="dot" id="connection-dot"></span>
        <span id="connection-label">লোকাল মোড</span>
      </div>
    </div>
  </header>

  <!-- Main Views Container -->
  <main class="container">

    <!-- 1. HOME / LIBRARY -->
    <section class="view active" id="home">
      <div class="hero glass">
        <span class="eyebrow">INDIAN E-SAHITYA · BANGLA PLATFORM</span>
        <h1>আপনার কল্পনার অমূল্য ভাণ্ডার</h1>
        <p>পড়ুন, লিখুন এবং নিজের গল্প সবার সঙ্গে শেয়ার করুন—সম্পূর্ণ মুক্ত ও আধুনিক পাঠশালায়।</p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button class="btn primary" onclick="route('write')">গল্প লিখুন ✦</button>
          <button class="btn secondary" onclick="route('profile')">মাই আইডি</button>
        </div>
      </div>

      <div class="controls glass">
        <input type="search" class="search" id="search" placeholder="গল্প, লেখক বা জনরা খুঁজুন...">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="muted" id="story-count" style="font-size:.85rem;">০টি গল্প</span>
          <select class="select" id="sort">
            <option value="rating">সেরা রেটিং (Star Ranking)</option>
            <option value="newest">নতুন প্রকাশনা</option>
            <option value="views">সর্বাধিক ভিউ</option>
            <option value="likes">সর্বাধিক লাইক</option>
          </select>
        </div>
      </div>

      <div class="story-grid" id="story-grid"></div>
    </section>

    <!-- 2. WRITER STUDIO -->
    <section class="view" id="write">
      <div class="form-shell glass">
        <h1>রাইটিং স্টুডিও</h1>
        <p class="muted" style="font-size:.9rem;">আপনার নতুন গল্প তৈরি ও প্রকাশ করুন।</p>
        
        <form id="story-form">
          <div class="form-grid">
            <div class="group">
              <label class="bn">গল্পের নাম *</label>
              <input type="text" class="field" id="title" required placeholder="শিরোনাম দিন...">
            </div>
            <div class="group">
              <label class="bn">চ্যাপ্টার নম্বর *</label>
              <input type="number" class="field" id="chapter" value="1" required min="1">
            </div>
            <div class="group">
              <label class="bn">বিভাগ / জনরা</label>
              <input type="text" class="field" id="category" placeholder="রহস্য, কল্পবিজ্ঞান, রোমান্টিক...">
            </div>
            <div class="group">
              <label class="bn">কভার ছবি (URL বা ফাইল)</label>
              <input type="url" class="field" id="cover-url" placeholder="https://... কভার ছবির লিংক">
              <input type="file" id="cover-file" accept="image/*" style="font-size:.78rem;margin-top:4px;">
              <img id="cover-preview" class="preview hidden" alt="কভার প্রিভিউ">
            </div>
            <div class="group full">
              <label class="bn">মূল লেখার টেক্সট *</label>
              <textarea class="field area" id="body" required placeholder="এখানে আপনার গল্প লিখুন..."></textarea>
              <div class="metrics">
                <span id="word-count">শব্দ: ০</span>
                <span id="read-time">পড়ার সময়: ০ মিনিট</span>
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:16px;">
            <button type="submit" class="btn primary">গল্প প্রকাশ করুন ↗</button>
          </div>
        </form>
      </div>
    </section>

    <!-- 3. MY ID / PROFILE -->
    <section class="view" id="profile">
      <div class="profile">
        <div id="auth-area" class="glass form-shell" style="margin-bottom:20px;">
          <h2>মাই আইডি লগইন</h2>
          <p class="muted" style="font-size:.9rem;margin-bottom:14px;">ফায়ারবেস ক্লাউডে গল্প সেভ রাখতে ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।</p>
          <form id="auth-form" style="display:grid;gap:10px;max-width:360px;">
            <input type="email" class="field" id="auth-email" placeholder="ইমেইল অ্যাড্রেস" required>
            <input type="password" class="field" id="auth-password" placeholder="পাসওয়ার্ড" required minlength="6">
            <div style="display:flex;gap:10px;margin-top:6px;">
              <button type="submit" data-auth="login" class="btn primary" style="flex:1;">লগইন</button>
              <button type="submit" data-auth="signup" class="btn secondary" style="flex:1;">সাইন আপ</button>
            </div>
          </form>
        </div>

        <div id="profile-data" class="hidden">
          <div class="profile-head glass">
            <div style="display:flex;align-items:center;gap:14px;">
              <div class="avatar" id="avatar">ই</div>
              <div>
                <h2 id="profile-name" class="bn">ব্যবহারকারী</h2>
                <span class="muted" id="profile-email" style="font-size:.85rem;"></span>
              </div>
            </div>
            <button class="btn secondary" id="logout">লগআউট</button>
          </div>

          <div class="profile-grid">
            <div class="panel glass">
              <h2>আমার প্রকাশনা</h2>
              <div id="my-stories" class="muted" style="font-size:.9rem;">এখনও কোনো প্রকাশনা নেই।</div>
            </div>
            <div class="panel glass">
              <h2>সেভ করা বুকমার্ক</h2>
              <div id="bookmarks" class="muted" style="font-size:.9rem;">কোনো সংরক্ষিত গল্প নেই।</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- READER MODAL OVERLAY -->
  <div id="reader" aria-hidden="true">
    <div class="reader-inner">
      <div class="reader-head">
        <div class="reader-head-row">
          <div>
            <h1 id="reader-title" class="bn"></h1>
            <span class="muted" id="reader-info" style="font-size:.85rem;"></span>
          </div>
          <button class="btn secondary" onclick="closeReader()">✕ বন্ধ করুন</button>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button class="btn secondary" id="font-down">A−</button>
          <button class="btn secondary" id="font-up">A+</button>
          <button class="btn secondary" id="bookmark">🔖 সেভ</button>
          <button class="btn secondary" onclick="document.getElementById('support-modal').classList.add('open')">☕ সাপোর্ট</button>
        </div>
      </div>

      <!-- Protected Content -->
      <article class="reader-content" id="reader-content"></article>

      <div style="border-top:1px solid var(--border);padding-top:20px;text-align:center;">
        <span class="muted" style="font-size:.9rem;display:block;margin-bottom:8px;">গল্পটি রেটিং দিন:</span>
        <div class="rating-row" id="rating">
          <button data-rating="5">★</button>
          <button data-rating="4">★</button>
          <button data-rating="3">★</button>
          <button data-rating="2">★</button>
          <button data-rating="1">★</button>
        </div>
        <button class="btn secondary" id="like">♡ লাইক ০</button>
      </div>
    </div>
  </div>

  <!-- SUPPORT UPI MODAL -->
  <div class="modal" id="support-modal">
    <div class="modal-box glass">
      <h2>স্রষ্টাকে সাপোর্ট করুন</h2>
      <p class="muted">আপনার ছোট্ট অনুদান লেখকদের নতুন গল্প তৈরিতে সাহায্য করে।</p>
      <div class="upi">creator@upi</div>
      <button class="btn primary" onclick="document.getElementById('support-modal').classList.remove('open')">ঠিক আছে</button>
    </div>
  </div>

  <!-- FLOATING BOTTOM NAV -->
  <nav class="bottom-nav">
    <button class="nav-btn active" data-route="home" onclick="route('home')">
      <span style="font-size:1.2rem;">⌂</span><span>লাইব্রেরি</span>
    </button>
    <button class="nav-btn" data-route="write" onclick="route('write')">
      <span style="font-size:1.2rem;">✎</span><span>লিখুন</span>
    </button>
    <button class="nav-btn" data-route="profile" onclick="route('profile')">
      <span style="font-size:1.2rem;">◎</span><span>মাই আইডি</span>
    </button>
  </nav>

  <!-- TOAST NOTIFICATION -->
  <div class="toast" id="toast"></div>

  <!-- JAVASCRIPT APPLICATION LOGIC -->
  <script>
    'use strict';

    // Firebase Setup Placeholder
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const initialSeed = [
      {
        id: 'seed-1',
        title: 'জোছনার শেষ ট্রেন',
        chapter: 1,
        category: 'কল্পকাহিনি',
        author: 'ই-সাহিত্য টিম',
        body: 'রাতের শেষ ট্রেনটি যখন নির্জন স্টেশনে ঢুকল, চারপাশ একদম স্তব্ধ। জানালার ওপারে নদীটি চাঁদের আলোয় রুপালি চাদর মুড়ে শুয়ে ছিল।\n\nসে ব্যাগ থেকে পুরোনো চিঠিটা বের করল এবং প্রথমবারের মতো শেষ লাইনটির আসল অর্থ বুঝতে পারল।',
        cover: '',
        createdAt: new Date().toISOString(),
        likes: 12,
        views: 45,
        ratingTotal: 25,
        ratingCount: 5,
        authorUid: ''
      }
    ];

    const state = {
      stories: [],
      user: null,
      current: null,
      fontSize: 1.15
    };

    const $ = s => document.querySelector(s);
    const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));

    // Check Firebase
    let db = null, auth = null;
    const isFirebaseSetup = !firebaseConfig.apiKey.startsWith('YOUR_');
    if (isFirebaseSetup && window.firebase) {
      try {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        auth.onAuthStateChanged(u => {
          state.user = u;
          renderAuth();
          renderProfile();
        });
        $('#connection-label').textContent = 'Firebase ক্লাউড';
        $('#connection-dot').classList.add('online');
      } catch (e) {
        console.warn('Firebase init error', e);
      }
    }

    // Local Storage Wrapper
    const store = {
      get: () => JSON.parse(localStorage.getItem('esahitya_stories') || '[]'),
      set: v => localStorage.setItem('esahitya_stories', JSON.stringify(v)),
      bookmarks: () => JSON.parse(localStorage.getItem('esahitya_saved') || '[]'),
      saveBookmarks: v => localStorage.setItem('esahitya_saved', JSON.stringify(v))
    };

    function notify(msg) {
      const t = $('#toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2400);
    }

    function formatDate(v) {
      return new Intl.DateTimeFormat('bn-BD', { dateStyle: 'medium' }).format(new Date(v));
    }

    function avgRating(s) {
      return s.ratingCount ? (s.ratingTotal / s.ratingCount) : 0;
    }

    function loadStories() {
      let local = store.get();
      if (!local.length) {
        local = initialSeed;
        store.set(local);
      }
      state.stories = local;
      renderStories();
    }

    function renderStories() {
      const q = $('#search').value.toLowerCase();
      const sortKey = $('#sort').value;

      let list = state.stories.filter(s =>
        (s.title + ' ' + (s.author || '') + ' ' + (s.category || '')).toLowerCase().includes(q)
      );

      // Ranking & Sorting Logic
      list.sort((a, b) => {
        if (sortKey === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortKey === 'likes') return (b.likes || 0) - (a.likes || 0);
        if (sortKey === 'views') return (b.views || 0) - (a.views || 0);
        // Primary: Highest Rating, Secondary: Views
        return (avgRating(b) - avgRating(a)) || ((b.views || 0) - (a.views || 0));
      });

      $('#story-count').textContent = `${list.length}টি গল্প`;

      const grid = $('#story-grid');
      if (!list.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;" class="muted">কোনো গল্প পাওয়া যায়নি।</div>';
        return;
      }

      grid.innerHTML = list.map(s => `
        <article class="card glass" onclick="openReader('${s.id}')">
          <div class="cover" style="${s.cover ? `background-image:url(${s.cover})` : ''}">
            ${s.cover ? '' : '✦'}
          </div>
          <div class="card-body">
            <h3>${esc(s.title)}</h3>
            <span class="author">${esc(s.author || 'অজ্ঞাত')} · চ্যাপ্টার ${s.chapter || 1}</span>
            <div class="meta">
              <span class="stars">★ ${avgRating(s).toFixed(1)}</span>
              <span>👁 ${s.views || 0} · ♡ ${s.likes || 0}</span>
            </div>
          </div>
        </article>
      `).join('');
    }

    function route(name) {
      document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === name));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.route === name));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openReader(id) {
      const s = state.stories.find(x => x.id === id);
      if (!s) return;
      state.current = s;
      s.views = (s.views || 0) + 1;
      store.set(state.stories);

      $('#reader-title').textContent = s.title;
      $('#reader-info').textContent = `${s.author || 'অজ্ঞাত'} · ${s.category || 'সাধারণ'} · ${formatDate(s.createdAt)}`;
      $('#reader-content').innerHTML = String(s.body).split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');
      $('#like').textContent = `♡ লাইক ${s.likes || 0}`;

      const saved = store.bookmarks().includes(id);
      $('#bookmark').textContent = saved ? '🔖 সেভ হয়েছে' : '🔖 সেভ';

      $('#reader').style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeReader() {
      $('#reader').style.display = 'none';
      document.body.style.overflow = '';
      renderStories();
    }

    // Anti-Copy Context Protection in Reader
    $('#reader-content').addEventListener('contextmenu', e => e.preventDefault());

    // Publish Story Form
    $('#story-form').onsubmit = function(e) {
      e.preventDefault();
      const title = $('#title').value.trim();
      const body = $('#body').value.trim();
      if (!title || !body) return;

      const newStory = {
        id: 'story-' + Date.now(),
        title: title,
        chapter: Number($('#chapter').value) || 1,
        category: $('#category').value.trim() || 'সাধারণ',
        cover: $('#cover-url').value.trim(),
        body: body,
        author: state.user ? (state.user.displayName || state.user.email) : 'স্থানীয় লেখক',
        authorUid: state.user ? state.user.uid : '',
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0,
        ratingTotal: 0,
        ratingCount: 0
      };

      state.stories.unshift(newStory);
      store.set(state.stories);
      this.reset();
      $('#cover-preview').classList.add('hidden');
      notify('গল্প সফলভাবে প্রকাশিত হয়েছে ✨');
      route('home');
      renderStories();
    };

    // Live Word Count & Read Time
    $('#body').oninput = function() {
      const text = this.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      $('#word-count').textContent = `শব্দ: ${words}`;
      $('#read-time').textContent = `পড়ার সময়: ${Math.max(1, Math.ceil(words / 150))} মিনিট`;
    };

    // Cover File to Base64
    $('#cover-file').onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        $('#cover-url').value = reader.result;
        $('#cover-preview').src = reader.result;
        $('#cover-preview').classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    };

    // Font Resizer
    $('#font-up').onclick = () => {
      state.fontSize = Math.min(1.6, state.fontSize + 0.1);
      $('#reader-content').style.fontSize = state.fontSize + 'rem';
    };
    $('#font-down').onclick = () => {
      state.fontSize = Math.max(0.9, state.fontSize - 0.1);
      $('#reader-content').style.fontSize = state.fontSize + 'rem';
    };

    // Like Action
    $('#like').onclick = () => {
      if (!state.current) return;
      state.current.likes = (state.current.likes || 0) + 1;
      store.set(state.stories);
      $('#like').textContent = `♥ লাইক ${state.current.likes}`;
      notify('লাইক দেওয়া হয়েছে!');
    };

    // Star Rating
    $('#rating').onclick = e => {
      const r = Number(e.target.dataset.rating);
      if (!r || !state.current) return;
      state.current.ratingTotal = (state.current.ratingTotal || 0) + r;
      state.current.ratingCount = (state.current.ratingCount || 0) + 1;
      store.set(state.stories);
      notify(`${r} স্টার রেটিং দেওয়া হয়েছে!`);
    };

    // Bookmark Toggle
    $('#bookmark').onclick = () => {
      if (!state.current) return;
      let b = store.bookmarks();
      const id = state.current.id;
      if (b.includes(id)) {
        b = b.filter(x => x !== id);
        $('#bookmark').textContent = '🔖 সেভ';
        notify('বুকমার্ক সরানো হয়েছে');
      } else {
        b.push(id);
        $('#bookmark').textContent = '🔖 সেভ হয়েছে';
        notify('বুকমার্কে সেভ করা হয়েছে');
      }
      store.saveBookmarks(b);
      renderProfile();
    };

    // Auth & Profile Logic
    function renderAuth() {
      if (state.user) {
        $('#auth-area').classList.add('hidden');
        $('#profile-data').classList.remove('hidden');
        $('#profile-name').textContent = state.user.displayName || 'লেখক / পাঠক';
        $('#profile-email').textContent = state.user.email;
        $('#avatar').textContent = (state.user.email || 'U')[0].toUpperCase();
      } else {
        $('#auth-area').classList.remove('hidden');
        $('#profile-data').classList.add('hidden');
      }
    }

    function renderProfile() {
      if (!state.user) return;
      const my = state.stories.filter(s => s.authorUid === state.user.uid);
      $('#my-stories').innerHTML = my.length ? my.map(s => `<div>${esc(s.title)} (${formatDate(s.createdAt)})</div>`).join('') : 'কোনো প্রকাশনা নেই।';
      
      const bMarks = store.bookmarks();
      const saved = state.stories.filter(s => bMarks.includes(s.id));
      $('#bookmarks').innerHTML = saved.length ? saved.map(s => `<div>${esc(s.title)}</div>`).join('') : 'কোনো সেভ করা গল্প নেই।';
    }

    $('#auth-form').onsubmit = async function(e) {
      e.preventDefault();
      if (!auth) {
        notify('Firebase সক্রিয় নেই, লোকাল মোড চালু রয়েছে');
        return;
      }
      const email = $('#auth-email').value;
      const pass = $('#auth-password').value;
      const mode = e.submitter.dataset.auth;
      try {
        if (mode === 'signup') await auth.createUserWithEmailAndPassword(email, pass);
        else await auth.signInWithEmailAndPassword(email, pass);
        notify('স্বাগতম!');
      } catch (err) {
        notify('সমস্যা: ' + err.message);
      }
    };

    $('#logout').onclick = () => auth?.signOut();
    $('#search').oninput = renderStories;
    $('#sort').onchange = renderStories;

    // Run Initializer
    loadStories();
  </script>
</body>
</html>
