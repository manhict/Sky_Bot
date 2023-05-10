'use strict';
export const config = {
    name: 'doanhinh',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Đuổi hình bắt chữ v3 trên chính messenger của bạn.',
    enDesc: 'Play game doanhinh v3 on your messenger.',
    category: ['Game', 'Game'],
    usage: '',
    timestamp: 5
}

import * as fs from 'fs'
import axios from 'axios'

let pateImg1 = process.cwd() + config.name + Date.now()+'_1.png'
let pateImg2 = process.cwd() + config.name + Date.now()+'_2.png'
export async function onReply({ api, event, args, reply }) {
    switch (reply.type) {
        case "reply":
            {
                let { author, wordcomplete, messageID } = reply;

                function formatText(text) {
                    return text.normalize("NFD")
                        .toLowerCase()
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/đ/g, "d")
                        .replace(/Đ/g, "D");
                }(formatText(event.body) == formatText(wordcomplete)) ? api.sendMessage("✔Hay quá! Chúc mừng bạn đã trả lời đúng", event.threadID, event.messageID) : api.sendMessage(`✘Tiếc quá! Sai rồi, đáp án đúng là: ${wordcomplete}`, event.threadID, event.messageID),
                await api.unsendMessage(reply.messageID);
                setTimeout(async() =>{
                    await fs.unlinkSync(pateImg1)
                    fs.unlinkSync(pateImg2)
                },2000)
            }
    }
};

export async function onMessage({ api, event }) {
    const dataGame = await api.gameDhbcV3();
    let question = (await axios.get(`${dataGame.image1}`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pateImg1, Buffer.from(question, "utf-8"));
    let answer = (await axios.get(`${dataGame.image2}`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pateImg2, Buffer.from(answer, "utf-8"));
    var img_qs = [];
    img_qs.push(fs.createReadStream(pateImg1));
    img_qs.push(fs.createReadStream(pateImg2));
    var msg = { body: `Hãy reply tin nhắn này với câu trả lời!\nGợi ý: ${dataGame.wordcomplete.replace(/\S/g, "█ ")}`, attachment: img_qs }
    return api.sendMessage(msg, event.threadID, (error, info) => {
        client.reply.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            tukhoa: dataGame.wordcomplete,
            dapan: dataGame.wordcomplete,
            wordcomplete: dataGame.wordcomplete
        })
    })
}