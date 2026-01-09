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
                    
                    // সোর্স নাম থেকে শুধু মাঝখানের নামটুকু নেওয়া (উদা: t.ndtv.com থেকে ndtv)
                    let host = new URL(url).hostname;
                    let parts = host.replace('www.', '').split('.');
                    let sourceName = parts.length > 1 ? parts[parts.length - 2] : parts[0];

                    feed.items.forEach(item => {
                        // ১. কনটেন্ট ক্লিনিং (HTML ট্যাগ ও অতিরিক্ত স্পেস সরানো)
                        let rawContent = item.contentSnippet || item.content || "";
                        let cleanDesc = rawContent.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();

                        // ২. ডেসক্রিপশনের শুরু থেকে কোলন (:) পর্যন্ত অংশ বাদ দেওয়া
                        if (cleanDesc.includes(':')) {
                            // কোলনের পরের অংশটুকু নেওয়া হচ্ছে
                            let splitDesc = cleanDesc.split(':');
                            splitDesc.shift(); // প্রথম অংশ ফেলে দেওয়া
                            cleanDesc = splitDesc.join(':').trim(); 
                        }

                        // ৩. শব্দ সংখ্যা ফিল্টার (৪০-১০০ শব্দ)
                        const words = cleanDesc.split(/\s+/);
                        if (words.length < 40 || words.length > 100) return;

                        // ৪. টাইটেল ক্লিনিং (শুরুতে কোলন থাকলে সরানো)
                        let cleanTitle = item.title.replace(/^[A-Za-z0-9\s]*[:：]/, '');
                        cleanTitle = cleanTitle.split(' - ')[0].split(' | ')[0].trim();

                        // ৫. ডুপ্লিকেট চেক
                        if (langNews.some(n => n.title === cleanTitle)) return;

                        // ৬. ইমেজ খোঁজা
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
                            src: sourceName.toUpperCase(), // নামটা বড় হাতের অক্ষরে দেখাবে (উদা: NDTV)
                            url: item.link,
                            time: item.isoDate || new Date().toISOString()
                        });
                    });
                } catch (err) {
                    console.error(`Error fetching ${url}:`, err.message);
                }
            }
        }

        // ৭. পাবলিশিং ডেট অনুযায়ী সর্টিং
        langNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // ৮. ১০০ নিউজ লিমিট
        finalNewsData[lang] = langNews.slice(0, 100);
    }

    const finalContent = `const onlineNewsData = ${JSON.stringify(finalNewsData, null, 2)};`;
    fs.writeFileSync(existingFile, finalContent);
    console.log("✅ সব শর্ত মেনে নিউজ আপডেট হয়েছে!");
}

updateNews();
