"use strict";

export const config = {
    name: 'linkword',
    role: 0,
    version: '1.0.0',
    author: ['manhG'],
    viDesc: 'Chơi nối từ với bot hoặc thành viên trong nhóm.',
    enDesc: 'Play linkword with bot or member in group.',
    category: ['Game', 'Game'],
    usages: '',
    timestamp: 5
};

export function onLoad() {
    if (typeof global.moduleData == "undefined") global.moduleData = new Object();
    if (typeof global.moduleData.noitu == "undefined") global.moduleData.noitu = new Map();
}
export async function onEvent({ api, event, args }) {
    if (typeof global.moduleData.noitu == "undefined") return;
    if (event.senderID == api.getCurrentUserID()) return;
    const { body: word, threadID, messageID } = event;

    if (global.moduleData.noitu.has(threadID)) {
        if (word && word.split(" ").length == 2) {
            var data = await api.gameLinkword(word);
            //console.log(data)
            try {
                if(data.error) {
                    global.moduleData.noitu.delete(threadID);
                    return api.sendMessage(data.error, threadID, messageID)
                }
                else
                    api.sendMessage(data.text, threadID, messageID)
            } catch (error) {
                console.error(error)
            }
        }
    }
}
export function onMessage({ api, event }) {
    const { threadID, messageID } = event;
    if (!global.moduleData.noitu.has(threadID)) {
        global.moduleData.noitu.set(threadID);
        return api.sendMessage("Đã bật nối từ", threadID, messageID);
    } else {
        global.moduleData.noitu.delete(threadID);
        return api.sendMessage("Đã tắt nối từ", threadID, messageID);
    }
}
