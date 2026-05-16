const activeIntervals = {};

module.exports = {
  config: {
    name: "namazauto",
    permission: 2,
    prefix: true,
    category: "group",
    credit: "Fahim Bot"
  },

  start: async ({ event, api, args }) => {
    const { threadId, senderId } = event;
    const action = args[0]?.toLowerCase();

    // 🕌 Schedule
    const schedule = [
      { name: "ফজর", start: "04:15", end: "05:00" },
      { name: "যোহর", start: "12:05", end: "13:15" },
      { name: "আসর", start: "16:25", end: "17:10" },
      { name: "মাগরিব", start: "18:20", end: "18:50" },
      { name: "এশা", start: "19:35", end: "20:30" },
      { name: "জুম্মা", start: "13:15", end: "14:00" } 
    ];

    if (action === "on") {
      if (activeIntervals[threadId]) return api.sendMessage(threadId, { text: "⚠️ আগেই চালু করা আছে!" });

      let lastCheckedTime = ""; 
      activeIntervals[threadId] = setInterval(async () => {
        try {
          const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
          const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          const day = now.getDay(); 

          if (lastCheckedTime === currentTimeStr) return;
          lastCheckedTime = currentTimeStr;

          for (const p of schedule) {
            if (p.name === "জুম্মা" && day !== 5) continue;
            if (p.name === "যোহর" && day === 5) continue;

            // 🔒 LOCK
            if (currentTimeStr === p.start) {
              await api.groupSettingUpdate(threadId, "announcement");
              await api.sendMessage(threadId, {
                text: `‎⎯͢⎯⃝"🕌 𝐍𝐀𝐌𝐀𝐙 𝐓𝐈𝐌𝐄 ⎯͢⎯⃝\n\nআসসালামু আলাইকুম! ✨\nএখন *${p.name}* নামাজের সময় হয়েছে। 🕋\n\n🚫 *গ্রুপ সাময়িকভাবে বন্ধ করা হলো।*\n\nসবাই দ্রুত নামাজ আদায় করতে যান। দোয়া করতে ভুলবেন না। নামাজ শেষে ইনশাআল্লাহ গ্রুপ আবার খুলে দেওয়া হবে। 🤲🌸\n\n*𝐆𝐎 𝐅𝐎𝐑 𝐍𝐀𝐌𝐀𝐙!* ✨`
              });
            }

            // 🔓 UNLOCK
            if (currentTimeStr === p.end) {
              await api.groupSettingUpdate(threadId, "not_announcement");
              await api.sendMessage(threadId, {
                text: `‎⎯͢⎯⃝"🟢 𝐍𝐀𝐌𝐀𝐙 𝐄𝐍𝐃 ⎯͢⎯⃝\n\nআসসালামু আলাইকুম! ✨\n*${p.name}* নামাজের সময় শেষ হয়েছে। 🕋\n\n✅ *গ্রুপ এখন উন্মুক্ত (Open)!*\n\nআশা করি সবাই জামাতের সাথে নামাজ আদায় করেছেন। এখন আপনারা আবার চ্যাট করতে পারেন। 💬😇\n\n*𝐓𝐇𝐀𝐍𝐊 𝐘𝐎𝐔 𝐅𝐎𝐑 𝐘𝐎𝐔𝐑 𝐏𝐀𝐓𝐈𝐄𝐍𝐂𝐄!* 💙`
              });
            }
          }
        } catch (e) { console.log(e); }
      }, 30000);

      return api.sendMessage(threadId, { text: "🟢 *Namaz Auto System Activated!*" });
    }

    if (action === "off") {
      clearInterval(activeIntervals[threadId]);
      delete activeIntervals[threadId];
      return api.sendMessage(threadId, { text: "🔴 *Namaz Auto System Deactivated!*" });
    }

    return api.sendMessage(threadId, { text: "ব্যবহার বিধি:\n.namazauto on\n.namazauto off" });
  }
};
