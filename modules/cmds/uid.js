'use strict';
export const config = {
    name: 'uid',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Lấy ID người dùng bằng cách reply hoặc tag.',
    enDesc: 'Get user ID by reply or tag.',
    category: ['Tìm kiếm', 'Search'],
    usages: '',
    timestamp: 0
};

export async function onMessage({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    if (event.type == "message_reply") {
        let uid = event.messageReply.senderID
        return api.sendMessage(`${uid}`, threadID, messageID)
    }
    if (!args[0]) {
        return api.sendMessage(senderID, threadID, messageID);
    } else {
        if (args[0].indexOf(".com/") !== -1) {
            const res_ID = await api.findUID(args[0]);
            return api.sendMessage(`${res_ID}`, threadID, messageID)
        } else {
            for (var i = 0; i < Object.keys(event.mentions).length; i++)
                api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, threadID);
            return;
        }
    }
}