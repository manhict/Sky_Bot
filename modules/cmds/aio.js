/**
* @author SKy - manhG
* @SKyBot Do not edit code or edit credits
*/

import fetch from 'node-fetch';
import fs from 'fs';

export const config = {
    name: 'aio',
    version: '1.0.0',
    role: 0,
    author: ['manhG'],
    category: ["Tiện ích", "Utility"],
    viDesc: 'Download...all in one',
    enDesc: "Download...all in one",
    usages: '',
    timestamp: 5
}

export const languages = {
    "vi_VN": {
        "validateUrl": "- Lỗi, không hỗ trợ link này",
        "success": "- Thành công, đang tải..."
    },
    "en_US": {
        "validateUrl": "- Error, please try again later",
        "success": "- Success, downloading..."
    }
}

var pathMp4 = process.cwd() + '/caches/aio_' + Date.now() + '.mp4';
var pathMp3 = process.cwd() + '/caches/aio_' + Date.now() + '.mp3';

async function getData(URL, apikey) {
    const dataJson = await fetch("https://manhict.up.railway.app/api/autolink", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: URL,
            apikey: apikey,
        })
    }).then(res => res.json());
    return dataJson;
}

async function getLinkMp3(URL, webapi, apikey, message) {
    try {
        const dataJson = await getData(URL, apikey);
        let dataFormat = null;
        for (let i = 0; i < dataJson.medias.length; i++) {
            const arrMedia = dataJson.medias[i];
            if (arrMedia.extension == 'mp3') {
                dataFormat = arrMedia;
                break;
            }
        }
        let title = dataJson.title;
        let audio = dataFormat.url;
        await global.utils.downloadFile(audio, pathMp3)
        await message.send({ body: title, attachment: fs.createReadStream(pathMp3) })
        await fs.unlinkSync(pathMp3);
    } catch (error) {
        return message.reply(error.message);
    }
}

async function getLinkMp4(URL, webapi, apikey, message) {
    try {
        const dataJson = await getData(URL, apikey);
        let dataFormat = null;
        for (let i = 0; i < dataJson.medias.length; i++) {
            const arrMedia = dataJson.medias[i];
            if (arrMedia.extension == 'mp4') {
                if (['hd', 'HD', 'no_watermark', 'hd_no_watermark', '360p'].includes(arrMedia.quality)) {
                    var urlMedia = arrMedia.url;
                    const checkLive = await fetch(urlMedia);
                    if (checkLive.status == 200) {
                        dataFormat = arrMedia;
                    }
                    else continue;
                }
                if (['hd', 'HD'].includes(arrMedia.subname) && dataFormat == null) {
                    dataFormat = arrMedia;
                }
                if (['sd', 'SD', 'watermark'].includes(arrMedia.quality) && dataFormat == null) {
                    dataFormat = arrMedia;
                }
                if (arrMedia.extension == 'mp4' && dataFormat == null) {
                    const checkLive = await fetch(arrMedia.url);
                    if (checkLive.status == 200) {
                        dataFormat = arrMedia;
                    }
                    else continue;
                }
            }
        }
        let title = dataJson.title;
        let video = dataFormat.url;

        await global.utils.downloadFile(video, pathMp4);
        if (fs.statSync(pathMp4).size / 1024 / 1024 > 25) {
            let audio = body.result.music.play_url;
            await global.utils.downloadFile(audio, pathMp3);
            await message.send({ body: title, attachment: fs.createReadStream(pathMp3) });
            await fs.unlinkSync(pathMp4);
            return await fs.unlinkSync(pathMp3);
        }
        else
            await message.send({ body: title, attachment: fs.createReadStream(pathMp4) });
        await fs.unlinkSync(pathMp4);
    } catch (error) {
        return message.send(error.message);
    }
}

function getLinkImg(URL, webapi, apikey, message) {
    sky.dl(URL)
}

function checkLink(URLinput, webapi, apikey, message, getText) {
    const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    const found = (URLinput).match(regex);
    const urlRegex = String(found);
    if (isUrlValid(urlRegex)) {
        client.logger.log(urlRegex, 'URLinput');
        var arrCheckMp4 = ["douyin.", "tiktok.", "instagram.", "facebook.", "fb.", "youtube.", "youtu.", "kuaishou.", "twitter."]
        var arrCheckMp3 = ["soundcloud.", "spotify.", "zingmp3."]
        var arrExt = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mp3', '.3gp', '.avi', '.wmv', '.mov', '.webm', '.mpg', '.mpeg', '.html', '.xml']
        if (arrCheckMp4.some(data => urlRegex.includes(data))) {
            return getLinkMp4(urlRegex, webapi, apikey, message);
        }
        else if (arrCheckMp3.some(data => urlRegex.includes(data))) {
            return getLinkMp3(urlRegex, webapi, apikey, message);
        }
        else if (arrExt.some(ext => urlRegex.includes(ext))) {
            return getLinkImg(urlRegex, webapi, apikey, message);
        }
        else return message.send(getText("validateUrl"));
    }
}

function isUrlValid(link) {
    var res = link.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
        return !1;
    else return !0
}

export async function onMessage({ message, getText, Config, args, event }) {
    const webapi = Config['WEBAPI'], apikey = Config['APIKEY'];
    if (!event.body || event.body == null) return;
    await checkLink(event.body, webapi, apikey, message, getText);
}
