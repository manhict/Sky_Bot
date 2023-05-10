'use strict';

import axios from 'axios';
import rq from 'request';
import fs from 'fs';

export const config = {
    name: 'download',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'download <link> || download <path> <link>.',
    enDesc: 'Download file from link.',
    category: ["Tiện ích", "Utility"],
    usages: '',
    timestamp: 5
};

export const languages = {
    "vi_VN": {
        "help": "Bạn có thể dùng:\ndownload <link>\n hoặc\ndownload <path> <link>",
        "download": "Đang tải file...",
        "downloaded": "Đã tải xong file!, được lưu tại: %1",
        "error": "Đã có lỗi xảy ra!"
    },
    "en_US": {
        "help": "You can use:\ndownload <link>\n or\ndownload <path> <link>",
        "download": "Downloading file...",
        "downloaded": "Downloaded file!, saved at: %1",
        "error": "An error has occurred!"
    }
};

export async function onMessage({ message, event, getText, args }) {
    if (args.length == 0) return message.reply(getText('help'));
    if (!args[1]) {
        var path = process.cwd() + '/caches/';
        var link = args.slice(0).join("");
    } else {
        var path = process.cwd() + '/caches/' + args[0];
        var link = args.slice(1).join("");
    };
    try {
        var format = rq.get(link);
        var namefile = format.uri.pathname;
        var path = path + '/' + (namefile.slice(namefile.lastIndexOf("/") + 1));
        let getimg = (await axios.get(link, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(path, Buffer.from(getimg, "utf-8"));
        return message.reply(getText('downloaded', path));
    } catch (error) {
        return message.reply(getText('error'));
    }
}