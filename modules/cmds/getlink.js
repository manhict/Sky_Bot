'use strict';

export const config = {
    name: 'getlink',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Lấy url download từ video, audio được gửi từ nhóm.',
    enDesc: 'Get download link from video, audio in group.',
    category: ["Tiện ích", "Utility"],
    usage: '<short + url> or default',
    packages: ['bitly'],
    timestamp: 0
}
export const languages = {
    "vi_VN": {
        "validatReply": "❌ Bạn phải reply một audio, video, ảnh nào đó",
        "validatOneReply": "❌ Bạn chỉ được reply một audio, video, ảnh"
    },
    "en_US": {
        "validatReply": "❌ You must reply to a certain audio, video, or photo",
        "validatOneReply": "❌ You can only reply to one audio, video, or photo"
    }
}

import { BitlyClient } from 'bitly';
export async function onMessage({ event, api, args, getText }) {
    const bitly = new BitlyClient('150ef1bc3af86500796d645c86f56766e4802566');
    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    switch (args[1]) {
        case "shorten":
        case "short":
        case "s": {
            if (!regex.test(args[2])) return api.sendMessage("Must be a shortened url!", event.threadID);
            if (args[2].indexOf("http" || "https") === -1) args[2] = "https://" + args[2];
            const res = await bitly.shorten(args[2]);
            return api.sendMessage("" + res.id, event.threadID, event.messageID);
        }
        default: {
            if (event.type !== "message_reply") return api.sendMessage(getText("validatReply"), event.threadID, event.messageID);
            if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage(getText("validatReply"), event.threadID, event.messageID);
            if (event.messageReply.attachments.length > 1) return api.sendMessage(getText("validatOneReply"), event.threadID, event.messageID);
            return api.sendMessage(event.messageReply.attachments[0].url, event.threadID, event.messageID);
        }
    }
}
