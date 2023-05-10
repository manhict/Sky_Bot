'use strict';

import fetch from 'node-fetch';

export const config = {
    name: 'slink',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Lấy url rút gọn, download từ video, audio được gửi từ nhóm.',
    enDesc: 'Get short url, download from video, audio sent from group.',
    category: ["Tiện ích", "Utility"],
    usages: '',
    timestamp: 5
};
export const languages = {
    "vi_VN": {
        "replyLink": "❌ Bạn phải reply một audio, video, ảnh nào đó"
    },
    "en_US": {
        "replyLink": "❌ You must reply to an audio, video, image"
    }
};
export async function onMessage({ event, api, getText }) {
    const { WEBAPI, APIKEY } = global.client.config;
    const { messageReply, threadID } = event;
    if (event.type !== "message_reply") return api.sendMessage(getText('replyLink'), threadID);
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage(getText('replyLink'), threadID);
    let url = `${WEBAPI}shortlink?url=${messageReply.attachments[0].url}&apikey=${APIKEY}`;
    fetch(url, { method: "GET" })
        .then(res => res.json())
        .then(data => {
            if (data.status != 200) return api.sendMessage(data.message, threadID);
            api.sendMessage(data.result, threadID);
        })
        .catch(err => api.sendMessage(err.message, threadID));
}