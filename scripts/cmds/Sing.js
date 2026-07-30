const fs = require("fs");
const path = require("path");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  config: {
    name: "sing",
    version: "2.1",
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
      const search = await yts(query);
      const video = search?.videos?.[0];
      if (!video?.url) return message.reply("কিছুই পাওয়া যায়নি। অন্য নাম দিয়ে ট্রাই করো।");

      const titleSafe = (video.title || "song").replace(/[\\/:*?"<>|]/g, "");
      const filePath = path.join(cacheDir, `sing_${Date.now()}_${titleSafe}.mp3`);

      // FIX: remove quality: "highestaudio"
      const stream = ytdl(video.url, {
        filter: "audioonly",
        // quality removed to avoid "No such format found"
        highWaterMark: 1 << 25,
        liveBuffer: 4900,
        dlChunkSize: 0
      });

      await new Promise((resolve, reject) => {
        const write = fs.createWriteStream(filePath);
        stream.pipe(write);
        stream.on("error", reject);
        write.on("finish", resolve);
        write.on("error", reject);
      });

      await message.reply({
        body: `✅ Song: ${video.title}\n⏱ Duration: ${video.timestamp || "N/A"}`,
        attachment: fs.createReadStream(filePath)
      });

      // optional cleanup
      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 60 * 1000);

    } catch (err) {
      return message.reply(`❌ সমস্যা হয়েছে: ${err.message}`);
    }
  }
};
