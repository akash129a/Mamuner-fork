const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		alias: ["operator"],
		version: "2.2",
		author: "〲AKASHツ࿐ T.T　o.O",
		countDown: 5,
		role: 0,
		shortDescription: { en: "Operator system" },
		longDescription: { en: "Add/remove operator (only owner), list operator (everyone)" },
		category: "box chat",
		guide: {
			en: '   {pn} add <uid/@tag/reply>\n   {pn} remove <uid/@tag/reply>\n   {pn} list'
		}
	},

	langs: {
		en: {
			added: "✅ | Added operator for %1 users:\n%2",
			alreadyAdmin: "\n⚠ | %1 users already operator:\n%2",
			missingIdAdd: "⚠ | Please enter ID, tag, or reply to a message to add operator.",
			removed: "✅ | Removed operator of %1 users:\n%2",
			notAdmin: "⚠ | %1 users are not operator:\n%2",
			missingIdRemove: "⚠ | Please enter ID, tag, or reply to a message to remove operator.",
			listAdmin: "👑 | Operator list:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {

		const senderID = event.senderID;

		// ✅ Owners (যারা add/remove করতে পারবে)
		const OWNER = [
		      "61589020949344"
		];

		// ✅ Check: sender owner কিনা
		const isOwner = OWNER.includes(senderID);

		switch (args[0]) {

			case "add":
			case "-a": {
				if (!isOwner)
					return message.reply("❌ ᴏɴʟʏ ᴍᴀɪɴ ᴀᴅᴍɪɴ ᴀᴅᴅ  ᴏᴘᴇʀᴀᴛᴏʀ.");

				let uids = [];
				if (event.type === "message_reply") {
					uids.push(event.messageReply.senderID);
				} else if (Object.keys(event.mentions).length > 0) {
					uids = Object.keys(event.mentions);
				} else if (args.slice(1).length > 0) {
					uids = args.slice(1).filter(arg => !isNaN(arg));
				}

				if (uids.length === 0)
					return message.reply(getLang("missingIdAdd"));

				const notAdminIds = [];
				const adminIds = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						adminIds.push(uid);
					else
						notAdminIds.push(uid);
				}

				config.adminBot.push(...notAdminIds);

				const getNames = await Promise.all(
					uids.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(
					(notAdminIds.length > 0 ? getLang(
						"added",
						notAdminIds.length,
						getNames.filter(n => notAdminIds.includes(n.uid)).map(i => `• ${i.name} (${i.uid})`).join("\n")
					) : "")
					+
					(adminIds.length > 0 ? getLang(
						"alreadyAdmin",
						adminIds.length,
						adminIds.map(uid => `• ${uid}`).join("\n")
					) : "")
				);
			}

			case "remove":
			case "-r": {
				if (!isOwner)
					return message.reply("❌ ᴏɴʟʏ ᴍᴀɪɴ ᴀᴅᴍɪɴ ʀᴇᴍᴏᴠᴇ ᴏᴘᴇʀᴀᴛᴏʀ.");

				let uids = [];

				if (event.type === "message_reply") {
					uids.push(event.messageReply.senderID);
				} else if (Object.keys(event.mentions).length > 0) {
					uids = Object.keys(event.mentions);
				} else if (args.slice(1).length > 0) {
					uids = args.slice(1).filter(arg => !isNaN(arg));
				}

				if (uids.length === 0)
					return message.reply(getLang("missingIdRemove"));

				const notAdminIds = [];
				const adminIds = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						adminIds.push(uid);
					else
						notAdminIds.push(uid);
				}

				for (const uid of adminIds)
					config.adminBot.splice(config.adminBot.indexOf(uid), 1);

				const getNames = await Promise.all(
					adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(
					(adminIds.length > 0 ? getLang(
						"removed",
						adminIds.length,
						getNames.map(i => `• ${i.name} (${i.uid})`).join("\n")
					) : "")
					+
					(notAdminIds.length > 0 ? getLang(
						"notAdmin",
						notAdminIds.length,
						notAdminIds.map(uid => `• ${uid}`).join("\n")
					) : "")
				);
			}

			case "list":
			case "-l": {
				const getNames = await Promise.all(
					config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				// 🎨 নতুন ডিজাইন - অনেক সুন্দর এবং পেশাদার
				const adminListDisplay = `
╔════════════════════════════════════════╗
║         👑 ADMIN & OPERATOR LIST 👑    ║
╚════════════════════════════════════════╝

┌─ 🔐 MAIN OWNER
│
├─ Name: 𝗔𝗞𝗔𝗦𝗛 𝗖𝗛𝗢𝗪𝗗𝗛𝗨𝗥𝗬
├─ UID: ${OWNER.join(", ")}
├─ Status: ⭐ OWNER ⭐
└─ Role: FULL ACCESS

${getNames.length > 0 ? `┌─ ⚙️  OPERATORS (${getNames.length})` : "┌─ ⚙️  OPERATORS"}
│
${getNames.length > 0 
	? getNames.map((user, index) => {
		const isLast = index === getNames.length - 1;
		const prefix = isLast ? "└─" : "├─";
		const connector = isLast ? "  " : "│ ";
		return `${prefix} 👤 ${user.name}\n${connector}   UID: ${user.uid}`;
	}).join("\n│ \n")
	: `└─ 📭 No Operators Found`}

╔════════════════════════════════════════╗
║  Total Admins: ${getNames.length + 1}
╚════════════════════════════════════════╝`;

				return message.reply(adminListDisplay);
			}

			default:
				return message.SyntaxError();
		}
	}
};
