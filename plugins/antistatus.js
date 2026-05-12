let antiStatusGroups = [];

module.exports = {
  config: {
    name: 'antistatus',
    aliases: ['astatus'],
    permission: 2,
    prefix: true,
    categorie: 'Moderation',
    credit: 'Custom Plugin',
    usages: [
      'antistatus on - Enable status mention blocking.',
      'antistatus off - Disable status mention blocking.',
    ],
    description: 'Deletes messages that mention a WhatsApp status to prevent spam.',
  },

  start: async ({ event, api, args }) => {
    const { threadId, isSenderAdmin } = event;

    if (!isSenderAdmin) {
      await api.sendMessage(threadId, { text: 'Only admins can use the antistatus command.' });
      return;
    }

    const subCommand = args[0]?.toLowerCase();

    if (subCommand === 'on') {
      if (!antiStatusGroups.includes(threadId)) {
        antiStatusGroups.push(threadId);
      }
      await api.sendMessage(threadId, { text: '✅ AntiStatus protection is now ON.' });
    } else if (subCommand === 'off') {
      antiStatusGroups = antiStatusGroups.filter(g => g !== threadId);
      await api.sendMessage(threadId, { text: '❌ AntiStatus protection is now OFF.' });
    } else {
      await api.sendMessage(threadId, { text: 'Usage: .antistatus on/off' });
    }
  },

  event: async ({ event, api }) => {
    const { threadId, message } = event;

    // Check if AntiStatus is enabled for this group
    if (!antiStatusGroups.includes(threadId)) return;

    // Detect if the message is a status mention/broadcast
    const isStatus = message?.extendedTextMessage?.contextInfo?.remoteJid === "status@broadcast";

    if (isStatus) {
      try {
        const messageId = message.key.id;
        const participant = message.key.participant || event.senderId;

        // Delete the status mention
        await api.sendMessage(threadId, {
          delete: { 
            remoteJid: threadId, 
            fromMe: false, 
            id: messageId, 
            participant: participant 
          },
        });

        // Send warning
        await api.sendMessage(threadId, {
          text: '❌ Status mention allowed na!',
        });
      } catch (error) {
        console.error('Failed to delete status mention:', error);
      }
    }
  },
};
