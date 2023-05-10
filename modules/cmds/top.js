'use strict';
export const config = {
    name: 'top',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Xem top nói nhiều nhất / nghiêm túc / giàu có nhất.',
    enDesc: 'See the top talker / top talker / top talker',
    category: ['Nhóm chat', 'Group'],
    usage: '',
    timestamp: 5
};
export async function onMessage({ event, api, Config, logger, Threads, Users, args }) {
    const { threadID, messageID } = event;
    var prefix = (await Threads.getData(event.threadID)).prefix || Config['PREFIX'];
    var nameConfig = "top";
    ///////////////////////////////////////////
    //===== Kiểm tra có limit hay không =====//
    if (args[1] && isNaN(args[1]) || parseInt(args[1]) <= 0) return api.sendMessage("Thông tin độ dài list phải là một con số và không dưới 0", event.threadID, event.messageID);
    var option = parseInt(args[1] || 10);
    var data, msg = "";

    ///////////////////////////////////////
    //===== Kiểm tra các trường hợp =====//
    if ((args[0] == "thread") || (args[0] == "-t")) {
        var threadList = [];

        //////////////////////////////////////////////
        //===== Lấy toàn bộ nhóm và số message =====//
        try {
            data = await api.getThreadList(option, null, ["INBOX"]);
        } catch (e) {
            console.log(e);
        }

        for (const thread of data) {
            if (thread.isGroup == true) threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
        }

        /////////////////////////////////////////////////////
        //===== sắp xếp từ cao đến thấp cho từng nhóm =====//
        threadList.sort((a, b) => {
            if (a.messageCount > b.messageCount) return -1;
            if (a.messageCount < b.messageCount) return 1;
        })

        ///////////////////////////////////////////////////////////////
        //===== Bắt đầu lấy danh sách push vào khuôn mẫu trả về =====//
        var i = 0;
        for (const dataThread of threadList) {
            if (i == option) break;
            msg += `${i + 1}. ${(dataThread.threadName) || "No name"} with ${dataThread.messageCount} message\n`;
            i += 1;
        }

        return api.sendMessage(`Top ${threadList.length} nhóm lắm mồm nhất quả đất:\n\n${msg}`, threadID, messageID);

    } else if ((args[0] == "user") || (args[0] == "-u")) {
        var data, msg = "",
            i = 0;

        //////////////////////////////////////////////
        //===== Lấy toàn bộ user và số message =====//
        try {
            data = await Users.getKey(["name", "exp"])
        } catch (e) {
            console.log(e);
        }

        /////////////////////////////////////////////////////
        //===== sắp xếp từ cao đến thấp cho từng user =====//
        data.sort((a, b) => {
            if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
        })

        //////////////////////////////////////////////////////
        //===== Kiểm tra nếu option lớn hơn số user có =====//
        if (data.length < option) option = data.length;

        //////////////////////////////////////////////////
        //===== Lọc và bỏ id của bot ra khỏi data =====//
        const idBot = api.getCurrentUserID();
        data = data.filter(item => item.senderID != idBot);

        ///////////////////////////////////////////////////////////////
        //===== Bắt đầu lấy danh sách push vào khuôn mẫu trả về =====//
        for (const dataUser of data) {
            if (i == option) break;

            msg += `${i + 1}. ${dataUser.name} với ${dataUser.exp} tin nhắn\n`;
            i += 1;
        }

        return api.sendMessage(`Top ${option} người dùng lắm mồm nhất quả đất:\n\n${msg}`, threadID, messageID);
    } else if ((args[0] == "coins") || (args[0] == "-m") || (args[0] == "-c")) {
        var data, msg = "",
            i = 0;

        //////////////////////////////////////////////
        //===== Lấy toàn bộ user và số coin =====//
        try {
            data = await Users.getKey(["name", "money"])
        } catch (e) {
            console.log(e);
        }

        /////////////////////////////////////////////////////
        //===== sắp xếp từ cao đến thấp cho từng user =====//
        data.sort((a, b) => {
            if (a.money > b.money) return -1;
            if (a.money < b.money) return 1;
        })

        //////////////////////////////////////////////////////
        //===== Kiểm tra nếu option lớn hơn số user có =====//
        if (data.length < option) option = data.length;

        //////////////////////////////////////////////////
        //===== Lọc và bỏ id của bot ra khỏi data =====//
        const idBot = api.getCurrentUserID();
        data = data.filter(item => item.userID != idBot);

        ///////////////////////////////////////////////////////////////
        //===== Bắt đầu lấy danh sách push vào khuôn mẫu trả về =====//
        for (const dataUser of data) {
            if (i == option) break;
            msg += `${i + 1}. ${dataUser.name} với ${dataUser.money}$\n`;
            i += 1;
        }

        return api.sendMessage(`Top ${option} người dùng giàu nhất quả đất:\n\n${msg}`, threadID, messageID);
    } else return api.sendMessage(`» Use:\n1. ${prefix}${nameConfig} thread/-t\n2. ${prefix}${nameConfig} user/-u\n3. ${prefix}${nameConfig} coins/-c/-m`, threadID, messageID);
}