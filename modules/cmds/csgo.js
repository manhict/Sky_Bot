'use strict';
export const config = {
    name: 'csgo',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Câu hỏi dành cho người chơi csgo.',
    enDesc: "Question for csgo player.",
    category: ['Game', 'Game'],
    usages: '',
    timestamp: 5
};

import * as fs from 'fs'
import axios from 'axios'

var pateImg = process.cwd() + `/caches/${Date.now()}-csgo.png`;
export async function onMessage({ event, api }) {
    const data = await api.gamePUBG();
    const linkGun = data.link;
    const bodyy = data.body;
    const imgthumnail = [];
    const getIMG = (await axios.get(`${linkGun}`, {
        responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(pateImg, Buffer.from(getIMG, "utf-8"));
    imgthumnail.push(fs.createReadStream(pateImg));
     api.sendMessage({
            attachment: imgthumnail,
            body: bodyy
        }, event.threadID, (error, info) => {
            if(info== undefined) return;
            else client.reply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                answer: data.answer
            })
        },
        event.messageID);
}
export async function onReply({ event, api, reply }) {
    const { answer, messageID } = reply;
    const answerUser = (event.body).toUpperCase()
    if (answerUser != "A" && answerUser != "B" && answerUser != "C") return
    if (answerUser == answer) {
        api.unsendMessage(messageID)
        return api.sendMessage(`〉Congratulations, you got the answer right, the answer is: ${answer}`, event.threadID, () => fs.unlinkSync(pateImg), event.messageID);
    } else
        api.unsendMessage(messageID)
    return api.sendMessage(`〉Sorry, your answer is wrong, the answer is: ${answer}`, event.threadID, event.messageID)
}