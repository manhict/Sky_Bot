'use strict';
export const config = {
    name: 'antinickname',
    version: '1.0.0',
    author: ['Sky'],
    viDesc: '',
    enDesc: '',
    eventType: ["log:user-nickname"],
};
export const languages = {
    "vi_VN": {
        "message": "{userName} ",
    },
    "en_US": {
        "message": "{userName}",
    }
}
export async function onMessage({ event, api, Config, message, Threads, Users, getText }) {
    var { logMessageData, threadID, author, isGroup } = event;
    if(isGroup != true) return;
    var botID = api.getCurrentUserID();
    var { NAME, ADMIN } = Config;
    var nickname = NAME;
    if (logMessageData.participant_id == botID && author != botID && !ADMIN.includes(author) && logMessageData.nickname != nickname) {
        await api.changeNickname(nickname, threadID, botID)
            //var info = await Users.getData(author);
        return;
        api.sendMessage(`${info.name} - F`, threadID);
    }
}
