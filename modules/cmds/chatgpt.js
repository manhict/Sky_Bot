/**
* @author SKy - manhG
* @SKyBot Do not edit code or edit credits
*/

import fetch from 'node-fetch';
import cheerio from 'cheerio';

export const config = {
    name: 'chatgpt',
    version: '1.0.0',
    role: '0',
    author: ['manhG'],
    category: ['Giải trí', 'Media'],
    viDesc: 'Chat với GPT',
    enDesc: 'Chat with GPT',
    usage: '',
    timestamp: 5
}

export const languages = {
    "vi_VN": {
        "on": "〉Bật",
        "off": "〉Tắt",
        "successText": "thành công event chat GPT!",
    },
    "en_US": {
        "on": "〉On",
        "off": "〉Off",
        "successText": "success event chat GPT!",
    }
}

async function getGPT(keyword, language) {
    try {
        language = language || 'vi'; keyword = keyword || 'hello';
        const response = await fetch('https://gptgo.ai/?q=' + keyword + '&hl=en&hlgpt=' + language).then(r => r.text());
        let token = response.split(/"/).find($ => /^eyJ/.test($));
        const rawData = await fetch('https://gptgo.ai/action_ai_gpt.php?token=' + token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ token: token })
        }).then(res => res.text());
        let content = rawData.split(/data\: /).filter($ => /^\{"i/.test($)).map($ => $ = JSON.parse($.replace(/\n\n$/, ''))).map($ => $.choices[0].delta.content || '').join('');
        return content;
    } catch (error) {
        console.log(error.stack)
    }
}

async function simsimi(text, language) {
    try {
        const data = await getGPT(text, language);
        return { error: !1, data }
    } catch (p) {
        return { error: !0, data: {} }
    }
}
export async function onLoad() {
    "undefined" == typeof global.manhG && (global.manhG = {}), "undefined" == typeof global.manhG.chatGPT && (global.manhG.chatGPT = new Map);
};
export async function onEvent({ api, event }) {
    const { threadID, messageID, senderID, body } = event, g = (senderID) => api.sendMessage(senderID, threadID, messageID);
    if (body && body.endsWith("?")) {
        if (body == "?") return;
        if (senderID == api.getCurrentUserID() || "" == body || messageID == global.manhG.chatGPT.get(threadID)) return;
        var { data, error } = await simsimi(body);
        return !0 == error ? void 0 : !1 == data ? g(data.error) : g(data)
    }
    else if (global.manhG.chatGPT.has(threadID)) {
        if (senderID == api.getCurrentUserID() || "" == body || messageID == global.manhG.chatGPT.get(threadID)) return;
        var { data, error } = await simsimi(body);
        return !0 == error ? void 0 : !1 == data ? g(data.error) : g(data)
    }
}
export async function onMessage({ api, event, args }) {
    const { threadID, messageID } = event, body = (args) => api.sendMessage(args, threadID, messageID);
    if (0 == args.length) return body("Bạn chưa nhập tin nhắn");
    switch (args[0]) {
        case "on":
            return global.manhG.chatGPT.has(threadID) ? body("Bật rồi má ơi!.") : (global.manhG.chatGPT.set(threadID, messageID), body("Bật chat AI thành công."));
        case "off":
            return global.manhG.chatGPT.has(threadID) ? (global.manhG.chatGPT.delete(threadID), body("Tắt chat AI thành công.")) : body("Tao đang phấn khởi tắt cái qq.");
        default:
            var { data, error } = await simsimi(args.join(" "));
            return !0 == data ? void 0 : !1 == data ? body(data.error) : body(data);
    }
};
