const axios = require("axios");

module.exports = {
	config: {
		name: "video",
		aliases: ["ভিডিও", "yt", "search"],
		version: "1.0",
		author: "AKASH",
		countDown: 2,
		role: 0,
		description: {
			bn: "YouTube ভিডিও খুঁজুন",
			en: "Search YouTube videos",
			vi: "Tìm kiếm video YouTube"
		},
		category: "media",
		guide: {
			bn: '   {pn} <ভিডিও নাম>',
			en: '   {pn} <video name>',
			vi: '   {pn} <tên video>'
		}
	},

	onStart: async function ({ api, event, args, message, usersData }) {

		if (!args[0]) return message.reply("❌ ভিডিও নাম দিন!");

		try {
			api.setMessageReaction("🔍", event.messageID, () => {}, true);

			const searchQuery = args.join(" ");
			const userName = await usersData.getName(event.senderID);

			// সার্চ করুন
			try {
				const searchRes = await axios.get(`https://www.youtube.com/results`, {
					params: { search_query: searchQuery },
					timeout: 10000
				});

				// ভিডিও খুঁজুন
				const videoMatches = searchRes.data.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/g);
				const titleMatches = searchRes.data.match(/"title":\{"simpleText":"([^"]+)"/g);

				if (!videoMatches || videoMatches.length === 0) {
					api.setMessageReaction("❌", event.messageID, () => {}, true);
					return message.reply("❌ কোনো ভিডিও পাওয়া যায়নি");
				}

				// প্রথম 5টি রেজাল্ট দেখান
				const results = [];
				const limit = Math.min(5, videoMatches.length);

				for (let i = 0; i < limit; i++) {
					const videoId = videoMatches[i].replace("/watch?v=", "");
					const title = titleMatches && titleMatches[i] 
						? titleMatches[i].replace(/^"title":\{"simpleText":"/, "").replace(/"$/, "")
						: `Video ${i + 1}`;

					results.push({
						num: i + 1,
						title: title.substring(0, 50),
						id: videoId,
						url: `https://www.youtube.com/watch?v=${videoId}`
					});
				}

				// সার্চ রেজাল্ট দেখান
				let resultText = `🔍 সার্চ: "${searchQuery}"\n\n`;
				results.forEach(r => {
					resultText += `${r.num}. ${r.title}\n📺 https://youtu.be/${r.id}\n\n`;
				});

				api.setMessageReaction("✅", event.messageID, () => {}, true);
				return message.reply(resultText);

			} catch (e) {
				console.log("YouTube সার্চ ব্যর্থ");
				
				// বিকল্প API
				try {
					const altRes = await axios.get(`https://www.youtube.com/feeds/videos.xml`, {
						params: { q: searchQuery },
						timeout: 8000
					});

					const videoIds = altRes.data.match(/yt:videoId>([a-zA-Z0-9_-]{11})</g);
					
					if (videoIds && videoIds.length > 0) {
						let resultText = `🔍 সার্চ: "${searchQuery}"\n\n`;
						
						const limit = Math.min(5, videoIds.length);
						for (let i = 0; i < limit; i++) {
							const videoId = videoIds[i].replace(/yt:videoId>|</g, "");
							resultText += `${i + 1}. Video ${i + 1}\n📺 https://youtu.be/${videoId}\n\n`;
						}

						api.setMessageReaction("✅", event.messageID, () => {}, true);
						return message.reply(resultText);
					}
				} catch (e2) {
					console.log("বিকল্প API ও ব্যর্থ");
				}

				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return message.reply("❌ সার্চ ব্যর্থ, পরে চেষ্টা করুন");
			}

		} catch (err) {
			console.error("ত্রুটি:", err.message);
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return message.reply("❌ ত্রুটি ঘটেছে");
		}
	}
};
