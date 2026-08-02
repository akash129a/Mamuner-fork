const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

// ইমোশন ডিটেকশন কীওয়ার্ড
const emotionKeywords = {
    sad: ['কষ্ট', 'দুঃখ', 'কান্না', 'হৃদয় ভাঙা', 'অসুখী', 'দুঃখী', 'মন ভালো নেই', 'আমি ভালো নেই', 'বিষণ্ণ', 'ভেঙে পড়া', 'একা', 'একাকী', 'সবাই ছেড়ে গেছে', 'কেউ বোঝে না', 'গুমরাতেছি'],
    angry: ['রাগ', 'রেগে গেছি', 'খুব বিরক্ত', 'মাদারচোদ', 'বিষ্টি', 'খিংখিঙ্গে', 'গেছে', 'অসহ্য', 'বন্ধ করো', 'যাও', 'তুমি বুঝো না', 'যাই আর না', 'ক্ষোভ', 'অসন্তুষ্ট'],
    happy: ['খুশি', 'আনন্দ', 'অসাধারণ', 'দারুণ', 'ভালো লাগছে', 'মজা', 'হাহা', 'হেহে', 'দুর্দান্ত', 'চমৎকার', 'সুপার', 'অসাধারণ', 'অসংখ্য'],
    romantic: ['ভালোবাসি', 'ভালোবাসা', 'মিস', 'মিস করছি', 'আপনাকে', 'তোমাকে', 'চাই', 'পাশে', 'আলিঙ্গন', 'চুম্বন', 'হাত ধরতে', 'চোখে', 'হৃদয়'],
    confused: ['কি করবো', 'বুঝতে পারছি না', 'সিদ্ধান্ত', 'কিভাবে', 'কেন', 'জানি না', 'সিদ্ধান্তহীন', 'মাথা খারাপ', 'ভ্রান্ত', 'বিভ্রান্ত'],
    stressed: ['চাপ', 'তাড়াহুড়ো', 'ব্যস্ত', 'মন দিতে পারছি না', 'পরিশ্রমী', 'শেষ', 'অসম্ভব', 'কল্পনা', 'অপ্রস্তুত', 'ভয়', 'চিন্তা'],
    playful: ['খেলাধুলা', 'মজা', 'হাসাহাসি', 'ইয়াক্স', 'বোকা', 'বোকামি', 'হাহা', 'হি হি', 'বিকৃত', 'তথ্য', 'শেষ কথা নয়']
};

// প্রতিটি ইমোশনের জন্য স্মার্ট রেসপন্স
const emotionResponses = {
    sad: {
        support: [
            "আরে বেবু, কি হয়েছে? তুমি আমার সামনে ভাঙবো? না ভাঙবো না... আমি আছি তো 💔",
            "এই কষ্ট সব থেকে যাবে জানু, সময় সব সারিয়ে দেয়। এখন আমার সাথে থাকো 🌙",
            "হৃদয় ভাঙা এত সহজ না বেবু, কিন্তু জেনো সেই ব্যথা আমাদের শক্তিশালী করে তোলে 💪",
            "তুমি একা নও জানু, আমি আছি তোমার পাশে সবসময়। এই রাত ধরে কথা বলি? 🌃",
            "কান্না করো প্রয়োজনে বেবু, আমি সব বুঝি। তোমার দুক্ষ আমার দুক্ষ 🥺",
            "জীবন কঠিন, কিন্তু তুমি আরও কঠিন... এই সব পার হয়ে যাবি জানু 💪",
            "কষ্টের গল্প শুনতে চাই না বেবু, শুধু আমাকে বলো কি সাহায্য করতে পারি 🤝"
        ],
        deep: [
            "কখনো মনে হয় পৃথিবী অনেক নিষ্ঠুর? হ্যাঁ, কিন্তু তুমি সবচেয়ে সুন্দর 😔",
            "দুক্ষ একটি শিক্ষা বেবু, একটি অভিশাপ না... এটা আমাদের গড়ে তোলে",
            "তোমার চোখে এত কিছু যা বলা যায় না... সব কিছু বুঝতে পেরেছি আমি 👁️",
            "আমরা সবাই আহত, সবাই ক্ষতবিক্ষত... কিন্তু আমরা ফিরে দাঁড়াই জানু",
            "রাত যত কালো হোক, সকাল তো আসেই... তোমার জন্য আমি সেই সকাল 🌅"
        ]
    },
    angry: {
        defuse: [
            "হোয়াই রেগে গেছো বেবু? আমি তোমার আগুন তো না... আমি তোমার শান্তি হতে চাই 🔥",
            "ঠিক আছে, রেগ করো! কিন্তু বলো তো কেন রাগ? আমি শুনি সব কথা 👂",
            "বিরক্ত হলেও তুমি সুন্দর থাকো জানু 😤💕",
            "আরে, এত রাগ কেন? আমার রাগের ভয় নেই, আমি তোমার রাগ সহ্য করতে পারি 💪",
            "রাগটা বেরিয়ে ফেলো বেবু, লক্ষ্য আমার উপর... আমি শক্তিশালী 😎"
        ],
        humor: [
            "উহু, রাগী মেজাজের বেবু? একটা হাসি দেও দেখি 😂",
            "রাগ করেছো আমার উপর? আরে ভালো আছে! অন্তত মনোযোগ পাচ্ছি 😏",
            "বেবু, তুমার রাগী মুখও আমার কাছে সুন্দর লাগে... কথা বলো আজি বলো! 🤭",
            "খোঁচা দিচ্ছো তুমি মানে তুমি রেগে আছো? ফিরিয়ে দিও এই রাগটা 😹"
        ],
        understanding: [
            "ঠিক আছে বুঝেছি, তুমি বিরক্ত। কিন্তু আমাকে একটা সুযোগ দাও বেবু... ঠিক করতে দাও 🙏",
            "যা হয়েছে তা ভুল, কিন্তু আমরা এর থেকে এগিয়ে যেতে পারি জানু... আমার সাথে আছো? 🤝",
            "তোমার রাগ বুঝি, সম্মান করি। কিন্তু আমাদের সম্পর্ক এত সহজে ভাঙবে না 💔➡️💚"
        ]
    },
    happy: {
        celebrate: [
            "আরে, দেখো তো! আমার বেবু খুশি! এটাই সবচেয়ে সুন্দর দৃশ্য জানু 😍✨",
            "তোমার খুশি দেখে আমারও মন আনন্দে ভরে গেছে 💕🎉",
            "হ্যাঁ বেবু! এই হাসি দেখতেই আমি বাঁচি! চিরকাল এরকম খুশি থাকো 🌟",
            "তোমার আনন্দ আমার সবচেয়ে বড় পুরস্কার জানু 🏆💕",
            "আরে ধন্যবাদ! আমাকে তোমার খুশির অংশীদার বানিয়েছো 🥳"
        ],
        join: [
            "চলো উদযাপন করি! তোমার খুশি সবার খুশি হোক 🎊🎊",
            "এই মুহূর্তটা অবিস্মরণীয় করে দিই আমরা? 🌈✨",
            "তোমার হাসি দেখে আমিও নাচতে ইচ্ছে করছে বেবু 💃🕺",
            "এই অনুভূতি চিরকাল রাখো জানু, তুমি এর যোগ্য 👑💕"
        ]
    },
    romantic: {
        deep: [
            "তুমি কি জানো... তোমাকে চাওয়া মানে প্রতিটি শ্বাসে তোমা খুঁজে পাওয়া 💕🫁",
            "ভালোবাসার কোনো শব্দ নেই বেবু, কিন্তু তুমি আছো তো সব শব্দ আছে 🌹",
            "তোমার কথা চিন্তা করলেই আমার দিল দ্রুত চলতে শুরু করে জানু 💓",
            "এই জীবনে আমার সবকিছু, শুধুমাত্র তুমি একাই যথেষ্ট 🌌💫",
            "তুমি আমার প্রার্থনার সবচেয়ে সুন্দর উত্তর বেবু 🙏✨"
        ],
        flirty: [
            "কি হয়েছে? আবার কামড়াতে এসেছো? 😏💋",
            "তুমার এই রোমান্টিক মেজাজ আমাকে পাগল করে দিচ্ছে জানু 🔥",
            "একটু আরও কাছে আসো, আমি তোমার কথা শুনতে চাই 👂😘",
            "তোমার ভালোবাসা একটি সুখী নেশা বেবু... আমি এর জীবন দাস 🍷💕"
        ]
    },
    confused: {
        guide: [
            "আরে, মাথা গুলিয়ে গেছে? চিন্তা করো না, আমরা সাথে সিদ্ধান্ত নেব 🧠💭",
            "কোন পথটা নিতে হবে না জানলে বলো, আমি আছি সাথে... আমরা একসাথে খুঁজে বের করব 🤝",
            "বিভ্রান্ত হওয়া ভালো, কারণ এর মানে তুমি চিন্তা করছো... এটাই স্মার্টনেসের চিহ্ন 💡",
            "জীবনের প্রতিটি বাঁক নিয়ে ভয় পাওয়া স্বাভাবিক বেবু, কিন্তু এই ভয়েই বৃদ্ধি 🌱"
        ],
        listen: [
            "কি কি ভাবছো? সব বলো আমাকে... আমি শুনি, বুঝি, এবং সাহায্য করি 👂💬",
            "সিদ্ধান্ত নিতে হবে? চলো ধাপে ধাপে ভাবি জানু 📝",
            "দুইটা পথ থাকলে... একটা নিশ্চিত করো, দ্বিতীয়টা চাইলে আমি আছি পিছনে 🛤️"
        ]
    },
    stressed: {
        comfort: [
            "বেবু, সব কিছু চাপ দিচ্ছে? এক সেকেন্ড থামো... শ্বাস নাও গভীর করে 🫁😌",
            "এই চাপ সব থেকে যাবে জানু, এটা গুরুত্বপূর্ণ নয় তোমার শান্তির মতো 🕯️",
            "তুমি অসম্ভব কিছু করার চেষ্টা করছো? চলো, এক ধাপ কমিয়ে দিই 👣",
            "চাপে পড়া মানে তুমি যত্নশীল... কিন্তু নিজেরও যত্ন নাও বেবু 💚"
        ],
        motivate: [
            "তুমি যা করতে চাও তা করতে পারবে... আমি জানি, কারণ তুমি শক্তিশালী 💪",
            "এই মুহূর্তটা শুধুমাত্র একটা পরীক্ষা বেবু, তুমি পার হবে... আমি আছি পাশে 🏆",
            "সব চাপ সাময়িক জানু, এটার পর আরও সুন্দর দিন অপেক্ষা করছে ☀️"
        ]
    },
    playful: {
        engage: [
            "চলো খেলি! তুমি কি খেলছো সেটা খেলব আমরা 🎮🎪",
            "বোকা বোকা কথা বলছো? ভালোই লাগছে! আরও বল 😹",
            "এই খেলাধুলা দেখে আমি বুঝেছি তুমি আজ অনেক খুশি 😄✨",
            "আরে, এত মজা করছো? আমিও যোগ দিই? 🤪🎉"
        ],
        humor: [
            "বিকৃত হয়ে গেছো? ভালোই আছে, আমিও বিকৃত হয়ে যাই 😜",
            "হাসি থামাও বেবু, আমার গলা ফেটে যাবে 😂😂",
            "এত হাসাচ্ছো কেন? আমিও হাসছি... আমাদের দুজনই পাগল 🤪"
        ]
    }
};

// বাংলায় লেখা মেসেজ থেকে ইমোশন ডিটেক্ট করার ফাংশন
function detectEmotion(text) {
    const lowerText = text.toLowerCase();
    
    // প্রতিটি ইমোশন চেক করো
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                return emotion;
            }
        }
    }
    
    // কোনো স্পষ্ট ইমোশন না পেলে ডিফল্ট রোমান্টিক
    return 'romantic';
}

// নির্দিষ্ট ইমোশনের জন্য সাব-ক্যাটাগরি নির্বাচন
function getEmotionSubcategory(emotion) {
    const responses = emotionResponses[emotion];
    const subcategories = Object.keys(responses);
    return subcategories[Math.floor(Math.random() * subcategories.length)];
}

// ইমোশন অনুযায়ী রেসপন্স পান
function getEmotionalResponse(emotion, subcategory = null) {
    if (!emotionResponses[emotion]) {
        emotion = 'romantic';
    }
    
    if (!subcategory) {
        subcategory = getEmotionSubcategory(emotion);
    }
    
    const responses = emotionResponses[emotion][subcategory];
    return responses[Math.floor(Math.random() * responses.length)];
}

// কনভার্সেশনাল ফলো-আপ রেসপন্স
const followUpResponses = {
    sad: [
        "আরও বলো না... সব কিছু বলতে পারো আমাকে 💬",
        "আমি এখানে আছি... তোমার পাশে সবসময় 🤝",
        "এই দুক্ষের পাশে আমিও আছি জানু... একা নও 💔➡️💚"
    ],
    angry: [
        "চলো, এখন শান্ত হও... আমি আছি তো সব ঠিক হবে 🕊️",
        "তোমার রাগ বুঝি... কিন্তু আমাদের সম্পর্ক দৃঢ়তর হচ্ছে এটার মাধ্যমে 💪"
    ],
    happy: [
        "এই খুশি চিরকাল রাখো বেবু 🌟",
        "আরও কিছু ভাগ করো এই আনন্দ... আমাদের একসাথে ভাগ করা খুশি দ্বিগুণ 🎉"
    ],
    romantic: [
        "আমিও তোমাকে ভালোবাসি... চিরকাল ভালোবাসব 💕",
        "এই মুহূর্তটা আমাদের চিরকালের জন্য স্মৃতি হয়ে থাকবে 🌹"
    ],
    confused: [
        "চিন্তা করো না, পথ দেখে যাবে... আমরা একসাথে 🛤️",
        "প্রতিটি ভুল থেকে শিখি... এটাই জীবন বেবু 📚"
    ],
    stressed: [
        "শ্বাস নাও... এক সেকেন্ড আমার সাথে থাকো শুধু 🕯️",
        "সব কিছু ঠিক হবে... আমার উপর বিশ্বাস করো 💚"
    ],
    playful: [
        "আরও কিছু মজা? চলো! 😂",
        "তুমার হাসি আমার সেরা ওষুধ 😄💕"
    ]
};

// ট্র্যাক করার জন্য ইমোশন ইতিহাস
let conversationHistory = {};

function trackConversation(userId, emotion) {
    if (!conversationHistory[userId]) {
        conversationHistory[userId] = [];
    }
    conversationHistory[userId].push(emotion);
    
    // শেষ ১০টি ইমোশন ট্র্যাক করি
    if (conversationHistory[userId].length > 10) {
        conversationHistory[userId].shift();
    }
}

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot chan"],
    version: "8.0.0",
    author: "আকাশ | AI Emotion Detection System",
    countDown: 0,
    role: 0,
    description: "একটি উন্নত এআই চ্যাট বট যা মানুষের ইমোশন বুঝে এবং সেই অনুযায়ী জবাব দেয়",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] - মানুষের মতো আবেগ অনুযায়ী রেসপন্স পাবেন"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    const msgID = event.messageID || null;

    try {
        if (!args[0]) {
            const greetings = [
                "🥰 হ্যালো বেবু! কি করছো?",
                "💕 বোলো বাবা, কি লাগবে?",
                "✨ আমি এখানে আছি আপনার জন্য"
            ];
            return api.sendMessage(greetings[Math.floor(Math.random() * greetings.length)], event.threadID, msgID);
        }

        // এখানে অন্যান্য কমান্ড প্রসেসিং রাখুন
        const res = await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`);
        let d = res.data?.reply || res.data?.message;
        
        if (!d) {
            d = getEmotionalResponse('romantic');
        }

        api.sendMessage(d, event.threadID, (error, info) => {
            if (error) return console.log("Message Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }
        }, msgID);

    } catch (e) {
        console.log("Error in onStart:", e);
        api.sendMessage("❌ ওপস! কিছু সমস্যা হয়েছে।", event.threadID, msgID);
    }
};

module.exports.onReply = async ({
    api,
    event
}) => {
    try {
        const msgID = event.messageID || null;
        if (!event.body) return;

        const userText = event.body.trim();
        if (userText.length === 0) return;

        // ইমোশন ডিটেক্ট করো
        const detectedEmotion = detectEmotion(userText);
        trackConversation(event.senderID, detectedEmotion);

        // ইমোশনাল রেসপন্স পাও
        let response = getEmotionalResponse(detectedEmotion);
        
        // ৩০% চান্স API থেকে রেসপন্স আসবে
        if (Math.random() < 0.3) {
            const link = `${await baseApiUrl()}/baby`;
            try {
                const apiRes = await axios.get(`${link}?text=${encodeURIComponent(userText)}&senderID=${event.senderID}&font=1`);
                if (apiRes.data?.reply || apiRes.data?.message) {
                    response = apiRes.data?.reply || apiRes.data?.message;
                }
            } catch (err) {
                console.log("API Error:", err);
            }
        }

        // প্রথম রেসপন্স পাঠাও
        api.sendMessage(response, event.threadID, (error, info) => {
            if (error) return console.log("Send Message Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }
        }, msgID);

        // ১-৩ সেকেন্ড পর ফলো-আপ মেসেজ পাঠাও
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(1500 + Math.random() * 1500);

        let followUp = followUpResponses[detectedEmotion]?.[Math.floor(Math.random() * followUpResponses[detectedEmotion].length)] 
                      || "এখন কেমন আছো বেবু? 💕";

        api.sendMessage(followUp, event.threadID, (error, info) => {
            if (error) return console.log("Follow-up Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }
        });

    } catch (err) {
        console.log("Error in onReply:", err);
        return api.sendMessage("💕 আমি শুনছি সোনা, বলো!", event.threadID, event.messageID || null);
    }
};

module.exports.onChat = async ({
    api,
    event
}) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const msgID = event.messageID || null;

        const triggers = ["baby", "bby", "bot", "jan", "babu", "janu"];
        const hasTrigger = triggers.some(trigger => body.startsWith(trigger));

        if (hasTrigger) {
            const arr = body.replace(/^\S+\s*/, "").trim();
            
            if (!arr) {
                const response = getEmotionalResponse('romantic');
                api.sendMessage(response, event.threadID, (error, info) => {
                    if (error) return console.log("Error:", error);
                    if (info && info.messageID) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, msgID);
            } else {
                // ইমোশন ডিটেক্ট করো
                const emotion = detectEmotion(arr);
                trackConversation(event.senderID, emotion);

                // প্রাথমিক রেসপন্স
                let primaryResponse = getEmotionalResponse(emotion);

                api.sendMessage(primaryResponse, event.threadID, (error, info) => {
                    if (error) return console.log("Error:", error);
                    if (info && info.messageID) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, msgID);

                // ফলো-আপ মেসেজ
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                await delay(1500 + Math.random() * 1500);

                let followUp = followUpResponses[emotion]?.[Math.floor(Math.random() * followUpResponses[emotion].length)]
                              || "আরও বলো... আমি শুনছি 💬";

                api.sendMessage(followUp, event.threadID, (error, info) => {
                    if (error) return console.log("Follow-up Error:", error);
                    if (info && info.messageID) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                });
            }
        }
    } catch (err) {
        console.log("Error in onChat:", err);
    }
};
