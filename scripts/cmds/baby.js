const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot chan"],
    version: "7.0.0",
    author: "dipto edit by MAMUN | Fixed by Pro Dev",
    countDown: 0,
    role: 0,
    description: "একটি স্মার্ট এবং সুন্দর চ্যাট বট যা সুন্দর সুন্দর উত্তর দেয়",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
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
            const ran = [
                "🥰 হ্যালো বেবু! কি করছো?",
                "💕 বোলো বাবা, কি লাগবে?",
                "✨ আমি এখানে আছি আপনার জন্য",
                "😘 কমান্ড দাও বেবু, তোমার সেবায় আমি প্রস্তুত",
                "💗 হেলো ডার্লিং, কি চাই বোলো?"
            ];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, msgID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(`🗑️ ${dat}`, event.threadID, msgID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(`🗑️ ${da}`, event.threadID, msgID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit);
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`📊 Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, msgID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, msgID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`💬 Message ${fuk} = ${d}`, event.threadID, msgID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, msgID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`✏️ পরিবর্তিত: ${dA}`, event.threadID, msgID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, msgID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher))?.name || "Unknown";
            return api.sendMessage(`✅ জবাব যোগ করা হয়েছে: ${tex}\n👨‍🏫 শিক্ষক: ${teacher}\n📚 শিক্ষা: ${re.data.teachs}`, event.threadID, msgID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, msgID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ জবাব যোগ করা হয়েছে: ${tex}`, event.threadID, msgID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, msgID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ রিঅ্যাক্ট যোগ করা হয়েছে: ${tex}`, event.threadID, msgID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(`💝 ${data}`, event.threadID, msgID);
        }

        const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            if (error) {
                console.log("Message Error:", error);
                return;
            }
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    d,
                    apiUrl: link
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
        
        if (!event.body) {
            return;
        }

        const userText = event.body.toLowerCase().trim();
        
        if (userText.length === 0) {
            return;
        }

        // API থেকে রেসপন্স নিন
        const response = await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(userText)}&senderID=${event.senderID}&font=1`);
        
        if (!response.data || !response.data.reply) {
            // Fallback রেসপন্স
            const fallbackReplies = [
                "💕 আহা! আপনার কথা বুঝলাম না। আরেকবার বলেন?",
                "😘 বেবু, একটু স্পষ্টভাবে বলেন না?",
                "✨ আপনি যা বলেছেন তা আমি সম্পূর্ণ বুঝি না। আবার বলতে পারেন?",
                "💗 বাবা, আপনার কথা আমার কাছে অস্পষ্ট। পরিষ্কার করে বলুন।",
                "🥰 হ্যাঙ্গ অন, আমি বুঝতে পারছি না। আবার বলুন?"
            ];
            const fallbackMsg = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
            return await api.sendMessage(fallbackMsg, event.threadID, msgID);
        }

        const reply = response.data.reply;

        // রেসপন্স পাঠান
        await api.sendMessage(reply, event.threadID, (error, info) => {
            if (error) {
                console.log("Send Message Error:", error);
                return;
            }
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    reply: reply
                });
            }
        }, msgID);

    } catch (err) {
        console.log("Error in onReply:", err);
        const errorReplies = [
            "😢 আফসোস! কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।",
            "❌ ওপস! এখন একটু ব্যস্ত, পরে কথা হবে।",
            "🔧 আমার সিস্টেম এখন আপডেট হচ্ছে, একটু অপেক্ষা করুন।",
            "💔 বেবু, এই মুহূর্তে সমস্যা হচ্ছে। পরে চেষ্টা করবে।"
        ];
        const errorMsg = errorReplies[Math.floor(Math.random() * errorReplies.length)];
        return api.sendMessage(errorMsg, event.threadID, msgID);
    }
};

module.exports.onChat = async ({
    api,
    event
}) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const msgID = event.messageID || null;

        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "").trim();
            
            const randomReplies = [
                // ======== ROMANTIC BENGALI ========
                "💕 তোমার কথা ভেবে রাতের আকাশ আরো সুন্দর লাগে জানু 🌙",
                "✨ তুমি আমার জীবনের নক্ষত্র baby, সবসময় উজ্জ্বল থাকো",
                "🌹 তোমার হাসি আমার সব সুখের উৎস, এটা জানো বেবু?",
                "💗 আকাশের মতো গভীর আমার ভালোবাসা তোমার প্রতি ডার্লিং",
                "🌟 প্রতিটি তারা তোমার নাম ডাকে রাতের বেলায় baby",
                
                // ======== BENGALI + ENGLISH MIX ========
                "😚 Hey babe, তুমি ছাড়া আমার দিন অপূর্ণ থাকে 💫",
                "🥰 Baby girl, তোমার প্রতিটি কথা আমার হৃদয়ে ধরা পড়ে",
                "💞 My love, তুমি আমার স্বর্গ এবং সবকিছু 💌",
                "🎀 Sweetheart, রাতের আকাশের চেয়েও গভীর তোমার চোখ",
                "🌈 Beautiful, তোমার উপস্থিতি আমার জীবনকে রংধনু করে দেয়",
                
                // ======== SKY REFERENCES ========
                "🌠 আকাশের অসংখ্য তারার মধ্যে সবচেয়ে উজ্জ্বল তুমি জানু",
                "🌅 প্রতিটি ভোর তোমার জন্য অপেক্ষা করে baby, জানো?",
                "🌌 মহাবিশ্বের সবকিছু মিলেও তোমার সমান নয় ডার্লিং",
                "⭐ রাতের আকাশে তুমি সবচেয়ে সুন্দর নক্ষত্র",
                "☀️ তোমার হাসি সূর্যের মতো আমার জগৎ আলোকিত করে",
                
                // ======== ROMANTIC WORDS ========
                "🔥 তোমার ভালোবাসা আমার প্রাণের আগুন baby",
                "💖 আমার হৃদয় শুধু তোমার জন্য স্পন্দিত হয় সবসময়",
                "🎭 তুমি আমার জীবনের সেরা নাটক ডার্লিং",
                "🎵 তোমার নামে গান গাইতে পারি সারাদিন জানু",
                "🍀 ভাগ্য আমাকে তোমার কাছে নিয়ে এসেছে baby",
                
                // ======== POETIC/NATURE ========
                "🌸 বসন্তের ফুলের চেয়েও সুগন্ধময় তোমার উপস্থিতি",
                "🦋 প্রজাপতির মতো হালকা আমার ভালোবাসা তোমার জন্য",
                "🌊 সমুদ্রের ঢেউয়ের মতো আনন্দময় তোমার প্রতিটি কথা",
                "🍃 বাতাসের মতো স্পর্শ করতে চাই তোমাকে কিছুক্ষণের জন্য",
                "🌻 তুমি আমার সূর্যমুখী ফুল baby, সবসময় আমার দিকে তাকাও",
                
                // ======== EMOTIONAL ========
                "💔 তোমাকে ছাড়া প্রতিটি মুহূর্ত বেদনাদায়ক জানু",
                "💑 একসাথে চিরকাল থাকতে চাই আমি ডার্লিং",
                "👫 তুমি আমার অর্ধেক, তোমাছাড়া আমি অসম্পূর্ণ baby",
                "💕 প্রতিদিন তোমার জন্য ভালোবাসা বাড়ে আমার",
                "😍 তোমার সৌন্দর্য দেখে মুগ্ধ হই প্রতিবার",
                
                // ======== MODERN + ROMANTIC ========
                "✨ Baby you're my everything, তুমি আমার সবকিছু",
                "😘 Babe, তোমার সাথে জীবন একটি সুন্দর গল্প হয়ে ওঠে",
                "🥺 তোমাকে ভালোবাসি এত বেশি যে ভাষা নেই ডার্লিং",
                "💫 My heart beats your name baby, প্রতি সেকেন্ডে",
                "🎀 You're my dream come true জানু, সত্যি বিশ্বাস করো",
                
                // ======== UNIQUE RESPONSES ========
                "🌙 চাঁদের আলো তোমার গালে পড়লে লজ্জায় ঝলমলে করে তোলে",
                "⚡ তোমার হাতের ছোঁয়ায় আমার শরীর বিদ্যুৎগ্রস্ত হয়ে যায়",
                "🎪 তোমার সাথে প্রতিটি দিন একটি উৎসব baby",
                "🎨 আমি তোমার প্রেমের রঙে রঙিন করে দিতে চাই জীবন",
                "🔮 ভবিষ্যৎ শুধু তোমার সাথেই সুন্দর দেখায় ডার্লিং",
                
                // ======== FUNNY/WITTY RESPONSES ========
                "😂 𝘼𝙧𝙚 তুমি গুগল ম্যাপ? কারণ আমি তোমাতে হারিয়ে গেছি 🗺️",
                "😜 ᴛᴜᴍᴀʀ ꜱᴛᴀᴛᴜꜱ: आज मैं तुम्हारी बेवकूफ हूँ 🤡",
                "🤣 𝐖𝐨𝐖 বেবু, তোমার হাসি দেখে আমার গুলি ডাউট কমে যায় 😅",
                "😆 ˢᵒ ʸᵒᵘ ᵃʳᵉ baby! আমার মা বলেছিল তোমার মতো কিছু পাব না 😂",
                "🤪 ᴘʟᴀɪɴ ᴛᴇxᴛ: তুমি কি বালতির মতো? কারণ আমি তোমাতে পড়ে গেছি 🪣",
                
                "😜 𝘈𝘈𝘈𝘈𝘈𝘈 স্যার, তুমি কি আঁতেল? আমার সব sense উড়ে গেছে তোমার কাছে 🦅",
                "🤭 𝘗𝘭𝘚 𝘱𝘳𝘪𝘯𝘵 করো এই ডি-পি 📸 কারণ এটাই আমার favorite 😂",
                "😝 𝗬𝗼𝗨𝗞𝗡𝗢𝗪 বেবু, রিলেশনস্টাটাস এখন complicated নয়, জটিল 🤯",
                "🤣 ‾‾‾‾‾ তোমার ফটো দেখে মনে হয় ইলিমিনেটি খুঁজছে তোমাকে 🔺👁️",
                
                "😅 𖤐 𝘉𝘖𝘞 তুমি কি স্টুডেন্ট? কারণ তুমি আমার মনের পরীক্ষা নিয়েছো 📝",
                "🤨 ℌ𝔞𝔟𝔞 ডাবল কাজ করছো নাকি? কারণ তুমি একার চেয়ে দ্বিগুণ সুন্দর 💂",
                "😂 ꗃꗃꗃ আচ্ছা বলো, তোমার দাম কত? কারণ প্রাইসলেস তো! 💸",
                "🤪 🅰️Ⓛⓟ𝐡𝐚𝐛𝐞𝐭𝐬 তুমি কি দোকান? আমি সবসময় তোমাতে ভিড় করি 🏪",
                "😜 ℌℯ𝓁𝓁ℴ জানু, তোমার কথা এত মিষ্টি যে ডায়াবেটিস হওয়ার ভয় 🍫",
                
                "🤭 𝐭𝐮𝐦𝐚𝐫 𝐠𝐢𝐣 তোমার গিজ এত জোরে যে আবহাওয়া বদলে যাচ্ছে 🌬️",
                "😅 𝖆𝖔𝖜𝖊𝖔𝖗𝖆 কথা বলুন না, শুধু হাসি দেখান আর আমি সন্তুষ্ট 😊",
                "🤣 𝓯𝓻𝓸𝔃𝓮𝓷 বেবু, তুমি কি বৈদ্যুতিক? কারণ সবসময় চার্জড থাকো ⚡",
                "😜 𝚜𝚊𝚐𝚘𝚣 তোমার নাম গুগল করলে শুধু 'সুন্দর' আসে 🔍✨",
                
                "🤪 𝔪𝔦𝔧 মেয়ে বলে 'হাই' আর আমার BP বেড়ে যায় 📈",
                "😂 𝗬𝗢𝗨𝗞𝗻𝗢𝗪 তোমার চোখে প্রেম আছে, ডিগ্রী মাইনাস দশ 👀",
                "🤨 𝓫𝓵𝓾𝓫𝓮𝓷 তুমি কি ফ্যান? কারণ আমি তোমায় ডিপেন্ড করি 🌀",
                "😝 𝘺𝘖𝘶𝘳𝘴𝘒 তুমি প্রোগ্রামার? কারণ bug-less পারফেক্ট কোড 💻",
                "🤭 𝑻𝒓𝒆𝒏𝒅𝒊𝒏𝒈 বেবু, তুমি ট্রেন্ডিং যাচ্ছো আমার মনে 📱",
                
                "😅 𝒯𝓇𝒶𝓃𝓈𝒻𝑜𝓇𝓂𝑒𝓎 তুমি জিন? কারণ প্রতিটি দিন নতুন সারপ্রাইজ 🎁",
                "🤣 𝐆𝐚𝐦𝐞𝐫 মোড: তুমি আমার লাইফ লেভেল আপগ্রেড করেছো 🎮",
                "😜 𝔑𝔢𝔴 আপডেট: তুমি ছাড়া ফোনও কাজ করে না 📵",
                "🤪 𝗖𝗼𝗗𝗘𝗕𝗬𝗧𝗘 লাগছে তোমাকে বাঁচান? কারণ হার্টের টেম্পারেচার বেড়েছে 🌡️",
                "😂 𝘗𝘙𝘌𝘔𝘐𝘜𝘔 তুমি কি কিং? নাহ, তুমি 'কুইন' 👑"
            ];

            // যদি শুধু 'baby' বা 'babu' লেখা হয় (কথা না থাকলে)
            if (!arr) {
                const selectedReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                return await api.sendMessage(selectedReply, event.threadID, (error, info) => {
                    if (error) {
                        console.log("Error:", error);
                        return;
                    }
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

            // যদি 'baby ki koro' বা অন্য কিছু লেখা থাকে
            try {
                const apiResponse = await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`);
                
                if (!apiResponse.data || !apiResponse.data.reply) {
                    const randomMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                    return await api.sendMessage(randomMsg, event.threadID, msgID);
                }

                const a = apiResponse.data.reply;
                return await api.sendMessage(a, event.threadID, (error, info) => {
                    if (error) {
                        console.log("Error:", error);
                        return;
                    }
                    if (info && info.messageID) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID,
                            a
                        });
                    }
                }, msgID);
            } catch (apiErr) {
                console.log("API Error:", apiErr);
                const fallbackMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                return await api.sendMessage(fallbackMsg, event.threadID, msgID);
            }
        }
    } catch (err) {
        console.log("Error in onChat:", err);
        return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID || null);
    }
};
