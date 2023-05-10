'use strict';
export const config = {
    name: 'devmode',
    version: '1.0.0',
    role: 2,
    author: ['Sky'],
    category: ['Hệ thống', 'System'],
    usages: '',
    viDesc: 'Setting devmod',
    enDesc: 'Setting devmod',
    timestamp: 5
}

import fs from 'fs';
import { createRequire } from "module"
const require = createRequire(import.meta.url)

let dirConfigMain = process.cwd() + '/config/configMain.json';
let Config = require(dirConfigMain)

export async function onMessage({ message, event }) {
    return message.reply(`Hãy reply tin nhắn này để chọn cấu hình Devmode\n\n1. Normal\n2. High\n3. Super`, (error, info) => {
        client.reply.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            normal: 'normal',
            high: 'high',
            vip: 'super'
        })
    })
};
export async function onReply({ reply, event, message }) {
    let { author, type, normal, high, vip, messageID } = reply;
    switch (reply.type) {
        case "reply":
            switch (event.body) {
                case "1":
                    message.unsend(messageID);
                    Config['DEVMODE'] = normal;
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Done`);
                    break;
                case "2":
                    message.unsend(messageID);
                    Config['DEVMODE'] = high;
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Done`);
                    break;
                case "3":
                    message.unsend(messageID);
                    Config['DEVMODE'] = vip;
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 4), 'utf8');
                    message.reply(`Done`);
                    break;
                default:
                    message.reply('Choose Fail')
                    break;
            }
            break;
    }
}