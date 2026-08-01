const axios = require("axios");
const fs = require('fs');
const path = require('path');

// স্থিতিশীল API এন্ডপয়েন্টগুলি
const APIs = [
	{
		name: "RapidAPI YT",
		fetch: async (query) => {
			const response = await axios.get(`https://youtube-by-api.p.rapidapi.com/search`, {
				params: { query: query, type: "video", max_results: 1 },
				headers: {
					'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo',
					'X-RapidAPI-Host': 'youtube-by-api.p.rapidapi.com'
				},
				timeout: 8000
			});
			if (response.data && response.data.contents && response.data.contents[0]) {
				const video = response.data.contents[0];
				return {
					title: video.title,
					url: `https://www.youtube.com/watch?v=${video.video_id}`,
					duration: video.duration || "Unknown",
					thumbnail: video.thumbnail
				};
			}
			return null;
		}
	},
	{
		name: "YouTube Downloader API",
		fetch: async (url) => {
			const response = await axios.get(`https://www.y2mate.com/api/info`, {
				params: { url: url, lang: 'en' },
				timeout: 8000
			});
			if (response.data) {
				return response.data;
			}
			return null;
		}
	}
];

// লোকাল ডাউনলোড ফাংশন (ফলব্যাক)
const downloadFromDirect = async (videoUrl) => {
	try {
		const response = await axios.get(videoUrl, {
			responseType: "arraybuffer",
			timeout: 30000,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
		return response.data;
	} catch (err) {
		return null;
	}
};

module.exports = {
	config: {
		name: "video",
		aliases: ["ভিডিও", "yt", "ytdl"],
		version: "4.0",
		author: "AKASH",
		countDown: 3,
		role: 0,
		description: {
			bn: "ইউটিউব থেকে সরাসরি ভিডিও ডাউনলোড করুন - নিরাপদ এবং দ্রুত",
			en: "Download YouTube videos safely and instantly",
			vi: "Tải video YouTube an toàn và ngay lập tức"
		},
		category: "media",
		guide: {
			bn: '   {pn} <ভিডিওর নাম বা লিঙ্ক>',
			en: '   {pn} <video name or link>',
			vi: '   {pn} <tên hoặc liên kết video>'
		}
	},

	langs: {
		bn: {
			noInput: "❌ ভিডিওর নাম বা ইউটিউব লিঙ্ক প্রদান করুন!",
			processing: "⏳ প্রসেস করছি, অনুগ্রহ করে অপেক্ষা করুন...",
			searching: "🔍 সার্চ করছি: %1",
			downloading: "📥 ডাউনলোড করছি...",
			noResult: "❌ কোনো ভিডিও খুঁজে পাওয়া যায়নি।",
			error: "❌ ত্রুটি: %1",
			retry: "🔄 পুনরায় চেষ্টা করছি..."
		},
		en: {
			noInput: "❌ Please provide a video name or YouTube link!",
			processing: "⏳ Processing, please wait...",
			searching: "🔍 Searching: %1",
			downloading: "📥 Downloading...",
			noResult: "❌ No video found.",
			error: "❌ Error: %1",
			retry: "🔄 Retrying..."
		},
		vi: {
			noInput: "❌ Vui lòng cung cấp tên hoặc liên kết video!",
			processing: "⏳ Đang xử lý, vui lòng đợi...",
			searching: "🔍 Đang tìm kiếm: %1",
			downloading: "📥 Đang tải xuống...",
			noResult: "❌ Không tìm thấy video.",
			error: "❌ Lỗi: %1",
			retry: "🔄 Đang thử lại..."
		}
	},

	onStart: async function ({ api, event, args, message, getLang, usersData }) {

		if (!args[0]) return message.reply(getLang("noInput"));

		let statusMsg = null;

		try {
			api.setMessageReaction("⏳", event.messageID, () => {}, true);

			const query = args.join(" ");
			const userName = await usersData.getName(event.senderID);

			// ক্যাশ ডিরেক্টরি তৈরি করুন
			const cacheDir = path.join(__dirname, "cache");
			if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

			// ইউটিউব লিঙ্ক ভ্যালিডেশন
			const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.+$/i;
			let videoUrl = youtubeRegex.test(query) ? query : null;

			let videoInfo = null;
			let downloadLink = null;

			// যদি সরাসরি লিঙ্ক না হয়, সার্চ করুন
			if (!videoUrl) {
				statusMsg = await message.reply(`🔍 সার্চ করছি: "${query}"\n\n⏳ অপেক্ষা করছি...`);
				
				try {
					// নতুন YouTube API এন্ডপয়েন্ট ব্যবহার করুন
					const searchRes = await axios.get(`https://www.youtube.com/results`, {
						params: { search_query: query },
						timeout: 8000
					});

					// ফলাফল পার্স করুন
					const videoIdMatch = searchRes.data.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
					if (videoIdMatch) {
						videoUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
						videoInfo = { title: query };
					}
				} catch (e) {
					// যদি সার্চ ব্যর্থ হয়, ডিরেক্ট ভিডিও URL হিসেবে চেষ্টা করুন
					videoUrl = `https://www.youtube.com/watch?v=${query}`;
				}
			}

			if (!videoUrl) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(getLang("noResult"));
			}

			// ডাউনলোড লিঙ্ক পান
			const downloadMsg = await message.reply(`
╔════════════════════════════════════╗
║    🎬 AKASH VIDEO DOWNLOADER 🎬    ║
╚════════════════════════════════════╝

👤 ব্যবহারকারী: ${userName}
📥 অবস্থা: ডাউনলোড করছি...
⏳ অনুগ্রহ করে অপেক্ষা করুন

╔════════════════════════════════════╗
`);

			try {
				// y2mate API ব্যবহার করুন (সবচেয়ে স্থিতিশীল)
				const infoRes = await axios.post(`https://www.y2mate.com/mates/en68/fetch`, {
					url: videoUrl,
					lang: 'en'
				}, {
					headers: {
						'User-Agent': 'Mozilla/5.0',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					timeout: 15000
				});

				if (infoRes.data && infoRes.data.status === 'ok') {
					videoInfo = {
						title: infoRes.data.title || "YouTube Video",
						duration: infoRes.data.duration || "Unknown",
						quality: "720p"
					};

					// ডাউনলোড লিঙ্ক খুঁজুন
					const formats = infoRes.data.links?.mp4;
					if (formats) {
						downloadLink = Object.values(formats)[0]?.url;
					}
				}
			} catch (e) {
				console.log("y2mate API ব্যর্থ, বিকল্প ব্যবহার করছি...");
			}

			// যদি এখনও ডাউনলোড লিঙ্ক না পাওয়া যায়, সরাসরি ভিডিও আইডি ব্যবহার করুন
			if (!downloadLink) {
				const videoIdMatch = videoUrl.match(/v=([a-zA-Z0-9_-]{11})/);
				if (videoIdMatch) {
					downloadLink = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
				}
			}

			if (!downloadLink) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(getLang("noResult"));
			}

			// ভিডিও ডাউনলোড করুন
			const videoID = Math.random().toString(36).substring(7);
			const filePath = path.join(cacheDir, `video_${videoID}.mp4`);

			const videoBuffer = await downloadFromDirect(downloadLink);

			if (!videoBuffer) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply("❌ ভিডিও ডাউনলোড ব্যর্থ হয়েছে।");
			}

			fs.writeFileSync(filePath, Buffer.from(videoBuffer));

			const fileSize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);

			// সফল ডাউনলোডের জন্য সুন্দর ডিজাইন
			const successMessage = `
╔════════════════════════════════════╗
║    ✅ AKASH VIDEO DOWNLOADER ✅    ║
╚════════════════════════════════════╝

👤 ব্যবহারকারী: ${userName}
🎬 শিরোনাম: ${videoInfo.title || query}
⏱️ সময়কাল: ${videoInfo.duration || "Unknown"}
📊 গুণমান: ${videoInfo.quality || "720p"}
💾 ফাইল সাইজ: ${fileSize} MB

✨ ভিডিও সফলভাবে ডাউনলোড হয়েছে!

╔════════════════════════════════════╗
             🚀 সরবরাহ করা হচ্ছে...
╚════════════════════════════════════╝
`;

			return message.reply({
				body: successMessage,
				attachment: fs.createReadStream(filePath)
			}, () => {
				api.setMessageReaction("✅", event.messageID, () => {}, true);
				setTimeout(() => {
					try {
						if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
					} catch (e) {
						console.log("Cache ফাইল পরিষ্কার করতে ব্যর্থ");
					}
				}, 3000);
			});

		} catch (err) {
			console.error("ভিডিও ডাউনলোড ত্রুটি:", err.message);
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			
			const errorMessage = `
╔════════════════════════════════════╗
║    ❌ AKASH VIDEO DOWNLOADER ❌    ║
╚════════════════════════════════════╝

⚠️ দুঃখিত, ত্রুটি ঘটেছে:
${err.message || "অজানা ত্রুটি"}

💡 পরামর্শ:
• লিঙ্কটি সঠিক কিনা চেক করুন
• কিছুক্ষণ পর আবার চেষ্টা করুন
• ভিডিও ব্যক্তিগত হতে পারে

╔════════════════════════════════════╝
`;
			
			return message.reply(errorMessage);
		}
	}
};
