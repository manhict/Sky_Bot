'use strict';
export const config = {
    name: 'naughty',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Image Naughty.',
    enDesc: 'Image Naughty.',
    category: ["random-img", "random-img"],
    usages: '',
    timestamp: 5
};

import axios from 'axios';
import fs from 'fs';

var pathImg = process.cwd() + "/caches/" + Date.now() + "_naughty.png";
export async function onMessage({ event, api, args }) {
    try {
        const data = (await axios.get('https://imgs-api.vercel.app/naughty/?apikey=ManhG')).data;
        var link = data.url;
        let img = (await axios.get(link, {
            responseType: "arraybuffer"
        })).data;
        fs.writeFileSync(pathImg, Buffer.from(img, "utf-8"));
        return api.sendMessage({
            attachment: fs.createReadStream(pathImg)
        }, event.threadID,
            (err, info) => {
                fs.unlinkSync(pathImg)
                setTimeout(() => {
                    api.unsendMessage(info.messageID);
                }, 10000)
            }, event.messageID);
    } catch (error) {
        return api.sendMessage("Error, please try again later", event.threadID, event.messageID);
    }
}