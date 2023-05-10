'use strict';
export const config = {
    name: 'warn',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Cảnh báo người dùng!.',
    enDesc: 'Warn user',
    category: ['Quản trị nhóm', 'Group management'],
    usage: '',
    timestamp: 0
};

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const path = resolve(process.cwd() + "/caches/listwarning.json");
export function onLoad() {
    if (!existsSync(path)) writeFileSync(path, JSON.stringify({}), 'utf-8');
    return;
}
export const languages = {
    "vi_VN":{
        "roleUser": "〉Bạn không đủ quyền hạn để có thể sử dụng lệnh này!",
        "countWarning": "〉Số lần cảnh báo của %1 là: %2",
        "resetWarning": "〉Đã reset toàn bộ cảnh báo của nhóm về 0",
        "noWarning": "〉Hiện tại %1 không có bất cứ lời cảnh báo nào!",
        "remainingWarning": "〉Hiện tại %1 còn lại %2 lần cảnh cáo:\n\n%3",

        "addWarning": "〉Đã cảnh báo %1 với lý do: %2, bởi vì đã bị cảnh báo 3 lần nên tài khoản trên đã bị ban",
        "banndeWarning": "〉Tài khoản này đã bị ban vì đã vượt quá số lần cảnh cáo cho phép!",
        "stopWarn": "〉Hiện tại %1 còn %2 cảnh báo!",

        "noReply": "〉Bạn phải reply tin nhắn của người dùng để có thể cảnh cáo!",
        "cantWarnBot": "〉Bạn không thể cảnh cáo bot!",
        "reasonWarn": "〉Bạn chưa nhập lý do cảnh báo!"
    },
    "en_US":{
        "roleUser": "〉You are not authorized to use this command!",
         "countWarning": "〉The number of warnings for %1 is: %2",
         "resetWarning": "〉Reset all group warnings to 0",
         "noWarning": "〉Currently %1 does not have any warnings!",
         "remainingWarning": "〉Currently %1 has %2 remaining warnings:\n\n%3",

         "addWarning": "〉Already warned %1 with reason: %2, because it was warned 3 times, the above account has been banned",
         "banndeWarning": "〉This account has been banned for exceeding the number of warnings allowed!",
         "stopWarn": "〉Currently %1 has %2 warning!",

         "noReply": "〉You must reply to the user's message to be able to strike!",
         "cantWarnBot": "〉You cannot warn bots!",
         "reasonWarn": "〉You have not entered a reason for the warning!"
    }
}
export async function onMessage({ event, api, args, role, Users, getText }) {
    const timeZone = global.utils.getTimeZone();
    const { threadID, messageID, mentions, senderID } = event;
    try {
        const mention = Object.keys(mentions);
        const dataFile = readFileSync(path, "utf-8");
        var warningData = JSON.parse(dataFile);

        switch (args[0]) {
            case "all":
            case "list":
                {
                    if (role != 2 || role != 3) return api.sendMessage(getText("roleUser"), threadID, messageID);
                    var listUser = "";

                    for (const IDUser in warningData) {
                        const name = (await Users.getData(IDUser)).name;
                        listUser += getText("countWarning", name, warningData[IDUser].warningLeft);
                    }
                    if (listUser.length == 0) listUser = getText("noWarning", "user");
                    return api.sendMessage(listUser, threadID, messageID);
                }
            case "reset":
                {
                    writeFileSync(path, JSON.stringify({}), 'utf-8');
                    return api.sendMessage(getText("resetWarn"), threadID, messageID);
                }
            default:{
                if (role != 2) {
                    const data = warningData[args[0] || mention[0] || senderID];
                    const name = (await Users.getData(args[0] || mention[0] || senderID)).name;
                    if (!data) return api.sendMessage(getText("noWarning", name), threadID, messageID);
                    else {
                        var reason = "";
                        for (const n of data.warningReason) reason += `- ${n}\n`;
                        return api.sendMessage(getText("remainingWarning", name, data.warningLeft, reason), threadID, messageID);
                    }
                } else {
                    if (event.type != "message_reply") return api.sendMessage(getText("noReply"), threadID, messageID);
                    if (event.messageReply.senderID == api.getCurrentUserID()) return api.sendMessage(getText("cantWarnBot"), threadID, messageID);
                    if (args.length == 0) return api.sendMessage(getText("reasonWarn"), threadID, messageID);
                    var data = warningData[event.messageReply.senderID] || { "warningLeft": 3, "warningReason": [], "banned": false };
                    if (data.banned) return api.sendMessage(getText("bannedWarn"), threadID, messageID);
                    const name = (await Users.getData(event.messageReply.senderID)).name;
                    data.warningLeft -= 1;
                    data.warningReason.push(args.join(" "));
                    if (data.warningLeft == 0) data.banned = true;
                    warningData[event.messageReply.senderID] = data;
                    writeFileSync(path, JSON.stringify(warningData, null, 4), "utf-8");
                    if (data.banned) {
                        const data = (await Users.getData(event.messageReply.senderID)).banned || {};
                        data.status = true;
                        data.reason = `${args.join(" ")}`;
                        data.time = timeZone;
                        await Users.setData(event.messageReply.senderID, { banned: data });
                    }

                    if(data.warningReason.length == 3) {
                        return api.sendMessage(getText("stopWarn", name, data.warningLeft), threadID, messageID);
                    } else 
                        return api.sendMessage(getText("addWarn", name, args.join(" ")), threadID, messageID);
                }
            }
        }
    } catch (err) {
        return api.sendMessage(err.message || err.error, event.threadID)
    };
}
