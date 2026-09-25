// js/library.js

const Library = (() => {
    const container = () => document.getElementById('content-area');

    // UI রেন্ডার করা
    const render = () => {
        const c = container();
        c.innerHTML = '';
        const stories = Storage.getAllStories();
        const bookmarks = Storage.getBookmarks();

        if (stories.length === 0) {
            c.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open fa-3x"></i>
                    <p style="font-weight: 600; margin-top: 10px;">কোনো গল্প পাওয়া যায়নি।</p>
                    <p style="font-size: 0.85rem; margin-top: 5px;">'লিখুন' ট্যাবে গিয়ে আপনার নতুন গল্প শুরু করুন।</p>
                </div>
            `;
            return;
        }

        const storiesList = document.createElement('div');
        storiesList.className = 'stories-list';

        stories.forEach(story => {
            const card = document.createElement('div');
            card.className = 'card story-card';
            
            const date = new Date(story.updatedAt).toLocaleDateString('bn-BD', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const isBookmarked = bookmarks.includes(story.id);

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                    <span style="font-size:0.75rem; color:var(--primary-color); font-weight:600;">${escapeHtml(story.category || 'গল্প')}</span>
                    <button class="bookmark-icon-btn ${isBookmarked ? 'active' : ''}" data-bookmark="${story.id}" title="বুকমার্ক">
                        <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                </div>
                <h3 class="story-title" data-id="${story.id}">${escapeHtml(story.title)}</h3>
                <p class="story-snippet">${escapeHtml(story.content.substring(0, 110))}...</p>
                <div class="card-meta">
                    <span><i class="far fa-user"></i> ${escapeHtml(story.author || 'লেখক')} · <i class="far fa-clock"></i> ${date}</span>
                    <button class="read-btn" data-id="${story.id}">পড়ুন <i class="fas fa-arrow-right"></i></button>
                </div>
            `;
            storiesList.appendChild(card);
        });

        c.appendChild(storiesList);

        // গল্প পড়ার ক্লিক লিসেনার
        c.querySelectorAll('.read-btn, .story-title').forEach(btn => {
            btn.addEventListener('click', () => {
                const storyId = btn.getAttribute('data-id');
                App.openReader(storyId);
            });
        });

        // বুকমার্ক টগল
        c.querySelectorAll('.bookmark-icon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const storyId = btn.getAttribute('data-bookmark');
                Storage.toggleBookmark(storyId);
                render();
            });
        });
    };

    // Helper escapeHtml
    const escapeHtml = (text) => {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    return {
        init: render
    };
})();
