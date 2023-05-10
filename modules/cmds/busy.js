'use strict';
export const config = {
    name: 'busy',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Bật tắt chế độ busy.',
    enDesc: "Turn on/off busy mode.",
    category: ["Tiện ích", "Utility"],
    usages: "",
    timestamp: 5
}

const busyPath = process.cwd() + '/caches/busy.json';
import fs from 'fs'

export const language = {
    "vi_VN": {},
    "en_US": {}
}

export function onLoad() {
    if (!fs.existsSync(busyPath)) fs.writeFileSync(busyPath, JSON.stringify({}));
}

export async function onEvent({ api, event, Users }) {
    let busyData = JSON.parse(fs.readFileSync(busyPath));
    var { senderID, threadID, messageID, mentions } = event;
    if (senderID in busyData) {
        var info = busyData[senderID];
        delete busyData[senderID];
        fs.writeFileSync(busyPath, JSON.stringify(busyData, null, 4));
        return api.sendMessage(`𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐁𝐚𝐜𝐤!! 🥰`, threadID, () => {
            if (info.tag.length == 0) api.sendMessage("𝐓𝐫𝐨𝐧𝐠 𝐥𝐮́𝐜 𝐛𝐚̣𝐧 𝐯𝐚̆́𝐧𝐠 𝐦𝐚̣̆𝐭 𝐤𝐡𝐨̂𝐧𝐠 𝐚𝐢 𝐧𝐡𝐚̆́𝐜 𝐛𝐚̣𝐧 𝐜𝐚̉", threadID);
            else {
                var msg = "";
                for (var i of info.tag) {
                    msg += `${i}\n`
                }
                api.sendMessage("𝐃𝐚𝐧𝐡 𝐬𝐚́𝐜𝐡 𝐧𝐡𝐮̛̃𝐧𝐠 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐧𝐡𝐚̆́𝐜 𝐛𝐚̣𝐧 𝐭𝐫𝐨𝐧𝐠 𝐥𝐮́𝐜 𝐛𝐚̣𝐧 𝐯𝐚̆́𝐧𝐠 𝐦𝐚̣̆𝐭:\n\n" + msg, threadID)
            }
        }, messageID);
    }

    if (!mentions || Object.keys(mentions).length == 0) return;

    for (const [ID, name] of Object.entries(mentions)) {
        if (ID in busyData) {
            var infoBusy = busyData[ID],
                mentioner = (await Users.getNameUser(senderID)).name,
                replaceName = event.body.replace(`${name}`, "");
            infoBusy.tag.push(`${mentioner}: ${replaceName == "" ? "ᴆᴀ̃ ᴛᴀɢ ʙᴀ̣ɴ 1 ʟᴀ̂̀ɴ" : replaceName}`)
            busyData[ID] = infoBusy;
            fs.writeFileSync(busyPath, JSON.stringify(busyData, null, 4));
            return api.sendMessage(`${name.replace("@", "")} ʜɪᴇ̣̂ɴ ᴆᴀɴɢ ʙᴀ̣̂ɴ ${infoBusy.lido ? ` ᴠᴏ̛́ɪ ʟʏ́ ᴅᴏ: ${infoBusy.lido}.` : "."}`, threadID, messageID);
        }
    }
}

export async function onMessage({ api, event, args, Users }) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    let busyData = JSON.parse(fs.readFileSync(busyPath));
    const { threadID, senderID, messageID, body } = event;
    var content = args.join(" ") || "";
    if (!(senderID in busyData)) {
        busyData[senderID] = {
            lido: content,
            tag: []
        }
        fs.writeFileSync(busyPath, JSON.stringify(busyData, null, 4));
        var msg = (content.length == 0) ? '=====BUSY=====\n\nʙᴀ̣ɴ ᴆᴀ̃ ʙᴀ̣̂ᴛ ᴄʜᴇ̂́ ᴆᴏ̣̂ ʙᴜsʏ\nʟɪ́ ᴅᴏ: ɪɴᴠɪsɪʙʟᴇ' : `=====BUSY=====\n\nʙᴀ̣ɴ ᴆᴀ̃ ʙᴀ̣̂ᴛ ᴄʜᴇ̂́ ᴆᴏ̣̂ ʙᴜsʏ\nʟɪ́ ᴅᴏ: ${content}`;
        return api.sendMessage(msg, threadID, messageID);
    }
}
