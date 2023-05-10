'use strict';
export const config = {
    name: 'blink',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tạo 1 gif avt các thành viên được tag.',
    enDesc: 'Create a gif avt of the tagged members.',
    category: ['Edit Card', 'Edit Card'],
    usages: "[delay mentions/all delay]",
    timestamp: 5
};

import axios from "axios";
import * as fs from 'fs'

export const languages = {
    "vi_VN":{
        "validateInput": "〉Vui lòng tag các thành viên muốn tạo gif cùng hoặc sử dụng %1blink all"
    },
    "en_US":{
        "validateInput": "〉Please tag members who want to make gif with or use %1blink all"
    }
}

var pathName = process.cwd() + "/caches/"+ "blink_" + Date.now() + ".gif";
export async function onMessage({ event, api, args, Config, Threads, getText }) {
    const webApi = Config['WEBAPI'], apikey = Config['APIKEY'];
    const mprefix = (await Threads.getData(event.threadID)).prefix || Config['PREFIX'];
    let mention = Object.keys(event.mentions);
    let delay = args[0], daylayAll = args[1];
    let blink = [], listID = [];
    try {
        if (args[0] == 'all') {
            var participant = event.participantIDs.length
            for (var i = 0; i < participant; i++) {
                var id = event.participantIDs[i]
                listID += id + ','
            }
            let getAPI = (await axios.get((`${webApi}blink?id=${listID + ','}&delay=${parseInt(daylayAll) || 500}&apikey=${apikey}`), { responseType: "arraybuffer" })).data;
            fs.writeFileSync(pathName, Buffer.from(getAPI, "utf-8"));
            blink.push(fs.createReadStream(pathName));
            var msg = { attachment: blink }
            return api.sendMessage(msg, event.threadID, event.messageID)
        } else {
            if (mention.length === 0) return api.sendMessage(getText("validateInput", mprefix), event.threadID, event.messageID);
            var mentions = mention.length
            for (var i = 0; i < mentions; i++) {
                var id = mention[i]
                listID += id + ','
            }
            let getAPI = (await axios.get((`${webApi}blink?id=${listID + ',' + event.senderID}&delay=${parseInt(delay) || 500}&apikey=${apikey}`), { responseType: "arraybuffer" })).data;
            fs.writeFileSync(pathName, Buffer.from(getAPI, "utf-8"));
            blink.push(fs.createReadStream(pathName));
            var msg = { attachment: blink }
            await api.sendMessage(msg, event.threadID, event.messageID);
            return fs.unlinkSync(pathName);
        }
    } catch (error) {
        // console.error(error.stack || error);
        return api.sendMessage(error.message || error.stack, event.threadID, event.messageID)
    }
}
