'use strict';

export const config = {
    name: 'ms',
    version: '1.0.0',
    role: 2,
    author: ['Sky'],
    category: ['Hệ thống', 'System'],
    usages: '',
    viDesc: 'Kiểm tra ping',
    enDesc: 'Test ping',
    timestamp: 5
}
import moment from "moment-timezone";

export async function onMessage({ event, api, args }) {
    var time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
    const timeStart = Date.now();
    return api.sendMessage('OK !', event.threadID, (err, info) => {
        setTimeout(() => {
            api.sendMessage(`Ping: ${(Date.now() - timeStart)}ms \n(TimeStart: ${time})`, event.threadID, event.messageID);
        }, 200);
    }, event.messageID);
}