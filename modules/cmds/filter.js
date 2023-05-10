'use strict';
export const config = {
    name: 'filter',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Bộ lọc tin nhắn nhóm.',
    enDesc: 'Filter message group.',
    category: ['Quản trị nhóm', 'Group management'],
    timestamps: 5
}

import { existsSync, writeFileSync } from 'fs'
import { createRequire } from "module"
const require = createRequire(import.meta.url)

const pathFilter = process.cwd() + "/caches/filterWord.json";

export async function onEvent({ event, api }) {
    const { body } = event;
    if (!body || !existsSync(pathFilter)) return;
    const dataFilter = require(pathFilter);
    for (let word of dataFilter) {
        if (body.toLowerCase().indexOf(word.key) != -1) {
            return api.sendMessage(word.value[Math.floor(Math.random() * word.value.length)], event.threadID, event.messageID);
        }
    }
};

export async function onMessage({ event, api, args }) {
    if (!existsSync(pathFilter)) writeFileSync(pathFilter, "[]");
    const dataFilter = require(pathFilter);

    if (args[0] == "del") {
        const wordDelete = args[1];
        if (!wordDelete) return api.sendMessage("Bạn chưa nhập từ cần xóa", event.threadID, event.messageID);
        const indexOfFilter = dataFilter.findIndex(item => item.value == wordDelete);
        dataFilter.splice(indexOfFilter, 1);
        api.sendMessage(`Đã xóa từ khóa filter ${wordDelete}`, event.threadID, event.messageID);
    } else if (["list", "all"].includes(args[0])) {
        if (dataFilter.length == 0) return api.sendMessage("Chưa có từ filter nào", event.threadID, event.messageID);
        var msg = "";
        for (let item of dataFilter) {
            msg += `• Key: ${item.key}\n• Reply: ${item.value.join(" | ")}\n`;
            return api.sendMessage(msg, event.threadID, event.messageID);
        }
    } else {
        if (!args[0] || !args.join(" ").includes("=>")) return api.sendMessage(`filter <word> => <câu trả lời>: dùng để thêm từ filter: muốn random thì điền theo form <câu trả lời 1 | câu trả lời 2...> hoặc add lại nhiều lần\nfilter del <word>: để xóa cụm filter\nfilter list hoặc filter all: xem danh sách filter`, event.threadID, event.messageID);
        const content = args.join(" ").split("=>");
        if (!content[0] || !content[1]) return api.sendMessage(`filter <word> => <câu trả lời>: dùng để thêm từ filter: muốn random thì điền theo form <câu trả lời 1 | câu trả lời 2...> hoặc add lại nhiều lần\nfilter del <word>: để xóa cụm filter\nfilter list hoặc filter all: xem danh sách filter`, event.threadID, event.messageID);
        const key = content[0].toLowerCase().trim();
        var value = content.slice(1).join("=>").split("|");
        value = value.map(item => item = item.trim());
        if (!dataFilter.some(item => item.key == key)) dataFilter.push({ key, value: [] });
        const data = dataFilter.find(item => item.key == key);
        data.value = [...data.value, ...value];
        const indexOfFilter = dataFilter.findIndex(item => item.value == value);
        dataFilter[indexOfFilter] = data;
        api.sendMessage(`Đã thêm từ khóa filer "${key}" với ${value.length > 1 ? "những" : ""} câu trả lời ${value.length > 1 ? "random" : ""}\n- ${value.join("\n- ")}`, event.threadID, event.messageID);
    }

    writeFileSync(pathFilter, JSON.stringify(dataFilter, null, 2));
};
