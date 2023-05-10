'use strict';

export const config = {
    name: 'getcookie',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Lấy cookies của bạn từ appstate',
    enDesc: 'Get cookies for you from appstate',
    category: ['Tiện ích', 'Utility'],
    usages: "[appstate]",
    timestamps: 5
}

export async function onMessage({ api, event, message, body }) {
    let appstate = await api.getCookies();
    const validItems = ["sb", "datr", "c_user", "xs"]
    if (appstate.includes("sb") && appstate.includes("c_user") && appstate.includes("xs")) {
        let cookies = appstate.split("; ");
        let cookie = "";
        for (let i = 0; i < cookies.length; i++) {
            let item = cookies[i].split("=");
            if (validItems.includes(item[0])) {
                cookie += `${item[0]}=${item[1]};`;
            }
        }
        console.log(cookie);
        return api.sendMessage(cookie, event.threadID);
    }
}
