'use strict';

export const config = {
    name: 'sim',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Trò chuyện với simsimi dễ thương nhất.',
    enDesc: 'Chat with simsimi',
    category: ['Nhóm chat', 'Group'],
    usages: '',
    timestamp: 0
};

import fetch from 'node-fetch';

async function simsimi(a, b, c) {
    const g = (a) => encodeURIComponent(a);
    try {
        var data = await fetch({ url: `http://nguyenmanh.name.vn/api/sim?type=ask&ask=${g(a)}`, method: "GET" }).then(r => r.json()).then(r => r)
        return { error: !1, data }
    } catch (p) {
        return { error: !0, data: {} }
    }
}
export async function onLoad() {
    "undefined" == typeof global.manhG && (global.manhG = {}), "undefined" == typeof global.manhG.simsimi && (global.manhG.simsimi = new Map);
};
export async function onEvent({ api, event }) {
    const { threadID, messageID, senderID, body } = event, g = (senderID) => api.sendMessage(senderID, threadID, messageID);
    if (global.manhG.simsimi.has(threadID)) {
        if (senderID == api.getCurrentUserID() || "" == body || messageID == global.manhG.simsimi.get(threadID)) return;
        var { data, error } = await simsimi(body, api, event);
        return !0 == error ? void 0 : !1 == data.answer ? g(data.error) : g(data.answer)
    }
}
export async function onMessage({ api, event, args }) {
    const { threadID, messageID } = event, body = (args) => api.sendMessage(args, threadID, messageID);
    if (0 == args.length) return body("Bạn chưa nhập tin nhắn");
    switch (args[0]) {
        case "on":
            return global.manhG.simsimi.has(threadID) ? body("Bật gì tận 2 lần hả em.") : (global.manhG.simsimi.set(threadID, messageID), body("Bật sim thành công."));
        case "off":
            return global.manhG.simsimi.has(threadID) ? (global.manhG.simsimi.delete(threadID), body("Tắt sim thành công.")) : body("Tao đang phấn khởi tắt cái qq.");
        default:
            var { data, error } = await simsimi(args.join(" "), api, event);
            return !0 == data ? void 0 : !1 == data.answer ? body(data.error) : body(data.answer);
    }
};