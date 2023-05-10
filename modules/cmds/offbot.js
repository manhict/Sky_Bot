"use strict";

const config = {
    name: 'offbot',
    role: 3,
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Off bot theo thời gian cố định.',
    enDesc: 'Turn off bot after a certain time.',
    category: ['Hệ thống', 'System'],
    usages: "[time ( giây )]",
    timestamp: 5
};

const languages = {
    "vi_VN": {
        "timeOn": "Vui lòng nhập thời gian để bật bot trở lại (giây)",
        "valiNumber": "Vui lòng nhập một số hợp lệ",
        "output": "Sẽ Bật Bot Trở Lại Sau: %1 Giây Nữa !"
    },
    "en_US": {
        "timeOn": "Please enter the time to turn on the bot again (seconds)",
        "valiNumber": "Please enter the time to turn on the bot again (seconds)",
        "output": "Please enter the time to turn on the bot again (seconds)"
    }
};

async function onMessage({ api, args, event,  getText }) {
    if (!args[0]) return api.sendMessage(getText('timeOn'), event.threadID, event.messageID);
    else {
        if (isNaN(args[0])) return api.sendMessage(getText('valiNumber'), event.threadID)
        var ec = 2
        var xx = ec + args[0];
        api.sendMessage(getText('output', args[0]), event.threadID, async () => process.exit(xx));
    }
}

export {
    config,
    languages,
    onMessage
}