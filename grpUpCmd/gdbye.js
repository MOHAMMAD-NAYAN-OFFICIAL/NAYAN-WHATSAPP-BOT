module.exports = {
  event: 'remove',
  handle: async ({ api, event }) => {
    const removedMembers = event.participants;

    for (const member of removedMembers) {
      let profilePicUrl;
      try {
        // মেম্বার লিভ নিলে বা কিক খেলে তার প্রোফাইল পিকচার ইউআরএল নেওয়া
        profilePicUrl = await api.profilePictureUrl(member, 'image');
      } catch (error) {
        profilePicUrl = null;
      }

      const username = `@${member.split('@')[0]}`;
      
      // 💔 CUTE & PREMIUM FONT STYLE GOODBYE MESSAGE 💔
      const goodbyeMessage = `╭━━━༻ ✦ 💫 ✦ ༺━━━╮
   𝖦𝖮𝖮𝖣𝖡𝖸𝖤  𝖡𝖴𝖣𝖣𝖸
╰━━━༻ ✦ 💫 ✦ ༺━━━╯
  💔 𝖮𝖍 𝖭𝗈! ${username} 𝗅𝖾𝖿𝗍 𝗎𝗌...

  🕊️ 𝖦𝗈𝗈𝖽𝖻𝗒𝖾! 𝖶𝖾 𝗐𝗂𝗅𝗅 🇲𝗂𝗌𝗌 𝗒𝗈𝗎.
  ✨ 𝖳𝖺kee 𝖼𝖺𝗋𝖾 & 𝖦𝗈𝗈𝖽 𝗅𝗎𝖼𝗄!
 
╭─────────────────╮
   𝖲𝖾𝖾 𝗒𝗈𝗎 𝖺𝗀𝖺𝗂𝗇 𝗌𝗈𝗈𝗇 👋🌸
╰─────────────────╯`;

      if (profilePicUrl) {
        // প্রোফাইল পিকচার থাকলে ছবিসহ ক্যাপশনে মেসেজ যাবে
        await api.sendMessage(event.id, {
          image: { url: profilePicUrl },
          caption: goodbyeMessage,
          mentions: [member]
        });
      } else {
        // প্রোফাইল পিকচার না থাকলে শুধু টেক্সট মেসেজ যাবে
        await api.sendMessage(event.id, {
          text: goodbyeMessage,
          mentions: [member]
        });
      }
    }
  }
};
