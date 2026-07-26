const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "download",
    version: "3.0.0",
    author: "MOHAMMAD AKASH / Fixed",
    countDown: 5,
    role: 0,
    shortDescription: "Download video or file from any link",
    category: "media",
    guide: "{pn} <link>"
  },

  onStart: async function ({ api, event, args }) {
    const url = args[0];

    if (!url) {
      return api.sendMessage(
        "⚠️ Pʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠɪᴅᴇᴏ ᴏʀ ғɪʟᴇ ʟɪɴᴋ.\n\nE xᴀᴍᴘʟᴇ:\n/download https://example.com/video.mp4",
        event.threadID,
        event.messageID
      );
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(cacheDir, `${Date.now()}_download.mp4`);

    try {
      const loadingMsg = await api.sendMessage(
        "⏳ Dᴏᴡɴʟᴏᴀᴅɪɴɢ • Jᴜsᴛ A Mᴏᴍᴇɴᴛ...",
        event.threadID
      );

      let targetUrl = url;
      const isSocialMedia = /(facebook|fb|instagram|tiktok|youtu|twitter|x\.com|pin\.it)/i.test(url);

      // সোশ্যাল মিডিয়া লিঙ্ক হলে একাধিক বিকল্প সার্ভার দিয়ে চেষ্টা করবে
      if (isSocialMedia) {
        const apis = [
          `https://auto-download-api.vercel.app/api/download?url=${encodeURIComponent(url)}`,
          `https://api.vytal.workers.dev/alldl?url=${encodeURIComponent(url)}`,
          `https://api.tinag.me/download?url=${encodeURIComponent(url)}`
        ];

        let foundLink = null;
        for (const apiUrl of apis) {
          try {
            const res = await axios.get(apiUrl, { timeout: 12000 });
            foundLink = res.data?.url || res.data?.result || res.data?.data?.video || res.data?.data?.url;
            if (foundLink) break;
          } catch (e) {
            continue; // একটি এপিআই ফেল করলে পরেরটি চেষ্টা করবে
          }
        }

        if (foundLink) {
          targetUrl = foundLink;
        }
      }

      // ফাইল স্ট্রিম মোডে ডাউনলোড
      const writer = fs.createWriteStream(filePath);
      const res = await axios({
        url: targetUrl,
        method: "GET",
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        timeout: 30000
      });

      res.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // লোডিং মেসেজ আনসেন্ড করা
      api.unsendMessage(loadingMsg.messageID);

      // ভিডিও পাঠানো
      api.sendMessage(
        {
          body: `✅ Dᴏᴡɴʟᴏᴀᴅ Cᴏᴍᴘʟᴇᴛᴇ!`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        event.messageID
      );

    } catch (err) {
      console.error(err);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      api.sendMessage(
        "❌ Dᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ! Tʜᴇ ʟɪɴᴋ ᴍᴀʏ ʙᴇ ᴘʀɪᴠᴀᴛᴇ ᴏʀ ɪɴᴠᴀʟɪᴅ.",
        event.threadID,
        event.messageID
      );
    }
  }
};
