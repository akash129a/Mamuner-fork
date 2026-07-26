const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ব্যাকআপ এপিআই লিস্ট (প্রথমটা ফেল মারলে পরেরটা কাজ করবে)
const backupApis = [
  "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json",
  "https://api.dipto.rf.gd/api", // Alternative fallback API
];

const getWorkingApiUrl = async () => {
  for (const url of backupApis) {
    try {
      const res = await axios.get(url, { timeout: 4000 });
      if (res.data && res.data.api) return res.data.api;
      if (typeof res.data === "string" && res.data.startsWith("http")) return res.data;
    } catch (e) {
      continue; // প্রথমটা ফেল করলে পরেরটায় যাবে
    }
  }
  // কোনো রেজাল্ট না পেলে ডিফল্ট ওয়ার্কিং পাবলিক এপিআই
  return "https://api.vytal.workers.dev";
};

module.exports = {
  config: {
    name: "autodl",
    version: "1.0.3",
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

    // অল-ইন-ওয়ান ভিডিও ইউআরএল ডিটেকশন
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
        let videoTitle = "Downloaded Video";

        // ১. প্রাইমারি API ট্রাই করা
        const baseUrl = await getWorkingApiUrl();
        
        try {
          const res = await axios.get(`${baseUrl}/alldl?url=${encodeURIComponent(videoUrl)}`, { timeout: 15000 });
          downloadLink = res.data?.result || res.data?.url || res.data?.video;
          if (res.data?.cp) videoTitle = res.data.cp;
        } catch (err) {
          // ২. ফেইল মারলে ডাইরেক্ট ইমার্জেন্সি অল্টারনেটিভ ডাইনলোডার
          const fallbackRes = await axios.get(`https://api.cobalt.tools/api/json`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            data: { url: videoUrl }
          }).catch(() => null);

          if (fallbackRes && fallbackRes.data && fallbackRes.data.url) {
            downloadLink = fallbackRes.data.url;
          }
        }

        if (!downloadLink) {
          throw new Error("ভিডিও ডাউনলোডের ফাইল বা লিংক তৈরি করা সম্ভব হয়নি।");
        }

        // ভিডিও ফাইল স্ট্রিম ডাউনলোড
        const vidResponse = await axios.get(downloadLink, {
          responseType: "arraybuffer",
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        fs.writeFileSync(filePath, Buffer.from(vidResponse.data));

        // Shorten URL (যদি Utility কাজ করে)
        let finalUrl = downloadLink;
        if (global.utils && typeof global.utils.shortenURL === "function") {
          try {
            finalUrl = await global.utils.shortenURL(downloadLink);
          } catch (e) {
            finalUrl = downloadLink;
          }
        }

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        // মেসেঞ্জারে ভিডিও পাঠানো
        api.sendMessage(
          {
            body: `✅ | Download Completed!\n\n📌 Title: ${videoTitle}\n🔗 Link: ${finalUrl}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // ক্যাশ খালি করা
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
