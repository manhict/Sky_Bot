'use strict';
export const config = {
    name: 'rules',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tạo/xem/thêm/chỉnh sửa/xóa các quy tắc nhóm của bạn.',
    enDesc: 'Create/view/add/edit/delete your group rules.',
    category: ['Quản trị nhóm', 'Group management'],
    usage: '[create/view/add/edit/delete] [content]',
    timestamp: 5
}

import * as fs from "fs";
import axios from "axios";

export async function onMessage({ event, api, Config, logger, Threads, Users, args }) {
    const { senderID, threadID, messageID } = event;
    const prefix = (await Threads.getData(event.threadID)).prefix || Config['PREFIX'];
    var idAD = [];
    var threadInfo = await api.getThreadInfo(event.threadID);
    var adminIDs = threadInfo.adminIDs;
    for (let i = 0; i < adminIDs.length; i++) {
        idAD.push(adminIDs[i].id);
    }
    const listAdmin = Config.ADMIN.find(item => item == event.senderID);
    const listQTV = idAD.find(item => item == event.senderID);
    var type = args[0];
    var dataOfThread = (await Threads.getData(threadID)).data;
    if (!dataOfThread.rules) {
        dataOfThread.rules = [];
        await Threads.setData(threadID, { data: dataOfThread })
    }
    var rulesOfThread = dataOfThread.rules || [];
    var guide = `Use:\n
  1/ ${prefix}rules: xem nội quy của nhóm
  2/ ${prefix}rules [add | -a] <nội quy muốn thêm>: thêm nội quy cho nhóm
  3/ ${prefix}rules [edit | -e] <n> <nội dung sau khi sửa>: chỉnh sửa lại nội quy thứ n
  4/ ${prefix}rules [delete | -d] <n>: xóa nội quy theo số thứ tự thứ n
  5/ ${prefix}rules [remove | -r]: xóa tất cả nội quy của nhóm
  \n- Ví dụ:
  + ${prefix}rules add không spam
  + ${prefix}rules -e 1 không spam tin nhắn trong nhóm
  + ${prefix}rules -r`;
    if (!type) {
        var msg = "";
        var i = 1;
        for (let rules of rulesOfThread) {
            msg += `${i++}. ${rules}\n`;
        }
        api.sendMessage({ body: msg || "Nhóm này chưa tạo bất kỳ nội quy nào" }, threadID, messageID);
    } else if (type == "help") {
        api.sendMessage(guide, threadID, messageID);
    } else if (type == "add" || type == "-a") {
        if (!listQTV && !listAdmin) return api.sendMessage(`» [QTV] Bạn không có quyền sử dụng lệnh "rules add".`, threadID);
        if (!args[1]) return api.sendMessage(`Syntax error!`, threadID, messageID);
        rulesOfThread.push(args.slice(1).join(" "));
        await Threads.setData(threadID, { data: dataOfThread }, (err) => {
            if (err) return console.log(err);
            api.sendMessage(`Đã thêm nội quy mới cho nhóm`, threadID, messageID);
        });
    } else if (type == "delete" || type == "del") {
        if (!listQTV && !listAdmin) return api.sendMessage(`» [QTV] Bạn không có quyền sử dụng lệnh "rules delete".`, threadID);

        function number(x) {
            if (isNaN(x)) {
                return 'Not a Number!';
            }
            return (x < 1 || x > 1000);
        }
        if (!args[1] || number(args[1])) return api.sendMessage(`Đầu vào phải là chữ số`, threadID, messageID);
        rulesOfThread.splice(args[1] - 1, 1);
        await Threads.setData(threadID, { data: dataOfThread }, (err) => {
            if (err) return console.log(err);
            api.sendMessage(`Đã xóa nội quy thứ ${args[1]} của nhóm`, threadID, messageID);
        })
    } else if (type == "remove" || type == "-r") {
        if (!listQTV && !listAdmin) return api.sendMessage(`» [QTV] Bạn không có quyền sử dụng lệnh "rules remove".`, threadID);
        rulesOfThread = [];
        await Threads.setData(threadID, { data: rulesOfThread }, (err) => {
            if (err) return console.log(err);
            api.sendMessage(`Đã xóa toàn bộ nội quy của nhóm`, threadID, messageID);
        })
    }
}