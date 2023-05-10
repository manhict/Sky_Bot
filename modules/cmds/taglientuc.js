'use strict';
export const config = {
    name: 'taglientuc',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tag liên tục người bạn muốn gọi hồn.',
    enDesc: 'Auto tag people you want to call.',
    category: ['Nhóm chat', 'Group'],
    usages: '@tag Hi 1 5',
    timestamp: 0
}

import { createRequire } from "module"
const require = createRequire(import.meta.url)

export async function onMessage({ api, args, Users, event }) {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    const { mentions, threadID, messageID } = event;

    function reply(body) {
        api.sendMessage(body, threadID, messageID);
    }

    let solantag = args[args.length - 2];
    let time = args[args.length - 1]; // khoảng cách mỗi lần tag
        time = time * 1000;

    if (["stop", "clear"].includes(args[0])) {
        clearTimeout(time);
        time = 0;
        solantag = 0;
        return reply("done");
    }
    // Check syntax
    if (Object.keys(mentions) == 0 && args[0] != "stop") return reply("Vui lòng tag người bạn muốn gọi hồn");
    if ((!solantag || !time) && args[0] != "stop") reply("Sai cú pháp !!!\n\nHD: taglientuc @tag Hi 1 5");
    if (isNaN(solantag) && args[0] != "stop") return reply("Số lần tag phải là một con số\n\nHD: taglientuc @tag Hi 10 2");
    if (isNaN(time) && args[0] != "stop") return reply("Thời gian giữa mỗi lần tag phải là một con số");
    
    const target = Object.keys(mentions)[0];
    let name = (mentions[target]).replace(/@/g, "");
    var mentionsTag = [];
    mentionsTag.push({
        id: target,
        tag: name
    })
    
    reply(`Chuẩn bị gọi hồn...`);
    var noidungtag = args.slice(2, args.length - 2).join(" ");
    for (let i = 0; i < solantag; i++) {
        await delay(time);
        api.sendMessage({
            body: '' + name + ' ' + noidungtag,
            mentions: mentionsTag
        }, threadID);
    };
}