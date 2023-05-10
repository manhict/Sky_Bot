'use strict';
const numberSp = 10,
    timeUnban = 15,
    secondsBan = 60;
export const config = {
    name: 'spamban',
    version: '1.0.0',
    role: 4,
    author: ['Sky'],
    viDesc: 'Tự động cấm người dùng nếu spambot ' + numberSp + ' lần/' + secondsBan + ' giây.',
    enDesc: 'Automatically ban users if spambot ' + numberSp + ' times/' + secondsBan + ' seconds.',
    category: ['Hỗ trợ', 'Support'],
    usage: '',
    timestamp: 0
};
export const languages = {
    "vi_VN": {
        "reason": "Tự động cấm vì spam %1 lần trong 1 phút.",
        "blockBox": "=== Bot Notification ===\n\n- {nameUser}, Bạn tạm thời bị cấm sử dụng bot, vui lòng đợi sau {timeUnban} phút để có thể tiếp tục sử dụng.\n\n- Lý do: {reason}",
        "sendAdmin": "",
    },
    "en_US": {
        "reason": "Automatically banned for spam %1 times in 1 minute.",
        "blockBox": "=== Bot Notification === \n\n- {nameUser}, You are temporarily banned from using the bot, please wait after 15 minutes to continue using it. \n\n- Reason: {reason}",
        "sendAdmin": "",
    }
}
export async function onMessage({ message, getText }) {
    return message.reply(getText('reason', numberSp));
}
export async function onEvent({ global, event, api, Config, logger, Threads, Users, getText, message }) {
    try {
        const { senderID, threadID } = event;
        var idadSu = Config['ADMIN'], idadEx = Config['EXCEPTION'];
        var idad = idadSu.concat(idadEx);
        const prefix = (await Threads.getData(threadID)).prefix || Config['PREFIX'];

        if (senderID == api.getCurrentUserID()) return;
        if (!global.autoban) global.autoban = new Object();
        if (!global.autoban[senderID]) {
            global.autoban[senderID] = {
                timeStart: Date.now(),
                number: 0
            }
        };

        const idbox = event.threadID;
        if (!event.body || event.body.indexOf(prefix) != 0) return;
        if ((global.autoban[senderID].timeStart + 60000) <= Date.now()) {
            global.autoban[senderID] = {
                timeStart: Date.now(),
                number: 0
            }
        } else {
            global.autoban[senderID].number++;
            if (global.autoban[senderID].number >= numberSp) {
                for (let ad of idad) {
                    if (senderID == ad) return;
                }
                const moment = require("moment-timezone");
                const timeDate = moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss | DD/MM/YYYY");
                const dataUser = await Users.getData(senderID);
                const nameUser = dataUser.name || "Noname";
                const namethread = (await Threads.getData(threadID)).name || "Noname";
                const banned = dataUser.banned;
                if (banned.status == true) return;
                var reason = getText("reason")
                    .replace(/\{numberSp}/g, numberSp);
                var timeNow = Date.now();
                banned.status = true;
                banned.reason = reason;
                banned.time = timeDate;
                await Users.setData(senderID, { banned: banned });
                global.autoban[senderID] = {
                    timeStart: timeNow,
                    number: 0
                };
                global.userBanned.push(senderID);
                var formReportPath = `=== Bot Notification ===\n\n» Người vi phạm: ${nameUser}\n» ID: ${senderID}\n» Box: ${namethread}\n» ID box: ${idbox}\n» Lý do: ${reason}\n\nĐã bị ban khỏi hệ thống`;
                var messageLlSend = getText("blockBox")
                    .replace(/\{nameUser}/g, nameUser)
                    .replace(/\{timeUnban}/g, timeUnban)
                    .replace(/\{reason}/g, reason);

                message.reply(messageLlSend);
                for (let ad of idad) {
                    await message.user(formReportPath, ad)
                }
            }
        }
    } catch (e) { }
}