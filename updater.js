const Parser = require('rss-parser');
const fs = require('fs');
const rssConfig = require('./config.js');
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
            ['image', 'imageTag']
        ]
    }
});

async function updateNews() {
    const lastUpdate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    for (const lang in rssConfig) {
        let langNews = [];

        for (const cat in rssConfig[lang]) {
            const urls = rssConfig[lang][cat];
            
            for (const url of urls) {
                try {
                    const feed = await parser.parseURL(url);
                    
                    // ডোমেইন থেকে সোর্স নাম ঠিক করা (.com/.in সহ)
                    let host = new URL(url).hostname.replace('www.', '');
                    let parts = host.split('.');
                    let sourceDomain = parts.length > 2 ? parts.slice(-2).join('.') : host;

                    feed.items.forEach(item => {
                        let rawContent = item.contentSnippet || item.content || "";
                        let cleanDesc = rawContent.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();

                        // কোলন (:) এর আগের অংশ বাদ দেওয়া
                        if (cleanDesc.includes(':')) {
                            let splitDesc = cleanDesc.split(':');
                            splitDesc.shift();
                            cleanDesc = splitDesc.join(':').trim(); 
                        }

                        const words = cleanDesc.split(/\s+/);
                        if (words.length < 40 || words.length > 120) return;

                        let cleanTitle = item.title.replace(/^[A-Za-z0-9\s]*[:：]/, '');
                        cleanTitle = cleanTitle.split(' - ')[0].split(' | ')[0].trim();

                        if (langNews.some(n => n.title === cleanTitle)) return;

                        let img = "https://via.placeholder.com/600x400?text=News";
                        if (item.mediaContent && item.mediaContent.$) img = item.mediaContent.$.url;
                        else if (item.mediaThumbnail && item.mediaThumbnail.$) img = item.mediaThumbnail.$.url;
                        else if (item.imageTag) img = item.imageTag;
                        else if (item.content && item.content.includes('<img')) {
                            const match = item.content.match(/src="([^"]+)"/);
                            if (match) img = match[1];
                        }

                        langNews.push({
                            cat: cat,
                            langCode: lang,
                            title: cleanTitle,
                            desc: cleanDesc,
                            img: img,
                            src: sourceDomain.toLowerCase(),
                            url: item.link,
                            time: item.isoDate || new Date().toISOString()
                        });
                    });
                } catch (err) {
                    console.error(`Error in ${lang} - ${url}:`, err.message);
                }
            }
        }

        // নতুন খবর সর্টিং
        langNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // প্রতিটি ফাইলের জন্য আলাদা ভেরিয়েবল নাম (উদা: newsData_bn)
        const finalLangData = langNews.slice(0, 100);
        const fileContent = `// Last Updated: ${lastUpdate}\nconst newsData_${lang} = ${JSON.stringify(finalLangData, null, 2)};`;
        
        // আলাদা ফাইল হিসেবে সেভ করা (উদা: bn.js, hi.js)
        fs.writeFileSync(`./${lang}.js`, fileContent);
        console.log(`✅ ${lang.toUpperCase()} নিউজ ফাইল আপডেট হয়েছে!`);
    }
}

updateNews();
