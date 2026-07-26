const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    version: "2.0.0",
    author: "Dipto / Fixed",
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

      try {
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }

        const filePath = path.join(cacheDir, `${Date.now()}_autodl.mp4`);
        let downloadLink = null;

        // ১. প্রাইমারি ডাউনলোডার (Cobalt API - সবচেয়ে ফাস্ট ও নির্ভরযোগ্য)
        try {
          const cobaltRes = await axios.post(
            "https://api.cobalt.tools/api/json",
            { url: videoUrl },
            {
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
              },
              timeout: 15000
            }
          );

          if (cobaltRes.data && cobaltRes.data.url) {
            downloadLink = cobaltRes.data.url;
          }
        } catch (err) {
          // Cobalt ব্যর্থ হলে ব্যাকআপ API ২
          try {
            const backupRes = await axios.get(
              `https://api.vytal.workers.dev/alldl?url=${encodeURIComponent(videoUrl)}`,
              { timeout: 15000 }
            );
            downloadLink = backupRes.data?.result || backupRes.data?.url;
          } catch (e) {
            downloadLink = null;
          }
        }

        if (!downloadLink) {
          throw new Error("ভিডিও সার্ভার লিংক সরবরাহ করতে পারেনি। লিঙ্কটি পাবলিক কি না যাচাই করুন।");
        }

        // বাইনারি ভিডিও স্ট্রিম হিসেবে ডাউনলোড
        const vidResponse = await axios.get(downloadLink, {
          responseType: "arraybuffer",
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        fs.writeFileSync(filePath, Buffer.from(vidResponse.data));

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        // মেসেঞ্জারে ভিডিও পাঠানো
        api.sendMessage(
          {
            body: `✅ | Download Completed!`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // ফাইল সেন্ড হওয়ার পর ডিলিট
            }
          },
          event.messageID
        );
      } catch (e) {
        api.setMessageReaction("❎", event.messageID, (err) => {}, true);
        console.error("AutoDL Error:", e);
        api.sendMessage(
          `❌ ডাউনলোড করতে সমস্যা হয়েছে: ${e.message || "Unknown error"}`,
          event.threadID,
          event.messageID
        );
      }
    }
  },
};
