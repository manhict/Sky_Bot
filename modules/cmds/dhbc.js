'use strict';

export const config = {
    name: 'dhbc',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Đuổi hình bắt chữ',
    enDesc: 'Game image catch word',
    category: ['Game', 'Game'],
    usage: '',
    timestamp: 0
}

import * as fs from 'fs'
import axios from 'axios'

let pateImg = process.cwd() + `/caches/dhbc_${Date.now()}.png`

export async function onMessage({ event, api, Users }) {
    const data = await api.gameDhbcV1();
    const answer = data.tukhoa;
    const suggestions = data.suggestions;
    const questionIMG = data.link;

    let DownquestionIMG = (await axios.get(questionIMG, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pateImg, Buffer.from(DownquestionIMG, "utf-8"));
    let imgPush = [];
    imgPush.push(fs.createReadStream(pateImg));
    let name = (await Users.getData(event.senderID)).name || (await api.getUserInfo(event.senderID)).name;
    return await api.sendMessage({
        attachment: imgPush,
        body: `» Câu hỏi dành cho: ${name}\n» Reply tin nhắn này để trả lời:\nGợi ý: ${answer.replace(/\S/g, "█ ")}`
    }, event.threadID, (error, info) => {
        if(!info) { return fs.unlinkSync(pateImg)}
        else client.reply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            answer,
            suggestions
        })
    }, event.messageID)
}

export async function onReply({ event, api, reply }) {
    const { answer, author, suggestions } = reply
    if (event.senderID != author) return
    if ((event.body).toLowerCase() == `gợi ý`) { return api.sendMessage(suggestions, event.threadID, event.messageID) } else if ((event.body).toLowerCase() == answer) {
        api.unsendMessage(reply.messageID)
        var msg = { body: `✔ Chúc mừng, bạn đã trả lời đúng\n» Đáp án: ${answer}` }
        await api.sendMessage(msg, event.threadID, event.messageID)
        fs.unlinkSync(pateImg)
    } else
        api.unsendMessage(reply.messageID)
    var msg = { body: `✘ Bạn trả lời sai rồi\n» Đán án: ${answer}` }
    await api.sendMessage(msg, event.threadID, event.messageID)
    fs.unlinkSync(pateImg)
}