module.exports = {
  event: 'add',
  handle: async ({ api, event }) => {
    const newMembers = event.participants;
    const groupInfo = await api.groupMetadata(event.id);
    const groupName = groupInfo.subject;
    const totalMembers = groupInfo.participants.length;

    for (const member of newMembers) {
      let profilePicUrl;
      try {
        profilePicUrl = await api.profilePictureUrl(member, 'image');
      } catch (error) {
        profilePicUrl = null;
      }

      const username = `@${member.split('@')[0]}`;
      
      
      const welcomeMessage = `╭━━━༻ ✦ 🫧 ✦ ༺━━━╮
  𝖶𝖤𝖫𝖢𝖮𝖬𝖤  𝖳𝖮  𝖦𝖱𝖮𝖴𝖯
╰━━━༻ ✦ 🫧 ✦ ༺━━━╯
  🌸 𝐇𝐞𝐥𝐥𝐨 ${username} !

  🌟 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 *${groupName}*
  📊 𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦: ${totalMembers} 
  💞 𝖧𝗈𝗉𝖾 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖺 𝗀𝗈𝗈𝖽 𝗍𝗂𝗆𝖾 𝗁𝖾𝗋𝖾!

  📢 𝖯𝗅𝖾𝖺𝗌𝖾 𝖿𝗈𝗅𝗅𝗈𝗐 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝗋𝗎𝗅𝖾𝗌.
╭─────────────────╮
   𝖤𝗇𝗃𝗈𝗒 𝗒𝗈𝗎𝗋 𝗌𝗍𝖺𝗒 𝖻𝗎𝖽𝖽𝗒 💫
╰─────────────────╯`;

      if (profilePicUrl) {
        await api.sendMessage(event.id, {
          image: { url: profilePicUrl },
          caption: welcomeMessage,
          mentions: [member]
        });
      } else {
        await api.sendMessage(event.id, {
          text: welcomeMessage,
          mentions: [member]
        });
      }
    }
  }
};
