module.exports = {
  config: {
    name: "akash",
    version: "2.0.0",
    author: "Akash Chowdhury",
    role: 0,
    shortDescription: {
      en: "Akash Profile Info"
    },
    category: "Information",
    guide: {
      en: "Type 'akash' to view profile"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const msg = event.body?.toLowerCase()?.trim();

    if (!msg || msg !== "akash") return;

    const profileText =
`╔══════════════════════════╗
       👑 𝐀𝐊𝐀𝐒𝐇 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 👑
╚══════════════════════════╝

╭━━━〔 👤 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋 𝐈𝐍𝐅𝐎 〕━━━╮
┃
┣ 📛 𝐍𝐚𝐦𝐞      : Akash Chowdhury
┣ 😜 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞  : Vondo
┣ 🎂 𝐀𝐠𝐞       : 20 Years
┣ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧  : Islam
┣ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : Inter 2nd Year
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 〕━━━━━━━╮
┃
┣ 🇧🇩 𝐂𝐨𝐮𝐧𝐭𝐫𝐲  : Bangladesh
┣ 🏙️ 𝐃𝐢𝐬𝐭𝐫𝐢𝐜𝐭  : Dhaka
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🖤 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋 𝐋𝐈𝐅𝐄 〕━━━━╮
┃
┣ 💍 𝐒𝐭𝐚𝐭𝐮𝐬    : Single
┣ 🎨 𝐅𝐚𝐯 𝐂𝐨𝐥𝐨𝐫 : Black 🖤
┣ 👥 𝐁𝐞𝐬𝐭 𝐅𝐫𝐧𝐝  : Ase 🙃
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 ───────────⚡ 𝐎𝐖𝐍𝐄𝐑 ⚡───────────`;

    api.sendMessage(profileText, event.threadID, event.messageID);
  }
};
