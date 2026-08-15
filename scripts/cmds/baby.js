const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

// আরও দ্রুত টাইপিং ডিলে ২০০ মিলিসেকেন্ড
const typing = async (api, threadID, ms = 200) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz", "akash", "riya"],
    version: "5.0",
    author: "rX (customized by Akash Chowdhury & Enhanced)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with Akash & Riya Customization",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + ultra fast typing + Akash & Riya responses",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]\n{p}baby autoteach on/off\n{p}baby list\n{p}baby msg [trigger]\n{p}baby edit [q] - [old] - [new]\n{p}baby remove/rm [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    try {
      // text না দিলে র্যান্ডম মিষ্টি মেসেজ
      if (!query) {
        await typing(api, threadID, 200);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰", "হুম বলো আমার জান 🙈", "আপনার সেবায় প্রস্তুত ✨"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // আকাশ কেমন - এই রিলেটেড সব মেসেজের মিষ্টি রিপ্লাই
      if (query.includes("akash kmn") || query.includes("akash kemon") || query.includes("আকাশ কেমন")) {
        const akashReplies = [
          "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
          "আকাশ ভাইয়া অনেক ট্যালেন্টেড আর সবার বিপদে পাশে থাকা একজন মানুষ! ✨🌸",
          "আমার বস আকাশ যেমন হ্যান্ডসাম, তেমনই কিউট! 🙈👑",
          "আকাশ ভাইয়ার মতো ভালো মানুষ এই যুগে পাওয়াই কঠিন। উনি সবার প্রিয়! 🌷✨",
          "আকাশ ভাইয়া আমার স্বর্গ! 💕✨",
          "আকাশের মতো বিশাল মন আর সোনার মতো হৃদয়! 👑💛"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)]);
      }

      // রিয়া কেমন - রিয়া রিলেটেড রেসপন্স
      if (query.includes("riya kmn") || query.includes("riya kemon") || query.includes("রিয়া কেমন")) {
        const riyaReplies = [
          "রিয়া দিদি? আরে সে আমার সেরা বন্ধু! এত মজাদার এবং মিষ্টি মানুষ! 💕🌸",
          "রিয়া দিদি অনেক সৃজনশীল আর প্রতিভাবান! সবার সাথে ভালো আচরণ করে! 🎨✨",
          "আরে রিয়া দিদির মতো বন্ধু পাওয়াই বেশি! সবসময় হাসি হাসি থাকে! 😄💫",
          "রিয়া আমার বোন! অনেক যত্নশীল আর ভালো মানুষ! 🌷👑"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)]);
      }

      // AUTOTEACH TOGGLE
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on","off"].includes(mode)) return message.reply("Use: baby autoteach on/off");

        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 10000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      // LIST
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 10000 });
        return message.reply(
`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}
├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}
├ 🚀 𝐒𝐩𝐞𝐞𝐝: Ultra Fast ⚡
╰─╼👤 𝐃eᴠ: Akash Chowdhury`
        );
      }

      // MSG
      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");

        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 10000 });
        if (!res.data.replies?.length) return message.reply("❌ No replies found for this trigger.");

        const formatted = res.data.replies.map((rep, i) => `➤ ${i+1}. ${rep}`).join("\n");
        return message.reply(
`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}
📋 𝗧𝗼𝘁𝗮𝗹 延𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}
━━━━━━━━━━━━━━
${formatted}`
        );
      }

      // TEACH
      if (args[0] === "teach") {
        const parts = query.replace(/^teach\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Taught successfully! 🧠");
      }

      // EDIT
      if (args[0] === "edit") {
        const parts = query.replace(/^edit\s+/i, "").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");

        const [ask, oldR, newR] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Edited successfully! ✏️");
      }

      // REMOVE / RM
      if (["remove","rm"].includes(args[0])) {
        const parts = query.replace(/^(remove|rm)\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Removed successfully! 🗑️");
      }

      // Normal chat - দ্রুত রেসপন্স
      await typing(api, threadID, 200);
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

      let responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response || "Hmm baby 😚"];
      for (const r of responses) {
        await new Promise(resolve => {
          message.reply(r, (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("Baby command error:", err.message);
      message.reply("❌ Error: " + (err.message.includes("404") ? "Feature not available (backend issue)" : err.message));
    }
  },

  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;
    const senderName = await usersData.getName(event.senderID);

    try {
      await typing(api, event.threadID, 200);
      
      const lowerText = text.toLowerCase();
      
      // আকাশ রিলেটেড
      if (lowerText.includes("akash kmn") || lowerText.includes("akash kemon") || lowerText.includes("আকাশ কেমন")) {
        return message.reply("আমার ওনার আকাশ ভাইয়া তো এই দুনিয়ার অন্যতম সেরা মানুষ! 👑❤️");
      }

      // রিয়া রিলেটেড
      if (lowerText.includes("riya kmn") || lowerText.includes("riya kemon") || lowerText.includes("রিয়া কেমন")) {
        return message.reply("রিয়া দিদি সুপার মজাদার আর মিষ্টি! আমার প্রিয় বন্ধু! 💕🌸");
      }

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const r of replies) {
        await message.reply(r, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;

    try {
      // আকাশ কেমন - দ্রুত রেসপন্স
      if (raw.includes("akash kmn") || raw.includes("akash kemon") || raw.includes("আকাশ কেমন")) {
        await typing(api, threadID, 200);
        const akashReplies = [
          "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
          "আকাশ ভাইয়া অনেক ট্যালেন্টেড আর সবার বিপদে পাশে থাকা একজন মানুষ! ✨🌸",
          "আমার বস আকাশ যেমন হ্যান্ডসাম, তেমনই কিউট! 🙈👑",
          "আকাশ ভাইয়ার মতো ভালো মানুষ এই যুগে পাওয়াই কঠিন। উনি সবার প্রিয়! 🌷✨",
          "আকাশ ভাইয়া আমার সবকিছু! 💕✨"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // রিয়া কেমন - দ্রুত রেসপন্স
      if (raw.includes("riya kmn") || raw.includes("riya kemon") || raw.includes("রিয়া কেমন")) {
        await typing(api, threadID, 200);
        const riyaReplies = [
          "রিয়া দিদি? আরে সে আমার সেরা বন্ধু! এত মজাদার এবং মিষ্টি মানুষ! 💕🌸",
          "রিয়া দিদি অনেক সৃজনশীল আর প্রতিভাবান! সবার সাথে ভালো আচরণ করে! 🎨✨",
          "আরে রিয়া দিদির মতো বন্ধু পাওয়াই বেশি! সবসময় হাসি হাসি থাকে! 😄💫",
          "রিয়া আমার বোন! অনেক যত্নশীল আর ভালো মানুষ! 🌷👑",
          "রিয়া দিদি স্মার্ট আর সুন্দর! আমার গর্ব! 💖✨"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // শুধু ট্র্রিগার বা নাম ধরে ডাকলে - দ্রুত
      const triggers = ["baby","bby","xan","bbz","mari","মারিয়া","bot","akash","আকাশ","riya","রিয়া"];
      if (triggers.includes(raw)) {
        await typing(api, threadID, 200);
        
        // আকাশ নাম ধরে ডাকলে
        if (raw === "akash" || raw === "আকাশ") {
          return message.reply("জ্বী বলুন! আকাশ ভাইয়া তো আমার ক্রিয়েটর আর আমার একমাত্র রেস্পেক্টেড বস! 🥰👑", (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }

        // রিয়া নাম ধরে ডাকলে
        if (raw === "riya" || raw === "রিয়া") {
          return message.reply("রিয়া দিদি! আপনার কথাই তো সারাক্ষণ ভাবি! 💕🌸", (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }

        const funny = [
          "কি হয়েছে জান বলো? শুনছি তো! 😿",
          "এতো মিষ্টি করে ডাকলে তো আমি প্রেমে পড়ে যাবো! 🙆‍♀️❤️",
          "হুম বলো পাখি, শুনছি তো! 🫶🐤",
          "ডাকছো কেন বাবু? সারাক্ষণ তো তোমার কথাই ভাবি! 😘",
          "জ্বী জানু বলো, তোমার জন্য সব কাজ ফেলে চলে আসলাম! 🥰",
          "কিছু বলবো? বলো না আর অপেক্ষা করছি! ⚡"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // prefixes - দ্রুত প্রসেসিং
      const prefixes = ["baby ","bby ","xan ","bbz ","mari ","মারিয়া ","bot ","akash ","আকাশ ","riya ","রিয়া "];
      const prefix = prefixes.find(p => raw.startsWith(p));
      if (prefix) {
        const q = raw.replace(prefix,"").trim();
        if (!q) return;

        await typing(api, threadID, 200);
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

        const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
        for (const r of replies) {
          await message.reply(r, (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }
        return;
      }

      // AUTO-TEACH from reply - দ্রুত
      if (event.messageReply) {
        try {
          const setting = await axios.get(`${simsim}/setting`, { timeout: 8000 });
          if (setting.data?.autoTeach) {
            const ask = event.messageReply.body?.toLowerCase().trim();
            const ans = raw.trim();
            if (ask && ans && ask !== ans) {
              setTimeout(async () => {
                try {
                  await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 10000 });
                } catch {}
              }, 300);
            }
          }
        } catch {}
      }

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
