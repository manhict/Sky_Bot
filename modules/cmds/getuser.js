'use strict';
export const config = {
    name: 'getuser',
    version: '1.0.0',
    role: 0,
    author: ['manhG'],
    viDesc: 'get Info User.',
    enDesc: "get Info User.",
    category: ['Tìm kiếm', 'Search'],
    usage: '',
    timestamp: 5
}

import * as fs from 'fs'
import axios from 'axios'

var pathAvt = process.cwd() + "/caches/" + Date.now + '.png';
export async function onMessage({ event, api, args, message }) {
    let id, dataAPI;
    if (event.type == "message_reply") id = event.messageReply.senderID;
    else if (args[0] && args[0].indexOf(".com") !== -1) {
        try { id = await api.findUID(args[0]) } catch (error) { return console.log(error.stack || error) }
    }
    else id = Object.keys(event.mentions)[0] || args[0] || event.senderID;

    try { dataAPI = await api.getUser(id) } catch (error) { return console.log(error.stack || error) }
    if (!dataAPI) return;
    if (dataAPI.error) return message.reply(dataAPI.error);
    var name = dataAPI.name || 'Không có',
        username = dataAPI.username || 'Không có',
        uid = dataAPI.id || 'Không có',
        about = dataAPI.about || 'Không có',
        follow = dataAPI.follow || 'Không công khai',
        birthday = dataAPI.birthday || 'Không công khai',
        gender = dataAPI.gender || 'Gay',
        hometown = dataAPI.hometown || 'Không có',
        link = dataAPI.profileUrl || 'Không có',
        location = dataAPI.location || 'Không có',
        relationship = dataAPI.relationship || 'private',
        love = dataAPI.love || 'private',
        quotes = dataAPI.quotes || 'Không có',
        website = dataAPI.website || 'Không có',
        imgavt = dataAPI.thumbSrc;

    var img = (await axios.get(imgavt, {
        responseType: "arraybuffer"
    })).data;

    fs.writeFileSync(pathAvt, Buffer.from(img, "utf-8"));
    var avtarUser = [];
    avtarUser.push(fs.createReadStream(pathAvt));

    await message.send({
        body: `=== InFo User ===\n\n` +
            `- Tên: ` + name + `\n` +
            `- Uid: ` + uid + `\n` +
            `- Tên người dùng: ` + username + `\n` +
            `- Giới thiệu: ` + about + `\n` +
            `- Theo dõi: ` + follow + `\n` +
            `- Sinh nhật: ` + birthday + `\n` +
            `- Giới tính: ` + gender + `\n` +
            `- Quê quán: ` + hometown + `\n` +
            `- Link: ` + link + `\n` +
            `- Vị trí: ` + location + `\n` +
            `- Mối quan hệ: ` + relationship + `\n` +
            `- Tình yêu: ` + love + `\n` +
            `- Website: ` + website + `\n` +
            `- Trích dẫn: ` + quotes,
        attachment: avtarUser
    });

    return fs.unlinkSync(pathAvt)
}
