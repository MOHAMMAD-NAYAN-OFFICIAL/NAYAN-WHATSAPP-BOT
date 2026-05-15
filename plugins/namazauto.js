const activeIntervals = {};

module.exports = {
  config: {
    name: "namazauto",
    permission: 2,
    prefix: true,
    category: "group",
    credit: "XAHID PRIME 💸"
  },

  start: async ({ event, api, args }) => {
    const { threadId, senderId } = event;

    // 👑 ADMIN CHECK
    const botAdmins = (global.config.admin || []).map(id =>
      id.includes("@") ? id : id + "@s.whatsapp.net"
    );

    const metadata = await api.groupMetadata(threadId);
    const groupAdmins = metadata.participants
      .filter(p => p.admin)
      .map(p => p.id);

    if (!groupAdmins.includes(senderId) && !botAdmins.includes(senderId)) {
      return api.sendMessage(threadId, {
        text: "🚫 Only admins or owners can use this command!"
      });
    }

    const action = args[0]?.toLowerCase();

    // 🕌 Faridpur Timing + Jummah
    const schedule = [
      { name: "Fajr", start: "04:15", end: "05:00" },
      { name: "Dhuhr", start: "12:05", end: "13:15" },
      { name: "Asr", start: "16:25", end: "17:10" },
      { name: "Maghrib", start: "18:20", end: "18:50" },
      { name: "Isha", start: "19:35", end: "20:30" },
      { name: "Jummah", start: "13:15", end: "14:00" } // Friday only
    ];

    const getMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    if (action === "on") {
      if (activeIntervals[threadId]) {
        return api.sendMessage(threadId, {
          text: "⚠️ Namaz Auto Already ON!"
        });
      }

      activeIntervals[threadId] = setInterval(async () => {
        try {
          const now = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
          );

          const current = now.getHours() * 60 + now.getMinutes();
          const day = now.getDay(); // Friday = 5

          for (const p of schedule) {

            // Jummah only on Friday
            if (p.name === "Jummah" && day !== 5) continue;

            const start = getMinutes(p.start);
            const end = getMinutes(p.end);

            // 🔒 LOCK
            if (current === start) {
              await api.groupSettingUpdate(threadId, "announcement");
              await api.sendMessage(threadId, {
                text: `‎⎯͢⎯⃝"💙۵𝐍𝐀𝐌𝐀𝐙 𝐓𝐈𝐌𝐄༎-༉⎯͢⎯⃝🕌💙

— 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 -! ! ✨💌
— 𝐆𝐫𝐨𝐮𝐩 𝐎𝐟𝐟 -! ! 🚫

" এখন নামাজের সময় হয়েছে-!!🕌🌸"
"সবাই নামাজ আদায় করতে যাও-!!🤲💖"
"নামাজ মোবারক সবাইকে-!!✨💙"
"দোয়া করতে ভুলবে না-!!🌙🤍"

"𝐆𝐎 𝐅𝐎𝐑 𝐍𝐀𝐌𝐀𝐙>:)🕌"
"নামাজ শেষে আবার আসবা-!!💌🙃"

"𝐓𝐇𝐀𝐍𝐊~𝐘𝐎𝐔 𝐄𝐕𝐄𝐑𝐘𝐎𝐍𝐄-!!🤍"
"আমাদের 𝐆𝐑𝐎𝐔𝐏 এ এতো 𝐓𝐈𝐌𝐄 দেওয়ার জন্য-!!😫🌼💢"

"⏰ গ্রুপ খোলার সময় হলে অটোমেটিক খুলে যাবে ইনশাআল্লাহ-!!🟢✨"`
              });
            }

            // 🔓 UNLOCK
            if (current === end) {
              await api.groupSettingUpdate(threadId, "not_announcement");
              await api.sendMessage(threadId, {
                text: `‎⎯͢⎯⃝"💚۵𝐍𝐀𝐌𝐀𝐙 𝐄𝐍𝐃༎-༉⎯͢⎯⃝🕌💚

— 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦 -! ! ✨💌
— 𝐆𝐫𝐨𝐮𝐩 𝐎𝐧 -! ! 🟢

"${p.name} নামাজের সময় শেষ হয়েছে-!!🕌🌸"
"আশা করি সবাই নামাজ আদায় করেছেন-!!🤲💖"

"গ্রুপ আবার চালু করা হয়েছে-!!📢✨"
"সবাই আবার চ্যাট করতে পারেন-!!💬😄"

"𝐓𝐇𝐀𝐍𝐊 𝐘𝐎𝐔 𝐅𝐎𝐑 𝐘𝐎𝐔𝐑 𝐏𝐀𝐓𝐈𝐄𝐍𝐂𝐄-!!🤍"
"আবার সকলে একসাথে থাকি-!!💙🌼"`
              });
            }
          }
        } catch (e) {
          console.log("Namaz Error:", e);
        }
      }, 60000);

      return api.sendMessage(threadId, {
        text:
          `🟢 𝐍𝐀𝐌𝐀𝐙 & 𝐉𝐔𝐌𝐌𝐀𝐇 𝐀𝐔𝐓𝐎 𝐒𝐘𝐒𝐓𝐄𝐌 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃\n\n` +
          `🕌 নামাজ ও জুম্মার সময় অনুযায়ী গ্রুপ স্বয়ংক্রিয়ভাবে বন্ধ ও চালু হবে\n\n` +
          `⏰ নির্ধারিত সময়ে অটোমেটিক লক & আনলক সিস্টেম চালু হয়েছে\n` +
          `🤲 সবাইকে সময়মতো নামাজ আদায়ের অনুরোধ রইলো`
      });
    }

    if (action === "off") {
      if (!activeIntervals[threadId]) {
        return api.sendMessage(threadId, {
          text: "⚠️ Already OFF!"
        });
      }

      clearInterval(activeIntervals[threadId]);
      delete activeIntervals[threadId];

      return api.sendMessage(threadId, {
        text: "🔴 Namaz Auto System Deactivated!"
      });
    }

    return api.sendMessage(threadId, {
      text: "/namazauto on\n/namazauto off"
    });
  }
};
