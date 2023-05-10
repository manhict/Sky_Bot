export const config = {
    name: "antiout",
    version: "1.0.0",
    role: 1,
    author: "Sky",
    viDesc: "Tự động add lại thành viên out chùa | Không chắc chắn là add lại được tất cả.",
    enDesc: "Automatically add back members who left the temple | Not sure if it adds back all.",
    category: ['Quản trị nhóm', 'Group management'],
    usages: "",
    timestamp: 5
};

import { writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const path = resolve(process.cwd(), 'caches', 'antiout.json');

export const languages = {
    "vi_VN": {
        "antioutOn": "Đã bật chế độ tự động add lại thành viên out chùa.",
        "antioutOff": "Đã tắt chế độ tự động add lại thành viên out chùa."
    },
    "en_VN": {
        "antioutOn": "Add back members who left the temple.",
        "antioutOff": "Remove back members who left the temple."
    }
}

export function onLoad() {
    if (!existsSync(path)) {
        const obj = {
            antiout: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('antiout')) data.antiout = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}

export async function onMessage({ api, event, getText }) {
    const { threadID, messageID } = event;
    const database = require(path);
    const { antiout } = database;
    if (antiout[threadID] == true) {
        antiout[threadID] = false;
        api.sendMessage(getText('antioutOff'), threadID, messageID);
    } else {
        antiout[threadID] = true;
        api.sendMessage(getText('antioutOn'), threadID, messageID);
    }
    writeFileSync(path, JSON.stringify(database, null, 4));
}