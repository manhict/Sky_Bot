'use strict';
export const config = {
    name: 'thread',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Quản lý ban nhóm.',
    enDesc: 'Manage group.',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '<option>',
    timestamp: 0
}

import { writeFileSync, readFileSync } from "fs";

export async function onMessage({ event, api, message, Threads, args, getText }) {
    const { threadID, senderID, messageID, mentions } = event;
    const { brotherList } = global.client;
    const configBrother = process.cwd() + '/config/configBrother.json';
    const listThread = brotherList.threadID || [];
    const idThread = args.slice(1, args.length);
    const type = args[0];

    if (["ol", "listonly", "onlylist", "allonly"].includes(type)) {
        if (brotherList.status == false) {
            brotherList.status = true;
            api.sendMessage("» [BOX ALL] Bật chế độ chỉ nhóm nhóm được duyệt mới có thể sử dụng bot.", threadID, messageID);
        } else {
            brotherList.status = false;
            api.sendMessage("» [BOX ALL] Tắt chế độ chỉ nhóm được duyệt mới có thể sử dụng bot.", threadID, messageID);
        }
        writeFileSync(configBrother, JSON.stringify(brotherList, null, 4), 'utf8');
    }

    if (["add"].includes(type)) {
        if (event.threadID && !args[1]) {
            if (listThread.indexOf(event.threadID) != -1)
                return api.sendMessage('» TID đã tồn tại từ trước :v !!!', threadID, messageID)
            var idBox = event.threadID;
            brotherList.threadID.push(idBox);
            const name = (await Threads.getData(idBox)).name;
            writeFileSync(configBrother, JSON.stringify(brotherList, null, 4), 'utf8');
            return api.sendMessage(`[ BROTHER LIST ADD ]\n» Tid: ${idBox}\n» Name: ${name}`, threadID, messageID);
        } else if (idThread.length != 0 && !isNaN(idThread[0])) {
            if (listThread.indexOf(idThread[0]) != -1)
                return api.sendMessage('» TID đã tồn tại từ trước !!!', threadID, messageID)
            brotherList.threadID.push(idThread[0]);
            const name = (await Threads.getData(idThread[0])).name;
            writeFileSync(configBrother, JSON.stringify(brotherList, null, 4), 'utf8');
            return api.sendMessage(`[ BROTHER LIST ADD ]\n\n» Tid: ${idThread[0]}\n» Name: ${name}\n`, threadID, messageID);
        } else return api.sendMessage(`» Vui lòng nhập TID cần thêm!!!`, threadID, messageID);
    }
    if (["remove", "rm"].includes(type)) {
        function arrayRemove(arr, value) {
            return arr.filter(function (ele) {
                return ele != value;
            });
        }
        if (!args[1]) {
            if (listThread.indexOf(event.threadID) != -1) {
                var idBox = event.threadID;
                const data = brotherList.threadID.findIndex(i => i.toString() == idBox);
                brotherList.threadID.splice(data, 1);
                const name = (await Threads.getData(idBox)).name;
                writeFileSync(configBrother, JSON.stringify(brotherList, null, 4), 'utf8');
                return api.sendMessage(`[ BROTHER LIST REMOVE ]\n\n» Tid: ${idBox}\n» Name: ${name}\n`, threadID, messageID);
            } else return api.sendMessage('» Không tồn tại TID từ trước !!!', threadID, messageID)
        } else if (idThread.length != 0 && !isNaN(idThread[0])) {
            if (listThread.indexOf(idThread[0]) != -1) {
                const data = brotherList.threadID.findIndex(i => i.toString() == args[1]);
                brotherList.threadID.splice(data, 1);
                const name = (await Threads.getData(idThread[0])).name;
                writeFileSync(configBrother, JSON.stringify(brotherList, null, 4), 'utf8');
                return api.sendMessage(`[ BROTHER LIST REMOVE ]\n\n» Tid: ${idThread[0]}\n» Name: ${name}`, threadID, messageID);
            } else return api.sendMessage('» Không tồn tại TID từ trước !!!', threadID, messageID)
        } else return api.sendMessage(`» Vui lòng nhập TID cần thêm !!!`, threadID, messageID);
    }

    if (["find", "search", "-f", "-s"].includes(type)) {
        var allThread = await Threads.getKey(["id", "name"]);
        var arrayreturn = [];
        var msg = "";
        var length = 0;
        const keyword = args.slice(1).join(" ");
        for (let i in allThread) {
            if (allThread[i].name.toLowerCase().includes(keyword.toLowerCase())) {
                length++;
                msg += `\n╭Name: ${allThread[i].name}\n╰TID: ${allThread[i].id}\n`;
            }
        };
        message.reply(length == 0 ? `❌Không có kết quả tìm kiếm nào phù hợp với từ khóa ${keyword}` : `🔎Có ${length} kết quả phù hợp cho từ khóa "${keyword}":\n${msg}`);
    } else if (["ban", "-b"].includes(type)) {
        var id, reason;
        if (!isNaN(args[1])) {
            id = args[1];
            reason = args.slice(2).join(" ");
        } else {
            id = event.threadID;
            reason = args.slice(1).join(" ");
        };
        if (!reason) return message.reply(`Lý do cấm nhóm không được để trống, vui lòng soạn tin nhắn theo cú pháp thread ban <id> <lý do>`);
        reason = reason.replace(/\s+/g, ' ');

        const dataThread = await Threads.getData(id);
        if (dataThread.id != id) return message.reply(`Nhóm mang id ${id} không tồn tại trong dữ liệu bot`);
        if (dataThread.banned.status == true) return message.reply(`Nhóm mang id ${id} đã bị ban từ trước`);
        const name = dataThread.name;
        const banned = dataThread.banned;
        banned.status = true,
            banned.reason = reason,
            banned.time = global.utils.getTimeZone();
        await Threads.setData(id, {
            banned: banned
        });
        return message.reply(`Đã cấm nhóm mang ID: ${id} | ${name} sử dụng bot với lý do: ${reason}`)
    } else if (["unban", "-u"].includes(type)) {
        var id;
        if (!isNaN(args[1])) {
            id = args[1];
        } else {
            id = event.threadID;
        };
        if (!id) return;
        let dataThread = (await Threads.getData(id.toString()));
        if (dataThread.id != id) return message.reply(`Nhóm mang TID: ${id} không tồn tại trong dữ liệu bot`);
        if (dataThread.banned.status != true) return message.reply(`Nhóm mang TID: ${id} không bị ban từ trước`);
        const name = dataThread.name;
        const banned = dataThread.banned;

        banned.status = false;
        banned.reason = null,
            banned.time = null
        await Threads.setData(id, {
            banned: banned
        });
        message.reply(`Đã bỏ cấm nhóm mang TID: ${id} | ${name}, hiện tại nhóm này có thể sử dụng bot`);
    }
    else client.throwError(this.config.name);
};