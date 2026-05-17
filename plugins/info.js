const os = require('os');

module.exports = {
  config: {
    name: 'info',
    aliases: ['about', 'admininfo', 'serverinfo'],
    permission: 0,
    prefix: 'both',
    categorie: 'Utilities',
    credit: 'Developed by Mohammad Nayan',
    usages: [`${global.config.PREFIX}info - Show admin and server information.`],
  },
  start: async ({ event, api, message }) => {
    try {
      const uptimeSeconds = process.uptime();
      const uptime = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);

      const adminListText =
        global.config.admin.length > 0
          ? global.config.admin
              .map((id, i) => `${i + 1}. @${id.split('@')[0]}`)
              .join('\n')
          : 'No admins found.';

      const infoMessage = `
---------------------------------------

╭═══𝄟 👑 𝄟═══╮
    𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟 𝗜𝗡𝗙𝗢
╰═══𝄟 👑 𝄟═══╯
│ 👤 𝐍𝐚𝐦𝐞       ✦ ꜰᴀʜɪᴍ ʙʙᴢ
│ 📍𝐀𝐝𝐝𝐫𝐞𝐬𝐬     ✦ ꜱʏʟʜᴇᴛ
│ 🎂 𝐀𝐠𝐞           ✦ 𝟏𝟕+
│ 💼 𝐖𝐨𝐫𝐤        ✦ ꜱᴛᴜᴅᴇɴᴛ
│ 🌙 𝖱𝖾𝗅𝗂𝗀𝗂𝗈𝗇    ✦ ɪꜱʟᴀᴍ
│ 💍 𝖱𝖾𝗅𝖺𝗍𝗂𝗈𝗇𝗌𝗁𝗂𝗉 ✦
     🇸‌🇮‌🇳‌🇬‌🇱‌🇪‌
╰═════════════╯
╭══──────══╮
  ✨ 𝐍𝐢𝐜𝐞 𝐓𝐨 𝐌𝐞𝐞𝐭 𝐘𝐨𝐮 ✨
╰══──────══╯
---------------------------------------
\`\`\`
╭══──────══╮
ᴡʜᴀᴛꜱᴀᴩᴩ ᴄʜɴᴇɴʟ ʟɪɴᴋ:https://whatsapp.com/channel/0029Vb82hsMEawdr3Iyda72V
╰══──────══╯
\`\`\``;

      await api.sendMessage(
            event.threadId,
            { image: { url: "https://i.postimg.cc/8kthmz2N/IMG-20260513-WA0029.jpg" }, caption: infoMessage || '' },
            { quoted: event.message }
          );;
    } catch (error) {
      console.error(error);
      await api.sendMessage(event.threadId, '❌ An error occurred while fetching info.', { quoted: event.message });
    }
  },
};
