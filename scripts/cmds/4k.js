const axios = require("axios");

const mahmud = async () => {
	const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
	return base.data.mahmud;
};

module.exports = {
	config: {
		name: "4k",
		aliases: ["hd", "upscale"],
		version: "2.0",
		author: "MahMUD",
		countDown: 15,
		role: 0,
		description: {
			bn: "AI এর মাধ্যমে ছবির কোয়ালিটি 4K বা HD করুন (স্কেল অপশনসহ)",
			en: "Enhance or restore image quality to 4K using AI (with scale options)",
			vi: "Nâng cao chất lượng hình ảnh lên 4K bằng AI (có tùy chọn tỷ lệ)"
		},
		category: "tools",
		guide: {
			bn: '   {pn} [url] [scale]: ছবির লিংক দিয়ে HD করুন\n   অথবা ছবির রিপ্লাইয়ে {pn} [scale] লিখুন\n   scale: 2, 4 (default), 8 — উদাহরণ: {pn} 4',
			en: '   {pn} [url] [scale]: Upscale image via URL\n   Or reply to an image with {pn} [scale]\n   scale: 2, 4 (default), 8 — e.g. {pn} 4',
			vi: '   {pn} [url] [scale]: Nâng cấp ảnh qua URL\n   Hoặc phản hồi ảnh bằng {pn} [scale]\n   scale: 2, 4 (mặc định), 8'
		}
	},

	langs: {
		bn: {
			noImage: "• বেবি, একটি ছবিতে রিপ্লাই দাও অথবা ছবির লিংক দাও! 😘",
			wait: "𝐄𝐧𝐡𝐚𝐧𝐜𝐢𝐧𝐠 𝐭𝐨 %1𝐱 𝐪𝐮𝐚𝐥𝐢𝐭𝐲...𝐰𝐚𝐢𝐭 𝐛𝐚𝐛𝐲 😘",
			success: "✅ | 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 %1𝐱 𝐞𝐧𝐡𝐚𝐧𝐜𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
			invalidScale: "× স্কেল ভ্যালু ভুল! শুধু 2, 4, বা 8 ব্যবহার করো।",
			tooLarge: "× ছবিটা অনেক বড় (সর্বোচ্চ 15MB সাপোর্টেড)।",
			timeout: "× সময় শেষ হয়ে গেছে, আবার চেষ্টা করো।",
			error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
		},
		en: {
			noImage: "• Baby, please reply to an image or provide a link! 😘",
			wait: "𝐄𝐧𝐡𝐚𝐧𝐜𝐢𝐧𝐠 𝐭𝐨 %1𝐱 𝐪𝐮𝐚𝐥𝐢𝐭𝐲...𝐰𝐚𝐢𝐭 𝐛𝐚𝐛𝐲 😘",
			success: "✅ | 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 %1𝐱 𝐞𝐧𝐡𝐚𝐧𝐜𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
			invalidScale: "× Invalid scale! Use 2, 4, or 8 only.",
			tooLarge: "× Image is too large (max 15MB supported).",
			timeout: "× Request timed out, please try again.",
			error: "× API error: %1. Contact MahMUD for help."
		},
		vi: {
			noImage: "• Cưng ơi, hãy phản hồi một bức ảnh hoặc gửi link! 😘",
			wait: "𝐄𝐧𝐡𝐚𝐧𝐜𝐢𝐧𝐠 𝐭𝐨 %1𝐱 𝐪𝐮𝐚𝐥𝐢𝐭𝐲...𝐰𝐚𝐢𝐭 𝐛𝐚𝐛𝐲 😘",
			success: "✅ | 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 %1𝐱 𝐞𝐧𝐡𝐚𝐧𝐜𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
			invalidScale: "× Tỷ lệ không hợp lệ! Chỉ dùng 2, 4, hoặc 8.",
			tooLarge: "× Ảnh quá lớn (tối đa 15MB).",
			timeout: "× Hết thời gian chờ, hãy thử lại.",
			error: "× Lỗi: %1. Liên hệ MahMUD để được hỗ trợ."
		}
	},

	onStart: async function ({ api, message, args, event, getLang }) {
		let imgUrl;
		let scale = 4;

		// Detect image source: reply attachment or URL arg
		if (event.messageReply?.attachments?.[0]?.type === "photo") {
			imgUrl = event.messageReply.attachments[0].url;
			if (args[0] && [2, 4, 8].includes(Number(args[0]))) scale = Number(args[0]);
		} else if (args[0]) {
			// last arg might be the scale number
			const maybeScale = Number(args[args.length - 1]);
			if ([2, 4, 8].includes(maybeScale) && args.length > 1) {
				scale = maybeScale;
				imgUrl = args.slice(0, -1).join(" ");
			} else {
				imgUrl = args.join(" ");
			}
		}

		if (!imgUrl) return api.sendMessage(getLang("noImage"), event.threadID, event.messageID);

		if (![2, 4, 8].includes(scale)) {
			return api.sendMessage(getLang("invalidScale"), event.threadID, event.messageID);
		}

		// Optional: check remote file size before processing
		try {
			const head = await axios.head(imgUrl, { timeout: 8000 }).catch(() => null);
			const size = Number(head?.headers?.["content-length"] || 0);
			if (size > 15 * 1024 * 1024) {
				return api.sendMessage(getLang("tooLarge"), event.threadID, event.messageID);
			}
		} catch (e) {
			// non-fatal, continue even if HEAD check fails
		}

		const waitMsg = await api.sendMessage(getLang("wait", scale), event.threadID, event.messageID);
		api.setMessageReaction("😘", event.messageID, () => {}, true);

		const attemptUpscale = async (attempt = 1) => {
			try {
				const baseUrl = await mahmud();
				const apiUrl = `${baseUrl}/api/hd/mahmud?imgUrl=${encodeURIComponent(imgUrl)}&scale=${scale}`;

				const res = await axios.get(apiUrl, {
					responseType: "stream",
					timeout: 60000
				});

				if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
				api.setMessageReaction("🪽", event.messageID, () => {}, true);

				return api.sendMessage({
					body: getLang("success", scale),
					attachment: res.data
				}, event.threadID, event.messageID);

			} catch (err) {
				if (attempt < 2 && err.code !== "ECONNABORTED") {
					// one retry on transient failure
					return attemptUpscale(attempt + 1);
				}

				console.error("Error in 4k command:", err);
				if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
				api.setMessageReaction("❌", event.messageID, () => {}, true);

				const msg = err.code === "ECONNABORTED" ? getLang("timeout") : getLang("error", err.message);
				return api.sendMessage(msg, event.threadID, event.messageID);
			}
		};

		return attemptUpscale();
	}
};
