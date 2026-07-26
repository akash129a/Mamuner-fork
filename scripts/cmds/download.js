const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    version: "4.0.0",
    author: "Dipto / Advanced",
    countDown: 0,
    role: 0,
    description: {
      en: "Auto download video from TikTok, Facebook (Public & Private), Instagram, etc.",
    },
    category: "media",
    guide: {
      en: "[video_link]",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event }) {
    if (!event.body) return;
    const messageText = event.body.trim();

    const urlRegex = /(https?:\/\/(?:www\.|vt\.|vm\.|fb\.watch\/|m\.|fb\.)?(?:tiktok\.com|facebook\.com|fb\.com|instagram\.com|youtu\.be|youtube\.com|x\.com|twitter\.com|pin\.it|pinterest\.com)[^\s]+)/i;
    const match = messageText.match(urlRegex);

    if (match) {
      const videoUrl = match[0];
      const cacheDir = path.join(__dirname, "cache");
      const filePath = path.join(cacheDir, `${Date.now()}_autodl.mp4`);

      try {
        api.setMessageReaction("⏳", event.messageID, () => {}, true);

        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }

        let downloadLink = null;

        // প্রাইভেট ও পাবলিক ভিডিও প্রসেস করার জন্য স্পেশাল গেটওয়ে এপিআই
        const primaryApi = `https://getvideo-api.vercel.app/api/download?url=${encodeURIComponent(videoUrl)}`;
        const backupApi = `https://api.vytal.workers.dev/alldl?url=${encodeURIComponent(videoUrl)}`;

        try {
          const res = await axios.get(primaryApi, { timeout: 15000 });
          downloadLink = res.data?.url || res.data?.hd || res.data?.sd;
        } catch (e) {
          try {
            const res2 = await axios.get(backupApi, { timeout: 15000 });
            downloadLink = res2.data?.result || res2.data?.url;
          } catch (err) {
            downloadLink = null;
          }
        }

        if (!downloadLink) {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          return;
        }

        // স্ট্রিম ডাউনলোড
        const writer = fs.createWriteStream(filePath);
        const videoResponse = await axios({
          url: downloadLink,
          method: "GET",
          responseType: "stream",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          }
        });

        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        // কোনো টেক্সট ছাড়া শুধুই ভিডিও পাঠানো
        api.sendMessage(
          {
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          },
          event.messageID
        );

      } catch (e) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
  },
};
