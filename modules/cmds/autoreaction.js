'use strict';

export const config = {
    name: 'autoreaction',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Auto thả cảm xúc vào tin nhắn',
    enDesc: 'Auto reaction to message',
    category: ['Hỗ trợ', 'Support'],
    usages: '',
    timestamp: 5
}

export const languages = {
    "vi_VN": {
        "on": "〉Bật",
        "off": "〉Tắt",
        "successText": "thành công event tự động thả reaction"
    },
    "en_US": {
        "on": "〉On",
        "off": "〉Off",
        "successText": "success event auto reaction"
    }
}

export async function onEvent({ event, api, Threads }) {
    const { data } = await Threads.getData(event.threadID) || global.data.allThreadData[event.threadID] || {};
    if (data && data['autoDownload'] != true) return;
    if (event.senderID == api.getCurrentUserID()) return;
    if (!event.body || event.type == "message_reaction") return;

    setTimeout(() => {
        if (['Khùng', 'Ngáo', 'điên'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('👀', event.messageID, false, true);
        if (['Haha', 'Cười', 'Hihi', '😂', '🤣', ':))', ':>', '=))', 'Vui', '((:', 'Zui', 'Cay', 'Dỗi'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('😆', event.messageID, false, true);
        if (['Oh', 'Đù', 'Ghê', 'Vip', 'Chê', 'Dữ', 'Á'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('😮', event.messageID, false, true);
        if (['Ngon', 'Mlem', 'Gái ngon', 'Gái'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('🤤', event.messageID, false, true);
        if (['Box', 'Nhóm', 'checktt', 'Top'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('🤓', event.messageID, false, true);
        if (['Cc', 'Cl', 'Lồn', 'Cặc', 'Clm', 'Clmm', 'Sợ', 'Lol', 'Ngu', 'Ncc', 'Ncl', 'Non', 'Gà'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('😹', event.messageID, false, true);
        if (['Yêu', 'Thưn', 'Thương', 'Hun', 'Hôn'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('❤️', event.messageID, false, true);
        if (['Khóc', 'Buồn', 'Bùn', 'Chán', ':((', ':<', '😭', '😢', ')):', 'Haiz', 'Nghèo', 'Huhu'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('😢', event.messageID, false, true);
        if (['Mn', 'Alo', 'Hú', 'Ê', 'Báo'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('🤔', event.messageID, false, true);
        if (['Lêu', 'Jztr', 'Gì',].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('😛', event.messageID, false, true);
        if (['Bủh', 'ping', 'Thiểu năng', 'Lmao', 'Dảk', 'Hề', ':v'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('🤡', event.messageID, false, true);
        if (['Hello', 'Hi', 'Chào', 'Hù', 'Xin chào', '✌️', 'Hí'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('🖕', event.messageID, false, true);
        if (['Bye', 'Pp', 'Tạm biệt', 'Off'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('👋', event.messageID, false, true);
        if (['Ngủ', 'Ngủ ngon', 'Đi ngủ'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('😴', event.messageID, false, true);
        if (['😏', 'Chảnh', 'Nhếch', 'Tuổi', '-.-'].some(i => event.body ? event.body.includes(i) : '')) return api.setMessageReaction('😼', event.messageID, false, true);
    }, 15000);
}

export async function onMessage({ event, message, getText, Threads }) {
    let { data } = (await Threads.getData(event.threadID)) || {};
    if (typeof data["autoReaction"] == "undefined" || data["autoReaction"] == true) data["autoReaction"] = false;
    else data["autoReaction"] = true;
    await Threads.setData(event.threadID, { data });
    return message.send(`${(data["autoReaction"] == false) ? getText("off") : getText("on")} ${getText("successText")}`);
}
