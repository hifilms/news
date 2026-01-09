/**
 * India News Pro - Final Professional Script
 * Replaced Punjabi with Odia & Restored All Features
 */

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

let newsData = (typeof onlineNewsData !== 'undefined') ? onlineNewsData : {}; 
let activeArray = [];
let currentLang = localStorage.getItem('newsLang');
let isShowingBookmarks = false;
let synth = window.speechSynthesis;
let isPlaying = false;

window.onload = () => {
    initLangList();
    if (!currentLang) {
        openLangModal();
    } else {
        loadInitialData();
    }
};

// অনলাইন আসার সাথে সাথে ডেটা রিফ্রেশ করা
window.addEventListener('online', () => {
    if(!isShowingBookmarks && activeArray.length === 0) {
        loadInitialData();
    }
});

function loadInitialData() {
    activeArray = newsData[currentLang] || [];
    if (!navigator.onLine && activeArray.length === 0) {
        handleOfflineMode();
    } else {
        setLang(currentLang);
    }
}

function initLangList() {
    const list = document.getElementById('lang-list');
    list.innerHTML = languages.map(l => `
        <div class="lang-opt" onclick="setLang('${l.code}')">
            <b>${l.name}</b>
            <span>${l.full}</span>
        </div>
    `).join('');
}

function renderNews(customData = null) {
    const slider = document.getElementById('slider');
    const displayData = customData || activeArray;
    let saved = JSON.parse(localStorage.getItem('mySaved')) || [];
    
    if (displayData.length === 0) {
        const msg = isShowingBookmarks ? "No Bookmarks Saved" : "No Internet Connection";
        slider.innerHTML = `<div style="height: 90vh; display: flex; flex-direction:column; justify-content: center; align-items: center; color: #888; width: 100vw; text-align:center; padding:20px;">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom:15px;"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"></path></svg>
            <b style="font-size:18px;">${msg}</b>
        </div>`;
        return;
    }

    slider.innerHTML = displayData.map((news, i) => {
        const isSaved = saved.some(s => s.title === news.title);
        return `
        <div class="card" style="min-width:100vw; height:90vh; scroll-snap-align:start; position:relative;">
            <div class="img-box">
                <div class="news-counter">${i+1}/${displayData.length}</div>
                <img src="${news.img}" onload="this.classList.add('loaded')">
                <span class="cat-badge">${news.cat}</span>
                <span class="time-badge">${getTimeAgo(news.time)} ago</span>
                <div style="position:absolute; bottom:10px; right:10px; cursor:pointer;" onclick="toggleSave(this, ${JSON.stringify(news).replace(/"/g, '&quot;')})">
                    <svg class="${isSaved ? 'is-saved' : ''}" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </div>
            </div>
            <div class="content">
                <h2>${news.title}</h2>
                <div class="desc-list"><ul>${formatDesc(news.desc)}</ul></div>
                <a href="${news.url}" class="source-link" onclick="if(!navigator.onLine){return false;}">Source: ${news.src}</a>
            </div>
        </div>`;
    }).join('');
    slider.scrollTo({ left: 0 });
}

function setLang(l) {
    currentLang = l;
    localStorage.setItem('newsLang', l);
    activeArray = newsData[l] || [];
    isShowingBookmarks = false;
    updateBookmarkUI(false);
    const langObj = languages.find(lang => lang.code === l);
    document.getElementById('footer-lang').innerText = langObj ? langObj.full : 'ENGLISH';
    renderNews();
    document.getElementById('lang-modal').style.display = "none";
    stopAudio();
}

function handleOfflineMode() {
    isShowingBookmarks = true;
    updateBookmarkUI(true);
    renderNews(JSON.parse(localStorage.getItem('mySaved')) || []);
}

function toggleBookmarkView() {
    stopAudio();
    if (!isShowingBookmarks) {
        isShowingBookmarks = true;
        updateBookmarkUI(true);
        renderNews(JSON.parse(localStorage.getItem('mySaved')) || []);
    } else {
        if (activeArray.length > 0) {
            isShowingBookmarks = false;
            updateBookmarkUI(false);
            renderNews(activeArray);
        }
    }
}

function updateBookmarkUI(isHomeActive) {
    const label = document.getElementById('bookmark-label');
    const tab = document.getElementById('bookmark-tab');
    if (label) label.innerText = isHomeActive ? "HOME" : "BOOKMARK";
    if (tab) tab.style.color = isHomeActive ? "#e67e22" : "#555";
}

function handleAudio() {
    if(isPlaying) { stopAudio(); return; }
    const slider = document.getElementById('slider');
    const idx = Math.round(slider.scrollLeft / window.innerWidth);
    const displayData = isShowingBookmarks ? JSON.parse(localStorage.getItem('mySaved')) : activeArray;
    if (!displayData || !displayData[idx]) return;
    
    const news = displayData[idx];
    const utter = new SpeechSynthesisUtterance(news.title + ". " + news.desc);
    const langObj = languages.find(l => l.code === news.langCode);
    
    utter.lang = langObj ? langObj.speech : 'en-US';
    utter.rate = 0.9;

    const toast = document.getElementById('audio-toast');
    if (toast) toast.style.display = "block";

    utter.onstart = () => {
        isPlaying = true;
        if (toast) toast.style.display = "none";
        document.getElementById('play-icon').innerHTML = '<rect x="6" y="6" width="4" height="12"></rect><rect x="14" y="6" width="4" height="12"></rect>';
    };

    utter.onend = () => stopAudio();
    utter.onerror = () => stopAudio();
    synth.speak(utter);
}

function stopAudio() {
    if (isPlaying) {
        synth.cancel();
        isPlaying = false;
        document.getElementById('play-icon').innerHTML = '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>';
        const toast = document.getElementById('audio-toast');
        if (toast) toast.style.display = "none";
    }
}

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
    const sIdx = saved.findIndex(s => s.title === newsObj.title);
    if(sIdx === -1) { 
        saved.push(newsObj); 
        el.querySelector('svg').classList.add('is-saved'); 
    } else { 
        saved.splice(sIdx, 1); 
        el.querySelector('svg').classList.remove('is-saved'); 
    }
    localStorage.setItem('mySaved', JSON.stringify(saved));
    if (isShowingBookmarks) renderNews(saved);
}

function openLangModal() { 
    stopAudio(); 
    document.getElementById('lang-modal').style.display = "flex"; 
}

// স্ক্রল করলে অডিও বন্ধ হওয়া
document.getElementById('slider').addEventListener('scroll', stopAudio);