// ল্যাঙ্গুয়েজ কনফিগ
const languages = [
    { code: 'bn', name: 'বাংলা', full: 'BENGALI', speech: 'bn-BD' },
    { code: 'hi', name: 'हिन्दी', full: 'HINDI', speech: 'hi-IN' },
    { code: 'en', name: 'English', full: 'ENGLISH', speech: 'en-US' },
    { code: 'ta', name: 'தமிழ்', full: 'TAMIL', speech: 'ta-IN' },
    { code: 'te', name: 'తెలుగు', full: 'TELUGU', speech: 'te-IN' },
    { code: 'mr', name: 'मराठी', full: 'MARATHI', speech: 'mr-IN' },
    { code: 'gu', name: 'ગુજરાતી', full: 'GUJARATI', speech: 'gu-IN' },
    { code: 'kn', name: 'ಕನ್ನಡ', full: 'KANNADA', speech: 'kn-IN' },
    { code: 'ml', name: 'മലയാളം', full: 'MALAYALAM', speech: 'ml-IN' },
    { code: 'or', name: 'ଓଡ଼ିଆ', full: 'ODIA', speech: 'or-IN' }
];

const categoryList = ["National", "World", "Sports", "Entertainment", "Business", "Tech"];
let activeCategories = JSON.parse(localStorage.getItem('myCats')) || [...categoryList];
let currentLangData = []; // বর্তমান লোড হওয়া ফাইল এর ফুল ডেটা
let activeArray = []; // ফিল্টার করার পর নিউজ
let currentLang = localStorage.getItem('newsLang');
let isShowingBookmarks = false;
let synth = window.speechSynthesis;
let isPlaying = false;

window.onload = () => {
    initLangList();
    if (!currentLang) {
        openLangModal();
    } else {
        loadDataDynamically(currentLang);
    }
};

// ভাষা লিস্ট তৈরি
function initLangList() {
    document.getElementById('modal-heading').innerText = "Select Language";
    document.getElementById('cat-section').style.display = "none";
    const list = document.getElementById('lang-list');
    list.style.display = "grid";
    list.innerHTML = languages.map(l => `
        <div class="lang-opt" onclick="switchToCategory('${l.code}')">
            <b>${l.name}</b><br><span>${l.full}</span>
        </div>
    `).join('');
}

// ক্যাটাগরি স্ক্রিন এ যাওয়া
function switchToCategory(langCode) {
    currentLang = langCode;
    localStorage.setItem('newsLang', langCode);
    document.getElementById('lang-list').style.display = "none";
    document.getElementById('modal-heading').innerText = "Select Categories";
    document.getElementById('cat-section').style.display = "block";
    renderCategorySelection();
}

// ৬টি ক্যাটাগরি রেন্ডার করা
function renderCategorySelection() {
    const list = document.getElementById('cat-list');
    list.innerHTML = categoryList.map(cat => {
        const isActive = activeCategories.includes(cat);
        return `<div class="lang-opt ${isActive ? 'cat-active' : ''}" onclick="toggleCategory('${cat}')"><b>${cat}</b></div>`;
    }).join('');
}

// ৩টি ক্যাটাগরি লজিক
function toggleCategory(cat) {
    const warning = document.getElementById('cat-warning');
    if (activeCategories.includes(cat)) {
        if (activeCategories.length <= 3) {
            warning.style.visibility = "visible";
            return;
        }
        activeCategories = activeCategories.filter(c => c !== cat);
    } else {
        activeCategories.push(cat);
        warning.style.visibility = "hidden";
    }
    localStorage.setItem('myCats', JSON.stringify(activeCategories));
    renderCategorySelection();
}

// ডাইনামিক ফাইল লোডিং (bn.js, hi.js ইত্যাদি)
function loadDataDynamically(l) {
    const script = document.createElement('script');
    script.src = `${l}.js?v=${Date.now()}`;
    document.head.appendChild(script);
    script.onload = () => {
        const data = window[`newsData_${l}`];
        if (data) {
            currentLangData = data;
            filterAndDisplay();
        }
    };
}

// ক্যাটাগরি অনুযায়ী নিউজ ফিল্টার
function filterAndDisplay() {
    activeArray = currentLangData.filter(news => activeCategories.includes(news.cat));
    const langObj = languages.find(lang => lang.code === currentLang);
    document.getElementById('footer-lang').innerText = langObj ? langObj.full : 'LANGUAGE';
    isShowingBookmarks = false;
    updateBookmarkUI(false);
    renderNews();
    stopAudio();
}

function closeModal() {
    document.getElementById('lang-modal').style.display = "none";
    loadDataDynamically(currentLang);
}

// নিউজ রেন্ডারিং
function renderNews(customData = null) {
    const slider = document.getElementById('slider');
    const displayData = customData || activeArray;
    let saved = JSON.parse(localStorage.getItem('mySaved')) || [];
    
    if (displayData.length === 0) {
        slider.innerHTML = `<div style="height: 90vh; display: flex; justify-content: center; align-items: center; width: 100vw; color:#888;"><b>No News Available</b></div>`;
        return;
    }

    slider.innerHTML = displayData.map((news, i) => {
        const isSaved = saved.some(s => s.title === news.title);
        return `
        <div class="card">
            <div class="img-box">
                <div class="news-counter">${i+1}/${displayData.length}</div>
                <img src="${news.img}" onload="this.classList.add('loaded')">
                <span class="cat-badge">${news.cat}</span>
                <span class="time-badge">${getTimeAgo(news.time)} ago</span>
                <div style="position:absolute; bottom:10px; right:10px;" onclick="toggleSave(this, ${JSON.stringify(news).replace(/"/g, '&quot;')})">
                    <svg class="${isSaved ? 'is-saved' : ''}" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </div>
            </div>
            <div class="content">
                <h2>${news.title}</h2>
                <div class="desc-list"><ul>${formatDesc(news.desc)}</ul></div>
                <a href="${news.url}" target="_blank" class="source-link">Source: ${news.src}</a>
            </div>
        </div>`;
    }).join('');
    slider.scrollTo({ left: 0 });
}

// পুরনো সব সাপোর্ট ফাংশন (Restored)
function getTimeAgo(t) {
    const diff = new Date() - new Date(t);
    const m = Math.floor(diff/60000);
    return m < 60 ? `${m}m` : `${Math.floor(m/60)}h`;
}

function formatDesc(text) {
    return text.split(/[।.]/).filter(t => t.trim()).map(t => `<li>${t.trim()}।</li>`).join('');
}

function toggleSave(el, newsObj) {
    let saved = JSON.parse(localStorage.getItem('mySaved')) || [];
    const idx = saved.findIndex(s => s.title === newsObj.title);
    if(idx === -1) { saved.push(newsObj); el.querySelector('svg').classList.add('is-saved'); }
    else { saved.splice(idx, 1); el.querySelector('svg').classList.remove('is-saved'); }
    localStorage.setItem('mySaved', JSON.stringify(saved));
    if(isShowingBookmarks) renderNews(saved);
}

function toggleBookmarkView() {
    stopAudio();
    isShowingBookmarks = !isShowingBookmarks;
    updateBookmarkUI(isShowingBookmarks);
    renderNews(isShowingBookmarks ? (JSON.parse(localStorage.getItem('mySaved')) || []) : activeArray);
}

function updateBookmarkUI(active) {
    document.getElementById('bookmark-label').innerText = active ? "HOME" : "BOOKMARK";
    document.getElementById('bookmark-tab').style.color = active ? "#e67e22" : "#555";
}

function handleAudio() {
    if(isPlaying) { stopAudio(); return; }
    const slider = document.getElementById('slider');
    const idx = Math.round(slider.scrollLeft / window.innerWidth);
    const displayData = isShowingBookmarks ? JSON.parse(localStorage.getItem('mySaved')) : activeArray;
    if (!displayData[idx]) return;
    
    const news = displayData[idx];
    const utter = new SpeechSynthesisUtterance(news.title + ". " + news.desc);
    const langObj = languages.find(l => l.code === currentLang);
    utter.lang = langObj ? langObj.speech : 'en-US';
    utter.rate = 0.9;
    
    document.getElementById('audio-toast').style.display = "block";
    utter.onstart = () => {
        isPlaying = true;
        document.getElementById('audio-toast').style.display = "none";
        document.getElementById('play-icon').innerHTML = '<rect x="6" y="6" width="4" height="12"></rect><rect x="14" y="6" width="4" height="12"></rect>';
    };
    utter.onend = stopAudio;
    synth.speak(utter);
}

function stopAudio() {
    synth.cancel();
    isPlaying = false;
    document.getElementById('play-icon').innerHTML = '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>';
}

function openLangModal() { 
    stopAudio(); 
    initLangList(); 
    document.getElementById('lang-modal').style.display = "flex"; 
}
document.getElementById('slider').addEventListener('scroll', stopAudio);
