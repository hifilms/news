const Parser = require('rss-parser');
const fs = require('fs');
const rssConfig = require('./config.js');
const parser = new Parser({
    customFields: {
        item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail'], ['image', 'imageTag']]
    }
});

async function updateNews() {
    let finalNewsData = {};
    const existingFile = './news-data.js';

    for (const lang in rssConfig) {
        let langNews = [];
        for (const cat in rssConfig[lang]) {
            const urls = rssConfig[lang][cat];
            for (const url of urls) {
                try {
                    const feed = await parser.parseURL(url);
                    
                    // সোর্স নাম ঠিক করা (উদা: t.ndtv.com -> ndtv.com)
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
                            src: sourceDomain.toLowerCase(), // ছোট হাতের অক্ষরে domain.com দেখাবে
                            url: item.link,
                            time: item.isoDate || new Date().toISOString()
                        });
                    });
                } catch (err) { console.error(`Error: ${url}`, err.message); }
            }
        }
        langNews.sort((a, b) => new Date(b.time) - new Date(a.time));
        finalNewsData[lang] = langNews.slice(0, 100);
    }

    const finalContent = `const onlineNewsData = ${JSON.stringify(finalNewsData, null, 2)};`;
    fs.writeFileSync(existingFile, finalContent);
    console.log("✅ নিউজ আপডেট এবং সোর্স নাম ঠিক করা হয়েছে!");
}

updateNews();
