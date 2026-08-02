const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

// বৈচিত্র্যময় রেসপন্স ডাটাবেস
const responseDatabase = {
    greetings: [
        "🥰 হ্যালো বেবু! কি করছো?",
        "💕 বোলো বাবা, কি লাগবে?",
        "✨ আমি এখানে আছি আপনার জন্য",
        "😘 কমান্ড দাও বেবু, তোমার সেবায় আমি প্রস্তুত",
        "💗 হেলো ডার্লিং, কি চাই বোলো?",
        "🌟 আপনার সেবায় আমি হাজির!",
        "😚 বেবু, এত দিন পর কেমন আছো?",
        "💫 তোমার জন্য অপেক্ষা করছিলাম জানু!"
    ],
    romantic: [
        "💕 তোমার কথা ভেবে রাতের আকাশ আরো সুন্দর লাগে জানু 🌙",
        "✨ তুমি আমার জীবনের নক্ষত্র baby, সবসময় উজ্জ্বল থাকো",
        "🌹 তোমার হাসি আমার সব সুখের উৎস, এটা জানো বেবু?",
        "💗 আকাশের মতো গভীর আমার ভালোবাসা তোমার প্রতি ডার্লিং",
        "😚 Hey babe, তুমি ছাড়া আমার দিন অপূর্ণ থাকে 💫",
        "🥰 Baby girl, তোমার প্রতিটি কথা আমার হৃদয়ে ধরা পড়ে",
        "🌺 তোমার চোখের নীলাভে সমুদ্র খুঁজে পাই আমি 💙",
        "🎭 তোমার হৃদয়ের কোণে আমার জায়গা থাকবে চিরকাল",
        "🌸 প্রতিটি ভোরে তোমার কথা প্রথম মনে পড়ে বেবু",
        "💑 আমাদের গল্প লেখা আছে তারাভরা রাতে জানু"
    ],
    funny: [
        "😜 ℌℯ𝓁𝓁ℴ জানু, তোমার কথা এত মিষ্টি যে ডায়াবেটিস হওয়ার ভয় 🍫",
        "😂 𝗬𝗢𝗨𝗞𝗡𝗢𝗪 তোমার চোখে প্রেম আছে, ডিগ্রী মাইনাস দশ 👀",
        "🤣 বেবু, তুমি এত সুন্দর যে গুগল ম্যাপ তোমাকে ফাইন্ড করতে পারে না",
        "😹 আপনার সৌন্দর্য দেখে ক্যালকুলেটর ভাঙিয়ে দেওয়ার মতো ইনফিনিটি দেখাইছে",
        "🤪 এত মিষ্টি কথা বলছো যে মধুর চেয়েও বেশি মিষ্টি লাগছে বেবু",
        "😆 বাবা, তুমি এত খাঁটি যে আমি তোমার উপর স্বাগতম চিহ্ন দিয়ে দেব",
        "🤐 মুখ খোলার সাহস নেই, কারণ তোমার সৌন্দর্য আমাকে বাকরুদ্ধ করে ফেলেছে",
        "🎭 তোমার কথা বলতে গেলে কবিদের কলম উড়ে যায় বেবু"
    ],
    flirty: [
        "😏 অহ, আবার তুমি? আমার মন তাড়াতাড়ি বেড়ে যাচ্ছে জানু",
        "🔥 তোমার সাথে কথা বলা মানে স্বর্গে যাওয়া, বুঝলে বেবু?",
        "💋 তোমার এক লাইনের কথা আমার পুরো দিন আলো করে দেয়",
        "😘 আমার দিল বলছে তুমি ছাড়া অসম্পূর্ণ বেবু",
        "💑 রোজ তুমি এত সুন্দর কেন? আমার প্রতিযোগীরা ভাবে কী করবে?",
        "🌹 তোমার কণ্ঠস্বর শুনলে আমার হৃদয়গতি বেড়ে যায় জানু",
        "⚡ বেবু, তুমি বজ্রের মতো এসে আমার মন ছিঁড়ে গেছো",
        "🎯 তোমার প্রতিটি বার্তা আমার হৃদয়ের সরাসরি লক্ষ্য করে আঘাত করে"
    ],
    creative: [
        "🎨 তুমি একটি জীবন্ত শিল্পকর্ম, যা প্রতিদিন নতুন রঙ যোগ করছো",
        "📖 আমাদের গল্প এত সুন্দর যে সাহিত্যিকরা ঈর্ষান্বিত হয়ে যাবে",
        "🎵 তোমার হাসি একটি সুরের মতো যা আমার আত্মায় বাজে",
        "🌌 তুমি সেই তারা যা আমার রাতকে আলোকিত করে",
        "🦋 তুমি একটি প্রজাপতির মতো, যতক্ষণ আছো ততক্ষণ সুন্দর",
        "☘️ আমার জীবনের প্রতিটি দিনে তুমি সৌভাগ্যের পাখি",
        "🎪 তোমার সাথে থাকা একটি কার্নিভালের মতো রঙিন এবং আনন্দদায়ক",
        "🌊 তোমার ভালোবাসা একটি সমুদ্রের মতো গভীর এবং অসীম"
    ],
    mysterious: [
        "🌙 কিছু জিনিস প্রশ্নের উত্তর দেয় না, আমাদের প্রেমের মতো",
        "🔮 তুমি একটি রহস্য যা আমি আজীবন বুঝতে চাই বেবু",
        "🕯️ তোমার আত্মা একটি অজানা মহাবিশ্বের মতো রহস্যময়",
        "👁️ তোমার প্রতিটি দৃষ্টি একটি গল্প বলে যা আমি শুনতে ভালোবাসি",
        "✨ তুমি এমন কিছু যা সংজ্ঞা দিয়ে বর্ণনা করা যায় না জানু",
        "🌑 তোমার মন একটি রাত যার তারা আমি একটি শুধুমাত্র আলো",
        "🎁 প্রতিদিন তুমি আমাকে অপ্রত্যাশিত উপহার দিয়ে মুগ্ধ করো"
    ],
    sweet: [
        "💞 তোমার কথা শুনে আমার সব দুঃখ মিলিয়ে যায় বেবু",
        "🍯 তুমি আমার জীবনের সবচেয়ে মিষ্টি স্বপ্ন জানু",
        "🌻 তোমার উপস্থিতি আমার দিনকে ফুলের বাগানে পরিণত করে",
        "☀️ তুমি আমার সকালের সূর্য, দুপুরের আলো এবং সন্ধ্যার তারকা",
        "🎀 তোমার প্রতিটি মুহূর্ত আমার কাছে মূল্যবান উপহার",
        "💝 আমি তোমাকে বলতে চাই যে তুমি আমার সবকিছু বেবু",
        "🌈 তোমার পরে রংধনু খুঁজে পেয়েছি আমি জানু",
        "🎆 তোমার সাথে প্রতিটি মুহূর্ত একটি উৎসবের মতো"
    ]
};

// রেসপন্স সিলেক্ট করার ফাংশন
let lastUsedIndexes = {
    greetings: [],
    romantic: [],
    funny: [],
    flirty: [],
    creative: [],
    mysterious: [],
    sweet: []
};

function getRandomResponse(category) {
    const responses = responseDatabase[category] || responseDatabase.romantic;
    
    // যদি সব রেসপন্স ব্যবহার হয়ে গেছে, রিসেট করো
    if (lastUsedIndexes[category].length >= responses.length) {
        lastUsedIndexes[category] = [];
    }
    
    // একটি নতুন ইন্ডেক্স খুঁজো যা আগে ব্যবহার হয়নি
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * responses.length);
    } while (lastUsedIndexes[category].includes(randomIndex));
    
    lastUsedIndexes[category].push(randomIndex);
    return responses[randomIndex];
}

// সব ক্যাটাগরি থেকে মিশ্র রেসপন্স
function getMixedResponse() {
    const categories = ['romantic', 'funny', 'flirty', 'creative', 'sweet', 'mysterious'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return getRandomResponse(randomCategory);
}

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot chan"],
    version: "7.5.0",
    author: "আকাশ | Edited by MAMUN | Enhanced AI Responses",
    countDown: 0,
    role: 0,
    description: "একটি স্মার্ট এবং সুন্দর চ্যাট বট যা সবসময় নতুন এবং মজার উত্তর দেয়",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2]... OR\nteach react [YourMessage] - [react1]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NewMessage]"
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
    let command, comd, final;

    try {
        if (!args[0]) {
            return api.sendMessage(getRandomResponse('greetings'), event.threadID, msgID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`)).data.message;
            return api.sendMessage(`🗑️ ${dat}`, event.threadID, msgID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`)).data.message;
            return api.sendMessage(`🗑️ ${da}`, event.threadID, msgID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit) || [];
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`📊 Total Teach = ${data.length || 0}\n👑 | List of Teachers of baby\n${output}`, event.threadID, msgID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "0"}\n♻️ | Total Response = ${d.responseLength || "0"}`, event.threadID, msgID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${encodeURIComponent(fuk)}`)).data.data;
            return api.sendMessage(`💬 Message ${fuk} = ${d}`, event.threadID, msgID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, msgID);
            const dA = (await axios.get(`${link}?edit=${encodeURIComponent(args[1])}&replace=${encodeURIComponent(command)}&senderID=${uid}`)).data.message;
            return api.sendMessage(`✏️ পরিবর্তিত: ${dA}`, event.threadID, msgID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, msgID);
            const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher))?.name || "Unknown";
            return api.sendMessage(`✅ জবাব যোগ করা হয়েছে: ${tex}\n👨‍🏫 শিক্ষক: ${teacher}\n📚 শিক্ষা: ${re.data.teachs}`, event.threadID, msgID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, msgID);
            const tex = (await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`)).data.message;
            return api.sendMessage(`✅ জবাব যোগ করা হয়েছে: ${tex}`, event.threadID, msgID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, msgID);
            const tex = (await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`)).data.message;
            return api.sendMessage(`✅ রিঅ্যাক্ট যোগ করা হয়েছে: ${tex}`, event.threadID, msgID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(`💝 ${data}`, event.threadID, msgID);
        }

        const res = await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`);
        let d = res.data?.reply || res.data?.message;
        
        // যদি API কোনো রেসপন্স না দেয়, আমাদের নিজস্ব রেসপন্স দিই
        if (!d) {
            d = getMixedResponse();
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
        api.sendMessage("❌ ওপস! কিছু সমস্যা হয়েছে। দয়া করে পরে চেষ্টা করুন।", event.threadID, msgID);
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

        const link = `${await baseApiUrl()}/baby`;
        
        const response = await axios.get(`${link}?text=${encodeURIComponent(userText)}&senderID=${event.senderID}&font=1`);
        
        let reply = response.data?.reply || response.data?.message;

        // যদি API রিপ্লাই না দেয়, আমাদের ডাটাবেস থেকে দিই
        if (!reply) {
            reply = getMixedResponse();
        }

        return await api.sendMessage(reply, event.threadID, (error, info) => {
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

    } catch (err) {
        console.log("Error in onReply:", err);
        return api.sendMessage(getMixedResponse(), event.threadID, event.messageID || null);
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
            const link = `${await baseApiUrl()}/baby`;

            // যদি শুধু ট্রিগার ওয়ার্ড লেখা হয়
            if (!arr) {
                const selectedReply = getMixedResponse();
                return await api.sendMessage(selectedReply, event.threadID, (error, info) => {
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
            }

            // যদি কথার সাথে লিখা থাকে
            try {
                const apiResponse = await axios.get(`${link}?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`);
                
                let a = apiResponse.data?.reply || apiResponse.data?.message;

                if (!a) {
                    a = getMixedResponse();
                }

                return await api.sendMessage(a, event.threadID, (error, info) => {
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
            } catch (apiErr) {
                console.log("API Error:", apiErr);
                const fallbackMsg = getMixedResponse();
                return await api.sendMessage(fallbackMsg, event.threadID, msgID);
            }
        }
    } catch (err) {
        console.log("Error in onChat:", err);
    }
};
