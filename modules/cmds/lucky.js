'use strict';

export const config = {
    name: 'lucky',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Game đoán số may mắn từ 0 đến 10.',
    enDesc: 'Dice game from 0 to 10.',
    category: ['Game', 'Game'],
    usage: "[NUMBER]",
    timestamp: 0
};

export const languages = {
    "vi_VN": {
        "noMoney": "Bạn cần có ít nhất 500 đô để chơi game này.",
        "noNumber": "Không có số dự đoán.",
        "validNumber": "Vui lòng nhập một số từ 0 đến 10",
        "win": "Chúc mừng bạn đã đoán đúng số may mắn là: %1, bạn đã nhận được 5000 đô.",
        "lose": "Con số may mắn là: %1\n. Chúc bạn may mắn lần sau nhaaa !\n====Lưu ý====\nSau mỗi lần đoán sai, bạn sẽ bị trừ 500 đô, nếu bạn đúng bạn sẽ nhận lại 5000 đô."
    },
    "en_US": {
        "noMoney": "You need at least 500$ to play this game.",
        "noNumber": "No number to guess.",
        "validNumber": "Please enter a number from 0 to 10",
        "win": "Congratulations, you guessed the lucky number is: %1 and you received 200$.",
        "lose": "The lucky number is: %1\n. Good luck next time !\n====Note====\nAfter each wrong guess, you will be deducted 500$, if you are right you will receive 5000$."
    }
};

export async function onMessage({ event, api, Users, args , getText }) {
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    var data = await Users.getData(event.senderID) || {};
    var money = data.money || 0;
    var number = getRandomInt(0, 10);
    if (money < 500) api.sendMessage(getText('noMoney'), event.threadID, event.messageID)
    else {
        if (!args[0]) api.sendMessage(getText('noNumber'), event.threadID, event.messageID)
        else {
            if (args[0] > 10) api.sendMessage(getText('valiNumber'), event.threadID, event.messageID)
            else {
                if (args[0] == number) {
                    api.sendMessage(getText('win', number), event.threadID, () => Users.setData(event.senderID, { momey: money + 5000 }), event.messageID);
                } else api.sendMessage(getText('loss', number), event.threadID, () => Users.setData(event.senderID, { momey: money - 500 }), event.messageID);
            }
        }
    }
};