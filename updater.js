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
    let finalNewsData = {};
    const existingFile = './news-data.js';

    for (const lang in rssConfig) {
        let langNews = [];

        for (const cat in rssConfig[lang]) {
            const urls = rssConfig[lang][cat];
            
            for (const url of urls) {
                try {
                    const feed = await parser.parseURL(url);
                    
                    // সোর্স নাম পরিষ্কার করা (শুধু ডোমেইন নাম রাখা)
                    let sourceName = new URL(url).hostname.replace('www.', '');

                    feed.items.forEach(item => {
                        // ১. কনটেন্ট ক্লিনিং ও ৪০-৮০ শব্দ ফিল্টার
                        let rawContent = item.contentSnippet || item.content || "";
                        let cleanDesc = rawContent.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
                        const words = cleanDesc.split(/\s+/);
                        
                        if (words.length < 40 || words.length > 100) return; // আপনার চাহিদা অনুযায়ী লিমিট

                        // ২. টাইটেল ক্লিনিং (ইংরেজি টেক্সট ও শুরুতে থাকা কোলন সরানো)
                        let cleanTitle = item.title.replace(/^[A-Za-z0-9\s]*[:：]/, ''); // শুরুতে ইংরেজি ও : থাকলে সরাবে
                        cleanTitle = cleanTitle.split(' - ')[0].split(' | ')[0].trim();

                        // ৩. ডুপ্লিকেট চেক
                        if (langNews.some(n => n.title === cleanTitle)) return;

                        // ৪. ইমেজ খোঁজার উন্নত লজিক
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
                            src: sourceName, // শুধু ডোমেইন নাম
                            url: item.link,  // অরিজিনাল ইউআরএল
                            time: item.isoDate || new Date().toISOString()
                        });
                    });
                } catch (err) {
                    console.error(`Error fetching ${url}:`, err.message);
                }
            }
        }

        // ৫. পাবলিশিং ডেট অনুযায়ী সর্টিং (নতুন খবর সবার আগে)
        langNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // ৬. ১০০ নিউজ লিমিট
        finalNewsData[lang] = langNews.slice(0, 100);
    }

    // ফাইল সেভ করা
    const finalContent = `const onlineNewsData = ${JSON.stringify(finalNewsData, null, 2)};`;
    fs.writeFileSync(existingFile, finalContent);
    console.log("✅ নিউজ ডাটাবেজ সফলভাবে আপডেট হয়েছে!");
}

updateNews();
