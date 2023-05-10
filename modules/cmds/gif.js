export const config = {
    name: 'gif',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Random ảnh gif.',
    enDesc: 'Random imgs gif',
    category: ["random-img", "random-img"],
    usages: '',
    timestamp: 5
};

import request from 'request'
import fs from 'fs'

var __dirname = process.cwd() + '/modules/cmds';
export async function onMessage({ event, api, args }) {
    var { threadID, messageID } = event;
    var key = "73YIAOY3ACT1";
    if (!args[0]) return api.sendMessage("Không thể tìm thấy thẻ bạn đã nhập!", threadID, messageID);
    return request(`https://api.tenor.com/v1/random?key=${key}&q=${args[0]}&limit=1`, (err, response, body) => {
        if (err) throw err;
        var string = JSON.parse(body);
        var stringURL = string.results[0].media[0].tinygif.url;
        request(stringURL).pipe(fs.createWriteStream(process.cwd() + `/caches/gif.gif`)).on("close", () => api.sendMessage({ attachment: fs.createReadStream(process.cwd() + "/caches/gif.gif") }, threadID, () => fs.unlinkSync(process.cwd() + "/caches/gif.gif"), messageID));
    });
}