'use strict';
export const config = {
    name: 'pending',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Xem danh sách các nhóm/người dùng đang chờ.',
    enDesc: 'View a list of pending groups/users.',
    category: ['Hệ thống', 'System'],
    usage: 'pending [group] [user] [reply]',
    timestamp: 0
};

export const languages = {
    "vi_VN": {
        "invaildNumber": "%1 không phải là một con số hợp lệ",
        "cancelSuccess": "[ APPROVE ]〉 Đã từ chối thành công %1 nhóm!",
        "notiBox": "[ APPROVE ]〉Box của bạn đã được admin phê duyệt để có thể sử dụng bot",
        "approveSuccess": "Đã phê duyệt thành công %1 nhóm/người dùng!",

        "cantGetPendingList": "Không thể lấy danh sách các nhóm đang chờ!",
        "returnListUser": "「PENDING」❮ Tổng số nhóm cần duyệt: %1 người dùng ❯\n\n%2",
        "returnListThread": "「PENDING」❮ Tổng số nhóm cần duyệt: %1 nhóm ❯\n\n%2",
        "returnListPending": "「PENDING」❮ Tổng số nhóm cần duyệt: %1 nhóm và %2 người dùng ❯\n\n%3",
        "returnListClean": "「PENDING」Hiện tại không có nhóm nào trong hàng chờ",

        "Erorr": "Có lỗi xảy ra: %1"
    },
    "en_US": {
        "invaildNumber": "%1 is not an invalid number",
        "cancelSuccess": "Refused %1 thread!",
        "notiBox": "Your box has been approved to use bot",
        "approveSuccess": "Approved successfully %1 threads/user!",

        "cantGetPendingList": "Can't get the pending list!",
        "returnListPending": "「PENDING」❮ The whole number of threads to approve is: %1 thread and user %2 ❯\n\n%3",
        "returnListClean": "「PENDING」There is no thread in the pending list",
        
        "Erorr": "Error: %1"
    }
}

export async function onMessage({ event, api, args, getText }) {
    const { threadID, messageID } = event;
    var msg = "",
        index = 1;
    if (args[0] == 'thread' || args[0] == "threads" || args[0] == "-t") {
        try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        } catch (e) {
            return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
        }
        const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
        for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

        if (list.length != 0) return api.sendMessage(getText("returnListThread", list.length, msg), threadID, (error, info) => {
            if (info == undefined) { return api.sendMessage('null', threadID) }
             else
                global.client.reply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    pending: list
                })
        }, messageID);
        else return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
    }
    if (args[0] == 'users' || args[0] == "user" || args[0] == "-u") {
        try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        } catch (e) {
            return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
        }
        const list = [...spam, ...pending].filter(group => group.isGroup == false);
        for (const single of list) {
            msg += `${index++}/ ${single.userInfo[0].name || single.name}(${single.threadID})\n`;
        }

        if (list.length != 0) return api.sendMessage(getText("returnListUser", list.length, msg), threadID, (error, info) => {
            if (info == undefined) { return api.sendMessage('null', threadID) } else
                global.client.reply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    pending: list
                })
        }, messageID);
        else return api.sendMessage(getText("returnListClean"), threadID, messageID);
    } else {
        try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        } catch (e) {
            return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
        }
        const listThread = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
        const listUser = [...spam, ...pending].filter(group => group.isGroup == false)
        const list = [...spam, ...pending].filter(group => group.isSubscribed);
        for (const single of list) {
            // console.log(single)
            msg += `${index++}/ ${single.name}(${single.threadID})\n`;
        }

        if (list.length != 0) return api.sendMessage(getText("returnListPending",  listThread.length, listUser.length, msg), threadID, (error, info) => {
            if (info == undefined) { return api.sendMessage('null', threadID) } else
                global.client.reply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    pending: list
                })
        }, messageID);
        else return api.sendMessage(getText("returnListClean"), threadID, messageID);
    }
}

export async function onReply({ event, api, logger, Config, Threads, Users, reply, getText }) {
  if (String(event.senderID) !== String(reply.author)) return;
  const { threadID, messageID } = event;
  const prefix = await Threads.getPrefix(threadID) || Config['PREFIX'];
  
  var count = 0;
    try{
    if (event.body.indexOf("c") == 0 || event.body.indexOf("C") == 0 || event.body.indexOf("cancel") == 0) {
        const index = (event.body.slice(1, event.body.length)).split(/\s+/);

        for (const singleIndex of index) {
            // console.log(singleIndex);
            // await new Promise(resolve => setTimeout(resolve, 1000));
            if (isNaN(singleIndex) || singleIndex <= 0) return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
            await api.removeUserFromGroup(api.getCurrentUserID(), reply.pending[singleIndex - 1].threadID);
            count += 1;
        }
        api.unsendMessage(reply.messageID);
        return api.sendMessage(getText("cancelSuccess", count-1), threadID, messageID);
    } else {
        const index = event.body.split(/\s+/);
        for (const singleIndex of index) {
            console.log(singleIndex);
            if (isNaN(singleIndex) || singleIndex <= 0) return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await api.sendMessage(getText("notiBox"), reply.pending[singleIndex - 1].threadID);
            await api.changeNickname(`[ ${prefix} ] • ${Config.NAME}`, reply.pending[singleIndex - 1].threadID, api.getCurrentUserID());
            count += 1;
        }
        api.unsendMessage(reply.messageID);
        return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
    }}
    catch(err) {
        return api.sendMessage(getText("Erorr", err.message || err.error), threadID, messageID);
    }
}