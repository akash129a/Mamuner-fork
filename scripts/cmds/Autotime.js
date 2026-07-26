const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 24-hour timer data
const timerData = {
  "12:00 AM": {
    text: `╭━━━〔 🌙 গভীর রাত 〕━━━╮\n\n🌌 রাতের এই নীরবতা আল্লাহর এক অপূর্ব নিয়ামত।\n🤲 একটু জিকির করুন, দোয়া করুন এবং শান্তিতে বিশ্রাম নিন।\n\n﴾ سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ ﴿\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/7ch5ym.mp4"
  },
  "01:00 AM": {
    text: `╭━━━〔 🌌 রাত ১টা 〕━━━╮\n\n✨ তারাভরা আকাশ সাক্ষী—আল্লাহর সৃষ্টি কত নিখুঁত!\n😴 সুস্থ থাকার জন্য এখন বিশ্রাম নিন।\n\n﴾ الْحَمْدُ لِلّٰهِ ﴿\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/rqnlpt.mp4"
  },
  "02:00 AM": {
    text: `╭━━━〔 🌠 রাত ২টা 〕━━━╮\n\n🍃 প্রকৃতির নীরবতা আমাদের শেখায়,\nসব নিয়ামতই মহান আল্লাহর পক্ষ থেকে।\n\n🤲 আলহামদুলিল্লাহ\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/ev7guv.mp4"
  },
  "03:00 AM": {
    text: `╭━━━〔 🌃 রাত ৩টা 〕━━━╮\n\n🌙 রাতের শেষ প্রহর—\nআল্লাহকে স্মরণ করার এক সুন্দর সময়।\n\n﴾ أَسْتَغْفِرُ اللّٰهَ ﴿\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/rijx8m.mp4"
  },
  "04:30 AM": {
    text: `╭━━━〔 🌅 𝐅𝐀𝐉𝐑 • ফজরের সময় 〕━━━╮\n\n﴾ ﷽ ﴿\n\nاَلصَّلَاةُ خَيْرٌ مِّنَ النَّوْمِ\n\n🤲 আর কিছুক্ষণ পর ফজরের নামাজের সময় হবে।\n🕌 সবাই অজু করে নামাজের জন্য প্রস্তুতি নিন।\n\nاللَّهُمَّ اجْعَلْنَا مِنَ الْمُقِيمِينَ لِلصَّلَاةِ\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/ee9khu.mp4"
  },
  "06:00 AM": {
    text: `╭━━━〔 ☀️ শুভ সকাল 〕━━━╮\n\n🌿 নতুন সূর্যের আলো আল্লাহর অশেষ রহমতের নিদর্শন।\n✨ আলহামদুলিল্লাহ বলে দিনটি শুরু হোক।\n\n🤍 আল্লাহ সবাইকে হেফাজত করুন।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/otdztt.mp4"
  },
  "07:00 AM": {
    text: `╭━━━〔 🌸 সকাল ৭টা 〕━━━╮\n\n🍀 সকালের নির্মল বাতাস,\nসবুজ প্রকৃতি আর আল্লাহর অশেষ নিয়ামত।\n\n💚 হাসিমুখে দিন শুরু করুন।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/q6b7fo.mp4"
  },
  "08:00 AM": {
    text: `╭━━━〔 🌤️ সকাল ৮টা 〕━━━╮\n\n🌱 প্রতিটি নতুন সকাল\nআল্লাহর দেওয়া একটি নতুন সুযোগ।\n\n✨ নেক আমলে কাটুক আজকের দিন।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/jxa3ka.mp4"
  },
  "09:00 AM": {
    text: `╭━━━〔 🌞 সকাল ৯টা 〕━━━╮\n\n🌳 প্রকৃতির সৌন্দর্য দেখুন,\nআল্লাহর সৃষ্টি নিয়ে চিন্তা করুন।\n\n🤲 আলহামদুলিল্লাহ\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/wtu9vw.mp4"
  },
  "10:00 AM": {
    text: `╭━━━〔 🌼 সকাল ১০টা 〕━━━╮\n\n🌺 ফুল, আকাশ আর সবুজ পৃথিবী—\nসবই মহান আল্লাহর সৃষ্টি।\n\n🤍 শুকরিয়া আল্লাহ।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/guv0tc.mp4"
  },
  "11:00 AM": {
    text: `╭━━━〔 🌿 সকাল ১১টা 〕━━━╮\n\n🍃 ব্যস্ততার মাঝেও\nআল্লাহর অগণিত নিয়ামতের জন্য\nশুকরিয়া আদায় করুন।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/aecxiz.mp4"
  },
  "12:00 PM": {
    text: `╭━━━〔 ☀️ দুপুর ১২টা 〕━━━╮\n\n🌏 সুন্দর এই পৃথিবী\nমহান আল্লাহর এক অসীম নিয়ামত।\n\n💚 সবার জন্য দোয়া রইল।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/wrc15v.mp4"
  },
  "01:00 PM": {
    text: `╭━━━〔 🕌 𝐙𝐔𝐇𝐑 • যোহরের সময় 〕━━━╮\n\n﴾ ﷽ ﴿\n\nحَيَّ عَلَى الصَّلَاةِ\n\n🤲 আর কিছুক্ষণ পর যোহরের নামাজের সময় হবে।\n🕌 সবাই নামাজের জন্য প্রস্তুতি নিন।\n\nرَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/c5qbek.mp4"
  },
  "02:00 PM": {
    text: `╭━━━〔 🌳 দুপুর ২টা 〕━━━╮\n\n🍃 প্রকৃতির মাঝে কিছুটা সময় কাটান।\n🤲 সর্বদা আল্লাহর ওপর ভরসা রাখুন।\n\n﴾ حَسْبُنَا اللَّهُ ﴿\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/vgecfk.mp4"
  },
  "03:00 PM": {
    text: `╭━━━〔 🌅 বিকেল ৩টা 〕━━━╮\n\n🍂 বিকেলের মৃদু হাওয়া\nমনে করিয়ে দেয়—\nআল্লাহর প্রতিটি সৃষ্টি সৌন্দর্যময়।\n\n🤍 আলহামদুলিল্লাহ\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/iddna6.mp4"
  },
  "04:30 PM": {
    text: `╭━━━〔 🕌 𝐀𝐒𝐑 • আসরের সময় 〕━━━╮\n\n﴾ ﷽ ﴿\n\nإِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا\n\n🤲 আর কিছুক্ষণ পর আসরের নামাজের সময় হবে।\n🕌 সবাই নামাজের জন্য প্রস্তুতি নিন।\n\nاللَّهُمَّ تَقَبَّلْ مِنَّا\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/vcgbxq.mp4"
  },
  "06:30 PM": {
    text: `╭━━━〔 🌇 𝐌𝐀𝐆𝐇𝐑𝐈𝐁 • মাগরিবের সময় 〕━━━╮\n\n﴾ ﷽ ﴿\n\nالله أكبر، الله أكبر\n\n🤲 আর কিছুক্ষণ পর মাগরিবের নামাজের সময় হবে।\n🕌 সবাই অজু করে নামাজের জন্য প্রস্তুতি নিন।\n\nاللَّهُمَّ تَقَبَّلْ مِنَّا\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/y8pnz7.mp4"
  },
  "08:00 PM": {
    text: `╭━━━〔 🌙 𝐈𝐒𝐇𝐀 • এশার সময় 〕━━━╮\n\n﴾ ﷽ ﴿\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n🤲 আর কিছুক্ষণ পর এশার নামাজের সময় হবে।\n🕌 সবাই নামাজের জন্য প্রস্তুতি নিন।\n\nآمِين يَا رَبَّ الْعَالَمِينَ\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/rpnut9.mp4"
  },
  "09:00 PM": {
    text: `╭━━━〔 🌙 রাত ৯টা 〕━━━╮\n\n✨ রাতের শান্ত আকাশ\nআল্লাহর অসীম মহিমার সাক্ষী।\n\n🤲 আজকের সকল নিয়ামতের জন্য\nশুকরিয়া আদায় করুন।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/fpac7y.mp4"
  },
  "10:00 PM": {
    text: `╭━━━〔 🌌 রাত ১০টা 〕━━━╮\n\n🌠 আল্লাহর হেফাজতের দোয়া করে\nশান্তিতে বিশ্রাম নিন।\n\n🤍 শুভ রাত্রি।\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/e7v8en.mp4"
  },
  "11:00 PM": {
    text: `╭━━━〔 🌃 রাত ১১টা 〕━━━╮\n\n🌙 নীরব রাত, শীতল বাতাস\nআর আল্লাহর রহমত।\n\n🤲 আগামী দিনটি হোক\nকল্যাণময় ও বরকতময়।\n\n✨ آمين يا رب العالمين ✨\n\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    video: "https://files.catbox.moe/7bas7j.mp4"
  }
};

const sentMap = new Map();

module.exports = {
  config: {
    name: "autotimer",
    version: "2.0.0",
    author: "Akash Chowdhury",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Automated hourly messages with videos"
    },
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    return api.sendMessage("⏰ Auto-timer system is running in the background.", event.threadID, event.messageID);
  },

  cronjobs: {
    "*/30 * * * * *": async function ({ api }) {
      try {
        const now = moment().tz("Asia/Dhaka").format("hh:mm A");
        const today = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

        const data = timerData[now];
        if (!data) return;

        const sentKey = `${today}_${now}`;
        if (sentMap.has(sentKey)) return;

        sentMap.set(sentKey, true);
        if (sentMap.size > 100) sentMap.clear();

        const cacheDir = path.join(__dirname, "cache", "autotimer");
        fs.ensureDirSync(cacheDir);

        const videoFile = path.join(cacheDir, `${now.replace(/[: ]/g, "_")}.mp4`);

        if (!fs.existsSync(videoFile)) {
          try {
            const response = await axios.get(data.video, {
              responseType: "arraybuffer",
              timeout: 30000
            });
            fs.writeFileSync(videoFile, Buffer.from(response.data));
          } catch (err) {
            console.error("[AutoTimer] Video download failed:", err.message);
            return;
          }
        }

        const messageBody = 
`╔══════════════════╗
        ⏰ 𝐀𝐔𝐓𝐎 𝐓𝐈𝐌𝐄𝐑 ⏰
╠══════════════════╣

🕒 𝐓𝐈𝐌𝐄 ➜ ${now}
📅 𝐃𝐀𝐓𝐄 ➜ ${today}

┏━━━━━━━━━━━━━━━━━━┓
${data.text}
┗━━━━━━━━━━━━━━━━━━┛

   _—_⚡ 𝐀𝐊𝐀𝐒𝐇 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 ⚡_—_
╚═══════════════════╝`;

        const threads = await api.getThreadList(1000, null, ["INBOX"]);
        if (!Array.isArray(threads)) return;

        const groups = threads.filter(t => t.isGroup && t.isSubscribed);

        for (const thread of groups) {
          try {
            await api.sendMessage(
              {
                body: messageBody,
                attachment: fs.createReadStream(videoFile)
              },
              thread.threadID
            );
          } catch (err) {
            console.error(`[AutoTimer] Failed to send message to ${thread.threadID}:`, err.message);
          }
        }

      } catch (err) {
        console.error("[AutoTimer Error]:", err);
      }
    }
  }
};
