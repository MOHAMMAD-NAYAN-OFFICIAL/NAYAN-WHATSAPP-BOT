const axios = require("axios");

module.exports = {
  config: {
    name: 'help',
    aliases: ['menu'],
    permission: 0,
    prefix: true,
    description: 'Show all available commands.',
    category: 'Utility',
    credit: 'Developed by Fahim Hussine',
    usages: ['help', 'help [command name]'],
  },

  start: async ({ event, api, args, loadcmd }) => {
    const { threadId, getPrefix } = event;
    const getAllCommands = () => loadcmd.map((plugin) => plugin.config);
    const commands = getAllCommands();

    const prefix = await getPrefix(threadId);
    const globalPrefix = global.config.PREFIX;

    // ক্যাটাগরিগুলো সুন্দর ইমোজি দিয়ে সাজানো
    const mergedCategories = {
      "👑 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗧𝗜𝗢𝗡": ["Administration", "Admin", "Owner", "Bot Management", "System"],
      "🧠 𝗔𝗜 𝗖𝗛𝗔𝗧𝗕𝗢𝗧": ["AI", "AI Chat"],
      "🎬 𝗠𝗘𝗗𝗜𝗔 & 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗": ["Media", "Video", "Image"],
      "🧰 𝗨𝗧𝗜𝗟𝗜𝗧𝗜𝗘𝗦": ["Utility", "Utilities"],
      "👥 𝗚𝗥𝗢𝗨𝗣 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗜𝗢𝗡": ["Group Management", "group", "Moderation"],
      "🎮 𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘𝗦": ["Fun", "Games", "greetings"],
      "🛰️ 𝗦𝗠𝗔𝗥𝗧 𝗧𝗢𝗢𝗟𝗦": ["Tools", "Information"]
    };

    const categories = {};
    commands.forEach((cmd) => {
      let cat = cmd.category || cmd.categorie || cmd.categories || "📦 𝗨𝗡𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗭𝗘𝗗";
      for (const merged in mergedCategories) {
        if (mergedCategories[merged].includes(cat)) {
          cat = merged;
          break;
        }
      }
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    });

    // ───── SINGLE COMMAND INFO ─────
    if (args[0]) {
      const command = commands.find((cmd) => cmd.name.toLowerCase() === args[0].toLowerCase());
      if (command) {
        const infoText = `
╭══──────══╮
  ✨ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ✨
╰══──────══╯
 🔹 𝗡𝗮𝗺𝗲: ${command.name}
 🔹 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${command.aliases?.join(", ") || "None"}
 🔹 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${command.version || "1.0.0"}
 🔹 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${command.description || "No description"}
 🔹 𝗨𝘀𝗮𝗴𝗲: ${command.usage || command.usages?.join("\n│   ") || "Not defined"}
 🔹 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: ${command.permission}
 🔹 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${command.category || "Uncategorized"}
 🔹 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: ${command.credit || command.credits || "Fahim Hussine"}
╭══──────══╮`;
        await api.sendMessage(threadId, { text: infoText });
      } else {
        await api.sendMessage(threadId, { text: `⚠️ No command found named "${args[0]}".` });
      }
      return;
    }
    const pkg = global.pkg;
    const timezone = global.config.timeZone || "Asia/Dhaka";

    const currentTime = new Date().toLocaleTimeString("en-US", {
      timeZone: timezone, hour: "2-digit", minute: "2-digit", hour12: true
    });

    const currentDate = new Date().toLocaleDateString("en-US", {
      timeZone: timezone, day: "2-digit", month: "2-digit", year: "numeric"
    });

    // ───── MAIN HELP MENU DESIGN ─────
    let responseText = `╭═══𝄟 💜 𝄟═══╮
   ✨ 𝗙𝗔𝗛𝗜𝗠 𝗕𝗢𝗧 ✨
╰═══𝄟 💜 𝄟═══╯
│ 👑 𝙊𝙬𝙣𝙚𝙧: ${global.config.botOwner || "Fahim Hussine"}
│ ⭕ 𝙋𝙧𝙚𝙛𝙞x: \`${prefix || globalPrefix}\`
│ 📊 𝙏𝙤𝙩𝙖𝙡 𝘾𝙢𝙙𝙨: ${commands.length}
│ 🕒 𝙏𝙞𝙢𝙚: ${currentTime}
│ 📅 𝘿𝙖𝙩𝙚: ${currentDate}
╰═════════════╯
 
「 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 」`;

    for (const category in categories) {
      const cmds = categories[category]
        .map(cmd => `  ├─  ${prefix}${cmd.name}`)
        .join("\n");

      responseText += `\n\n🔵 ${category}\n${cmds}\n  ╰──────────────`;
    }

    responseText += `\n\n╭══──────══╮\n  💡 Type ${prefix}help [cmd] \n╰══──────══╯`;

    try {
      const response = await axios.get(global.config.helpPic, { responseType: 'stream' });
      await api.sendMessage(threadId, {
        image: { stream: response.data },
        caption: responseText
      });
    } catch {
      await api.sendMessage(threadId, { text: responseText });
    }
  },
};
