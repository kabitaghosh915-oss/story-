// js/app.js

const App = (() => {
    let currentPage = 'library';

    // ট্যাব সুইচিং ও পেজ পরিবর্তন
    const navigateTo = (page, storyId = null) => {
        currentPage = page;

        // ট্যাব অ্যাক্টিভ স্টেট পরিবর্তন
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === page) {
                btn.classList.add('active');
            }
        });

        // হেডার টাইটেল পরিবর্তন
        const titleEl = document.getElementById('page-title');
        switch (page) {
            case 'library':
                titleEl.textContent = 'লাইব্রেরি';
                Library.init();
                break;
            case 'writer':
                titleEl.textContent = storyId ? 'সম্পাদনা' : 'নতুন গল্প';
                Writer.openEditor(storyId);
                break;
            case 'bookmarks':
                titleEl.textContent = 'বুকমার্ক';
                renderBookmarks();
                break;
            case 'profile':
                titleEl.textContent = 'প্রোফাইল';
                Profile.init();
                break;
            case 'reader':
                titleEl.textContent = 'গল্প পাঠ';
                renderReader(storyId);
                break;
            default:
                titleEl.textContent = 'আমার গল্প';
                Library.init();
        }
    };

    // বুকমার্ক পেজ
    const renderBookmarks = () => {
        const container = document.getElementById('content-area');
        container.innerHTML = '';
        const bookmarks = Storage.getBookmarks();

        if (bookmarks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bookmark fa-3x"></i>
                    <p style="font-weight: 600; margin-top: 10px;">কোনো বুকমার্ক করা গল্প নেই।</p>
                    <p style="font-size: 0.85rem; margin-top: 5px;">লাইব্রেরি থেকে প্রিয় গল্পগুলো বুকমার্কে যোগ করুন।</p>
                </div>
            `;
            return;
        }

        const list = document.createElement('div');
        bookmarks.forEach(id => {
            const story = Storage.getStory(id);
            if (!story) return;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3 class="story-title" onclick="App.openReader('${story.id}')">${escapeHtml(story.title)}</h3>
                <p class="story-snippet">${escapeHtml(story.content.substring(0, 100))}...</p>
                <div class="card-meta">
                    <span>${escapeHtml(story.author || 'লেখক')}</span>
                    <button class="read-btn" onclick="App.openReader('${story.id}')">পড়ুন <i class="fas fa-arrow-right"></i></button>
                </div>
            `;
            list.appendChild(card);
        });
        container.appendChild(list);
    };

    // রিডার পেজ
    const renderReader = (storyId) => {
        const container = document.getElementById('content-area');
        const story = Storage.getStory(storyId);

        if (!story) {
            container.innerHTML = '<div class="empty-state"><p>গল্পটি পাওয়া যায়নি।</p></div>';
            return;
        }

        const isBookmarked = Storage.isBookmarked(story.id);

        container.innerHTML = `
            <div class="reader-container">
                <button id="back-btn" class="read-btn" style="margin-bottom: 12px;">
                    <i class="fas fa-arrow-left"></i> লাইব্রেরিতে ফিরুন
                </button>
                <div class="reader-header">
                    <h2>${escapeHtml(story.title)}</h2>
                    <div style="font-size:0.85rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
                        <span>লেখক: ${escapeHtml(story.author || 'অজ্ঞাত')} | ${escapeHtml(story.category || 'সাধারণ')}</span>
                        <button id="reader-bookmark-btn" class="bookmark-icon-btn ${isBookmarked ? 'active' : ''}">
                            <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                        </button>
                    </div>
                </div>

                <div class="reader-content">${escapeHtml(story.content)}</div>

                <div class="reader-actions">
                    <button id="edit-from-reader" class="primary-btn">
                        <i class="fas fa-edit"></i> সম্পাদনা করুন
                    </button>
                </div>
            </div>
        `;

        document.getElementById('back-btn').addEventListener('click', () => {
            navigateTo('library');
        });

        document.getElementById('edit-from-reader').addEventListener('click', () => {
            navigateTo('writer', story.id);
        });

        document.getElementById('reader-bookmark-btn').addEventListener('click', () => {
            Storage.toggleBookmark(story.id);
            renderReader(story.id);
        });
    };

    // থিম টগল
    const initTheme = () => {
        const toggleBtn = document.getElementById('theme-toggle');
        const isDark = localStorage.getItem('vanilla_theme') === 'dark';

        if (isDark) {
            document.body.classList.add('dark-mode');
            toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const nowDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('vanilla_theme', nowDark ? 'dark' : 'light');
            toggleBtn.innerHTML = nowDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    };

    // নেভিগেশন ইভেন্ট বাইন্ডিং
    const initNav = () => {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.getAttribute('data-page');
                navigateTo(page);
            });
        });
    };

    const escapeHtml = (text) => {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // ইনিশিয়ালাইজেশন
    const init = () => {
        initTheme();
        initNav();
        navigateTo('library');
    };

    return {
        init: init,
        navigateTo: navigateTo,
        openReader: (storyId) => navigateTo('reader', storyId)
    };
})();

// DOM লোড হলে অ্যাপ রান করবে
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
