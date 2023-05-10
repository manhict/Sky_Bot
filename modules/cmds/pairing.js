'use strict';
export const config = {
    name: 'pairing',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Tìm Kiếm Nửa Kia Của Bạn.',
    enDesc: 'Search for half-sibling of you.',
    category: ['Tình yêu', 'Love'],
    usages: '',
    timestamp: 5
}

import fs from 'fs'
import axios from 'axios'

export async function onMessage({ event, api, Config, Users, args }) {
    try {
        if (!args[0]) {
            var ThreadInfo = await api.getThreadInfo(event.threadID);
            var all = ThreadInfo.userInfo
            let data = [];
            for (let u of all) {
                if (u.gender == "MALE") {
                    if (u != event.senderID) data.push(u.id)
                }
                if (u.gender == "FEMALE") {
                    if (u != event.senderID) data.push(u.id)
                }
            }
            if (data.length == 0) return api.sendMessage("Rất tiếc! Không tìm thấy nửa đời của bạn :(", event.threadID, event.messageID);
            let e = data[Math.floor(Math.random() * data.length)]
            let a = (Math.random() * 50) + 50;
            var n = (await Users.getData(e)).name;
            const url = api.getCurrentUserID(e);

            let getAvatar = (await axios.get(`https://graph.facebook.com/${e}/picture?height=1500&width=1500&access_token=${Config.accessToken}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(process.cwd() + `/caches/${event.senderID}-pairing.png`, Buffer.from(getAvatar, "utf-8"));
            api.sendMessage({
                body: `⚡️Tìm Kiếm Nửa Kia Của Bạn\n⚡️Tên: ${n}\n⚡️Mối Quan Hệ: Độc Thân (có thể)\n⚡️Độ Phù Hợp: ${a.toFixed(2)}%\n⚡️ID: ${e}\n⚡️Profile: fb.me/${url}`,
                attachment: fs.createReadStream(process.cwd() + `/caches/${event.senderID}-pairing.png`)
            }, event.threadID, () => fs.unlinkSync(process.cwd() + `/caches/${event.senderID}-pairing.png`), event.messageID);
        } else {
            var ThreadInfo = await api.getThreadInfo(event.threadID);
            var all = ThreadInfo.userInfo;
            let data = [];
            if (args[0] == "boy") {
                for (let u of all) {
                    if (u.gender == "MALE") {
                        if (u != event.senderID) data.push(u.id)
                    }
                }
            } else if (args[0] == "girl") {
                for (let u of all) {
                    if (u.gender == "FEMALE") {
                        if (u != event.senderID) data.push(u.id)
                    }
                }
            }
            if (data.length == 0) return api.sendMessage("⚡️Rất tiếc! Không tìm thấy nửa đời của bạn :(", event.threadID, event.messageID);
            let e = data[Math.floor(Math.random() * data.length)]
            let a = (Math.random() * 50) + 50;
            var n = (await Users.getData(e)).name;
            const url = api.getCurrentUserID(e);
            let getAvatar = (await axios.get(`https://graph.facebook.com/${e}/picture?height=1500&width=1500&access_token=${Config.accessToken}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(process.cwd() + `/caches/${event.senderID}-pairing.png`, Buffer.from(getAvatar, "utf-8"));
            api.sendMessage({
                body: `⚡️Tìm Kiếm Nửa Kia Của Bạn\n⚡️Tên: ${n}\n⚡️Mối Quan Hệ: Độc Thân (có thể)\n⚡️Độ Phù Hợp: ${a.toFixed(2)}%\n⚡️ID: ${e}\n⚡️Profile: fb.me/${url}`,
                attachment: fs.createReadStream(process.cwd() + `/caches/${event.senderID}-pairing.png`)
            }, event.threadID, () => fs.unlinkSync(process.cwd() + `/caches/${event.senderID}-pairing.png`), event.messageID);
        }
    } catch (error) {
        console.error(error.stack || error);
    }
};