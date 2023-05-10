"use strict";
export const config = {
    name: 'language',
    role: 4,
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Thay đổi ngôn ngữ bot cho nhóm.',
    enDesc: 'Change language bot for group.',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 0
};

export const languages = {
    "vi_VN": {
        "missingInput": `〉Để thay đổi ngôn ngữ bot, sử dụng language <new language>\n\nHD: language -en/english`,
        "successChange": "〉Đã chuyển đổi ngôn ngữ bot của nhóm thành: %1",
        "chooseLanguage": "〉 Reply tin nhắn này để chọn ngôn ngữ bot chat \n\n1. Vietnames Language\n2. English Language"
    },
    "en_US": {
        "missingInput": `〉To change the language, enter language <new language>\n\nEx: language -vi/vietnames`,
        "successChange": "〉Changed language into: %1",
        "chooseLanguage": "〉 Reply to this message to select chat bot language \n\n1. Vietnames Language\n2. English Language"
    }
}

import * as fs from 'fs'

export async function onMessage({ event, Threads, message, args, Config, getText }) {
    const { threadID, senderID, messageID } = event;
    switch (args[0]) {
        case "vietnames":
        case "-vi":
            {
                await Threads.setData(threadID, { language: "vi_VN" });
                message.reply(getText(("successChange"), 'Tiếng Việt'))
            }
            break;
        case "english":
        case "-en":
            {
                await Threads.setData(threadID, { language: "en_US" });
                message.reply(getText(("successChange"), 'English English'))
            }
            break;
        case "default":
        case "-df":
            {
                let configMain = Config.LANGUAGE_SYS == 'vi_VN';
                fs.writeFileSync(process.cwd() + "/config/configMain.json", JSON.stringify(configMain, null, 2));
                message.reply(`Sucess default: ${Config['LANGUAGE_SYS']=='vi_VN' ? "vietnames" : "english"} `);
            }
            break;

        default: {
            message.reply(getText('chooseLanguage'), (error, info) => {
                global.client.reply.push({
                    type: "reply",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID
                })
            })
        }
        break;
    }
}

export async function onReply({ reply, event, getText, message, Threads }) {
    const { threadID, senderID, messageID } = event;
    switch (reply.type) {
        case "reply": {
            switch (event.body) {
                case "1":
                    {
                        await Threads.setData(threadID, { language: "vi_VN" });
                        message.reply(getText(("successChange"), 'Tiếng Việt'))
                    }
                break;

                case "2":
                    {
                        await Threads.setData(threadID, { language: "en_US" });
                        message.reply(getText(("successChange"), 'English Language'))
                    }
                break;

                default:
                    message.reply(getText("missingInput"))
                break;
            }
        }
    }
}
