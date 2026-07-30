const fs = require("fs");
const path = require("path");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  config: {
    name: "sing",
    version: "2.0",
    author: "Akash Chowdhury",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Search and download a song audio fast",
      bn: "দ্রুত গান সার্চ করে অডিও ডাউনলোড"
    },
    longDescription: {
      en: "Search YouTube and send the audio as a file",
      bn: "YouTube থেকে সার্চ করে অডিও ফাইল পাঠায়"
    },
    category: "music",
    guide: {
      en: "{pn} <song name>",
      bn: "{pn} <গানের নাম>"
    }
  },

  onStart: async function ({ message, args }) {
    const query = args.join(" ").trim();
    if (!query) {
      return message.reply("একটা গানের নাম দাও।\nউদাহরণ: sing shape of you");
    }

    // cache folder
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    try {
      // Fast search
      const search = await yts(query);
      const video = search.videos && search.videos.length ? search.videos[0] : null;

      if (!video || !video.url) {
        return message.reply("কিছুই পাওয়া যায়নি। অন্য নাম দিয়ে ট্রাই করো।");
      }

      const url = video.url;
      const title = (video.title || "song").replace(/[\\/:*?"<>|]/g, "");
      const filePath = path.join(cacheDir, `sing_${Date.now()}_${title}.mp3`);

      // Download audio
      const stream = ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
      });

      await new Promise((resolve, reject) => {
        const write = fs.createWriteStream(filePath);
        stream.pipe(write);
        stream.on("error", reject);
        write.on("finish", resolve);
        write.on("error", reject);
      });

      // Send
      await message.reply({
        body: `✅ গান পাওয়া গেছে:\n• Title: ${video.title}\n• Duration: ${video.timestamp}\n• Channel: ${video.author?.name || "Unknown"}`,
        attachment: fs.createReadStream(filePath)
      });

      // cleanup
      setTimeout(() => {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }, 60 * 1000);

    } catch (err) {
      return message.reply(`❌ সমস্যা হয়েছে: ${err?.message || err}`);
    }
  }
};
