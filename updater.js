const Parser = require('rss-parser');
const fs = require('fs');
const rssConfig = require('./config.js');
const parser = new Parser();

async function updateNews() {
    let finalNewsData = {};
    const existingFile = './news-data.js';
    
    // পুরনো ডেটা লোড করা (যদি থাকে)
    let oldData = {};
    if (fs.existsSync(existingFile)) {
        const content = fs.readFileSync(existingFile, 'utf8');
        const jsonStr = content.replace('const onlineNewsData = ', '').replace(';', '');
        try { oldData = JSON.parse(jsonStr); } catch(e) { oldData = {}; }
    }

    for (const lang in rssConfig) {
        let langNews = oldData[lang] || [];

        for (const cat in rssConfig[lang]) {
            const urls = rssConfig[lang][cat];
            
            for (const url of urls) {
                try {
                    const feed = await parser.parseURL(url);
                    feed.items.forEach(item => {
                        // ১. কনটেন্ট ক্লিনিং (HTML ট্যাগ ও নোংরা জিনিস সরানো)
                        let cleanDesc = item.contentSnippet || item.content || "";
                        cleanDesc = cleanDesc.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();

                        // ২. ৪০-৮০ শব্দ ফিল্টার
                        const words = cleanDesc.split(' ');
                        if (words.length < 40 || words.length > 80) return;

                        // ৩. টাইটেল ক্লিনিং
                        let cleanTitle = item.title.split(' - ')[0].split(' | ')[0].split(' : ')[0];
                        cleanTitle = cleanTitle.replace(/ব্রেকিং নিউজ[:\s]*/gi, '').trim();

                        // ৪. ডুপ্লিকেট চেক (শিরোনাম দিয়ে)
                        if (langNews.some(n => n.title === cleanTitle)) return;

                        // ৫. ইমেজ খোঁজা (বিভিন্ন ট্যাগে থাকতে পারে)
                        let img = "https://via.placeholder.com/400x300?text=News";
                        if (item.enclosure && item.enclosure.url) img = item.enclosure.url;
                        else if (item.content && item.content.match(/src="([^"]+)"/)) img = item.content.match(/src="([^"]+)"/)[1];

                        langNews.unshift({
                            cat: cat,
                            langCode: lang,
                            title: cleanTitle,
                            desc: cleanDesc,
                            img: img,
                            src: feed.title || "News",
                            url: item.link,
                            time: item.isoDate || new Date().toISOString()
                        });
                    });
                } catch (err) { console.error(`Error in ${url}:`, err.message); }
            }
        }

        // ৬. পাবলিশিং ডেট অনুযায়ী সর্টিং
        langNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // ৭. ১০০ নিউজ লিমিট
        finalNewsData[lang] = langNews.slice(0, 100);
    }

    // ফাইল রাইট করা
    const finalContent = `const onlineNewsData = ${JSON.stringify(finalNewsData, null, 2)};`;
    fs.writeFileSync(existingFile, finalContent);
    console.log("Database Updated Successfully!");
}

updateNews();
