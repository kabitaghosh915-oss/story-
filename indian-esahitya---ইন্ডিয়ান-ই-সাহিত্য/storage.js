// storage.js - Enterprise Cloud Firestore & Firebase Auth Controller for Bharat e-Library
// Supports Books/Series, Chapters, Real-time Interactive Likes, 1-5 Star Ratings, and Offline Persistence

const firebaseConfig = {
  apiKey: "AIzaSyC54GCR46zpyLJ-fMmtl-pIGvs2Y_Ztu-M",
  authDomain: "celestial-sunbeam-h1ttq.firebaseapp.com",
  projectId: "celestial-sunbeam-h1ttq",
  storageBucket: "celestial-sunbeam-h1ttq.firebasestorage.app",
  messagingSenderId: "882142335518",
  appId: "1:882142335518:web:afe8d10e255685cd10140f"
};

// Initialize Firebase App
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Auth
const auth = firebase.auth();

// Enforce browser local persistence across sessions
const persistencePromise = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((err) => {
  console.warn("Auth persistence error:", err);
});

// Initialize Cloud Firestore
const firestoreDbId = "ai-studio-amargolpobengali-3e075996-2374-438a-915e-043e188e5b2f";
let db;
try {
  if (firebase.app().firestore && typeof firebase.app().firestore === 'function') {
    db = firebase.app().firestore(firestoreDbId);
  } else {
    db = firebase.firestore();
  }
} catch (e) {
  console.warn("Using default Firestore instance:", e);
  db = firebase.firestore();
}

// Local cache keys
const LOCAL_SERIES_CACHE_KEY = 'bharat_elibrary_series_cache';
const LOCAL_CHAPTERS_CACHE_KEY = 'bharat_elibrary_chapters_cache';
const LOCAL_RATINGS_KEY = 'bharat_elibrary_user_ratings_map';
const LOCAL_LIKES_KEY = 'bharat_elibrary_user_likes_set';
const LOCAL_USER_PROFILE_KEY = 'bharat_elibrary_user_profile';

// Seed Initial Series and Chapters (Pan-India Curated Literature)
const SEED_SERIES = [
  {
    id: "series_raygarh",
    title: "Secrets of the Royal Vault of Raygarh",
    description: "An adventurous historical archaeological expedition investigating ancient Deccan fortifications, cryptic Brahmi inscriptions, and a fabled subterranean vault.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    category: "Mystery & Thriller",
    language: "en",
    authorId: "system_author_2",
    authorName: "Dr. Soumik Majumdar",
    authorPhotoUrl: "",
    totalChapters: 2,
    views: 1420,
    likes: 295,
    ratingTotal: 580,
    ratingCount: 120,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "series_voyager",
    title: "Voyager-07: The Deep Space Chronicles",
    description: "Humanity's deep space quantum exploration vessel journeys past the boundaries of the Solar System to rescue crucial scientific intelligence from localized space singularities.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    category: "Science Fiction",
    language: "en",
    authorId: "system_author_3",
    authorName: "Farhan Ahmed",
    authorPhotoUrl: "",
    totalChapters: 2,
    views: 1890,
    likes: 412,
    ratingTotal: 840,
    ratingCount: 175,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "series_monsoon",
    title: "The Letter on a Monsoon Afternoon",
    description: "A poignant, heart-touching narrative unfolding over generations on a rainy Bengal afternoon, exploring timeless bonds, music, and unspoken confessions.",
    coverImage: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=600&q=80",
    category: "Social",
    language: "en",
    authorId: "system_author_1",
    authorName: "Kazi Aniruddha",
    authorPhotoUrl: "",
    totalChapters: 1,
    views: 980,
    likes: 184,
    ratingTotal: 345,
    ratingCount: 72,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

const SEED_CHAPTERS = [
  {
    id: "chap_raygarh_1",
    seriesId: "series_raygarh",
    chapterNumber: 1,
    chapterTitle: "Chapter 1: The Gateway of Shadows",
    readingTimeMin: 4,
    authorUid: "system_author_2",
    authorName: "Dr. Soumik Majumdar",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    views: 920,
    likes: 198,
    content: "As the crimson sunset of the Deccan plateau faded against the abandoned fortress gates of Raygarh, archeologist Arka and his research associate Sayan stood before the subterranean stairway.\n\nBeaming their high-intensity searchlights into the cool air, they descended past century-old basalt masonry. In the center of the underground vault sat a massive mahogany coffer wrapped in bronze bands, engraved with ancient Brahmi verses.\n\nSayan whispered with bated breath, 'Look here! The final line warns: Whoever touches this with greed in their heart shall never witness sunlight again.'\n\nCarefully, Arka inserted the antique brass key. The vault lock clicked. Inside, instead of gold, rested an engraved copper treaty map of forgotten kingdoms and a glowing quartz prism."
  },
  {
    id: "chap_raygarh_2",
    seriesId: "series_raygarh",
    chapterNumber: 2,
    chapterTitle: "Chapter 2: The Chamber of Echoes",
    readingTimeMin: 5,
    authorUid: "system_author_2",
    authorName: "Dr. Soumik Majumdar",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    views: 500,
    likes: 97,
    content: "The quartz prism reflected the beam of their flashlight into a dazzling kaleidoscope of azure and gold across the chamber walls. Hidden relief inscriptions emerged from behind the dust.\n\n'This isn't an armory or a treasury,' Arka whispered, studying the intricate celestial constellations carved into the roof. 'This was the royal observatory of King Yashovardhan. The ancients documented planetary alignments here that modern astronomers have only begun to predict.'\n\nSuddenly, the heavy slab behind them shifted with a dull scrape. A cool draft swept through the subterranean corridor, carrying with it the faint scent of wild mountain jasmine from high above. Somewhere beyond the stone barrier, a hidden passage was opening."
  },
  {
    id: "chap_voyager_1",
    seriesId: "series_voyager",
    chapterNumber: 1,
    chapterTitle: "Chapter 1: The Final Transmission",
    readingTimeMin: 4,
    authorUid: "system_author_3",
    authorName: "Farhan Ahmed",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    views: 1120,
    likes: 245,
    content: "Four light-years from Earth, cruising quietly around Proxima Centauri B, exploratory vessel Voyager-07 registered an anomaly. The onboard computer system chimed with alert:\n\n'Captain Rayan, main fusion core capacity is down to eight percent. Gravitational pull from the localized singularity exceeds expected parameters.'\n\nRayan looked at astrophysicist Dr. Nadia, who had just finished encoding the newly discovered atmospheric data of the habitable planet onto a quantum crystal chip. This was humanity's beacon of survival.\n\n'Can we transmit to Earth?' Rayan asked.\n\n'Only if we disengage defensive deflectors, Captain. Cosmic debris will compromise the hull immediately after.'\n\nRayan nodded without hesitation. 'Disengage deflectors. Transmit the beacon to Earth.'\n\nA brilliant sapphire beam pierced the cosmic dark, racing towards Earth. The mission had succeeded."
  },
  {
    id: "chap_voyager_2",
    seriesId: "series_voyager",
    chapterNumber: 2,
    chapterTitle: "Chapter 2: Signals from the Void",
    readingTimeMin: 4,
    authorUid: "system_author_3",
    authorName: "Farhan Ahmed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    views: 770,
    likes: 167,
    content: "Contrary to all predictions, the hull did not shatter. As the sapphire transmission beam pulsed into interstellar space, the gravitational turbulence around Voyager-07 abruptly neutralized.\n\nDr. Nadia gasped at the sensor console. 'Rayan, look at the harmonic resonance frequencies. The singularity isn't a natural black hole. It's an artificial space gate.'\n\nOn the main optical viewport, the swirling dark horizon shifted, revealing a luminous geometric gateway stretching hundreds of kilometers across the void. Beyond it lay a star cluster unknown to human star charts—beckoning the explorers onward."
  },
  {
    id: "chap_monsoon_1",
    seriesId: "series_monsoon",
    chapterNumber: 1,
    chapterTitle: "Chapter 1: The Amber Envelope",
    readingTimeMin: 4,
    authorUid: "system_author_1",
    authorName: "Kazi Aniruddha",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    views: 980,
    likes: 184,
    content: "On a melancholic afternoon in the midst of July monsoons, rain tapped rhythmic beats against the vintage tin roof. Nilima, tidying her ancestral oak drawer, stumbled across an aged, amber envelope. Written across it in royal blue ink was her name—a handwriting unmistakably familiar, untouched by the sands of time.\n\nShe unfolded the delicate parchment and began to read:\n\n'Dearest Nilu,\nI know this letter may only reach your hands across the turning of many seasons. You might now be content in your settled world. Yet, on that quiet evening in the library corner, the unspoken words we left behind still echo gently in my heart. We had merely wished for a quiet life, where rainy afternoons brought warm tea and evergreen songs. Though destiny carved differing journeys for us, within the pages of memory, you remain everlasting.'\n\nA quiet tear dropped onto the parchment. Beyond the window, thunder resonated across the horizon. Time flows ceaselessly like a river, yet certain sentiments remain timeless. Just like this monsoon, refreshing memories carved years ago."
  }
];

const Storage = (() => {
  // Utility: calculate reading time in minutes
  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // Utility: fallback initials for author avatar
  const getAuthorInitials = (name) => {
    if (!name) return 'AU';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Number formatting supporting Indian numeral styles
  const toLocalNumber = (num, langCode = 'en') => {
    if (num === undefined || num === null) return '0';
    if (langCode === 'bn') {
      const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return num.toString().replace(/[0-9]/g, (d) => bengaliDigits[parseInt(d, 10)]);
    } else if (langCode === 'hi' || langCode === 'mr') {
      const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      return num.toString().replace(/[0-9]/g, (d) => devanagariDigits[parseInt(d, 10)]);
    }
    return num.toLocaleString('en-IN');
  };

  // Local Cache Helpers
  const getLocalSeriesCache = () => {
    try {
      const data = localStorage.getItem(LOCAL_SERIES_CACHE_KEY);
      return data ? JSON.parse(data) : SEED_SERIES;
    } catch {
      return SEED_SERIES;
    }
  };

  const setLocalSeriesCache = (seriesList) => {
    try {
      localStorage.setItem(LOCAL_SERIES_CACHE_KEY, JSON.stringify(seriesList));
    } catch (e) {
      console.warn("Storage quota:", e);
    }
  };

  const getLocalChaptersCache = () => {
    try {
      const data = localStorage.getItem(LOCAL_CHAPTERS_CACHE_KEY);
      return data ? JSON.parse(data) : SEED_CHAPTERS;
    } catch {
      return SEED_CHAPTERS;
    }
  };

  const setLocalChaptersCache = (chapters) => {
    try {
      localStorage.setItem(LOCAL_CHAPTERS_CACHE_KEY, JSON.stringify(chapters));
    } catch (e) {
      console.warn("Storage quota:", e);
    }
  };

  // Likes Storage Helpers (Local & Firestore)
  const getLikedSet = () => {
    try {
      const raw = localStorage.getItem(LOCAL_LIKES_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  };

  const setLikedSet = (setObj) => {
    try {
      localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(Array.from(setObj)));
    } catch {}
  };

  // Ratings Storage Helpers
  const getRatingsMap = () => {
    try {
      const raw = localStorage.getItem(LOCAL_RATINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const setRatingInMap = (itemId, stars) => {
    try {
      const map = getRatingsMap();
      map[itemId] = stars;
      localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(map));
    } catch {}
  };

  return {
    toLocalNumber,
    calculateReadingTime,
    getAuthorInitials,
    auth,
    db,

    // ==========================================
    // AUTHENTICATION MODULE
    // ==========================================
    signup: async (email, password, displayName) => {
      try {
        await persistencePromise;
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } catch (pErr) {
        console.warn("Persistence notice:", pErr);
      }

      const userCredential = await auth.createUserWithEmailAndPassword(email.trim(), password);
      const user = userCredential.user;

      if (displayName && user) {
        await user.updateProfile({
          displayName: displayName.trim()
        });
      }

      // Save initial profile in Firestore
      try {
        await db.collection("users").doc(user.uid).set({
          name: displayName ? displayName.trim() : 'Author',
          email: user.email,
          bio: 'Storyteller & reader on Bharat e-Library.',
          avatar: '',
          joinedDate: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("User profile sync error:", err);
      }

      return user;
    },

    login: async (email, password) => {
      try {
        await persistencePromise;
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } catch (pErr) {
        console.warn("Persistence notice:", pErr);
      }

      const userCredential = await auth.signInWithEmailAndPassword(email.trim(), password);
      return userCredential.user;
    },

    logout: async () => {
      await auth.signOut();
    },

    getCurrentUser: () => {
      return auth.currentUser;
    },

    get currentUser() {
      return auth.currentUser;
    },

    onAuthStateChanged: (callback) => {
      return auth.onAuthStateChanged(async (user) => {
        if (user) {
          // Sync user's likes and ratings from Firestore to local cache
          try {
            const likesSnap = await db.collection("users").doc(user.uid).collection("likes").get();
            const likedSet = getLikedSet();
            likesSnap.forEach((doc) => likedSet.add(doc.id));
            setLikedSet(likedSet);

            const ratingsSnap = await db.collection("users").doc(user.uid).collection("ratings").get();
            const map = getRatingsMap();
            ratingsSnap.forEach((doc) => {
              const data = doc.data();
              if (data && data.rating) map[doc.id] = data.rating;
            });
            localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(map));
          } catch (syncErr) {
            console.warn("Error syncing user data:", syncErr);
          }
        }
        if (typeof callback === 'function') {
          callback(user);
        }
      });
    },

    // User Profile
    getUserProfile: async (uid) => {
      if (!uid) return null;
      try {
        const doc = await db.collection("users").doc(uid).get();
        if (doc.exists) {
          const profile = doc.data();
          localStorage.setItem(LOCAL_USER_PROFILE_KEY + '_' + uid, JSON.stringify(profile));
          return profile;
        }
      } catch (e) {
        console.warn("Error fetching user profile:", e);
      }

      try {
        const cached = localStorage.getItem(LOCAL_USER_PROFILE_KEY + '_' + uid);
        if (cached) return JSON.parse(cached);
      } catch {}

      const user = auth.currentUser;
      return {
        name: (user && user.displayName) || 'Author',
        email: (user && user.email) || '',
        bio: 'Storyteller & reader on Bharat e-Library.',
        avatar: '',
        joinedDate: new Date().toISOString()
      };
    },

    updateUserProfile: async ({ name, bio, avatar }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required.");

      const payload = {
        name: name.trim() || user.displayName || 'Author',
        bio: bio ? bio.trim() : '',
        avatar: avatar ? avatar.trim() : '',
        email: user.email,
        updatedAt: new Date().toISOString()
      };

      await user.updateProfile({
        displayName: payload.name,
        photoURL: payload.avatar || null
      });

      try {
        await db.collection("users").doc(user.uid).set(payload, { merge: true });
      } catch (err) {
        console.warn("Firestore user profile save error:", err);
      }

      localStorage.setItem(LOCAL_USER_PROFILE_KEY + '_' + user.uid, JSON.stringify(payload));
      return payload;
    },

    // ==========================================
    // SERIES & BOOKS MODULE
    // ==========================================
    fetchSeries: async () => {
      try {
        const snapshot = await db.collection("series").orderBy("createdAt", "desc").get();
        if (!snapshot.empty) {
          const remoteSeries = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            let createdDate = new Date();
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              createdDate = data.createdAt.toDate();
            } else if (data.createdAt) {
              createdDate = new Date(data.createdAt);
            }
            remoteSeries.push({
              id: doc.id,
              ...data,
              createdAt: createdDate.toISOString()
            });
          });
          setLocalSeriesCache(remoteSeries);
          return remoteSeries;
        } else {
          // Seed initial demo series to Firestore
          for (const s of SEED_SERIES) {
            try {
              await db.collection("series").doc(s.id).set({
                ...s,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            } catch (seedErr) {}
          }
          // Seed initial demo chapters
          for (const c of SEED_CHAPTERS) {
            try {
              await db.collection("chapters").doc(c.id).set({
                ...c,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            } catch (seedErr) {}
          }
          return SEED_SERIES;
        }
      } catch (err) {
        console.warn("Firestore fetchSeries notice, using cached data:", err);
        return getLocalSeriesCache();
      }
    },

    fetchChaptersForSeries: async (seriesId) => {
      if (!seriesId) return [];
      try {
        const snapshot = await db.collection("chapters")
          .where("seriesId", "==", seriesId)
          .get();

        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            let createdDate = new Date();
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              createdDate = data.createdAt.toDate();
            } else if (data.createdAt) {
              createdDate = new Date(data.createdAt);
            }
            list.push({
              id: doc.id,
              ...data,
              createdAt: createdDate.toISOString()
            });
          });

          // Sort chronologically by chapterNumber ascending
          list.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
          return list;
        }
      } catch (err) {
        console.warn("Firestore fetchChapters error, checking local cache:", err);
      }

      // Fallback from local cache
      const cached = getLocalChaptersCache();
      return cached
        .filter((c) => c.seriesId === seriesId)
        .sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    },

    fetchUserSeries: async (authorUid) => {
      if (!authorUid) return [];
      try {
        const snapshot = await db.collection("series")
          .where("authorId", "==", authorUid)
          .get();

        const userSeries = [];
        snapshot.forEach((doc) => {
          userSeries.push({ id: doc.id, ...doc.data() });
        });
        return userSeries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (e) {
        const cached = getLocalSeriesCache();
        return cached.filter((s) => s.authorId === authorUid);
      }
    },

    // Create a new Story / Book Series with its initial Chapter 1
    createSeriesWithChapter: async ({ title, description, coverImage, category, language, chapterTitle, content, authorName, authorPhotoUrl }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required to publish.");

      const seriesId = 'series_' + Date.now();
      const chapterId = 'chap_' + Date.now() + '_1';
      const readTime = calculateReadingTime(content);

      const seriesPayload = {
        id: seriesId,
        title: title.trim(),
        description: description ? description.trim() : '',
        coverImage: coverImage ? coverImage.trim() : '',
        category: category || 'Short Stories',
        language: language || 'en',
        authorId: user.uid,
        authorName: authorName.trim() || user.displayName || 'Author',
        authorPhotoUrl: authorPhotoUrl || user.photoURL || '',
        totalChapters: 1,
        views: 0,
        likes: 0,
        ratingTotal: 0,
        ratingCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const chapterPayload = {
        id: chapterId,
        seriesId: seriesId,
        chapterNumber: 1,
        chapterTitle: chapterTitle ? chapterTitle.trim() : 'Chapter 1',
        content: content.trim(),
        readingTimeMin: readTime,
        authorUid: user.uid,
        authorName: seriesPayload.authorName,
        views: 0,
        likes: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        await db.collection("series").doc(seriesId).set(seriesPayload);
        await db.collection("chapters").doc(chapterId).set(chapterPayload);
      } catch (err) {
        console.error("Firestore publish error:", err);
      }

      // Update local caches
      const localSeries = getLocalSeriesCache();
      const clientSeries = {
        ...seriesPayload,
        createdAt: new Date().toISOString()
      };
      localSeries.unshift(clientSeries);
      setLocalSeriesCache(localSeries);

      const localChapters = getLocalChaptersCache();
      const clientChapter = {
        ...chapterPayload,
        createdAt: new Date().toISOString()
      };
      localChapters.push(clientChapter);
      setLocalChaptersCache(localChapters);

      return {
        series: clientSeries,
        chapter: clientChapter
      };
    },

    // Add a new Chapter to an existing Story / Series
    addChapterToSeries: async ({ seriesId, chapterTitle, content, chapterNumber }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required.");

      const chapterId = 'chap_' + Date.now() + '_' + chapterNumber;
      const readTime = calculateReadingTime(content);

      const chapterPayload = {
        id: chapterId,
        seriesId: seriesId,
        chapterNumber: parseInt(chapterNumber, 10),
        chapterTitle: chapterTitle.trim(),
        content: content.trim(),
        readingTimeMin: readTime,
        authorUid: user.uid,
        authorName: user.displayName || 'Author',
        views: 0,
        likes: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        // Write chapter
        await db.collection("chapters").doc(chapterId).set(chapterPayload);

        // Update series total chapters
        await db.collection("series").doc(seriesId).update({
          totalChapters: firebase.firestore.FieldValue.increment(1)
        });
      } catch (err) {
        console.error("Firestore add chapter error:", err);
      }

      // Update local chapters
      const localChapters = getLocalChaptersCache();
      const clientChapter = {
        ...chapterPayload,
        createdAt: new Date().toISOString()
      };
      localChapters.push(clientChapter);
      setLocalChaptersCache(localChapters);

      // Update local series total chapters
      const localSeries = getLocalSeriesCache();
      const s = localSeries.find((item) => item.id === seriesId);
      if (s) {
        s.totalChapters = (s.totalChapters || 1) + 1;
        setLocalSeriesCache(localSeries);
      }

      return clientChapter;
    },

    deleteSeries: async (seriesId) => {
      const user = auth.currentUser;
      if (!user) throw new Error("Permission denied.");

      try {
        await db.collection("series").doc(seriesId).delete();
        // Also delete associated chapters
        const chapSnap = await db.collection("chapters").where("seriesId", "==", seriesId).get();
        chapSnap.forEach(async (d) => {
          try { await d.ref.delete(); } catch {}
        });
      } catch (err) {
        console.error("Firestore delete series error:", err);
      }

      const seriesList = getLocalSeriesCache().filter((s) => s.id !== seriesId);
      setLocalSeriesCache(seriesList);

      const chapList = getLocalChaptersCache().filter((c) => c.seriesId !== seriesId);
      setLocalChaptersCache(chapList);

      return true;
    },

    // ==========================================
    // INTERACTIVE ENGAGEMENT: LIKES & RATINGS
    // ==========================================

    // Interactive Like Toggle (Like & Unlike)
    toggleLike: async (seriesId) => {
      const likedSet = getLikedSet();
      const isCurrentlyLiked = likedSet.has(seriesId);
      const user = auth.currentUser;

      if (!isCurrentlyLiked) {
        // LIKE: Increment count
        likedSet.add(seriesId);
        setLikedSet(likedSet);

        // Firestore series counter increment
        try {
          await db.collection("series").doc(seriesId).update({
            likes: firebase.firestore.FieldValue.increment(1)
          });
        } catch {
          // If in legacy stories collection
          try {
            await db.collection("stories").doc(seriesId).update({
              likes: firebase.firestore.FieldValue.increment(1)
            });
          } catch {}
        }

        // Store user like record in profile subcollection if signed in
        if (user) {
          try {
            await db.collection("users").doc(user.uid).collection("likes").doc(seriesId).set({
              likedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          } catch {}
        }

        // Local cache update
        const seriesList = getLocalSeriesCache();
        const s = seriesList.find((item) => item.id === seriesId);
        if (s) {
          s.likes = (s.likes || 0) + 1;
          setLocalSeriesCache(seriesList);
        }

        return { liked: true, countDelta: 1 };
      } else {
        // UNLIKE: Decrement count
        likedSet.delete(seriesId);
        setLikedSet(likedSet);

        try {
          await db.collection("series").doc(seriesId).update({
            likes: firebase.firestore.FieldValue.increment(-1)
          });
        } catch {
          try {
            await db.collection("stories").doc(seriesId).update({
              likes: firebase.firestore.FieldValue.increment(-1)
            });
          } catch {}
        }

        if (user) {
          try {
            await db.collection("users").doc(user.uid).collection("likes").doc(seriesId).delete();
          } catch {}
        }

        const seriesList = getLocalSeriesCache();
        const s = seriesList.find((item) => item.id === seriesId);
        if (s) {
          s.likes = Math.max(0, (s.likes || 1) - 1);
          setLocalSeriesCache(seriesList);
        }

        return { liked: false, countDelta: -1 };
      }
    },

    isItemLiked: (seriesId) => {
      const likedSet = getLikedSet();
      return likedSet.has(seriesId);
    },

    // Interactive 1 to 5 Star Rating
    submitRating: async (seriesId, starValue) => {
      const val = Math.min(5, Math.max(1, parseInt(starValue, 10)));
      const previousRating = Storage.getUserRating(seriesId);

      // If user already rated, we update their rating or prevent double counting
      const user = auth.currentUser;
      const isNewRating = !previousRating || previousRating === 0;

      try {
        if (isNewRating) {
          await db.collection("series").doc(seriesId).update({
            ratingTotal: firebase.firestore.FieldValue.increment(val),
            ratingCount: firebase.firestore.FieldValue.increment(1)
          });
        } else {
          // Adjust rating total by difference
          const diff = val - previousRating;
          await db.collection("series").doc(seriesId).update({
            ratingTotal: firebase.firestore.FieldValue.increment(diff)
          });
        }
      } catch {
        // Fallback for legacy stories
        try {
          if (isNewRating) {
            await db.collection("stories").doc(seriesId).update({
              ratingTotal: firebase.firestore.FieldValue.increment(val),
              ratingCount: firebase.firestore.FieldValue.increment(1)
            });
          }
        } catch {}
      }

      // Save user rating record in profile subcollection if signed in
      if (user) {
        try {
          await db.collection("users").doc(user.uid).collection("ratings").doc(seriesId).set({
            rating: val,
            ratedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch {}
      }

      // Store in local map
      setRatingInMap(seriesId, val);

      // Update local series cache
      const seriesList = getLocalSeriesCache();
      const s = seriesList.find((item) => item.id === seriesId);
      if (s) {
        if (isNewRating) {
          s.ratingTotal = (s.ratingTotal || 0) + val;
          s.ratingCount = (s.ratingCount || 0) + 1;
        } else {
          s.ratingTotal = (s.ratingTotal || 0) + (val - previousRating);
        }
        setLocalSeriesCache(seriesList);
      }

      return { rating: val, isNew: isNewRating };
    },

    getUserRating: (seriesId) => {
      const map = getRatingsMap();
      return map[seriesId] || 0;
    },

    // Increments
    incrementView: async (seriesId) => {
      try {
        await db.collection("series").doc(seriesId).update({
          views: firebase.firestore.FieldValue.increment(1)
        });
      } catch {
        try {
          await db.collection("stories").doc(seriesId).update({
            views: firebase.firestore.FieldValue.increment(1)
          });
        } catch {}
      }

      const seriesList = getLocalSeriesCache();
      const s = seriesList.find((item) => item.id === seriesId);
      if (s) {
        s.views = (s.views || 0) + 1;
        setLocalSeriesCache(seriesList);
      }
    },

    incrementChapterView: async (chapterId) => {
      try {
        await db.collection("chapters").doc(chapterId).update({
          views: firebase.firestore.FieldValue.increment(1)
        });
      } catch {}

      const chaps = getLocalChaptersCache();
      const c = chaps.find((item) => item.id === chapterId);
      if (c) {
        c.views = (c.views || 0) + 1;
        setLocalChaptersCache(chaps);
      }
    },

    // Cache Clearance
    clearLocalCache: () => {
      localStorage.removeItem(LOCAL_SERIES_CACHE_KEY);
      localStorage.removeItem(LOCAL_CHAPTERS_CACHE_KEY);
      localStorage.removeItem(LOCAL_RATINGS_KEY);
      localStorage.removeItem(LOCAL_LIKES_KEY);
      return true;
    }
  };
})();
