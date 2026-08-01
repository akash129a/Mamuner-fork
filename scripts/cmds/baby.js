const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot chan"],
    version: "7.0.1",
    author: "dipto edit by MAMUN | Fixed by Pro Dev",
    countDown: 0,
    role: 0,
    description: "একটি স্মার্ট এবং সুন্দর চ্যাট বট যা সুন্দর সুন্দর উত্তর দেয়",
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
        const d = res.data?.reply || res.data?.message || "আমি আপনার কথা ঠিক বুঝতে পারিনি সোনা!";

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
        
        // API কল করার জন্য সঠিক রিকোয়েস্ট
        const response = await axios.get(`${link}?text=${encodeURIComponent(userText)}&senderID=${event.senderID}&font=1`);
        
        let reply = response.data?.reply || response.data?.message;

        // API থেকে রিপ্লাই না আসলে ডিফল্ট উত্তর
        if (!reply) {
            const fallbackReplies = [
                "💕 বলো তো বেবু, আর কি জানতে চাও?",
                "😘 আমি শুনছি সোনা, বলো!",
                "✨ হুম বল, আমি তোমার সাথেই আছি!",
                "💗 আর কি খবর বলো তো ডার্লিং?"
            ];
            reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
        }

        // রিপ্লাই পাঠানো এবং পরের বার রিপ্লাই ধরে রাখার ব্যবস্থা করা
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
        return api.sendMessage("💕 হুম সোনা, আবার বলো শুনছি!", event.threadID, event.messageID || null);
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

            const randomReplies = [
                "💕 তোমার কথা ভেবে রাতের আকাশ আরো সুন্দর লাগে জানু 🌙",
                "✨ তুমি আমার জীবনের নক্ষত্র baby, সবসময় উজ্জ্বল থাকো",
                "🌹 তোমার হাসি আমার সব সুখের উৎস, এটা জানো বেবু?",
                "💗 আকাশের মতো গভীর আমার ভালোবাসা তোমার প্রতি ডার্লিং",
                "😚 Hey babe, তুমি ছাড়া আমার দিন অপূর্ণ থাকে 💫",
                "🥰 Baby girl, তোমার প্রতিটি কথা আমার হৃদয়ে ধরা পড়ে",
                "😜 ℌℯ𝓁𝓁ℴ জানু, তোমার কথা এত মিষ্টি যে ডায়াবেটিস হওয়ার ভয় 🍫",
                "😂 𝗬𝗢𝗨𝗞𝗻𝗢𝗪 তোমার চোখে প্রেম আছে, ডিগ্রী মাইনাস দশ 👀"
            ];

            // যদি শুধু ট্রিগার ওয়ার্ড (যেমন: baby / babu) লেখা হয়
            if (!arr) {
                const selectedReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
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
                    a = randomReplies[Math.floor(Math.random() * randomReplies.length)];
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
                const fallbackMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                return await api.sendMessage(fallbackMsg, event.threadID, msgID);
            }
        }
    } catch (err) {
        console.log("Error in onChat:", err);
    }
};
