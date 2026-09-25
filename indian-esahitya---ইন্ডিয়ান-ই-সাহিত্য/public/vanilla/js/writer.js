// js/writer.js

const Writer = (() => {
    const container = () => document.getElementById('content-area');
    let currentEditingId = null;

    // এডিটর UI রেন্ডার করা
    const render = (storyId = null) => {
        currentEditingId = storyId;
        let story = { title: '', content: '', category: 'সামাজিক', author: 'কবিতা ঘোষ' };

        if (storyId) {
            const found = Storage.getStory(storyId);
            if (found) {
                story = found;
            }
        }

        const c = container();
        c.innerHTML = `
            <div class="writer-container">
                <input type="text" id="story-title-input" placeholder="গল্পের আকর্ষণীয় শিরোনাম" value="${escapeHtml(story.title)}">
                
                <div style="display:flex; gap:10px;">
                    <select id="story-category-input" style="flex:1;">
                        <option value="সামাজিক" ${story.category === 'সামাজিক' ? 'selected' : ''}>সামাজিক</option>
                        <option value="রোমাঞ্চ" ${story.category === 'রোমাঞ্চ' ? 'selected' : ''}>রোমাঞ্চ</option>
                        <option value="রহস্য" ${story.category === 'রহস্য' ? 'selected' : ''}>রহস্য</option>
                        <option value="ভৌতিক" ${story.category === 'ভৌতিক' ? 'selected' : ''}>ভৌতিক</option>
                        <option value="রূপকথা" ${story.category === 'রূপকথা' ? 'selected' : ''}>রূপকথা</option>
                        <option value="বিজ্ঞান কল্পকাহিনী" ${story.category === 'বিজ্ঞান কল্পকাহিনী' ? 'selected' : ''}>বিজ্ঞান কল্পকাহিনী</option>
                        <option value="অনুপ্রেরণা" ${story.category === 'অনুপ্রেরণা' ? 'selected' : ''}>অনুপ্রেরণা</option>
                    </select>

                    <input type="text" id="story-author-input" style="flex:1;" placeholder="লেখকের নাম" value="${escapeHtml(story.author || '')}">
                </div>

                <textarea id="story-content-input" placeholder="আপনার গল্প এখানে সুন্দরভাবে লিখুন...">${escapeHtml(story.content)}</textarea>
                
                <div class="writer-stats">
                    <span id="word-count-display">শব্দ: ০</span>
                    <span id="char-count-display">বর্ণ: ০</span>
                </div>

                <div class="writer-actions">
                    ${storyId ? `
                        <button id="delete-story-btn" class="danger-btn" title="মুছে ফেলুন">
                            <i class="fas fa-trash-alt"></i> মুছুন
                        </button>
                    ` : ''}
                    <button id="save-story-btn" class="primary-btn">
                        <i class="fas fa-save"></i> সেভ করুন
                    </button>
                </div>
            </div>
        `;

        const titleInput = document.getElementById('story-title-input');
        const contentInput = document.getElementById('story-content-input');
        const wordCountDisplay = document.getElementById('word-count-display');
        const charCountDisplay = document.getElementById('char-count-display');

        // লাইভ ওয়ার্ড কাউন্ট
        const updateStats = () => {
            const val = contentInput.value.trim();
            const words = val ? val.split(/\s+/).length : 0;
            wordCountDisplay.textContent = `শব্দ: ${toBengali(words)}`;
            charCountDisplay.textContent = `বর্ণ: ${toBengali(val.length)}`;
        };

        contentInput.addEventListener('input', updateStats);
        updateStats();

        // ইভেন্ট লিসেনার
        document.getElementById('save-story-btn').addEventListener('click', saveStory);
        if (storyId) {
            document.getElementById('delete-story-btn').addEventListener('click', deleteStory);
        }
    };

    // গল্প সেভ করার ফাংশন
    const saveStory = () => {
        const title = document.getElementById('story-title-input').value;
        const content = document.getElementById('story-content-input').value;
        const category = document.getElementById('story-category-input').value;
        const author = document.getElementById('story-author-input').value;

        if (!title.trim() && !content.trim()) {
            alert('শিরোনাম বা কন্টেন্ট কিছু একটা লিখুন।');
            return;
        }

        const storyData = {
            id: currentEditingId,
            title: title.trim() || 'শিরোনামহীন গল্প',
            content: content,
            category: category,
            author: author.trim() || 'লেখক'
        };

        Storage.saveStory(storyData);
        alert('গল্প সফলভাবে সেভ হয়েছে!');
        App.navigateTo('library');
    };

    // গল্প ডিলিট করার ফাংশন
    const deleteStory = () => {
        if (currentEditingId && confirm('আপনি কি নিশ্চিত? এই গল্পটি চিরতরে মুছে যাবে।')) {
            Storage.deleteStory(currentEditingId);
            alert('গল্প ডিলিট করা হয়েছে।');
            App.navigateTo('library');
        }
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
        init: () => render(),
        openEditor: (storyId) => render(storyId)
    };
})();
