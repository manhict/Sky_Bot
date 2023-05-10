export const config = {
    name: "shortcut",
    version: "1.0.0",
    role: 1,
    author: "Sky",
    viDesc: "Shortcut thread",
    enDesc: 'Shortcut thread',
    category: ["Quản trị nhóm", "Group management"],
    usages: "[all/delete/empty]",
    timestamp: 5
}

export const languages = {
    "vi_VN": {
        "misingKeyword": "「Shortcut」từ khóa nhận diện không được để trống!",
        "shortcutExist": "「Shortcut」Input đã tồn tại từ trước!",
        "requestResponse": "「Shortcut」Reply tin nhắn này để nhập câu trả lời khi sử dụng từ khóa",
        "addSuccess": "「Shortcut」Đã thêm thành công shortcut mới, dươi đây là phần tổng quát:\n- ID:%1\n- Input: %2\n- Output: %3",
        "listShortcutNull": "「Shortcut」hiện tại nhóm của bạn chưa có shortcut nào được set!",
        "removeSuccess": "「Shortcut」Đã xóa thành công!",
        "returnListShortcut": "「Shortcut」Dưới đây là toàn bộ shortcut nhóm có:\n[stt]/ [Input] => [Output]\n\n%1",
        "requestKeyword": "「Shortcut」Reply tin nhắn này để nhập từ khóa cho shortcut"
    },
    "en_US": {
        "misingKeyword": "「Shortcut」Keyword must not be blank!",
        "shortcutExist": "「Shortcut」Input has already existed!",
        "requestResponse": "「Shortcut」Reply this message to import the answer when use keyword",
        "addSuccess": "「Shortcut」Added new shortcut, here is result:\n- ID:%1\n- Input: %2\n- Output: %3",
        "listShortcutNull": "「Shortcut」Your thread have no shortcut!",
        "removeSuccess": "「Shortcut」Removed shortcut!",
        "returnListShortcut": "「Shortcut」These are shortcuts of this thread:\n[stt]/ [Input] => [Output]\n\n%1",
        "requestKeyword": "「Shortcut」Reply this message to import keyword for shortcut"
    }
}

import { existsSync, writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
var path = resolve(process.cwd(), "caches", "shortcutdata.json");

export function onLoad() {
    try {
        if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
        if (!existsSync(path)) writeFileSync(path, JSON.stringify([]), "utf-8");
        const data = JSON.parse(readFileSync(path, "utf-8"));
        if (typeof global.moduleData.shortcut == "undefined") global.moduleData.shortcut = new Map();
        for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
    } catch (e) { console.log(e) }
    return;
}

export async function onEvent({ event, api }) {
    const { threadID, messageID, body } = event;
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!global.moduleData.shortcut.has(threadID)) return;
    const data = global.moduleData.shortcut.get(threadID);

    if (data.some(item => item.input == body)) {
        const dataThread = data.find(item => item.input == body);
        return api.sendMessage(dataThread.output, threadID, messageID);
    }
}

export async function onReply({ event, api, reply, getText }) {
    if (reply.author != event.senderID) return;
    const { threadID, messageID, senderID, body } = event;
    const name = this.config.name;

    switch (reply.type) {
        case "requireInput":
            {
                if (body.length == 0) return api.sendMessage(getText("misingKeyword"), threadID, messageID);
                const data = global.moduleData.shortcut.get(threadID) || [];
                if (data.some(item => item.input == body)) return api.sendMessage(getText("shortcutExist"), threadID, messageID);
                api.unsendMessage(reply.messageID);
                return api.sendMessage(getText("requestResponse"), threadID, function (error, info) {
                    return client.reply.push({
                        type: "final",
                        name,
                        author: senderID,
                        messageID: info.messageID,
                        input: body
                    });
                }, messageID);
            }
        case "final":
            {
                const id = global.utils.randomString(10);
                const readData = readFileSync(path, "utf-8");
                var data = JSON.parse(readData);
                var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
                var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
                const object = { id, input: reply.input, output: body || "empty" };

                dataThread.shortcuts.push(object);
                dataGlobal.push(object);

                if (!data.some(item => item.threadID == threadID)) data.push(dataThread);
                else {
                    const index = data.indexOf(data.find(item => item.threadID == threadID));
                    data[index] = dataThread;
                }

                global.moduleData.shortcut.set(threadID, dataGlobal);
                writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

                return api.sendMessage(getText("addSuccess", id, reply.input, body || "empty"), threadID, messageID);
            }
    }
}

export function onMessage({ event, api, args, getText }) {
    const { threadID, messageID, senderID } = event;
    const name = this.config.name;

    switch (args[0]) {
        case "remove":
        case "delete":
        case "del":
        case "-d":
            {
                const readData = readFileSync(path, "utf-8");
                var data = JSON.parse(readData);
                const indexData = data.findIndex(item => item.threadID == threadID);
                if (indexData == -1) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);
                var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
                var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
                var indexNeedRemove;

                if (dataThread.shortcuts.length == 0) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);

                if (isNaN(args[1])) indexNeedRemove = args[1];
                else indexNeedRemove = dataThread.shortcuts.findIndex(item => item.input == (args.slice(1, args.length)).join(" ") || item.id == (args.slice(1, args.length)).join(" "));

                dataThread.shortcuts.splice(indexNeedRemove, 1);
                dataGlobal.splice(indexNeedRemove, 1);

                global.moduleData.shortcut.set(threadID, dataGlobal);
                data[indexData] = dataThread;
                writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

                return api.sendMessage(getText("removeSuccess"), threadID, messageID);
            }

        case "list":
        case "all":
        case "-a":
            {
                const data = global.moduleData.shortcut.get(threadID) || [];
                var array = [];
                if (data.length == 0) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);
                else {
                    var n = 1;
                    for (const single of data) array.push(`${n++}/ ${single.input} => ${single.output}`);
                    return api.sendMessage(getText("returnListShortcut", array.join("\n")), threadID, messageID);
                }
            }

        default:
            {
                return api.sendMessage(getText("requestKeyword"), threadID, function (error, info) {
                    return client.reply.push({
                        type: "requireInput",
                        name,
                        author: senderID,
                        messageID: info.messageID
                    });
                }, messageID);
            }
    }
}