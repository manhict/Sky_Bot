'use strict';
export const config = {
    name: 'facebook',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    category: ['Giải trí', 'Media'],
    viDesc: 'Tải xuống video bằng liên kết Facebook.',
    enDesc: 'Download video by Facebook link.',
    usages: 'url',
    timestamp: 5,
    packages: ["fs"]
};
import * as fs from 'fs';
var rdPath = `fb_` + Math.floor(Date.now());
export async function onMessage({ event, args, social, message, api }) {
    var path = client.dirMain + `/caches/${rdPath}.mp4`;
    const linkurl = (args.join(" ")).trim();
    if(linkurl == '') return;
    try {
        const data = await api.facebookDL(linkurl);
        message.reply(`Getting info...`, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 10000));
        // if (data.error) return message.reply(data.error);
        // console.log(data)
        let linkHD = data.hd,
            linkSD = data.sd,
            title = data.title
        if (linkHD == '') {
            await global.utils.downloadFileHttps(linkSD, path);
            await message.send({
                body: title,
                attachment: fs.createReadStream(path)
            });
            return await fs.unlinkSync(path)
        } else if (linkHD != '') {
            await global.utils.downloadFileHttps(linkHD, path);
            await message.send({
                body: title,
                attachment: fs.createReadStream(path)
            })
            return await fs.unlinkSync(path)
        }
    } catch (err) {
        return message.reply(err.message)
    }
}
