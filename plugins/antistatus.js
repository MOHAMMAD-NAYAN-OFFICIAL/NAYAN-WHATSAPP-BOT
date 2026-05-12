let antiStatusGroups = []

module.exports = {
    name: 'antistatus',
    category: 'group',
    async execute(sock, m) {
        try {
            const from = m.key.remoteJid
            const text = m.message?.conversation || m.message?.extendedTextMessage?.text || ""

            // ===== ON =====
            if (text === "/antistatus on") {
                if (!antiStatusGroups.includes(from)) {
                    antiStatusGroups.push(from)
                }
                await sock.sendMessage(from, { text: "✅ AntiStatus ON" })
            }

            // ===== OFF =====
            if (text === "/antistatus off") {
                antiStatusGroups = antiStatusGroups.filter(g => g !== from)
                await sock.sendMessage(from, { text: "❌ AntiStatus OFF" })
            }

            // ===== DELETE STATUS =====
            const isStatus = m.message?.extendedTextMessage?.contextInfo?.remoteJid === "status@broadcast"
            if (isStatus && antiStatusGroups.includes(from)) {
                await sock.sendMessage(from, { delete: m.key })
                await sock.sendMessage(from, { text: "❌ Status mention allowed na!" })
            }
        } catch(err) {
            console.log(err)
        }
    }
}
