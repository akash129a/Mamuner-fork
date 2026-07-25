const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "autodl",
        version: "2.0",
        author: "আকাশ",
        countDown: 5,
        role: 0,
        category: "media",
        description: {
            en: "Automatically download videos from supported links",
            bn: "যেকোনো সাপোর্টেড লিঙ্ক থেকে স্বয়ংক্রিয়ভাবে ভিডিও ডাউনলোড করুন",
            vi: "Tự động tải video từ các liên kết được hỗ trợ"
        },
        guide: {
            en: "[Just send any video link]",
            bn: "[শুধুমাত্র যেকোনো ভিডিও লিঙ্ক পাঠান]",
            vi: "[Chỉ cần gửi liên kết video]"
        }
    },

    langs: {
        bn: {
            error: "❌ ভিডিও ডাউনলোড করতে সমস্যা হয়েছে: %1",
            success: "✅ **আপনার ভিডিও তৈরি!**\n\n• **প্ল্যাটফর্ম:** %1\n• **ডাউনলোডার:** আকাশ"
        },
        en: {
            error: "❌ Failed to download video: %1",
            success: "✅ **Here is your video!**\n\n• **Platform:** %1\n• **Downloader:** Akash"
        }
    },

    onStart: async function () {},

    onChat: async function ({ api, event, getLang }) {
        if (!event.body) return;

        // বিভিন্ন সোশ্যাল মিডিয়া লিঙ্কের রেগেক্স
        const urlRegex = /(https?:\/\/(?:www\.|vm\.|vt\.|m\.)?(facebook\.com|fb\.watch|instagram\.com|tiktok\.com|youtu\.be|youtube\.com|x\.com|twitter\.com)\/[^\s]+)/gi;
        const matches = event.body.match(urlRegex);

        if (!matches || matches.length === 0) return;

        const videoLink = matches[0];

        // প্ল্যাটফর্ম শনাক্তকরণ
        let platform = "Video";
        if (/facebook\.com|fb\.watch/i.test(videoLink)) platform = "Facebook";
        else if (/instagram\.com/i.test(videoLink)) platform = "Instagram";
        else if (/tiktok\.com/i.test(videoLink)) platform = "TikTok";
        else if (/youtube\.com|youtu\.be/i.test(videoLink)) platform = "YouTube";
        else if (/x\.com|twitter\.com/i.test(videoLink)) platform = "X (Twitter)";

        const cacheDir = path.join(__dirname, "cache");
        const filePath = path.join(cacheDir, `autodl_${Date.now()}.mp4`);

        try {
            // রিয়েকশন দেওয়া (প্রসেসিং শুরু)
            api.setMessageReaction("⏳", event.messageID, () => {}, true);

            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // ভিডিও ডাউনলোডার API
            const apiUrl = `https://api.alldownloader.net/api/download?url=${encodeURIComponent(videoLink)}`;
            
            // API থেকে ডাটা নেওয়া
            const response = await axios.get(apiUrl);
            const downloadUrl = response.data?.data?.url || response.data?.url || response.data?.result;

            if (!downloadUrl) {
                throw new Error("ভিডিও এর ডাউনলোড লিঙ্ক পাওয়া যায়নি।");
            }

            // ভিডিও স্টিম/ফাইল ডাউনলোড করা
            const videoBuffer = await axios({
                method: "get",
                url: downloadUrl,
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            });

            fs.writeFileSync(filePath, Buffer.from(videoBuffer.data));

            // ফাইল সাইজ চেক করা
            if (fs.statSync(filePath).size < 1000) {
                throw new Error("ডাউনলোড হওয়া ফাইলটি সঠিক নয়।");
            }

            // রিয়েকশন দেওয়া (সফল)
            api.setMessageReaction("✅", event.messageID, () => {}, true);

            // মেসেজ ও ভিডিও পাঠানো
            return api.sendMessage({
                body: getLang("success", platform),
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => {
                // পাঠানো শেষ হলে ক্যাশ ফাইল ডিলিট করে দেওয়া
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }, event.messageID);

        } catch (error) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            
            return api.sendMessage(
                getLang("error", error.message || "Unknown error"),
                event.threadID,
                event.messageID
            );
        }
    }
};
