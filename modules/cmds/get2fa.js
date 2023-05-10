'use strict';
export const config = {
    name: 'get2fa',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Lấy mã 2fa cho bạn',
    enDesc: 'Get 2fa code for you',
    category: ['Tiện ích', 'Utility'],
    usages: "[2FA CODE]",
    timestamps: 5
}

export const languages = {
    "vi_vn": {
        "2facode": "Mã xác thực của bạn là: %1\nMã sẽ mất hiệu lực sau 10 phút - không cần thông báo thêm.\nXin vui lòng không trao cho ai"
    },
    "en_us": {
        "2facode": "Your 2FA code is: %1\nThe code will be expired in 10 minutes - no need to notify.\nPlease do not give it to anyone"
    }
}

import axios from 'axios'

export async function onMessage({ api, event, args, getText }) {
    try {
        let code = args.join(" ");
        const res = await axios.get(`https://2fa.live/tok/${code}`);
        var codee = res.data.token;
        return api.sendMessage(getText('2facode', codee), event.threadID, event.messageID)
    } catch (error) {
        console.log(error);
    }
}