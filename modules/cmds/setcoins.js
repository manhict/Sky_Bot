'use strict';
export const config = {
    name: 'setcoins',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Set coins.',
    enDesc: 'Set coins.',
    category: ['Tiền bạc', 'Economy'],
    usages: '',
    timestamp: 5
};
export async function onMessage({ event, api, Users, args }) {
    const { threadID, messageID, senderID } = event;
    const mentionID = Object.keys(event.mentions);
    const coins = parseInt(args[1]);
    var message = [];
    var error = [];

    switch (args[0]) {
        case "add": {
            if (mentionID.length != 0) {
                for (singleID of mentionID) {
                    if (!coins || isNaN(coins)) return api.sendMessage('Phải là số', threadID, messageID);
                    try {
                        let money = (await Users.setData(singleID)).money;
                        await Users.setData(singleID, { money: money + coins });
                        message.push(singleID);
                    } catch (e) {
                        error.push(e);
                        console.log(e)
                    };
                }
                return api.sendMessage(`[Coins] Đã cộng thêm ${coins} cho ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[Error] Không thể thể cộng thêm tiền cho ${error.length} người!`, threadID) }, messageID);
            } else {
                if (!coins || isNaN(coins)) return api.sendMessage('Phải là số', threadID, messageID);
                try {
                    let money = (await Users.getData(senderID)).money;
                    await Users.setData(senderID, { money: money + coins });
                    message.push(senderID);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[Coins] Đã cộng thêm ${coins} cho bản thân`, threadID, function () { if (error.length != 0) return api.sendMessage(`[Error] Không thể thể cộng thêm tiền cho bản thân!`, threadID) }, messageID);
            }
        }
        case "set":
        case "me": {
            if (mentionID.length != 0) {
                for (singleID of mentionID) {
                    if (!coins || isNaN(coins)) return api.sendMessage('Phải là số', threadID, messageID);
                    try {
                        await Users.setData(singleID, { money: coins });
                        message.push(singleID);
                    } catch (e) { error.push(e) };
                }
                return api.sendMessage(`[Coins] Đã set thành công ${coins} cho ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[Error] Không thể set tiền cho ${error.length} người!`, threadID) }, messageID);
            } else if (args[2]) {
                if (!coins || isNaN(coins)) return api.sendMessage('Phải là số', threadID, messageID);
                try {
                    await Users.setData(args[2], { money: coins });
                    message.push(args[2]);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[Coins] Đã set thành công ${coins} cho ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[Error] Không thể set tiền cho ${error.length} người!`, threadID) }, messageID);
            } else {
                if (!coins || isNaN(coins)) return api.sendMessage('Phải là số', threadID, messageID);
                try {
                    await Users.setData(senderID, { money: coins });
                    message.push(senderID);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[Coins] Đã set thành công ${coins} cho bản thân`, threadID, function () { if (error.length != 0) return api.sendMessage(`[Error] Không thể set tiền cho bản thân!`, threadID) }, messageID);
            }
        }
        case "clean":
        case "reset": {
            if (mentionID.length != 0) {
                for (singleID of mentionID) {
                    try {
                        await Users.setData(singleID, { money: '0' });
                        message.push(singleID);
                    } catch (e) { error.push(e) };
                }
                return api.sendMessage(`[Coins] Đã xóa thành công toàn bộ tiền của ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`[Error] Không thể xóa toàn bộ tiền của ${error.length} người!`, threadID) }, messageID);
            } else {
                try {
                    await Users.setData(senderID, { money: '0' });
                    message.push(senderID);
                } catch (e) { error.push(e) };
                return api.sendMessage(`[Coins] Đã xóa thành công tiền của cho bản thân`, threadID, function () { if (error.length != 0) return api.sendMessage(`[Error] Không thể xóa toàn bộ tiền của bản thân!`, threadID) }, messageID);
            }
        }
        default: {
            return api.sendMessage(`HD: Comming soon...`, threadID, messageID);
        }
    }
}