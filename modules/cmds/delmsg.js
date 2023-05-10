'use strict';
export const config = {
    name: 'delmsg',
    ver: '1.0.0',
    role: 2,
    author: ['Sky'],
    viDesc: 'Xoá tin nhắn người dùng và nhóm message.',
    enDesc: 'Delete user and group message.',
    category: ['Hệ thống', 'System'],
    timestamp: 5
};
export async function onMessage({ event, api, Config, logger, Threads, Users, args }) {
    const ID = parseInt(args[0])
    if (args[0] == "all") {
        return api.getThreadList(100, null, ["INBOX"], (err, list) => {
            if (err) return api.sendMessage("Đã xảy ra lỗi", event.threadID, event.messageID)
            list.forEach(item => (item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
            return api.sendMessage("Xóa thành công tất cả tin nhắn", event.threadID)
        })
    } else if (!args[0]) {
        return api.getThreadList(100, null, ["INBOX"], (err, list) => {
            if (err) return api.sendMessage("Đã xảy ra lỗi", event.threadID, event.messageID)
            list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
            return api.sendMessage("Xóa thành công tất cả tin nhắn nhóm", event.threadID)
        })
    } else {
        api.deleteThread(ID, (err) => {
            if (err) return api.sendMessage("Đã xảy ra lỗi", event.threadID, event.messageID)
            return api.sendMessage("Xóa thành công tin nhắn với ID: " + ID, event.threadID)
        })
    }
}