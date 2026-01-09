const Parser = require('rss-parser');
const fs = require('fs');
const rssConfig = require('./config.js');
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
            ['image', 'imageTag'],
            ['enclosure', 'enclosure']
        ]
    }
});

async function updateNews() {
    console.log("🚀 নিউজ আপডেট শুরু হচ্ছে...");
    const lastUpdate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    for (const lang in rssConfig) {
        let langNews = [];
        for (const cat in rssConfig[lang]) {
            const urls = rssConfig[lang][cat];
            for (const url of urls) {
                try {
                    const feed = await parser.parseURL(url);
                    let host = new URL(url).hostname.replace('www.', '');
                    let sourceDomain = host.split('.').slice(-2).join('.');

                    feed.items.forEach(item => {
                        // ১. ডেসক্রিপশন ক্লিনিং (HTML ট্যাগ রিমুভ)
                        let rawContent = item.contentSnippet || item.content || "";
                        let cleanDesc = rawContent.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
                        
                        // নির্দিষ্ট ক্যারেক্টার ক্লিনিং
                        if (cleanDesc.includes(':')) cleanDesc = cleanDesc.split(':').slice(1).join(':').trim();

                        // ২. ওয়ার্ড লিমিট ফিল্টার (পুরনো ফিচারের মতো)
                        const words = cleanDesc.split(/\s+/);
                        if (words.length < 35 || words.length > 130) return;

                        // ৩. টাইটেল ক্লিনিং (অপ্রয়োজনীয় অংশ বাদ দেওয়া)
                        let cleanTitle = item.title.replace(/^[A-Za-z0-9\s]*[:：]/, '')
                                                 .split(' - ')[0]
                                                 .split(' | ')[0]
                                                 .trim();
                        
                        // ৪. ডুপ্লিকেট টাইটেল রোধ
                        if (langNews.some(n => n.title === cleanTitle)) return;

                        // ৫. অ্যাডভান্সড ইমেজ এক্সট্রাকশন (সব সোর্স চেক করা)
                        let img = "https://via.placeholder.com/600x400?text=News";
                        if (item.mediaContent && item.mediaContent.$) img = item.mediaContent.$.url;
                        else if (item.mediaThumbnail && item.mediaThumbnail.$) img = item.mediaThumbnail.$.url;
                        else if (item.enclosure && item.enclosure.url) img = item.enclosure.url;
                        else if (item.content && item.content.includes('<img')) {
                            const match = item.content.match(/src="([^"]+)"/);
                            if (match) img = match[1];
                        }

                        langNews.push({
                            cat: cat,
                            title: cleanTitle,
                            desc: cleanDesc,
                            img: img,
                            src: sourceDomain.toLowerCase(),
                            url: item.link,
                            time: item.isoDate || new Date().toISOString()
                        });
                    });
                } catch (err) { console.error(`❌ এরর [${lang}]:`, err.message); }
            }
        }
        
        // ৬. লেটেস্ট নিউজ অনুযায়ী সর্টিং
        langNews.sort((a, b) => new Date(b.time) - new Date(a.time));
        const finalData = langNews.slice(0, 100);

        // ৭. বিদ্যমান ফাইলে আপডেট করা (NewsData_lang ভেরিয়েবল বজায় রেখে)
        const fileContent = `const newsData_${lang} = ${JSON.stringify(finalData, null, 2)};`;
        fs.writeFileSync(`./${lang}.js`, fileContent); 
        console.log(`✅ ${lang}.js আপডেট সম্পন্ন! (নিউজ সংখ্যা: ${finalData.length})`);
    }
    console.log(`🏁 সব ফাইল আপডেট হয়েছে। শেষ আপডেট: ${lastUpdate}`);
}

updateNews();
