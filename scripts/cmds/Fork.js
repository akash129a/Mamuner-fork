module.exports = {
  config: {
    name: "fork",
    version: "1.4",
    author: "〲AKASHツ࿐ T.T　o.O",
    countDown: 2,
    role: 2,
    shortDescription: "Show official fork link (Admin only)",
    category: "utils",
    guide: {
      en: "Type 'fork' to see the link. Only for Admin."
    }
  },

  langs: {
    en: {
      current: "OFFICIAL GITHUB FORK \n\n  🔗 Link: %1\n\n╰───────『 ✨ 』───────╯",
      restricted: "❌ Fork শুধু আমার বস এডমিনের জন্য।"
    }
  },

  onStart: async function ({ message, getLang, event, role }) {
    const link = "https://github.com/AKASH-GOAT-BOT/V2-.git";
    if (role < 2) {
      return message.reply(getLang("restricted"));
    }
    return message.reply(getLang("current", link));
  },

  onChat: async function ({ message, getLang, event, role }) {
    if (event.body && event.body.toLowerCase() === "fork") {
      const link = "https://github.com/AKASH-GOAT-BOT/V2-.git";
      if (role < 2) {
        return message.reply(getLang("restricted"));
      }
      return message.reply(getLang("current", link));
    }
  }
};
