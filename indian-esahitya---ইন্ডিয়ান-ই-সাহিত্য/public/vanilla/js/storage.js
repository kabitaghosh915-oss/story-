// js/storage.js - Firebase Authentication & Cloud Firestore Controller

// Provided Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyC54GCR46zpyLJ-fMmtl-pIGvs2Y_Ztu-M",
  authDomain: "celestial-sunbeam-h1ttq.firebaseapp.com",
  projectId: "celestial-sunbeam-h1ttq",
  storageBucket: "celestial-sunbeam-h1ttq.firebasestorage.app",
  messagingSenderId: "882142335518",
  appId: "1:882142335518:web:afe8d10e255685cd10140f"
};

// Initialize Firebase App
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Authentication
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

// Set browser local persistence so user authentication state persists across browser sessions & refreshes
if (auth) {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((err) => {
    console.warn("Firebase Auth persistence configuration warning:", err);
  });
}

// Initialize Cloud Firestore (support custom database id & default instance)
const firestoreDbId = "ai-studio-amargolpobengali-3e075996-2374-438a-915e-043e188e5b2f";
let db = null;
if (typeof firebase !== 'undefined') {
  try {
    if (firebase.app().firestore && typeof firebase.app().firestore === 'function') {
      db = firebase.app().firestore(firestoreDbId);
    } else {
      db = firebase.firestore();
    }
  } catch (e) {
    db = firebase.firestore();
  }
}

// Local cache keys for offline-first support
const LOCAL_CACHE_KEY = 'indian_esahitya_stories_cache';
const LOCAL_RATINGS_KEY = 'indian_esahitya_rated_stories';
const LOCAL_LIKES_KEY = 'indian_esahitya_liked_stories';

// Seed demo stories for initial library discovery
const SEED_STORIES = [
  {
    id: "seed_1",
    title: "বৃষ্টি ভেজা বিকেলের চিঠি",
    author: "কাজী অনিরুদ্ধ",
    category: "সামাজিক",
    body: "শ্রাবণের এক বিষাদমাখা বিকেলে পুরোনো টিনের চালে বৃষ্টির টুপটাপ শব্দ হচ্ছিল। নীলিমা ড্রয়ার গোছাতে গিয়ে পুরোনো একখানা হলদেটে খাম খুঁজে পেল। খামের গায়ে নীল রঙের কালিতে তার নাম লেখা—হাতের লেখাটা বড় চেনা, অথচ বহু বছর এই লেখার কোনো চিহ্ন সে দেখেনি。\n\nচিঠিটা খুলে পড়তে শুরু করল নীলিমা।\n\n'প্রিয় নীলু,\nজানি এই চিঠি তোমার হাতে পৌঁছাতে পৌঁছাতে অনেক ঋতু বদলে যাবে। হয়তো তুমি আজ তোমার সাজানো সংসারে ব্যস্ত। তবুও সেদিন বিকেলে লাইব্রেরির কোণে ফেলে আসা না-বলা কথাগুলো আজও আমার বুকের গহীনে গুমরে মরে। আমরা তো চেয়েছিলাম একটা সাধারণ জীবন, যেখানে পড়ন্ত বিকেলে এক কাপ চা আর রবীন্দ্রসঙ্গীত থাকবে। নিয়তি আমাদের পথ আলাদা করে দিলেও, স্মৃতির পাতায় তুমি আজও অমলিন।'\n\nনীলিমার চোখ বেয়ে এক ফোঁটা জল চিঠির কাগজের ওপর ঝরে পড়ল। জানালার বাইরে তখন মেঘের গর্জন। সময় বয়ে চলে নদীর স্রোতের মতো, কিন্তু কিছু অনুভূতি কখনো পুরোনো হয় না। ঠিক যেমন এই বৃষ্টি, বহু বছর আগের সেই স্মৃতিগুলোকে আবার নতুন করে ভিজিয়ে দিয়ে গেল।",
    authorUid: "system_author_1",
    authorEmail: "aniruddha@esahitya.in",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    views: 142,
    likes: 38,
    ratingTotal: 47,
    ratingCount: 10
  },
  {
    id: "seed_2",
    title: "পুরোনো প্রাসাদের গোপন সিন্দুক",
    author: "সৌমিক মজুমদার",
    category: "রহস্য",
    body: "পদ্মার পাড়ে পরিত্যক্ত রায়বাহাদুর জমিদার বাড়ির সিংহদুয়ারে যখন বিকেল সাড়ে পাঁচটার রক্তিম রোদ ম্লান হয়ে এল, তখন প্রত্নতাত্ত্বিক গবেষক অর্ক আর তার সহকারী সায়ন দাঁড়িয়ে ছিল ভাঙা ফটকের সামনে।\n\nটর্চের আলো ফেলে তারা দীর্ঘ স্যাঁতসেঁতে সিঁড়ি বেয়ে নামল মাটির নিচে। বাতাসে জমে থাকা শতবর্ষের ধুলো। ঘরের ঠিক মাঝখানে পাথরের বেদির ওপর রাখা ভারী মেহগনি কাঠের তৈরি এক বিশাল সিন্দুক। সিন্দুকের গায়ে খোদাই করা প্রাচীন ব্রাহ্মী লিপির শ্লোক।\n\nসায়ন কাঁপা হাতে বলল, 'স্যার! এখানে লেখা আছে—যে ব্যক্তি অসৎ উদ্দেশ্য নিয়ে এটি স্পর্শ করবে, সে আর কখনো সূর্যের আলো দেখবে না!'\n\nঅর্ক সাবধানে বিশেষ চাবিটি বের করল। কড়কড় শব্দে সিন্দুকের ডালাটি খুলে গেল। কিন্তু ভেতরে কোনো স্বর্ণমুদ্রা ছিল না; ছিল একটি খাঁটি তামার ফলক আর স্ফটিকের তৈরি অদ্ভুত এক মানচিত্র!",
    authorUid: "system_author_2",
    authorEmail: "soumik@esahitya.in",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    views: 215,
    likes: 54,
    ratingTotal: 72,
    ratingCount: 15
  },
  {
    id: "seed_3",
    title: "মহাকাশযান ‘যাত্রী-০৭’ এর শেষ বার্তা",
    author: "ফারহান আহমেদ",
    category: "বিজ্ঞান",
    body: "পৃথিবী থেকে ৪.২ আলোকবর্ষ দূরে প্রক্সিমা সেন্টরাই বি এর কক্ষপথে নিঃশব্দে ঘুরছিল অনুসন্ধানকারী মহাকাশযান 'যাত্রী-০৭'। জাহাজের কম্পিউটার এআই সতর্কবাণী ঘোষণা করল:\n'ক্যাপ্টেন রায়ান, প্রধান এনার্জি কোরের ক্ষমতা নেমে এসেছে শতকরা আটে। নিকটবর্তী কৃষ্ণগহ্বরের মহাকর্ষীয় টান নির্ধারিত সীমার চেয়ে তিন গুণ বৃদ্ধি পেয়েছে।'\n\nক্যাপ্টেন রায়ান সহকর্মী ড. নাদিয়ার দিকে তাকালেন। নাদিয়া তখন সংগৃহীত নতুন সৌরজগতের ডেটা ক্রিপ্টোগ্রাফিক চিপে এনকোড করছিল। পৃথিবীতে জলবায়ু বিপর্যয়ে কোটি কোটি মানুষের চোখ তাকিয়ে আছে তাদের এই অভিযানের ফলাফলের দিকে।\n\n'মিতালী, প্রতিরক্ষা শিল্ড বন্ধ করো। সিগন্যাল পৃথিবীতে ট্রান্সমিট করো।'\n\nকয়েক সেকেন্ডের মধ্যেই নীল আলোর রশ্মি মহাবিশ্বের অন্ধকার ভেদ করে পৃথিবীর দিকে ছুটে গেল। মানবজাতির নতুন আশার দ্বার উন্মোচিত হলো।",
    authorUid: "system_author_3",
    authorEmail: "farhan@esahitya.in",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    views: 310,
    likes: 89,
    ratingTotal: 120,
    ratingCount: 25
  }
];

const Storage = (() => {
  const toBengaliNumber = (num) => {
    if (num === undefined || num === null) return '০';
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/[0-9]/g, (d) => bengaliDigits[parseInt(d, 10)]);
  };

  const getLocalCache = () => {
    try {
      const data = localStorage.getItem(LOCAL_CACHE_KEY);
      return data ? JSON.parse(data) : SEED_STORIES;
    } catch {
      return SEED_STORIES;
    }
  };

  const setLocalCache = (stories) => {
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(stories));
    } catch (e) {
      console.warn("Storage quota warning:", e);
    }
  };

  return {
    toBengaliNumber,
    auth,
    db,

    // ==========================================
    // FIREBASE AUTHENTICATION MODULE
    // ==========================================

    signup: async (email, password, displayName) => {
      if (auth) {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const userCredential = await auth.createUserWithEmailAndPassword(email.trim(), password);
        const user = userCredential.user;
        if (displayName && user) {
          await user.updateProfile({ displayName: displayName.trim() });
        }
        return user;
      }
      return null;
    },

    signUp: async function(email, password, displayName) {
      return this.signup(email, password, displayName);
    },

    login: async (email, password) => {
      if (auth) {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const userCredential = await auth.signInWithEmailAndPassword(email.trim(), password);
        return userCredential.user;
      }
      return null;
    },

    signIn: async function(email, password) {
      return this.login(email, password);
    },
    signin: async function(email, password) {
      return this.login(email, password);
    },

    logout: async () => {
      if (auth) {
        await auth.signOut();
      }
    },

    signOut: async function() {
      return this.logout();
    },

    getCurrentUser: () => {
      return auth ? auth.currentUser : null;
    },

    get currentUser() {
      return auth ? auth.currentUser : null;
    },

    onAuthStateChanged: (callback) => {
      if (auth) {
        return auth.onAuthStateChanged((user) => {
          if (typeof callback === 'function') {
            callback(user);
          }
        });
      }
      return () => {};
    },

    // ==========================================
    // CLOUD FIRESTORE CRUD MODULE
    // ==========================================

    fetchStories: async () => {
      if (!db) return getLocalCache();
      try {
        const snapshot = await db.collection("stories").orderBy("createdAt", "desc").get();
        if (!snapshot.empty) {
          const remoteStories = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            let createdDate = new Date();
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              createdDate = data.createdAt.toDate();
            } else if (data.createdAt) {
              createdDate = new Date(data.createdAt);
            }
            remoteStories.push({
              id: doc.id,
              ...data,
              createdAt: createdDate.toISOString()
            });
          });
          setLocalCache(remoteStories);
          return remoteStories;
        } else {
          for (const s of SEED_STORIES) {
            try {
              await db.collection("stories").doc(s.id).set({
                ...s,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            } catch (seedErr) {}
          }
          return SEED_STORIES;
        }
      } catch (err) {
        return getLocalCache();
      }
    },

    publishStory: async ({ title, author, category, body }) => {
      const user = auth ? auth.currentUser : null;
      if (!user) {
        throw new Error("গল্প প্রকাশ করতে আপনাকে অবশ্যই লগইন করতে হবে।");
      }

      const storyId = 'story_' + Date.now();
      const storyPayload = {
        id: storyId,
        title: title.trim(),
        author: author.trim() || user.displayName || 'লেখক',
        category: category || 'গল্প',
        body: body.trim(),
        authorUid: user.uid,
        authorEmail: user.email || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        views: 0,
        likes: 0,
        ratingTotal: 0,
        ratingCount: 0
      };

      if (db) {
        try {
          await db.collection("stories").doc(storyId).set(storyPayload);
        } catch (err) {
          const local = getLocalCache();
          local.unshift({ ...storyPayload, createdAt: new Date().toISOString() });
          setLocalCache(local);
        }
      }

      return {
        ...storyPayload,
        createdAt: new Date().toISOString()
      };
    },

    incrementView: async (storyId) => {
      if (db) {
        try {
          await db.collection("stories").doc(storyId).update({
            views: firebase.firestore.FieldValue.increment(1)
          });
        } catch {}
      }
    },

    updateLike: async (storyId) => {
      if (Storage.hasLiked(storyId)) return false;

      if (db) {
        try {
          await db.collection("stories").doc(storyId).update({
            likes: firebase.firestore.FieldValue.increment(1)
          });
        } catch {}
      }

      try {
        const likedList = JSON.parse(localStorage.getItem(LOCAL_LIKES_KEY) || '[]');
        likedList.push(storyId);
        localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(likedList));
      } catch {}

      return true;
    },

    hasLiked: (storyId) => {
      try {
        const likedList = JSON.parse(localStorage.getItem(LOCAL_LIKES_KEY) || '[]');
        return likedList.includes(storyId);
      } catch {
        return false;
      }
    },

    updateRating: async (storyId, starValue) => {
      const val = Math.min(5, Math.max(1, parseInt(starValue, 10)));
      if (db) {
        try {
          await db.collection("stories").doc(storyId).update({
            ratingTotal: firebase.firestore.FieldValue.increment(val),
            ratingCount: firebase.firestore.FieldValue.increment(1)
          });
        } catch {}
      }

      try {
        const ratedMap = JSON.parse(localStorage.getItem(LOCAL_RATINGS_KEY) || '{}');
        ratedMap[storyId] = val;
        localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(ratedMap));
      } catch {}

      return true;
    },

    getUserRating: (storyId) => {
      try {
        const ratedMap = JSON.parse(localStorage.getItem(LOCAL_RATINGS_KEY) || '{}');
        return ratedMap[storyId] || 0;
      } catch {
        return 0;
      }
    },

    deleteStory: async (storyId) => {
      if (db) {
        try {
          await db.collection("stories").doc(storyId).delete();
        } catch {}
      }
      const stories = getLocalCache().filter((s) => s.id !== storyId);
      setLocalCache(stories);
      return true;
    }
  };
})();
