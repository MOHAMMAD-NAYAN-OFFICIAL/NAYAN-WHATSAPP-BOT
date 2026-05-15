let antiStatusGroups = [];

module.exports = {
  config: {
    name: 'antistatus',
    aliases: ['astatus'],
    permission: 2,
    prefix: true,
    categorie: 'Moderation',
    credit: 'Custom Plugin',
    usages: ['.antistatus on', '.antistatus off'],
    description: 'Deletes status mentions automatically.',
  },

  start: async ({ event, api, args }) => {
    const { threadId, isSenderAdmin } = event;
    if (!isSenderAdmin) return api.sendMessage(threadId, { text: 'Admins only!' });

    const subCommand = args[0]?.toLowerCase();
    if (subCommand === 'on') {
      if (!antiStatusGroups.includes(threadId)) antiStatusGroups.push(threadId);
      await api.sendMessage(threadId, { text: '✅ AntiStatus is now ACTIVE.' });
    } else if (subCommand === 'off') {
      antiStatusGroups = antiStatusGroups.filter(g => g !== threadId);
      await api.sendMessage(threadId, { text: '❌ AntiStatus is now DISABLED.' });
    } else {
      await api.sendMessage(threadId, { text: 'Use: .antistatus on/off' });
    }
  },

  event: async ({ event, api }) => {
    const { threadId, message } = event;
    if (!antiStatusGroups.includes(threadId)) return;

    // স্ট্যাটাস মেনশন ধরার জন্য অ্যাডভান্সড কন্ডিশন
    const contextInfo = message?.extendedTextMessage?.contextInfo || message?.contextInfo;
    const isStatus = contextInfo?.remoteJid === "status@broadcast" || 
                     contextInfo?.participant === "status@broadcast" ||
                     message?.statusMentionMessage; // কিছু বটের ক্ষেত্রে এটি আলাদা থাকে

    if (isStatus) {
      try {
        const messageId = event.message.key.id;
        const participant = event.message.key.participant || event.senderId;

        // মেসেজ ডিলিট করার কমান্ড
        await api.sendMessage(threadId, {
          delete: { 
            remoteJid: threadId, 
            fromMe: false, 
            id: messageId, 
            participant: participant 
          },
        });
        
        // ডিলিট করার পর একটি সতর্কবার্তা (ঐচ্ছিক, চাইলে এই লাইনটি মুছে দিতে পারেন)
        await api.sendMessage(threadId, { text: "🚫 স্ট্যাটাস মেনশন দেওয়া নিষেধ!" });

      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  },
};
