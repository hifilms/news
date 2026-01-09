const rssConfig = {
    "bn": { // Bengali
        "Sports": ["https://www.anandabazar.com/rss/sports.xml", "https://ajkaal.in/category/sports/feed"],
        "Tech": ["https://www.anandabazar.com/rss/science-technology.xml", "https://zeenews.india.com/bengali/rss/technology.xml"],
        "Business": ["https://www.anandabazar.com/rss/business.xml", "https://ajkaal.in/category/business/feed"],
        "Entertainment": ["https://ajkaal.in/category/entertainment/feed", "https://zeenews.india.com/bengali/rss/entertainment.xml"],
        "World": ["https://www.anandabazar.com/rss/world.xml", "https://ajkaal.in/category/world/feed"],
        "Politics": ["https://ajkaal.in/category/national/feed", "https://zeenews.india.com/bengali/rss/india.xml"]
    },
    "hi": { // Hindi
        "Sports": ["https://www.indiatvnews.com/rssfeed/sports.xml", "https://hindi.news18.com/rss/khabar-sports.xml"],
        "Tech": ["https://hindi.gadgets360.com/rss/feeds", "https://hindi.news18.com/rss/khabar-tech.xml"],
        "Business": ["https://hindi.news18.com/rss/khabar-business.xml", "https://zeenews.india.com/hindi/rss/business.xml"],
        "Entertainment": ["https://hindi.news18.com/rss/khabar-entertainment.xml", "https://zeenews.india.com/hindi/rss/entertainment.xml"],
        "World": ["https://hindi.news18.com/rss/khabar-world.xml", "https://zeenews.india.com/hindi/rss/world.xml"],
        "Politics": ["https://hindi.news18.com/rss/khabar-india.xml", "https://zeenews.india.com/hindi/rss/india.xml"]
    },
    "en": { // English
        "Sports": ["https://timesofindia.indiatimes.com/rssfeeds/4719148.cms", "https://www.thehindu.com/sport/feeder/default.rss"],
        "Tech": ["https://timesofindia.indiatimes.com/rssfeeds/66949542.cms", "https://www.thehindu.com/sci-tech/technology/feeder/default.rss"],
        "Business": ["https://timesofindia.indiatimes.com/rssfeeds/1898055.cms", "https://www.thehindu.com/business/feeder/default.rss"],
        "Entertainment": ["https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms", "https://www.thehindu.com/entertainment/feeder/default.rss"],
        "World": ["https://timesofindia.indiatimes.com/rssfeeds/2965893.cms", "https://www.thehindu.com/news/international/feeder/default.rss"],
        "Politics": ["https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", "https://www.thehindu.com/news/national/feeder/default.rss"]
    },
    "ta": { // Tamil
        "Sports": ["https://tamil.oneindia.com/rss/tamil-sports-fb.xml", "https://zeenews.india.com/tamil/rss/sports.xml"],
        "Tech": ["https://tamil.gizbot.com/rss/feeds", "https://zeenews.india.com/tamil/rss/technology.xml"],
        "Business": ["https://tamil.oneindia.com/rss/tamil-business-fb.xml", "https://zeenews.india.com/tamil/rss/business.xml"],
        "Entertainment": ["https://tamil.oneindia.com/rss/tamil-entertainment-fb.xml", "https://zeenews.india.com/tamil/rss/entertainment.xml"],
        "World": ["https://tamil.oneindia.com/rss/tamil-world-fb.xml", "https://zeenews.india.com/tamil/rss/world.xml"],
        "Politics": ["https://tamil.oneindia.com/rss/tamil-politics-fb.xml", "https://zeenews.india.com/tamil/rss/india.xml"]
    },
    "te": { // Telugu
        "Sports": ["https://telugu.samayam.com/rssfeeds/48315102.cms", "https://telugu.news18.com/rss/sports.xml"],
        "Tech": ["https://telugu.gizbot.com/rss/feeds", "https://telugu.news18.com/rss/technology.xml"],
        "Business": ["https://telugu.samayam.com/rssfeeds/48315103.cms", "https://telugu.news18.com/rss/business.xml"],
        "Entertainment": ["https://telugu.samayam.com/rssfeeds/48315104.cms", "https://telugu.news18.com/rss/entertainment.xml"],
        "World": ["https://telugu.samayam.com/rssfeeds/48315105.cms", "https://telugu.news18.com/rss/international.xml"],
        "Politics": ["https://telugu.news18.com/rss/national.xml", "https://telugu.samayam.com/rssfeeds/48315101.cms"]
    },
    "mr": { // Marathi
        "Sports": ["https://marathi.abplive.com/sports/feed", "https://marathi.news18.com/rss/sports.xml"],
        "Tech": ["https://marathi.news18.com/rss/technology.xml", "https://zeenews.india.com/marathi/rss/technology.xml"],
        "Business": ["https://marathi.news18.com/rss/business.xml", "https://zeenews.india.com/marathi/rss/business.xml"],
        "Entertainment": ["https://marathi.abplive.com/entertainment/feed", "https://zeenews.india.com/marathi/rss/entertainment.xml"],
        "World": ["https://marathi.abplive.com/world/feed", "https://marathi.news18.com/rss/international.xml"],
        "Politics": ["https://marathi.abplive.com/news/india/feed", "https://zeenews.india.com/marathi/rss/india.xml"]
    },
    "gu": { // Gujarati
        "Sports": ["https://gujarati.news18.com/rss/sports.xml", "https://zeenews.india.com/gujarati/rss/sports.xml"],
        "Tech": ["https://gujarati.news18.com/rss/technology.xml", "https://zeenews.india.com/gujarati/rss/technology.xml"],
        "Business": ["https://gujarati.news18.com/rss/business.xml", "https://zeenews.india.com/gujarati/rss/business.xml"],
        "Entertainment": ["https://gujarati.news18.com/rss/entertainment.xml", "https://zeenews.india.com/gujarati/rss/entertainment.xml"],
        "World": ["https://gujarati.news18.com/rss/international.xml", "https://zeenews.india.com/gujarati/rss/world.xml"],
        "Politics": ["https://gujarati.news18.com/rss/india.xml", "https://zeenews.india.com/gujarati/rss/india.xml"]
    },
    "kn": { // Kannada
        "Sports": ["https://kannada.news18.com/rss/sports.xml", "https://zeenews.india.com/kannada/rss/sports.xml"],
        "Tech": ["https://kannada.news18.com/rss/technology.xml", "https://zeenews.india.com/kannada/rss/technology.xml"],
        "Business": ["https://kannada.news18.com/rss/business.xml", "https://zeenews.india.com/kannada/rss/business.xml"],
        "Entertainment": ["https://kannada.news18.com/rss/entertainment.xml", "https://zeenews.india.com/kannada/rss/entertainment.xml"],
        "World": ["https://kannada.news18.com/rss/international.xml", "https://zeenews.india.com/kannada/rss/world.xml"],
        "Politics": ["https://kannada.news18.com/rss/national.xml", "https://zeenews.india.com/kannada/rss/india.xml"]
    },
    "ml": { // Malayalam
        "Sports": ["https://malayalam.news18.com/rss/sports.xml", "https://zeenews.india.com/malayalam/rss/sports.xml"],
        "Tech": ["https://malayalam.news18.com/rss/technology.xml", "https://zeenews.india.com/malayalam/rss/technology.xml"],
        "Business": ["https://malayalam.news18.com/rss/business.xml", "https://zeenews.india.com/malayalam/rss/business.xml"],
        "Entertainment": ["https://malayalam.news18.com/rss/entertainment.xml", "https://zeenews.india.com/malayalam/rss/entertainment.xml"],
        "World": ["https://malayalam.news18.com/rss/international.xml", "https://zeenews.india.com/malayalam/rss/world.xml"],
        "Politics": ["https://malayalam.news18.com/rss/national.xml", "https://zeenews.india.com/malayalam/rss/india.xml"]
    },
    "or": { // Odia
        "Sports": ["https://sambad.in/rss/sports.xml", "https://odishatv.in/rss/sports"],
        "Tech": ["https://odishatv.in/rss/science-technology", "https://sambad.in/rss/lifestyle.xml"],
        "Business": ["https://odishatv.in/rss/business", "https://sambad.in/rss/business.xml"],
        "Entertainment": ["https://sambad.in/rss/entertainment.xml", "https://odishatv.in/rss/entertainment"],
        "World": ["https://sambad.in/rss/world.xml", "https://odishatv.in/rss/world"],
        "Politics": ["https://sambad.in/rss/national.xml", "https://odishatv.in/rss/odisha"]
    }
};

module.exports = rssConfig;
