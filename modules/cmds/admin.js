'use strict';
export const config = {
    name: 'admin',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Quản lý quản trị bot [list/add/remove].',
    enDesc: 'Manage bot admin [list/add/remove].',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 0
}

export const languages = {
    "vi_VN": {
        "listAdmin": "〉==[HELP]==\n\n1. %1admin list/all -> Xem danh sách admin bot\n2. %1admin help -> Hướng dẫn admin bot",
        "helpAdmin": "〉==[HELP]==\n\n1. %1admin add -> SUPER ADMIN ADD\n2. %1admin exadd -> ASSISTANT ADMIN ADD \n3. %1admin remove/rm -> SUPER ADMIN REMOVE\n4. %1admin exrm -> ASSISTANT ADMIN REMOVE\n5. %1admin only -> ADMIN ONLY\n6. %1admin paonly/-pa -> PERSONAL ONLY\n7. %1admin onlybox/boxonly -> BOX ONLY\n8. %1admin onlyqtvbox/qtvboxonly -> QTV BOX ONLY\n9. %1admin allqtvonly/qtvonlyall -> QTV ALL BOX ONLY\n10. %1admin listboxonly -> ALL BOX ONLY"
    },
    "en_US": {
        "listAdmin": "〉==[HELP]==\n\n1. %1admin list/all -> View list of admin bots\n2. %1admin help -> Guide to admin bot",
        "helpAdmin": "〉==[HELP]==\n\n1. %1admin add -> SUPER ADMIN ADD\n2. %1admin exadd -> ASSISTANT ADMIN ADD \n3. %1admin remove/rm -> SUPER ADMIN REMOVE\n4. % 1admin exrm -> ASSISTANT ADMIN REMOVE\n5. %1admin only -> ADMIN ONLY\n6. %1admin paonly/-pa -> PERSONAL ONLY\n7. %1admin onlybox/boxonly -> BOX ONLY\n8. %1admin onlyqtvbox/qtvboxonly -> QTV BOX ONLY\n9. %1admin allqtvonly/qtvonlyall -> QTV ALL BOX ONLY\n10. %1admin listboxonly -> ALL BOX ONLY"
    }
}

import { createReadStream, statSync, writeFileSync, readdirSync, unlinkSync } from 'fs'
import path from 'path';
import { createRequire } from "module"
const require = createRequire(import.meta.url)

const configPath = path.join(process.cwd() + '/config/configMain.json');

export async function onMessage({ event, api, message, Threads, args, Users, Config, getText }) {
    const { threadID, senderID, messageID, mentions } = event;
    const prefix = (await Threads.getData(threadID)).prefix || Config['PREFIX'];
    const { ADMIN, EXCEPTION } = Config;
    const listAdmin = ADMIN || [], listException = EXCEPTION || [];

    const config = require(configPath);
    const idadmin = args.slice(1, args.length);
    const mention = Object.keys(mentions);
    var msgAdmin = [],
        msgException = [],
        message = [],
        listSuccess = [],
        listFail = [],
        i = 1, a = 1, b = 1;
    switch (args[0]) {
        ///---> ADMIN LIST <---///
        case 'list':
        case 'all':
        case '-l': {
            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const dataUser = await Users.getData(idAdmin);
                    const nameUser = dataUser.name;
                    const vanity = dataUser.vanity || idAdmin;
                    const linkUrl = `Fb.com/${vanity}`;
                    msgAdmin += `${i++}. » ${nameUser}\n- Link: ${linkUrl}\n`
                }
            }
            message += `===『SUPER ADMIN』===\n\n${msgAdmin}\n`
            for (const idException of listException) {
                if (parseInt(idException)) {
                    const name = (await Users.getData(idException)).name;
                    msgException.push(`${a++}. » ${idException}\n`);
                }
            }
            if (msgException.length > 0) { message += `=== ASSISTANT ADMIN ===\n\n${msgException.join("")}\n` };
            return api.sendMessage(message, threadID, messageID);
        }
        ///////// ADD SUPER ADMIN //////////
        case "add": {
            //---> Do not reply no admin <---//
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [Admin] Bạn không có quyền sử dụng "admin add".`, threadID);
            ///// REPLY ////
            if (event.type == "message_reply") {
                if (listAdmin.indexOf(event.messageReply.senderID) != -1)
                    return api.sendMessage('» Người này là quản trị viên bot!!!', threadID, messageID)
                var idAD = event.messageReply.senderID;
                config.ADMIN.push(idAD);
                const name = (await Users.getData(idAD)).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[ ADMIN ADD ]\n» Uid: ${idAD}\n» Name: ${name}`, threadID, messageID);
            }
            ///// TAG ////
            else if (mention.length != 0 && isNaN(idadmin[0])) {
                for (const id of mention) {
                    const name = (await Users.getData(id)).name;
                    if (listAdmin.indexOf(id) != -1) {
                        var lengthID = id.length
                        listFail.push(`[ FAIL ]\n» Uid: ${id}\n» Name: ${name}\n`);

                    } else if (!listAdmin.indexOf(id) != -1) {
                        config.ADMIN.push(id);
                        listSuccess.push(`[ SUPER ADMIN ADD ]\n\n» Uid: ${id}\n» Name: ${name}\n`);
                    }
                    if (listFail.length > 0) { message += `=== FAILURE ===\n${listFail.join("")}\n` };
                    message = '=== SUCCESS ===\n\n' + listSuccess;
                };
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(message, threadID, messageID);
            }
            ///// INPUT ID ////
            else if (idadmin.length != 0 && !isNaN(idadmin[0])) {
                if (listAdmin.indexOf(idadmin[0]) != -1)
                    return api.sendMessage('» Người này là quản trị viên bot!!!', threadID, messageID)
                config.ADMIN.push(idadmin[0]);
                const name = (await Users.getData(idadmin[0])).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[ SUPER ADMIN ADD ]\n\n» Uid: ${idadmin[0]}\n» Name: ${name}\n`, threadID, messageID);
            } else return api.sendMessage(`» Vui lòng nhập ID, Trả lời hoặc gắn thẻ ai đó cần thêm quyền quản trị bot!!!`, threadID, messageID);
        }
        ///////// ADD ASSISTANT //////////
        case "exadd":
        case "addex": {
            //---> Do not reply no admin <---//
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [Admin] Bạn không có quyền sử dụng "admin exadd".`, threadID);
            ///// REPLY ////
            if (event.type == "message_reply") {
                if (listException.indexOf(event.messageReply.senderID) != -1)
                    return api.sendMessage('» Người này là quản trị viên bot!!!', threadID, messageID)
                var idAD = event.messageReply.senderID;
                config.EXCEPTION.push(idAD);
                const name = (await Users.getData(idAD)).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[ ASSISTANT ADMIN ADD ]\n\n» Uid: ${idAD}\n» Name: ${name}`, threadID, messageID);
            }
            ///// TAG ////
            else if (mention.length != 0 && isNaN(idadmin[0])) {
                for (const id of mention) {
                    const name = (await Users.getData(id)).name;
                    if (listException.indexOf(id) != -1) {
                        var lengthID = id.length
                        listFail.push(`[ FAIL ]\n» Uid: ${id}\n» Name: ${name}\n`);

                    } else if (!listException.indexOf(id) != -1) {
                        config.EXCEPTION.push(id);
                        listSuccess.push(`[ ASSISTANT ADMIN ADD ]\n\n» Uid: ${id}\n» Name: ${name}\n`);
                    }
                    if (listFail.length > 0) { message += `=== FAILURE ===\n${listFail.join("")}\n` };
                    message = '=== SUCCESS ===\n\n' + listSuccess;
                };
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(message, threadID, messageID);
            }
            ///// INPUT ID ////
            else if (idadmin.length != 0 && !isNaN(idadmin[0])) {
                if (listException.indexOf(idadmin[0]) != -1)
                    return api.sendMessage('» Người này là quản trị viên bot!!!', threadID, messageID)
                config.EXCEPTION.push(idadmin[0]);
                const name = (await Users.getData(idadmin[0])).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[ ASSISTANT ADMIN ADD ]\n\n» Uid: ${idadmin[0]}\n» Name: ${name}\n`, threadID, messageID);
            } else return api.sendMessage(`» Vui lòng nhập ID, Reply hoặc tag ai đó cần thêm quyền quản trị bot !!!`, threadID, messageID);
        }
        ///////// DELETE SUPER ADMIN //////////
        case "remove":
        case "rm": {
            //---> Do not reply no admin <---//
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [Admin] Bạn không có quyền sử dụng "admin remove".`, threadID);
            ///// REPLY ////
            if (event.type == "message_reply") {
                if (listAdmin.indexOf(event.messageReply.senderID) != -1) {
                    var idAD = event.messageReply.senderID
                    const data = config.ADMIN.findIndex(i => i.toString() == idAD);
                    ADMIN.splice(data, 1);
                    config.ADMIN.splice(data, 1);
                    const name = (await Users.getData(idAD)).name;
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(`[ SUPER ADMIN REMOVE ]\n\n» Uid: ${idAD}\n» Name: ${name}\n`, threadID, messageID);
                } else return api.sendMessage('» Người này không phải là quản trị viên bot !!!', threadID, messageID)
            }
            ///// TAG ////
            else if (mentions.length != 0 && isNaN(idadmin[0])) {
                const mention = Object.keys(mentions);
                for (const id of mention) {
                    const name = (await Users.getData(id)).name;
                    if (listAdmin.indexOf(id) != -1) {
                        const data = config.ADMIN.findIndex(i => i == id);
                        ADMIN.splice(data, 1);
                        config.ADMIN.splice(data, 1);
                        listSuccess.push(`[ SUPER ADMIN REMOVE ]\n\n» Uid: ${id}\n» Name: ${name}\n`);
                    } else {
                        var lengthID = id.length
                        listFail.push(`[ FAIL ]\n» Uid: ${id}\n» Name: ${name}\n`);
                    }
                };
                if (listFail.length > 0) { message += `=== FAILURE ===\n${listFail.join("")}\n` };
                message = '=== SUCCESS ===\n\n' + listSuccess;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(message, threadID, messageID);
            }
            ///// INPUT ID ////
            else if (idadmin.length != 0 && !isNaN(idadmin[0])) {
                if (listAdmin.indexOf(idadmin[0]) != -1) {
                    const data = config.ADMIN.findIndex(i => i.toString() == idadmin[0]);
                    ADMIN.splice(data, 1);
                    config.ADMIN.splice(data, 1);
                    const name = (await Users.getData(idadmin[0])).name;
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(`[ SUPER ADMIN REMOVE ]\n\n» Uid: ${idadmin[0]}\n» Name: ${name}`, threadID, messageID);
                } else return api.sendMessage('» Người này không phải là quản trị viên bot!!!', threadID, messageID)
            } else return api.sendMessage(`» Vui lòng nhập ID, Reply hoặc tag người cần xóa quyền quản trị bot!!!`, threadID, messageID);
        }
        ///////// DELETE ASSISTANT //////////
        case "removeex":
        case "rmex":
        case "exrm": {
            //---> Do not reply no admin <---//
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [Admin] Bạn không có quyền sử dụng "xóa quản trị viên".`, threadID);
            ///// REPLY ////
            if (event.type == "message_reply") {
                if (listException.indexOf(event.messageReply.senderID) != -1) {
                    var idAD = event.messageReply.senderID
                    const data = config.EXCEPTION.findIndex(i => i.toString() == idAD);
                    EXCEPTION.splice(data, 1);
                    config.EXCEPTION.splice(data, 1);
                    const name = (await Users.getData(idAD)).name;
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(`[ ASSISTANT ADMIN REMOVE ]\n\n» Uid: ${idAD}\n» Name: ${name}\n`, threadID, messageID);
                } else return api.sendMessage('» Người này không phải là quản trị viên bot!!!', threadID, messageID)
            }
            ///// TAG ////
            else if (mentions.length != 0 && isNaN(idadmin[0])) {
                const mention = Object.keys(mentions);
                for (const id of mention) {
                    const name = (await Users.getData(id)).name;
                    if (listException.indexOf(id) != -1) {
                        const data = config.EXCEPTION.findIndex(i => i == id);
                        EXCEPTION.splice(data, 1);
                        config.EXCEPTION.splice(data, 1);
                        listSuccess.push(`[ ASSISTANT ADMIN REMOVE ]\n\n» Uid: ${id}\n» Name: ${name}\n`);
                    } else {
                        var lengthID = id.length
                        listFail.push(`[ FAIL ]\n» Uid: ${id}\n» Name: ${name}\n`);
                    }
                };
                if (listFail.length > 0) { message += `=== FAILURE ===\n${listFail.join("")}\n` };
                message = '=== SUCCESS ===\n\n' + listSuccess;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(message, threadID, messageID);
            }
            ///// INPUT ID ////
            else if (idadmin.length != 0 && !isNaN(idadmin[0])) {
                if (listException.indexOf(idadmin[0]) != -1) {
                    const data = config.EXCEPTION.findIndex(i => i.toString() == idadmin[0]);
                    EXCEPTION.splice(data, 1);
                    config.EXCEPTION.splice(data, 1);
                    const name = (await Users.getData(idadmin[0])).name;
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(`[ ASSISTANT ADMIN REMOVE ]\n\n» Uid: ${idadmin[0]}\n» Name: ${name}`, threadID, messageID);
                } else return api.sendMessage('» Người này không phải là quản trị viên bot !!!', threadID, messageID)
            } else return api.sendMessage(`» Vui lòng điền ID, Reply hoặc tag người cần xóa quyền quản trị bot !!!`, threadID, messageID);
        }
        //---> ADMIN ONLY <---//
        case "only": {
            //---> Do not reply no admin <---//
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [ADMIN] Bạn không có quyền sử dụng "admin only".`, threadID);
            //---> CODE <---//
            if (config.adminOnly == false) {
                config.adminOnly = true;
                api.sendMessage("» Đã bật chế độ chỉ người điều hành mới có thể sử dụng bot.", threadID, messageID);
            } else {
                config.adminOnly = false;
                api.sendMessage("» Đã vô hiệu hóa chế độ chỉ người điều hành mới có thể sử dụng bot.", threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        //---> PERSONAL ONLY <---//
        case "personalonly":
        case "paonly":
        case "-pa": {
            //---> Do not reply no admin <---//
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [ADMIN] Bạn không có quyền sử dụng "admin paonly".`, threadID);
            //---> CODE <---//
            if (config.personalOnly == false) {
                config.personalOnly = true;
                api.sendMessage("» Bật chế độ chỉ người điều hành mới có thể trò chuyện trực tiếp với bot.", threadID, messageID);
            } else {
                config.personalOnly = false;
                api.sendMessage("» Tắt chế độ chỉ người điều hành mới có thể trò chuyện trực tiếp với bot.", threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        //---> BOX ONLY <---//
        //---> BOX ONLY <---//
        case "only": {
            //---> Do not reply no admin <---//
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [ADMIN] Bạn không có quyền sử dụng "box only".`, threadID);
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
            if (senderID != config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [ADMIN] Bạn không có quyền sử dụng "box listonly".`, threadID);
            //---> CODE <---//
            const idThreadOnly = config.listBoxOnly.threadID.find(item => item == threadID)
            if (config.listBoxOnly.status == false) {
                config.listBoxOnly.status = true;
                api.sendMessage("» [BOX ALL] Bật chế độ chỉ nhóm nhóm được duyệt mới có thể sử dụng bot.", threadID, messageID);
            } else {
                const tid = event.threadID;
                const isIDonly = config.listBoxOnly.threadID.findIndex(i => i == threadID);
                console.log(idThreadOnly)
                config.listBoxOnly.status = false;
                api.sendMessage("» [BOX ALL] Tắt chế độ chỉ nhóm được duyệt mới có thể sử dụng bot.", threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        //---> QTV BOX ONLY <---//
        case "onlyqtv":
        case "qtvonly": {
            if (event.threadID != event.senderID) {
                const dataOfThread = (await Threads.getData(event.threadID)).data;
                var onlyQTV = dataOfThread.onlyQTV;
                if (!dataOfThread.onlyQTV) {
                    dataOfThread.onlyQTV = false;
                    await Threads.setData(event.threadID, { data: dataOfThread })
                }
            }
            //---> Do not reply no listQTV <---//
            var idAD = [];
            var threadInfo = await api.getThreadInfo(event.threadID);
            var adminIDs = threadInfo.adminIDs;
            for (let i = 0; i < adminIDs.length; i++) {
                idAD.push(adminIDs[i].id);
            }
            const listAdmin = config.ADMIN.find(item => item == senderID);
            const listQTV = idAD.find(item => item == senderID);

            if (!listAdmin && !listQTV) return api.sendMessage(`» [QTV] Bạn không được phép sử dụng lệnh "box qtvonly".`, threadID);

            //---> CODE <---//
            var dataOfThread = (await Threads.getData(threadID)).data;
            if (dataOfThread.onlyQTV == false) {
                dataOfThread.onlyQTV = true;
                Threads.setData(threadID, { data: dataOfThread });
                return api.sendMessage("» [QTV BOX] Bật chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot.", threadID, messageID);
            } else {
                dataOfThread.onlyQTV = false;
                Threads.setData(threadID, { data: dataOfThread });
                return api.sendMessage("» [QTV BOX] Tắt chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot.", threadID, messageID);
            }
        }
        //---> QTV All BOX ONLY <---//
        case "qtvonlyall":
        case "allqtvonly":
        case "onlyallqtv": {
            //---> Do not reply no listQTV <---//
            var idAD = [];
            var threadInfo = await api.getThreadInfo(event.threadID);
            var adminIDs = threadInfo.adminIDs;
            for (let i = 0; i < adminIDs.length; i++) {
                idAD.push(adminIDs[i].id);
            }
            const listAdmin = config.ADMIN.find(item => item == senderID);
            const listQTV = idAD.find(item => item == senderID);

            if (!listAdmin && !listQTV) return api.sendMessage(`» [QTV] Bạn không được phép sử dụng lệnh "box onlyallqtv".`, threadID);
            //---> CODE <---//
            if (config.allQTVOnly == false) {
                config.allQTVOnly = true;
                api.sendMessage("» [QTV ALL BOX] Bật chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot.", threadID, messageID);
            } else {
                config.allQTVOnly = false;
                api.sendMessage("» [QTV ALL BOX] Tắt chế độ chỉ quản trị viên nhóm mới có thể sử dụng bot.", threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        case "help": {
            return api.sendMessage(getText('helpAdmin', prefix), threadID);
        }
        //// DEFAULT ////
        default: {
            return api.sendMessage(getText('listAdmin', prefix), threadID);
        }
    }
}