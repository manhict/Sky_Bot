export const config= {
    name: "rankup",
    version: "1.0.1",
    role: 1,
    author: "Sky",
    viDesc: "Thông báo rankup cho từng nhóm, người dùng",
    enDesc: 'Notify rankup for each group, user',
    category: ['Nhóm chat', 'Group'],
    usages: '',
    timestamp: 3,
    envConfig: {
        autoUnsend: true,
        unsendMessageAfter: 5
    }
};

import { createReadStream, existsSync, mkdirSync } from 'fs'

var pathGif = process.cwd() + '/caches/rankup_'+ Date.now() +'.gif';
export async function onEvent({ api, event, Users, Threads, getText }) {
    let { threadID, senderID } = event;
    const thread = (await Threads.getData(threadID)).data || {};
    if (senderID == api.getCurrentUserID()) return;

    let userData = (await Users.getData(senderID));
    if (userData == undefined) return;
    let exp = userData.exp;

    if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
        await Users.setData(senderID, { exp: parseInt(exp) + 1 });
        return;
    };

    const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
    const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

    if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false | level > curLevel && level != 1) {
        const name = await Users.getName(senderID);
        var messsage = (typeof thread.customRankup == "undefined") ? getText("levelup") : thread.customRankup,
            arrayContent;

        messsage = messsage
            .replace(/\{name}/g, name)
            .replace(/\{level}/g, level);

        if (existsSync(process.cwd() + '/caches/')) mkdirSync(process.cwd() + '/caches/', { recursive: true });
        if (existsSync(pathGif)) arrayContent = { body: messsage, attachment: createReadStream(pathGif), mentions: [{ tag: name, id: senderID }] };
        else arrayContent = { body: messsage, mentions: [{ tag: name, id: senderID }] };
        const moduleName = this.config.name;
        api.sendMessage(arrayContent, threadID, async function(error, info) {
            if (client.envConfig.envCommands[moduleName].autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, client.envConfig.envCommands[moduleName].unsendMessageAfter * 1000));
                return api.unsendMessage(info.messageID);
            } else return;
        });
    }

    await Users.setData(senderID, { exp: parseInt(exp) + 1 });
    return;
}

export const languages = {
    "vi_VN": {
        "on": "bật",
        "off": "tắt",
        "successText": "thành công thông báo rankup!",
        "levelup": "Trình độ chém gió của {name} đã đạt tới level {level}"
    },
    "en_US": {
        "on": "on",
        "off": "off",
        "successText": "success notification rankup!",
        "levelup": "{name}, your keyboard hero level has reached level {level}",
    }
}

export async function onMessage({ api, event, Threads, getText }) {
    const { threadID, messageID } = event;
    let data = (await Threads.getData(threadID)).data;

    if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
    else data["rankup"] = false;

    await Threads.setData(threadID, { data });
    return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}