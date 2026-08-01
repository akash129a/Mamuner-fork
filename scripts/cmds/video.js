const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "video",
		aliases: ["ভিডিও", "yt", "ytdl", "download"],
		version: "6.0",
		author: "AKASH",
		countDown: 2,
		role: 0,
		description: {
			bn: "YouTube ভিডিও ডাউনলোড",
			en: "Download YouTube videos",
			vi: "Tải video YouTube"
		},
		category: "media",
		guide: {
			bn: '   {pn} <লিঙ্ক>',
			en: '   {pn} <link>',
			vi: '   {pn} <liên kết>'
		}
	},

	onStart: async function ({ api, event, args, message, usersData }) {

		if (!args[0]) return message.reply("❌ লিঙ্ক দিন!");

		try {
			api.setMessageReaction("⏳", event.messageID, () => {}, true);

			const query = args.join(" ");
			const userName = await usersData.getName(event.senderID);

			const cacheDir = path.join(__dirname, "cache");
			if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

			// YouTube Link শুদ্ধ করুন
			let videoUrl = query;
			if (!videoUrl.startsWith("http")) {
				videoUrl = `https://www.youtube.com/watch?v=${query}`;
			}

			// প্রসেসিং মেসেজ
			await message.reply(` ╔═══════════════════════════════════════╗
 ║                                       ║
 ║     🎬 AKASH VIDEO DOWNLOADER 🎬     ║
 ║                                       ║
 ║             ⏳ Processing...          ║
 ║                                       ║
 ╚═══════════════════════════════════════╝`);

			let downloadUrl = null;
			let retryCount = 0;
			const maxRetries = 3;

			// মাল্টিপল API ট্রাই করুন
			const apis = [
				{
					name: "API-1",
					url: (vid) => `https://www.y2mate.com/mates/en68/fetch`,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					method: "POST",
					data: (vid) => `url=${vid}&lang=en`,
					extract: (res) => {
						if (res.data && res.data.status === 'ok' && res.data.links) {
							const mp4 = res.data.links.mp4;
							if (mp4) {
								const lastKey = Object.keys(mp4).pop();
								return mp4[lastKey]?.url;
							}
						}
						return null;
					}
				},
				{
					name: "API-2",
					url: (vid) => `https://api.cobalt.tools/api/json?url=${encodeURIComponent(vid)}`,
					method: "GET",
					extract: (res) => res.data?.url || null
				},
				{
					name: "API-3",
					url: (vid) => `https://api.yt-dlp.workers.dev/download/${vid}`,
					method: "GET",
					extract: (res) => res.data?.url || res.config?.url || null
				}
			];

			for (const apiConfig of apis) {
				try {
					let response;
					
					if (apiConfig.method === "POST") {
						response = await axios.post(
							apiConfig.url(videoUrl),
							apiConfig.data(videoUrl),
							{
								headers: apiConfig.headers,
								timeout: 15000
							}
						);
					} else {
						response = await axios.get(
							apiConfig.url(videoUrl),
							{
								headers: { 'User-Agent': 'Mozilla/5.0' },
								timeout: 15000
							}
						);
					}

					const url = apiConfig.extract(response);
					if (url) {
						downloadUrl = url;
						console.log(`✅ ${apiConfig.name} সফল!`);
						break;
					}
				} catch (e) {
					console.log(`❌ ${apiConfig.name} ব্যর্থ: ${e.message}`);
					continue;
				}
			}

			if (!downloadUrl) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(` ╔═══════════════════════════════════════╗
 ║                                       ║
 ║     🎬 AKASH VIDEO DOWNLOADER 🎬     ║
 ║                                       ║
 ║              ❌ Failed                ║
 ║                                       ║
 ╚═══════════════════════════════════════╝`);
			}

			// ভিডিও ডাউনলোড করুন
			const videoID = Math.random().toString(36).substring(7);
			const filePath = path.join(cacheDir, `video_${videoID}.mp4`);

			try {
				console.log("ডাউনলোড শুরু:", downloadUrl.substring(0, 50));

				const downloadRes = await axios.get(downloadUrl, {
					responseType: "arraybuffer",
					timeout: 120000,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
						'Referer': 'https://www.youtube.com/',
						'Accept': 'video/mp4'
					},
					maxRedirects: 10,
					maxContentLength: 500 * 1024 * 1024 // 500MB
				});

				const videoBuffer = downloadRes.data;
				
				if (!videoBuffer || videoBuffer.length < 1024) {
					throw new Error("খালি বাফার");
				}

				fs.writeFileSync(filePath, Buffer.from(videoBuffer));

				const fileSize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
				console.log(`✅ ডাউনলোড সম্পন্ন: ${fileSize} MB`);

				// সফল মেসেজ
				return message.reply({
					body: ` ╔═══════════════════════════════════════╗
 ║                                       ║
 ║     🎬 AKASH VIDEO DOWNLOADER 🎬     ║
 ║                                       ║
 ║              ✅ Success               ║
 ║                                       ║
 ║          Size: ${fileSize} MB           
 ║                                       ║
 ╚═══════════════════════════════════════╝`,
					attachment: fs.createReadStream(filePath)
				}, () => {
					api.setMessageReaction("✅", event.messageID, () => {}, true);
					setTimeout(() => {
						try {
							if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
						} catch (e) {}
					}, 5000);
				});

			} catch (downloadErr) {
				console.error("ডাউনলোড ত্রুটি:", downloadErr.message);
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply(` ╔═══════════════════════════════════════╗
 ║                                       ║
 ║     🎬 AKASH VIDEO DOWNLOADER 🎬     ║
 ║                                       ║
 ║              ❌ Failed                ║
 ║                                       ║
 ╚═══════════════════════════════════════╝`);
			}

		} catch (err) {
			console.error("প্রধান ত্রুটি:", err.message);
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return message.reply(` ╔═══════════════════════════════════════╗
 ║                                       ║
 ║     🎬 AKASH VIDEO DOWNLOADER 🎬     ║
 ║                                       ║
 ║              ❌ Failed                ║
 ║                                       ║
 ╚═══════════════════════════════════════╝`);
		}
	}
};
