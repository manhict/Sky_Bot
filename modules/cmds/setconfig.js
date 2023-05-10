'use strict';
export const config = {
    name: 'setconfig',
    ver: '1.0.0',
    role: 2,
    author: ['ManhG'],
    category: ['Hệ thống', 'System'],
    viDesc: 'Setting configMain',
    enDesc: 'Setting configMain',
    timestamp: 5
}

import * as fs from "fs"
import { createRequire } from "module"
const require = createRequire(import.meta.url)

let dirConfigMain = process.cwd() + '/config/configMain.json';
let pathConfigMain = require(dirConfigMain)

export async function onMessage({ message, event }) {
    return message.reply(`Hãy reply tin nhắn này để cài đặt cấu hình configMain\n\n1. DevMode\n2. LOGBOT\n3. Uptime Robot\n4. DATABSE\n5. LANGUAGE SYSTEM\n6. AutoRestart\n7. personalOnly\n8. ADMIN_ONLY\n9. allQtvOnly\n10. brotherList\n11. PREFIX\n12. NAME  `, (error, info) => {
        client.reply.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        })
    })
};
export async function onReply({ reply, event, Config, message, args }) {
    switch (reply.type) {
        case "replyx2": {
            switch (event.body.toLowerCase()) {
                case `${'normal'.toLowerCase()}`:
                case `${'high'.toLowerCase()}`:
                case `${'super'.toLowerCase()}`: {
                    if (args[0].toLowerCase().includes('normal')) Config['DEVMODE'] = 'normal';
                    else if (args[0].toLowerCase().includes('high')) Config['DEVMODE'] = 'high';
                    else if (args[0].toLowerCase().includes('super')) Config['DEVMODE'] = 'super';
                    else return message.reply("Vui lòng chọn normal, high hoặc super !");
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    return message.reply(`Đã chọn chế độ DevMode là: ${Config['DEVMODE']} `);
                }
                    
                case "mongodb":
                case "local": {
                    if (args[0] == "local") Config['DATABASE']['type'] = 'local';
                    else Config['DATABASE']['type'] = 'mongodb';
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    return message.reply(`Đã chọn ${Config['DATABASE']['type'] == 'local' ? "local" : "mongodb"} làm nơi lưu trữ database`);
                }
                    
                case "vietnam":
                case "english": {
                    if (args[0] == "vietnam") Config['LANGUAGE_SYS'] = 'vi_VN';
                    else Config['LANGUAGE_SYS'] = 'en_US';
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    return message.reply(`Đã sử dụng ${Config['LANGUAGE_SYS']} làm ngôn ngữ hệ thống`)
                }

                default:
                    message.reply('Lựa chọn không hợp lệ!')
                    break;
            }
        }

        case "reply": {
            switch (event.body) {
                case "1": {
                    return message.reply("Vui lòng chọn normal, high hoặc super", (e, data) => {
                        if (data == undefined) { return message.reply('False') } else
                            client.reply.push({
                                name: this.config.name,
                                author: event.senderID,
                                messageID: data.messageID,
                                type: 'replyx2'
                            })
                    })
                }
                    break;
                case "2":
                case "2 on":
                case "2 off": {
                    if (args[1] == "on") Config['LOGBOT'] = true;
                    else if (args[1] == "off") Config['LOGBOT'] = false;
    
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    return message.reply(`Đã ${Config['LOGBOT'] ? "bật" : "tắt"} gửi tin nhắn khi bot được thêm vào nhóm mới hoặc bị kick về admin`);
                }
                    
                case "3":
                case "3 on":
                case "3 off": {
                    if (args[1] == "on") Config['UPTIMEROBOT'] = true;
                    else if (args[1] == "off") Config['UPTIMEROBOT'] = false;
                   
                    fs.writeFileSync(dirConfigMain, JSON.stringify(pathConfigMain, null, 2));
                    return message.reply(`Đã ${Config['UPTIMEROBOT'] ? "bật" : "tắt"} uptime robot`);
                }
                   
                case "4": {
                    return message.reply("Vui lòng chọn mongodb hoặc local", (e, data) => {
                        if (data == undefined) { return message.reply('False') } else
                            client.reply.push({
                                name: this.config.name,
                                author: event.senderID,
                                messageID: data.messageID,
                                type: 'replyx2'
                            })
                    })
                }
                    break;
                case "5": {
                    return message.reply("Vui lòng chọn vietnam hoặc english", (e, data) => {
                        if (data == undefined) { return message.reply('False') } else
                            client.reply.push({
                                name: this.config.name,
                                author: event.senderID,
                                messageID: data.messageID,
                                type: 'replyx2'
                            })
                    })
                }
                    break;
                case "6":
                case "6 on":
                case "6 off": {
                    if (args[1] == "on") Config['AUTORESTART']['status'] = true;
                    else if (args[1] == "off") Config['AUTORESTART']['status'] = false;
                  
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Đã ${Config['DATABASE']['type']} thành công`);
                }
                    break;
                case "7":
                case "7 on":
                case "7 off": {
                    if (args[1] == "on") Config['personalOnly'] = true;
                    else if (args[1] == "off") Config['personalOnly'] = false;
                   
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Đã ${Config['personalOnly']} thành công`);
                }
                    break;
                case "8":
                case "8 on":
                case "8 off": {
                    if (args[1] == "on") Config['adminOnly'] = true;
                    else if (args[1] == "off") Config['adminOnly'] = false;
 
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Đã ${Config['adminOnly']} thành công`);
                }
                    break;
                case "9":
                case "9 on":
                case "9 off": {
                    if (args[1] == "on") Config['allQtvOnly'] = true;
                    else if (args[1] == "off") Config['allQtvOnly'] = false;
                   
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Đã ${Config['allQtvOnly']} thành công`);
                }
                    break;
                case "10":
                case "10 on":
                case "10 off": {
                    const { brotherList, configBrother } = global;
                    if (args[1] == "on") brotherList['status'] = true;
                    else if (args[1] == "off") brotherList['status'] = false;
                    else return message.reply("Vui lòng chọn on hoặc off");
                    fs.writeFileSync(configBrother, JSON.stringify(brotherList, null, 4), 'utf8');
                    message.reply(`Đã ${brotherList['allQtvOnly'] ? "bật" : "tắt"} chế độ chỉ nhóm nhóm được duyệt mới có thể sử dụng bot`);
                }
                    break;
                case "11":
                case `11 ${args[1]}`: {
                    if (args[1]) Config['PREFIX'] = args[1];
                    else return message.reply("Vui lòng nhập prefix");
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Đã đặt: ${Config['PREFIX']} làm prefix hệ thống `);
                }
                    break;
                case "12":
                case `12 ${args[1]}`: {
                    if (args[1]) Config['NAME'] = args[1];
                    else return message.reply("Vui lòng nhập tên")
                    fs.writeFileSync(dirConfigMain, JSON.stringify(Config, null, 2));
                    message.reply(`Đã đặt: ${Config['NAME']} làm tên bot hệ thống `);
                }
                    break;
                default:
                    message.reply('Lựa chọn không hợp lệ!')
                    break;
            }
        }
    }
}
