'use strict';
export const config = {
    name: 'update',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Làm mới dữ liệu',
    enDesc: 'Refresh data',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '[thread/user]',
    timestamp: 0
};
export async function onMessage({ event, api, args, Threads, Users }) {
    const { threadID, messageID, senderID } = event;
    if (args[0] == 'thread' && !args[1]) {
        await Threads.refreshInfo(threadID);
        return api.sendMessage('Done.', threadID, messageID);
    } else if (args[0] == 'thread' && args[1]) {
        await Threads.refreshInfo(args[1]);
        return api.sendMessage('Done.', threadID, messageID);
    }
    if (args[0] == 'user' && !args[1]) {
        if (event.type == 'message_reply') {
            await Users.refreshInfo(event.messageReply.senderID);
            return api.sendMessage('Done.', threadID, messageID);
        } else {
            await Users.refreshInfo(senderID);
            return api.sendMessage('Done.', threadID, messageID);
        }
    } else if (Object.keys(event.mentions).length >= 0) {
        for (var i of Object.keys(event.mentions)) {
            await Users.refreshInfo(i);
        }
        return api.sendMessage('Done.', threadID, messageID);
    }
}