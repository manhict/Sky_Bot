'use strict';
export const config = {
    name: 'fbsearch',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tìm kiếm người dùng facebook thông qua các từ khóa.',
    enDesc: 'Search user facebook by keywords.',
    category: ['Tìm kiếm', 'Search'],
    usages: '',
    timestamp: 0
};
export async function onMessage({ event, api, args }) {
    let type = args.join(" ");
    if (!type) return api.sendMessage("» Vui lòng nhập một từ khóa", event.threadID, event.messageID);
    api.getUserID(`${type}`, (err, data) => {
        if (err) return api.sendMessage(err, event.threadID, event.messageID);
        var msg = [],
            i = 1;
        for (let id in data) {
            var userID = data[id].userID;
            var name = data[id].name;
            var type = data[id].type;
            var pro5 = data[id].profileUrl;
            msg += `${i++}/ ${name}\n» ID: ${userID}\n» Type: ${type.charAt(0).toUpperCase() + type.slice(1)}\n» Link: ${pro5}\n\n`
        }
        return api.sendMessage(`» SEARCH WITH SAME KEYWORDS\n\n` + msg, event.threadID, event.messageID);
    });
}