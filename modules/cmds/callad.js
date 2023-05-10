'use strict';
export const config = {
    name: 'callad',
    version: '1.0.0',
    role: 4,
    author: ['Sky'],
    viDesc: 'Liên hệ với admin bot.',
    enDesc: 'Contact Admin',
    category: ['Hỗ trợ', 'Support'],
    usage: '',
    timestamp: 1
}

import request from 'request'
import axios from 'axios'
import * as fs from 'fs'

const rdPathName = `callad_` + Date.now();

export const languages = {
    'vi_VN': {
        "nocontent": "〉Bạn chưa nhập nội dung hoặc reply 1 ảnh video nào đó cần báo cáo!",
        "sendAdmin": "===「%1」===\n\n╰❥%2, đã gửi thành công tin nhắn đến Admin.\n\n☃Nội dung: %3\n\n⏱ %4",
        "formReport": "== Báo cáo từ:「%1」==\n\n╰❥Box: %2\n☞Fb url: %3\n\n☃Nội dung: %4\n\n⏱Time: %5",
        "formSendBox": "===「%1」===\n\n☞Reply tin nhắn này để tiếp tục báo cáo về admin (ảnh, video, icon, emoij, văn bản,...)\n\n📩Nội dung: %2",
        "userReply": "📩Phản hồi từ 「 %1 」\n\n%2"
    },
    'en_US': {
        "nocontent": "〉You have not entered the content to report",
        "sendAdmin": "===「%1」===\n\n╰❥%2, has successfully sent a message to Admin.\n\n☃Content: %3\n\n⏱ %4",
        "formReport": "== Report from:「%1」==\n\n╰❥Box: %2\n☞Fb url: %3\n\n☃Content: %4\n\n⏱ Time: %5",
        "formSendBox": "===「%1」===\n\n☞ Reply to this message to continue reporting to the admin (photo, video, icon, emoij, text,...)\n\n Content: %2",
        "userReply": "📩Response from 「 %1 」\n\n%2"
    }
}
export async function downloadMedia(event) {
    var pathAttachment = [];
    if (event.attachments.length != 0) {
        var urlPath = event.attachments[0].url;
        var getURL = await request.get(urlPath);
        var pathname = getURL.uri.pathname;
        var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
        var getdata = (await axios.get(`${urlPath}`, { responseType: 'arraybuffer' })).data;
        var path = process.cwd() + '/caches/' + rdPathName + `.${ext}`;
        fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));
        pathAttachment.push(fs.createReadStream(path))
    }
    else {
        if (event.type == "message_reply") {
            if (event.messageReply.attachments[0] == undefined) return;
            var urlPath = event.messageReply.attachments[0].url;
            var getURL = await request.get(urlPath);
            var pathname = getURL.uri.pathname;
            var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
            let getdata = (await axios.get(`${urlPath}`, { responseType: 'arraybuffer' })).data;
            var path = process.cwd() + '/caches/' + rdPathName + `.${ext}`;
            fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));
            pathAttachment.push(fs.createReadStream(path))
        }
    }
    return pathAttachment;
};
export async function onMessage({ event, api, Config, Threads, Users, args, getText }) {
    var gio = global.utils.getTime('fullTime');
    const { threadID, senderID, messageID } = event;
    var idadSu = Config['ADMIN'];
    var idadEx = Config['EXCEPTION'];
    var idad = idadSu.concat(idadEx);

    if (!args[0] && await downloadMedia(event) != []) return api.sendMessage(getText('nocontent'), threadID, messageID);
    let nameT = (await Threads.getData(threadID)).name || api.getThreadInfo(threadID).name || threadID,
        nameUser = (await Users.getName(senderID)) || api.getUserInfo(senderID).name || senderID,
        vanity = (await Users.getData(senderID)).vanity || senderID,
        urlSl = `Fb.com/${vanity}`;

    var formReport = getText("formReport", nameUser, nameT, urlSl, args.join(" "), gio);
    if (event.type == "message_reply") {
        var formReportPath = {
            body: formReport,
            attachment: await downloadMedia(event)
        }
        api.sendMessage(getText('sendAdmin', threadID, nameUser, args.join(" "), gio), threadID, () => {
            for (let ad of idad) {
                api.sendMessage(formReportPath, ad, (error, info) => {
                    if (info == undefined) { return api.sendMessage(`Error: ${ad}`, threadID) } else
                        global.client.reply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: senderID,
                            messID: messageID,
                            id: threadID,
                            url: urlSl,
                            type: "calladmin"
                        })
                });
            }
        });
    } else {
        api.sendMessage(getText('sendAdmin', threadID, nameUser, args.join(" "), gio), threadID, () => {
            for (let ad of idad) {
                api.sendMessage(formReport, ad, (error, info) => {
                    if (info == undefined) { return api.sendMessage(`Error: ${ad}`, threadID) }
                    else
                        global.client.reply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: senderID,
                            messID: messageID,
                            id: threadID,
                            url: urlSl,
                            type: "calladmin"
                        })
                });
            }
        });
    }
}
export async function onReply({ event, api, Config, getText, Threads, Users, reply }) {
    const { threadID, senderID, messageID } = event;
    var nameUser = (await Users.getName(senderID)) || api.getUserInfo(senderID).name || senderID;
    var idadSu = Config['ADMIN'];
    var idadEx = Config['EXCEPTION'];
    var idad = idadSu.concat(idadEx);

    switch (reply.type) {
        case "reply":
            {
                for (let ad of idad) {
                    api.sendMessage({
                        body: getText("userReply", nameUser, event.body),
                        attachment: await downloadMedia(event),
                        mentions: [{ id: senderID, tag: nameUser }]
                    }, ad, (error, data) => {
                        if (data == undefined) { return api.sendMessage('Erorr', threadID) }
                        else
                            global.client.reply.push({
                                name: this.config.name,
                                messageID: data.messageID,
                                messID: messageID,
                                author: senderID,
                                id: threadID,
                                type: "calladmin"
                            })
                    })
                }
            }
            break;
        case "calladmin":
            {
                var formSendBox = getText("formSendBox", nameUser, event.body)
                api.sendMessage({
                    body: formSendBox,
                    attachment: await downloadMedia(event),
                    mentions: [{ tag: nameUser, id: senderID }]
                },
                    reply.id, (error, data) => {
                        if (data == undefined) { return } else
                            global.client.reply.push({
                                name: this.confing.name,
                                author: senderID,
                                messageID: data.messageID,
                                messID: messageID,
                                type: "reply"
                            })
                    }, reply.messID);
            }
            break;
    }
};
