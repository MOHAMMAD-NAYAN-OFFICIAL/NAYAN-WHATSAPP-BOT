const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

const IMGBB_API_KEY = "bc7c1ac0e87591f06894322b88fa14b4"; 

module.exports = {
  config: {
    name: "getlink",
    aliases: ["glink", "ulink"],
    permission: 0,
    prefix: true,
    description: "Upload replied image/GIF to ImgBB and get direct link.",
    category: "Tools",
    usages: ["getlink (reply to image/GIF)"],
    credit: "Developed by Mohammad Nayan (Edited)",
  },

  start: async ({ event, api }) => {
    const { message } = event;

    try {
      const ctx = message?.message?.extendedTextMessage?.contextInfo;
      if (!ctx || !ctx.quotedMessage) {
        return api.sendMessage(
          event.threadId,
          { text: "⚠️ Please reply to an image or GIF." },
          { quoted: message }
        );
      }

      const quoted = ctx.quotedMessage;

      let mediaType = null;
      if (quoted.imageMessage) mediaType = "image";
      else if (quoted.videoMessage && quoted.videoMessage.gifPlayback)
        mediaType = "gif";
      else {
        return api.sendMessage(
          event.threadId,
          { text: "⚠️ Only image and GIF supported." },
          { quoted: message }
        );
      }

      const buffer = await downloadMediaMessage(
        { message: quoted },
        "buffer",
        {},
        { reuploadRequest: api.updateMediaMessage }
      );

      const tempPath = path.join(
        __dirname,
        `temp_${Date.now()}.${mediaType === "gif" ? "gif" : "jpg"}`
      );

      fs.writeFileSync(tempPath, buffer);

      
      const form = new FormData();
      form.append("image", fs.createReadStream(tempPath));

      const uploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        form,
        { headers: form.getHeaders() }
      );

      fs.unlinkSync(tempPath);

      const url = uploadRes.data?.data?.url || "Upload failed";

      return api.sendMessage(
        event.threadId,
        {
          text: `✅ *Upload Successful!*\n\n🔗 Link:\n${url}`,
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("getlink error:", err);

      return api.sendMessage(
        event.threadId,
        { text: "❌ Failed to upload image to ImgBB." },
        { quoted: message }
      );
    }
  },
  };
