'use strict';
export const config = {
    name: 'coins',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Xem số tiền của bản thân.',
    enDesc: 'Check your money.',
    category: ['Tiền bạc', 'Economy'],
    usages: '',
    timestamp: 5
};

export const languages = {
    "vi_VN":{
        "getCoin": "〉Số tiền hiện tại của %1 là %2$",
        "getCoinDefault": "〉Số tiền hiện tại của bạn là %1$"
    },
    "en_US":{
        "getCoin": "〉The current amount of %1 is %2$",
        "getCoinDefault": "〉Your current amount is %1$"
    }
}

export async function onMessage({ event, api, Users, getText }) {
    let userData, money, mention;
    if (event.type == "message_reply") {
        userData = await Users.getData(event.messageReply.senderID);
        return api.sendMessage(getText("getCoin", userData.name, global.utils.currencyFormat(userData.money)), event.threadID, event.messageID);
    } else if (Object.keys(event.mentions).length != 0) {
        mention = Object.keys(event.mentions);
        userData = await Users.getData(mention);
        return api.sendMessage(getText("getCoin", userData.name, global.utils.currencyFormat(userData.money)), event.threadID, event.messageID);
    } else {
        userData = await Users.getData(event.senderID);
        return api.sendMessage(getText("getCoinDefault", global.utils.currencyFormat(userData.money)), event.threadID, event.messageID);
    }
}