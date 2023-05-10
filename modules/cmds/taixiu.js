'use strict';
export const config = {
    name: 'taixiu',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Chơi game tài xỉu.',
    enDesc: 'Play game taixiu',
    category: ["Game", "Game"],
    usages: "[tài/xỉu]",
    timestamp: 5
}

import * as fs from 'fs';
import axios from 'axios';

export const languages = {
    "vi_VN": {
        "validaMoney": "〉Bạn phải cược tài hoặc xỉu...",
        "onlyTaiXiu": "〉Bạn chỉ có thể cược tài hoặc xỉu...",
        "validateMoney": "〉Mức đặt cược của bạn không phù hợp hoặc dưới 50$!!!",
        "nôMoney": "〉Số dư bạn không đủ %1 để có thể chơi`",
        "win": "「Tai Xiu」\n\nBạn đã thắng \nĐược: %1$\nKết quả: %2 %3",
        "lose": "「Tai Xiu」\n\nBạn đã thua\nMất: %1$\nKết quả: %2 %3"
    },
    "en_US": {
        "validaMoney": "〉You must bet over or under...",
        "onlyTaiXiu": "〉You can only bet over or under...",
        "validateMoney": "〉Your bet level is not suitable or less than 50$!!!",
        "nowMoney": "〉Your balance is not enough %1 to be able to play`",
        "win": "「Tai Xiu」\n\nYou won \nGot: %1$\nResult: %2 %3",
        "lose": "「Tai Xiu」\n\nYou lost\nLost: %1$\nResult: %2 %3"
    }
}

export async function onMessage({ api, event, args, Users, getText }) {
    const { senderID, messageID, threadID } = event;
    const dataMoney = await Users.getData(senderID);
    const moneyUser = dataMoney.money;
    if (!args[0]) return api.sendMessage(getText("validateMoney"), threadID, messageID);
    const choose = args[0]
    if (choose.toLowerCase() != 'tài' && choose.toLowerCase() != 'xỉu') return api.sendMessage(getText("onlyTaixiu"), threadID, messageID)
    const money = parseInt(args[1]);
    if (money < 50 || isNaN(money)) return api.sendMessage(getText("validateMoney"), threadID, messageID);
    if (moneyUser < money) return api.sendMessage(getText("noMoney", money), threadID, messageID);
    try {
        const data = await api.gameTaixiuV1();
        console.log(data)
        const ketqua = data.total;
        const images = [];
        const result = data.result;
        for (var i in data.images) {
            let path = process.cwd() + `/caches/${i}.png`;
            let imgs = (await axios.get(`${data.images[i]}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(path, Buffer.from(imgs, "utf-8"));
            images.push(fs.createReadStream(path));
        }
        if (choose == result) {
            await Users.setData(senderID, { money: moneyUser + parseInt(money) });
            return api.sendMessage({
                attachment: images,
                body: getText("win", moneyUser, result, ketqua)
            }, threadID, messageID);
        } else {
            await Users.setData(senderID, { money: moneyUser - parseInt(money) });
            api.sendMessage({
                attachment: images,
                body: getText("lose", moneyUser, result, ketqua)
            }, threadID, messageID);
            for (let i = 0; i < images.length; i++) {
                fs.unlinkSync(process.cwd() + `/caches/${i}.png`);
            }
        }
    } catch (err) {
        console.log(err.stack);
        return api.sendMessage(err.message, event.threadID);
    }
}