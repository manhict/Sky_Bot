'use strict';
export const config = {
    name: 'sendnoti',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Gửi thông báo đến tất cả các nhóm + reply',
    enDesc: 'Send notification to all group + reply',
    category: ['Hệ thống', 'System'],
    usages: 'sendnoti [text]',
    timestamp: 0
}

import request from 'request';
import * as fs from 'fs';
import axios from 'axios';

export const languages = {
    'vi_VN': {
        "nocontent": "☞ Bạn chưa nhập nội dung cần",
        "sendThread": "» Vào %1\n☞ Tin nhắn của bạn đã được gửi đến các box",
        "replyBox": "===「%1」===\n\n☞Reply tin nhắn này để tiếp tục nhắn tin về admin (ảnh, video, icon, emoij, văn bản,...)\n\n📩Nội dung: %2",
        "formSendBox": "》 𝙁𝙧𝙤𝙢 𝘼𝙙𝙢𝙞𝙣 《\n\n☞Reply tin nhắn này để tiếp tục nhắn tin về admin (ảnh, video, icon, emoij, văn bản,...)\n\n📩Nội dung: %1"
    },
    'en_US': {
        "nocontent": "☞ You have not entered the content",
        "sendThread": "» Go to %1\n☞ You have submitted a content to the box",
        "replyBox": "===「%1」===\n\n☞ Reply to this message to continue content to the admin (photo, video, icon, emoij, text,...)\n\n📩Content: %2 ",
        "formSendBox": "》 𝙁𝙧𝙤𝙢 𝘼𝙙𝙢𝙞𝙣 《\n\n☞Reply to this message to continue content to the admin (photo, video, icon, emoij, text,...)\n\n📩Content: %1"
    }
}
async function downloadMedia(event) {
    try {
        var pathAttachment = [];
        if (event.attachments.length != 0) {
            var urlPath = event.attachments[0].url;
            var getURL = await request.get(urlPath);
            var pathname = getURL.uri.pathname;
            var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
            var getdata = (await axios.get(`${urlPath}`, { responseType: 'arraybuffer' })).data;
            var path = process.cwd() + `/caches/` + Date.now() + `.${ext}`;
            fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));
            pathAttachment.push(fs.createReadStream(path))
            setTimeout(() => {
                fs.unlinkSync(path);
            }, 20000);
        }
        else {
            if (event.type == "message_reply") {
                if (event.messageReply.attachments[0] == undefined) return;
                var urlPath = event.messageReply.attachments[0].url;
                var getURL = await request.get(urlPath);
                var pathname = getURL.uri.pathname;
                var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
                let getdata = (await axios.get(`${urlPath}`, { responseType: 'arraybuffer' })).data;
                var path = process.cwd() + `/caches/` + Date.now() + `.${ext}`;
                fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));
                pathAttachment.push(fs.createReadStream(path))
                setTimeout(() => {
                    fs.unlinkSync(path);
                }, 20000);
            }
        }
        return pathAttachment;
    } catch (error) {
        console.error(error.message || error.stack);
    }
}
export async function onMessage({ event, api, Config, Threads, Users, args, getText }) {
    process.setMaxListeners(0);
    const { threadID, senderID, messageID } = event;
    var allThreadID = global.data.allThreadID || [];

    if (!args[0] && await downloadMedia(event) == []) return api.sendMessage(getText('nocontent'), threadID, messageID);

    var count = 1,
        cantSend = [];
    var msg = args.join(` `)
    msg = msg.replace(/\\n/g, "\n");
    var formReport = getText('formSendBox', msg);

    if (event.type == "message_reply") {
        var formReportPath = {
            body: formReport,
            attachment: await downloadMedia(event)
        }
        for (let idThread of allThreadID) {
            api.sendMessage(formReportPath, idThread, (error, info) => {
                if (info == undefined) { cantSend.push(idThread) }
                else
                    client.reply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        messID: messageID,
                        type: "replyAdmin",
                    })
            });
            count++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return api.sendMessage(`Success: ${count - cantSend.length} group`, threadID,
            () => (cantSend.length > 0) ? api.sendMessage(`Total: ${count}\nErorr(${cantSend.lenght}):\n${cantSend}`, threadID, messageID) : "", messageID);
    } else {
        for (let idThread of allThreadID) {
            api.sendMessage(formReport, idThread, (error, info) => {
                if (info == undefined) {
                    cantSend.push(idThread);
                }
                else
                    client.reply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        messID: messageID,
                        type: "replyAdmin"
                    })
            });
            count++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return api.sendMessage(`Success: ${count - cantSend.length} group`, threadID,
            () => (cantSend.length > 0) ? api.sendMessage(`Total: ${count}\nErorr(${cantSend.lenght}):\n${cantSend}`, threadID, messageID) : "", messageID);
    }
}
export async function onReply({ event, api, Config, getText, Threads, Users, reply }) {
    const { threadID, senderID, messageID } = event;
    var nameUser = (await Users.getData(senderID)).name;
    var idadSu = Config['ADMIN'];
    var idadEx = Config['EXCEPTION'];
    var idad = idadSu.concat(idadEx);

    switch (reply.type) {
        case "replyAdmin": {
            for (let ad of idad) {
                api.sendMessage({
                    body: "📩Phản hồi từ 「" + nameUser + "」\n\n" + event.body,
                    attachment: await downloadMedia(event),
                    mentions: [{ id: senderID, tag: nameUser }]
                }, ad, (error, data) => {
                    if (data == undefined) { return api.sendMessage('') } else
                        client.reply.push({
                            name: this.config.name,
                            messageID: data.messageID,
                            messID: messageID,
                            author: reply.author, idThread: threadID, idMessage: messageID, idUser: senderID,
                            id: threadID,
                            type: "replyBox"
                        })
                })
            }
        }
            break;
        case "replyBox": {
            var formSendBox = getText("replyBox", nameUser, event.body)
            api.sendMessage({
                body: formSendBox,
                attachment: await downloadMedia(event),
                mentions: [{ tag: nameUser, id: senderID }]
            },
                reply.id, (error, data) => {
                    if (data == undefined) { return api.sendMessage('') } else
                        client.reply.push({
                            name: this.config.name,
                            author: senderID,
                            messageID: data.messageID,
                            messID: messageID,
                            type: "replyAdmin"
                        })
                }, reply.messID);
        }
            break;
    }
};