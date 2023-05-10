export const config = {
    name: "info",
    version: "1.0.0",
    role: 0,
    author: ["sky"],
    viDesc: "Tìm kiếm thông tin nhóm, người dùng",
    enDesc: "Search user, thread",
    category: ["Nhóm chat", "Group"],
    usages: "",
    timestamp: 5
}

import request from 'request'
import axios from 'axios'
import fs from 'fs'

var __dirname = process.cwd() + '/modules/cmds';
export async function onMessage({ event, api, Config, Threads, Users, args }) {
    const { senderID, threadID, messageID } = event;
    var prefix = (await Threads.getData(threadID)).prefix || Config['PREFIX'];
    switch (args[0]) {
        case "thread":
        case "-t":
        case "-b":
        case "box":
            {
                if (threadID == senderID) return api.sendMessage('TID không tồn tại!', threadID, messageID);
                var threadInfo, img, pathAva;
                if (args[1]) {
                    // var dataThread = await Threads.getData(args[1]);
                    try {
                        threadInfo = await api.getThreadInfo(args[1]);
                    } catch (error) {
                        return console.log(error.stack);
                    }
                    var gendernam = [];
                    var gendernu = [];
                    for (let z in threadInfo.userInfo) {
                        var gioitinhone = threadInfo.userInfo[z].gender;
                        if (gioitinhone == "MALE") {
                            gendernam.push(gioitinhone)
                        } else {
                            gendernu.push(gioitinhone)
                        }
                    };
                    try {
                        img = (await axios.get(encodeURI(`${threadInfo.imageSrc}`), { responseType: "arraybuffer" })).data;
                        pathAva = process.cwd() + `/caches/${senderID}-info.png`;
                        fs.writeFileSync(pathAva, Buffer.from(img, "utf-8"));
                    } catch (error) {
                        return console.log(error.stack);
                    }
                    var nam = gendernam.length;
                    var nu = gendernu.length;
                    let sex = threadInfo.approvalMode;
                    var pd = sex == false ? "tắt" : sex == true ? "bật" : "Kh";
                    if (img) {
                        return api.sendMessage({ body: `=== InFo Box ===\n\n❄️ Tên nhóm: ${threadInfo.threadName}\n🧩 TID: ${threadID}\n🦋 Phê duyệt: ${pd}\n💸 Emoji: ${threadInfo.emoji}\n🍳 Thông tin: \n👻 ${event.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n🤷‍♀️ Gồm ${nam} nam và ${nu} nữ.\n📩 Tổng số tin nhắn: ${threadInfo.messageCount}.`, attachment: fs.createReadStream(pathAva) }, threadID, () => fs.unlinkSync(pathAva), messageID);
                    } else { return api.sendMessage(`=== InFo Box ===\n\n❄️ Tên nhóm: ${threadInfo.threadName}\n🧩 TID: ${threadID}\n🦋 Phê duyệt: ${pd}\n💸 Emoji: ${threadInfo.emoji}\n🍳 Thông tin: \n🤨 Có ${event.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n🤷‍♀️ Gồm ${nam} nam và ${nu} nữ.\n📩 Tổng số tin nhắn: ${threadInfo.messageCount}.`, threadID, messageID) }
                }
                try {
                    threadInfo = await api.getThreadInfo(threadID);
                } catch (error) {
                    return console.log(error.stack);
                }
                var gendernam = [];
                var gendernu = [];
                for (let z in threadInfo.userInfo) {
                    var gioitinhone = threadInfo.userInfo[z].gender;
                    if (gioitinhone == "MALE") {
                        gendernam.push(gioitinhone)
                    } else {
                        gendernu.push(gioitinhone)
                    }
                };

                try {
                    img = (await axios.get(encodeURI(`${threadInfo.imageSrc}`), { responseType: "arraybuffer" })).data;
                    pathAva = process.cwd() + `/caches/${senderID}-info.png`;
                    fs.writeFileSync(pathAva, Buffer.from(img, "utf-8"));
                } catch (error) {
                    return console.log(error.stack);
                }
                var nam = gendernam.length;
                var nu = gendernu.length;
                let sex = threadInfo.approvalMode;
                var pd = sex == false ? "tắt" : sex == true ? "bật" : "Kh";
                if (img) {
                    return api.sendMessage({ body: `=== InFo Box ===\n\n❄️ Tên nhóm: ${threadInfo.threadName}\n🧩 TID: ${threadID}\n🦋 Phê duyệt: ${pd}\n💸 Emoji: ${threadInfo.emoji}\n🍳 Thông tin: \n👻 ${event.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n🤷‍♀️ Gồm ${nam} nam và ${nu} nữ.\n📩 Tổng số tin nhắn: ${threadInfo.messageCount}.`, attachment: fs.createReadStream(pathAva) }, threadID, () => fs.unlinkSync(pathAva), messageID);
                } else { return api.sendMessage(`=== InFo Box ===\n\n❄️ Tên nhóm: ${threadInfo.threadName}\n🧩 TID: ${threadID}\n🦋 Phê duyệt: ${pd}\n💸 Emoji: ${threadInfo.emoji}\n🍳 Thông tin: \n🤨 Có ${event.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n🤷‍♀️ Gồm ${nam} nam và ${nu} nữ.\n📩 Tổng số tin nhắn: ${threadInfo.messageCount}.`, threadID, messageID) }
            }
        case "-u":
        case "u":
        case "user":
            {
                try {
                    if (!args[1]) {
                        var id;
                        if (event.type == "message_reply") { id = event.messageReply.senderID } else id = senderID;
                        var dataUser = await Users.getData(id);
                        let name = dataUser.name;
                        let url = dataUser.profileUrl;
                        let vanity = dataUser.vanity;
                        let type = dataUser.type;
                        type == "friend" ? type = `có` : type = `không`;
                        var gender = dataUser.gender;
                        gender == "MALE" ? gender = `Nam` : gender == "FEMALE" ? gender = `Nữ` : gender = `Trần Đức Bo`;
                        let money = dataUser.money;
                        let exp = dataUser.exp;
                        let banned = (dataUser.banned).status;
                        banned == "true" ? banned = `có` : banned = `không`;
                        var callback = () => api.sendMessage({ body: `=== InFo User ===\n\n💦Tên: ${name}` + `\n🏝URL cá nhân: ${url}` + `\n🪐 Username: ${vanity}\n🦋Giới tính: ${gender}\n🙇‍♂️ Kết bạn với bot: ${type}.\n💌 Số tin nhắn: ${exp}.\n🤑 Số tiền: ${money} đô.\n☠️ Bị ban bot: ${banned}.`, attachment: fs.createReadStream(process.cwd() + `/caches/${senderID}-info.png`) }, threadID, () => fs.unlinkSync(process.cwd() + `/caches/${senderID}-info.png`), messageID);
                        var avatar = dataUser.avatar;
                        request(encodeURI(`${avatar}`)).pipe(fs.createWriteStream(process.cwd() + `/caches/${senderID}-info.png`)).on('close', () => callback());
                        return;
                    } else {
                        if (args.join().indexOf('@') !== -1) {
                            var mentions = Object.keys(event.mentions)
                            var dataUser = await Users.getData(mentions);
                            let name = dataUser.name;
                            let url = dataUser.profileUrl;
                            let vanity = dataUser.vanity;
                            let type = dataUser.type;
                            type == "friend" ? type = `có` : type = `không`;
                            var gender = dataUser.gender;
                            gender == "MALE" ? gender = `Nam` : gender == "FEMALE" ? gender = `Nữ` : gender = `Trần Đức Bo`;
                            let money = dataUser.money;
                            let exp = dataUser.exp;
                            let banned = (dataUser.banned).status;
                            banned == "true" ? banned = `có` : banned = `không`;
                            var callback = () => api.sendMessage({
                                body: `=== InFo User ===\n\n💦Tên: ${name}` + `\n🏝URL cá nhân: ${url}` + `\n🪐 Username: ${vanity}\n🦋Giới tính: ${gender}\n🙇‍♂️ Kết bạn với bot: ${type}.\n💌 Số tin nhắn: ${exp}.\n🤑 Số tiền: ${money} đô.\n☠️ Bị ban bot: ${banned}.`,
                                attachment: fs.createReadStream(process.cwd() + `/caches/${senderID}-info.png`)
                            }, threadID, () => fs.unlinkSync(process.cwd() + `/caches/${senderID}-info.png`), messageID);
                            var avatar = dataUser.avatar;
                            request(encodeURI(`${avatar}`)).pipe(fs.createWriteStream(process.cwd() + `/caches/${senderID}-info.png`)).on('close', () => callback());
                            return;
                        } else {
                            var dataUser = await Users.getData(args[1]);
                            if (!dataUser) return api.sendMessage('ID không tồn tại trong CSDL!', threadID, messageID)
                            let name = dataUser.name;
                            let url = dataUser.profileUrl;
                            let vanity = dataUser.vanity;
                            let type = dataUser.type;
                            type == "friend" ? type = `có` : type = `không`;
                            var gender = dataUser.gender;
                            gender == "MALE" ? gender = `Nam` : gender == "FEMALE" ? gender = `Nữ` : gender = `Trần Đức Bo`;
                            let money = dataUser.money;
                            let exp = dataUser.exp;
                            let banned = (dataUser.banned).status;
                            banned == "true" ? banned = `có` : banned = `không`;
                            var callback = () => api.sendMessage({
                                body: `=== InFo User ===\n\n💦Tên: ${name}` + `\n🏝URL cá nhân: ${url}` + `\n🪐 Username: ${vanity}\n🦋Giới tính: ${gender}\n🙇‍♂️ Kết bạn với bot: ${type}.\n💌 Số tin nhắn: ${exp}.\n🤑 Số tiền: ${money} đô.\n☠️ Bị ban bot: ${banned}.`,
                                attachment: fs.createReadStream(process.cwd() + `/caches/${senderID}-info.png`)
                            }, threadID, () => fs.unlinkSync(process.cwd() + `/caches/${senderID}-info.png`), messageID);
                            var avatar = dataUser.avatar;
                            request(encodeURI(`${avatar}`)).pipe(fs.createWriteStream(process.cwd() + `/caches/${senderID}-info.png`)).on('close', () => callback());
                            return;
                        }
                    }
                } catch (error) {
                    return api.sendMessage(error.stack, threadID, messageID)
                }
            }

        default:
            {
                return api.sendMessage(`Bạn có thể dùng:\n1. ${prefix}info user => nó sẽ lấy thông tin của chính bạn.\n2. ${prefix}info user @[Tag] => nó sẽ lấy thông tin người bạn tag.\n3. ${prefix}info box => nó sẽ lấy thông tin box của bạn (số thành viên, số tin nhắn,...)\n4. ${prefix}info user box [uid || tid] => Tìm kiếm thông tin nhóm/người dùng bằng ID`, threadID, messageID);
            }
    }
}