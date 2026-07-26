const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  try {
    const base = await axios.get(
      `https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json`
    );
    return base.data.api;
  } catch (err) {
    return null;
  }
};

module.exports = {
  config: {
    name: "autodl",
    version: "1.0.2",
    author: "Dipto",
    countDown: 0,
    role: 0,
    description: {
      en: "Auto download video from TikTok, Facebook, Instagram, YouTube, and more",
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

    // Regex দিয়ে যেকোনো লিংকের ভেতর থেকে ভিডিও লিঙ্ক ম্যাচ করার লজিক
    const urlRegex = /(https?:\/\/(?:www\.|vt\.|vm\.|fb\.watch\/|m\.|fb\.)?(?:tiktok\.com|facebook\.com|fb\.com|instagram\.com|youtu\.be|youtube\.com|x\.com|twitter\.com)[^\s]+)/i;
    const match = messageText.match(urlRegex);

    if (match) {
      const videoUrl = match[0];

      try {
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

        const apiUrl = await baseApiUrl();
        if (!apiUrl) {
          throw new Error("API base URL পাওয়া যায়নি!");
        }

        // Cache ফোল্ডার না থাকলে তৈরি করে নেবে
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }

        // ইউনিক ফাইল নেম তৈরি (যাতে ব্যাক-টু-ব্যাক ডাউনলোডে ক্র্যাশ না করে)
        const filePath = path.join(cacheDir, `${Date.now()}_autodl.mp4`);

        // API থেকে ভিডিওর আসল লিংক আনা
        const { data } = await axios.get(
          `${apiUrl}/alldl?url=${encodeURIComponent(videoUrl)}`
        );

        const downloadLink = data.result || data.url || data.video;
        if (!downloadLink) {
          throw new Error("ভিডিও এর ডাউনলোড লিংক পাওয়া যায়নি।");
        }

        // সঠিকভাবে বাইনারি ভিডিও ডাউনলোড করা (utf-8 ছাড়া)
        const vidResponse = await axios.get(downloadLink, {
          responseType: "arraybuffer",
        });

        fs.writeFileSync(filePath, Buffer.from(vidResponse.data));

        // URL Shortener সেফটি চেক
        let finalUrl = downloadLink;
        if (global.utils && typeof global.utils.shortenURL === "function") {
          try {
            finalUrl = await global.utils.shortenURL(downloadLink);
          } catch (e) {
            finalUrl = downloadLink;
          }
        }

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        // ভিডিও পাঠানো এবং শেষ হলে লোকাল স্টোরেজ থেকে ডিলিট করা
        api.sendMessage(
          {
            body: `${data.cp || "✅ Download Completed!"}\n\n🔗 Link: ${finalUrl}`,
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
        api.setMessageReaction("❎", event.messageID, (err) => {}, true);
        console.error("AutoDL Error:", e);
        api.sendMessage(
          `❌ ডাউনলোড করতে সমস্যা হয়েছে: ${e.message || "Unknown Error"}`,
          event.threadID,
          event.messageID
        );
      }
    }
  },
};
