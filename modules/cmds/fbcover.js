'use strict';

import request from 'request';
import fs from 'fs';

var pathImg = process.cwd() + "/caches/" + Date.now() + "_fbcover.png";

export const config = {
    name: 'fbcover',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tạo 1 banner FB.',
    enDesc: 'Create a FB banner.',
    category: ['Edit Card', 'Edit Card'],
    usages: "",
    timestamp: 5
};
export async function onMessage({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    var id;
    if (event.type == "message_reply") id = event.messageReply.senderID
    else id = Object.keys(event.mentions)[0] || args[0] || senderID;
    return api.sendMessage("Reply tin nhắn này tên của bạn", event.threadID, (err, info) => {
        client.reply.push({
            step: 1,
            name: this.config.name,
            messageID: info.messageID,
            content: {
                id: id,
                name: "",
                subname: "",
                number: "",
                email: "",
                address: "",
                color: ""
            }
        })
    }, event.messageID);
}
export async function onReply({ api, event, reply, message, Config }) {
    const { threadID, messageID, senderID, body } = event;
    if (reply.content.id != senderID) return;
    const input = body.trim();
    const sendC = (msg, step, content) => api.sendMessage(msg, threadID, (err, info) => {
        client.reply.splice(client.reply.indexOf(reply), 1);
        api.unsendMessage(reply.messageID);
        client.reply.push({
            step: step,
            name: "fbcover",
            messageID: info.messageID,
            content: content
        })
    }, messageID);

    let content = reply.content;

    switch (reply.step) {
        case 1:
            content.name = input;
            sendC("Reply tin nhắn này tên đệm của bạn", 2, content);
            break;
        case 2:
            content.subname = input;
            sendC("Reply tin nhắn này số điện thoại của bạn", 3, content);
            break;
        case 3:
            content.number = input;
            sendC("Reply tin nhắn này email của bạn", 4, content);
            break;
        case 4:
            content.email = input;
            sendC("Reply tin nhắn này địa chỉ của bạn", 5, content);
            break;
        case 5:
            content.address = input;
            sendC("Reply tin nhắn này màu bạn muốn chọn", 6, content);
            break;
        case 6:
            content.color = input;
            let c = content;
            var callback = () => message.reply({ body: ``, attachment: fs.createReadStream(pathImg) }, () => fs.unlinkSync(pathImg));
            const webApi = Config['WEBAPI'];
            const apikey = Config['manhG'];
            request(encodeURI(`${webApi}/fbcover1?name=${c.name}&uid=${c.id}&address=${c.address}&email=${c.email}&subname=${c.subname}&sdt=${c.number}&color=${c.color}&apikey=${apikey}`)).pipe(fs.createWriteStream(pathImg)).on('close', () => callback());
            break;
        default:
            break;
    }
}