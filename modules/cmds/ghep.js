export const config = {
    name: "ghep",
    version: "1.0.0",
    role: 0,
    author: ["sky"],
    viDesc: 'Ghép đôi ngẫu nhiên với 1 thành viên trong nhóm.',
    enDesc: "Randomly pair with a member in the group.",
    category: ["Nhóm chat", "Group"],
    usages: "",
    timestamp: 5
}

import request from 'request'
import axios from 'axios'
import fs from 'fs'

var __dirname = process.cwd() + '/modules/cmds';
export async function onMessage({ event, api, Config, logger, Threads, Users, args }) {
    var tle = Math.floor(Math.random() * 50) + 50
    var dataUsernamee = await Users.getData(event.senderID),
        namee = dataUsernamee.name,
        gender = dataUsernamee.gender;
    const botID = api.getCurrentUserID();
    const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
    var id = listUserID[Math.floor(Math.random() * listUserID.length)];
    var dataUser2, name, gender2;
    dataUser2 = await Users.getData(id);
    name = dataUser2.name;
    gender2 = dataUser2.gender;
    if (gender == gender2 || gender2 == undefined) return api.sendMessage("» Không thể tìm thấy tình yêu của bạn", event.threadID, event.messageID);
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    try {
        var Avatar = `https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=${Config.accessToken}`;
        await new Promise(resolve => setTimeout(resolve, 3000))
        var Avatar2 = `https://graph.facebook.com/${id}/picture?height=1500&width=1500&access_token=${Config.accessToken}`;
    } catch (e) {
        console.log(e.stack)
    }
    if (!Avatar) return api.sendMessage("Bạn Ế đi ", event.threadID, event.messageID)
    if (!Avatar2) return api.sendMessage("Bạn vẫn còn Ế dài dài nhé ", event.threadID, event.messageID)

    const getms = (await axios.get(Avatar, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + "/caches/1.png", Buffer.from(getms, "utf-8"));
    const getms2 = (await axios.get(Avatar2, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + "/caches/2.png", Buffer.from(getms2, "utf-8"));

    var imglove = [];
    var arraytag = [];
    arraytag.push({ id: event.senderID, tag: namee });
    arraytag.push({ id: id, tag: name });

    imglove.push(fs.createReadStream(process.cwd() + "/caches/1.png"));
    imglove.push(fs.createReadStream(process.cwd() + "/caches/2.png"));
    var msg = { body: `Ghép đôi thành công!\nTỷ lệ hợp nhau: ${tle}%\n` + namee + " " + "💓" + " " + name, mentions: arraytag, attachment: imglove }
    api.sendMessage(msg, event.threadID, event.messageID);
    return;
}