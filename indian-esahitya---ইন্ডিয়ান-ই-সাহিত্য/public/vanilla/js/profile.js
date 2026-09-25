// js/profile.js

const Profile = (() => {
    const container = () => document.getElementById('content-area');

    const render = () => {
        const c = container();
        const profile = Storage.getProfile();
        const stories = Storage.getAllStories();
        const bookmarks = Storage.getBookmarks();

        const totalWords = stories.reduce((sum, s) => {
            const count = s.content ? s.content.trim().split(/\s+/).length : 0;
            return sum + count;
        }, 0);

        c.innerHTML = `
            <div class="card profile-card">
                <div class="profile-avatar">${profile.avatar || '✍️'}</div>
                <h2 style="font-size:1.3rem; margin-bottom: 4px;">${escapeHtml(profile.name || 'লেখক')}</h2>
                <p style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(profile.bio || 'বাংলা সাহিত্য ও গল্প ভালোবাসেন।')}</p>

                <div class="profile-stats">
                    <div class="stat-box">
                        <div class="stat-value">${toBengali(stories.length)}</div>
                        <div class="stat-label">মোট গল্প</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${toBengali(totalWords)}</div>
                        <div class="stat-label">মোট শব্দ</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${toBengali(bookmarks.length)}</div>
                        <div class="stat-label">বুকমার্ক</div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top: 15px;">
                <h3 style="font-size:1rem; margin-bottom: 12px; display:flex; align-items:center; gap:8px;">
                    <i class="fas fa-bookmark" style="color:var(--primary-color);"></i>
                    সংরক্ষিত গল্পসমূহ
                </h3>

                ${bookmarks.length === 0 ? `
                    <p style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:15px;">কোনো বুকমার্ক করা গল্প নেই।</p>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${bookmarks.map(bId => {
                            const st = Storage.getStory(bId);
                            if (!st) return '';
                            return `
                                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-color);">
                                    <span style="font-size:0.9rem; font-weight:600; cursor:pointer;" onclick="App.openReader('${st.id}')">${escapeHtml(st.title)}</span>
                                    <button class="read-btn" onclick="App.openReader('${st.id}')">পড়ুন</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>

            <div class="card" style="margin-top: 15px;">
                <h3 style="font-size:1rem; margin-bottom: 12px;">অতিরিক্ত সেটিংস</h3>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <button class="primary-btn" id="export-btn" style="justify-content:center;">
                        <i class="fas fa-download"></i> ব্যাকআপ ডাউনলোড (JSON)
                    </button>
                    <button class="danger-btn" id="reset-btn" style="justify-content:center; text-align:center;">
                        <i class="fas fa-undo"></i> ডিফল্ট গল্পে ফেরত যান
                    </button>
                </div>
            </div>
        `;

        // ইভেন্ট লিসেনার
        document.getElementById('export-btn')?.addEventListener('click', () => {
            const dataStr = localStorage.getItem('my_story_app_db');
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'amar-golpo-backup.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        document.getElementById('reset-btn')?.addEventListener('click', () => {
            if (confirm('আপনি কি সব গল্প ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
                localStorage.removeItem('my_story_app_db');
                alert('রিসেট সম্পন্ন হয়েছে!');
                App.navigateTo('library');
            }
        });
    };

    const toBengali = (num) => {
        const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
        return num.toString().replace(/[0-9]/g, d => bengaliDigits[parseInt(d)]);
    };

    const escapeHtml = (text) => {
        if (!text) return '';
        return text.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };

    return {
        init: render
    };
})();
