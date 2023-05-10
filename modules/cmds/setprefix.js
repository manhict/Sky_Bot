'use strict';
export const config = {
    name: 'setprefix',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Đổi Prefix bot!',
    enDesc: 'Change Prefix bot!',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '',
    timestamp: 5
}

export const languages = {
    "vi_VN": {
        "successChange": "〉Đã chuyển đổi prefix của nhóm thành: %1",
        "missingInput": "〉Phần prefix cần đặt không được để trống",
        "resetPrefix": "〉Đã reset prefix về mặc định: %1",
        "confirmChange": "〉Bạn có chắc bạn muốn đổi prefix của nhóm thành: %1",
        "prefixThread": "🍄 prefix hiện tại: %1"
    },
    "en_US": {
        "successChange": "〉Changed prefix into: %1",
        "missingInput": "〉Prefix have not to be blank",
        "resetPrefix": "〉Reset prefix to: %1",
        "confirmChange": "〉Are you sure that you want to change prefix into: %1",
        "prefixThread": "🍄 prefix is: %1"
    }
}

export async function onEvent({ event, api, Config, args, Threads, Users, getText }) {
    var { threadID, messageID, body, senderID, isGroup } = event;
    if (senderID == api.getCurrentUserID() && isGroup && isNaN(senderID) && isNaN(threadID)) return;

    function out(data) {
        api.sendMessage(data, threadID, messageID)
    }
    var dataThread = await Threads.getData(threadID);
    let prefix = dataThread.prefix || global.client.config['PREFIX'];

    var arr = ["mpre", "mprefix", "prefix", "dấu lệnh", "daulenh"];
    arr.forEach(i => {
        let str = i[0].toUpperCase() + i.slice(1);
        if (body === i.toUpperCase() | body === i | str === body) {
            return out(getText("prefixThread", prefix));
        }
    });
}

export async function onReaction({ api, event, Threads, reaction, getText }) {
    try {
        if (event.userID != reaction.author) return;
        const { threadID, messageID } = event;
        const data = reaction.PREFIX;
        await Threads.setPrefix(threadID, data);
        api.changeNickname(client.config.NAME, threadID, api.getCurrentUserID());
        api.unsendMessage(reaction.messageID);
        return api.sendMessage(getText("successChange", reaction.PREFIX), threadID, messageID);
    } catch (e) { return console.log(e) }
}

export async function onMessage({ api, event, args, Threads, getText }) {
    if (typeof args[0] == "undefined") return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
    let prefix = args[0].trim();
    if (!prefix) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
    if (prefix == "reset" || prefix == "default") {
        const data = global.client.config.PREFIX;
        await Threads.setPrefix(event.threadID, data);
        return api.sendMessage(getText("resetPrefix", global.client.config.PREFIX), event.threadID, event.messageID);
    } else return api.sendMessage(getText("confirmChange", prefix), event.threadID, (error, info) => {
        global.client.reaction.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            PREFIX: prefix
        })
    })
}