const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "video",
		aliases: ["ভিডিও", "yt"],
		version: "3.5",
		author: "AKASH",
		countDown: 5,
		role: 0,
		description: {
			bn: "ইউটিউব থেকে ভিডিও দ্রুত ডাউনলোড করুন (নাম বা লিঙ্ক দিয়ে)",
			en: "Download video from YouTube instantly (by name or link)",
			vi: "Tải video từ YouTube ngay lập tức (theo tên hoặc liên kết)"
		},
		category: "media",
		guide: {
			bn: '   {pn} <নাম বা লিঙ্ক>: সরাসরি ভিডিও ডাউনলোড হবে',
			en: '   {pn} <name or link>: Direct video download',
			vi: '   {pn} <tên hoặc liên kết>: Tải xuống trực tiếp'
		}
	},

	langs: {
		bn: {
			noInput: "❌ ভিডিওর নাম বা ইউটিউব লিঙ্ক দিন! 📺",
			noResult: "❌ কোনো ভিডিও পাওয়া যায়নি।",
			downloading: "⏳ ভিডিও ডাউনলোড হচ্ছে... অপেক্ষা করুন",
			success: "✅ ভিডিও ডাউনলোড সম্পন্ন!\n\n🎬 শিরোনাম: %1\n⏱️ সময়কাল: %2\n📊 গুণমান: %3",
			error: "❌ ত্রুটি: %1"
		},
		en: {
			noInput: "❌ Please provide a video name or YouTube link! 📺",
			noResult: "❌ No video found.",
			downloading: "⏳ Downloading video... Please wait",
			success: "✅ Video Downloaded Successfully!\n\n🎬 Title: %1\n⏱️ Duration: %2\n📊 Quality: %3",
			error: "❌ Error: %1"
		},
		vi: {
			noInput: "❌ Vui lòng cung cấp tên hoặc liên kết YouTube! 📺",
			noResult: "❌ Không tìm thấy video.",
			downloading: "⏳ Đang tải video... Vui lòng đợi",
			success: "✅ Tải video thành công!\n\n🎬 Tiêu đề: %1\n⏱️ Thời lượng: %2\n📊 Chất lượng: %3",
			error: "❌ Lỗi: %1"
		}
	},

	onStart: async function ({ api, event, args, message, getLang }) {

		if (!args[0]) return message.reply(getLang("noInput"));

		try {
			api.setMessageReaction("⏳", event.messageID, () => {}, true);
			
			const cacheDir = path.join(__dirname, "cache");
			if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

			// ইউটিউব লিঙ্ক চেক করুন
			const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
			let searchQuery;

			if (checkurl.test(args[0])) {
				searchQuery = args[0];
			} else {
				searchQuery = args.join(" ");
			}

			// ভিডিও তথ্য পান (একাধিক API ব্যবহার করুন)
			let videoData;

			try {
				// প্রথম API - yt-dlp
				const response1 = await axios.get(`https://api.davidsnow.io/yt?url=${encodeURIComponent(searchQuery)}`, {
					timeout: 10000
				});
				if (response1.data && response1.data.downloadUrl) {
					videoData = response1.data;
				}
			} catch (e) {
				try {
					// দ্বিতীয় API - वैকल्पिक সূত্র
					const response2 = await axios.get(`https://api.cobalt.tools/api/json`, {
						method: 'POST',
						data: { url: searchQuery },
						timeout: 10000
					});
					if (response2.data && response2.data.url) {
						videoData = {
							downloadUrl: response2.data.url,
							title: "YouTube Video"
						};
					}
				} catch (e2) {
					// তৃতীয় API
					const response3 = await axios.get(`https://api.aio.guru/youtube?url=${encodeURIComponent(searchQuery)}`, {
						timeout: 10000
					});
					if (response3.data && response3.data.url) {
						videoData = response3.data;
					}
				}
			}

			if (!videoData || !videoData.downloadUrl) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(getLang("noResult"));
			}

			// ভিডিও ডাউনলোড করুন
			const videoID = Math.random().toString(36).substring(7);
			const filePath = path.join(cacheDir, `video_${videoID}.mp4`);

			try {
				const videoBuffer = (await axios.get(videoData.downloadUrl, {
					responseType: "arraybuffer",
					timeout: 30000,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
					}
				})).data;

				fs.writeFileSync(filePath, Buffer.from(videoBuffer));

				const title = videoData.title || "YouTube Video";
				const duration = videoData.duration || "Unknown";
				const quality = videoData.quality || "720p";

				return message.reply({
					body: getLang("success", title, duration, quality),
					attachment: fs.createReadStream(filePath)
				}, () => {
					api.setMessageReaction("✅", event.messageID, () => {}, true);
					setTimeout(() => {
						if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
					}, 2000);
				});

			} catch (downloadErr) {
				console.error("Download Error:", downloadErr);
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(getLang("error", "ভিডিও ডাউনলোড ব্যর্থ হয়েছে। পরে চেষ্টা করুন।"));
			}

		} catch (err) {
			console.error("Video Error:", err.message);
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return message.reply(getLang("error", err.message || "অজানা ত্রুটি"));
		}
	}
};
