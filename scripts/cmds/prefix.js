const fs = require("fs-extra");
const moment = require("moment-timezone");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "prefix",
    version: "2.6",
    author: "Akash Chowdhury",
    countDown: 5,
    role: 0,
    description: "Change & show bot prefix",
    category: "config"
  },

  langs: {
    en: {
      usage: "❌ Usage: prefix <newPrefix> | prefix reset | prefix <newPrefix> -g",
      reset: "✅ Prefix reset successful!\n🔰 System prefix: %1",
      onlyAdmin: "⛔ Only bot admin can change global prefix.",
      confirmGlobal: "⚙️ Global prefix change requested.\n👉 React to confirm.",
      confirmThisThread: "🛠️ Group prefix change requested.\n👉 React to confirm.",
      successGlobal: "✅ Global prefix changed!\n🆕 New prefix: %1",
      successThisThread: "✅ Group prefix changed!\n🆕 New prefix: %1"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.reply(getLang("usage"));

    // RESET
    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal && role < 2)
      return message.reply(getLang("onlyAdmin"));

    const confirmMsg = setGlobal
      ? getLang("confirmGlobal")
      : getLang("confirmThisThread");

    message.reply(confirmMsg, (err, info) => {
      if (err) return;

      global.GoatBot.onReaction.set(info.messageID, {
        commandName,
        author: event.senderID,
        newPrefix,
        setGlobal
      });
    });
  },

  onReaction: async function ({ event, message, threadsData, Reaction, getLang }) {
    if (event.userID !== Reaction.author) return;

    global.GoatBot.onReaction.delete(event.messageID);

    if (Reaction.setGlobal) {
      global.GoatBot.config.prefix = Reaction.newPrefix;

      fs.writeFileSync(
        global.client.dirConfig,
        JSON.stringify(global.GoatBot.config, null, 2)
      );

      return message.reply(getLang("successGlobal", Reaction.newPrefix));
    }

    await threadsData.set(
      event.threadID,
      Reaction.newPrefix,
      "data.prefix"
    );

    return message.reply(getLang("successThisThread", Reaction.newPrefix));
  },

  onChat: async function ({ event, message, threadsData }) {
    if (!event.body || event.body.toLowerCase() !== "prefix") return;

    const systemPrefix = global.GoatBot.config.prefix;
    const groupPrefix = global.utils.getPrefix(event.threadID);

    const threadInfo = await threadsData.get(event.threadID);
    const groupName = threadInfo?.threadName || "Unknown Group";

    const time = moment().tz("Asia/Dhaka").format("hh:mm A");
    const date = moment().tz("Asia/Dhaka").format("DD MMM YYYY");

    const owner = global.GoatBot.config.adminName || "Akash Chowdhury";

    // ---- 𝗦𝘁𝘆𝗹𝗶𝘀𝗵 𝗗𝗲𝘀𝗶𝗴𝗻 (Unicode Bold Font) ----
    const designMsg =
`❐──「 𝗣 𝗥 𝗘 𝗙 𝗜 𝗫 」──❐

  ➤ 𝗚𝗿𝗼𝘂𝗽   : ${groupName}
  ➤ 𝗦𝘆𝘀𝘁𝗲𝗺  : 「 ${systemPrefix} 」
  ➤ 𝗚𝗿𝗼𝘂𝗽𝗣  : 「 ${groupPrefix} 」
  ➤ 𝗧𝗶𝗺𝗲    : ${time}
  ➤ 𝗗𝗮𝘁𝗲    : ${date}
  ➤ 𝗢𝘄𝗻𝗲𝗿   : ${owner}

❐──「 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗺𝗲 ⚡ 」──❐`;

    // ---- 𝗙𝗶𝘅𝗲𝗱 𝗔𝗻𝗶𝗺𝗲 𝗘𝘆𝗲 𝗖𝗹𝗶𝗽 ----
    const fixedMediaUrl = "https://i.imgur.com/OKKnNcT.mp4";

    try {
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const mediaPath = path.join(cacheDir, `prefix_${Date.now()}.mp4`);

      const mediaRes = await axios.get(fixedMediaUrl, {
        responseType: "arraybuffer",
        timeout: 10000
      });
      fs.writeFileSync(mediaPath, Buffer.from(mediaRes.data, "binary"));

      await message.reply({
        body: designMsg,
        attachment: fs.createReadStream(mediaPath)
      });

      fs.unlinkSync(mediaPath);
    } catch (err) {
      console.log("[prefix.js] Media download/send error:", err.code || err.message);
      message.reply(designMsg);
    }
  }
};
