'use strict';
export const config = {
    name: 'daily',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Nhận quà báo danh hằng ngày.',
    enDesc: 'Daily reward',
    category: ['Tiền bạc', 'Economy'],
    timestamp: 5,
    envConfig: {
        rewardDay1: {
            coin: 100,
            exp: 10
        }
    }
};

export const languages = {
    "vi_VN":{
        "reportSucess": "〉Bạn đã nhận phần quà báo danh của ngày hôm nay rồi, vui lòng quay lại vào ngày mai",
        "receiveSucess": "〉Bạn đã nhận được %1 coin và %2 exp",
        "errData": "〉Đã xảy ra lỗi!"
    },
    "en_US":{
        "reportSucess": "〉You have received today's registration gift, please come back tomorrow",
         "receiveSucess": "〉You have received %1 coin and %2 exp",
         "errData": "〉An error occurred!"
    }
}

export async function onMessage({ event, api, Config, message, Threads, Users, args, getText }) {
    const reward = client.envConfig.envCommands[this.config.name].rewardDay1;
    const { senderID } = event;
    if (args[0] == "info") {
        let msg = "";
        for (let i = 1; i < 8; i++) {
            const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
            const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
            msg += `${i == 7 ? "Chủ Nhật" : "Thứ " + (i + 1)}: ${getCoin} coin và ${getExp} exp\n`;
        }
        return message.reply(msg);
    }

    const dateTime = global.utils.getTimeZone('date'); //* 10/10/2022
    const date = new Date();
    var current_day = date.getDay(); // Lấy số thứ tự của ngày hiện tại

    var userData = await Users.getData(senderID);
    var data = userData.data;
    if (!data.lastTimeGetReward) {
        data.lastTimeGetReward = null;
        await Users.setData(senderID, { data: data })
    }

    if (data.lastTimeGetReward === dateTime) return message.reply(getText("reportSucess"))
    var getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((current_day == 0 ? 7 : current_day) - 1));
    var getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((current_day == 0 ? 7 : current_day) - 1));

        userData.money = userData.money + getCoin,
        userData.exp = userData.exp + getExp,
        data.lastTimeGetReward = dateTime
    await Users.setData(senderID, { data: data }, (err, data) => {
        if (err) return message.reply(getText("errData"));
        message.reply(getText("receiveSucess",getCoin, getExp));
    });
}