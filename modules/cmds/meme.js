export const config = {
    name: "meme",
    version: "1.0.0",
    role: 0,
    author: ['Sky'],
    viDesc: "Random ảnh chế :D",
    enDesc: "Random ảnh chế :D",
    category: ["random-img", "random-img"],
    usages: "",
    timestamp: 1
};

import { createReadStream, unlinkSync } from 'fs'
import request from 'request'
import { join } from 'path'

const path = join(process.cwd(), "caches", `${Date.now()}-meme.jpg`);

export async function onMessage({ event, api }) {
    return request("https://nguyenmanh.name.vn/api/meme?apikey=pre_manhnk", async (err, response, body) => {
        if (err) throw err;
        var content = JSON.parse(body);
        await global.utils.downloadFile(content.result.url, path);
        api.sendMessage({ body: content.title, attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path), event.messageID);
    });
}
