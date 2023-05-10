'use strict';
export const config = {
    name: 'box',
    version: '1.0.0',
    role: 4,
    author: ['ManhG'],
    viDesc: 'Quản lý / Xem thông tin về nhóm chat của bạn.',
    enDesc: 'Manage / View information about your group.',
    category: ['Quản trị nhóm', 'Group management'],
    usage: 'box [key][values]',
    timestamp: 5
};

import axios from 'axios';
import { createReadStream, statSync, writeFileSync, readdirSync, unlinkSync } from 'fs'
import path from 'path';
import { createRequire } from "module"
const require = createRequire(import.meta.url)

export const languages = {
    "vi_VN": {
        "default": "» 𝘽𝙖̣𝙣 𝙘𝙤́ 𝙩𝙝𝙚̂̉ 𝙙𝙪̀𝙣𝙜:\n1. {prefix} box emoji [icon]\n2. {prefix} box name [tên box cần đổi]\n3. {prefix} box image [rep một ảnh bất kì cần đặt thành ảnh box]\n4. {prefix} box admin add/remove [reply/tag] => nó sẽ đưa/xoá qtv người được tag\n5. {prefix} box id => Lấy ID nhóm\n6. {prefix} box info => Toàn bộ thông tin của nhóm!\n» 𝙌𝙏𝙑 𝙙𝙪̀𝙣𝙜:\n7. {prefix} box onlyqtv/qtvonly -> QTV BOX ONLY\n» 𝘼𝙙𝙢𝙞𝙣 𝙙𝙪̀𝙣𝙜:\n8. {prefix} box only -> BOX ONLY\n9. {prefix} box listonly -> LIST BOX ONLY\n10. {prefix} box allqtvonly/qtvonlyall -> QTV ALL BOX ONLY",
        "boxInfo": "=== InFo Box ===\n\n❄️ Tên nhóm: %1\n🧩 TID: %2\n🦋 Phê duyệt: %3\n💸 Emoji: %4\n🍳 Thông tin: \n👻 %5 thành viên và %6 quản trị viên.\n🤷‍♀️ Gồm %7 nam và %8 nữ.\n📩 Tổng số tin nhắn: %9.",
        "validateContent": "〉Vui lòng nhập nội dung để thay đổi",
    },
    "en_US": {
        "default": "» You can use:\n1. {prefix} box emoji [icon]\n2. {prefix} box name [box name to change]\n3. {prefix} box image [rep any image need to set to box image]\n4. {prefix} box admin add/remove [reply/tag] => it will put/remove qtv the person tagged\n5. {prefix} box id => Get group ID\n6. { prefix} box info => All group info!\n» 𝙌𝙏𝙑 𝙙𝙪̀𝙣𝙜:\n7. {prefix} box onlyqtv/qtvonly -> QTV BOX ONLY\n» 𝘼𝙙𝙢𝙞𝙣 𝙙𝙪̀𝙣𝙜:\n8. {prefix} box only -> BOX ONLY\n9. {prefix} box listonly -> LIST BOX ONLY\n10. {prefix} box allqtvonly/qtvonlyall -> QTV ALL BOX ONLY",
        "boxInfo": "=== InFo Box ===\n\n❄️ Group Name: %1\n🧩 TID: %2\n🦋 Approve: %3\n💸 Emoji: %4\n🍳 Info : \n👻 %5 members and %6 admins.\n🤷‍♀️ Contains %7 male and %8 female.\n📩 Total messages: %9.",
        "validateContent": "〉Please enter content to change",
    }
}

var configBrother = process.cwd() + "/config/brotherList.json";
export async function onMessage({ event, api, Config, logger, Threads, Users, args, getText }) {
    const { threadID, senderID, messageID } = event;
    const prefix = (await Threads.getData(threadID)).prefix || Config['PREFIX'];
    const configPath = path.join(process.cwd() + '/config/configMain.json');
    const config = require(configPath);
    var threadInfo, img;
    var pathAva = process.cwd() + `/caches/` + Date.now() + '.png';
    switch (args[0]) {
        case 'info':
        case '-i': {
            if (!event.isGroup) return;
            try { threadInfo = await api.getThreadInfo(threadID) }
            catch (error) { return api.sendMessage(error.stack || error, threadID, messageID) }
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
                writeFileSync(pathAva, Buffer.from(img, "utf-8"));
            } catch (error) {
                return api.sendMessage(error.stack || error, threadID, messageID)
            }

            var threadName = threadInfo.threadName;
            var emoji = threadInfo.emoji;
            var memberLength = event.participantIDs.length;
            var adminIDs = threadInfo.adminIDs.length;
            var countMsg = threadInfo.messageCount;
            var nam = gendernam.length;
            var nu = gendernu.length;
            let sex = threadInfo.approvalMode;
            var pd = sex == false ? "tắt" : sex == true ? "bật" : "Kh";
            var msg = getText("boxInfo", threadName, threadID, pd, emoji, memberLength, adminIDs, nam, nu, countMsg);
            if (img) {
                return api.sendMessage({
                    body: msg,
                    attachment: createReadStream(pathAva)
                }, threadID, () => unlinkSync(pathAva), messageID);
            } else {
                return api.sendMessage(msg, threadID, messageID)
            }
        }

        case 'id': {
            return api.sendMessage(threadID, threadID);
        }

        case 'emoji':
        case 'icon': {
            try {
                if (!args[1]) return api.sendMessage(getText("validateContent"), threadID, messageID);
                const name = args[1] || event.messageReply.body;
                return await api.changeThreadEmoji(name, threadID)
            } catch (error) {
                return api.sendMessage(error.error, threadID, messageID)
            }
        }

        case 'name': {
            if (!event.isGroup) return;
            if (!args[1]) return api.sendMessage(getText("validateContent"), threadID, messageID);
            var content = args.join(" ");
            var newContent = content.slice(4, 99) || event.messageReply.body;
            try { return api.setTitle(newContent, threadID) }
            catch (error) { return api.sendMessage(error.error || error.message, threadID, messageID) }
            break;
        }

        case 'image':
        case 'img': {
            if (!event.isGroup) return;
            if (event.type !== "message_reply") return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", threadID, messageID);
            if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", threadID, messageID);
            if (event.messageReply.attachments.length > 1) return api.sendMessage(`Vui lòng reply chỉ một audio, video, ảnh!`, threadID, messageID);
            var callback = () => api.changeGroupImage(createReadStream(process.cwd() + "/caches/1.png"), threadID, () => unlinkSync(process.cwd() + "/caches/1.png"));
            return request(encodeURI(event.messageReply.attachments[0].url)).pipe(createWriteStream(process.cwd() + '/caches/1.png')).on('close', () => callback());
            break;
        }

        case "admin":
        case "ad": {
            if (!args[1]) return api.sendMessage(`» Vui lòng thêm các tag: [add/remove] [reply/tag] để thay đổi vai trò của người đó`, threadID, messageID);
            if (args[1] == 'add') {
                if (event.type == "message_reply") {
                    var uid = event.messageReply.senderID
                    var name = await Users.getData(uid).name;
                    api.changeAdminStatus(threadID, uid, true, editAdminsCallback)

                    function editAdminsCallback(err) {
                        if (err) return api.sendMessage("» Bot không đủ quyền hạn để thêm quản trị viên", threadID, messageID);
                        return api.sendMessage(`» Đã thêm ${name} làm quản trị viên nhóm`, threadID, messageID);
                    }
                }
                if (args.join().indexOf('@') !== -1) {
                    var mentions = Object.keys(event.mentions)
                    var name = await Users.getData(mentions).name
                    api.changeAdminStatus(threadID, mentions, true, editAdminsCallback)

                    function editAdminsCallback(err) {
                        if (err) return api.sendMessage("» Bot không đủ quyền hạn để thêm quản trị viên", threadID, messageID);
                        return api.sendMessage(`» Đã thêm ${name} làm quản trị viên nhóm`, threadID, messageID);
                    }
                } else return
            } else if (args[1] == 'rm' || args[1] == 'remove' || args[1] == 'del') {
                if (event.type == "message_reply") {
                    var uid = event.messageReply.senderID
                    var name = await Users.getData(uid).name
                    api.changeAdminStatus(threadID, uid, false, editAdminsCallback)

                    function editAdminsCallback(err) {
                        if (err) return api.sendMessage("» Bot không đủ quyền hạn để gỡ quản trị viên hoặc người dùng chưa là quản trị viên", threadID, messageID);
                        return api.sendMessage(`» Đã gỡ vai trò quản trị viên của ${name} `, threadID, messageID);
                    }
                }
                if (args.join().indexOf('@') !== -1) {
                    var mentions = Object.keys(event.mentions)
                    var name = await Users.getData(mentions).name
                    api.changeAdminStatus(threadID, mentions, false, editAdminsCallback)

                    function editAdminsCallback(err) {
                        if (err) return api.sendMessage("» Bot không đủ quyền hạn để gỡ quản trị viên hoặc người dùng chưa là quản trị viên", threadID, messageID);
                        return api.sendMessage(`» Đã gỡ vai trò quản trị viên của ${name} `, threadID, messageID);
                    }
                }
            }
            break;
        }
        //---> BOX ONLY <---//
        case "only": {
            //---> Do not reply no admin <---//
            if (senderID != Config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [ADMIN] Bạn không có quyền sử dụng "box only".`, threadID);
            //---> CODE <---//
            if (config.boxOnly != threadID) {
                config.boxOnly = threadID;
                api.sendMessage("» [BOX] Bật chế độ chỉ nhóm này mới có thể sử dụng bot.", threadID, messageID);
            } else {
                config.boxOnly = null;
                api.sendMessage("» [BOX] Tắt chế độ chỉ nhóm được duyệt mới có thể sử dụng bot.", threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        //---> LIST BOX ONLY <---//
        case "listonly":
        case "-lonly": {
            //---> Do not reply no admin <---//
            if (senderID != Config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [ADMIN] Bạn không có quyền sử dụng "box listonly".`, threadID);
            //---> CODE <---//
            const { brotherList } = global.client;
            if (brotherList.status == false) {
                brotherList.status = true;
                api.sendMessage("» [BOX ALL] Bật chế độ chỉ nhóm nhóm được duyệt mới có thể sử dụng bot.", threadID, messageID);
            } else {
                brotherList.status = false;
                api.sendMessage("» [BOX ALL] Tắt chế độ chỉ nhóm được duyệt mới có thể sử dụng bot.", threadID, messageID);
            }
            writeFileSync(configBrother, JSON.stringify(brotherList, null, 4), 'utf8');

            break;
        }
        //---> QTV BOX ONLY <---//
        case "onlyqtv":
        case "qtvonly": {
            const dataOfThread = (await Threads.getData(threadID)).data;
            var onlyQTV = dataOfThread.onlyQTV;
            if (!dataOfThread.onlyQTV) {
                dataOfThread.onlyQTV = false;
                await Threads.setData(threadID, { data: dataOfThread })
            }
            //---> Do not reply no listQTV <---//
            var idAD = [];
            var threadInfo = await api.getThreadInfo(threadID);
            var adminIDs = threadInfo.adminIDs;
            for (let i = 0; i < adminIDs.length; i++) {
                idAD.push(adminIDs[i].id);
            }
            const listAdmin = Config.ADMIN.find(item => item == senderID);
            const listQTV = idAD.find(item => item == senderID);

            if (!listAdmin && !listQTV) return api.sendMessage(`» [QTV] Bạn không được phép sử dụng lệnh "box qtvonly".`, threadID);

            //---> CODE <---//
            if (dataOfThread.onlyQTV == false) {
                dataOfThread.onlyQTV = true;
                Threads.setData(threadID, { data: dataOfThread });
                return api.sendMessage("» [QTV BOX] Bật chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot.", threadID, messageID);
            } else {
                dataOfThread.onlyQTV = false;
                Threads.setData(threadID, { data: dataOfThread });
                return api.sendMessage("» [QTV BOX] Tắt chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot.", threadID, messageID);
            }
            break;
        }
        //---> QTV All BOX ONLY <---//
        case "qtvonlyall":
        case "allqtvonly":
        case "onlyallqtv": {
            //---> Do not reply no listQTV <---//
            var idAD = [];
            var threadInfo = await api.getThreadInfo(threadID);
            var adminIDs = threadInfo.adminIDs;
            for (let i = 0; i < adminIDs.length; i++) {
                idAD.push(adminIDs[i].id);
            }
            const listAdmin = Config.ADMIN.find(item => item == senderID);
            if (!listAdmin) return api.sendMessage(`» [Admin] Bạn không được phép sử dụng lệnh "box onlyallqtv".`, threadID);
            //---> CODE <---//
            if (config.allQTVOnly == false) {
                config.allQTVOnly = true;
                api.sendMessage("» [QTV ALL BOX] Bật chế độ chỉ quản trị viên tất cả các nhóm mới có thể sử dụng bot.", threadID, messageID);
            } else {
                config.allQTVOnly = false;
                api.sendMessage("» [QTV ALL BOX] Tắt chế độ chỉ quản trị viên tất cả các nhóm mới có thể sử dụng bot.", threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        default:
            const _prefix = getText("default");
            let messageGetText = _prefix;
            messageGetText = _prefix
                .replace(/\{prefix}/g, prefix)

            const form = {
                body: messageGetText
            };

            return api.sendMessage(form, threadID, messageID);
    }
}
