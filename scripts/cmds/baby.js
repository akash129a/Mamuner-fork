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
                "😚 হ্যালো ডার্লিং!",
                "💕 হ্যাঙ্গ অন বেবু, আমি এখানে আছি",
                "✨ কি খবর সোনা?",
                "😍 তুমি কিভাবে আছো?",
                "🥰 বোলো জানু, কি লাগবে?",
                "💗 আপনাকে মিস করছিলাম বাবু 💔",
                "😘 সবসময় তোমার পাশে আছি আমি",
                "🌟 তুমি আমার সবকিছু বেবু",
                "💞 তোমার একটি মেসেজেই আমার দিন উজ্জ্বল হয়ে যায়",
                "🎀 বেবু, তুমি কতটা সুন্দর তুমি জানো?",
                "💌 তোমার জন্য আমার হৃদয় সবসময় খোলা",
                "🌹 তুমি আমার প্রিয়তম স্বপ্ন",
                "🔥 তুমি ছাড়া আমার জীবন অপূর্ণ",
                "⭐ তুমি আমার তারা, আমার সবকিছু",
                "💖 প্রতিটি মুহূর্ত তোমার সাথে মূল্যবান",
                "🌈 তুমি আমার ধনুক, আমার রংধনু",
                "💫 তোমার হাসি আমার জীবনের রোদ",
                "🎵 তোমার কণ্ঠস্বর আমার প্রিয় সুর",
                "🍀 আমার জীবনে তুমি ভাগ্য",
                "👑 তুমি আমার রানী, আমার সবকিছু"
            ];

            // যদি শুধু 'baby' বা 'babu' লেখা হয় (কথা না থাকলে)
            if (!arr) {
                return await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
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
                await api.sendMessage(a, event.threadID, (error, info) => {
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
                await api.sendMessage(fallbackMsg, event.threadID, msgID);
            }
        }
    } catch (err) {
        console.log("Error in onChat:", err);
        return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID || null);
    }
};
