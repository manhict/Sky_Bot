'use strict';
export const config = {
    name: 'resend',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Xem lại tin nhắn bị gỡ.',
    enDesc: 'See the message that was deleted.',
    category: ['Nhóm chat', 'Group'],
    usage: '',
    timestamp: 5
};

import { createReadStream, writeFileSync } from "fs";
import axios from "axios";
import request from "request";

export async function onMessage({ event, api, Threads }) {
    const { threadID, messageID, isGroup } = event;
    const dataThread = (await Threads.getData(threadID)) || {};
    const dataResend = dataThread.data;
    if (!dataResend) return;
    if (dataResend.resend == false) {
        dataResend.resend = true;
        Threads.setData(threadID, { data: dataResend });
        return api.sendMessage("» Bật resend.", threadID, messageID);
    } else {
        dataResend.resend = false;
        Threads.setData(threadID, { data: dataResend });
        return api.sendMessage("» Tắt resend.", threadID, messageID);
    }
}

export async function onEvent({ event, api, Threads, Users }) {
    let { messageID, senderID, threadID, body: content, isGroup } = event;
    if (!global.logMessage) global.logMessage = new Map();
    try {
        if (global.data.allThreadID.find(e => e == threadID)) {
            const dataBox = (await Threads.getData(threadID)) || {};
            var data = dataBox ? dataBox.data : {};
            if (typeof data["resend"] == "undefined") {
                data["resend"] = false;
                await Threads.setData(threadID, { data })
            }
            if(data["resend"] == false) return;
        }

        if (senderID == api.getCurrentUserID()) return;
        if (event.type != "message_unsend") global.logMessage.set(messageID, {
            msgBody: content,
            attachment: event.attachments
        })
        if (event.type == "message_unsend") {
            var getMsg = global.logMessage.get(messageID);
            if (!getMsg) return;
            let name = (await Users.getData(senderID)).name;
            if (getMsg.attachment[0] == undefined) return api.sendMessage(`${name} đã gỡ 1 tin nhắn\nNội dung: ${getMsg.msgBody}`, threadID)
            else {
                let num = 0
                let msg = {
                    body: `${name} vừa gỡ ${getMsg.attachment.length} tệp đính kèm.${(getMsg.msgBody != "") ? `\n\nNội dung: ${getMsg.msgBody}` : ""}`,
                    attachment: [],
                    mentions: { tag: name, id: senderID }
                }
                for (var i of getMsg.attachment) {
                    num += 1;
                    var getURL = await request.get(i.url);
                    var pathname = getURL.uri.pathname;
                    var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
                    var path = process.cwd() + `/caches/${num}.${ext}`;
                    var data = (await axios.get(i.url, { responseType: 'arraybuffer' })).data;
                    writeFileSync(path, Buffer.from(data, "utf-8"));
                    msg.attachment.push(createReadStream(path));
                }
                return api.sendMessage(msg, threadID);
            }
        }
    } catch (err) {
        //return console.error(err.stack || err);
    }
}
