let antiStatusGroups = [];

module.exports = {
  config: {
    name: "antistatus",
    aliases: ["astatus"],
    permission: 2,
    prefix: true,
    categorie: "Moderation",
    credit: "Fahim Bot",
    usages: ["/antistatus on", "/antistatus off"],
    description: "Delete status mentions automatically",
  },

  start: async ({ event, api, args }) => {
    const threadId = event.threadId;
    const sub = args[0]?.toLowerCase();

    if (sub === "on") {
      if (antiStatusGroups.includes(threadId)) {
        return api.sendMessage(threadId, { text: "⚠️ AntiStatus already ON" });
      }
      antiStatusGroups.push(threadId);
      return api.sendMessage(threadId, { text: "✅ AntiStatus ON" });
    }

    if (sub === "off") {
      if (!antiStatusGroups.includes(threadId)) {
        return api.sendMessage(threadId, { text: "⚠️ AntiStatus already OFF" });
      }
      antiStatusGroups = antiStatusGroups.filter(g => g !== threadId);
      return api.sendMessage(threadId, { text: "❌ AntiStatus OFF" });
    }

    return api.sendMessage(threadId, { text: `Use:\n/antistatus on\n/antistatus off` });
  },

  event: async ({ event, api }) => {
    try {
      const threadId = event.threadId;
      if (!antiStatusGroups.includes(threadId)) return;

      // স্ট্যাটাস মেনশন ধরার জন্য ডাটা চেক
      const eventString = JSON.stringify(event);
      const isStatus = eventString.includes("status@broadcast");

      if (isStatus) {
        // মেসেজ আইডি এবং পার্টিসিপেন্ট আইডি ঠিকভাবে খুঁজে বের করা
        const msgKey = event.key || event.message?.key;
        const sender = event.senderID || event.senderId || msgKey?.participant;

        if (msgKey && msgKey.id) {
          await api.sendMessage(threadId, {
            delete: {
              remoteJid: threadId,
              fromMe: false,
              id: msgKey.id,
              participant: msgKey.participant || sender
            }
          });

          await api.sendMessage(threadId, {
            text: `❌ @${sender.split("@")[0]} 🚫 স্ট্যাটাস মেনশন দেওয়া নিষেধ!Next time Kick`,
            mentions: [sender]
          });
        }
      }
    } catch (e) {
      console.log("AntiStatus Event Error:", e);
    }
  },
};
