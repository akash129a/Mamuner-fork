const fs = require("fs");
const path = require("path");
const yts = require("yt-search");
const ytdlp = require("yt-dlp-exec");

module.exports = {
  config: {
    name: "sing",
    version: "3.0",
    author: "Akash Chowdhury",
    countDown: 10,
    role: 0,
    shortDescription: { bn: "দ্রুত গান সার্চ করে অডিও ডাউনলোড", en: "Fast song search & audio download" },
    category: "music",
    guide: { bn: "{pn} <গানের নাম>", en: "{pn} <song name>" }
  },

  onStart: async function ({ message, args }) {
    const query = args.join(" ").trim();
    if (!query) return message.reply("একটা গানের নাম দাও।\nউদাহরণ: sing shape of you");

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    try {
      // Step 1: Search video
      const search = await yts(query);
      const video = search?.videos?.[0];
      if (!video?.url) return message.reply("কিছুই পাওয়া যায়নি। অন্য নাম দিয়ে ট্রাই করো।");

      const titleSafe = (video.title || "song").replace(/[\\/:*?"<>|]/g, "");
      const filePath = path.join(cacheDir, `sing_${Date.now()}_${titleSafe}.mp3`);

      // Step 2: Download Audio using yt-dlp
      await ytdlp(video.url, {
        extractAudio: true,
        audioFormat: "mp3",
        output: filePath,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
          'referer:youtube.com',
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
      });

      // Step 3: Send Audio File
      await message.reply({
        body: `✅ Song: ${video.title}\n⏱ Duration: ${video.timestamp || "N/A"}`,
        attachment: fs.createReadStream(filePath)
      });

      // Step 4: Cleanup File
      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 60 * 1000);

    } catch (err) {
      console.error(err);
      return message.reply(`❌ সমস্যা হয়েছে: ${err.message || "গান ডাউনলোড করা সম্ভব হয়নি।"}`);
    }
  }
};
