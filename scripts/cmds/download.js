const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    version: "3.0.0",
    author: "Dipto / Redesigned",
    countDown: 0,
    role: 0,
    description: {
      en: "Auto download video from TikTok, Facebook, Instagram, YouTube, etc.",
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

    // ভিডিও ইউআরএল ডিটেকশন
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

        // ১. অটোমেটিক ওয়ার্কিং ডাউনলোডার API
        const apis = [
          `https://api.tinag.me/download?url=${encodeURIComponent(videoUrl)}`,
          `https://auto-download-api.vercel.app/api/download?url=${encodeURIComponent(videoUrl)}`,
          `https://api.vytal.workers.dev/alldl?url=${encodeURIComponent(videoUrl)}`
        ];

        for (const apiUrl of apis) {
          try {
            const res = await axios.get(apiUrl, { timeout: 12000 });
            const data = res.data;

            // ভিন্ন ভিন্ন API এর রেসপন্স ফিল্টারিং
            downloadLink = data.url || data.result || data.data?.video || data.data?.url || (data.medias && data.medias[0]?.url);
            
            if (downloadLink) break; // লিংক পাওয়া গেলে লুপ থামবে
          } catch (e) {
            continue; // ব্যর্থ হলে পরবর্তী API চেষ্টা করবে
          }
        }

        if (!downloadLink) {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          return; // কোনো লিংক না পেলে মেসেজ ছাড়াই নিরবভাবে স্কিপ করবে
        }

        // ভিডিও ফাইল ডাউনলোড
        const writer = fs.createWriteStream(filePath);
        const videoResponse = await axios({
          url: downloadLink,
          method: "GET",
          responseType: "stream",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        });

        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        // মেসেঞ্জারে ভিডিও পাঠানো (বাড়তি কোনো লেখা ছাড়া)
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
